import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Palette, 
  Heart, 
  ArrowRight, 
  Compass, 
  Check, 
  HelpCircle,
  Zap,
  Globe
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useNavigation } from '../context/NavigationContext';

// Demo Personas for Quick 1-Click Fake Login
const DEMO_PERSONAS = [
  {
    id: 'elena',
    name: 'Elena Rostova',
    email: 'elena.pottery@craftinator.demo',
    role: 'Master Ceramicist & Artisan Seller',
    location: 'Kyoto, Japan',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
    badge: 'Artisan Seller',
    tagline: 'Clay & Mineral Glazes'
  },
  {
    id: 'aarav',
    name: 'Aarav Sharma',
    email: 'aarav.collector@craftinator.demo',
    role: 'Curated Craft Patron & Collector',
    location: 'Jaipur, India',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop',
    badge: 'Patron',
    tagline: 'Handwoven Textiles & Brass'
  },
  {
    id: 'maya',
    name: 'Maya Lin',
    email: 'maya.woodwork@craftinator.demo',
    role: 'Sustainable Woodturner',
    location: 'Portland, OR',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=250&auto=format&fit=crop',
    badge: 'Maker',
    tagline: 'Reclaimed Timber Art'
  }
];

export default function AuthPage({
  initialMode = 'login',
  onNavigate,
  onGoBack,
  onAuthSuccess,
  showToast
}) {
  const { t } = useLanguage();

  const navigation = useNavigation();
  const getReturnPath = navigation?.getReturnPath;

  // Detect mode based on URL or prop
  const [mode, setMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/signup') return 'signup';
      const search = window.location.search;
      if (search.includes('mode=signup')) return 'signup';
    }
    return initialMode;
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [accountType, setAccountType] = useState('collector'); // 'collector' | 'artisan'
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [formError, setFormError] = useState('');

  // Sync mode if window URL changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/signup' && mode !== 'signup') setMode('signup');
      if (path === '/login' && mode !== 'login') setMode('login');
    }
  }, [mode]);

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setFormError('');
    if (onNavigate) {
      onNavigate(newMode === 'signup' ? '/signup' : '/login', { replace: true });
    }
  };

  // Quick 1-Click Persona Login
  const handleSelectPersona = (persona, autoSubmit = false) => {
    setSelectedPersona(persona.id);
    setName(persona.name);
    setEmail(persona.email);
    setPassword('demo-artisan-pass-2026');
    setFormError('');

    if (autoSubmit) {
      triggerFakeAuth({
        name: persona.name,
        email: persona.email,
        role: persona.role,
        avatar: persona.avatar,
        location: persona.location,
        isDemo: true
      });
    } else {
      if (showToast) {
        showToast(t('auth_demo_filled', `Filled credentials for ${persona.name}`));
      }
    }
  };

  // Simulated authentication processor
  const triggerFakeAuth = (userData) => {
    setIsLoading(true);
    setFormError('');

    setTimeout(() => {
      setIsLoading(false);
      const user = {
        id: `user_${Date.now()}`,
        name: userData.name || name || (email.split('@')[0]),
        email: userData.email || email,
        role: userData.role || (accountType === 'artisan' ? 'Artisan Maker' : 'Curator & Patron'),
        avatar: userData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.name || name || 'Artisan')}&backgroundColor=a85838,7a866a`,
        location: userData.location || 'San Francisco, CA',
        isDemo: true,
        memberSince: 'September 2026',
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      };

      try {
        localStorage.setItem('craft_auth_user', JSON.stringify(user));
      } catch (e) {}

      if (onAuthSuccess) {
        onAuthSuccess(user);
      }

      if (showToast) {
        showToast(
          mode === 'signup'
            ? t('auth_signup_success', `Welcome to the Artisan Guild, ${user.name}!`)
            : t('auth_login_success', `Welcome back, ${user.name}!`)
        );
      }

      // Determine context-aware redirect target:
      // 1. URL query param ?returnUrl= or ?redirect=
      // 2. getReturnPath('/') which returns the previous non-auth page (e.g., /product?id=..., /shop)
      // 3. Fallback to '/' (Home) if user directly navigated to Login
      let targetPath = '/';
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const urlReturn = urlParams.get('returnUrl') || urlParams.get('redirect');
        if (urlReturn && !urlReturn.startsWith('/login') && !urlReturn.startsWith('/signup') && !urlReturn.startsWith('/auth')) {
          targetPath = urlReturn;
        } else if (getReturnPath) {
          targetPath = getReturnPath('/');
        }
      } else if (getReturnPath) {
        targetPath = getReturnPath('/');
      }

      // Redirect to target page at standard top/start position
      if (onNavigate) {
        onNavigate(targetPath, { targetScrollY: 0, replace: true });
      }
    }, 850);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setFormError(t('auth_error_required', 'Please fill in all required fields.'));
      return;
    }
    if (mode === 'signup' && !name) {
      setFormError(t('auth_error_name', 'Please provide your full name.'));
      return;
    }

    triggerFakeAuth({
      name: name || (email.split('@')[0]),
      email: email,
      role: accountType === 'artisan' ? 'Artisan Maker' : 'Curator & Patron'
    });
  };

  const handleGuestLogin = () => {
    triggerFakeAuth({
      name: 'Guest Collector',
      email: 'guest@craftinator.demo',
      role: 'Guest Patron',
      location: 'Global Artisan Guild'
    });
  };

  const handleSocialDemo = (provider) => {
    triggerFakeAuth({
      name: `${provider} Demo User`,
      email: `user@${provider.toLowerCase()}.demo`,
      role: 'Curator & Patron',
      location: 'San Francisco, CA'
    });
  };

  return (
    <div className="auth-page-root animate-fade-in">
      <div className="auth-page-container">
        
        {/* Left Side: Artisan Story & Brand Experience Column */}
        <div className="auth-showcase-column">
          <div className="auth-showcase-overlay" />
          
          <div className="auth-showcase-top">
            <button 
              type="button" 
              className="auth-back-btn" 
              onClick={() => (onGoBack ? onGoBack('/') : (onNavigate && onNavigate('/')))}
              aria-label={t('go_back', 'Back to Store')}
            >
              <ArrowLeft size={18} />
              <span>{t('back_to_shop', 'Return to Store')}</span>
            </button>
            
            <div className="auth-brand-badge">
              <Sparkles size={16} />
              <span>{t('auth_authentic_heritage', '100% Verified Handcrafted')}</span>
            </div>
          </div>

          <div className="auth-showcase-content">
            <span className="auth-showcase-eyebrow">
              {t('auth_join_movement', 'The Global Artisan Network')}
            </span>
            <h1 className="auth-showcase-title">
              {mode === 'signup' 
                ? t('auth_hero_title_signup', 'Discover the soul of slow, deliberate craft.')
                : t('auth_hero_title_login', 'Welcome back to your mindful craft haven.')}
            </h1>
            <p className="auth-showcase-desc">
              {t('auth_hero_desc', 'Connect directly with master potters, weavers, and woodworkers. Celebrate authentic provenance and heirloom creations.')}
            </p>

            {/* Artisan Highlights Grid */}
            <div className="auth-features-list">
              <div className="auth-feature-item">
                <div className="auth-feature-icon-box">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4>{t('auth_feat_1_title', 'Fair Trade & Direct Support')}</h4>
                  <p>{t('auth_feat_1_desc', '100% ethical pricing going directly to master artisans.')}</p>
                </div>
              </div>

              <div className="auth-feature-item">
                <div className="auth-feature-icon-box">
                  <Palette size={20} />
                </div>
                <div>
                  <h4>{t('auth_feat_2_title', 'Numbered Heirloom Drops')}</h4>
                  <p>{t('auth_feat_2_desc', 'Limited batch studio ceramics, organic textiles, and bronze.')}</p>
                </div>
              </div>

              <div className="auth-feature-item">
                <div className="auth-feature-icon-box">
                  <Heart size={20} />
                </div>
                <div>
                  <h4>{t('auth_feat_3_title', 'Artisan Community & Studio Feeds')}</h4>
                  <p>{t('auth_feat_3_desc', 'Follow makers, peek behind the workbench, and join workshops.')}</p>
                </div>
              </div>
            </div>

            {/* Testimonial Quote Banner */}
            <div className="auth-quote-card">
              <p className="auth-quote-text">
                "{t('auth_quote_text', 'Craftinator bridges the distance between the potter’s wheel and those who truly cherish handmade beauty.')}"
              </p>
              <div className="auth-quote-author">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop" 
                  alt="Elena Rostova" 
                  className="auth-quote-avatar"
                />
                <div>
                  <strong>Elena Rostova</strong>
                  <span>{t('auth_quote_role', 'Master Ceramicist, 14 Years')}</span>
                </div>
              </div>
            </div>

          </div>

          <div className="auth-showcase-footer">
            <span>© 2026 Craftinator Guild. {t('all_rights_reserved', 'All rights reserved.')}</span>
            <div className="auth-showcase-links">
              <button type="button" onClick={() => showToast && showToast('Privacy Policy: We never sell artisan data.')}>
                {t('privacy_policy', 'Privacy')}
              </button>
              <span>•</span>
              <button type="button" onClick={() => showToast && showToast('Terms of Service: Respect makers and ethical trade.')}>
                {t('terms_of_service', 'Terms')}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Auth Form & Fake Login Presets */}
        <div className="auth-form-column">
          <div className="auth-form-wrapper">
            
            {/* Form Top Navigation & Branding Header */}
            <div className="auth-form-header">
              <div className="auth-mobile-nav-row">
                <button 
                  type="button" 
                  className="auth-mobile-back-btn" 
                  onClick={() => (onGoBack ? onGoBack('/') : (onNavigate && onNavigate('/')))}
                  aria-label={t('go_back', 'Back to Store')}
                >
                  <ArrowLeft size={16} />
                  <span>{t('back_to_shop', 'Return to Store')}</span>
                </button>
              </div>

              <a 
                href="/" 
                className="auth-brand-logo"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigate) onNavigate('/');
                }}
              >
                Craftinator
              </a>
              <h2 className="auth-form-title">
                {mode === 'signup' 
                  ? t('auth_create_account', 'Create your Artisan Account') 
                  : t('auth_sign_in', 'Sign In to Craftinator')}
              </h2>
              <p className="auth-form-subtitle">
                {mode === 'signup'
                  ? t('auth_subtitle_signup', 'Join thousands of mindful craft lovers and master artisans.')
                  : t('auth_subtitle_login', 'Access your curated wishlist, artisan orders, and community feed.')}
              </p>
            </div>

            {/* 1. Quick Demo Persona Box (Instant Fake Login) */}
            <div className="auth-demo-banner">
              <div className="auth-demo-header">
                <div className="auth-demo-title">
                  <Zap size={16} className="auth-zap-icon" />
                  <span>{t('auth_demo_badge', 'Instant Demo Persona Logins')}</span>
                </div>
                <span className="auth-demo-hint">{t('auth_demo_click_tip', 'Click to instant sign-in')}</span>
              </div>

              <div className="auth-personas-grid">
                {DEMO_PERSONAS.map((persona) => (
                  <button
                    key={persona.id}
                    type="button"
                    className={`auth-persona-chip ${selectedPersona === persona.id ? 'active' : ''}`}
                    onClick={() => handleSelectPersona(persona, true)}
                    title={`Instant login as ${persona.name}`}
                  >
                    <img src={persona.avatar} alt={persona.name} className="auth-persona-img" />
                    <div className="auth-persona-meta">
                      <span className="auth-persona-name">{persona.name}</span>
                      <span className="auth-persona-role">{persona.badge}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Auth Mode Switcher Tab Bar */}
            <div className="auth-tabs-container">
              <button
                type="button"
                className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
                onClick={() => handleModeSwitch('login')}
              >
                {t('login', 'Log In')}
              </button>
              <button
                type="button"
                className={`auth-tab-btn ${mode === 'signup' ? 'active' : ''}`}
                onClick={() => handleModeSwitch('signup')}
              >
                {t('signup', 'Sign Up')}
              </button>
            </div>

            {/* Social / Alternative Quick Login Buttons */}
            <div className="auth-social-row">
              <button
                type="button"
                className="auth-social-btn"
                onClick={() => handleSocialDemo('Google')}
              >
                <svg className="auth-social-svg" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.1 8.8 5 12 5z"/>
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
                  <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.1-2 .4-2.7L1.6 6.4C.6 8.3 0 10.1 0 12s.6 3.7 1.6 5.6l3.7-2.9z"/>
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.2 0-5.8-2.1-6.8-5.2L1.5 16C3.4 19.9 7.4 23 12 23z"/>
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                className="auth-social-btn"
                onClick={handleGuestLogin}
              >
                <Compass size={18} />
                <span>{t('auth_guest_demo', 'Guest Demo')}</span>
              </button>
            </div>

            <div className="auth-divider">
              <span>{t('auth_or_with_email', 'or continue with email')}</span>
            </div>

            {/* Error banner if any */}
            {formError && (
              <div className="auth-error-banner animate-fade-in" role="alert">
                <span>{formError}</span>
              </div>
            )}

            {/* Main Interactive Form */}
            <form onSubmit={handleSubmit} className="auth-form-element">
              
              {/* If Signup: Account Role Choice */}
              {mode === 'signup' && (
                <div className="auth-role-selector">
                  <label className="auth-field-label">{t('auth_i_want_to', 'I want to:')}</label>
                  <div className="auth-role-options">
                    <button
                      type="button"
                      className={`auth-role-card ${accountType === 'collector' ? 'selected' : ''}`}
                      onClick={() => setAccountType('collector')}
                    >
                      <Heart size={16} />
                      <div className="auth-role-text">
                        <strong>{t('auth_role_collector', 'Collect & Patron')}</strong>
                        <span>{t('auth_role_collector_sub', 'Discover and buy crafted goods')}</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      className={`auth-role-card ${accountType === 'artisan' ? 'selected' : ''}`}
                      onClick={() => setAccountType('artisan')}
                    >
                      <Palette size={16} />
                      <div className="auth-role-text">
                        <strong>{t('auth_role_artisan', 'Sell as Artisan')}</strong>
                        <span>{t('auth_role_artisan_sub', 'Showcase and sell handmade art')}</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Full Name (Sign Up only) */}
              {mode === 'signup' && (
                <div className="auth-field-group">
                  <label htmlFor="auth-name" className="auth-field-label">
                    {t('auth_fullname', 'Full Name')}
                  </label>
                  <div className="auth-input-wrapper">
                    <User size={18} className="auth-input-icon" />
                    <input
                      id="auth-name"
                      type="text"
                      className="auth-input"
                      placeholder="e.g. Priya Patel"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={mode === 'signup'}
                      autoComplete="name"
                    />
                  </div>
                </div>
              )}

              {/* Email Input */}
              <div className="auth-field-group">
                <label htmlFor="auth-email" className="auth-field-label">
                  {t('auth_email', 'Email Address')}
                </label>
                <div className="auth-input-wrapper">
                  <Mail size={18} className="auth-input-icon" />
                  <input
                    id="auth-email"
                    type="email"
                    className="auth-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="auth-field-group">
                <div className="auth-label-row">
                  <label htmlFor="auth-password" className="auth-field-label">
                    {t('auth_password', 'Password')}
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      className="auth-forgot-link"
                      onClick={() => {
                        if (showToast) {
                          showToast(t('auth_reset_sent', 'Demo password reset link simulated to your email!'));
                        }
                      }}
                    >
                      {t('auth_forgot_password', 'Forgot password?')}
                    </button>
                  )}
                </div>
                <div className="auth-input-wrapper">
                  <Lock size={18} className="auth-input-icon" />
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    className="auth-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  />
                  <button
                    type="button"
                    className="auth-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me / Terms Checkbox */}
              <div className="auth-options-row">
                <label className="auth-checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="auth-checkbox"
                  />
                  <span>
                    {mode === 'login' 
                      ? t('auth_remember_me', 'Remember me on this device')
                      : t('auth_agree_terms', 'I agree to the Ethical Trade & Craft Terms')}
                  </span>
                </label>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary auth-submit-btn"
              >
                {isLoading ? (
                  <span className="auth-loading-spinner">
                    <span className="auth-spinner-ring" />
                    {mode === 'signup' ? t('auth_creating', 'Crafting your account...') : t('auth_signing_in', 'Authenticating...')}
                  </span>
                ) : (
                  <>
                    <span>
                      {mode === 'signup' 
                        ? t('auth_btn_signup', 'Join Craftinator Guild') 
                        : t('auth_btn_login', 'Sign In to Account')}
                    </span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

            </form>

            {/* Bottom Switcher Footer */}
            <div className="auth-bottom-switch">
              {mode === 'login' ? (
                <p>
                  {t('auth_no_account', "Don't have a Craftinator account yet?")}{' '}
                  <button 
                    type="button" 
                    className="auth-inline-link" 
                    onClick={() => handleModeSwitch('signup')}
                  >
                    {t('signup_now', 'Create an account')}
                  </button>
                </p>
              ) : (
                <p>
                  {t('auth_have_account', 'Already part of the craft community?')}{' '}
                  <button 
                    type="button" 
                    className="auth-inline-link" 
                    onClick={() => handleModeSwitch('login')}
                  >
                    {t('login_now', 'Sign in here')}
                  </button>
                </p>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
