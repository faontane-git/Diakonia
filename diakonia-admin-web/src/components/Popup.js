import React from 'react';
import '../estilos/Popup.css';

const Popup = ({ titulo, contenido, onClose, onConfirm }) => {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>{titulo}</h2>
        <p>{contenido}</p>
        <button onClick={onClose}>Cancelar</button>
        <button onClick={onConfirm}>Confirmar</button>
      </div>
    </div>
  );
};

export default Popup;
