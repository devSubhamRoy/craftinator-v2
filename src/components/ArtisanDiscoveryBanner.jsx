import React, { useState, useRef } from 'react';
import { ArrowRight, Play, Pause } from 'lucide-react';

export default function ArtisanDiscoveryBanner({ onOpenArtisan }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <section className="artisan-banner-section">
      <div className="container">
        <div className="artisan-banner-card">
          
          {/* Left Text Content Side */}
          <div className="artisan-banner-content">
            <span className="artisan-banner-eyebrow">ARTISAN DISCOVERY BANNER</span>
            <h2 className="heading-lg artisan-banner-title">
              "Every Product Has a Maker."
            </h2>
            <p className="paragraph-lg artisan-banner-text">
              Meet the people behind the pieces you love and discover the stories, skills, and traditions that make their work special.
            </p>
            <button className="btn btn-white artisan-banner-btn" onClick={onOpenArtisan}>
              <span>Meet the Artisans</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Right Video Showcase Side */}
          <div className="artisan-banner-media">
            <video
              ref={videoRef}
              src="https://assets.mixkit.co/videos/preview/mixkit-potter-shaping-a-clay-vase-on-a-spinning-wheel-41554-large.mp4"
              poster="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=800&auto=format&fit=crop"
              className="artisan-banner-video img-cover"
              autoPlay
              loop
              muted
              playsInline
            />

            {/* Video Live Badge */}
            <div className="artisan-live-badge">
              <span className="live-pulse-dot" />
              <span>LIVE STUDIO</span>
            </div>

            {/* Video Play/Pause Controls */}
            <button
              className="artisan-video-play-btn"
              onClick={togglePlayPause}
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
