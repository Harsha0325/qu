import React, { useEffect } from "react";
import NavBar from "./WebPages/Navbar";
import HomeMobileScreen8 from "./WebPages/Screen3mobile/HomeMobileScreen8";

const TermsAndConditions = () => {

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div className="text-white flex flex-col bg-black bg-[radial-gradient(90.16%_143.01%_at_15.32%_21.04%,_rgba(17,_112,_137,_0.2)_0%,_rgba(167,_22,_255,_0.07)_77.08%,_rgba(7,_164,_205,_0)_100%)]">
    <header className="fixed top-0 left-0 w-full z-50">
      <NavBar />
    </header>
    <section className="mt-[80px] mb-10 max-w-[1440px] mx-auto p-3"
        style={{fontFamily: "Inter"}}>
        <h1 className="text-3xl font-bold text-center mb-4">Terms and Conditions of Service</h1>
        <p className="text-center text-sm  mb-8">Effective Date: 10/01/2025</p>

        <div className="space-y-6">
          <p>
          Welcome to Quikynet Digital Business Card ("Quikynet," "we," "our," or "us"). By accessing or using our services, you agree to comply with and be bound by the following “Terms and Conditions of Service”. Please read these terms carefully before using our services. If you do not agree to these terms, you may not use our services.
          </p>
          <h2 className="text-xl font-semibold">1. Definitions</h2>
          <div className="ml-5 space-y-2">
          <p>(a) Service: refers to the Quikynet Digital Business Card platform, including the website, mobile application, and all associated features and functionalities.</p>
          <p>(b) User or you: refers to any individual or entity accessing or using our Service.</p>
          <p>(c) Content: refers to all information, data, text, graphics, logos, videos, or other materials provided or uploaded by the User.</p>
          </div>

          <h2 className="text-xl font-semibold">2. Use of the Service </h2>
          <div className="ml-5 space-y-2">
          <p>(a) Eligibility: You must be at least 18 years old to use the Service. By accessing the Service, you represent and warrant that you meet this requirement.</p>
          <p>(b) Account Registration: To use certain features, you must register for an account. You agree to provide accurate and complete information during the registration process and to update such information as necessary.</p>
          <p>(c) License: Subject to these terms, Quikynet grants you a non-exclusive, non-transferable, revocable license to use the Service for personal or professional purposes.</p>
          <p>(d) Prohibited Activities:</p>
          <ol className="list-[lower-roman] list-inside space-y-2 ml-10">
            <li>Uploading or sharing unlawful, defamatory, or infringing Content.</li>
            <li>Using the Service for fraudulent or malicious purposes.</li>
            <li>Attempting to hack, disrupt, or overload the Service.</li>
            <li>Sharing your account credentials with others.</li>
            </ol>
            </div>

          <h2 className="text-xl font-semibold">3. User Responsibilities </h2>
          <div className="ml-5 space-y-2">
          <p>(a) Content Ownership: You retain ownership of the Content you upload to the Service. By uploading Content, you grant Quikynet a worldwide, royalty-free license to use, display, and distribute your Content as necessary to operate the Service.</p>
          <p>(b) Compliance: You are responsible for ensuring that your Content complies with applicable laws and regulations.</p>
          <p>(c) Data Accuracy: You are solely responsible for the accuracy of the information provided in your digital business card.</p>
          </div>

          <h2 className="text-xl font-semibold">4. Fees and Payments </h2>
          <div className="ml-5 space-y-2">
          <p>(a) Pricing: Pricing details are available on our website or app.</p>
          <p>(b) Refunds: Payments are non-refundable, except as required by applicable law.</p>
          <p>(c) Billing: You authorize Quikynet to charge your provided payment method for any applicable fees.</p>
          </div>

          <h2 className="text-xl font-semibold">5. Privacy and Data Protection</h2>
          <div className="ml-5 space-y-2">
          <p>(a) Privacy Policy: Our collection and use of personal information are governed by our Privacy Policy, which is incorporated into these terms by reference.</p>
          <p>(b) Data Security: While we take reasonable measures to protect your data, you acknowledge that no system is completely secure. You use the Service at your own risk.</p>
          </div>

          <h2 className="text-xl font-semibold">6. Intellectual Property</h2>
          <div className="ml-5 space-y-2">
          <p>(a) Ownership: Quikynet retains all rights, title, and interest in the Service, including all related intellectual property.</p>
          <p>(b) Restrictions: You may not copy, modify, distribute, or reverse engineer any part of the Service.</p>
          </div>

          <h2 className="text-xl font-semibold">7. Termination</h2>
          <div className="ml-5 space-y-2">
          <p>(a) By You: You may terminate your account at any time by contacting us.</p>
          <p>(b) By Us: We reserve the right to suspend or terminate your account if you violate these terms or engage in any prohibited activities.</p>
          <p>(c) Effect of Termination: Upon termination, your access to the Service will cease, and we may delete your account and associated Content.</p>
          </div>

          <h2 className="text-xl font-semibold">8. Disclaimers and Limitation of Liability</h2>
          <div className="ml-5 space-y-2">
          <p>(a) Disclaimer: The Service is provided "as is" without warranties of any kind, express or implied.</p>
          <p>(b) Limitation of Liability: To the maximum extent permitted by law, Quikynet is not liable for any indirect, incidental, or consequential damages arising out of your use of the Service.</p>
          </div>

          <h2 className="text-xl font-semibold">9. Governing Law</h2>
          <div className="ml-5 space-y-2">
          <p>These terms are governed by and construed in accordance with the laws of Bengaluru, Karnataka. Any disputes shall be resolved exclusively in the courts of Bengaluru, Karnataka.</p>
          </div>

          <h2 className="text-xl font-semibold">10. Changes to These Terms</h2>
          <div className="ml-5 space-y-2">
          <p>We reserve the right to modify these terms at any time. Changes will be effective upon posting. Your continued use of the Service constitutes acceptance of the revised terms.</p>
          </div>

          <h2 className="text-xl font-semibold">11. Contact Information</h2>
          <div className="ml-5 space-y-2">
          <p>If you have any questions or concerns about these Terms and Conditions, please contact us at:</p>
          <p className="text-white">
           Email : {" "}
          <a href="mailto:support@quikynet.com" className="text-[#05cdff] hover:underline">
            support@quikynet.com
          </a>
          </p>

          </div>
          <p>By using the Service, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.</p>
        </div>



        <h1 className="text-3xl font-bold text-center mb-4 mt-12">Privacy Policy for Quikynet Digital Business Card</h1>
        <p className="text-center text-sm  mb-8">Effective Date: 10/01/2025</p>
        <div className="space-y-6">
          <p>
          At QuGates Technologies, we are committed to protecting the privacy of users of our Quikynet Digital Business Card service (“Service”). This Privacy Policy explains how we collect, use, share, and protect your personal information when you use our Service.
          </p>
          <h2 className="text-xl font-semibold">1. Information We Collect</h2>
          <p className="text-sm font-semibold">We may collect the following information:</p>
          <div className="ml-5 space-y-2">
          <p>(a) Personal Information: Name, email address, phone number, company name, job title, and any other details you provide when creating or updating your digital business card.</p>
          <p>(b) Usage Data: Information about how you access and use the Service, including device type, browser type, IP address, and usage logs.</p>
          <p>(c) Cookies and Tracking: We may use cookies and similar technologies to improve the functionality of our Service.</p>
          </div>

          <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
          <p className="text-sm font-semibold">We use the collected information to:</p>
          <div className="ml-5 space-y-2">
          <p>(a) Provide and improve the functionality of the Quikynet Digital Business Card.</p>
          <p>(b) Facilitate the sharing of your digital business card with others.</p>
          <p>(c) Personalize the user experience.</p>
          <p>(d) Communicate updates, promotions, or Service-related messages.</p>
          <p>(e) Ensure compliance with applicable laws and protect against fraud.</p>
            </div>

          <h2 className="text-xl font-semibold">3. How We Share Your Information</h2>
          <p className="text-sm font-semibold">We do not sell your personal information. However, we may share your information in the following circumstances:</p>
          <div className="ml-5 space-y-2">
          <p>(a) With Consent: When you opt to share your digital business card with others.</p>
          <p>(b) Service Providers: To trusted third parties who assist us in operating our Service (e.g., hosting providers).</p>
          <p>(c) Legal Obligations: When required to comply with legal obligations, enforce our Terms of Service, or protect our rights.</p>
          </div>

          <h2 className="text-xl font-semibold">4. Data Retention</h2>
          <div className="ml-5 space-y-2">
          <p>We retain your personal information only as long as necessary to provide the Service or comply with legal obligations. You may request deletion of your data at any time.</p>
          </div>

          <h2 className="text-xl font-semibold">5. Data Security</h2>
          <div className="ml-5 space-y-2">
          <p>We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction.</p>
          </div>

          <h2 className="text-xl font-semibold">6. Your Rights</h2>
          <p className="text-sm font-semibold">Depending on your location, you may have the following rights regarding your data:</p>
          <div className="ml-5 space-y-2">
          <p>(a) Access, update, or delete your personal information.</p>
          <p>(b) Withdraw consent for data processing.</p>
          </div>

          <h2 className="text-xl font-semibold">7. Cookies</h2>
          <div className="ml-5 space-y-2">
          <p>Our Service uses cookies to enhance user experience. You can control or disable cookies through your browser settings.</p>
          </div>

          <h2 className="text-xl font-semibold">8. Third-Party Links</h2>
          <div className="ml-5 space-y-2">
          <p>Our Service may contain links to third-party websites. We are not responsible for their privacy practices. Please review their policies independently. QuGates will not be held liable for any third-party attacks or hacks.</p>
          </div>

          <h2 className="text-xl font-semibold">9. Changes to This Privacy Policy</h2>
          <div className="ml-5 space-y-2">
          <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page, with the date of the last revision indicated at the top.</p>
          </div>


          <h2 className="text-xl font-semibold">10. Contact Us</h2>
          <div className="ml-5 space-y-2">
          <p>If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:</p>
          </div>
          <p className="text-white">
           Email : {" "}
          <a href="mailto:support@quikynet.com" className="text-[#05cdff] hover:underline">
            support@quikynet.com
          </a>
          </p>
        </div>

      </section>
      <HomeMobileScreen8/>
    </div>
  );
};

export default TermsAndConditions;
