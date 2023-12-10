import React from 'react'
import Cabecera from "./Cabecera";
import { useNavigate } from 'react-router-dom';

const Usuarios = () => {
  const navigate = useNavigate();
 

  const goRegistrar = () => {
    
      navigate('/registrarUsuario');
    }
    const goVerRegistro = () =>{
        navigate('/verUsuarios')
    };

  return (
    <div>
        <Cabecera/>
        <h1>Usuarios</h1>
        <button onClick={goRegistrar}>Registrar</button>
      <button onClick={goVerRegistro}>Ver Usuarios</button>
    </div>
  )
}

export default Usuarios