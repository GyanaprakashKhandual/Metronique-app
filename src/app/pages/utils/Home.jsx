'use client'

import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FaCoffee, FaCode, FaGithub, FaRocket, FaUsers, FaBuilding, FaUser, FaChartLine, FaSync, FaBolt, FaCloud, FaShieldAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function Homepage() {

    const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100">
      {/* Navigation */}
      <motion.nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center space-x-2"
            >
              <FaCoffee className="w-8 h-8 text-blue-900" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Metronique
              </span>
            </motion.div>
            
            <div className="hidden md:flex items-center space-x-8">
              <motion.a href="#features" className="text-gray-700 hover:text-purple-600 transition-colors" whileHover={{ scale: 1.1 }}>
                Documentation
              </motion.a>
              <motion.a href="#pricing" className="text-gray-700 hover:text-purple-600 transition-colors" whileHover={{ scale: 1.1 }}>
                Pricing
              </motion.a>
              <motion.a href="#contact" className="text-gray-700 hover:text-purple-600 transition-colors" whileHover={{ scale: 1.1 }}>
                Contact
              </motion.a>
              <motion.button 
              onClick={() => router.push('/auth')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(147, 51, 234, 0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                Login
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-blue-400/20 to-pink-400/20"
          style={{ y }}
        />
        
        <motion.div 
          className="relative z-10 text-center max-w-6xl mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="mb-8"
          >
            <FaCoffee className="text-6xl text-purple-600 mx-auto mb-6" />
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent"
          >
            Meet Metronique
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed"
          >
            The intelligent project management companion that seamlessly integrates with VS Code and GitHub. 
            Automatically track, manage, and optimize your daily development workflow with AI-powered insights.
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button 
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl"
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 20px 40px rgba(147, 51, 234, 0.4)",
                background: "linear-gradient(45deg, #8B5CF6, #3B82F6, #EC4899)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Free
            </motion.button>
            <motion.button 
              className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-600 hover:text-white transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Watch Demo
            </motion.button>
          </motion.div>
        </motion.div>
        
        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-20"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-20"
          animate={{
            y: [0, 20, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to streamline your development workflow and boost productivity
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FaCode,
                title: "VS Code Integration",
                description: "Seamlessly integrates with Visual Studio Code through our powerful extension"
              },
              {
                icon: FaGithub,
                title: "GitHub Sync",
                description: "Automatically syncs with your GitHub repositories for comprehensive project tracking"
              },
              {
                icon: FaChartLine,
                title: "AI-Powered Analytics",
                description: "Get intelligent insights about your coding patterns and project progress"
              },
              {
                icon: FaSync,
                title: "Auto Tracking",
                description: "Automatically reads your code and captures daily logs separated by project"
              },
              {
                icon: FaBolt,
                title: "Real-time Updates",
                description: "Instant synchronization of your development activities across all platforms"
              },
              {
                icon: FaShieldAlt,
                title: "Secure & Private",
                description: "Your code and data are protected with enterprise-grade security"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: "0 20px 40px rgba(147, 51, 234, 0.1)"
                }}
              >
                <feature.icon className="text-3xl text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Perfect For Everyone
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From individual developers to enterprise teams, Metronique adapts to your workflow
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FaUser,
                title: "Personal Projects",
                description: "Track your personal coding journey and maintain momentum on side projects",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: FaBuilding,
                title: "Organizations",
                description: "Streamline team collaboration and get insights into organizational productivity",
                color: "from-blue-500 to-purple-500"
              },
              {
                icon: FaUsers,
                title: "Companies",
                description: "Scale your development operations with enterprise-grade project management",
                color: "from-pink-500 to-blue-500"
              }
            ].map((useCase, index) => (
              <motion.div
                key={index}
                className="relative bg-white p-8 rounded-3xl shadow-lg overflow-hidden group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-br ${useCase.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />
                <useCase.icon className="text-4xl text-gray-700 mb-6" />
                <h3 className="text-2xl font-bold mb-4 text-gray-800">{useCase.title}</h3>
                <p className="text-gray-600 text-lg">{useCase.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Simple Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect plan for your needs. Start free and scale as you grow.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "Free",
                description: "Perfect for personal projects",
                features: ["Up to 3 projects", "Basic analytics", "VS Code extension", "Community support"]
              },
              {
                name: "Pro",
                price: "$19/mo",
                description: "For professional developers",
                features: ["Unlimited projects", "Advanced analytics", "Priority support", "Team collaboration", "API access"],
                popular: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For large organizations",
                features: ["Custom integrations", "Advanced security", "Dedicated support", "On-premise deployment", "SLA guarantee"]
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                className={`relative p-8 rounded-3xl shadow-lg ${
                  plan.popular 
                    ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white transform scale-105' 
                    : 'bg-gradient-to-br from-purple-50 to-blue-50'
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {plan.popular && (
                  <motion.div 
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Most Popular
                  </motion.div>
                )}
                
                <div className="text-center">
                  <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-800'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-4xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-purple-600'}`}>
                    {plan.price}
                  </p>
                  <p className={`mb-6 ${plan.popular ? 'text-purple-100' : 'text-gray-600'}`}>
                    {plan.description}
                  </p>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className={`flex items-center justify-center ${plan.popular ? 'text-white' : 'text-gray-600'}`}>
                        <FaRocket className="mr-2 text-sm" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <motion.button
                    className={`w-full py-3 rounded-full font-semibold transition-all ${
                      plan.popular
                        ? 'bg-white text-purple-600 hover:bg-gray-100'
                        : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Get Started
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who are already boosting their productivity with Metronique
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <motion.button 
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl"
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 20px 40px rgba(147, 51, 234, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                Start Free Trial
              </motion.button>
              <motion.button 
                className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-600 hover:text-white transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Sales
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <FaCoffee className="text-2xl text-purple-400" />
                <span className="text-2xl font-bold">Metronique</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                The intelligent project management companion for modern developers. 
                Streamline your workflow with AI-powered insights and seamless integrations.
              </p>
              <div className="flex space-x-4">
                <motion.div 
                  className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer"
                  whileHover={{ scale: 1.1, backgroundColor: "#8B5CF6" }}
                >
                  <FaGithub />
                </motion.div>
                <motion.div 
                  className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer"
                  whileHover={{ scale: 1.1, backgroundColor: "#3B82F6" }}
                >
                  <FaCloud />
                </motion.div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Metronique. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}