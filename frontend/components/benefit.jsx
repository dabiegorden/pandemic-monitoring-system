import React from "react";
import { Carousel } from "antd";

const contentStyle = {
  height: "300px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#fff",
};
const Benefit = () => (
  <main className="carousel">
    <h1 className="text-2xl text-[#222] my-8">
      Who can Benefit <span className="text-orange-600">from this system?</span>
    </h1>
    <Carousel autoplay autoplaySpeed={5000}>
      <div style={contentStyle}>
        <h1 className="text-xl text-[#222] mb-4">
          Public Health Officials
          <span className="text-orange-500 font-bold text-xl">.</span>
        </h1>
        <p className="text-[#222] tracking-wide leading-8 mb-4">
          Access to a centralized pandemic data source allows for faster
          response times, resource allocation, and strategic planning.
        </p>
      </div>
      <div style={contentStyle}>
        <h1 className="text-xl text-[#222] mb-4">
          Healthcare Professionals
          <span className="text-orange-500 font-bold text-xl">.</span>
        </h1>
        <p className="text-[#222] tracking-wide leading-8 mb-4">
          Health workers can better prepare for outbreaks and align resources to
          protect themselves and their patients.
        </p>
      </div>
      <div style={contentStyle}>
        <h1 className="text-xl text-[#222] mb-4">
          Businesses and Organizations
          <span className="text-orange-500 font-bold text-xl">.</span>
        </h1>
        <p className="text-[#222] tracking-wide leading-8 mb-4">
          Corporate and non-profit organizations can use the system to stay
          informed and ensure the safety of employees and stakeholders.
        </p>
      </div>
      <div style={contentStyle}>
        <h1 className="text-xl text-[#222] mb-4">
          Individuals
          <span className="text-orange-500 font-bold text-xl">.</span>
        </h1>
        <p className="text-[#222] tracking-wide leading-8 mb-4">
          From parents to travelers, everyone can benefit from having accurate
          pandemic information to make safe, informed decisions.
        </p>
      </div>
    </Carousel>
  </main>
);
export default Benefit;
