import React from 'react';
import PolicyPage from '../components/common/PolicyPage';

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "1. Introduction",
      content: (
        <>
          <p>
            At Veloria Perfumes, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase.
          </p>
          <p className="mt-2">
            Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access our website or use our services.
          </p>
        </>
      )
    },
    {
      title: "2. Information We Collect",
      content: (
        <>
          <p>We may collect several types of information from and about users of our website, including:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>
              <strong>Personal Information:</strong> Name, email address, postal address, phone number, payment information, and other identifiers by which you may be contacted online or offline.
            </li>
            <li>
              <strong>Account Information:</strong> Username, password, purchase history, and preferences when you create an account.
            </li>
            <li>
              <strong>Transaction Information:</strong> Records of products you've purchased, shipping details, and billing information.
            </li>
            <li>
              <strong>Technical Information:</strong> IP address, browser type, operating system, device information, browsing patterns, and other technology on the devices you use to access our website.
            </li>
          </ul>
        </>
      )
    },
    {
      title: "3. How We Collect Your Information",
      content: (
        <>
          <p>We collect information through:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Direct interactions when you provide information by filling out forms, creating an account, making purchases, or communicating with us.</li>
            <li>Automated technologies, including cookies and similar tracking technologies, that collect data about your browsing actions and patterns.</li>
            <li>Third parties, such as business partners, payment processors, social media platforms, and analytics providers.</li>
          </ul>
        </>
      )
    },
    {
      title: "4. How We Use Your Information",
      content: (
        <>
          <p>We may use the information we collect for various purposes, including:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Processing and fulfilling your orders</li>
            <li>Creating and managing your account</li>
            <li>Providing customer service and responding to inquiries</li>
            <li>Sending administrative information, such as order confirmations and policy updates</li>
            <li>Marketing and promotional communications (with your consent)</li>
            <li>Personalizing your experience on our website</li>
            <li>Improving our website, products, and services</li>
            <li>Complying with legal obligations</li>
          </ul>
        </>
      )
    },
    {
      title: "5. Information Sharing",
      content: (
        <>
          <p>
            We may share your personal information with:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Service providers who perform services on our behalf, such as payment processing, shipping, and IT services.</li>
            <li>Business partners with whom we jointly offer products or services.</li>
            <li>Law enforcement or other government agencies as required by law or to protect our rights.</li>
          </ul>
          <p className="mt-2">
            We do not sell, rent, or lease your personal information to third parties for their marketing purposes without your explicit consent.
          </p>
        </>
      )
    },
    {
      title: "6. Cookies and Tracking Technologies",
      content: (
        <>
          <p>
            We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with small amounts of data that may include an anonymous unique identifier.
          </p>
          <p className="mt-2">
            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
          </p>
        </>
      )
    },
    {
      title: "7. Data Security",
      content: (
        <>
          <p>
            We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </>
      )
    },
    {
      title: "8. Your Rights",
      content: (
        <>
          <p>
            Depending on your location, you may have certain rights regarding your personal information, including:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Access to your personal information</li>
            <li>Correction of inaccurate or incomplete information</li>
            <li>Deletion of your personal information</li>
            <li>Restriction or objection to processing</li>
            <li>Data portability</li>
            <li>Withdrawal of consent</li>
          </ul>
          <p className="mt-2">
            To exercise these rights, please contact us using the information provided below.
          </p>
        </>
      )
    },
    {
      title: "9. Children's Privacy",
      content: (
        <>
          <p>
            Our website is not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
          </p>
        </>
      )
    },
    {
      title: "10. International Data Transfers",
      content: (
        <>
          <p>
            Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws than your country.
          </p>
          <p className="mt-2">
            When we transfer your information to other countries, we will implement appropriate safeguards to ensure your information receives an adequate level of protection.
          </p>
        </>
      )
    },
    {
      title: "11. Changes to Our Privacy Policy",
      content: (
        <>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>
          <p className="mt-2">
            We encourage you to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </p>
        </>
      )
    },
    {
      title: "12. Contact Information",
      content: (
        <>
          <p>
            If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us at:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Email: privacy@veloriaperfumes.com</li>
            <li>Phone: +1 (555) 123-4567</li>
            <li>Address: 123 Fragrance Boulevard, Scent City, SC 90210</li>
          </ul>
        </>
      )
    }
  ];

  return (
    <PolicyPage
      title="Privacy Policy"
      subtitle="How we collect, use, and protect your personal information"
      sections={sections}
    />
  );
};

export default PrivacyPolicy; 