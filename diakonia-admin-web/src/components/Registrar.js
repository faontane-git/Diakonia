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
  const [direccion, setDireccion] = useState('');
  const [desayuno, setDesayuno] = useState(false);
  const [almuerzo, setAlmuerzo] = useState(false);

  const [initialDate, setInitialDate] = useState(null);
  const [finalDate, setFinalDate] = useState(null);

  // Función para manejar el envío del formulario
  const handleSubmit = (event) => {
    event.preventDefault();
    if (nombre === '' || telefono === '' || direccion === '') {
      Swal.fire({
        title: 'Error',
        text: '¡Por favor llene todos los campos!',
        icon: 'error',
      });
      return;
    }
    else if (desayuno === false && almuerzo === false) {
      Swal.fire({
        title: 'Error',
        text: '¡Por favor elija el tipo de servicio de la institución (al menos 1)!',
        icon: 'error',
      });
      return;
    }
    else if (initialDate === null || finalDate === null || initialDate > finalDate) {
      Swal.fire({
        title: 'Error',
        text: '¡La fecha inicial debe ser anterior a la fecha final!',
        icon: 'error',
      });
      return;
    } else {
      const firestore = getFirestore()
      const InstitucionCollection = collection(firestore, 'instituciones');

      const institucion = {
        nombre: nombre,
        telefono: telefono,
        direccion: direccion,
        desayuno: desayuno,
        almuerzo: almuerzo,
        fecha_inicial: initialDate,
        fecha_final: finalDate,
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

      console.log(initialDate, finalDate);
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
          <label htmlFor="direccion"><b>Dirección:</b></label>
          <input
            type="text"
            id="direccion"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
        </div>

        <div id="txtServicios">
          <label><b>Servicios:</b></label>
          <div id="opcionesServicios">
            <input
              type="checkbox"
              id="desayuno"
              checked={desayuno}
              onChange={() => setDesayuno(!desayuno)}
            />
            <label htmlFor="desayuno">Desayuno</label>

            <div>
              <input
                type="checkbox"
                id="almuerzo"
                checked={almuerzo}
                onChange={() => setAlmuerzo(!almuerzo)}
              />
              <label htmlFor="almuerzo">Almuerzo</label>
            </div>
          </div>
          <div id="rangoFechas">
            <label htmlFor="Fecha_inicial"><b>Fecha_inicial:</b></label>
            <input
              type="date"
              name="initialDate"
              placeholder="Fecha inicial"
              id="ff_inicial"
              onChange={(e) => setInitialDate(e.target.value)}
            />
            <label htmlFor="Fecha_final"><b>Fecha_final:</b></label>
            <input
              type="date"
              name="finalDate"
              placeholder="Fecha final"
              id="ff_final"
              onChange={(e) => setFinalDate(e.target.value)}
            />
          </div>
        </div>

        <button id="buttonFRegistrar" type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default RegistroInstitucion;
