/**
 * @fileoverview Authentication and User Session Page.
 * Implements Login, Registration, and Google OAuth integration.
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Extend global Window interface to support Google accounts library.
 */
declare global {
  interface Window {
    google: any;
  }
}

/**
 * User Page component.
 * Manages the auth state transition, input validation, and password strength estimation.
 */
export const User = () => {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  /**
   * Effect: Initializes the Google Identity Services SDK and renders the login button.
   */
  useEffect(() => {
    /* global google */
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

    const handleGoogleResponse = async (response: any) => {
      try {
        const res = await fetch(`${API_URL}/users/google-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken: response.credential })
        });
        
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.message || 'Google Login failed');

        // Persist session and redirect
        localStorage.setItem('user', JSON.stringify(data.data));
        setSuccess('Google Login successful!');
        setTimeout(() => window.location.href = '/', 1500);
      } catch (err: any) {
        setError(err.message);
      }
    };

    const initGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: '222452005310-v7id7pfe0h5i1rlt1h896qu9v2cohvrf.apps.googleusercontent.com',
          callback: handleGoogleResponse
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-btn'),
          { theme: 'outline', size: 'large', width: 400 }
        );
      } else {
        setTimeout(initGoogle, 500); // Retry polling if script is still loading
      }
    };

    initGoogle();
  }, []);

  /**
   * Calculates a password strength score (0-4).
   * @param {string} pass - The password string to evaluate.
   */
  const calculateStrength = (pass: string) => {
    let strength = 0;
    if (pass.length > 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    return strength;
  };

  /**
   * Effect: Updates strength indicator whenever the password field changes.
   */
  useEffect(() => {
    setPasswordStrength(calculateStrength(formData.password));
  }, [formData.password]);

  /**
   * Handles generic input field updates.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  /**
   * Submits the authentication form.
   * Performs strict validation for new registrations.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Strict Client-Side Validations
    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        setError(t('AUTH.ERRORS.MATCH'));
        return;
      }
      if (passwordStrength < 3) {
        setError(t('AUTH.ERRORS.STRICT'));
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError(t('AUTH.ERRORS.EMAIL'));
        return;
      }
    }

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    const url = isLogin ? `${API_URL}/users/login` : `${API_URL}/users/register`;
    const body = isLogin 
      ? { email: formData.email, password: formData.password }
      : { name: formData.name, email: formData.email, password: formData.password };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text || `Request failed with status ${res.status}`);
      }

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Successful Auth: store user data and redirect
      localStorage.setItem('user', JSON.stringify(data.data));
      setSuccess(isLogin ? 'Login successful!' : 'Account created successfully!');
      
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);

    } catch (err: any) {
      setError(err.message);
    }
  };

  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="max-w-md mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[80vh]">
      <div className="brutalist-card bg-cyan-400 dark:bg-indigo-800 p-8 w-full transition-all shadow-[16px_16px_0_0_rgba(0,0,0,1)] dark:shadow-[16px_16px_0_0_rgba(255,255,255,1)]">
        <h1 className="text-4xl font-black mb-6 uppercase text-center text-black dark:text-white">
          {isLogin ? t('AUTH.LOGIN') : t('AUTH.SIGNUP')}
        </h1>
        
        {/* Flash Messages */}
        {error && (
          <div className="bg-red-400 border-4 border-black p-3 mb-6 font-bold text-black text-center animate-bounce">
            ERROR: {error}
          </div>
        )}

        {success && (
          <div className="bg-green-400 border-4 border-black p-3 mb-6 font-bold text-black text-center">
            SUCCESS: {success}
          </div>
        )}

        {/* Auth Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label className="block font-bold mb-1 text-black dark:text-white uppercase text-xs">{t('AUTH.FULL_NAME')}</label>
              <input 
                name="name"
                type="text" 
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="John Doe" 
                className="w-full border-4 border-black p-3 font-bold text-black focus:outline-none focus:ring-4 focus:ring-white" 
              />
            </div>
          )}
          <div>
            <label className="block font-bold mb-1 text-black dark:text-white uppercase text-xs">{t('AUTH.EMAIL')}</label>
            <input 
              name="email"
              type="email" 
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="email@example.com" 
              className="w-full border-4 border-black p-3 font-bold text-black focus:outline-none focus:ring-4 focus:ring-white" 
            />
          </div>
          <div>
            <label className="block font-bold mb-1 text-black dark:text-white uppercase text-xs">{t('AUTH.PASSWORD')}</label>
            <input 
              name="password"
              type="password" 
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="••••••••" 
              className="w-full border-4 border-black p-3 font-bold text-black focus:outline-none focus:ring-4 focus:ring-white" 
            />
            {/* Password Strength Indicator (Signup only) */}
            {!isLogin && (
              <div className="mt-2 space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-black uppercase">{t('AUTH.STRENGTH')}</span>
                  <span className="text-[10px] font-black uppercase">{strengthLabels[passwordStrength - 1] || '...'}</span>
                </div>
                <div className="h-3 border-2 border-black bg-white flex overflow-hidden">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`flex-grow h-full border-r border-black last:border-0 transition-colors ${
                        i < passwordStrength ? strengthColors[passwordStrength - 1] : ''
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[9px] font-bold leading-tight opacity-70">{t('AUTH.REQUIREMENTS')}</p>
              </div>
            )}
          </div>
          {!isLogin && (
            <div>
              <label className="block font-bold mb-1 text-black dark:text-white uppercase text-xs">{t('AUTH.CONFIRM_PASSWORD')}</label>
              <input 
                name="confirmPassword"
                type="password" 
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                placeholder="••••••••" 
                className="w-full border-4 border-black p-3 font-bold text-black focus:outline-none focus:ring-4 focus:ring-white" 
              />
            </div>
          )}
          
          <button type="submit" className="brutalist-button w-full text-xl py-4 mt-4 uppercase">
            {isLogin ? t('AUTH.ENTER') : t('AUTH.CREATE_ACCOUNT')}
          </button>
        </form>

        {/* Separator */}
        <div className="my-6 flex items-center gap-4">
          <div className="flex-grow h-1 bg-black dark:bg-white opacity-20"></div>
          <span className="font-bold text-xs uppercase opacity-50">OR</span>
          <div className="flex-grow h-1 bg-black dark:bg-white opacity-20"></div>
        </div>

        {/* Social Login Area */}
        <div id="google-btn" className="w-full"></div>

        {/* Mode Switcher */}
        <div className="mt-6 text-center">
          <p className="font-bold text-black dark:text-white mb-2 text-sm">
            {isLogin ? t('AUTH.NO_ACCOUNT') : t('AUTH.HAVE_ACCOUNT')}
          </p>
          <button 
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setSuccess('');
            }}
            className="text-lg font-black uppercase underline decoration-4 underline-offset-4 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black px-2 transition-colors"
          >
            {isLogin ? t('AUTH.SIGNUP_NOW') : t('AUTH.GOTO_LOGIN')}
          </button>
        </div>
      </div>
    </div>
  );
};
