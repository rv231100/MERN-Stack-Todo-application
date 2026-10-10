import React from "react";

const StatCard = ({ title, value, icon, type, loading }) => {
  return (
    <div className={`stat-card ${type}`}>
      <div className="stat-card-top">
        <span>{title}</span>
        <div className="stat-icon">{icon}</div>
      </div>
      <div className="stat-value">{loading ? "..." : value}</div>
    </div>
  );
};

export default StatCard;
