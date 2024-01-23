import React, { useState } from 'react';
import Cabecera from "./Cabecera";
import { useNavigate, useParams } from 'react-router-dom';
import { getFirestore, doc, updateDoc, query, collection, where, getDocs, setDoc, getDoc, addDoc } from 'firebase/firestore';
import { getDatabase, ref, set } from "firebase/database";
import firebaseApp from "../firebase-config";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import '../estilos/AñadirConvenio.css';
import { Button } from '@mui/material';
import { useAuthContext } from './AuthContext'; // Ruta real a tu AuthContext


const AñadirConvenio = () => {
  const { institucionId, institucionN } = useParams();
  const today = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const goBack = () => {
    navigate(`/instituciones/${institucionId}/${institucionN}`);
  }

  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [desayuno, setDesayuno] = useState(false);
  const [almuerzo, setAlmuerzo] = useState(false);
  const [initialDate, setInitialDate] = useState(null);
  const [finalDate, setFinalDate] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [pdfBase64, setPdfBase64] = useState(null);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowString = tomorrow.toISOString().split("T")[0];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    console.log("Tipo de Archivo:", selectedFile.type);

    if (selectedFile && selectedFile.type === "application/pdf") {
      setArchivo(selectedFile);

      const reader = new FileReader();

      reader.onload = (e) => {
        const base64String = e.target.result.split(",")[1]; // Extraer datos base64
        console.log("Base64 String:", base64String);
        setPdfBase64(base64String);
      };

      reader.onerror = (error) => {
        console.error('Error al leer el archivo:', error);
        // Trata el error según tus necesidades
      };

      reader.readAsDataURL(selectedFile);
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, seleccione un archivo PDF.',
        icon: 'error',
      });

      // Limpiar la entrada de archivo
      e.target.value = null;
      setArchivo(null);
      setPdfBase64(null);
    }
  };

  const generateDateRange = (startDate, endDate) => {
    const dateArray = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const initialDateObject = new Date(initialDate + 'T00:00:00');
    const finalDateObject = new Date(finalDate + 'T00:00:00');

    if (nombre === '' || direccion === '') {
      Swal.fire({
        title: 'Error',
        text: '¡Por favor llene todos los campos!',
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
    } else if (initialDate === null || finalDate === null || initialDateObject > finalDateObject) {
      Swal.fire({
        title: 'Error',
        text: '¡La fecha inicial debe ser anterior a la fecha final!',
        icon: 'error',
      });
      return;
    } else if (!pdfBase64) {
      // Si no se ha subido el archivo PDF
      Swal.fire({
        title: 'Error',
        text: '¡Por favor, suba un archivo PDF!',
        icon: 'error',
      });
      return;
    } else {
      const firestore = getFirestore()
      const ConvenioCollection = collection(firestore, 'convenios');
      const dateRange = generateDateRange(initialDateObject, finalDateObject);

      const convenio = {
        nombre: nombre,
        direccion: direccion,
        desayuno: desayuno,
        almuerzo: almuerzo,
        fecha_inicial: initialDateObject,
        fecha_final: finalDateObject,
        institucionId: institucionId,
        dias: dateRange,
        activo: true,
        pdfBase64: pdfBase64, // Save the base64-encoded PDF data
      }

      const agregar = addDoc(ConvenioCollection, convenio);

      agregar
        .then(() => {
          Swal.fire({
            title: 'Éxito',
            text: '¡Nuevo convenio añadido!',
            icon: 'success',
          });
          // Guardar información en el histórico
          const historicoDatos = {
            usuario: user.nombre,  // Reemplaza con el nombre del usuario real
            correo: user.email,  // Reemplaza con el nombre del usuario real
            accion: 'Convenio Creado: ' + nombre + " Institución: " + institucionN,  // Mensaje personalizado
            fecha: new Date().toLocaleDateString(),
            hora: new Date().toLocaleTimeString(),  // Hora actual
          };
          const firestore = getFirestore();
          const hitoricoCollection = collection(firestore, 'historico');
          addDoc(hitoricoCollection, historicoDatos);
          goBack();
        }).catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          Swal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error',
          });
        });
    }
  };

  return (
    <div>
      <div className="centered-container">
        <Cabecera />
        <div style={{ textAlign: 'left', marginLeft: '30px', marginTop: '10px' }}>
          <Button variant="contained" style={{ backgroundColor: '#890202', color: 'white' }} onClick={goBack}>
            Volver
          </Button>
        </div>
        <h1>Registrar Convenio</h1>

        <h3>{institucionN}</h3>
      </div>

      <form id="form_eañadirconvenio" onSubmit={handleSubmit}>
        <div id="linea">
          <div id="txtNombreConvenio">
            <label htmlFor="nombre"><b>Nombre</b></label>
            <input
              type="text"
              id="l_añadirConvenio"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div id="txtDireccionConvenio">
            <label htmlFor="direccion"><b>Dirección</b></label>
            <input
              type="text"
              id="l_añadirConvenio"
              value={direccion}
              onChange={(e) => {
                setDireccion(e.target.value);
              }}
            />
          </div>
        </div>

        <div id="txtServicios">
          <label><b>Servicios:</b></label>
          <div id="opcionesServicios">
            <input
              type="checkbox"
              id=""
              checked={desayuno}
              onChange={() => setDesayuno(!desayuno)}
            />
            <label id="acc" htmlFor="desayuno">Desayuno</label>

            <input
              type="checkbox"
              id=""
              checked={almuerzo}
              onChange={() => setAlmuerzo(!almuerzo)}
            />
            <label htmlFor="almuerzo">Almuerzo</label>
          </div>
        </div>

        <div id="linea2">
          <div id="rangoFechasInicial">
            <label htmlFor="Fecha_inicial"><b>Fecha Inicial</b></label>
            <input
              type="date"
              name="initialDate"
              placeholder="Fecha inicial"
              id="l_añadirConvenio"
              onChange={(e) => setInitialDate(e.target.value)}
              min={tomorrowString}
            />
          </div>

          <div id="rangoFechasFinal">
            <label htmlFor="Fecha_final"><b>Fecha Final</b></label>
            <input
              type="date"
              name="finalDate"
              placeholder="Fecha final"
              id="l_añadirConvenio"
              onChange={(e) => setFinalDate(e.target.value)}
              min={initialDate}
            />
          </div>
        </div>

        <div id="inputArchivo">
          <label htmlFor="archivo"><b>Certificado</b></label>
          <input
            type="file"
            id="archivo"
            accept=".pdf"  // Specify the accepted file types
            onChange={(e) => handleFileChange(e)}
          />
        </div>

        <div id='btnaconvenio'>
          <button id="buttonAConvenio" type="submit">Registrar</button>
        </div>
      </form>
    </div>
  );
};

export default AñadirConvenio;
