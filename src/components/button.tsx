import React from "react";

interface IButtonProps {
  canClick: boolean;
  loading: boolean;
  actionText: string;
}

const Button: React.FC<IButtonProps> = ({ canClick, loading, actionText }) => {
  return (
    <button
      className={`text-lg focus:outline-none font-medium text-white py-5 ${
        canClick
          ? "bg-lime-600 hover:bg-lime-700  transition-colors"
          : "bg-gray-400 pointer-events-none"
      }`}
    >
      {loading ? "Loading..." : actionText}
    </button>
  );
};

export default Button;
