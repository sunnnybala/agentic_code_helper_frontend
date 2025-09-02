import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function GoogleSignInButton() {
  const { loginWithGoogle } = useAuth();

  useEffect(() => {
    if (!window.google || !window.google.accounts || !import.meta.env.VITE_GOOGLE_CLIENT_ID) return;
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        if (!response?.credential) return;
        await loginWithGoogle(response.credential);
      }
    });
    window.google.accounts.id.renderButton(document.getElementById('google-btn'), { theme: 'outline', size: 'large' });
  }, [loginWithGoogle]);

  return <div id="google-btn"></div>;
}


