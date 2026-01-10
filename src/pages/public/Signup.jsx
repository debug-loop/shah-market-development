import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/signup-choice');
  }, [navigate]);
  return null;
}
