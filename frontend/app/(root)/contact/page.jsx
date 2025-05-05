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

  // Existing form handling methods remain the same
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      }
    }
  };

  const animationVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="contact-page bg-gray-50">
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={animationVariants}
        className="bg-gradient-to-br from-gray-900 to-gray-700 text-white"
      >
        <div className="container mx-auto px-4 py-20 text-center mt-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-8">
            We're here to help and answer any questions you might have. We look
            forward to hearing from you!
          </p>
          <a
            href="#contact-form"
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-full transition duration-300 transform hover:-translate-y-1 hover:scale-110"
          >
            Contact Us Now
          </a>
        </div>
      </motion.div>

      {/* Contact Info Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={animationVariants}
        className="container mx-auto px-4 py-16"
      >
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <FaMapMarkerAlt className="text-4xl text-orange-600" />,
              title: "Our Location",
              description:
                "123 Pandemic Research Center, Global Health District",
            },
            {
              icon: <FaEnvelope className="text-4xl text-orange-600" />,
              title: "Email Us",
              description: "support@pandemicmonitor.com",
            },
            {
              icon: <FaPhoneAlt className="text-4xl text-orange-600" />,
              title: "Call Us",
              description: "+1 (555) 123-4567",
            },
          ].map((contact, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all transform hover:-translate-y-2"
            >
              <div className="flex flex-col items-center">
                {contact.icon}
                <h3 className="text-xl font-semibold mt-4 mb-2">
                  {contact.title}
                </h3>
                <p className="text-gray-600">{contact.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Why Contact Us Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={animationVariants}
        className="bg-white py-16"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why <span className="text-orange-600">Contact Us?</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaUsers className="text-4xl text-orange-600" />,
                title: "Expert Support",
                description:
                  "Our team of global health experts is ready to provide comprehensive insights and guidance.",
              },
              {
                icon: <FaLightbulb className="text-4xl text-orange-600" />,
                title: "Innovative Solutions",
                description:
                  "We're constantly developing cutting-edge approaches to pandemic monitoring and response.",
              },
              {
                icon: <FaShieldAlt className="text-4xl text-orange-600" />,
                title: "Data Protection",
                description:
                  "Your privacy and data security are our top priorities in all communications.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-all transform hover:-translate-y-2"
              >
                <div className="flex flex-col items-center">
                  {item.icon}
                  <h3 className="text-xl font-semibold mt-4 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Contact Form Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={animationVariants}
        className="container mx-auto px-4 py-16"
        id="contact-form"
      >
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
          {submitted ? (
            <div className="text-center">
              <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-4">
                Message Sent Successfully!
              </h2>
              <p className="mb-6 text-gray-600">
                Thank you for reaching out. We'll get back to you as soon as
                possible.
              </p>
              <Link
                href="/"
                className="inline-block bg-orange-600 text-white px-6 py-3 rounded-full hover:bg-orange-700 transition-colors"
              >
                Return to Home
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-2 font-semibold">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full ring-2 ring-slate-400 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Your Name"
                />
                {errors.name && (
                  <p className="text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block mb-2 font-semibold">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full ring-2 ring-slate-400 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Your Email"
                />
                {errors.email && (
                  <p className="text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="subject" className="block mb-2 font-semibold">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full ring-2 ring-slate-400 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    errors.subject ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Subject"
                />
                {errors.subject && (
                  <p className="text-red-500 mt-1">{errors.subject}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block mb-2 font-semibold">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full ring-2 ring-slate-400 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    errors.message ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Your Message"
                ></textarea>
                {errors.message && (
                  <p className="text-red-500 mt-1">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 text-white py-3 rounded-full hover:bg-orange-700 transition-colors font-semibold"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
