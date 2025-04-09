import React, { useState, useRef, useEffect } from "react";

export const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      {React.Children.map(children, (child) => {
      if (child.type === DropdownTrigger) {
        return React.cloneElement(child, {
          onClick: () => setIsOpen(!isOpen),
        });
      }
    
      if (child.type === DropdownContent) {
        return isOpen ? child : null;
      }
    
      return child;
    })}
    </div>
    
  );
};

export const DropdownTrigger = ({ children, onClick }) => (
  <button onClick={onClick} className="focus:outline-none">
    {children}
  </button>
);

export const DropdownContent = ({ children }) => (
  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10">
    <div className="py-1">
      {children}
    </div>
  </div>
);

export const DropdownItem = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
  >
    {children}
  </button>
);