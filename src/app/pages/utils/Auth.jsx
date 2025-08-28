'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FcGoogle, FcKey, FcBusinessman } from 'react-icons/fc';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaArrowLeft, FaExclamationTriangle, FaRocket, FaCheckCircle, FaBug, FaChartLine, FaCode, FaCodeBranch, FaRegistered, FaCoffee } from 'react-icons/fa';
import Alert from '@/app/components/utils/Alert';
import { useRouter } from 'next/navigation';
import { GithubIcon } from 'lucide-react';

const AuthSystem = () => {
  // ==================== STATE MANAGEMENT ====================
  
  // Core authentication states
  const [isLogin, setIsLogin] = useState(true); // Toggle between login/register modes
  const [showPassword, setShowPassword] = useState(false); // Password visibility toggle
  const [showOTPForm, setShowOTPForm] = useState(false); // OTP verification form visibility
  const [isLoading, setIsLoading] = useState(false); // Loading state for async operations
  
  // Error and alert management
  const [error, setError] = useState(''); // General error messages
  const [alert, setAlert] = useState({ show: false, type: '', message: '' }); // Alert notifications
  const [passwordErrors, setPasswordErrors] = useState([]); // Password validation errors
  
  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    otp: ''
  });

  // Next.js router for navigation
  const router = useRouter();

  // ==================== EFFECTS ====================
  
  /**
   * Auto-clear error messages after 5 seconds
   * Improves UX by not keeping error messages visible indefinitely
   */
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  /**
   * Auto-clear alert notifications after 5 seconds
   * Prevents alert overflow and maintains clean UI
   */
  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // ==================== VALIDATION FUNCTIONS ====================
  
  /**
   * Comprehensive password validation
   * Ensures strong password requirements are met
   * @param {string} password - Password to validate
   * @returns {boolean} - True if password is valid
   */
  const validatePassword = (password) => {
    const errors = [];
    
    // Minimum length requirement
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters");
    }
    
    // Uppercase letter requirement
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    
    // Lowercase letter requirement
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    
    // Number requirement
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    
    // Special character requirement
    if (!/[@$!%*?&]/.test(password)) {
      errors.push("Password must contain at least one special character (@$!%*?&)");
    }
    
    setPasswordErrors(errors);
    return errors.length === 0;
  };

  /**
   * Validate email format using regex
   * @param {string} email - Email to validate
   * @returns {boolean} - True if email format is valid
   */
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Validate OTP format (6 digits)
   * @param {string} otp - OTP to validate
   * @returns {boolean} - True if OTP format is valid
   */
  const validateOTP = (otp) => {
    const otpRegex = /^\d{6}$/;
    return otpRegex.test(otp);
  };

  // ==================== EVENT HANDLERS ====================
  
  /**
   * Handle form input changes
   * Clears errors and validates password in real-time
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing (immediate feedback)
    if (error) setError('');
    
    // Real-time password validation for registration
    if (name === 'password' && !isLogin) {
      validatePassword(value);
    }
  };

  /**
   * Handle OTP sending for registration
   * Validates form data and sends OTP to user's email
   * @param {Event} e - Form submit event
   */
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Validate email format before proceeding
      if (!validateEmail(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Validate password requirements before sending OTP
      if (!validatePassword(formData.password)) {
        setAlert({
          show: true,
          type: 'error',
          message: 'Please fix password errors before proceeding'
        });
        return;
      }

      // Check if name is provided
      if (!formData.name.trim()) {
        throw new Error('Please enter your full name');
      }

      console.log('Sending OTP to:', formData.email);
      
      // API call to send OTP
      const response = await fetch(`http://localhost:5000/api/v1/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Success: Show OTP form and display success message
        setShowOTPForm(true);
        setError('');
        setAlert({
          show: true,
          type: 'success',
          message: 'OTP sent to your email successfully! Please check your inbox.'
        });
      } else {
        throw new Error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError(error.message);
      setAlert({
        show: true,
        type: 'error',
        message: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle user registration with OTP verification
   * Validates OTP and creates new user account
   * @param {Event} e - Form submit event
   */
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Validate OTP format
      if (!validateOTP(formData.otp)) {
        throw new Error('OTP must be exactly 6 digits');
      }

      // Additional validation checks
      if (!formData.name.trim()) {
        throw new Error('Name is required');
      }

      if (!validateEmail(formData.email)) {
        throw new Error('Invalid email format');
      }

      if (!validatePassword(formData.password)) {
        throw new Error('Password does not meet requirements');
      }

      // API call to register user
      const response = await fetch(`http://localhost:5000/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Success: Store token and redirect to login
        localStorage.setItem('token', data.token);
        setError('');
        setAlert({
          show: true,
          type: 'success',
          message: 'Registration successful! Redirecting to login...'
        });
        
        // Auto-redirect to login after 2 seconds
        setTimeout(() => {
          setIsLogin(true);
          setShowOTPForm(false);
          // Reset form data
          setFormData({ name: '', email: '', password: '', otp: '' });
        }, 2000);
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error registering:', error);
      setError(error.message);
      setAlert({
        show: true,
        type: 'error',
        message: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle user login
   * Authenticates user with email and password
   * @param {Event} e - Form submit event
   */
const handleLogin = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');
  
  try {
    // Validate email format
    if (!validateEmail(formData.email)) {
      throw new Error('Please enter a valid email address');
    }

    // Check password is provided
    if (!formData.password) {
      throw new Error('Password is required');
    }

    // API call to authenticate user
    const response = await fetch(`http://localhost:5000/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      }),
    });

    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error('Invalid server response');
    }

    if (response.ok) {
      // Success: Store token and redirect to app
      document.cookie = `token=${data.token}; path=/; max-age=86400`;
      console.log('Token saved in the cookie');
      localStorage.setItem('token', data.token);

      setError('');
      setAlert({
        show: true,
        type: 'success',
        message: 'Login successful! Welcome to Calf.'
      });

      // Redirect to main app after 1.5 seconds
      setTimeout(() => {
        router.push('/app');
      }, 1500);
    } else {
      throw new Error(data.message || 'Login failed');
    }
  } catch (error) {
    console.error('Error logging in:', error);
    setError(error.message);
    setAlert({
      show: true,
      type: 'error',
      message: error.message
    });
  } finally {
    setIsLoading(false);
  }
};


  /**
   * Handle Google OAuth authentication
   * Redirects user to backend Google OAuth endpoint
   */
  const handleGoogleAuth = () => {
    try {
      // Redirect to backend Google OAuth endpoint
      window.location.href = `http://localhost:5000/api/v1/auth/google`;
    } catch (error) {
      console.error('Error initiating Google auth:', error);
      setAlert({
        show: true,
        type: 'error',
        message: 'Failed to initialize Google authentication. Please try again.'
      });
    }
  };

  // ==================== UTILITY FUNCTIONS ====================
  
  /**
   * Check if Send OTP button should be disabled
   * @returns {boolean} - True if button should be disabled
   */
  const isSendOTPDisabled = () => {
    return !formData.name || !formData.email || !formData.password || passwordErrors.length > 0;
  };

  /**
   * Check if Login button should be disabled
   * @returns {boolean} - True if button should be disabled
   */
  const isLoginDisabled = () => {
    return !formData.email || !formData.password;
  };

  // ==================== RENDER ====================
  
  return (
    <div className="min-h-screen flex" style={{
      background: 'radial-gradient(circle, #fce7f3, #ffffff, #f0f9ff, #dbeafe)'
    }}>
      
      {/* LEFT SIDE - Welcome Section */}
          <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
      <div className="max-w-lg text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Welcome to <span className="text-purple-600">Metronique</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Combine the power of <span className="font-semibold text-purple-600">VS Code</span>, 
            <span className="font-semibold text-blue-600"> GitHub</span>, 
            <span className="font-semibold text-pink-600"> AI Analytics</span>, and 
            <span className="font-semibold text-indigo-600"> OpenAI</span> to automate your development workflow.
          </p>
          <p className="text-lg text-gray-500 mb-12">
            Let AI track your daily logs, manage project scenarios, and deliver comprehensive development reports automatically.
          </p>
          
          {/* Feature Icons */}
          <div className="flex justify-center space-x-8 mb-8">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md"
            >
              <FaCodeBranch className="text-3xl text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">VS Code</span>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md"
            >
              <GithubIcon className="text-3xl text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">GitHub Sync</span>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md"
            >
              <FaChartLine className="text-3xl text-pink-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Analytics</span>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md"
            >
              <FaRegistered className="text-3xl text-indigo-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Auto Tracking</span>
            </motion.div>
          </div>
          
          {/* Coffee Icon */}
          <motion.div
            className="flex justify-center mb-6"
          >
            <FaCoffee className="text-4xl text-blue-900" />
          </motion.div>
        </motion.div>
      </div>
    </div>

      {/* RIGHT SIDE - Authentication Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          
          {/* Alert component - Shows success/error notifications */}
          {alert.show && (
            <div className="mb-4">
              <Alert type={alert.type} message={alert.message} />
            </div>
          )}

          {/* Animated form transitions */}
          <AnimatePresence mode="wait">
            
            {/* LOGIN FORM */}
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
              >
                {/* Header with icon */}
                <div className="flex justify-center mb-6">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <FcKey className="text-3xl" />
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Welcome Back</h2>
                <p className="text-center text-gray-600 mb-8">Sign in to continue your journey</p>
                
                <form onSubmit={handleLogin} className="space-y-6">
                  {/* Email Input */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email address"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      required
                    />
                  </div>
                  
                  {/* Password Input with visibility toggle */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FaEyeSlash className="text-gray-400" />
                      ) : (
                        <FaEye className="text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading || isLoginDisabled()}
                    className={`w-full py-3 rounded-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      isLoading || isLoginDisabled()
                        ? 'bg-blue-400 cursor-not-allowed text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </button>
                </form>
                
                {/* Divider */}
                <div className="my-6 flex items-center">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="mx-4 text-gray-500">or</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>
                
                {/* Google OAuth Button */}
                <button
                  onClick={handleGoogleAuth}
                  className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
                >
                  <FcGoogle className="text-xl" />
                  Continue with Google
                </button>
                
                {/* Switch to Register */}
                <p className="text-center mt-8 text-gray-600">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-blue-600 font-semibold cursor-pointer focus:outline-none"
                  >
                    Sign up
                  </button>
                </p>
              </motion.div>
              
            ) : showOTPForm ? (
              
              /* OTP VERIFICATION FORM */
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
              >
                {/* Back Button */}
                <button
                  onClick={() => setShowOTPForm(false)}
                  className="flex items-center text-gray-600 mb-6 hover:text-gray-800 transition"
                >
                  <FaArrowLeft className="mr-2" /> Back
                </button>
                
                {/* Header */}
                <div className="flex justify-center mb-6">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <FcKey className="text-3xl" />
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Verify Email</h2>
                <p className="text-center text-gray-600 mb-8">
                  Enter the OTP sent to {formData.email}
                </p>
                
                <form onSubmit={handleRegister} className="space-y-6">
                  {/* OTP Input */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FcKey className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      placeholder="Enter 6-digit OTP"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-center text-lg tracking-widest"
                      required
                      maxLength={6}
                      pattern="\d{6}"
                    />
                  </div>
                  
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading || !formData.otp}
                    className={`w-full py-3 rounded-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      isLoading || !formData.otp
                        ? 'bg-blue-400 cursor-not-allowed text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isLoading ? 'Verifying...' : 'Verify & Create Account'}
                  </button>
                </form>
              </motion.div>
              
            ) : (
              
              /* REGISTRATION FORM */
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
              >
                {/* Header */}
                <div className="flex justify-center mb-6">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <FcBusinessman className="text-3xl" />
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Create Account</h2>
                <p className="text-center text-gray-600 mb-8">Join us to start your adventure</p>
                
                <form onSubmit={handleSendOTP} className="space-y-6">
                  {/* Name Input */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Full name"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      required
                    />
                  </div>
                  
                  {/* Email Input */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email address"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      required
                    />
                  </div>
                  
                  {/* Password Input */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FaEyeSlash className="text-gray-400" />
                      ) : (
                        <FaEye className="text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  {/* Password Validation Errors Display */}
                  {passwordErrors.length > 0 && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm font-medium text-red-800 mb-2">Password requirements:</p>
                      <ul className="text-xs text-red-600 space-y-1">
                        {passwordErrors.map((error, index) => (
                          <li key={index} className="flex items-start">
                            <FaExclamationTriangle className="mr-2 text-red-500 mt-0.5 flex-shrink-0" />
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading || isSendOTPDisabled()}
                    className={`w-full py-3 rounded-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      isLoading || isSendOTPDisabled()
                        ? 'bg-blue-400 cursor-not-allowed text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isLoading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </form>
                
                {/* Divider */}
                <div className="my-6 flex items-center">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="mx-4 text-gray-500">or</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>
                
                {/* Google OAuth Button */}
                <button
                  onClick={handleGoogleAuth}
                  className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
                >
                  <FcGoogle className="text-xl" />
                  Continue with Google
                </button>
                
                {/* Switch to Login */}
                <p className="text-center mt-8 text-gray-600">
                  Already have an account?{' '}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-blue-600 font-semibold cursor-pointer focus:outline-none"
                  >
                    Sign in
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthSystem;