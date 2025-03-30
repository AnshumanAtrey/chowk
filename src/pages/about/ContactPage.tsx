import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      toast({
        title: "Message sent",
        description: "We've received your message and will get back to you soon!",
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-12">Contact Us</h1>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Get in Touch</h2>
            <p className="text-gray-600">Have questions about Chowk? Want to partner with us? Just want to say hello? We’d love to hear from you!</p>
            
            <div className="space-y-6">
              <ContactDetail icon={Mail} title="Email Us" detail="support@chowk.com" />
              <ContactDetail icon={Phone} title="Call Us" detail="+1 (555) 123-4567" />
              <ContactDetail 
                icon={MapPin} 
                title="Visit Us" 
                detail={`123 Marketplace Avenue\nSan Francisco, CA 94105\nUnited States`} 
              />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-md border">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Name" id="name" type="text" value={formData.name} onChange={handleChange} />
              <FormField label="Email" id="email" type="email" value={formData.email} onChange={handleChange} />
              <FormField label="Subject" id="subject" type="text" value={formData.subject} onChange={handleChange} />
              <FormField label="Message" id="message" type="textarea" value={formData.message} onChange={handleChange} />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function ContactDetail({ icon: Icon, title, detail }: { icon: any, title: string, detail: string }) {
  return (
    <div className="flex items-start">
      <Icon className="h-6 w-6 text-chowk-primary mr-4" />
      <div>
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-gray-600 whitespace-pre-line">{detail}</p>
      </div>
    </div>
  );
}

function FormField({ label, id, type, value, onChange }: { label: string, id: string, type: string, value: string, onChange: any }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-1 text-gray-900">{label}</label>
      {type === "textarea" ? (
        <Textarea id={id} name={id} value={value} onChange={onChange} rows={5} required />
      ) : (
        <Input id={id} name={id} type={type} value={value} onChange={onChange} required />
      )}
    </div>
  );
}
