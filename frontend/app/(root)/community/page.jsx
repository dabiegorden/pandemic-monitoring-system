"use client";

import { useState } from "react";
import { Users, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Benefit card component
const BenefitCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
    <Icon className="text-blue-600 mb-4" size={32} />
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// Activity card component
const ActivityCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
    <Icon className="text-blue-600 mb-4" size={32} />
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// Form input component
const FormField = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  options = [],
  errorMessage,
  ...props
}) => {
  const baseClasses =
    "w-full ring-1 ring-blue-600 px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500";

  return (
    <div className="mb-4">
      <label className="block text-gray-700 mb-2" htmlFor={id}>
        {label}
      </label>
      {type === "select" ? (
        <select
          id={id}
          value={value}
          onChange={onChange}
          className={baseClasses}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          className={baseClasses}
          {...props}
        />
      ) : (
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          className={baseClasses}
          {...props}
        />
      )}
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
    </div>
  );
};

const Community = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profession: "",
    interests: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" }); // Clear field-specific errors on change
  };

  const validateForm = () => {
    const validationErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name) validationErrors.name = "Name is required";
    if (!formData.email) validationErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email))
      validationErrors.email = "Invalid email address";
    if (!formData.profession)
      validationErrors.profession = "Profession is required";
    if (!formData.interests)
      validationErrors.interests = "Interests are required";

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(""); // Reset success message on submit

    if (!validateForm()) return; // Stop submission if validation fails

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include", // Include cookies in the request
      });

      // Check if the response is ok before trying to parse JSON
      if (response.ok) {
        try {
          const result = await response.json();
          console.log("Form submission successful:", result);
        } catch (jsonError) {
          // If JSON parsing fails, we still consider it a success since response was ok
          console.warn(
            "Could not parse JSON response, but submission was successful"
          );
        }

        // Set success message and reset form regardless of JSON parsing
        setSuccessMessage(
          "Thank you for joining our community! We'll be in touch soon."
        );

        // Reset form
        setFormData({
          name: "",
          email: "",
          profession: "",
          interests: "",
        });

        // Scroll to success message
        const formElement = document.getElementById("form");
        if (formElement) {
          formElement.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // Handle non-OK responses
        try {
          const errorResult = await response.json();
          setErrors({
            form:
              errorResult.message ||
              "There was an error submitting your form. Please try again.",
          });
        } catch (jsonError) {
          setErrors({
            form: `Server error: ${response.status} ${response.statusText}`,
          });
        }
      }
    } catch (error) {
      console.error("Error submitting form: ", error);
      setErrors({
        form: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const professionOptions = [
    { value: "", label: "Select your profession" },
    { value: "healthcare", label: "Healthcare Professional" },
    { value: "researcher", label: "Researcher" },
    { value: "public-health", label: "Public Health Official" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 flex items-center justify-center">
              <Users className="mr-4" size={48} />
              Join Our Global Health Community
            </h1>
            <p className="text-xl mb-8">
              Connect with healthcare professionals, researchers, and advocates
              worldwide to make a difference in global health monitoring and
              response.
            </p>
            <Link
              href="#form"
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-blue-50 transition-colors inline-flex text-center justify-center items-center mx-auto"
            >
              Join Now
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Join Form */}
      <div className="bg-blue-50 py-16" id="form">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Ready to Make a Difference?
          </h2>

          {/* Success Message */}
          {successMessage && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-green-700 font-medium">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {errors.form && (
            <Alert className="mb-6" variant="destructive">
              <AlertDescription>{errors.form}</AlertDescription>
            </Alert>
          )}

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <FormField
                label="Full Name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                errorMessage={errors.name}
                disabled={isSubmitting}
              />
              <FormField
                label="Email Address"
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                errorMessage={errors.email}
                disabled={isSubmitting}
              />
              <FormField
                label="Profession"
                id="profession"
                type="select"
                value={formData.profession}
                onChange={handleChange}
                options={professionOptions}
                errorMessage={errors.profession}
                disabled={isSubmitting}
              />
              <FormField
                label="Interests"
                id="interests"
                type="textarea"
                value={formData.interests}
                onChange={handleChange}
                placeholder="Tell us about your interests"
                rows={4}
                errorMessage={errors.interests}
                disabled={isSubmitting}
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-blue-400 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Join the Community"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
