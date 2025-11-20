import React from 'react';
import './Modal.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Componente genérico de Modal
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    // O fundo escuro (overlay)
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      {/* O conteúdo do modal (impede o fecho ao clicar dentro) */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose} aria-label='Fechar modal'>
          <i className="bi bi-x-lg" aria-hidden="true"></i>
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;