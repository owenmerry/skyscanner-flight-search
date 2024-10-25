import React, { useState, useEffect } from "react";
import { GoTrophy } from "react-icons/go";

type AchievementNotificationProps = {
  message: string;
};

const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  message,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Set a timer to hide the notification after 5 seconds
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000);

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return "";

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-slate-900 px-10 py-10 rounded-lg shadow-lg text-2xl z-50">
      <div className="font-extrabold text-center">
        <GoTrophy className="pr-2 inline-block text-blue-600 text-4xl" />
        <span>Achievement Unlocked!</span>
      </div>
      <div className="text-lg font-extrabold pt-4 text-center">{message}</div>
    </div>
  );
};

export default AchievementNotification;
