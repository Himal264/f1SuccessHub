import React from 'react';
import Footer from '../components/Footer'; // Import Footer component
import Normaltitle from '../components/Normaltitle';

const TermsConditions = () => {
  return (
    <div>
      <div className=' className="max-w-3xl mx-auto px-6 py-8 text-center'>
      <Normaltitle  text1='Terms &' text2='use Conditions' />
      <p className="text-lg text-gray-500 mb-4">
        Welcome to our website! These terms and conditions govern your use of our services, products, and website.
        By accessing or using our website and services, you agree to comply with and be bound by the following terms.
        Please read these terms carefully before using our website.
      </p>

      <Normaltitle  text1='Introduction' text2='' />
      <p className="text-lg text-gray-500 mb-4">
        These Terms and Conditions outline the rules and regulations for the use of our website and services.
        By accessing and using this website, you accept these terms in full. If you disagree with any part of these terms,
        do not use our services or website.
      </p>

      <Normaltitle  text1='User' text2='Obligations' />
      <div className="text-lg text-gray-500 mb-4">
        As a user of our website and services, you agree to:
        <ul className="text-left pl-6 list-none text-gray-500">
          <li>Provide accurate and complete information when creating an account.</li>
          <li>Not engage in any unlawful, harmful, or abusive behavior while using the website.</li>
          <li>Comply with all local, state, and federal laws applicable to your use of our services.</li>
          <li>Not engage in activities such as hacking, spamming, or attempting to access the website in unauthorized ways.</li>
        </ul>
      </div>

      <Normaltitle  text1='User' text2='Account' />
      <p className="text-lg text-gray-500 mb-4">
        To access certain features of our website, you may be required to create an account. You are responsible for maintaining
        the confidentiality of your account information and for all activities that occur under your account.
        You must notify us immediately of any unauthorized access to your account.
      </p>

      <Normaltitle  text1='Use' text2='Of Services' />
      <p className="text-lg text-gray-500 mb-4">
        You agree to use our services only for lawful purposes and in accordance with the terms set forth herein.
        Our services are provided as-is, and we do not guarantee that they will meet your expectations.
        We may suspend or terminate your access to the services at our discretion.
      </p>

      <Normaltitle  text1='Payment' text2='Terms' />
      <p className="text-lg text-gray-500 mb-4">
        If you make any purchases through our website, you agree to provide accurate payment information,
        and authorize us to charge you the applicable fees for any services or products ordered.
        All payments are non-refundable unless otherwise stated.
      </p>

      <Normaltitle  text1='Privacy' text2='Policy' />
      <p className="text-lg text-gray-500 mb-4">
        Your privacy is important to us. We collect and use your information in accordance with our Privacy Policy.
        By using our services, you agree to the terms outlined in the Privacy Policy, which can be accessed on our website.
      </p>

      <Normaltitle  text1='Intellectual' text2='Property' />
      <p className="text-lg text-gray-500 mb-4">
        All content and materials on this website, including but not limited to text, graphics, logos, images, and software, are owned by or licensed to us and are protected by intellectual property laws.
        You may not copy, modify, or distribute any content without our prior written consent.
      </p>

      <Normaltitle  text1='Disclaimer' text2='' />
      <p className="text-lg text-gray-500 mb-4">
        We make no warranties or representations about the accuracy, completeness, or reliability of the website or its content.
        We do not guarantee that the website will be free from errors, viruses, or other harmful components.
        You use the website and services at your own risk.
      </p>

      <Normaltitle  text1='Limitation' text2='of Liability' />
      <p className="text-lg text-gray-500 mb-4">
        In no event shall we be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of our website or services.
        Our liability is limited to the maximum extent permitted by law.
      </p>

      <Normaltitle text1='Termination' text2='' />
      <p className="text-lg text-gray-500 mb-4">
        We reserve the right to suspend or terminate your account or access to the website if you violate any of these terms.
        Upon termination, you will lose access to all services, and any fees paid will be non-refundable.
      </p>

      <Normaltitle text1='Governing' text2='Law' />
      <p className="text-lg text-gray-500 mb-4">
        These terms and conditions shall be governed by and construed in accordance with the laws of the jurisdiction in which our company is registered.
        Any disputes arising from the use of this website shall be resolved in the courts of that jurisdiction.
      </p>

      <Normaltitle text1='Changes to' text2='Terms & Conditions' />
      <p className="text-lg text-gray-500 mb-4">
        We reserve the right to update or modify these Terms and Conditions at any time.
        We will notify users of any significant changes through email or website notifications.
        Your continued use of the website after such changes constitutes acceptance of the new terms.
      </p>

      <Normaltitle text1='Contact' text2='Us' />
      <p className="text-lg text-gray-500 mb-4">
        If you have any questions or concerns about these Terms and Conditions, please contact us:
      </p>
      <p className="text-lg text-gray-500 mb-4">
        Email:  <a href="mailto:your-email@example.com" className="text-black"> f1successhub@gmail.com</a>
      </p>
      <p className="text-lg text-gray-500">
        Phone: <a href="tel:+9779706750713" className="text-black">+977 9706750713</a>
      </p>

    
      </div>
      <Footer />

    </div>
  );
};

export default TermsConditions;
