import React from 'react'
import Cabecera from "./Cabecera";
import { useNavigate } from 'react-router-dom';
import '../estilos/Usuarios.css';

const Usuarios = () => {
  const navigate = useNavigate();


  const goRegistrar = () => {

    navigate('/registrarUsuario');
  }
  const goVerRegistro = () => {
    navigate('/verUsuarios')
  };

  return (
    <div className="centered-container">
      <Cabecera />
      <h1>Usuarios</h1>
      <button id="buttonRUsuarios" onClick={goRegistrar}>Registrar</button>
      <button id="buttonUsuarios" onClick={goVerRegistro}>Ver Usuarios</button>
    </div>
  )
}

export default Usuarios