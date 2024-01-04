import React from 'react';
import Cabecera from "./Cabecera";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Swal from 'sweetalert2';
import '../estilos/Registrar.css';

import firebaseApp from "../firebase-config";
import { getFirestore, collection, setDoc, addDoc } from "firebase/firestore";

const RegistroInstitucion = ({ user }) => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate('/instituciones');
  }

  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [ruc, setRuc] = useState('');
  const [direccion, setDireccion] = useState('');
  const [desayuno, setDesayuno] = useState(false);
  const [almuerzo, setAlmuerzo] = useState(false);

  const [initialDate, setInitialDate] = useState(null);
  const [finalDate, setFinalDate] = useState(null);

  // Función para manejar el envío del formulario
  const handleSubmit = (event) => {
    event.preventDefault();
    if (nombre === '' || telefono === '' || ruc === '') {
      Swal.fire({
        title: 'Error',
        text: '¡Por favor llene todos los campos!',
        icon: 'error',
      });
      return;
    } 
    else if (ruc.length < 13) {
      Swal.fire({
        title: 'Error',
        text: '¡El ruc debe tener 13 digitos!',
        icon: 'error',
      });
    }
     else {
      const firestore = getFirestore()
      const InstitucionCollection = collection(firestore, 'instituciones');

      const institucion = {
        nombre: nombre,
        telefono: telefono,
        ruc: ruc,
       
        activo: true,
      }

      const agregar = addDoc(InstitucionCollection, institucion);

      agregar
        .then((funciono) => {
          Swal.fire({
            title: 'Éxito',
            text: '¡Nueva institución añadida!',
            icon: 'success',
          });
          goBack();
        }).catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          Swal.fire({
            title: 'Error',
            text: '¡Error al agregar institución!',
            icon: 'error',
          });
        })

     
    }
  };

  return (
    <div className="centered-container">
      <Cabecera user={user} />
      <h1>Registrar Institución</h1>
      <form onSubmit={handleSubmit}>

        <div id="txtNombre">
          <label htmlFor="nombre"><b>Nombre:</b></label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div id="txtTelefono">
          <label htmlFor="telefono"><b>Teléfono:</b></label>
          <input
            type="text"
            id="telefono"
            value={telefono}
            onChange={(e) => {
              // Permitir solo números y limitar la longitud a 10 dígitos
              const inputTelefono = e.target.value.replace(/\D/g, '').slice(0, 10);
              setTelefono(inputTelefono);
            }}
          />
        </div>

        <div id="txtDireccion">
          <label htmlFor="direccion"><b>Ruc:</b></label>
          <input
            type="text"
            id="ruc"
            value={ruc}
            onChange={(e) => {
              // Permitir solo números y limitar la longitud a 10 dígitos
              const inputRuc = e.target.value.replace(/\D/g, '').slice(0, 13);
              setRuc(inputRuc);
            }}
          />
        </div>

       
        <button id="buttonFRegistrar" type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default RegistroInstitucion;
