import React from 'react'
import Cabecera from "./Cabecera";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import '../estilos/Instituciones.css';

const Instituciones = () => {
  const navigate = useNavigate();
 

  const goRegistrar = () => {
    
      navigate('/registrar');
    }
    const goVerRegistro = () =>{
        navigate('/verInstitucion')
    };

  return (
    <div>
      <Cabecera/>
      <h1>Instituciones</h1>
      <button onClick={goRegistrar}>Registrar</button>
      <button onClick={goVerRegistro}>Ver Instituciones</button>
    </div>
  );
};

export default Instituciones;