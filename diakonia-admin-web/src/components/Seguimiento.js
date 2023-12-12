import React from 'react'
import Cabecera from "./Cabecera";
import { useNavigate } from 'react-router-dom';

const Seguimiento = () => {
  const navigate = useNavigate();
 

  const goAsistencias = () => {
    
      navigate('/asistencias');
    }
    const goNutrición = () =>{
        navigate('/nutricion')
    };

  return (
    <div>
      <Cabecera/>
      <h1>Seguimiento</h1>
      <button onClick={goAsistencias}>Asistencias</button>
      <button onClick={goNutrición}>Nutrición</button>
    </div>
  );
};

export default Seguimiento;