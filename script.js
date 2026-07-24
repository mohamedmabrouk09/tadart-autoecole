/* ============================================================
   AUTO-ÉCOLE TADART — JavaScript
   ============================================================
   - Scroll-based header styling
   - Mobile menu toggle
   - Scroll reveal animations
   - Active nav link tracking
   - Image lightbox
   - Form handling
   - Counter animations
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  // ────────────────────────────────────────────────
  // Header scroll effect
  // ────────────────────────────────────────────────
  const header = document.querySelector(".header");
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll(); // run once on load

  // ────────────────────────────────────────────────
  // Mobile menu toggle
  // ────────────────────────────────────────────────
  const menuToggle = document.querySelector(".header__menu-toggle");
  const navList = document.querySelector(".header__nav-list");
  const navLinks = document.querySelectorAll(".header__nav-link");

  const setMenuState = (isOpen) => {
    if (!menuToggle || !navList) {
      return;
    }

    menuToggle.classList.toggle("active", isOpen);
    navList.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  };

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      setMenuState(!navList.classList.contains("open"));
    });

    // Close menu on link click
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        setMenuState(false);
      });
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!menuToggle.contains(e.target) && !navList.contains(e.target)) {
        setMenuState(false);
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setMenuState(false);
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        setMenuState(false);
      }
    });
  }

  // ────────────────────────────────────────────────
  // Active nav link on scroll
  // ────────────────────────────────────────────────
  const sections = document.querySelectorAll("section[id]");

  const updateActiveNav = () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");
      const link = document.querySelector(`.header__nav-link[href="#${id}"]`);

      if (link) {
        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach((l) => l.classList.remove("active"));
          link.classList.add("active");
        }
      }
    });
  };

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  // ────────────────────────────────────────────────
  // Scroll Reveal Animations (IntersectionObserver)
  // ────────────────────────────────────────────────
  const revealElements = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right, .stagger",
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ────────────────────────────────────────────────
  // Counter Animation
  // ────────────────────────────────────────────────
  const counters = document.querySelectorAll("[data-count]");

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute("data-count"), 10);
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * ease);

      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((el) => counterObserver.observe(el));

  // ────────────────────────────────────────────────
  // Image Lightbox
  // ────────────────────────────────────────────────
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = lightbox ? lightbox.querySelector("img") : null;
  const lightboxClose = lightbox
    ? lightbox.querySelector(".lightbox__close")
    : null;
  const lightboxTriggers = document.querySelectorAll("[data-lightbox]");

  if (lightbox && lightboxImg) {
    lightboxTriggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const src = trigger.getAttribute("data-lightbox") || trigger.src;
        lightboxImg.src = src;
        lightbox.classList.add("active");
        document.body.style.overflow = "hidden";
      });
    });

    lightboxClose.addEventListener("click", () => {
      lightbox.classList.remove("active");
      document.body.style.overflow = "";
    });

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove("active");
        document.body.style.overflow = "";
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("active")) {
        lightbox.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }

  // ────────────────────────────────────────────────
  // Contact Form — basic client-side handler
  // ────────────────────────────────────────────────
  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      // Build WhatsApp message from form data
      const message = encodeURIComponent(
        `Bonjour, je suis ${data.name}.\n` +
          `Email: ${data.email}\n` +
          `Téléphone: ${data.phone || "Non fourni"}\n\n` +
          `Message:\n${data.message}`,
      );

      // Open WhatsApp with pre-filled message
      window.open(`https://wa.me/212649666841?text=${message}`, "_blank");

      // Show success feedback
      const btn = contactForm.querySelector(".btn--primary");
      const originalText = btn.textContent;
      btn.textContent = "✓ Message envoyé !";
      btn.style.pointerEvents = "none";

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.pointerEvents = "";
        contactForm.reset();
      }, 3000);
    });
  }

  // ────────────────────────────────────────────────
  // Smooth scroll for anchor links (fallback)
  // ────────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId === "#") return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
});
