import React from 'react';
import clsx from 'clsx'; // Ensure clsx is installed with `npm install clsx`

const Button = ({
    type = 'primary',         // Default button type
    content = 'Button',       // Default button text
    icon = null,              // Optional icon
    disabled = false,         // Disable button if true
    onClick = () => { },       // Default click handler
    className = '',           // Custom className for merging styles
    ...props                  // Additional props for extensibility
}) => {
    // Base classes for the button
    const baseClasses = 'rounded-md font-medium transition duration-200 ease-in-out px-4 py-2'; // Default padding included

    // Classes based on type and disabled state
    const typeClasses = {
        primary: 'bg-[#066882] text-white hover:bg-blue-500',
        secondary: 'bg-gray-600 text-white hover:bg-gray-500',
    };

    const disabledClasses = 'bg-gray-400 text-gray-600 cursor-not-allowed';

    // Dynamically merge classes while giving priority to `className`
    const buttonClasses = clsx(
        baseClasses, // Default styles
        type && !disabled && typeClasses[type], // Type-specific styles
        disabled && disabledClasses, // Disabled styles
        className // Append and override styles from parent
    );

    return (
        <button
            className={buttonClasses}
            disabled={disabled}
            onClick={!disabled ? onClick : undefined}
            {...props} // Pass additional props like aria-label, data attributes
        >
            {icon && <span className="mr-2">{icon}</span>} {/* Render icon if provided */}
            {content}
        </button>
    );
};

export default Button;
