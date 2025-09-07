"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Home,
  RefreshCw,
  ArrowLeft,
  Bug,
  Wifi,
  Server,
} from "lucide-react";

const Error = ({
  errorCode = "404",
  title = "Page Not Found",
  description = "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.",
  showHomeButton = true,
  showBackButton = true,
  showRefreshButton = true,
  onHomeClick,
  onBackClick,
  onRefreshClick,
  customIcon,
  customActions,
  variant = "default", // 'default', 'minimal', 'detailed'
  theme = "light", // 'light', 'dark'
}) => {
  const getIcon = () => {
    if (customIcon) return customIcon;

    switch (errorCode) {
      case "404":
        return <AlertTriangle className="w-16 h-16" />;
      case "500":
        return <Server className="w-16 h-16" />;
      case "403":
        return <Bug className="w-16 h-16" />;
      case "network":
        return <Wifi className="w-16 h-16" />;
      default:
        return <AlertTriangle className="w-16 h-16" />;
    }
  };

  const handleHomeClick = () => {
    if (onHomeClick) {
      onHomeClick();
    } else {
      window.location.href = "/";
    }
  };

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      window.history.back();
    }
  };

  const handleRefreshClick = () => {
    if (onRefreshClick) {
      onRefreshClick();
    } else {
      window.location.reload();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10,
        delay: 0.2,
      },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  const themeClasses =
    theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900";

  const cardClasses =
    theme === "dark"
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-200 shadow-xl";

  const buttonClasses =
    theme === "dark"
      ? "bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
      : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300";

  const primaryButtonClasses =
    theme === "dark"
      ? "bg-blue-600 hover:bg-blue-700 text-white"
      : "bg-blue-600 hover:bg-blue-700 text-white";

  if (variant === "minimal") {
    return (
      <motion.div
        className={`min-h-screen flex items-center justify-center p-4 ${themeClasses}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center">
          <motion.div
            variants={iconVariants}
            className={`flex justify-center mb-6 ${theme === "dark" ? "text-red-400" : "text-red-500"
              }`}
          >
            {getIcon()}
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="text-4xl font-bold mb-4"
          >
            {errorCode}
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className={`text-lg mb-8 max-w-md ${theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
          >
            {title}
          </motion.p>
          {showHomeButton && (
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleHomeClick}
              className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${primaryButtonClasses}`}
            >
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </motion.button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`min-h-screen flex items-center justify-center p-4 ${themeClasses}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className={`max-w-md w-full p-8 rounded-2xl border ${cardClasses}`}
        variants={itemVariants}
        whileHover={{ y: -5, transition: { duration: 0.3 } }}
      >
        <motion.div
          variants={iconVariants}
          className={`flex justify-center mb-6 ${theme === "dark" ? "text-red-400" : "text-red-500"
            }`}
        >
          {getIcon()}
        </motion.div>

        <motion.div variants={itemVariants} className="text-center mb-6">
          <h1
            className={`text-6xl font-bold mb-2 ${theme === "dark" ? "text-gray-100" : "text-gray-900"
              }`}
          >
            {errorCode}
          </h1>
          <h2
            className={`text-2xl font-semibold mb-4 ${theme === "dark" ? "text-gray-200" : "text-gray-800"
              }`}
          >
            {title}
          </h2>
          <p
            className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"
              } leading-relaxed`}
          >
            {description}
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-3">
          {showHomeButton && (
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleHomeClick}
              className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-colors ${primaryButtonClasses}`}
            >
              <Home className="w-5 h-5 mr-2" />
              Go to Homepage
            </motion.button>
          )}

          <div className="flex space-x-3">
            {showBackButton && (
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={handleBackClick}
                className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg border font-medium transition-colors ${buttonClasses}`}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </motion.button>
            )}

            {showRefreshButton && (
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={handleRefreshClick}
                className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg border font-medium transition-colors ${buttonClasses}`}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </motion.button>
            )}
          </div>

          {customActions && (
            <motion.div variants={itemVariants} className="pt-2">
              {customActions}
            </motion.div>
          )}
        </motion.div>

        {variant === "detailed" && (
          <motion.div
            variants={itemVariants}
            className={`mt-6 pt-6 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
          >
            <p
              className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-500"
                }`}
            >
              If the problem persists, please contact support or try again
              later.
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Error;