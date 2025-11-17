import React, { useState, useEffect, useRef } from "react";
import './dropdownheader.css';

const DropdownHeader = ({ trigger, children }) => {

    // Controla se o dropdown está aberto ou fechado
    const [isOpen, setIsOpen] = useState(false);

    // Referência ao elemento principal do dropdown
    const node = useRef();

    useEffect(() => {

         // Função que fecha o dropdown se clicar fora dele
        const handleClickOutside = (e) => {

             // Verifica se o clique NÃO foi dentro do componente
            if (node.current && !node.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        // Adiciona listener para detectar clique fora
        document.addEventListener('mousedown', handleClickOutside);

        // Remove o listener quando o componente desmonta
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
         // Elemento principal do dropdown com a ref
        <div className="dropdown" ref={node}>
            <div className="dropdown-trigger" onClick={() => setIsOpen(!isOpen)}>
                {trigger}
            </div>

            {/* Renderiza o menu somente quando "isOpen" é true */}
            {isOpen && (
                <div className="dropdown-menu">
                    {children}
            </div>
            )}
        </div>
    );
};

export default DropdownHeader; 