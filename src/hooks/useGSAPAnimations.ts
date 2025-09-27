import { useEffect } from 'react';
import { gsap } from 'gsap';

export const useGSAPAnimations = () => {
  useEffect(() => {
    // Set GSAP defaults for smooth animations
    gsap.defaults({
      duration: 0.6,
      ease: "power2.out"
    });

    // Register scroll trigger animations
    gsap.registerEffect({
      name: "fadeInUp",
      effect: (targets: any, config: any) => {
        return gsap.fromTo(targets, 
          { 
            opacity: 0, 
            y: 50,
            scale: 0.95
          },
          { 
            opacity: 1, 
            y: 0,
            scale: 1,
            duration: config.duration || 0.8,
            ease: config.ease || "power2.out",
            stagger: config.stagger || 0.1
          }
        );
      },
      defaults: { duration: 0.8, ease: "power2.out" },
      extendTimeline: true,
    });

    gsap.registerEffect({
      name: "glowPulse",
      effect: (targets: any, config: any) => {
        return gsap.to(targets, {
          boxShadow: "0 0 30px rgba(59, 130, 246, 0.8)",
          duration: config.duration || 1,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1
        });
      },
      defaults: { duration: 1 },
      extendTimeline: true,
    });

    gsap.registerEffect({
      name: "floatAnimation",
      effect: (targets: any, config: any) => {
        return gsap.to(targets, {
          y: -20,
          duration: config.duration || 2,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1
        });
      },
      defaults: { duration: 2 },
      extendTimeline: true,
    });

    // Particle animation effect
    gsap.registerEffect({
      name: "particleFloat",
      effect: (targets: any, config: any) => {
        return gsap.to(targets, {
          y: -100,
          x: "random(-50, 50)",
          rotation: "random(-180, 180)",
          opacity: 0,
          duration: config.duration || 4,
          ease: "power1.out",
          stagger: {
            amount: 2,
            from: "random"
          }
        });
      },
      defaults: { duration: 4 },
      extendTimeline: true,
    });

    // Text reveal animation
    gsap.registerEffect({
      name: "textReveal",
      effect: (targets: any, config: any) => {
        return gsap.fromTo(targets,
          {
            opacity: 0,
            y: 100,
            skewY: 7
          },
          {
            opacity: 1,
            y: 0,
            skewY: 0,
            duration: config.duration || 1,
            ease: "power3.out",
            stagger: config.stagger || 0.05
          }
        );
      },
      defaults: { duration: 1, stagger: 0.05 },
      extendTimeline: true,
    });

    // Morphing background animation
    gsap.registerEffect({
      name: "morphBackground",
      effect: (targets: any, config: any) => {
        return gsap.to(targets, {
          backgroundPosition: "100% 50%",
          duration: config.duration || 10,
          ease: "none",
          repeat: -1,
          yoyo: true
        });
      },
      defaults: { duration: 10 },
      extendTimeline: true,
    });

    // Glass card hover effect
    gsap.registerEffect({
      name: "glassHover",
      effect: (targets: any, config: any) => {
        const tl = gsap.timeline({ paused: true });
        
        tl.to(targets, {
          scale: 1.05,
          boxShadow: "0 25px 50px -12px rgba(31, 38, 135, 0.4)",
          backdropFilter: "blur(25px)",
          duration: 0.3,
          ease: "power2.out"
        });

        return tl;
      },
      defaults: {},
      extendTimeline: true,
    });

    // Cleanup function
    return () => {
      gsap.killTweensOf("*");
    };
  }, []);

  // Utility functions for common animations
  const animateIn = (element: string | Element, delay: number = 0) => {
    gsap.fromTo(element, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, delay, ease: "power2.out" }
    );
  };

  const animateOut = (element: string | Element, onComplete?: () => void) => {
    gsap.to(element, {
      opacity: 0,
      y: -30,
      duration: 0.4,
      ease: "power2.in",
      onComplete
    });
  };

  const createHoverEffect = (element: string | Element) => {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return;

    const handleMouseEnter = () => {
      gsap.to(el, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  };

  const createScrollAnimation = (element: string | Element, animation: string = 'fadeInUp') => {
    gsap.fromTo(element,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );
  };

  return {
    animateIn,
    animateOut,
    createHoverEffect,
    createScrollAnimation,
    gsap
  };
};
