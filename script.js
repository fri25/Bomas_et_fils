const CONTACT = {
  whatsappNumber: "+2290196524263",
  phone: "+229 01 97 11 22 11",
  email: "+229 01 96 52 42 63",
  address: "895M+7MR, Natitingou, Bénin",
  mapsQuery: "895M+7MR, Natitingou, Bénin"
};

const DEFAULTS = {
  phone: "+2290196524263",
  email: "victorineagomadj@gmail.com",
  address: "895M+7MR, Natitingou, Bénin"
};

const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const siteHeader = document.querySelector(".site-header");
const themeToggle = document.getElementById("themeToggle");
const themeToggleText = document.getElementById("themeToggleText");

window.addEventListener("load", () => {
  document.body.classList.add("is-ready");
});

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}


function handleHeaderState() {
  if (!siteHeader) {
    return;
  }

  if (window.scrollY > 24) {
    siteHeader.classList.add("is-scrolled");
  } else {
    siteHeader.classList.remove("is-scrolled");
  }
}

function setupThemeToggle() {
  if (!themeToggle || !themeToggleText) {
    return;
  }

  const storageKey = "bomas-theme";

  function applyTheme(theme) {
    const nextTheme = theme === "light" ? "light" : "dark";
    document.body.setAttribute("data-theme", nextTheme);
    themeToggle.setAttribute("aria-pressed", String(nextTheme === "light"));
    themeToggle.setAttribute(
      "aria-label",
      nextTheme === "light" ? "Activer le mode sombre" : "Activer le mode clair"
    );
    themeToggleText.textContent = nextTheme === "light" ? "Mode sombre" : "Mode clair";
    document.documentElement.style.colorScheme = nextTheme;
    localStorage.setItem(storageKey, nextTheme);
  }

  const savedTheme = localStorage.getItem(storageKey);
  const preferredTheme = savedTheme || (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");

  applyTheme(preferredTheme);

  themeToggle.addEventListener("click", () => {
    const currentTheme = document.body.getAttribute("data-theme") === "light" ? "light" : "dark";
    applyTheme(currentTheme === "light" ? "dark" : "light");
  });
}

function setupRevealAnimations() {
  const groupedSelectors = [
    [".section-heading", "from-left"],
    [".feature-card, .info-card, .product-card, .service-card, .contact-item, .map-card, .quote-form", "from-right"],
    [".hero-stats li, .quote-note, .cta-band-inner", ""]
  ];

  const elements = [];

  groupedSelectors.forEach(([selector, direction]) => {
    document.querySelectorAll(selector).forEach((element) => {
      element.classList.add("reveal");

      if (direction) {
        element.classList.add(direction);
      }

      elements.push(element);
    });
  });

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  elements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    observer.observe(element);
  });
}
function configureContacts() {
  const phoneLink = document.getElementById("phoneLink");
  const phoneText = document.getElementById("phoneText");
  const whatsappLink = document.getElementById("whatsappLink");
  const heroWhatsappLinks = document.querySelectorAll(".hero-whatsapp-link");
  const whatsappText = document.getElementById("whatsappText");
  const emailLink = document.getElementById("emailLink");
  const emailText = document.getElementById("emailText");
  const addressText = document.getElementById("addressText");
  const mapFrame = document.getElementById("mapFrame");

  if (phoneText) {
    phoneText.textContent = CONTACT.phone || DEFAULTS.phone;
  }
  if (emailText) {
    emailText.textContent = CONTACT.email || DEFAULTS.email;
  }
  if (addressText) {
    addressText.textContent = CONTACT.address || DEFAULTS.address;
  }

  if (phoneLink) {
    if (CONTACT.phone) {
      phoneLink.href = `tel:${CONTACT.phone.replace(/\s+/g, "")}`;
    } else {
      phoneLink.href = "#contact";
    }
  }

  if (emailLink) {
    if (CONTACT.email) {
      emailLink.href = `mailto:${CONTACT.email}`;
    } else {
      emailLink.href = "#contact";
    }
  }

  const whatsappHref = CONTACT.whatsappNumber
    ? `https://wa.me/${CONTACT.whatsappNumber.replace(/\D+/g, "")}`
    : "#devis";

  if (whatsappLink) {
    whatsappLink.href = whatsappHref;
  }

  heroWhatsappLinks.forEach((link) => {
    link.href = whatsappHref;
  });

  if (whatsappText) {
    whatsappText.textContent = CONTACT.whatsappNumber ? "Ouvrir WhatsApp" : "Renseignez votre numéro WhatsApp";
  }

  if (CONTACT.mapsQuery && mapFrame) {
    const encodedQuery = encodeURIComponent(CONTACT.mapsQuery);
    mapFrame.src = `https://www.google.com/maps?q=${encodedQuery}&z=15&output=embed`;
  }
}

function attachProductShortcuts() {
  const productField = document.querySelector('textarea[name="products"]');

  document.querySelectorAll("[data-product]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!productField) {
        return;
      }

      const label = button.getAttribute("data-product");
      const currentValue = productField.value.trim();

      if (currentValue.includes(label)) {
        return;
      }

      productField.value = currentValue ? `${currentValue}\n- ${label}` : `- ${label}`;
    });
  });
}

function buildQuoteMessage(formData) {
  return [
    "Bonjour BOMAS & FILS,",
    "",
    "Je souhaite demander un devis.",
    `Nom / établissement : ${formData.get("clientName")}`,
    `Téléphone : ${formData.get("phone")}`,
    `Email : ${formData.get("email") || "Non renseigné"}`,
    `Produits souhaités : ${formData.get("products")}`,
    `Quantités : ${formData.get("quantities")}`,
    `Message : ${formData.get("message") || "Aucun message supplémentaire"}`
  ].join("\n");
}

function handleQuoteForm() {
  const form = document.getElementById("quoteForm");
  const feedback = document.getElementById("formFeedback");

  if (!form || !feedback) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const payload = buildQuoteMessage(formData);
    const whatsappNumber = CONTACT.whatsappNumber.replace(/\D+/g, "");

    if (whatsappNumber) {
      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(payload)}`;
      window.open(url, "_blank", "noopener");
      feedback.textContent = "Votre demande a été préparée dans WhatsApp.";
      form.reset();
      return;
    }

    if (CONTACT.email) {
      const subject = encodeURIComponent("Demande de devis - BOMAS & FILS");
      const body = encodeURIComponent(payload);
      window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
      feedback.textContent = "Votre application email va s’ouvrir avec la demande préremplie.";
      form.reset();
      return;
    }

    try {
      await navigator.clipboard.writeText(payload);
      feedback.textContent =
        "Les coordonnées de contact doivent être renseignées dans `script.js`. Votre demande a été copiée.";
    } catch (error) {
      feedback.textContent =
        "Les coordonnées de contact doivent être renseignées dans `script.js` avant l’envoi automatisé.";
    }
  });
}

function setupCarousel() {
  const container = document.querySelector(".carousel-container");
  if (!container) return;

  const slides = container.querySelectorAll(".carousel-slide");
  const dots = container.querySelectorAll(".indicator");
  const prevBtn = container.querySelector(".carousel-prev");
  const nextBtn = container.querySelector(".carousel-next");
  
  let currentSlide = 0;
  let autoplayTimer = null;
  const autoplayInterval = 6000; // 6 seconds

  function showSlide(index) {
    if (index >= slides.length) {
      currentSlide = 0;
    } else if (index < 0) {
      currentSlide = slides.length - 1;
    } else {
      currentSlide = index;
    }

    slides.forEach((slide, i) => {
      if (i === currentSlide) {
        slide.classList.add("active");
      } else {
        slide.classList.remove("active");
      }
    });

    dots.forEach((dot, i) => {
      if (i === currentSlide) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      resetAutoplay();
    });
  }
  
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      resetAutoplay();
    });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      showSlide(i);
      resetAutoplay();
    });
  });

  function startAutoplay() {
    autoplayTimer = setInterval(nextSlide, autoplayInterval);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
    }
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  container.addEventListener("mouseenter", stopAutoplay);
  container.addEventListener("mouseleave", startAutoplay);
  
  // Mobile Touch Swipes
  let touchStartX = 0;
  let touchEndX = 0;

  container.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  container.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleGesture();
  }, { passive: true });

  function handleGesture() {
    if (touchStartX - touchEndX > 50) {
      nextSlide();
      resetAutoplay();
    } else if (touchEndX - touchStartX > 50) {
      prevSlide();
      resetAutoplay();
    }
  }

  // Keyboard navigation
  window.addEventListener("keydown", (e) => {
    // Only handle if hero section is in view
    const rect = container.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom >= 0;
    if (!inView) return;

    if (e.key === "ArrowLeft") {
      prevSlide();
      resetAutoplay();
    } else if (e.key === "ArrowRight") {
      nextSlide();
      resetAutoplay();
    }
  });

  showSlide(0);
  startAutoplay();
}

configureContacts();
attachProductShortcuts();
handleQuoteForm();
handleHeaderState();
setupThemeToggle();
setupCarousel();
setupRevealAnimations();
window.addEventListener("scroll", handleHeaderState, { passive: true });
