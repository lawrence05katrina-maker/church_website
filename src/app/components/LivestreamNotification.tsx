import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Radio, Clock, Users, Play } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { livestreamApi } from '../../api/livestreamApi';

interface LivestreamData {
  id: number;
  title: string;
  description?: string;
  stream_url: string;
  thumbnail_url?: string;
  is_active: boolean;
  is_scheduled: boolean;
  scheduled_at?: string;
  started_at?: string;
  viewer_count: number;
}

export const LivestreamNotification: React.FC = () => {
  const { language, t } = useLanguage();
  const [activeStream, setActiveStream] = useState<LivestreamData | null>(null);
  const [upcomingStream, setUpcomingStream] = useState<LivestreamData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Tamil font size classes with improved layout
  const getTamilClass = (baseClass: string = '') => {
    return language === 'தமிழ்' ? `${baseClass} tamil-text text-sm leading-relaxed` : baseClass;
  };

  const getTamilButtonClass = (baseClass: string = '') => {
    return language === 'தமிழ்' ? `${baseClass} tamil-button text-xs px-2 py-1` : baseClass;
  };

  const getTamilTitleClass = (baseClass: string = '') => {
    return language === 'தமிழ்' ? `${baseClass} tamil-heading text-sm font-semibold leading-tight` : baseClass;
  };

  useEffect(() => {
    const checkLivestreams = async () => {
      try {
        // Check for active livestream
        const activeResponse = await livestreamApi.getActive();
        if (activeResponse.success && activeResponse.data) {
          setActiveStream(activeResponse.data);
          setIsVisible(true);
          return;
        }

        // Check for upcoming livestream (within next 30 minutes)
        const upcomingResponse = await livestreamApi.getUpcoming();
        if (upcomingResponse.success && upcomingResponse.data.length > 0) {
          const nextStream = upcomingResponse.data[0];
          const scheduledTime = new Date(nextStream.scheduled_at);
          const now = new Date();
          const timeDiff = scheduledTime.getTime() - now.getTime();
          const minutesDiff = Math.floor(timeDiff / (1000 * 60));

          // Show notification if stream is within 30 minutes
          if (minutesDiff <= 30 && minutesDiff > 0) {
            setUpcomingStream(nextStream);
            setIsVisible(true);
          }
        }
      } catch (error) {
        console.error('Error checking livestreams:', error);
      }
    };

    // Check immediately
    checkLivestreams();

    // Check every 30 seconds
    const interval = setInterval(checkLivestreams, 30000);

    return () => clearInterval(interval);
  }, []);

  // Check for mobile menu state
  useEffect(() => {
    const checkMobileMenu = () => {
      // Look for the specific mobile menu element by checking if it has the open classes
      const mobileMenu = document.querySelector('nav div[class*="lg:hidden"]');
      if (mobileMenu) {
        const classes = mobileMenu.className;
        const isOpen = classes.includes('max-h-screen') && classes.includes('opacity-100');
        setIsMobileMenuOpen(isOpen);
      }
    };

    // Check immediately
    checkMobileMenu();

    // Use MutationObserver to watch for class changes on the mobile menu
    const observer = new MutationObserver(() => {
      checkMobileMenu();
    });

    // Observe the entire document for class changes
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (!isVisible || isDismissed || isMobileMenuOpen || (!activeStream && !upcomingStream)) {
    return null;
  }

  const currentStream = activeStream || upcomingStream;
  const isLive = !!activeStream;

  if (!currentStream) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 md:top-4 md:bottom-auto z-50 w-64 md:max-w-sm">
      {/* Mobile Design - Compact Pill Style */}
      <div className={`md:hidden bg-white rounded-full shadow-2xl border border-gray-200 overflow-hidden animate-slide-in-right mobile-notification-pill ${language === 'தமிழ்' ? 'tamil-notification-mobile' : ''}`}>
        <div className="flex items-center p-2 gap-1">
          {/* Live Indicator */}
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold text-white flex-shrink-0 ${isLive ? 'bg-red-600' : 'bg-green-600'}`}>
            {isLive ? (
              <>
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                <span className={getTamilClass('text-xs')}>{t('livestream.notification.live')}</span>
              </>
            ) : (
              <>
                <Clock className="w-2.5 h-2.5" />
                <span className={getTamilClass('text-xs')}>{t('livestream.notification.soon')}</span>
              </>
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1 px-1 min-w-0 overflow-hidden">
            <p className={getTamilTitleClass("text-xs font-medium text-gray-900 truncate")}>
              {currentStream.title}
            </p>
            {isLive && (
              <p className={getTamilClass("text-xs text-gray-500 truncate")}>
                {currentStream.viewer_count} {t('livestream.notification.watching')}
              </p>
            )}
          </div>
          
          {/* Action Button */}
          <Link
            to="/livestream"
            className={getTamilButtonClass(`px-2 py-1 rounded-full text-xs font-medium text-white transition-all flex-shrink-0 ${
              isLive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            }`)}
          >
            {isLive ? t('livestream.notification.watch') : t('livestream.notification.join')}
          </Link>
          
          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="ml-1 p-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Desktop Design - Original Card Style */}
      <div className={`hidden md:block bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden animate-slide-in-right mobile-notification ${language === 'தமிழ்' ? 'tamil-notification-desktop' : ''}`}>
        {/* Header */}
        <div className={`px-4 py-3 ${isLive ? 'bg-red-600' : 'bg-green-600'} text-white relative`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isLive ? (
                <>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <Radio className="w-4 h-4" />
                  </div>
                  <span className={getTamilClass("font-semibold text-sm")}>{t('livestream.notification.live.now')}</span>
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4" />
                  <span className={getTamilClass("font-semibold text-sm")}>{t('livestream.notification.starting.soon')}</span>
                </>
              )}
            </div>
            <button
              onClick={handleDismiss}
              className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white hover:bg-opacity-20"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Thumbnail */}
          {currentStream.thumbnail_url && (
            <div className="relative mb-3 rounded-lg overflow-hidden shadow-sm">
              <img
                src={currentStream.thumbnail_url}
                alt={currentStream.title}
                className="w-full h-32 object-cover transition-transform duration-300 hover:scale-105"
              />
              {isLive && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="bg-white bg-opacity-20 rounded-full p-2">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Title */}
          <h3 className={getTamilTitleClass("font-semibold text-gray-900 mb-2 line-clamp-2 text-base leading-tight")}>
            {currentStream.title}
          </h3>

          {/* Description */}
          {currentStream.description && (
            <p className={getTamilClass("text-sm text-gray-600 mb-3 line-clamp-2")}>
              {currentStream.description}
            </p>
          )}

          {/* Stats */}
          <div className={`flex items-center gap-3 mb-4 text-sm text-gray-500 ${language === 'தமிழ்' ? 'flex-wrap' : ''}`}>
            {isLive ? (
              <>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Users className="w-4 h-4" />
                  <span className={getTamilClass('text-xs')}>{currentStream.viewer_count} {t('livestream.notification.watching')}</span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Clock className="w-4 h-4" />
                  <span className={getTamilClass('text-xs')}>{t('livestream.notification.started')} {currentStream.started_at ? formatTime(currentStream.started_at) : 'recently'}</span>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span className={getTamilClass('text-xs')}>{t('livestream.notification.starts.at')} {currentStream.scheduled_at ? formatTime(currentStream.scheduled_at) : 'soon'}</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <Link
            to="/livestream"
            className={getTamilButtonClass(`block w-full text-center py-2 px-4 rounded-lg font-medium transition-all duration-300 text-sm transform hover:scale-105 active:scale-95 ${
              isLive
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-red-200'
                : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-200'
            }`)}
          >
            {isLive ? t('livestream.notification.watch.live') : t('livestream.notification.set.reminder')}
          </Link>
        </div>
      </div>
    </div>
  );
};