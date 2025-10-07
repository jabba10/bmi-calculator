'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* SEO Structured Data for Navigation */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SiteNavigationElement",
            "name": "BMI Calculator Navigation",
            "description": "Main navigation menu for BMICalculatorAndMore website",
            "mainEntity": [
              {
                "@type": "SiteNavigationElement",
                "name": "Home",
                "url": "https://www.bmicalculatorandmore.com/",
                "position": 1
              },
              {
                "@type": "SiteNavigationElement",
                "name": "Calculators",
                "url": "https://www.bmicalculatorandmore.com/calculators",
                "position": 2
              },
              {
                "@type": "SiteNavigationElement",
                "name": "About",
                "url": "https://www.bmicalculatorandmore.com/about",
                "position": 3
              },
              {
                "@type": "SiteNavigationElement",
                "name": "Contact",
                "url": "https://www.bmicalculatorandmore.com/contact",
                "position": 4
              }
            ]
          })
        }}
      />

      <nav className={styles.navbar} role="navigation" aria-label="Main navigation">
        <div className={styles.navbarContainer}>
          {/* Logo / Brand */}
          <div className={styles.navbarBrand}>
            <Link 
              href="/" 
              className={styles.navbarLogo}
              onClick={closeMenu}
              aria-label="BMICalculatorAndMore - Home"
            >
              InstantBMI
            </Link>
          </div>

          {/* Desktop Menu */}
          <ul className={`${styles.navbarMenu} ${isMenuOpen ? styles.active : ''}`}>
            <li className={styles.navbarItem}>
              <Link 
                href="/" 
                className={styles.navbarLink}
                onClick={closeMenu}
                aria-current="page"
              >
                Home
              </Link>
            </li>
            <li className={styles.navbarItem}>
              <Link 
                href="/bmi-calculator-and-more" 
                className={styles.navbarLink}
                onClick={closeMenu}
              >
                Calculators
              </Link>
            </li>
            <li className={styles.navbarItem}>
              <Link 
                href="/about" 
                className={styles.navbarLink}
                onClick={closeMenu}
              >
                About
              </Link>
            </li>
            <li className={styles.navbarItem}>
              <Link 
                href="/contact" 
                className={styles.navbarLink}
                onClick={closeMenu}
              >
                Contact
              </Link>
            </li>
          </ul>

          {/* Mobile Hamburger */}
          <button 
            className={styles.navbarToggle}
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            aria-controls="navbar-menu"
          >
            <span className={`${styles.bar} ${isMenuOpen ? styles.bar1Active : ''}`}></span>
            <span className={`${styles.bar} ${isMenuOpen ? styles.bar2Active : ''}`}></span>
            <span className={`${styles.bar} ${isMenuOpen ? styles.bar3Active : ''}`}></span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;