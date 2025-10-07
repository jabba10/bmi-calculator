import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './HomePage.module.css';

const HomePage = () => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  return (
    <>
      <Head>
        <title>Free BMI Calculator | Instant, Private & Accurate Body Mass Index Tool</title>
        <meta
          name="description"
          content="Calculate your Body Mass Index instantly with our free, private, no-sign-up BMI calculator. Works on all devices — even offline."
        />
        <meta
          name="keywords"
          content="BMI calculator, body mass index calculator, free BMI tool, calculate BMI, healthy weight calculator, instant BMI, private BMI"
        />
        <meta name="author" content="BMICalculator.app" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.instantbmi.com/" />
        <meta property="og:title" content="Free BMI Calculator | Get Your Result in Seconds" />
        <meta
          property="og:description"
          content="A fast, private, and completely free tool to calculate your Body Mass Index. No registration, no tracking, works on any device."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.instantbmi.com/" />
        <meta property="og:image" content="https://www.instantbmi.com/images/og-bmi-calculator.jpg" />
        <meta property="og:image:alt" content="Person using a mobile phone to calculate BMI with clean interface" />
        <meta property="og:site_name" content="BMICalculator.app" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@yourhandle" />
        <meta name="twitter:title" content="Instant Free BMI Calculator - No Sign-Up Needed" />
        <meta
          name="twitter:description"
          content="Calculate your BMI in seconds. 100% private, always free, no email required. Try it now!"
        />
        <meta name="twitter:image" content="https://www.instantbmi.com/images/og-bmi-calculator.jpg" />
        <meta name="twitter:image:alt" content="Clean UI of a BMI calculator showing input fields and result" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Free BMI Calculator",
              "url": "https://www.instantbmi.com/",
              "description":
                "An easy-to-use online tool that calculates your Body Mass Index (BMI) based on height and weight, with instant results and no personal data collection.",
              "applicationCategory": "Health",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
              },
              "featureList": "Calculate BMI, supports metric/imperial units, mobile-friendly, works offline",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "429"
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "https://www.instantbmi.com/"
              }
            })
          }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={styles.homePage}>
        <div className={styles.homeContainer}>
          {/* Hero Section */}
          <section className={styles.heroSection}>
            <h1 className={styles.heroTitle}>Free BMI Calculator</h1>
            <p className={styles.heroSubtitle}>
              Instantly calculate your Body Mass Index
            </p>
            <Link href="/bmi-calculator-and-more" className={styles.heroCta}>
              Calculate Your BMI Now
            </Link>
          </section>

          {/* Dropdown Info Section */}
          <section className={styles.infoSection}>
            <h2 className={styles.infoTitle}>What Makes Us Different</h2>
            <p className={styles.infoIntro}>Tap to learn why users love our simple, private BMI tool.</p>

            <div className={styles.dropdownsContainer}>
              {/* Dropdown 1 */}
              <div className={styles.dropdownCard}>
                <button
                  className={styles.dropdownHeader}
                  onClick={() => toggleDropdown(1)}
                  aria-expanded={openDropdown === 1}
                >
                  <span>🔒 100% Private & Anonymous</span>
                  <span className={styles.dropdownIcon}>{openDropdown === 1 ? '−' : '+'}</span>
                </button>
                {openDropdown === 1 && (
                  <div className={styles.dropdownContent}>
                    <p>
                      We don't ask for your name, email, or any personal info. We don't use cookies or analytics. Your height and weight never leave your browser.
                    </p>
                  </div>
                )}
              </div>

              {/* Dropdown 2 */}
              <div className={styles.dropdownCard}>
                <button
                  className={styles.dropdownHeader}
                  onClick={() => toggleDropdown(2)}
                  aria-expanded={openDropdown === 2}
                >
                  <span>🆓 Completely Free Forever</span>
                  <span className={styles.dropdownIcon}>{openDropdown === 2 ? '−' : '+'}</span>
                </button>
                {openDropdown === 2 && (
                  <div className={styles.dropdownContent}>
                    <p>
                      No hidden fees, no premium upsells, no "pro version." Use it as often as you want — for yourself, your family, your clients. Always free.
                    </p>
                  </div>
                )}
              </div>

              {/* Dropdown 3 */}
              <div className={styles.dropdownCard}>
                <button
                  className={styles.dropdownHeader}
                  onClick={() => toggleDropdown(3)}
                  aria-expanded={openDropdown === 3}
                >
                  <span>⚡ Instant, No Sign-Up Required</span>
                  <span className={styles.dropdownIcon}>{openDropdown === 3 ? '−' : '+'}</span>
                </button>
                {openDropdown === 3 && (
                  <div className={styles.dropdownContent}>
                    <p>
                      No registration. No email confirmation. Just open the site, enter your details, and get your BMI result in under 3 seconds.
                    </p>
                  </div>
                )}
              </div>

              {/* Dropdown 4 */}
              <div className={styles.dropdownCard}>
                <button
                  className={styles.dropdownHeader}
                  onClick={() => toggleDropdown(4)}
                  aria-expanded={openDropdown === 4}
                >
                  <span>📱 Works Everywhere — Even Offline</span>
                  <span className={styles.dropdownIcon}>{openDropdown === 4 ? '−' : '+'}</span>
                </button>
                {openDropdown === 4 && (
                  <div className={styles.dropdownContent}>
                    <p>
                      Responsive on all devices — phones, tablets, desktops. Once loaded, it even works offline. Perfect for clinics, schools, or personal use anywhere.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className={styles.ctaSection} id="calculator">
            <h2 className={styles.ctaTitle}>Ready to Calculate Your BMI?</h2>
            <p className={styles.ctaText}>No sign-up. No tracking. Just results.</p>
            <div className={styles.buttonGroup}>
              <Link href="/about" className={styles.secondaryBtn}>
                Learn More
              </Link>
              <Link href="/contact" className={styles.primaryBtn}>
                Contact Us
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default HomePage;