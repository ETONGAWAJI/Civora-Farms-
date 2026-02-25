 /* ══════════════════════════════════════════════════════════════
   PLANT SHOP — JAVASCRIPT
   Handles: page load animations, navbar scroll state,
            carousel auto-play, slide transitions, parallax
══════════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────
   PLANT DATA
───────────────────────────────────────────── */
const PLANTS = [
  {
    id: 0,
    name: 'Crop Yield Optimization',
    colors: 5,
    desc: 'Boost your farm\'s productivity with our expert guidance. Tailored strategies for maize, soybeans, and more. Get Started Today!',
    bg: 'linear-gradient(135deg, #1a4a2e 0%, #2d6a4f 50%, #1b3a2a 100%)',
  },
  {
    id: 1,
    name: 'Sustainable Farming Practices',
    colors: 2,
    desc: 'A proven approach to soil health, featuring expert analysis and tailored amendments. Perfect for boosting crop yields and improving land sustainability.',
    bg: 'linear-gradient(135deg, #0d2818 0%, #1a4a2e 50%, #0a1f12 100%)',
  },
  {
    id: 2,
    name: 'Precision Irrigation Systems',
    colors: 2,
    desc: 'Architectural and bold with violin-shaped leaves. A designer favourite that transforms any living space.',
    bg: 'linear-gradient(135deg, #14532d 0%, #166534 50%, #052e16 100%)',
  },
];

/* ─────────────────────────────────────────────
   DOM REFERENCES
───────────────────────────────────────────── */
const navbar       = document.getElementById('navbar');
const heroBg       = document.getElementById('heroBg');
const leafSvg      = document.getElementById('leafSvg');
const plantName    = document.getElementById('plantName');
const plantColors  = document.getElementById('plantColors');
const plantDesc    = document.getElementById('plantDesc');
const slideDots    = document.querySelectorAll('.slide-dot');
const progressBars = document.querySelectorAll('.progress-bar');
const fadeUpEls    = document.querySelectorAll('.fadeInUp');
const fadeRightEls = document.querySelectorAll('.fadeInRight');

/* ─────────────────────────────────────────────
   STATE
───────────────────────────────────────────── */
let activeSlide   = 0;
let carouselTimer = null;

/* ─────────────────────────────────────────────
   PAGE LOAD — trigger entry animations
───────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  // Small delay so the browser has painted at least once
  requestAnimationFrame(() => {
    setTimeout(() => {
      fadeUpEls.forEach((el) => el.classList.add('loaded'));
      fadeRightEls.forEach((el) => el.classList.add('loaded'));
    }, 80);
  });

  startCarousel();
});

/* ─────────────────────────────────────────────
   NAVBAR — scroll state
───────────────────────────────────────────── */
window.addEventListener('scroll', onScroll, { passive: true });

function onScroll() {
  // Navbar shadow / bg on scroll
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Parallax on leaf SVG
  applyParallax();
}

/* ─────────────────────────────────────────────
   NAVBAR — active link switching on scroll
───────────────────────────────────────────── */
function updateActiveNavOnScroll() {
  const sections = [
    { name: 'home', element: document.querySelector('main'), offset: 0 },
    { name: 'about', element: document.getElementById('about'), offset: 100 },
    { name: 'contact', element: document.getElementById('contact'), offset: 100 }
  ];
  
  let currentSection = 'home';
  
  sections.forEach(section => {
    if (section.element) {
      const rect = section.element.getBoundingClientRect();
      if (rect.top <= section.offset && rect.bottom > section.offset) {
        currentSection = section.name;
      }
    }
  });
  
  document.querySelectorAll('.nav-link').forEach(link => {
    const linkText = link.textContent.trim().toLowerCase();
    if (linkText === currentSection) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Call on scroll
window.addEventListener('scroll', updateActiveNavOnScroll, { passive: true });

/* ─────────────────────────────────────────────
   SMOOTH SCROLL for nav links
───────────────────────────────────────────── */
document.querySelectorAll('.nav-link').forEach((link) => {
  const linkText = link.textContent.trim().toLowerCase();
  
  if (linkText === 'home') {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(updateActiveNavOnScroll, 200);
    });
  }
  
  if (linkText === 'about') {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(updateActiveNavOnScroll, 200);
      }
    });
  }
  
  if (linkText === 'contact') {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(updateActiveNavOnScroll, 200);
      }
    });
  }
});

/* ─────────────────────────────────────────────
   PARALLAX — leaf drifts slightly on scroll
───────────────────────────────────────────── */
function applyParallax() {
  if (!leafSvg) return;
  const offset = window.scrollY * 0.04;
  leafSvg.style.transform = `translateY(${offset}px)`;
}

/* ─────────────────────────────────────────────
   CAROUSEL — auto-rotate + manual dot clicks
───────────────────────────────────────────── */
function startCarousel() {
  carouselTimer = setInterval(() => {
    goToSlide((activeSlide + 1) % PLANTS.length);
  }, 4000);
}

function stopCarousel() {
  clearInterval(carouselTimer);
}

function goToSlide(index) {
  if (index === activeSlide) return;
  activeSlide = index;
  updateHero();
  updateDots();
  updateProgressBars();
  updateCard();
}

/* ── Hero background ── */
function updateHero() {
  heroBg.style.background = PLANTS[activeSlide].bg;
}

/* ── Carousel dots ── */
function updateDots() {
  slideDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === activeSlide);
  });
}

/* ── Progress bars inside card ── */
function updateProgressBars() {
  progressBars.forEach((bar, i) => {
    bar.classList.toggle('active', i === activeSlide);
  });
}

/* ── Product card text ── */
function updateCard() {
  const plant = PLANTS[activeSlide];

  // Fade out
  plantName.classList.add('fading');
  plantDesc.classList.add('fading');

  setTimeout(() => {
    plantName.textContent  = plant.name;
    plantColors.textContent = `${plant.colors} Colors available`;
    plantDesc.textContent  = plant.desc;

    // Fade in
    plantName.classList.remove('fading');
    plantDesc.classList.remove('fading');
  }, 220);
}

/* ── Dot click handlers ── */
slideDots.forEach((dot) => {
  dot.addEventListener('click', () => {
    const index = parseInt(dot.dataset.index, 10);
    stopCarousel();
    goToSlide(index);
    startCarousel(); // restart timer after manual interaction
  });
});

/* ── Progress bar click handlers ── */
progressBars.forEach((bar) => {
  bar.addEventListener('click', () => {
    const index = parseInt(bar.dataset.index, 10);
    stopCarousel();
    goToSlide(index);
    startCarousel();
  });
});

/* ─────────────────────────────────────────────
   SMOOTH SCROLL — "Scroll Down" indicator
───────────────────────────────────────────── */
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
  scrollIndicator.addEventListener('click', () => {
    window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
  });
  scrollIndicator.style.cursor = 'pointer';
}

/* ─────────────────────────────────────────────
   SHOP PLANTS button — placeholder interaction
───────────────────────────────────────────── */
const btnPrimary = document.querySelector('.btn-primary');
if (btnPrimary) {
  btnPrimary.addEventListener('click', () => {
    // Pulse animation feedback
    btnPrimary.style.transform = 'scale(0.96)';
    setTimeout(() => {
      btnPrimary.style.transform = '';
    }, 150);

    // TODO: navigate to shop page
    console.log('Navigate to shop →');
  });
}

/* ─────────────────────────────────────────────
   WATCH VIDEO button — placeholder interaction
───────────────────────────────────────────── */
const btnVideo = document.querySelector('.btn-video');
if (btnVideo) {
  btnVideo.addEventListener('click', () => {
    // TODO: open video modal / lightbox
    console.log('Open video modal →');
  });
}

/* ─────────────────────────────────────────────
   KEYBOARD NAVIGATION — left / right arrows
───────────────────────────────────────────── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') {
    stopCarousel();
    goToSlide((activeSlide + 1) % PLANTS.length);
    startCarousel();
  }
  if (e.key === 'ArrowLeft') {
    stopCarousel();
    goToSlide((activeSlide - 1 + PLANTS.length) % PLANTS.length);
    startCarousel();
  }
});

/* ─────────────────────────────────────────────
   ABOUT SECTION — scroll reveal animations
───────────────────────────────────────────── */
const observeElements = () => {
  const aboutSection = document.querySelector('.about-section');
  if (!aboutSection) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -100px 0px' }
  );

  // Observe about elements
  const aboutGallery = document.querySelector('.about-gallery');
  const aboutContent = document.querySelector('.about-content');
  const featureItems = document.querySelectorAll('.feature-item');
  const badges = document.querySelectorAll('.gallery-badge');

  if (aboutGallery) {
    aboutGallery.style.opacity = '0';
    aboutGallery.style.transform = 'translateX(-30px)';
    aboutGallery.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(aboutGallery);
  }

  if (aboutContent) {
    aboutContent.style.opacity = '0';
    aboutContent.style.transform = 'translateX(30px)';
    aboutContent.style.transition = 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s';
    observer.observe(aboutContent);
  }

  featureItems.forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = `opacity 0.6s ease ${0.4 + i * 0.1}s, transform 0.6s ease ${0.4 + i * 0.1}s`;
    observer.observe(item);
  });

  badges.forEach((badge, i) => {
    badge.style.opacity = '0';
    badge.style.transform = 'translateY(20px) scale(0.9)';
    badge.style.transition = `opacity 0.6s ease ${0.3 + i * 0.15}s, transform 0.6s ease ${0.3 + i * 0.15}s`;
    observer.observe(badge);
  });
};

// Add in-view class styles
const style = document.createElement('style');
style.textContent = `
  .about-gallery.in-view,
  .about-content.in-view,
  .feature-item.in-view,
  .gallery-badge.in-view {
    opacity: 1 !important;
    transform: translateX(0) translateY(0) scale(1) !important;
  }
`;
document.head.appendChild(style);

// Initialize on load
window.addEventListener('DOMContentLoaded', observeElements);

/* ─────────────────────────────────────────────
   SMOOTH SCROLL for About nav link
───────────────────────────────────────────── */
document.querySelectorAll('a[href="#"]').forEach((link) => {
  if (link.textContent.trim() === 'About') {
    link.href = '#about';
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
});


/* ─────────────────────────────────────────────
   CONTACT FORM — validation & submission
───────────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = {
      firstName: document.getElementById('firstName').value.trim(),
      lastName: document.getElementById('lastName').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value.trim(),
    };

    // Validation
    if (!formData.firstName || !formData.lastName) {
      showFormMessage('Please enter your full name.', 'error');
      return;
    }

    if (!isValidEmail(formData.email)) {
      showFormMessage('Please enter a valid email address.', 'error');
      return;
    }

    if (!formData.subject) {
      showFormMessage('Please select a subject.', 'error');
      return;
    }

    if (formData.message.length < 10) {
      showFormMessage('Please enter a message with at least 10 characters.', 'error');
      return;
    }

    // Submit animation
    const submitBtn = contactForm.querySelector('.form-submit');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: spin 0.8s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke-dasharray="50" stroke-dashoffset="10"/>
      </svg>
      Sending...
    `;

    // Simulate API call
    setTimeout(() => {
      showFormMessage('Message sent successfully! We\'ll get back to you soon.', 'success');
      contactForm.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      
      console.log('Form submitted:', formData);
    }, 1500);
  });
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showFormMessage(message, type) {
  // Remove existing messages
  const existingMsg = document.querySelector('.form-message');
  if (existingMsg) existingMsg.remove();

  // Create new message
  const msgDiv = document.createElement('div');
  msgDiv.className = `form-message form-message-${type}`;
  msgDiv.textContent = message;
  
  // Insert before submit button
  const submitBtn = contactForm.querySelector('.form-submit');
  submitBtn.parentNode.insertBefore(msgDiv, submitBtn);

  // Auto-remove after 5 seconds
  setTimeout(() => msgDiv.remove(), 5000);
}

// Add message styles
const formMessageStyle = document.createElement('style');
formMessageStyle.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .form-message {
    padding: 14px 20px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 500;
    font-family: var(--font-body);
    margin-bottom: 16px;
    animation: slideInUp 0.3s ease;
  }
  
  .form-message-success {
    background: rgba(82, 183, 136, 0.12);
    color: #2d6a4f;
    border: 1px solid rgba(82, 183, 136, 0.3);
  }
  
  .form-message-error {
    background: rgba(239, 68, 68, 0.12);
    color: #991b1b;
    border: 1px solid rgba(239, 68, 68, 0.3);
  }
  
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(formMessageStyle);

/* ─────────────────────────────────────────────
   CONTACT SECTION — scroll reveal animations
───────────────────────────────────────────── */
const observeContactElements = () => {
  const contactSection = document.querySelector('.contact-section');
  if (!contactSection) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -80px 0px' }
  );

  // Observe contact elements
  const contactHeader = document.querySelector('.contact-header');
  const contactForm = document.querySelector('.contact-form-wrapper');
  const infoCards = document.querySelectorAll('.info-card');

  if (contactHeader) {
    contactHeader.style.opacity = '0';
    contactHeader.style.transform = 'translateY(30px)';
    contactHeader.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(contactHeader);
  }

  if (contactForm) {
    contactForm.style.opacity = '0';
    contactForm.style.transform = 'translateX(-30px)';
    contactForm.style.transition = 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s';
    observer.observe(contactForm);
  }

  infoCards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateX(30px)';
    card.style.transition = `opacity 0.6s ease ${0.3 + i * 0.1}s, transform 0.6s ease ${0.3 + i * 0.1}s`;
    observer.observe(card);
  });
};

// Update in-view styles
const inViewStyle = document.querySelector('style');
if (inViewStyle) {
  inViewStyle.textContent += `
    .contact-header.in-view,
    .contact-form-wrapper.in-view,
    .info-card.in-view {
      opacity: 1 !important;
      transform: translateX(0) translateY(0) !important;
    }
  `;
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
  observeContactElements();
});

