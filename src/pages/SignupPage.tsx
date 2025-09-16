import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthLayout from '../components/auth/AuthLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  jurisdiction?: string;
  barNumber?: string;
}

const SignupPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { role } = useParams<{ role: string }>();

  console.log("param", role)
  
  const isLawyer = role === 'lawyer';
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>();

  const password = watch('password');

  const onSubmit = async (data: SignupFormData) => {
    try {
      const signupData = {
        email: data.email,
        password: data.password,
        name: data.name,
        role: role as 'client' | 'lawyer',
        ...(isLawyer && {
          jurisdiction: data.jurisdiction,
          barNumber: data.barNumber,
        }),
      };

      console.log(signupData);
      
      await signup(signupData);
      navigate('/dashboard');
    } catch (error) {
      console.log(error)
    }
  };

  const jurisdictionOptions = [
    { value: '', label: 'Select jurisdiction' },
    { value: 'New York', label: 'New York' },
    { value: 'California', label: 'California' },
    { value: 'Texas', label: 'Texas' },
    { value: 'Florida', label: 'Florida' },
    { value: 'Illinois', label: 'Illinois' },
    { value: 'Pennsylvania', label: 'Pennsylvania' },
    { value: 'Ohio', label: 'Ohio' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'North Carolina', label: 'North Carolina' },
  ];

  return (
    <AuthLayout
      title={`Sign up as a ${isLawyer ? 'Lawyer' : 'Client'}`}
      subtitle={`Create your ${isLawyer ? 'lawyer' : 'client'} account to get started.`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Full name"
          type="text"
          autoComplete="name"
          placeholder="Enter your full name"
          {...register('name', {
            required: 'Name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters',
            },
          })}
          error={errors.name?.message}
        />

        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          error={errors.email?.message}
        />

        {isLawyer && (
          <>
            <Select
              label="Jurisdiction"
              placeholder="Select your jurisdiction"
              options={jurisdictionOptions}
              {...register('jurisdiction')}
              error={errors.jurisdiction?.message}
            />

            <Input
              label="Bar Number (Optional)"
              type="text"
              placeholder="Enter your bar number"
              {...register('barNumber')}
              error={errors.barNumber?.message}
            />
          </>
        )}

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Create a password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                message: 'Password must contain uppercase, lowercase, number, and special character',
              },
            })}
            error={errors.password?.message}
          />
          <button
            type="button"
            className="absolute inset-y-11 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>

        <div className="relative">
          <Input
            label="Confirm password"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Confirm your password"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) =>
                value === password || 'Passwords do not match',
            })}
            error={errors.confirmPassword?.message}
          />
          <button
            type="button"
            className="absolute inset-y-11 right-0 pr-3 flex items-center"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>

        <Button
          type="submit"
          className="w-full"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Create account
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Already have an account?</span>
          </div>
        </div>

        <div className="mt-6">
          <Link
            to="/login"
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
          >
            Sign in instead
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;