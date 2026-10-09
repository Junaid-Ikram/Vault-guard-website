'use strict';

/**
 * VaultGuard Website Interactive Script
 * Hardened for strict mode & zero DOM injection vulnerabilities.
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. FAQ Accordion Logic (Class toggle only — zero innerHTML manipulation)
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close all others
        faqItems.forEach(other => other.classList.remove('active'));
        // Toggle clicked item
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // 2. Safe Smooth Scroll for Anchor Links (Safe query selector handling)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId.length > 1 && targetId.startsWith('#')) {
        try {
          const targetElement = document.getElementById(targetId.slice(1));
          if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        } catch {
          // Graceful fallback if selector is non-standard
        }
      }
    });
  });

  // 3. Dynamic current year in footer (Uses textContent, preventing DOM XSS)
  const yearEls = document.querySelectorAll('.current-year');
  yearEls.forEach(el => {
    el.textContent = String(new Date().getFullYear());
  });

  // 4. Responsive Mobile Navigation Menu
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  if (mobileMenuBtn && navLinks) {
    const openIcon = mobileMenuBtn.querySelector('.menu-open-icon');
    const closeIcon = mobileMenuBtn.querySelector('.menu-close-icon');

    const toggleMenu = (forceState) => {
      const isOpen = typeof forceState === 'boolean'
        ? forceState
        : !navLinks.classList.contains('mobile-open');

      if (isOpen) {
        navLinks.classList.add('mobile-open');
      } else {
        navLinks.classList.remove('mobile-open');
      }

      mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
      if (openIcon && closeIcon) {
        openIcon.style.display = isOpen ? 'none' : 'block';
        closeIcon.style.display = isOpen ? 'block' : 'none';
      }
    };

    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close menu when clicking any nav link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggleMenu(false);
      });
    });

    // Close menu on click outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        toggleMenu(false);
      }
    });

    // Auto close on desktop resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navLinks.classList.contains('mobile-open')) {
        toggleMenu(false);
      }
    });
  }
});
