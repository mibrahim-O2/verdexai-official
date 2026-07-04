"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import config from "../lib/config";
import BrandLogo from "../components/shared/BrandLogo";
import "./landing.css";
import XLogo from "../components/icons/XLogo";

export default function LandingPage() {
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState("home");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("scroll-smooth");

    const addLandingPageResources = () => {
      if (document.querySelector('link[href*="fonts.googleapis.com"]')) return;

      const fontLink1 = document.createElement("link");
      fontLink1.rel = "preconnect";
      fontLink1.href = "https://fonts.googleapis.com";
      document.head.appendChild(fontLink1);

      const fontLink2 = document.createElement("link");
      fontLink2.rel = "preconnect";
      fontLink2.href = "https://fonts.gstatic.com";
      fontLink2.crossOrigin = "anonymous";
      document.head.appendChild(fontLink2);

      const fontLink3 = document.createElement("link");
      fontLink3.href =
        "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Montserrat:wght@400;500;600;700;800&display=swap";
      fontLink3.rel = "stylesheet";
      document.head.appendChild(fontLink3);

      const faLink = document.createElement("link");
      faLink.rel = "stylesheet";
      faLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
      document.head.appendChild(faLink);

      const aosLink = document.createElement("link");
      aosLink.rel = "stylesheet";
      aosLink.href = "https://unpkg.com/aos@next/dist/aos.css";
      document.head.appendChild(aosLink);
    };

    addLandingPageResources();

    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "dark" || (savedTheme === null && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }

    const handleScroll = () => {
      const header = document.getElementById("header");
      if (window.scrollY > 50) {
        header?.classList.add("header-scrolled");
      } else {
        header?.classList.remove("header-scrolled");
      }

      setShowScrollTop(window.scrollY > 300);

      const sections = document.querySelectorAll("section");
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 200) {
          setCurrentSection(section.getAttribute("id") || "");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
    }
    setMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="landing-page-wrapper">
      <Script
        src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (typeof window !== "undefined" && window.particlesJS) {
            setTimeout(() => {
              const particlesElement = document.getElementById("particles-js");
              if (particlesElement) {
                window.particlesJS("particles-js", {
                  particles: {
                    number: { value: 80, density: { enable: true, value_area: 800 } },
                    color: { value: "#2563eb" },
                    shape: { type: "circle", stroke: { width: 0, color: "#000000" }, polygon: { nb_sides: 5 } },
                    opacity: { value: 0.5, random: false, anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false } },
                    size: { value: 3, random: true, anim: { enable: false, speed: 40, size_min: 0.1, sync: false } },
                    line_linked: { enable: true, distance: 150, color: "#3b82f6", opacity: 0.4, width: 1 },
                    move: {
                      enable: true, speed: 2, direction: "none", random: false, straight: false,
                      out_mode: "out", bounce: false, attract: { enable: false, rotateX: 600, rotateY: 1200 },
                    },
                  },
                  interactivity: {
                    detect_on: "canvas",
                    events: {
                      onhover: { enable: true, mode: "grab" },
                      onclick: { enable: true, mode: "push" },
                      resize: true,
                    },
                    modes: {
                      grab: { distance: 140, line_linked: { opacity: 1 } },
                      bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
                      repulse: { distance: 200, duration: 0.4 },
                      push: { particles_nb: 4 },
                      remove: { particles_nb: 2 },
                    },
                  },
                  retina_detect: true,
                });
              }
            }, 100);
          }
        }}
      />
      <Script
        src="https://unpkg.com/aos@next/dist/aos.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (typeof window !== "undefined" && window.AOS) {
            window.AOS.init({ once: true, offset: 100, duration: 800 });
          }
        }}
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.7.0/vanilla-tilt.min.js"
        strategy="lazyOnload"
        onLoad={() => {
          if (typeof window !== "undefined" && window.VanillaTilt) {
            window.VanillaTilt.init(
              document.querySelectorAll(".team-card, .experience-card, .timeline-item, .contact-info-item"),
              { max: 5, speed: 400, glare: true, "max-glare": 0.2, scale: 1.02, perspective: 1000 }
            );
          }
        }}
      />

      <div className="cursor"></div>
      <div className="cursor-follower"></div>

      {showScrollTop && (
        <button id="scrollToTopBtn" onClick={scrollToTop} aria-label="Scroll to top">
          <i className="fas fa-arrow-up"></i>
        </button>
      )}

      {/* Header/Navbar */}
      <header className="header" id="header">
        <div className="container">
          <nav className="navbar">
            <Link href="/" className="navbar-brand" aria-label="VerdexAI home">
              <BrandLogo />
            </Link>

            <ul className="nav-menu">
              <li className="nav-item">
                <a href="#home" className={`nav-link ${currentSection === "home" ? "active" : ""}`} onClick={(e) => scrollToSection(e, "home")}>
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a href="#about" className={`nav-link ${currentSection === "about" ? "active" : ""}`} onClick={(e) => scrollToSection(e, "about")}>
                  About
                </a>
              </li>
              <li className="nav-item">
                <a href="#education" className={`nav-link ${currentSection === "education" ? "active" : ""}`} onClick={(e) => scrollToSection(e, "education")}>
                  Our Process
                </a>
              </li>
              <li className="nav-item">
                <a href="#experience" className={`nav-link ${currentSection === "experience" ? "active" : ""}`} onClick={(e) => scrollToSection(e, "experience")}>
                  Services
                </a>
              </li>
              <li className="nav-item">
                <a href="#projects" className={`nav-link ${currentSection === "projects" ? "active" : ""}`} onClick={(e) => scrollToSection(e, "projects")}>
                  Developer
                </a>
              </li>
              <li className="nav-item">
                <a href="#contact" className={`nav-link ${currentSection === "contact" ? "active" : ""}`} onClick={(e) => scrollToSection(e, "contact")}>
                  Contact
                </a>
              </li>
              <li className="nav-item" style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginLeft: "1rem" }}>
                <Link href="/auth/login" className="btn btn-outline" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}>
                  Sign In
                </Link>
                <Link href="/auth/signup" className="btn btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}>
                  Sign Up
                </Link>
              </li>
              <li className="nav-item">
                <button id="theme-toggle" className="theme-toggle" aria-label="Toggle theme" onClick={toggleTheme}>
                  <i className={`fas ${isDark ? "fa-sun" : "fa-moon"}`}></i>
                </button>
              </li>
            </ul>

            <button id="mobile-menu-btn" className="mobile-menu-btn" aria-label="Toggle mobile menu" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <i className={`fas ${mobileMenuOpen ? "fa-times" : "fa-bars"}`}></i>
            </button>
          </nav>
        </div>

        <div id="mobile-menu" className={`mobile-menu ${mobileMenuOpen ? "active" : ""}`}>
          <ul>
            <li><a href="#home" className="nav-link" onClick={(e) => scrollToSection(e, "home")}>Home</a></li>
            <li><a href="#about" className="nav-link" onClick={(e) => scrollToSection(e, "about")}>About</a></li>
            <li><a href="#education" className="nav-link" onClick={(e) => scrollToSection(e, "education")}>Our Process</a></li>
            <li><a href="#experience" className="nav-link" onClick={(e) => scrollToSection(e, "experience")}>Services</a></li>
            <li><a href="#projects" className="nav-link" onClick={(e) => scrollToSection(e, "projects")}>Developer</a></li>
            <li><a href="#contact" className="nav-link" onClick={(e) => scrollToSection(e, "contact")}>Contact</a></li>
            <li style={{ marginTop: "1rem", display: "flex", gap: "0.75rem", justifyContent: "center" }}>
              <Link href="/auth/login" className="btn btn-outline" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}>Sign In</Link>
              <Link href="/auth/signup" className="btn btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}>Sign Up</Link>
            </li>
          </ul>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="hero">
        <div id="particles-js" className="hero-particles"></div>
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content" data-aos="fade-up" data-aos-duration="1000">
              <p className="hero-greeting">Welcome to</p>
              <h1 className="hero-title">
                Verdex<span className="text-gradient">AI</span>
              </h1>
              <h2 className="hero-subtitle">AI-Powered Hiring Solutions</h2>
              <p className="hero-description">
                Screen candidates smarter, rank talent faster, and run your entire hiring
                pipeline with one AI-driven platform.
              </p>
              <div>
                <a href="#contact" className="btn btn-primary" onClick={(e) => scrollToSection(e, "contact")}>
                  Get In Touch
                </a>
                <a href="#projects" className="btn btn-outline" style={{ marginLeft: "1rem" }} onClick={(e) => scrollToSection(e, "projects")}>
                  Meet The Developer
                </a>
              </div>
              <div className="social-links">
                <a href="https://github.com/mibrahim-O2" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub">
                  <i className="fab fa-github"></i>
                </a>
                <a href="https://linkedin.com/in/muhammad-ibrahim-o2" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="https://x.com/MIbraheem_02" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="X (Twitter)">
                  <XLogo className="w-4 h-4" />
                </a>
                <a href="https://www.facebook.com/profile.php?id=100085369586705" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="mailto:mibrahimkhalid306@gmail.com" className="social-link" aria-label="Email">
                  <i className="fas fa-envelope"></i>
                </a>
                <a href="tel:+923242991303" className="social-link" aria-label="Phone">
                  <i className="fas fa-phone"></i>
                </a>
              </div>
            </div>

            <div className="hero-image-container" data-aos="zoom-in" data-aos-duration="1000">
              <div className="hero-visual-wrapper">
                <svg viewBox="0 0 500 500" className="hero-visual-svg" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="oklch(0.58 0.24 258)" />
                      <stop offset="100%" stopColor="oklch(0.65 0.2 230)" />
                    </linearGradient>
                    <radialGradient id="heroGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="oklch(0.58 0.24 258)" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="oklch(0.58 0.24 258)" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  <circle cx="250" cy="250" r="220" fill="url(#heroGlow)" />

                  {/* Neural circuit lines */}
                  <g stroke="url(#heroGrad)" strokeWidth="1.5" opacity="0.55" fill="none">
                    <path d="M60 120 L180 180 L260 130 L380 190" className="circuit-line" />
                    <path d="M70 350 L170 300 L250 340 L370 280" className="circuit-line" />
                    <path d="M120 60 L180 180 L150 280 L200 400" className="circuit-line" />
                    <path d="M420 90 L320 170 L350 280 L300 410" className="circuit-line" />
                    <path d="M250 250 L150 280 L120 60" className="circuit-line" />
                    <path d="M250 250 L350 280 L420 90" className="circuit-line" />
                  </g>

                  {/* Circuit nodes */}
                  <g fill="url(#heroGrad)">
                    <circle cx="60" cy="120" r="5" className="circuit-node" />
                    <circle cx="180" cy="180" r="5" className="circuit-node" />
                    <circle cx="260" cy="130" r="5" className="circuit-node" />
                    <circle cx="380" cy="190" r="5" className="circuit-node" />
                    <circle cx="70" cy="350" r="5" className="circuit-node" />
                    <circle cx="170" cy="300" r="5" className="circuit-node" />
                    <circle cx="250" cy="340" r="5" className="circuit-node" />
                    <circle cx="370" cy="280" r="5" className="circuit-node" />
                    <circle cx="150" cy="280" r="5" className="circuit-node" />
                    <circle cx="200" cy="400" r="5" className="circuit-node" />
                    <circle cx="320" cy="170" r="5" className="circuit-node" />
                    <circle cx="350" cy="280" r="5" className="circuit-node" />
                    <circle cx="300" cy="410" r="5" className="circuit-node" />
                    <circle cx="120" cy="60" r="5" className="circuit-node" />
                    <circle cx="420" cy="90" r="5" className="circuit-node" />
                  </g>

                  {/* Central VerdexAI mark */}
                  <g transform="translate(250,250)">
                    <circle r="70" fill="oklch(0.16 0.04 250)" stroke="url(#heroGrad)" strokeWidth="2" className="hero-pulse-ring" />
                    <path d="M-35 -25 L-5 35 L5 20 L-25 -25 Z" fill="url(#heroGrad)" />
                    <path d="M35 -25 L5 35 L-5 20 L25 -25 Z" fill="url(#heroGrad)" opacity="0.6" />
                  </g>
                </svg>
                <p className="hero-visual-label">VerdexAI Intelligence Engine</p>
              </div>
            </div>
          </div>

          <div className="hero-scroll-indicator">
            <span>Scroll Down</span>
            <div className="mouse"></div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="section">
        <div className="container">
          <div className="section-title-container">
            <span className="section-subtitle"><b>About VerdexAI</b></span>
            <p className="section-description">
              Revolutionizing recruitment through artificial intelligence and machine learning.
            </p>
          </div>

          <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "40% 60%", gap: "3rem", alignItems: "start" }}>
            <div className="about-image-container" data-aos="fade-right" data-aos-duration="1000">
              <div className="about-image-wrapper">
                <div className="about-image-bg"></div>
                <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=600&fit=crop" alt="VerdexAI Project" className="about-image" />
                <div className="about-image-decoration"></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1.5rem" }}>
                <div style={{ borderRadius: "12px", overflow: "hidden" }} data-aos="fade-up" data-aos-delay="200">
                  <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=250&h=180&fit=crop" alt="AI Technology" style={{ width: "100%", height: "180px", objectFit: "cover" }} />
                </div>
                <div style={{ borderRadius: "12px", overflow: "hidden" }} data-aos="fade-up" data-aos-delay="300">
                  <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=250&h=180&fit=crop" alt="Data Analytics" style={{ width: "100%", height: "180px", objectFit: "cover" }} />
                </div>
              </div>
            </div>

            <div className="about-content" data-aos="fade-left" data-aos-duration="1000">
              <h3 className="about-heading">Who We Are</h3>
              <p className="about-text">
                VerdexAI is an AI-driven recruitment platform built by Muhammad Ibrahim, designed to
                transform how companies discover, evaluate, and hire talent. It combines machine
                learning with thoughtful UX to create the most efficient hiring experience possible.
              </p>

              <div className="about-cards" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "2rem" }}>
                <div className="about-card" data-aos="zoom-in" data-aos-duration="800" data-aos-delay="100">
                  <div className="about-card-icon"><i className="fas fa-brain"></i></div>
                  <h4 className="about-card-title">AI-Powered Screening</h4>
                  <p className="about-card-text">Intelligent candidate evaluation using machine learning</p>
                </div>
                <div className="about-card" data-aos="zoom-in" data-aos-duration="800" data-aos-delay="200">
                  <div className="about-card-icon"><i className="fas fa-users"></i></div>
                  <h4 className="about-card-title">Smart Matching</h4>
                  <p className="about-card-text">Precision candidate-job matching with advanced algorithms</p>
                </div>
                <div className="about-card" data-aos="zoom-in" data-aos-duration="800" data-aos-delay="300">
                  <div className="about-card-icon"><i className="fas fa-chart-line"></i></div>
                  <h4 className="about-card-title">Predictive Analytics</h4>
                  <p className="about-card-text">Data-driven insights for better hiring decisions</p>
                </div>
                <div className="about-card" data-aos="zoom-in" data-aos-duration="800" data-aos-delay="400">
                  <div className="about-card-icon"><i className="fas fa-robot"></i></div>
                  <h4 className="about-card-title">Automated Workflows</h4>
                  <p className="about-card-text">Streamlined recruitment process automation</p>
                </div>
              </div>

              <div className="skills-container" style={{ marginTop: "4rem", textAlign: "center" }}>
                <h3 className="skills-title" style={{ textAlign: "center" }}>Technology Stack</h3>
                <div className="skills-grid" style={{ justifyContent: "center", maxWidth: "900px", margin: "0 auto" }}>
                  <img src="https://img.shields.io/badge/-Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" className="skill-badge" data-aos="fade-up" data-aos-delay="100" />
                  <img src="https://img.shields.io/badge/-Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" className="skill-badge" data-aos="fade-up" data-aos-delay="150" />
                  <img src="https://img.shields.io/badge/-Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" className="skill-badge" data-aos="fade-up" data-aos-delay="200" />
                  <img src="https://img.shields.io/badge/-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" className="skill-badge" data-aos="fade-up" data-aos-delay="250" />
                  <img src="https://img.shields.io/badge/-Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" className="skill-badge" data-aos="fade-up" data-aos-delay="300" />
                  <img src="https://img.shields.io/badge/-TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" className="skill-badge" data-aos="fade-up" data-aos-delay="350" />
                  <img src="https://img.shields.io/badge/-OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI" className="skill-badge" data-aos="fade-up" data-aos-delay="400" />
                  <img src="https://img.shields.io/badge/-n8n-EA4B71?style=for-the-badge&logo=n8n&logoColor=white" alt="n8n" className="skill-badge" data-aos="fade-up" data-aos-delay="450" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="education" className="section section-bg-muted">
        <div className="container">
          <div className="section-title-container">
            <span className="section-subtitle">Our Process</span>
            <p className="section-description">
              How VerdexAI modules are delivered end-to-end: discovery → design → build → test.
            </p>
          </div>

          <div className="timeline-container">
            <div className="timeline-item" data-aos="fade-right" data-aos-duration="1000">
              <div className="timeline-content">
                <h3 className="timeline-title">1) Requirements Gathering</h3>
                <div className="timeline-subtitle"><i className="fas fa-clipboard-list"></i> Capture needs & acceptance criteria</div>
                <p className="timeline-description">Requirements are gathered with HR teams, user journeys are mapped, and everything is converted into clear acceptance criteria.</p>
              </div>
            </div>
            <div className="timeline-item" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="200">
              <div className="timeline-content">
                <h3 className="timeline-title">2) Design & Planning</h3>
                <div className="timeline-subtitle"><i className="fas fa-sitemap"></i> UX, architecture, integrations</div>
                <p className="timeline-description">UI/UX is designed, data models and API contracts are defined, and integrations like Firebase Auth, MongoDB, and n8n are planned.</p>
              </div>
            </div>
            <div className="timeline-item" data-aos="fade-right" data-aos-duration="1000" data-aos-delay="400">
              <div className="timeline-content">
                <h3 className="timeline-title">3) Implementation</h3>
                <div className="timeline-subtitle"><i className="fas fa-code"></i> Build, integrate, secure</div>
                <p className="timeline-description">Core modules are implemented: Job Posting, Applications, AI Ranking, and Online Tests — with protected routes and secure APIs.</p>
              </div>
            </div>
            <div className="timeline-item" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="600">
              <div className="timeline-content">
                <h3 className="timeline-title">4) Testing & Iteration</h3>
                <div className="timeline-subtitle"><i className="fas fa-vial"></i> Validate end-to-end flows</div>
                <p className="timeline-description">UI → API → AI generation is tested end-to-end and iterated on until each module is stable and ready to ship.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="experience" className="section">
        <div className="container">
          <div className="section-title-container">
            <span className="section-subtitle">Our Services</span>
            <p className="section-description">Comprehensive AI-powered recruitment solutions for modern teams.</p>
          </div>

          <div className="experience-container">
            <div className="experience-card" data-aos="fade-up" data-aos-duration="1000">
              <div className="experience-header">
                <h3 className="experience-company">AI-Powered Candidate Screening</h3>
                <span className="experience-date"><i className="fas fa-star"></i> Premium Service</span>
              </div>
              <p className="experience-position">Intelligent Resume Analysis & Candidate Evaluation</p>
              <ul className="experience-responsibilities">
                <li className="experience-responsibility"><i className="fas fa-check-circle"></i><span>AI algorithms analyze resumes and extract relevant skills and experience</span></li>
                <li className="experience-responsibility"><i className="fas fa-check-circle"></i><span>NLP for accurate candidate profile understanding</span></li>
                <li className="experience-responsibility"><i className="fas fa-check-circle"></i><span>Automated scoring and ranking based on job requirements</span></li>
                <li className="experience-responsibility"><i className="fas fa-check-circle"></i><span>Reduce screening time significantly while improving candidate quality</span></li>
              </ul>
            </div>

            <div className="experience-card" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
              <div className="experience-header">
                <h3 className="experience-company">Smart Candidate Matching</h3>
                <span className="experience-date"><i className="fas fa-star"></i> Core Feature</span>
              </div>
              <p className="experience-position">Precision Matching with Machine Learning</p>
              <ul className="experience-responsibilities">
                <li className="experience-responsibility"><i className="fas fa-check-circle"></i><span>AI matching algorithms connect candidates with ideal roles</span></li>
                <li className="experience-responsibility"><i className="fas fa-check-circle"></i><span>Considers skills, experience, and culture fit for optimal matches</span></li>
                <li className="experience-responsibility"><i className="fas fa-check-circle"></i><span>Continuous learning from hiring outcomes to improve accuracy</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Developer */}
      <section id="projects" className="section section-bg-muted">
        <div className="container">
          <div className="section-title-container">
            <h2 className="section-title">The Developer</h2>
            <p className="section-description">VerdexAI is designed, engineered, and maintained by Muhammad Ibrahim.</p>
          </div>

          <div className="developer-grid">
            <div className="team-card developer-card" data-aos="fade-up" data-aos-duration="1000">
              <div className="team-img-container">
                <img src="https://github.com/mibrahim-O2.png" alt="Muhammad Ibrahim" className="team-img" />
              </div>
              <h3 className="team-name">Muhammad Ibrahim</h3>
              <p className="team-role">Full Stack & AI Engineer</p>

              <p className="developer-bio" style = {{ textAlign: "justify" }}>
                BS Computer Science student at the Institute of Mathematics and Computer
                Science (IMCS), University of Sindh. Builds AI native, production-grade software
                from real client facing systems to research driven academic projects with a focus on
                clean architecture and practical AI integration rather than isolated experiments.
              </p>

              <div className="developer-highlights">
                <div className="developer-highlight">
                  <i className="fas fa-brain"></i>
                  <span style = {{ textAlign: "justify", display: "block" }}>
                    <strong>AI Tutor for Personalized Learning Recommendations (PLR)</strong> Project Lead, AI Lab Project 
                    Led a team building a Streamlit based AI Tutor that analyzes quiz performance and generates
                    personalized study recommendations, comparing a Rule-Based Engine against a tuned Decision Tree Classifier
                    (~85% accuracy) evaluated with Accuracy, Precision, Recall, F1-Score, and a Confusion Matrix with a full
                    explainability module logging step-by-step reasoning for every prediction.
                  </span>
                </div>
                <div className="developer-highlight">
                  <i className="fas fa-code-branch"></i>
                  <span>Comfortable across the full AI/ML stack LLM integration, vector databases, embeddings and modern full-stack web development</span>
                </div>
                <div className="developer-highlight">
                  <i className="fas fa-seedling"></i>
                  <span>Designed and deployed a real production system for a family dairy farm business, in active monthly use</span>
                </div>
              </div>

              <div className="team-social">
                <a href="https://linkedin.com/in/muhammad-ibrahim-o2" target="_blank" className="team-social-link" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                <a href="https://github.com/mibrahim-O2" target="_blank" className="team-social-link" aria-label="GitHub"><i className="fab fa-github"></i></a>
                <a href="https://x.com/MIbraheem_02" target="_blank" className="team-social-link" aria-label="X (Twitter)"><XLogo className="w-4 h-4" /></a>
                <a href="https://www.facebook.com/profile.php?id=100085369586705" target="_blank" className="team-social-link" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section">
        <div className="container">
          <div className="section-title-container">
            <h2 className="section-title">Get In Touch</h2>
            <p className="section-description">Have a question, opportunity, or feedback? Reach out directly or send a message below.</p>
          </div>

          <div className="contact-grid">
            <div data-aos="fade-right" data-aos-duration="1000">
              <h3 className="contact-info-title">Contact Information</h3>
              <div className="contact-info-items">
                <div className="contact-info-item">
                  <div className="contact-info-icon"><i className="fas fa-envelope"></i></div>
                  <div className="contact-info-content">
                    <h3>Email</h3>
                    <a href="mailto:mibrahimkhalid306@gmail.com">mibrahimkhalid306@gmail.com</a>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-icon"><i className="fas fa-phone"></i></div>
                  <div className="contact-info-content">
                    <h3>Phone</h3>
                    <a href="tel:+923242991303">+92 324 2991303</a>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-icon"><XLogo className="w-4 h-4" /></div>
                  <div className="contact-info-content">
                    <h3>X (Twitter)</h3>
                    <a href="https://x.com/MIbraheem_02" target="_blank" rel="noopener noreferrer">@MIbraheem_02</a>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-icon"><i className="fab fa-facebook-f"></i></div>
                  <div className="contact-info-content">
                    <h3>Facebook</h3>
                    <a href="https://www.facebook.com/profile.php?id=100085369586705" target="_blank" rel="noopener noreferrer">View Profile</a>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-icon"><i className="fab fa-linkedin-in"></i></div>
                  <div className="contact-info-content">
                    <h3>LinkedIn</h3>
                    <a href="https://linkedin.com/in/muhammad-ibrahim-o2" target="_blank" rel="noopener noreferrer">linkedin.com/in/muhammad-ibrahim-o2</a>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-icon"><i className="fab fa-github"></i></div>
                  <div className="contact-info-content">
                    <h3>GitHub</h3>
                    <a href="https://github.com/mibrahim-O2" target="_blank" rel="noopener noreferrer">github.com/mibrahim-O2</a>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-icon"><i className="fas fa-map-marker-alt"></i></div>
                  <div className="contact-info-content">
                    <h3>Location</h3>
                    <p>Jamshoro, Sindh, Pakistan | Remote-Friendly</p>
                  </div>
                </div>
              </div>
            </div>

            <div data-aos="fade-left" data-aos-duration="1000">
              <div className="contact-form-container">
                <h3 className="contact-form-title">Send a Message</h3>
                <div id="form-success" className="form-success">
                  <i className="fas fa-check-circle"></i> Thank you for your message! I&apos;ll get back to you soon.
                </div>
                <div id="form-error" className="form-error" role="alert">
                  <i className="fas fa-exclamation-circle"></i>
                  <span id="form-error-text"></span>
                </div>
                <form
                  id="contact-form"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const submitBtn = form.querySelector(".submit-btn");
                    const formSuccess = document.getElementById("form-success");
                    const formError = document.getElementById("form-error");
                    const formErrorText = document.getElementById("form-error-text");
                    const originalBtnText = submitBtn.innerHTML;

                    formError?.classList.remove("active");
                    if (formErrorText) formErrorText.textContent = "";

                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                    submitBtn.disabled = true;

                    const fd = new FormData(form);
                    const body = {
                      name: fd.get("name"),
                      email: fd.get("email"),
                      subject: fd.get("subject"),
                      message: fd.get("message"),
                    };

                    const url = `${config.api.getBaseUrl()}${config.endpoints.contact.submit}`;

                    try {
                      const res = await fetch(url, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(body),
                      });
                      const data = await res.json().catch(() => ({}));
                      if (!res.ok) {
                        throw new Error(data.error || "Something went wrong. Please try again.");
                      }
                      form.reset();
                      formSuccess?.classList.add("active");
                      setTimeout(() => formSuccess?.classList.remove("active"), 5000);
                    } catch (err) {
                      if (formErrorText) {
                        formErrorText.textContent = err instanceof Error ? err.message : "Failed to send message.";
                      }
                      formError?.classList.add("active");
                    } finally {
                      submitBtn.innerHTML = originalBtnText;
                      submitBtn.disabled = false;
                    }
                  }}
                >
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">Your Name</label>
                      <input type="text" id="name" name="name" className="form-control" placeholder="Your name" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">Your Email</label>
                      <input type="email" id="email" name="email" className="form-control" placeholder="you@example.com" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject" className="form-label">Subject</label>
                    <input type="text" id="subject" name="subject" className="form-control" placeholder="How can I help you?" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message" className="form-label">Message</label>
                    <textarea id="message" name="message" className="form-control form-message" placeholder="Your message here..." required></textarea>
                  </div>
                  <button type="submit" className="submit-btn">
                    <i className="fas fa-paper-plane"></i> Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div>
              <div className="footer-brand">
                <BrandLogo />
              </div>
              <p className="footer-description">
                AI-Powered Recruitment Solutions | Transform Your Hiring Process | Smarter, Faster, Better
              </p>
              <div className="footer-social">
                <a href="https://github.com/mibrahim-O2" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="GitHub"><i className="fab fa-github"></i></a>
                <a href="https://linkedin.com/in/muhammad-ibrahim-o2" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                <a href="https://x.com/MIbraheem_02" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="X (Twitter)"> <XLogo className="w-4 h-4" /> </a>
                <a href="https://www.facebook.com/profile.php?id=100085369586705" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              </div>
            </div>

            <div>
              <h3 className="footer-heading">Quick Links</h3>
              <div className="footer-links">
                <a href="#home" className="footer-link" onClick={(e) => scrollToSection(e, "home")}><i className="fas fa-chevron-right"></i> Home</a>
                <a href="#about" className="footer-link" onClick={(e) => scrollToSection(e, "about")}><i className="fas fa-chevron-right"></i> About</a>
                <a href="#education" className="footer-link" onClick={(e) => scrollToSection(e, "education")}><i className="fas fa-chevron-right"></i> Our Process</a>
                <a href="#experience" className="footer-link" onClick={(e) => scrollToSection(e, "experience")}><i className="fas fa-chevron-right"></i> Services</a>
                <a href="#projects" className="footer-link" onClick={(e) => scrollToSection(e, "projects")}><i className="fas fa-chevron-right"></i> Developer</a>
                <a href="#contact" className="footer-link" onClick={(e) => scrollToSection(e, "contact")}><i className="fas fa-chevron-right"></i> Contact</a>
              </div>
            </div>

            <div>
              <h3 className="footer-heading">Contact Info</h3>
              <div className="footer-links">
                <a href="mailto:mibrahimkhalid306@gmail.com" className="footer-link"><i className="fas fa-envelope"></i> mibrahimkhalid306@gmail.com</a>
                <a href="tel:+923242991303" className="footer-link"><i className="fas fa-phone"></i> +92 324 2991303</a>
                <a href="https://x.com/MIbraheem_02" target="_blank" rel="noopener noreferrer" className="footer-link"> <XLogo className="w-4 h-4" />  X (Twitter)</a>
                <a href="https://www.facebook.com/profile.php?id=100085369586705" target="_blank" rel="noopener noreferrer" className="footer-link"><i className="fab fa-facebook-f"></i> Facebook</a>
                <span className="footer-link" style={{ cursor: "default" }}><i className="fas fa-map-marker-alt"></i> Jamshoro, Sindh, Pakistan</span>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">&copy; {new Date().getFullYear()} VerdexAI. Built by Muhammad Ibrahim. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      <Script id="init-tilt" strategy="lazyOnload">
        {`
          if (typeof VanillaTilt !== 'undefined') {
            const tiltElements = document.querySelectorAll('.team-card, .experience-card, .timeline-item, .contact-info-item');
            if (tiltElements.length > 0) {
              VanillaTilt.init(tiltElements, { max: 5, speed: 400, glare: true, 'max-glare': 0.2, scale: 1.02, perspective: 1000 });
            }
          }
        `}
      </Script>

      <Script id="init-cursor" strategy="lazyOnload">
        {`
          const cursor = document.querySelector('.cursor');
          const cursorFollower = document.querySelector('.cursor-follower');
          if (cursor && cursorFollower) {
            document.addEventListener('mousemove', function(e) {
              cursor.style.left = e.clientX + 'px';
              cursor.style.top = e.clientY + 'px';
              setTimeout(function() {
                cursorFollower.style.left = e.clientX + 'px';
                cursorFollower.style.top = e.clientY + 'px';
              }, 100);
            });
            document.addEventListener('mousedown', function() {
              cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
              cursorFollower.style.transform = 'translate(-50%, -50%) scale(0.8)';
            });
            document.addEventListener('mouseup', function() {
              cursor.style.transform = 'translate(-50%, -50%) scale(1)';
              cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
            });
            const links = document.querySelectorAll('a, button, .skill-badge');
            links.forEach(link => {
              link.addEventListener('mouseenter', function() {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursor.style.opacity = '0.5';
                cursorFollower.style.width = '60px';
                cursorFollower.style.height = '60px';
              });
              link.addEventListener('mouseleave', function() {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.opacity = '0.7';
                cursorFollower.style.width = '40px';
                cursorFollower.style.height = '40px';
              });
            });
          }
        `}
      </Script>
    </div>
  );
}