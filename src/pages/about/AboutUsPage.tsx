import Layout from '@/components/layout/Layout';

export default function AboutUsPage() {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <h1 className="mb-8 text-5xl font-extrabold text-center text-gray-800">About Chowk</h1>
        
        <div className="max-w-4xl mx-auto space-y-12">
          <section className="prose lg:prose-xl text-gray-700">
            <p className="text-lg leading-relaxed">
              Chowk is a vibrant online marketplace connecting talented freelancers with clients seeking quality services.
            </p>
          </section>
          
          <section className="bg-gray-100 p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
            <p>
              Our mission is to create a thriving ecosystem where freelancers can showcase their skills, and clients can easily find the right talent. We empower individuals to pursue their passion while providing valuable services to the community.
            </p>
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-md border">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Story</h2>
            <p>
              Chowk was founded in 2023 with a simple vision: to create a platform that makes it easy for freelancers to find work and for clients to access quality services. 
            </p>
            <p>
              The word "Chowk" means a marketplace or public square in South Asian cultures — a place for gathering, exchanging ideas, and conducting business. That’s exactly what we aim to create: a digital hub where skills are valued, connections are made, and communities thrive.
            </p>
          </section>
          
          <section className="bg-gray-100 p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Values</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Quality:</strong> We promote high standards in work and service.</li>
              <li><strong>Community:</strong> We foster meaningful connections between freelancers and clients.</li>
              <li><strong>Transparency:</strong> We advocate for honest communication and business practices.</li>
              <li><strong>Accessibility:</strong> We ensure professional services are available to everyone.</li>
              <li><strong>Growth:</strong> We support the professional development of our freelancers and the success of our clients.</li>
            </ul>
          </section>
          
          <section className="bg-white p-6 rounded-2xl shadow-md border">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Join Our Community</h2>
            <p>
              Whether you're a freelancer looking to showcase your skills or a client searching for professional services, Chowk is the place for you. Join our growing community today and be part of the future of work!
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}