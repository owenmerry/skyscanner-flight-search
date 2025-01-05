import React, { useState } from "react";

export const Message = ({title, description, hasDismiss = true} : {title: string, description: string, hasDismiss?: boolean}) => {
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
            {title}
          </h2>
          <p className="font-light text-gray-400 sm:text-xl">
            {description}
          </p>
        </div>
        {hasDismiss && (
          <button
            onClick={handleClose}
            className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-500 focus:outline-none"
          >
            Dismiss
          </button>
        )}
      </div>
    </section>
  );
};