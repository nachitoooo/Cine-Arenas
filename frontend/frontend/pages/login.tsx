// pages/login.tsx

import React from 'react';
import LoginForm from '@/components/component/login-form';
import 'tailwindcss/tailwind.css';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Login</h1>
          <p className="mt-2 text-sm text-gray-400">
            Ingresa tus credenciales para acceder al panel de administración.
          </p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
