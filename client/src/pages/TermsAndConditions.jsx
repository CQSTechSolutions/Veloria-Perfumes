import React from 'react';
import PolicyPage from '../components/common/PolicyPage';

const TermsAndConditions = () => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: (
        <>
          <p>
            Welcome to Veloria Perfumes. By accessing and using our website, you accept and agree to be bound by the terms and provisions of this agreement. Additionally, when using Veloria Perfumes' particular services, you shall be subject to any posted guidelines or rules applicable to such services.
          </p>
          <p className="mt-2">
            If you do not agree to these Terms and Conditions, please do not use our website or services.
          </p>
        </>
      )
    },
    {
      title: "2. Product Information",
      content: (
        <>
          <p>
            We strive to provide accurate and up-to-date information about our fragrances. However, we do not warrant that product descriptions or other content on the site is accurate, complete, reliable, current, or error-free.
          </p>
          <p className="mt-2">
            Fragrance descriptions are subjective, and scent perception may vary from person to person. We recommend reading the full scent profile and, when possible, trying samples before purchasing full-size products.
          </p>
        </>
      )
    },
    {
      title: "3. Prices and Payment",
      content: (
        <>
          <p>
            All prices are displayed in the designated currency and are subject to change without notice. We reserve the right to correct pricing errors and to modify prices at our discretion.
          </p>
          <p className="mt-2">
            Payment must be made at the time of order. We accept major credit cards, debit cards, and other payment methods as indicated on our website. All payment information is securely processed.
          </p>
        </>
      )
    },
    {
      title: "4. Shipping and Delivery",
      content: (
        <>
          <p>
            Orders are typically processed within 1-2 business days. Delivery timeframes depend on your location and chosen shipping method. Veloria Perfumes is not responsible for delays caused by customs, weather conditions, or other factors beyond our control.
          </p>
          <p className="mt-2">
            Please refer to our Shipping Policy for detailed information about shipping methods, costs, and delivery times.
          </p>
        </>
      )
    },
    {
      title: "5. Returns and Exchanges",
      content: (
        <>
          <p>
            We want you to be completely satisfied with your purchase. Our return policy allows returns of unused, unopened items within 30 days of delivery. Some restrictions apply to sample sets and custom orders.
          </p>
          <p className="mt-2">
            For complete information about returns, exchanges, and refunds, please refer to our Return Policy.
          </p>
        </>
      )
    },
    {
      title: "6. Intellectual Property",
      content: (
        <>
          <p>
            All content included on this website, such as text, graphics, logos, images, and software, is the property of Veloria Perfumes or its content suppliers and is protected by international copyright laws.
          </p>
          <p className="mt-2">
            The compilation of all content on this site is the exclusive property of Veloria Perfumes and is protected by international copyright laws. Unauthorized use may violate copyright, trademark, and other laws.
          </p>
        </>
      )
    },
    {
      title: "7. User Accounts",
      content: (
        <>
          <p>
            When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer.
          </p>
          <p className="mt-2">
            You agree to accept responsibility for all activities that occur under your account. If you suspect unauthorized use of your account, please notify us immediately.
          </p>
        </>
      )
    },
    {
      title: "8. Privacy Policy",
      content: (
        <>
          <p>
            Your use of Veloria Perfumes' website is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the site and informs users of our data collection practices.
          </p>
        </>
      )
    },
    {
      title: "9. Limitation of Liability",
      content: (
        <>
          <p>
            Veloria Perfumes shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages resulting from your use or inability to use the service or for the cost of procurement of substitute goods and services.
          </p>
        </>
      )
    },
    {
      title: "10. Governing Law",
      content: (
        <>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of [Your Jurisdiction], and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
          </p>
        </>
      )
    },
    {
      title: "11. Changes to Terms",
      content: (
        <>
          <p>
            Veloria Perfumes reserves the right to modify these terms at any time. We will notify users of any significant changes by posting a notice on our website. Your continued use of the site following changes to the terms constitutes your acceptance of the revised terms.
          </p>
        </>
      )
    },
    {
      title: "12. Contact Information",
      content: (
        <>
          <p>
            If you have any questions about our Terms and Conditions, please contact us at:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Email: support@veloriaperfumes.com</li>
            <li>Phone: +1 (555) 123-4567</li>
            <li>Address: 123 Fragrance Boulevard, Scent City, SC 90210</li>
          </ul>
        </>
      )
    }
  ];

  return (
    <PolicyPage
      title="Terms and Conditions"
      subtitle="Please read these terms carefully before using our services"
      sections={sections}
    />
  );
};

export default TermsAndConditions; 