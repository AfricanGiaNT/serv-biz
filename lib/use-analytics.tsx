"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// Generate a unique session ID for this browser session
function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

/**
 * Custom hook to track page visits and user interactions for analytics
 * 
 * Tracks:
 * - Page visits (on mount)
 * - Bounce detection (no scroll or interaction within session)
 * - Interactions (scroll, form submit, chat open)
 */
export function useAnalytics() {
  const pathname = usePathname();
  const hasTrackedVisit = useRef(false);
  const hasTrackedInteraction = useRef(false);
  const interactionTimeout = useRef<NodeJS.Timeout | null>(null);
  const sessionId = useRef<string>('');

  // Track visit on mount
  useEffect(() => {
    // Get or create session ID
    sessionId.current = getOrCreateSessionId();
    
    // Only track once per session
    if (hasTrackedVisit.current) return;
    
    // Track visit
    trackVisit(pathname);
    hasTrackedVisit.current = true;

    // Set up interaction listeners
    const handleScroll = () => {
      // Consider scroll past 50% of viewport as interaction
      if (window.scrollY > window.innerHeight * 0.5) {
        trackInteraction();
      }
    };

    const handleClick = () => {
      trackInteraction();
    };

    const handleFormSubmit = () => {
      trackInteraction();
    };

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('click', handleClick);
    window.addEventListener('submit', handleFormSubmit);

    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('submit', handleFormSubmit);
      
      if (interactionTimeout.current) {
        clearTimeout(interactionTimeout.current);
      }
    };
  }, [pathname]);

  const trackVisit = async (path: string) => {
    try {
      await fetch('/api/analytics/track-visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, sessionId: sessionId.current }),
      });
    } catch (error) {
      // Silently fail - don't break user experience
      console.debug('Analytics tracking failed:', error);
    }
  };

  const trackInteraction = () => {
    if (hasTrackedInteraction.current) return;
    
    // Debounce - only track once
    if (interactionTimeout.current) {
      clearTimeout(interactionTimeout.current);
    }

    interactionTimeout.current = setTimeout(async () => {
      if (hasTrackedInteraction.current) return;
      
      try {
        await fetch('/api/analytics/track-interaction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: sessionId.current }),
        });
        hasTrackedInteraction.current = true;
      } catch (error) {
        // Silently fail
        console.debug('Interaction tracking failed:', error);
      }
    }, 500); // 500ms debounce
  };
}

/**
 * Analytics Provider Component
 * Add this to your root layout to enable analytics tracking
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useAnalytics();
  return <>{children}</>;
}



