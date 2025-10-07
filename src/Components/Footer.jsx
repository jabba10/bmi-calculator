import Link from 'next/link';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* SEO Structured Data for Footer */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "BMICalculatorAndMore",
            "url": "https://www.bmicalculatorandmore.com/",
            "description": "Free, private, no-sign-up BMI calculator and health tools that run entirely in your browser.",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "US"
            },
            "knowsAbout": [
              "BMI Calculator",
              "Health Tools",
              "Body Mass Index",
              "Health Assessment"
            ],
            "foundingDate": "2023",
            "areaServed": "Worldwide",
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Health Calculators",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "BMI Calculator",
                    "description": "Free Body Mass Index calculator"
                  }
                }
              ]
            }
          })
        }}
      />

      <footer className={styles.siteFooter} role="contentinfo">
        <div className={styles.footerContainer}>
          
          {/* Brand & Tagline Card */}
          <div className={styles.footerCard}>
            <div className={styles.footerBrand}>
              <h3 className={styles.footerLogo}>InstantBMI</h3>
              <p className={styles.footerTagline}>
                Free. Private. No sign-up. Everything runs in your browser.
              </p>
            </div>
          </div>

          {/* Quick Links Card */}
          <div className={styles.footerCard}>
            <div className={styles.footerLinks}>
              <h4 className={styles.footerHeading}>Quick Links</h4>
              <ul className={styles.linksList} role="list">
                <li>
                  <Link href="/" className={styles.footerLink}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/bmi-calculator-and-more" className={styles.footerLink}>
                    Calculate BMI
                  </Link>
                </li>
                <li>
                  <Link href="/about" className={styles.footerLink}>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className={styles.footerLink}>
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className={styles.footerLink}>
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Legal & Privacy Card */}
          <div className={styles.footerCard}>
            <div className={styles.footerLegal}>
              <h4 className={styles.footerHeading}>Privacy & Legal</h4>
              <ul className={styles.linksList} role="list">
                <li className={styles.legalItem}>
                  <span className={styles.legalIcon}>🔒</span>
                  No data stored
                </li>
                <li className={styles.legalItem}>
                  <span className={styles.legalIcon}>🍪</span>
                  No cookies or tracking
                </li>
                <li className={styles.legalItem}>
                  <span className={styles.legalIcon}>📄</span>
                  Medical disclaimer included
                </li>
                <li className={styles.copyright}>
                  © {currentYear} InstantBMI
                </li>
              </ul>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
};

export default Footer;