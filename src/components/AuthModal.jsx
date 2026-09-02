import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function AuthModal({ isOpen, mode = 'login', onClose, onAuthSuccess }) {
  const { t } = useLanguage();
  if (!isOpen) return null;

  const [currentMode, setCurrentMode] = useState(mode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAuthSuccess(currentMode === 'login' ? `Welcome back!` : `Account created successfully!`);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container auth-modal" onClick={(e) => e.stopPropagation()}>
        
        <button className="modal-close-btn" onClick={onClose} aria-label="Close auth dialog">
          <X size={22} />
        </button>

        <div className="auth-header">
          <span className="brand-logo-text">Craftinator</span>
          <p className="auth-subtitle">{t('auth_login_title')}</p>
        </div>

        {/* Auth Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${currentMode === 'login' ? 'active' : ''}`}
            onClick={() => setCurrentMode('login')}
          >
            {t('login')}
          </button>
          <button
            className={`auth-tab ${currentMode === 'signup' ? 'active' : ''}`}
            onClick={() => setCurrentMode('signup')}
          >
            {t('signup')}
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {currentMode === 'signup' && (
            <div className="auth-input-group">
              <label>{t('auth_fullname')}</label>
              <div className="input-field-wrapper">
                <User size={18} className="field-icon" />
                <input
                  type="text"
                  placeholder="e.g. Ananya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="auth-input-group">
            <label>{t('auth_email')}</label>
            <div className="input-field-wrapper">
              <Mail size={18} className="field-icon" />
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label>{t('auth_password')}</label>
            <div className="input-field-wrapper">
              <Lock size={18} className="field-icon" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary auth-submit-btn">
            {currentMode === 'login' ? t('auth_btn_login') : t('auth_btn_signup')}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-footer-note">
          By continuing, you agree to Craftinator's Terms of Service and Privacy Policy.
        </div>

      </div>
    </div>
  );
}
