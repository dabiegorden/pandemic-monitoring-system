import React from "react";
import { fetchStats } from "@/lib/fetchStats";
import CovidChart from "./CovidChart"; // Adjust the path as needed

const ServerCard = async () => {
  let data = [];
  try {
    data = await fetchStats();
  } catch (error) {
    console.error("Error fetching covid stats:", error);
  }

  return <CovidChart data={data} />;
};

export default ServerCard;
