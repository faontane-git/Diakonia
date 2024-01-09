import React from "react";
import { Link } from "react-router-dom";
import Cabecera from "./Cabecera";
import Imagen from '../imagenes/inicio.png'
import Imagen2 from '../imagenes/inicio2.png'
import Imagen3 from '../imagenes/inicio3.png'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../estilos/Inicio.css';

import { useAuthContext } from './AuthContext.js';

function Inicio({ user }) {
  const { login, logout } = useAuthContext();

  // Configuración del carrusel
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="centered-container">
      <Cabecera />
      <h1>Sistema de Gestión y Análisis de Impacto en Beneficiarios de Alimentos</h1>

      <div className='centered-image-container'>
        <Slider {...settings}>
          <img src={Imagen} alt="Slide 1" className="centered-image" />
          <img src={Imagen2} alt="Slide 2" className="centered-image" />
          <img src={Imagen3} alt="Slide 3" className="centered-image" />
        </Slider>
      </div>


    </div>
  );
}

export default Inicio;