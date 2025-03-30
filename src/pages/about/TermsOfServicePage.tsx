import Layout from '@/components/layout/Layout';

export default function PrivacyPolicyPage() {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-12">Privacy Policy</h1>
        
        <div className="max-w-4xl mx-auto space-y-8 bg-white p-6 rounded-2xl shadow-md border">
          <section>
            <p className="text-lg text-gray-600">Last Updated: September 18, 2023</p>
            <p>
              Welcome to Chowk. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and about your rights.
            </p>
          </section>
          
          <PolicySection title="1. Important Information and Who We Are">
            <p>
              Chowk is the controller and responsible for your personal data (referred to as "Chowk", "we", "us" or "our").
            </p>
            <p>
              For any privacy-related inquiries, please contact us at privacy@chowk.com.
            </p>
          </PolicySection>
          
          <PolicySection title="2. The Data We Collect About You">
            <p>
              Personal data refers to information that can identify an individual. It excludes anonymous data.
            </p>
            <ul>
              <li><strong>Identity Data:</strong> First name, last name, username.</li>
              <li><strong>Contact Data:</strong> Email, phone number, address.</li>
              <li><strong>Technical Data:</strong> IP address, browser type, OS.</li>
              <li><strong>Profile Data:</strong> Username, password, purchase history.</li>
              <li><strong>Usage Data:</strong> Website interactions and preferences.</li>
            </ul>
          </PolicySection>
          
          <PolicySection title="3. How We Use Your Personal Data">
            <p>We use your data when legally permitted, including:</p>
            <ul>
              <li>Fulfilling contracts with you.</li>
              <li>For legitimate interests, ensuring your rights aren’t overridden.</li>
              <li>Compliance with legal obligations.</li>
            </ul>
          </PolicySection>
          
          <PolicySection title="4. Data Security">
            <p>
              We have implemented security measures to protect personal data from unauthorized access, loss, or misuse. Access is restricted to personnel who require it.
            </p>
          </PolicySection>
          
          <PolicySection title="5. Your Legal Rights">
            <p>You have rights under data protection laws, including:</p>
            <ul>
              <li>Access, correction, or deletion of personal data.</li>
              <li>Objecting to or restricting data processing.</li>
              <li>Requesting data transfer.</li>
              <li>Withdrawing consent at any time.</li>
            </ul>
            <p>For rights-related inquiries, contact privacy@chowk.com.</p>
          </PolicySection>
          
          <PolicySection title="6. Data Retention">
            <p>
              We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including legal, regulatory, tax, and reporting requirements.
            </p>
          </PolicySection>
          
          <PolicySection title="7. Third-Party Links">
            <p>
              Our website may include links to third-party websites, plug-ins, and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy policies.
            </p>
          </PolicySection>
          
          <PolicySection title="8. Contact Us">
            <p>
              If you have any questions about this privacy policy or our privacy practices, please contact us:
            </p>
            <p>
              Email: privacy@chowk.com<br/>
              Address: 123 Marketplace Avenue, San Francisco, CA 94105, USA
            </p>
          </PolicySection>
        </div>
      </div>
    </Layout>
  );
}

function PolicySection({ title, children }: { title: string, children: any }) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
      {children}
    </section>
  );
}
