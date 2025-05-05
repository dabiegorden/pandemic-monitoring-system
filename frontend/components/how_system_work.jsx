import React from "react";

const System = () => {
  return (
    <div className="how-system-work-section rounded-md h-fit py-8 px-8">
      <div className="flex justify-center items-center flex-col gap-8 text-center text-white pt-16">
        {/* <Image src={} alt="" width={} height={} className=""/> */}
        <h1 className="text-3xl shadow-xl mb-4">How the system works.</h1>
        <p className="flex flex-col flex-wrap text-[1.08rem] tracking-wide leading-8 px-8">
          Our system integrates data from reliable, third-party health sources
          and applies machine learning models to analyze and predict future
          trends. Data is processed and visualized on a user-friendly interface,
          making it easy for users to see information like:
        </p>
        <p className="flex flex-col flex-wrap text-[1.08rem] tracking-wide leading-8 px-8">
          Case and mortality trends by continent, country, or city, Geographical
          spread of pandemics over time, Predicted impact and spread based on
          historical data and modeling. The Team Behind the Project This project
          was developed as a Final Year Project by a dedicated team of students
          passionate about technology's role in improving global health
          outcomes. We combine expertise in software development, data science,
          and public health awareness to create a system that not only informs
          but also empowers users to take meaningful actions in the face of
          health crises.
        </p>
      </div>
    </div>
  );
};

export default System;
