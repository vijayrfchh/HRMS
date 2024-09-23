import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (input) => {
    const emailPattern = /^[a-z][a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    return emailPattern.test(input);
  };

  const validatePhoneNumber = (input) => {
    const phonePattern = /^\d{10}$/;
    return phonePattern.test(input);
  };

  const validatePassword = (input) => {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(input);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;

    if (!validateEmail(email) && !validatePhoneNumber(email)) {
      setEmailError('Please enter a valid email or a 10-digit phone number.');
      isValid = false;
    } else if (validateEmail(email) && email[0] === email[0].toUpperCase()) {
      setEmailError('Email cannot start with a capital letter.');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!validatePassword(password)) {
      setPasswordError('At least 8 characters long and include uppercase, lowercase, number, and special character.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (isValid) {
      console.log('Email or Phone:', email);
      console.log('Password:', password);
      setSuccessMessage('Login Successful');

      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);

      setEmail('');
      setPassword('');
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100">
      {/* Success message popup */}
      {successMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg animate__animated animate__fadeIn animate__faster">
            <p className="text-2xl font-bold text-green-600">{successMessage}</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-2xl h-full p-8 bg-white shadow-md rounded-lg z-10 animate__animated animate__fadeIn animate__delay-1s">
        <h1 className="text-2xl font-bold mb-6 p-8 text-center text-green-400">Login To Your Account</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email ID or Phone Number</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm ${emailError ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              aria-invalid={!!emailError}
              aria-describedby="email-error"
            />
            {emailError && <p id="email-error" className="text-red-500 text-sm mt-1">{emailError}</p>}
          </div>
          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value.slice(0, 12))}
                required
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm ${passwordError ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 pr-10`}
                aria-invalid={!!passwordError}
                aria-describedby="password-error"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {passwordError && <p id="password-error" className="text-red-500 text-sm mt-1">{passwordError}</p>}
          </div>
          <div className="mt-2 text-right">
            <a href="/forgot-password" className="text-sm text-green-600 hover:text-green-500 p-6">Forgot Password</a>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-400 text-white font-semibold rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-transform transform hover:scale-105 mt-5"
          >
            Login
          </button>
        </form>
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't Have An Account?{' '}
            <a href="/register" className="text-green-600 hover:text-green-500 font-medium underline">Register Now</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
