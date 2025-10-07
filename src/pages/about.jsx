import Head from 'next/head';
import Link from 'next/link';
import styles from './About.module.css';

const AboutUs = () => {
  return (
    <>
      {/* === SEO & Metadata with Next.js Head === */}
      <Head>
        {/* Page Title */}
        <title>About InstantBMI | Free, Private BMI Calculator</title>

        {/* Meta Description */}
        <meta
          name="description"
          content="Learn about BMICalculatorAndMore - your free, private, no-sign-up BMI calculator. No data tracking, instant results, 100% in your browser."
        />

        {/* Keywords */}
        <meta
          name="keywords"
          content="about BMI calculator, privacy-focused health tool, free body mass index, no data tracking, browser-based calculator"
        />

        {/* Author & Indexing */}
        <meta name="author" content="BMICalculatorAndMore" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.instantbmi.com/about" />

        {/* Open Graph Tags */}
        <meta property="og:title" content="About InstantBMI | Privacy-First Health Tools" />
        <meta
          property="og:description"
          content="Discover why we built a completely private, free BMI calculator that works 100% in your browser with no data collection."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.instantbmi.com/about" />
        <meta property="og:image" content="https://www.instantbmi.com/images/og-about-bmi.jpg" />
        <meta property="og:image:alt" content="About InstantBMI - Privacy First Health Tools" />
        <meta property="og:site_name" content="InstantBMI" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@yourhandle" />
        <meta name="twitter:title" content="About Our Privacy-First BMI Calculator" />
        <meta
          name="twitter:description"
          content="Learn how our BMI calculator protects your privacy with zero data collection and instant browser-based calculations."
        />
        <meta name="twitter:image" content="https://www.instantbmi.com/images/og-about-bmi.jpg" />

        {/* Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AboutPage",
              "name": "About InstantBMI",
              "description": "Information about our free, private BMI calculator that works entirely in your browser with no data collection.",
              "url": "https://www.instantbmi.com/about",
              "mainEntity": {
                "@type": "Organization",
                "name": "InstantBMI",
                "description": "Provider of free, privacy-focused health calculation tools",
                "url": "https://www.instantbmi.com",
                "foundingPrinciples": "Privacy, Accessibility, Simplicity",
                "knowsAbout": ["BMI Calculation", "Health Metrics", "Privacy Protection", "Web Technologies"],
                "areaServed": "Worldwide",
                "additionalProperty": {
                  "@type": "PropertyValue",
                  "name": "Data Collection Policy",
                  "value": "Zero data collection - all calculations happen in user's browser"
                }
              }
            })
          }}
        />

        {/* Viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* === Main Component === */}
      <div className={styles.aboutPage}>
        <main className={styles.aboutMain}>
          <div className={styles.aboutContainer}>
            <div className={styles.aboutCard}>
              
              {/* Header Section */}
              <header className={styles.aboutHeader}>
                <h1 className={styles.aboutTitle}>About InstantBMI</h1>
                <p className={styles.aboutIntro}>
                  Welcome to <strong>InstantBMI</strong> — your simple, private, and free tool to calculate your Body Mass Index without any sign-up or data tracking.
                </p>
              </header>

              {/* Why We Built This Section */}
              <section className={styles.aboutSection} aria-labelledby="why-built">
                <h2 id="why-built" className={styles.sectionTitle}>Why We Built This</h2>
                <p className={styles.sectionText}>
                  We believe health tools should be accessible to everyone — without barriers. That's why we created a BMI calculator that works instantly, requires no registration, and respects your privacy.
                </p>
              </section>

              {/* How It Works Section */}
              <section className={styles.aboutSection} aria-labelledby="how-works">
                <h2 id="how-works" className={styles.sectionTitle}>How It Works</h2>
                <ul className={styles.featureList} role="list">
                  <li className={styles.featureItem}>
                    <span className={styles.checkmark}>✅</span>
                    Enter your height and weight — that's it.
                  </li>
                  <li className={styles.featureItem}>
                    <span className={styles.checkmark}>✅</span>
                    Instantly see your BMI result with category (Underweight, Normal, Overweight, Obese).
                  </li>
                  <li className={styles.featureItem}>
                    <span className={styles.checkmark}>✅</span>
                    No servers involved — calculation happens 100% in your browser.
                  </li>
                  <li className={styles.featureItem}>
                    <span className={styles.checkmark}>✅</span>
                    No cookies, no tracking, no analytics — we don't even know you visited.
                  </li>
                </ul>
              </section>

              {/* Privacy Section */}
              <section className={styles.aboutSection} aria-labelledby="privacy">
                <h2 id="privacy" className={styles.sectionTitle}>Your Privacy Matters</h2>
                <p className={styles.sectionText}>
                  We do <strong>not</strong> collect, store, or transmit any personal data. Not your height, not your weight, not your IP address. Everything you enter stays on your device. Period.
                </p>
                <p className={styles.privacyHighlight}>
                  <strong>This is a true zero-data website.</strong>
                </p>
              </section>

              {/* Built For Everyone Section */}
              <section className={styles.aboutSection} aria-labelledby="for-everyone">
                <h2 id="for-everyone" className={styles.sectionTitle}>Built For Everyone</h2>
                <p className={styles.sectionText}>
                  Whether you're on a desktop, tablet, or phone — our calculator works flawlessly. No sign-up. No ads. No nonsense.
                </p>
                <p className={styles.sectionText}>
                  Use it as often as you like. Share it with friends. Bookmark it. It's free — forever.
                </p>
              </section>

              {/* CTA Section */}
              <section className={styles.ctaSection}>
                <Link href="/bmi-calculator-and-more" className={styles.ctaButton}>
                  Try the BMI Calculator Now
                </Link>
              </section>

            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AboutUs;