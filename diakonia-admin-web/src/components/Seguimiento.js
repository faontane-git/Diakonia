import React from 'react'
import Cabecera from "./Cabecera";
import { useNavigate } from 'react-router-dom';
import '../estilos/Seguimiento.css';

const Seguimiento = () => {
  const navigate = useNavigate();


  const goAsistencias = () => {

    navigate('/asistencias');
  }
  const goNutrición = () => {
    navigate('/nutricion')
  };

  return (
    <div className="centered-container">
      <Cabecera />
      <h1>Seguimiento</h1>
      <button id="buttonAsistencias" onClick={goAsistencias}>Asistencias</button>
      <button id="buttonNutricion" onClick={goNutrición}>Nutrición</button>
    </div>
  );
};

export default Seguimiento;