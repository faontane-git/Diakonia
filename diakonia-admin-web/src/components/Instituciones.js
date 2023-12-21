import React from 'react'
import Cabecera from "./Cabecera";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import '../estilos/Instituciones.css';

const Instituciones = ({user}) => {
  const navigate = useNavigate();


  const goRegistrar = () => {
    navigate('/registrar');
  }
  const goVerRegistro = () => {
    navigate('/verInstitucion')
  };

  return (
    <div className="centered-container">
      <Cabecera user={user} />
      <h1>Instituciones</h1>
      <button id="buttonRegistrar" onClick={goRegistrar}>Registrar</button>
      <button id="buttonVerInstituciones" onClick={goVerRegistro}>Ver Instituciones</button>
    </div>
  );
};

export default Instituciones;