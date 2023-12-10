import React from 'react';
import Logo  from '../imagenes/logo-banco-alimentos.png'
import Img1  from '../imagenes/foto1.png'
import Img2  from '../imagenes/foto2.png'
import { Link } from 'react-router-dom';

import '../estilos/login.css';
import Inicio from './Inicio';

class Login extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="half left">
            <div className='centered-image-container'>
                <img src={Logo} alt="Logo" className="centered-image"/>
            </div>

            <div className='centered-image-container'>
                <img src={Img1} alt="Img1" className="centered-image2"/>
            </div>

            <div className='centered-image-container'>
                <img src={Img2} alt="Img2" className="centered-image2"/>
            </div>
        </div>

        <div className="half right">
            <h1 className="title"> Sistema de Gestión y Análisis de Impacto en Beneficiarios de Alimentos</h1>

            <div className="white-box">
                <p className="title-2">Inicie Sesión</p>
                <div className='formulario'>
                    <input type="text" placeholder="Correo" className="text-input" />
                    <input type="password" placeholder="Contraseña" className="text-input" />  
                    
                    <Link to="/Inicio" className="submit-button">
                        Ingresar
                    </Link>
                    
                    <p className="recovery-button">He olvidado mi contraseña</p>
                </div>
            </div>
        
        
        </div>
      </div>
    );
  }
}

export default Login;
