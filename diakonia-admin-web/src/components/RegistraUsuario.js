import React from 'react'
import Cabecera from "./Cabecera";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../estilos/RegistraUsuario.css';

const RegistroUsuario = () => {

  const [nombre, setNombre] = useState('');
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');


  // Función para manejar el envío del formulario
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Datos enviados:', { nombre, usuario, contraseña });
  };

  return (
    <div className="centered-container">
      <Cabecera />

      <h1>Registrar Institución</h1>
      <form onSubmit={handleSubmit}>

      <div id="txtUNombre">
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>


        <div id="txtUUsuario">
          <label htmlFor="usuario">Usuario:</label>
          <input
            type="text"
            id="usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
        </div>


        <div id="txtUContaseña">
          <label htmlFor="contraseña">Contraseña:</label>
          <input
            type="text"
            id="contraseña"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
          />
        </div>





        <button id="buttonIRegistrar"type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default RegistroUsuario;
