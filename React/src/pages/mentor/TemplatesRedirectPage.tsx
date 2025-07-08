
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TemplatesRedirectPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the unified plano de contas page
    navigate('/mentor/plano-contas', { replace: true });
  }, [navigate]);

  return null;
}
