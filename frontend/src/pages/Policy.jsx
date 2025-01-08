import React from "react";
import Footer from "../components/Footer";
import Normaltitle from "../components/Normaltitle";

const Policy = () => {
  return (
    <div >
      <div className="max-w-3xl mx-auto px-6 py-8 text-center">
        <Normaltitle text1="Privacy" text2="Policy" />
        <p className="text-lg text-gray-700 mb-4">
          Welcome to our Privacy Policy page! When you use our website and
          services, we respect and protect your privacy. This Privacy Policy
          explains how we collect, use, and protect your personal data. Please
          take the time to read this document carefully.
        </p>

        <Normaltitle text1="1. Information" text2="We Collect" />
        <p className="text-lg text-gray-700 mb-4">
          We collect various types of information in order to provide and
          improve our services. This includes:
        </p>
        <p className="text-lg text-gray-700 mb-4">
          Personal Information such as name, email address,
          phone number, and payment details.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          Usage Data such as browser type, IP address, pages
          visited, time spent on pages, and interaction with content.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          Cookies to enhance your user experience, analyze web
          traffic, and personalize content based on your preferences.
        </p>

        <Normaltitle text1="2. How We Use" text2="Your Information" />
        <p className="text-lg text-gray-700 mb-4">
          The information we collect is used in the following ways:
        </p>
        <p className="text-lg text-gray-700 mb-4">
          To provide and improve our website and services: We
          use your information to maintain and enhance the functionality of our
          website.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          To personalize your experience: We use your data to
          offer tailored content, advertisements, and recommendations.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          To communicate with you: We may use your information
          to send you updates, newsletters, or promotional offers.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          To analyze performance: We use analytics tools to
          understand user behavior, improve our website, and ensure our services
          are effective.
        </p>

        <Normaltitle text1="3. Data" text2="Security" />
        <p className="text-lg text-gray-700 mb-4">
          We take reasonable precautions to protect your personal information
          from unauthorized access, alteration, disclosure, or destruction.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          However, no method of transmission over the internet or electronic
          storage is 100% secure. While we strive to protect your information,
          we cannot guarantee its absolute security.
        </p>

        <Normaltitle text1="4. Third-Party" text2="Services" />
        <p className="text-lg text-gray-700 mb-4">
          We may share your data with third-party service providers for the
          purpose of improving our website or facilitating our services. These
          third parties include:
        </p>
        <p className="text-lg text-gray-700 mb-4">
          - Payment processors such as Stripe or PayPal for transaction
          purposes.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          - Analytics providers such as Google Analytics to track usage and
          improve functionality.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          - Social media platforms for integration and sharing content.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          These third parties are obligated to protect your information and not
          use it for other purposes.
        </p>

        <Normaltitle text1="5. Your" text2="Rights" />
        <p className="text-lg text-gray-700 mb-4">
          You have the following rights regarding your personal information:
        </p>
        <p className="text-lg text-gray-700 mb-4">
          - Access and update: You can access and update your
          personal information at any time.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          - Deletion: You have the right to request the
          deletion of your personal data under certain conditions.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          - <strong>Opt-out of marketing communications:</strong> You can choose
          not to receive promotional emails and newsletters.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          - Withdraw consent: You can withdraw your consent for
          data collection at any time, where applicable.
        </p>

        <Normaltitle text1="6. Cookies" text2="" />
        <p className="text-lg text-gray-700 mb-4">
          Our website uses cookies to enhance your experience. Cookies are small
          data files stored on your device that help us remember your
          preferences, improve performance, and analyze website usage.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          By using our site, you consent to the use of cookies. You can manage
          your cookie settings in your browser at any time.
        </p>

        <Normaltitle text1="7. Changes to" text2="This Privacy Policy" />
        <p className="text-lg text-gray-700 mb-4">
          We may update this Privacy Policy from time to time. Any changes will
          be communicated to you, and we encourage you to review it regularly.
        </p>

        
      </div>
      <Footer />
    </div>
  );
};

export default Policy;
