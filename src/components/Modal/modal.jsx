import React from 'react';
import './Modal.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Componente Modal
const Modal = ({ isOpen, onClose, children }) => {

  //se o modal não abrir, ele não renderiza
  if (!isOpen) {
    return null;
  }

  return (

    //aciona o Onclose
    <div 
    className="modal-overlay" 
    onClick={onClose} 
    role="dialog" 
    aria-modal="true">

      {/*evita que o clique dentro do modal feche ele */}
      <div 
      className="modal-content" 
      onClick={(e) => e.stopPropagation()}>

        {/* botão fechar */}
        <button className="modal-close-button" onClick={onClose} aria-label='Fechar modal'>
          <i 
          className="bi bi-x-lg" 
          aria-hidden="true"></i>
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;