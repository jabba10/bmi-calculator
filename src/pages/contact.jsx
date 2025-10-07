import Head from 'next/head';
import { useState, useRef } from 'react';
import styles from './Contact.module.css';

const Contact = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const formRef = useRef(null);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Enhanced form validation
  const validateForm = () => {
    const { name, email, subject, message } = formState;
    
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      return 'All fields are required';
    }

    if (name.length < 2 || name.length > 100) {
      return 'Name must be between 2 and 100 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }

    if (subject.length < 5 || subject.length > 200) {
      return 'Subject must be between 5 and 200 characters';
    }

    if (message.length < 10 || message.length > 2000) {
      return 'Message must be between 10 and 2000 characters';
    }

    // Check for potential spam patterns
    const spamPatterns = [
      /http(s)?:\/\//i,
      /\[url\]/i,
      /<a href/i,
      /viagra|cialis|casino|porn/i
    ];

    if (spamPatterns.some(pattern => pattern.test(message) || pattern.test(subject))) {
      return 'Message contains suspicious content';
    }

    return null;
  };

  // Handle form submission via formsubmit.co
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;

    const validationError = validateForm();
    if (validationError) {
      setSubmitStatus({ type: 'error', message: validationError });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Prepare form data for formsubmit.co
      const formData = new FormData();
      formData.append('name', formState.name);
      formData.append('email', formState.email);
      formData.append('subject', formState.subject);
      formData.append('message', formState.message);

      // Submit to formsubmit.co endpoint
      const response = await fetch('https://formsubmit.co/contact@instantbmi.com', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json'
        }
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus({ 
          type: 'success', 
          message: 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.' 
        });
        setFormState({ name: '', email: '', subject: '', message: '' });
        if (formRef.current) formRef.current.reset();
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus({ 
        type: 'error', 
        message: 'Sorry, there was an error sending your message. Please try again or email us directly at contact@instantbmi.com' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Contact Us | InstantBMI.com - Get In Touch</title>
        <meta
          name="description"
          content="Contact InstantBMI.com team. We're here to help with any questions about our free, private BMI calculator and health tools."
        />
        <meta
          name="keywords"
          content="contact BMI calculator, get in touch, health tools support, privacy-focused tools, feedback BMI calculator"
        />
        <meta name="author" content="InstantBMI.com" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.instantbmi.com/contact" />

        <meta property="og:title" content="Contact Us | InstantBMI.com" />
        <meta
          property="og:description"
          content="Get in touch with the InstantBMI.com team. We welcome feedback, questions, and suggestions about our privacy-first health tools."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.instantbmi.com/contact" />
        <meta property="og:image" content="https://www.instantbmi.com/images/og-contact.jpg" />
        <meta property="og:image:alt" content="Contact InstantBMI.com Team" />
        <meta property="og:site_name" content="InstantBMI.com" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@yourhandle" />
        <meta name="twitter:title" content="Contact InstantBMI.com" />
        <meta
          name="twitter:description"
          content="Have questions about our free BMI calculator? Get in touch with our team for support and feedback."
        />
        <meta name="twitter:image" content="https://www.instantbmi.com/images/og-contact.jpg" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ContactPage",
              "name": "Contact InstantBMI.com",
              "description": "Contact form for InstantBMI.com - free, private health tools",
              "url": "https://www.instantbmi.com/contact",
              "mainEntity": {
                "@type": "WebPageElement",
                "name": "Contact Form",
                "description": "Form to contact InstantBMI.com team",
                "potentialAction": {
                  "@type": "ContactPoint",
                  "contactType": "customer service",
                  "availableLanguage": "English"
                }
              }
            })
          }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={styles.contactPage}>
        <div className={styles.contactContainer}>
          <div className={styles.contactCard}>
            <header className={styles.contactHeader}>
              <h1 className={styles.contactTitle}>Get In Touch</h1>
              <p className={styles.contactSubtitle}>
                We'd love to hear from you. Send us a message below.
              </p>
            </header>

            {submitStatus && (
              <div 
                className={`${styles.statusMessage} ${
                  submitStatus.type === 'success' ? styles.statusSuccess : styles.statusError
                }`}
                role="alert"
                aria-live="polite"
              >
                {submitStatus.message}
              </div>
            )}

            <form
              ref={formRef}
              className={styles.contactForm}
              onSubmit={handleSubmit}
              noValidate
            >
              {/* Name Field */}
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.formLabel}>
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={styles.formInput}
                  placeholder="Enter your full name"
                  required
                  aria-required="true"
                  minLength="2"
                  maxLength="100"
                  value={formState.name}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                <div className={styles.characterCount}>
                  {formState.name.length}/100
                </div>
              </div>

              {/* Email Field */}
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.formLabel}>
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={styles.formInput}
                  placeholder="your.email@example.com"
                  required
                  aria-required="true"
                  value={formState.email}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>

              {/* Subject Field */}
              <div className={styles.formGroup}>
                <label htmlFor="subject" className={styles.formLabel}>
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className={styles.formInput}
                  placeholder="How can we help you?"
                  required
                  aria-required="true"
                  minLength="5"
                  maxLength="200"
                  value={formState.subject}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                <div className={styles.characterCount}>
                  {formState.subject.length}/200
                </div>
              </div>

              {/* Message Field */}
              <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.formLabel}>
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  className={styles.formTextarea}
                  placeholder="Write your detailed message here..."
                  required
                  aria-required="true"
                  minLength="10"
                  maxLength="2000"
                  value={formState.message}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                ></textarea>
                <div className={styles.characterCount}>
                  {formState.message.length}/2000
                </div>
              </div>

              <button 
                type="submit" 
                className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className={styles.spinner}></span>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>

              <div className={styles.privacyNote}>
                <p className={styles.formNote}>
                  <strong>Privacy & Security:</strong> Your data is encrypted and secure. 
                  We never share your information with third parties. 
                  Read our <a href="/privacy" className={styles.privacyLink}>Privacy Policy</a>.
                </p>
              </div>
            </form>

            <div className={styles.alternativeContact}>
              {/* Optional: add direct email link if desired */}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Contact;