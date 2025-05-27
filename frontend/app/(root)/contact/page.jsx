"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaCheckCircle,
  FaUsers,
  FaLightbulb,
  FaShieldAlt,
  FaPaperPlane,
  FaArrowRight,
} from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = "Name is required!";
    if (!formData.email) errors.email = "Email is required!";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Email is invalid";
    if (!formData.subject) errors.subject = "Subject is required!";
    if (!formData.message) errors.message = "Message is required!";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      setIsSubmitting(true);
      try {
        const response = await fetch("http://localhost:5000/api/contacts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          setSubmitted(true);
          setFormData({ name: "", email: "", subject: "", message: "" });
        } else {
          console.error("Error submitting form");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const floatAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <div className="contact-page bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">
      {/* Hero Section with Enhanced Gradient */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
        className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={floatAnimation}
            className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"
          />
          <motion.div
            animate={{ ...floatAnimation, transition: { ...floatAnimation.transition, delay: 1 } }}
            className="absolute bottom-20 right-20 w-40 h-40 bg-orange-500/10 rounded-full blur-xl"
          />
          <motion.div
            animate={{ ...floatAnimation, transition: { ...floatAnimation.transition, delay: 2 } }}
            className="absolute top-1/2 left-1/2 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"
          />
        </div>

        <div className="relative container mx-auto px-4 py-24 text-center mt-10">
          <motion.div variants={itemVariants}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-orange-200 bg-clip-text text-transparent">
              Get in Touch
            </h1>
          </motion.div>
          <motion.p variants={itemVariants} className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-slate-200 leading-relaxed">
            We're here to help and answer any questions you might have. We look
            forward to hearing from you and building something amazing together!
          </motion.p>
          <motion.a
            variants={itemVariants}
            href="#contact-form"
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Contact Us Now
            <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
          </motion.a>
        </div>
      </motion.div>

      {/* Contact Info Section with Enhanced Cards */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
        className="container mx-auto px-4 py-20"
      >
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <FaMapMarkerAlt className="text-4xl text-orange-500" />,
              title: "Our Location",
              description: "123 Pandemic Research Center, Global Health District",
              color: "from-orange-400 to-red-400",
            },
            {
              icon: <FaEnvelope className="text-4xl text-blue-500" />,
              title: "Email Us",
              description: "support@pandemicmonitor.com",
              color: "from-blue-400 to-cyan-400",
            },
            {
              icon: <FaPhoneAlt className="text-4xl text-green-500" />,
              title: "Call Us",
              description: "+1 (555) 123-4567",
              color: "from-green-400 to-emerald-400",
            },
          ].map((contact, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 text-center border border-white/20"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${contact.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
              <div className="relative flex flex-col items-center">
                <div className="mb-4 p-4 rounded-full bg-gradient-to-br from-white to-slate-50 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  {contact.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800">
                  {contact.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">{contact.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Why Contact Us Section with Enhanced Design */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
        className="relative bg-white/60 backdrop-blur-sm py-20"
      >
        <div className="container mx-auto px-4">
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-center mb-16 text-slate-800">
            Why <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Contact Us?</span>
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaUsers className="text-4xl text-blue-500" />,
                title: "Expert Support",
                description: "Our team of global health experts is ready to provide comprehensive insights and guidance.",
                gradient: "from-blue-500/10 to-cyan-500/10",
              },
              {
                icon: <FaLightbulb className="text-4xl text-yellow-500" />,
                title: "Innovative Solutions",
                description: "We're constantly developing cutting-edge approaches to pandemic monitoring and response.",
                gradient: "from-yellow-500/10 to-orange-500/10",
              },
              {
                icon: <FaShieldAlt className="text-4xl text-green-500" />,
                title: "Data Protection",
                description: "Your privacy and data security are our top priorities in all communications.",
                gradient: "from-green-500/10 to-emerald-500/10",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`group relative bg-gradient-to-br ${item.gradient} rounded-2xl p-8 text-center shadow-md hover:shadow-xl transition-all duration-300 border border-white/30`}
              >
                <div className="flex flex-col items-center">
                  <div className="mb-6 p-4 rounded-full bg-white/80 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-slate-800">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Enhanced Contact Form Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
        className="container mx-auto px-4 py-20"
        id="contact-form"
      >
        <div className="max-w-3xl mx-auto">
          <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-white/20">
            {submitted ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="mb-8 p-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 w-24 h-24 mx-auto flex items-center justify-center">
                  <FaCheckCircle className="text-4xl text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-6 text-slate-800">
                  Message Sent Successfully!
                </h2>
                <p className="mb-8 text-slate-600 text-lg leading-relaxed">
                  Thank you for reaching out. We'll get back to you as soon as
                  possible with a comprehensive response.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-4 rounded-full hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Return to Home
                  <FaArrowRight />
                </Link>
              </motion.div>
            ) : (
              <>
                <motion.div variants={itemVariants} className="text-center mb-10">
                  <h2 className="text-3xl font-bold mb-4 text-slate-800">Send Us a Message</h2>
                  <p className="text-slate-600 text-lg">Fill out the form below and we'll get back to you shortly</p>
                </motion.div>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <motion.div variants={itemVariants}>
                      <label htmlFor="name" className="block mb-3 font-semibold text-slate-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none transition-all duration-300 bg-white shadow-sm ${
                          errors.name 
                            ? "border-red-400 focus:border-red-500 focus:shadow-red-100 shadow-red-50" 
                            : "border-slate-300 focus:border-blue-500 hover:border-slate-400 focus:shadow-blue-100"
                        }`}
                        placeholder="Enter your full name"
                      />
                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 mt-2 text-sm"
                        >
                          {errors.name}
                        </motion.p>
                      )}
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <label htmlFor="email" className="block mb-3 font-semibold text-slate-700">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none transition-all duration-300 bg-white shadow-sm ${
                          errors.email 
                            ? "border-red-400 focus:border-red-500 focus:shadow-red-100 shadow-red-50" 
                            : "border-slate-300 focus:border-blue-500 hover:border-slate-400 focus:shadow-blue-100"
                        }`}
                        placeholder="Enter your email address"
                      />
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 mt-2 text-sm"
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </motion.div>
                  </div>

                  <motion.div variants={itemVariants}>
                    <label htmlFor="subject" className="block mb-3 font-semibold text-slate-700">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none transition-all duration-300 bg-white shadow-sm ${
                        errors.subject 
                          ? "border-red-400 focus:border-red-500 focus:shadow-red-100 shadow-red-50" 
                          : "border-slate-300 focus:border-blue-500 hover:border-slate-400 focus:shadow-blue-100"
                      }`}
                      placeholder="What is this regarding?"
                    />
                    {errors.subject && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 mt-2 text-sm"
                      >
                        {errors.subject}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label htmlFor="message" className="block mb-3 font-semibold text-slate-700">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none transition-all duration-300 bg-white shadow-sm resize-none ${
                        errors.message 
                          ? "border-red-400 focus:border-red-500 focus:shadow-red-100 shadow-red-50" 
                          : "border-slate-300 focus:border-blue-500 hover:border-slate-400 focus:shadow-blue-100"
                      }`}
                      placeholder="Tell us more about your inquiry..."
                    ></textarea>
                    {errors.message && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 mt-2 text-sm"
                      >
                        {errors.message}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.button
                    variants={itemVariants}
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-slate-400 disabled:to-slate-500 text-white py-4 rounded-xl transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-3 cursor-pointer border-2 border-transparent"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <FaPaperPlane />
                      </>
                    )}
                  </motion.button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;