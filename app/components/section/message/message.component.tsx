import React, { useState } from "react";

export const Message = ({title, description} : {title: string, description: string}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null; // Don't render anything if the message is hidden
  }

  return (
    <section className="bg-white dark:bg-gray-900 mb-2">
      <div className="gap-16 justify-between items-center p-6 text-white bg-gray-900 rounded-lg dark:bg-gray-800 md:p-12">
        <div className="w-full">
          <h2 className="mb-4 text-3xl tracking-tight font-extrabold sm:text-4xl">
            We’ve Updated Your Search!
          </h2>
          <p className="font-light text-gray-400 sm:text-xl">
            It looks like the date you selected has passed. We’ve updated your search to show flights starting from next week. If you'd like to search for another date, feel free to adjust the calendar above!
          </p>
        </div>
        <button
          onClick={handleClose}
          className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-500 focus:outline-none"
        >
          Dismiss
        </button>
      </div>
    </section>
  );
};