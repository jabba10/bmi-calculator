import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from './Policy.module.css';

const PrivacyPolicy = () => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  return (
    <>
      <Head>
        <title>Privacy Policy | InstantBMI.com - No Tracking, Ever</title>
        <meta
          name="description"
          content="We collect zero personal data. Your BMI calculations are private, anonymous, and never stored or transmitted."
        />
        <meta
          name="keywords"
          content="privacy policy, BMI calculator privacy, no data collection, anonymous health tool, secure BMI app"
        />
        <meta name="author" content="InstantBMI.com" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.instantbmi.com/privacy-policy" />

        <meta property="og:title" content="Privacy Policy - 100% Private BMI Calculator" />
        <meta
          property="og:description"
          content="Your privacy is our priority. We do not collect, store, or share any personal information. Period."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.instantbmi.com/privacy-policy" />
        <meta property="og:image" content="https://www.instantbmi.com/images/og-privacy.jpg" />
        <meta property="og:image:alt" content="Shield protecting user data on a digital scale" />
        <meta property="og:site_name" content="InstantBMI.com" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@yourhandle" />
        <meta name="twitter:title" content="Our Privacy Promise: Zero Data Collection" />
        <meta
          name="twitter:description"
          content="We don't track you. Your BMI data stays in your browser. Always private. Always free."
        />
        <meta name="twitter:image" content="https://www.instantbmi.com/images/og-privacy.jpg" />
        <meta name="twitter:image:alt" content="Digital lock securing health data" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "PrivacyPolicy",
              "name": "Privacy Policy",
              "url": "https://www.instantbmi.com/privacy-policy",
              "governs": {
                "@type": "WebApplication",
                "name": "Free BMI Calculator",
                "url": "https://www.instantbmi.com/"
              },
              "termsOfService": "https://www.instantbmi.com/terms",
              "potentialAction": {
                "@type": "ReadAction",
                "target": "https://www.instantbmi.com/privacy-policy"
              },
              "provider": {
                "@type": "Organization",
                "name": "InstantBMI.com"
              },
              "isBasedOn": "https://gdpr.eu/",
              "dateModified": "2025-04-05"
            })
          }}
        />
      </Head>

      <main className={styles.policyPage}>
        <div className={styles.policyContainer}>
          {/* Hero Section */}
          <section className={styles.heroSection}>
            <h1 className={styles.heroTitle}>Privacy Policy</h1>
            <p className={styles.heroSubtitle}>
              Transparent. Simple. Zero data collection.
            </p>
            <Link href="/" className={styles.heroCta}>Back to Homepage</Link>
          </section>

          {/* Info Section with Dropdowns */}
          <section className={styles.infoSection}>
            <h2 className={styles.infoTitle}>Your Privacy, Guaranteed</h2>
            <p className={styles.infoIntro}>
              We believe your health data belongs only to you. Here's how we protect it.
            </p>

            <div className={styles.dropdownsContainer}>
              {/* Dropdown 1: No Personal Data Collected */}
              <div className={styles.dropdownCard}>
                <button
                  className={styles.dropdownHeader}
                  onClick={() => toggleDropdown(1)}
                  aria-expanded={openDropdown === 1}
                >
                  <span>🔒 We Collect No Personal Information</span>
                  <span className={styles.dropdownIcon}>{openDropdown === 1 ? '−' : '+'}</span>
                </button>
                {openDropdown === 1 && (
                  <div className={styles.dropdownContent}>
                    <p>
                      We do not ask for your name, email address, phone number, or any identifying information. 
                      You can use our InstantBMI completely anonymously — no sign-up, no forms, no tracking.
                    </p>
                  </div>
                )}
              </div>

              {/* Dropdown 2: Calculations Stay in Your Browser */}
              <div className={styles.dropdownCard}>
                <button
                  className={styles.dropdownHeader}
                  onClick={() => toggleDropdown(2)}
                  aria-expanded={openDropdown === 2}
                >
                  <span>🧠 All Calculations Happen Locally</span>
                  <span className={styles.dropdownIcon}>{openDropdown === 2 ? '−' : '+'}</span>
                </button>
                {openDropdown === 2 && (
                  <div className={styles.dropdownContent}>
                    <p>
                      Your height, weight, and BMI results never leave your device. 
                      The calculation is performed entirely in your browser. 
                      Nothing is sent to our servers or third parties.
                    </p>
                  </div>
                )}
              </div>

              {/* Dropdown 3: No Cookies or Analytics */}
              <div className={styles.dropdownCard}>
                <button
                  className={styles.dropdownHeader}
                  onClick={() => toggleDropdown(3)}
                  aria-expanded={openDropdown === 3}
                >
                  <span>🚫 No Cookies, No Tracking Scripts</span>
                  <span className={styles.dropdownIcon}>{openDropdown === 3 ? '−' : '+'}</span>
                </button>
                {openDropdown === 3 && (
                  <div className={styles.dropdownContent}>
                    <p>
                      We do not use Google Analytics, Facebook Pixel, or any other tracking technology. 
                      No cookies are set. We cannot and do not monitor your usage behavior.
                    </p>
                  </div>
                )}
              </div>

              {/* Dropdown 4: Secure & Offline-Compatible */}
              <div className={styles.dropdownCard}>
                <button
                  className={styles.dropdownHeader}
                  onClick={() => toggleDropdown(4)}
                  aria-expanded={openDropdown === 4}
                >
                  <span>🛡️ Fully Secure & Works Offline</span>
                  <span className={styles.dropdownIcon}>{openDropdown === 4 ? '−' : '+'}</span>
                </button>
                {openDropdown === 4 && (
                  <div className={styles.dropdownContent}>
                    <p>
                      Our site uses HTTPS encryption. Once loaded, the calculator works even without internet access — 
                      making it safe for use in clinics, schools, or private settings where connectivity isn't guaranteed.
                    </p>
                  </div>
                )}
              </div>

              {/* Dropdown 5: Third-Party Services */}
              <div className={styles.dropdownCard}>
                <button
                  className={styles.dropdownHeader}
                  onClick={() => toggleDropdown(5)}
                  aria-expanded={openDropdown === 5}
                >
                  <span>🔌 Minimal Third-Party Dependencies</span>
                  <span className={styles.dropdownIcon}>{openDropdown === 5 ? '−' : '+'}</span>
                </button>
                {openDropdown === 5 && (
                  <div className={styles.dropdownContent}>
                    <p>
                      We only use essential services like hosting and domain providers. 
                      No third party has access to user data because no data exists to share.
                    </p>
                    <p>
                      If ads or external tools are added in the future, this policy will be updated with clear notice.
                    </p>
                  </div>
                )}
              </div>

              {/* Dropdown 6: Children's Privacy */}
              <div className={styles.dropdownCard}>
                <button
                  className={styles.dropdownHeader}
                  onClick={() => toggleDropdown(6)}
                  aria-expanded={openDropdown === 6}
                >
                  <span>👶 Children's Privacy</span>
                  <span className={styles.dropdownIcon}>{openDropdown === 6 ? '−' : '+'}</span>
                </button>
                {openDropdown === 6 && (
                  <div className={styles.dropdownContent}>
                    <p>
                      Our service is safe for users of all ages. Since we collect no personal information, 
                      there are no special restrictions or requirements for children's use.
                    </p>
                    <p>
                      Parents can feel confident allowing their children to use our calculator for educational purposes.
                    </p>
                  </div>
                )}
              </div>

              {/* Dropdown 7: Policy Updates */}
              <div className={styles.dropdownCard}>
                <button
                  className={styles.dropdownHeader}
                  onClick={() => toggleDropdown(7)}
                  aria-expanded={openDropdown === 7}
                >
                  <span>🔄 How This Policy May Change</span>
                  <span className={styles.dropdownIcon}>{openDropdown === 7 ? '−' : '+'}</span>
                </button>
                {openDropdown === 7 && (
                  <div className={styles.dropdownContent}>
                    <p>
                      We may update this privacy policy occasionally to reflect changes in functionality or legal requirements. 
                      Any updates will be posted here with a revised "Last Updated" date.
                    </p>
                    <p>
                      We encourage you to review this page periodically. 
                      Continued use of the service after changes constitutes acceptance.
                    </p>
                  </div>
                )}
              </div>

              {/* Dropdown 8: Contact Us */}
              <div className={styles.dropdownCard}>
                <button
                  className={styles.dropdownHeader}
                  onClick={() => toggleDropdown(8)}
                  aria-expanded={openDropdown === 8}
                >
                  <span>📬 Have Questions?</span>
                  <span className={styles.dropdownIcon}>{openDropdown === 8 ? '−' : '+'}</span>
                </button>
                {openDropdown === 8 && (
                  <div className={styles.dropdownContent}>
                    <p>
                      We're committed to transparency and user trust. 
                      If you have any questions about our privacy practices, please reach out:
                    </p>
                    <p>
                      <strong>Website:</strong> <Link href="/contact">Contact Form</Link>
                    </p>
                    <p>
                      We respond to all legitimate requests within 7 business days.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className={styles.ctaSection}>
            <h2 className={styles.ctaTitle}>Your Data, Your Control</h2>
            <p className={styles.ctaText}>No hidden policies. No fine print. Just honest privacy.</p>
            <div className={styles.buttonGroup}>
              <Link href="/bmi-calculator-and-more" className={styles.primaryBtn}>Use the Calculator</Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default PrivacyPolicy;