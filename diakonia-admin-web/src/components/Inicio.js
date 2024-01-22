import React from "react";
import { Link } from "react-router-dom";
import Cabecera from "./Cabecera";
import { useAuthContext } from './AuthContext.js';
import Gallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import '../estilos/Inicio.css';

import Imagen1 from '../imagenes/inicio.png';
import Imagen2 from '../imagenes/inicio2.png';
import Imagen3 from '../imagenes/inicio3.png';

function Inicio({ user }) {
  const { login, logout } = useAuthContext();

  // Configuración de la galería de imágenes
  const images = [
    {
      original: Imagen1,
      thumbnail: Imagen1,
      description: "Slide 1",
    },
    {
      original: Imagen2,
      thumbnail: Imagen2,
      description: "Slide 2",
    },
    {
      original: Imagen3,
      thumbnail: Imagen3,
      description: "Slide 3",
    },
  ];

  // Configuración adicional para la reproducción automática y deshabilitar el zoom
  const galleryOptions = {
    autoPlay: true,
    slideInterval: 3000, // Intervalo en milisegundos entre diapositivas
    disableZoom: true,  // Deshabilitar el ampliador de pantalla
  };

  return (
    <div className="centered-container">
      <Cabecera />
      <h1>Sistema de Gestión y Análisis de Impacto en Beneficiarios de Alimentos</h1>

      <div className='centered-image-container'>
        <Gallery items={images} {...galleryOptions} />
      </div>
    </div>
  );
}

export default Inicio;
