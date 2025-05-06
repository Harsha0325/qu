import React, { useState, useEffect } from "react";

const CountdownTimer = ({ createdAt, expiryMinutes = 60 }) => {
  // Calculate remaining time until expiration (in milliseconds)
  const calculateRemainingTime = () => {
    const expirationTime =
      new Date(createdAt).getTime() + expiryMinutes * 60 * 1000;
    const now = new Date().getTime();
    const diff = expirationTime - now;
    return diff > 0 ? diff : 0;
  };

  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime(calculateRemainingTime());
    }, 1000);
    return () => clearInterval(interval);
  }, [createdAt, expiryMinutes]);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <span
      className={`font-semibold ${
        remainingTime === 0 ? "text-red-500" : "text-green-600"
      }`}
    >
      {remainingTime > 0 ? formatTime(remainingTime) : "Expired"}
    </span>
  );
};

export default CountdownTimer;
