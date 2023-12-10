import React from "react";
import { Link } from "react-router-dom";
import Cabecera from "./Cabecera";
import '../estilos/Inicio.css';

function Inicio() {
  return (
    <div>
      <Cabecera/>
      <h1>Esta es la página de inicio</h1>
    </div>
  );
}

export default Inicio;