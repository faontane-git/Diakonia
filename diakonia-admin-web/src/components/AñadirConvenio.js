import React from 'react';
import Cabecera from "./Cabecera";
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import '../estilos/Registrar.css';
import Swal from 'sweetalert2';
import firebaseApp from "../firebase-config";
import { getFirestore, collection, setDoc, addDoc } from "firebase/firestore";

const AñadirConvenio = ({user}) => {
  const { institucionId, institucionN} = useParams();
  const navigate = useNavigate();

  const goBack = () => {
    navigate(`/instituciones/${institucionId}/${institucionN}`);
  }

  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [desayuno, setDesayuno] = useState(false);
  const [almuerzo, setAlmuerzo] = useState(false);

  const [initialDate, setInitialDate] = useState(null);
  const [finalDate, setFinalDate] = useState(null);

  // Función para manejar el envío del formulario
  const handleSubmit = (event) => {
    event.preventDefault();
    const initialDateObject = new Date(initialDate);
    const finalDateObject = new Date(finalDate);
    if (initialDate === null || finalDate === null || initialDateObject > finalDateObject) {
        Swal.fire({
            title: 'Error',
            text: '¡La fecha inicial debe ser anterior a la fecha final!',
            icon: 'error',
          });
      return;
    } else if (desayuno === false && almuerzo === false) {
        Swal.fire({
            title: 'Error',
            text: '¡Seleccione al menos un tipo de servicio!',
            icon: 'error',
          });
      return;
    } else if (nombre === '' || direccion === '') {
        Swal.fire({
            title: 'Error',
            text: '¡Por favor llene todos los campos!',
            icon: 'error',
          });
      return;
    }
     else {
      const firestore = getFirestore()
      const ConvenioCollection = collection(firestore, 'convenios');

      const convenio = {
        nombre: nombre, 
        direccion: direccion,
        desayuno: desayuno,
        almuerzo: almuerzo,
        fecha_inicial: initialDateObject,
        fecha_final: finalDateObject,
        institucionId: institucionId,
        activo: true,
      }

      const agregar = addDoc(ConvenioCollection, convenio);

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
      <Cabecera/>
      <h1>Registrar Convenio de {institucionN}</h1>
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

        <div id="txtDireccion">
          <label htmlFor="direccion"><b>Dirección:</b></label>
          <input
            type="text"
            id="direccion"
            value={direccion}
            onChange={(e) => {
                setDireccion(e.target.value);;
            }}
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
            <label htmlFor="Fecha_inicial"><b>Fecha inicial:</b></label>
            <input
              type="date"
              name="initialDate"
              placeholder="Fecha inicial"
              id="ff_inicial"
              onChange={(e) => setInitialDate(e.target.value)}
            />
            <label htmlFor="Fecha_final"><b>Fecha final:</b></label>
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

export default AñadirConvenio;
