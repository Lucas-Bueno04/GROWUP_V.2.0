
-- 1. Verificar se existe um trigger para criar perfis automaticamente
-- Se não existir, vamos criá-lo

-- Primeiro, vamos criar uma função para lidar com novos usuários
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, email, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'name', 'Usuário'), 
    NEW.email,
    'aluno'
  )
  ON CONFLICT (id) DO UPDATE SET
    nome = COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'name', profiles.nome),
    email = NEW.email,
    updated_at = now();
  RETURN NEW;
END;
$$;

-- Criar o trigger se não existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Criar perfis para usuários autenticados que não têm perfil
-- Isso vai criar perfis para usuários existentes que não têm registro na tabela profiles
INSERT INTO public.profiles (id, nome, email, role)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'nome', au.raw_user_meta_data->>'name', 'Usuário'),
  au.email,
  'aluno'
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
WHERE p.id IS NULL
AND au.email IS NOT NULL
ON CONFLICT (id) DO NOTHING;

-- 3. Garantir que todos os usuários tenham role definida
UPDATE public.profiles 
SET role = 'aluno' 
WHERE role IS NULL;
