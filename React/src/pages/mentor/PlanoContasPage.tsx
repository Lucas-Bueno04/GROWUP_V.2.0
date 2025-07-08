
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PlanoContasPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new unified page
    navigate('/mentor/plano-contas', { replace: true });
  }, [navigate]);

  return null;
}
