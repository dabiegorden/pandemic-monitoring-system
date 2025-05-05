import React from "react";
import {
  Briefcase,
  Code,
  Layers,
  Stethoscope,
  Heart,
  Award,
  Clock,
  Laptop,
  Globe,
  BookOpen,
  ArrowRight,
  MessageCircle,
  Users,
} from "lucide-react";

const CareersPage = () => {
  const openPositions = [
    {
      title: "Epidemiological Data Analyst",
      department: "Research",
      icon: Stethoscope,
    },
    {
      title: "Full Stack Developer",
      department: "Technology",
      icon: Code,
    },
    {
      title: "Data Visualization Specialist",
      department: "Analytics",
      icon: Layers,
    },
  ];

  const benefits = [
    {
      icon: Globe,
      title: "Remote-First Culture",
      description: "Work from anywhere in the world with flexible hours",
    },
    {
      icon: BookOpen,
      title: "Learning Budget",
      description: "Annual budget for courses, conferences, and certifications",
    },
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health coverage and wellness programs",
    },
    {
      icon: Users,
      title: "Collaborative Environment",
      description: "Work with diverse, skilled teams across the globe",
    },
  ];

  const applicationSteps = [
    {
      number: 1,
      title: "Application Review",
      description: "Submit your resume and cover letter for initial screening",
      duration: "1-2 days",
    },
    {
      number: 2,
      title: "Technical Assessment",
      description: "Complete role-specific tasks to showcase your skills",
      duration: "3-5 days",
    },
    {
      number: 3,
      title: "Team Interviews",
      description: "Meet with potential teammates and leadership",
      duration: "1 week",
    },
    {
      number: 4,
      title: "Final Decision",
      description: "Receive our decision and discuss next steps",
      duration: "2-3 days",
    },
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "Senior Data Scientist",
      quote:
        "Working here has given me the opportunity to make a real impact on global health while collaborating with brilliant minds.",
      avatar: "SC",
    },
    {
      name: "Marcus Thompson",
      role: "Full Stack Developer",
      quote:
        "The culture of innovation and continuous learning has helped me grow both professionally and personally.",
      avatar: "MT",
    },
    {
      name: "Dr. Lisa Kumar",
      role: "Epidemiologist",
      quote:
        "Being part of a team that's shaping the future of pandemic monitoring is incredibly rewarding.",
      avatar: "LK",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl mt-16">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 flex justify-center items-center">
        <Briefcase className="mr-4 text-blue-600" size={40} />
        Join Our Mission
      </h1>

      {/* Open Positions Section */}
      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <p className="text-gray-700 mb-6 text-center">
          Help us revolutionize pandemic monitoring and public health insights.
        </p>
        <div className="space-y-4">
          {openPositions.map((position, index) => (
            <div
              key={index}
              className="flex items-center bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <position.icon className="mr-4 text-blue-600" size={30} />
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {position.title}
                </h2>
                <p className="text-gray-600">
                  {position.department} Department
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits & Culture Section */}
      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
          <Award className="mr-3 text-blue-600" size={28} />
          Benefits & Culture
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <benefit.icon className="text-blue-600 mb-3" size={24} />
              <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Application Process Section */}
      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
          <Clock className="mr-3 text-blue-600" size={28} />
          Application Process
        </h2>
        <div className="space-y-4">
          {applicationSteps.map((step, index) => (
            <div key={index} className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                {step.number}
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="text-gray-600 mb-1">{step.description}</p>
                <p className="text-sm text-blue-600">
                  Duration: {step.duration}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Employee Testimonials Section */}
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
          <MessageCircle className="mr-3 text-blue-600" size={28} />
          Employee Testimonials
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  {testimonial.avatar}
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareersPage;
