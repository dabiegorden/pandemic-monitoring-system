import React from "react";
import {
  Users,
  Award,
  Building2,
  UserPlus,
  ArrowRight,
  Mail,
} from "lucide-react";

const TeamPage = () => {
  const teamMembers = [
    {
      name: "Dr. Emily Rodriguez",
      role: "Chief Epidemiologist",
      bio: "Leading expert in infectious disease tracking with 15 years of research experience.",
      image: "/api/placeholder/200/200",
    },
    {
      name: "Alex Chen",
      role: "Chief Technology Officer",
      bio: "Innovative tech leader specializing in real-time data systems and AI integration.",
      image: "/api/placeholder/200/200",
    },
    {
      name: "Dr. Marcus Williams",
      role: "Data Science Director",
      bio: "Renowned for developing advanced predictive models in pandemic analysis.",
      image: "/api/placeholder/200/200",
    },
  ];

  const advisoryBoard = [
    {
      name: "Prof. Sarah Johnson",
      role: "WHO Representative",
      credentials: "MPH, PhD in Global Health",
      image: "/api/placeholder/200/200",
    },
    {
      name: "Dr. Michael Chang",
      role: "Research Advisory Chair",
      credentials: "MD, Infectious Disease Specialist",
      image: "/api/placeholder/200/200",
    },
    {
      name: "Dr. Lisa Foster",
      role: "Ethics Committee Head",
      credentials: "PhD in Bioethics",
      image: "/api/placeholder/200/200",
    },
  ];

  const departments = [
    {
      name: "Data Analysis",
      members: 12,
      focus: "Statistical modeling and trend analysis",
      openings: 2,
    },
    {
      name: "Field Operations",
      members: 18,
      focus: "On-site data collection and verification",
      openings: 3,
    },
    {
      name: "Technology",
      members: 15,
      focus: "Platform development and maintenance",
      openings: 1,
    },
    {
      name: "Research",
      members: 20,
      focus: "Disease patterns and prediction models",
      openings: 2,
    },
  ];

  const openPositions = [
    {
      title: "Senior Epidemiologist",
      type: "Full-time",
      location: "Remote/Hybrid",
      department: "Research",
    },
    {
      title: "Data Scientist",
      type: "Full-time",
      location: "On-site",
      department: "Data Analysis",
    },
    {
      title: "Field Researcher",
      type: "Contract",
      location: "Various Locations",
      department: "Field Operations",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl mt-16">
      {/* Leadership Team Section */}
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 flex justify-center items-center">
        <Users className="mr-4 text-blue-600" size={40} />
        Our Dedicated Team
      </h1>
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            />
            <h2 className="text-xl font-semibold text-gray-800">
              {member.name}
            </h2>
            <p className="text-blue-600 mb-3">{member.role}</p>
            <p className="text-gray-600">{member.bio}</p>
          </div>
        ))}
      </div>

      {/* Advisory Board Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
          <Award className="mr-3 text-amber-600" size={32} />
          Advisory Board
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {advisoryBoard.map((advisor, index) => (
            <div
              key={index}
              className="bg-amber-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
            >
              <img
                src={advisor.image}
                alt={advisor.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-800">
                {advisor.name}
              </h3>
              <p className="text-amber-600 mb-2">{advisor.role}</p>
              <p className="text-gray-600 text-sm">{advisor.credentials}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Department Teams Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
          <Building2 className="mr-3 text-emerald-600" size={32} />
          Department Teams
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {departments.map((dept, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-semibold text-emerald-600 mb-2">
                {dept.name}
              </h3>
              <div className="flex justify-between mb-3">
                <span className="text-gray-600">
                  {dept.members} team members
                </span>
                <span className="text-emerald-600">
                  {dept.openings} openings
                </span>
              </div>
              <p className="text-gray-600">{dept.focus}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Join Our Team Section */}
      <div className="bg-blue-50 rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
          <UserPlus className="mr-3 text-blue-600" size={32} />
          Join Our Team
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-gray-700 mb-4">
              We're always looking for passionate individuals to join our
              mission in fighting global health challenges. Here are our current
              openings:
            </p>
            <div className="space-y-4">
              {openPositions.map((position, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-4 flex justify-between items-center hover:shadow-md transition-shadow"
                >
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {position.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {position.type} • {position.location}
                    </p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800">
                    <ArrowRight size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Don't see your role?
            </h3>
            <p className="text-gray-600 mb-6">
              Send us your resume and let us know how you can contribute to our
              mission.
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center justify-center w-full hover:bg-blue-700 transition-colors">
              <Mail className="mr-2" size={20} />
              Contact Recruitment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
