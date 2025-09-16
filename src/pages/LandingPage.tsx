import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, Users, FileText, DollarSign, Shield, Clock } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: <FileText className="h-8 w-8 text-primary-600" />,
      title: 'Case Management',
      description: 'Create and manage your legal cases with ease. Upload documents and track progress.',
    },
    {
      icon: <Users className="h-8 w-8 text-primary-600" />,
      title: 'Expert Lawyers',
      description: 'Connect with qualified lawyers who specialize in your area of need.',
    },
    {
      icon: <DollarSign className="h-8 w-8 text-primary-600" />,
      title: 'Transparent Pricing',
      description: 'Get quotes from multiple lawyers and choose the best fit for your budget.',
    },
    {
      icon: <Shield className="h-8 w-8 text-primary-600" />,
      title: 'Secure Platform',
      description: 'Your documents and communications are protected with enterprise-grade security.',
    },
    {
      icon: <Clock className="h-8 w-8 text-primary-600" />,
      title: 'Quick Response',
      description: 'Get quotes from lawyers within hours, not days.',
    },
    {
      icon: <Scale className="h-8 w-8 text-primary-600" />,
      title: 'Legal Expertise',
      description: 'Access lawyers across various practice areas and jurisdictions.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Scale className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Legal Marketplace</span>
            </div>
            <div className="flex space-x-4">
              <Link to="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link to="/signup/client">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Connect with
              <span className="text-primary-600"> Expert Lawyers</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Post your legal case, receive quotes from qualified lawyers, and choose the best fit for your needs. 
              Simple, secure, and transparent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup/client">
                <Button size="lg" className="w-full sm:w-auto">
                  Post a Case
                </Button>
              </Link>
              <Link to="/signup/lawyer">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Become a Lawyer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Legal Marketplace?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We've built a platform that makes legal services accessible, transparent, and efficient.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} hover className="text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to get the legal help you need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Post Your Case
              </h3>
              <p className="text-gray-600">
                Describe your legal issue and upload relevant documents. Your case will be anonymized for lawyers.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Receive Quotes
              </h3>
              <p className="text-gray-600">
                Qualified lawyers will review your case and submit quotes with pricing and timelines.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Choose & Pay
              </h3>
              <p className="text-gray-600">
                Select the lawyer that best fits your needs and budget. Secure payment through Stripe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of clients and lawyers who trust Legal Marketplace for their legal needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup/client">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Post Your First Case
              </Button>
            </Link>
            <Link to="/signup/lawyer">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary-600">
                Start Practicing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <Scale className="h-8 w-8 text-primary-400" />
            <span className="ml-2 text-xl font-bold">Legal Marketplace</span>
          </div>
          <p className="text-center text-gray-400 mt-4">
            © 2024 Legal Marketplace. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;