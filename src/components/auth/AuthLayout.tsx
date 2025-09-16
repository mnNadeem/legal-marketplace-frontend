import React from 'react';
import { Scale } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center">
            <Scale className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-sm text-gray-600">
              {subtitle}
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {children}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Legal Marketplace © 2024
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;