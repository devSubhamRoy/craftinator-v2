import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Settings as SettingsIcon, 
  User, 
  Globe, 
  Bell, 
  ShieldCheck, 
  Store, 
  Check, 
  Save
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSelector from '../components/ui/LanguageSelector';

export default function SettingsPage({
  onNavigate,
  onGoBack,
  showToast
}) {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState('account');

  // Form states
  const [formData, setFormData] = useState({
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    bio: 'Collector of heritage pottery, organic linen & woodworks.',
    location: 'Portland, OR, USA',
    currency: 'USD ($)',
    artisanAlerts: true,
    orderUpdates: true,
    communityReplies: true,
    newsletter: false,
    twoFactor: false,
    vacationMode: false
  });

  const handleToggle = (key) => {
    setFormData(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (showToast) showToast('Preferences updated successfully ✨');
  };

  return (
    <div className="settings-page-root">
      <div className="container settings-container">
        
        {/* Top Back Navigation Bar */}
        <div className="settings-top-bar">
          <button 
            type="button"
            className="settings-back-btn" 
            onClick={() => {
              if (onGoBack) onGoBack();
              else if (onNavigate) onNavigate('/');
            }}
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
            <span>{t('btn_back', 'Back')}</span>
          </button>
          
          <div className="settings-title-group">
            <h1 className="settings-page-title">{t('settings', 'Settings & Preferences')}</h1>
            <p className="settings-page-subtitle">Manage your artisan account preferences, notifications & region</p>
          </div>
        </div>

        <div className="settings-layout">
          
          {/* Settings Left Navigation Sidebar */}
          <aside className="settings-nav-sidebar">
            <button
              type="button"
              className={`settings-nav-item ${activeSection === 'account' ? 'active' : ''}`}
              onClick={() => setActiveSection('account')}
            >
              <User size={18} />
              <span>Account & Profile</span>
            </button>
            <button
              type="button"
              className={`settings-nav-item ${activeSection === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveSection('preferences')}
            >
              <Globe size={18} />
              <span>Language & Currency</span>
            </button>
            <button
              type="button"
              className={`settings-nav-item ${activeSection === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveSection('notifications')}
            >
              <Bell size={18} />
              <span>Notifications</span>
            </button>
            <button
              type="button"
              className={`settings-nav-item ${activeSection === 'studio' ? 'active' : ''}`}
              onClick={() => setActiveSection('studio')}
            >
              <Store size={18} />
              <span>Artisan Studio Mode</span>
            </button>
            <button
              type="button"
              className={`settings-nav-item ${activeSection === 'security' ? 'active' : ''}`}
              onClick={() => setActiveSection('security')}
            >
              <ShieldCheck size={18} />
              <span>Security & Privacy</span>
            </button>
          </aside>

          {/* Settings Main Content Area */}
          <main className="settings-content-card">
            <form onSubmit={handleSave}>
              
              {/* SECTION 1: ACCOUNT */}
              {activeSection === 'account' && (
                <div className="settings-section">
                  <h2 className="settings-section-heading">Account Profile</h2>
                  <p className="settings-section-desc">Personalize how other artisans and makers see your public profile.</p>

                  <div className="settings-form-group">
                    <label className="settings-label">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      className="settings-input" 
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="settings-form-group">
                    <label className="settings-label">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      className="settings-input" 
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="settings-form-group">
                    <label className="settings-label">Location</label>
                    <input 
                      type="text" 
                      name="location"
                      className="settings-input" 
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="settings-form-group">
                    <label className="settings-label">Bio / Patron Statement</label>
                    <textarea 
                      name="bio"
                      rows="3"
                      className="settings-textarea" 
                      value={formData.bio}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}

              {/* SECTION 2: PREFERENCES & LANGUAGE */}
              {activeSection === 'preferences' && (
                <div className="settings-section">
                  <h2 className="settings-section-heading">Language & Regional Preferences</h2>
                  <p className="settings-section-desc">Select your preferred interface language and display currency.</p>

                  <div className="settings-form-group">
                    <label className="settings-label">Platform Language</label>
                    <div className="settings-language-picker-box">
                      <LanguageSelector isMobile={false} />
                    </div>
                  </div>

                  <div className="settings-form-group">
                    <label className="settings-label">Preferred Currency</label>
                    <select 
                      name="currency" 
                      className="settings-select"
                      value={formData.currency}
                      onChange={handleChange}
                    >
                      <option value="USD ($)">USD ($) - US Dollar</option>
                      <option value="EUR (€)">EUR (€) - Euro</option>
                      <option value="GBP (£)">GBP (£) - British Pound</option>
                      <option value="INR (₹)">INR (₹) - Indian Rupee</option>
                      <option value="JPY (¥)">JPY (¥) - Japanese Yen</option>
                    </select>
                  </div>
                </div>
              )}

              {/* SECTION 3: NOTIFICATIONS */}
              {activeSection === 'notifications' && (
                <div className="settings-section">
                  <h2 className="settings-section-heading">Notification Preferences</h2>
                  <p className="settings-section-desc">Control what alerts you receive regarding your artisan orders and community activities.</p>

                  <div className="settings-toggle-row">
                    <div className="settings-toggle-info">
                      <h4>New Artisan Studio Drops</h4>
                      <p>Receive immediate alerts when your followed makers release limited handcrafted batches.</p>
                    </div>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={formData.artisanAlerts} 
                        onChange={() => handleToggle('artisanAlerts')}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>

                  <div className="settings-toggle-row">
                    <div className="settings-toggle-info">
                      <h4>Order & Delivery Tracking</h4>
                      <p>Get SMS & email updates as your piece is handcrafted, packaged, and dispatched.</p>
                    </div>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={formData.orderUpdates} 
                        onChange={() => handleToggle('orderUpdates')}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>

                  <div className="settings-toggle-row">
                    <div className="settings-toggle-info">
                      <h4>Community Discussions</h4>
                      <p>Notifications when someone replies to your story or comments on your craft reviews.</p>
                    </div>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={formData.communityReplies} 
                        onChange={() => handleToggle('communityReplies')}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>

                  <div className="settings-toggle-row">
                    <div className="settings-toggle-info">
                      <h4>Weekly Heritage Digest</h4>
                      <p>A curated weekend read celebrating rare crafting traditions and artisan profiles.</p>
                    </div>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={formData.newsletter} 
                        onChange={() => handleToggle('newsletter')}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              )}

              {/* SECTION 4: ARTISAN STUDIO */}
              {activeSection === 'studio' && (
                <div className="settings-section">
                  <h2 className="settings-section-heading">Artisan Studio Controls</h2>
                  <p className="settings-section-desc">Features for registered craftspeople, guild members, and studio workshops.</p>

                  <div className="settings-toggle-row">
                    <div className="settings-toggle-info">
                      <h4>Studio Vacation Mode</h4>
                      <p>Pause incoming handcrafted requests while resting or preparing new seasonal kiln firings.</p>
                    </div>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={formData.vacationMode} 
                        onChange={() => handleToggle('vacationMode')}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>

                  <div className="settings-banner-box">
                    <h4>Want to become a Verified Maker?</h4>
                    <p>Join over 120+ master artisans exhibiting on Craftinator. Receive fair compensation and direct patron connections.</p>
                    <button 
                      type="button" 
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        if (showToast) showToast('Maker application launched!');
                      }}
                    >
                      Apply for Maker Verification
                    </button>
                  </div>
                </div>
              )}

              {/* SECTION 5: SECURITY */}
              {activeSection === 'security' && (
                <div className="settings-section">
                  <h2 className="settings-section-heading">Security & Privacy</h2>
                  <p className="settings-section-desc">Manage authentication and protect your collector account.</p>

                  <div className="settings-toggle-row">
                    <div className="settings-toggle-info">
                      <h4>Two-Factor Authentication (2FA)</h4>
                      <p>Add an extra layer of protection using authenticator app codes.</p>
                    </div>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={formData.twoFactor} 
                        onChange={() => handleToggle('twoFactor')}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>

                  <div className="settings-form-group" style={{ marginTop: '1.5rem' }}>
                    <label className="settings-label">Update Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••••••" 
                      className="settings-input" 
                    />
                  </div>
                </div>
              )}

              {/* Save Bar */}
              <div className="settings-actions-footer">
                <button type="submit" className="btn btn-primary settings-save-btn">
                  <Save size={16} />
                  <span>Save Changes</span>
                </button>
              </div>

            </form>
          </main>

        </div>

      </div>
    </div>
  );
}
