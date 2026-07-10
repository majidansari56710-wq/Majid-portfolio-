/* =====================================================
   MAJID ANSARI — PREMIUM PORTFOLIO JAVASCRIPT
   Interactive behavior, animations, particles, validation
   ===================================================== */

// Wait for the page to finish loading before starting UI behaviors.
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  setTimeout(() => loader.classList.add("hidden"), 900);
});

// DOM references.
const typedText = document.getElementById("typedText");
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.querySelector(".theme-icon");
const scrollProgress = document.getElementById("scrollProgress");
const backToTop = document.getElementById("backToTop");
const revealElements = document.querySelectorAll(".reveal");
const skillItems = document.querySelectorAll(".skill-item");
const counterElements = document.querySelectorAll(".counter");
const currentYear = document.getElementById("currentYear");
const navLinks = document.querySelectorAll(".nav-menu a");
const sections = document.querySelectorAll("main section");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

/* ──────────────────────────────────────────────────────
   Typing Effect
────────────────────────────────────────────────────── */
const typingPhrases = [
  "Student | Web Developer | AI Enthusiast",
  "Creating responsive websites with passion",
  "Learning, building, and growing every day"
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentPhrase = typingPhrases[phraseIndex];
  const displayedText = isDeleting
    ? currentPhrase.substring(0, charIndex--)
    : currentPhrase.substring(0, charIndex++);

  if (typedText) typedText.textContent = displayedText;

  let speed = isDeleting ? 45 : 95;

  if (!isDeleting && charIndex === currentPhrase.length + 1) {
    speed = 1400;
    isDeleting = true;
  } else if (isDeleting && charIndex === -1) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % typingPhrases.length;
    speed = 350;
    charIndex = 0;
  }

  setTimeout(typeEffect, speed);
}

typeEffect();

/* ──────────────────────────────────────────────────────
   Mobile Navigation Toggle
────────────────────────────────────────────────────── */
if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
    document.body.classList.toggle("menu-open");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      document.body.classList.remove("menu-open");
    });
  });
}

/* ──────────────────────────────────────────────────────
   Theme Toggle with localStorage persistence
────────────────────────────────────────────────────── */
const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "light") {
  document.body.classList.add("light-mode");
  if (themeIcon) themeIcon.textContent = "☀️";
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    const isLight = document.body.classList.contains("light-mode");
    localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
    if (themeIcon) themeIcon.textContent = isLight ? "☀️" : "🌙";
  });
}

/* ──────────────────────────────────────────────────────
   Scroll Progress Bar and Back-to-Top Button
────────────────────────────────────────────────────── */
function updateScrollUI() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;

  if (scrollTop > 500) {
    backToTop.classList.add("visible");
  } else {
    backToTop.classList.remove("visible");
  }
}

window.addEventListener("scroll", updateScrollUI);
updateScrollUI();

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ──────────────────────────────────────────────────────
   Reveal on Scroll Animation
────────────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.15
  }
);

revealElements.forEach((element) => revealObserver.observe(element));

/* ──────────────────────────────────────────────────────
   Animate Skill Progress Bars
────────────────────────────────────────────────────── */
const skillObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const item = entry.target;
        const progressBar = item.querySelector(".progress__bar");
        const progressValue = item.dataset.progress;
        progressBar.style.width = `${progressValue}%`;
        observer.unobserve(item);
      }
    });
  },
  { threshold: 0.35 }
);

skillItems.forEach((item) => skillObserver.observe(item));

/* ──────────────────────────────────────────────────────
   Animated Counters
────────────────────────────────────────────────────── */
function animateCounter(counter) {
  const target = Number(counter.dataset.target);
  const duration = 1400;
  const startTime = performance.now();

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.floor(eased * target);
    counter.textContent = currentValue;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      counter.textContent = target;
    }
  }

  requestAnimationFrame(updateCounter);
}

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);

counterElements.forEach((counter) => counterObserver.observe(counter));

/* ──────────────────────────────────────────────────────
   Active Navigation Highlight
────────────────────────────────────────────────────── */
function setActiveNavLink() {
  let currentSectionId = "hero";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 140;
    const sectionHeight = section.offsetHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSectionId = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.toggle("active", href === `#${currentSectionId}`);
  });
}

window.addEventListener("scroll", setActiveNavLink);
setActiveNavLink();

/* ──────────────────────────────────────────────────────
   Footer Year
────────────────────────────────────────────────────── */
if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

/* ──────────────────────────────────────────────────────
   Contact Form Validation
────────────────────────────────────────────────────── */
function setFieldError(field, message) {
  const formGroup = field.closest(".form-group");
  const errorMessage = formGroup.querySelector(".error-message");
  formGroup.classList.add("has-error");
  field.classList.add("invalid");
  errorMessage.textContent = message;
}

function clearFieldError(field) {
  const formGroup = field.closest(".form-group");
  const errorMessage = formGroup.querySelector(".error-message");
  formGroup.classList.remove("has-error");
  field.classList.remove("invalid");
  errorMessage.textContent = "";
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.textContent = "";

    const formFields = Array.from(contactForm.querySelectorAll("input, textarea"));
    let isValid = true;

    formFields.forEach((field) => {
      clearFieldError(field);
      const value = field.value.trim();

      if (!value) {
        setFieldError(field, "This field is required.");
        isValid = false;
        return;
      }

      if (field.type === "email" && !validateEmail(value)) {
        setFieldError(field, "Please enter a valid email address.");
        isValid = false;
        return;
      }

      if (field.tagName === "TEXTAREA" && value.length < 10) {
        setFieldError(field, "Message should be at least 10 characters.");
        isValid = false;
      }
    });

    if (!isValid) {
      formStatus.style.color = "#f87171";
      formStatus.textContent = "Please fix the highlighted fields and try again.";
      return;
    }

    formStatus.style.color = "#4ade80";
    formStatus.textContent = "Message validated successfully! Connect it to Formspree, Netlify Forms, or your backend to receive submissions.";
    contactForm.reset();
  });

  contactForm.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("input", () => clearFieldError(field));
  });
}

/* ──────────────────────────────────────────────────────
   Animated Background Particles
────────────────────────────────────────────────────── */
const canvas = document.getElementById("particles-canvas");
const ctx = canvas ? canvas.getContext("2d") : null;

if (canvas && ctx) {
  let particles = [];
  const particleCount = 64;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.4 + 0.6,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: (Math.random() - 0.5) * 0.35,
      opacity: Math.random() * 0.5 + 0.15
    }));
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle, index) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(167, 139, 250, ${particle.opacity})`;
      ctx.fill();

      // Connection lines for premium network effect.
      for (let i = index + 1; i < particles.length; i++) {
        const other = particles[i];
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = `rgba(6, 182, 212, ${0.12 - distance / 1000})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  createParticles();
  drawParticles();

  window.addEventListener("resize", () => {
    resizeCanvas();
    createParticles();
  });
}

/* ──────────────────────────────────────────────────────
   Smooth page entrance animation trigger
────────────────────────────────────────────────────── */
document.documentElement.style.scrollBehavior = "smooth";
