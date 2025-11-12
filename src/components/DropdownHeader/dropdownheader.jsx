import React, { useState, useEffect, useRef } from "react";
import './dropdownheader.css';

const DropdownHeader = ({ trigger, children }) => {

    const [isOpen, setIsOpen] = useState(false);
    const node = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (node.current && !node.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside); //fecha o componente caso a pessoa clique fora 
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="dropdown" ref={node}>
            <div className="dropdown-trigger" onClick={() => setIsOpen(!isOpen)}>
                {trigger}
            </div>
            {isOpen && (
                <div className="dropdown-menu">
                    {children}
            </div>
            )}
        </div>
    );
};

export default DropdownHeader; 