import React, { useState, useRef } from 'react';
import { X, ArrowRight } from 'lucide-react';
import '../styles/ArtisanDiscoveryBanner.css';

export default function ArtisanDiscoveryBanner({
  onOpenArtisan,
  eyebrow = 'Artisan Discovery',
  titleSans = 'Meet the Makers',
  titleSerif = 'The Living Craft',
  description = 'Every piece in our marketplace carries the signature touch of a master artisan. Discover the hands, heritage skills, and timeless traditions behind the creations you love.',
  buttonText = 'Meet the Artisans',
  trailerText = 'Watch Studio Story',
  studioLocation = 'LIVE STUDIO • JAIPUR',
  imageSrc = 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=1600&auto=format&fit=crop',
  videoSrc = 'https://assets.mixkit.co/videos/preview/mixkit-potter-shaping-a-clay-vase-on-a-spinning-wheel-41554-large.mp4'
}) {
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const videoRef = useRef(null);

  const handlePlayTrailer = () => {
    setIsPlayingTrailer(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {
          // Browser auto-play policy handler
        });
      }
    }, 100);
  };

  const handleStopTrailer = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsPlayingTrailer(false);
  };

  return (
    <section className="artisan-trailer-section" aria-label="Artisan Discovery Trailer">
      <div className="artisan-trailer-container">
        
        {/* Header Text Area (Left-aligned on mobile/tablet, Centered on desktop) */}
        <div className="artisan-trailer-header">
          {eyebrow && (
            <div className="artisan-eyebrow-badge">
              <span>{eyebrow}</span>
            </div>
          )}

          <h2 className="artisan-trailer-title">
            <span className="artisan-title-sans">{titleSans}</span>
            <span className="artisan-title-serif">{titleSerif}</span>
          </h2>

          <p className="artisan-trailer-desc">
            {description}
          </p>

          <div className="artisan-trailer-actions">
            <button
              type="button"
              className="artisan-trailer-cta-btn"
              onClick={onOpenArtisan}
              aria-label={buttonText}
            >
              <span>{buttonText}</span>
              <ArrowRight size={17} />
            </button>
          </div>
        </div>

        {/* Video / Media Card */}
        <div className="artisan-trailer-media-wrapper group">
          <div className="artisan-media-frame">
            {isPlayingTrailer ? (
              <>
                <video
                  ref={videoRef}
                  src={videoSrc}
                  poster={imageSrc}
                  className="artisan-active-video"
                  controls
                  autoPlay
                  playsInline
                />
                <button
                  type="button"
                  className="artisan-video-close-btn"
                  onClick={handleStopTrailer}
                  aria-label="Close trailer"
                  title="Close trailer"
                >
                  <X size={20} />
                </button>
              </>
            ) : (
              <>
                <img
                  src={imageSrc}
                  alt={`${titleSans} - ${titleSerif}`}
                  className="artisan-trailer-img"
                  loading="lazy"
                />

                {/* Studio Location Pill Badge */}
                {studioLocation && (
                  <div className="artisan-live-studio-badge">
                    <span className="artisan-live-dot" />
                    <span>{studioLocation}</span>
                  </div>
                )}

                <div className="artisan-media-overlay">
                  <button
                    type="button"
                    className="artisan-play-trailer-btn"
                    onClick={handlePlayTrailer}
                    aria-label={trailerText}
                  >
                    <span className="artisan-play-icon-circle">
                      <svg
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M8.0416 4.91926C7.37507 4.51934 6.5271 4.99945 6.5271 5.77675L6.5271 18.2232C6.5271 19.0005 7.37507 19.4806 8.0416 19.0807L18.4137 12.8575C19.061 12.4691 19.061 11.5309 18.4137 11.1425L8.0416 4.91926Z"
                        />
                      </svg>
                    </span>
                    <span className="artisan-play-label">{trailerText}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
