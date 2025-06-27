/**
 * Contact Page Component
 * 
 * A comprehensive contact interface that provides multiple ways for users to get in touch.
 * Features include:
 * - Interactive contact form with real-time validation and animations
 * - Multiple contact methods display (phone, email, location)
 * - Embedded Google Maps integration
 * - Animated FAQ section with expandable answers
 * - Responsive design with smooth animations
 * - Success/failure state handling
 * 
 * @component
 * @example
 * return (
 *   <Contact />
 * )
 */

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, ArrowRight, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedPageHeader from '../../components/common/AnimatedPageHeader';

export default function Contact() {
  /**
   * Form state management
   * Handles user input for the contact form fields
   */
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  /**
   * UI state management
   * Controls form submission feedback and FAQ accordion
   */
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  /**
   * Handles form submission
   * Currently implements a simulated submission with success feedback
   * TODO: Implement actual form submission logic
   * 
   * @param {React.FormEvent} e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  /**
   * Handles form field changes
   * Updates form state as user types in any input field
   * 
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - Input change event
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Animation Variants
   * Defines various animation configurations for different components
   */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const contentVariants = {
    collapsed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    },
    expanded: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  };

  /**
   * FAQ Data
   * Static content for frequently asked questions
   * Each object contains a question (q) and answer (a)
   */
  const faqs = [
    {
      q: "What services do you offer?",
      a: "We offer a comprehensive range of digital solutions including web development, mobile apps, and digital marketing strategies."
    },
    {
      q: "How quickly do you respond to inquiries?",
      a: "We aim to respond to all inquiries within 24 business hours. For urgent matters, please contact us directly by phone."
    },
    {
      q: "Do you offer virtual consultations?",
      a: "Yes, we provide virtual consultations via Zoom, Google Meet, or your preferred platform for clients worldwide."
    },
    {
      q: "What is your service area?",
      a: "While we're based in Chitwan, Nepal, we serve clients globally and have experience working with international businesses."
    }
  ];

  /**
   * Scroll Reveal Animation
   * Defines the animation for elements as they enter the viewport
   */
  const scrollRevealVariants = {
    hidden: { 
      opacity: 0,
      y: 100
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Animated Page Header Component */}
      <AnimatedPageHeader
        title="Let's Start a Conversation"
        description="Have a question or want to work together? We'd love to hear from you."
        icons={[<Mail size="100%" />, <Phone size="100%" />, <MapPin size="100%" />]}
      />

      {/* Contact Methods Section - Displays different ways to get in touch */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32">
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Method Cards - Each with hover animations and gradient effects */}
          {[
            {
              icon: Phone,
              title: "Call Us",
              description: "Mon-Fri from 8am to 5pm",
              action: "+977-1-234567",
              color: "from-blue-500 to-cyan-400"
            },
            {
              icon: Mail,
              title: "Email Us",
              description: "We'll respond within 24 hours",
              action: "contact@example.com",
              color: "from-purple-500 to-pink-500"
            },
            {
              icon: MapPin,
              title: "Visit Us",
              description: "Come say hello at our office",
              action: "Pokhara-30, Kaski, Nepal",
              color: "from-amber-500 to-orange-400"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              className="relative group"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {/* Dynamic gradient background with hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-xl"
                style={{ background: `linear-gradient(to right, var(--tw-gradient-${item.color}))` }}
              />
              {/* Card content with icon, title, and action link */}
              <div className="relative bg-white p-8 rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300">
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${item.color} text-white mb-4`}>
                  <item.icon size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <a href="#" className="inline-flex items-center text-indigo-600 hover:text-indigo-700">
                  {item.action}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Main Content Section - Contact Form and Map */}
      <div className="min-h-screen py-20 bg-gray-50">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={scrollRevealVariants}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          {/* Two-column layout container */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Interactive Contact Form with Animations */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 h-[800px] overflow-y-auto"
            >
              <h2 className="text-3xl font-bold mb-8">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Dynamic Form Fields with Hover Animations */}
                {[
                  { name: "name", label: "Full Name", type: "text" },
                  { name: "email", label: "Email Address", type: "email" },
                  { name: "subject", label: "Subject", type: "text" }
                ].map((field) => (
                  <motion.div
                    key={field.name}
                    whileHover={{ scale: 1.01 }}
                    className="group"
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name as keyof typeof formData]}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </motion.div>
                ))}
                
                {/* Message Input Area */}
                <motion.div whileHover={{ scale: 1.01 }}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </motion.div>

                {/* Animated Submit Button with Success State */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-lg font-medium flex items-center justify-center space-x-2 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                >
                  <AnimatePresence mode='wait'>
                    {isSubmitted ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center"
                      >
                        <CheckCircle className="mr-2" size={20} />
                        Sent Successfully!
                      </motion.div>
                    ) : (
                      <motion.div
                        key="send"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center"
                      >
                        <Send className="mr-2" size={20} />
                        Send Message
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </form>
            </motion.div>

            {/* Interactive Map Section */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-xl overflow-hidden h-[800px]"
            >
              <div className="h-full">
                {/* Embedded Google Maps with Location */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113058.2132937578!2d84.3520225!3d27.6783907!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3994fb37e078d531%3A0x973f22922ea702f7!2sChitwan%2044200!5e0!3m2!1sen!2snp!4v1647827138000!5m2!1sen!2snp"
                  width="100%"
                  height="90%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  className="rounded-lg"
                />
                {/* Location Information Bar */}
                <div className="p-6 bg-white h-[10%]">
                  <div className="flex items-center space-x-3 text-gray-700">
                    <MapPin className="h-5 w-5 text-indigo-600" />
                    <p>Bharatpur, Chitwan, Nepal</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* FAQ Section with Animated Accordion */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mt-32 mb-20"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-4xl font-bold text-center mb-4"
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-gray-600 text-center mb-12 max-w-2xl mx-auto"
            >
              Got questions? We've got answers! Check out our most commonly asked questions below.
            </motion.p>
            
            {/* FAQ Accordion with Animated Transitions */}
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={`faq-${index}`}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  layout
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
                >
                  {/* Expandable Question Button */}
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.01 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full p-6 text-left flex justify-between items-center group"
                    >
                      <span className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
                        {faq.q}
                      </span>
                      {/* Animated Expansion Indicator */}
                      <motion.div
                        animate={{ 
                          rotate: expandedFaq === index ? 90 : 0,
                          backgroundColor: expandedFaq === index ? 'rgb(99 102 241)' : 'rgb(243 244 246)'
                        }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-violet-600"
                      >
                        <ArrowRight className={`h-4 w-4 transition-colors duration-200 ${
                          expandedFaq === index 
                            ? 'text-white' 
                            : 'text-gray-500 group-hover:text-white/90'
                        }`} />
                      </motion.div>
                    </button>
                  </motion.div>

                  {/* Animated Answer Panel */}
                  <AnimatePresence initial={false}>
                    {expandedFaq === index && (
                      <motion.div
                        key={`content-${index}`}
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        variants={contentVariants}
                        className="overflow-hidden"
                      >
                        <motion.div 
                          className="p-6 pt-0 text-gray-600 bg-gradient-to-b from-white to-gray-50"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="prose prose-sm max-w-none">
                            {faq.a}
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
