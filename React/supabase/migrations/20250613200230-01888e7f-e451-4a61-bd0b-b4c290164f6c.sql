
-- Fix the circular dependency by making security definer functions bypass RLS
-- This allows them to access the profiles table without triggering the same policies

-- Update the is_mentor_optimized function to bypass RLS
CREATE OR REPLACE FUNCTION public.is_mentor_optimized(user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = public
AS $function$
  -- Bypass RLS by using a direct query with elevated privileges
  SELECT COALESCE((
    SELECT role = 'mentor' 
    FROM public.profiles 
    WHERE id = user_id
    LIMIT 1
  ), false);
$function$;

-- Update the get_current_user_role function to bypass RLS
CREATE OR REPLACE FUNCTION public.get_current_user_role()
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = public
AS $function$
  -- Bypass RLS by using a direct query with elevated privileges
  SELECT COALESCE(role::text, 'aluno') 
  FROM public.profiles 
  WHERE id = auth.uid()
  LIMIT 1;
$function$;

-- Update the get_user_role_optimized function to bypass RLS
CREATE OR REPLACE FUNCTION public.get_user_role_optimized(user_id uuid)
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = public
AS $function$
  -- Bypass RLS by using a direct query with elevated privileges
  SELECT COALESCE(role::text, 'aluno') 
  FROM public.profiles 
  WHERE id = user_id
  LIMIT 1;
$function$;

-- Create or update RLS policies for the profiles table to be more specific
-- Remove any existing policies that might cause conflicts
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create new, more specific policies for profiles table
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (id = auth.uid());
