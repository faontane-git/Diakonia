import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Cabecera from './Cabecera';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import '../estilos/EditarConvenio.css';
import { Button } from '@mui/material';

const EditarConvenio = ({ user }) => {
  const { institucionId, institucionN, convenioId } = useParams();
  const navigate = useNavigate();

  const goBack = () => {
    navigate(`/instituciones/${institucionId}/${institucionN}`);
  };

  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [pdfBase64, setPdfBase64] = useState(null);
  const [nuevoArchivo, setNuevoArchivo] = useState(false);
  const fechaActual = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    const obtenerDatosConvenio = async () => {
      const querydb = getFirestore();
      const docuRef = doc(querydb, 'convenios', convenioId);
      const docSnapshot = await getDoc(docuRef);

      if (docSnapshot.exists()) {
        const convenioData = docSnapshot.data();

        setNombre(convenioData.nombre || '');
        setDireccion(convenioData.direccion || '');

        if (convenioData.fecha_inicial) {
          const fechaInicio = new Date(convenioData.fecha_inicial.seconds * 1000);
          setFechaInicio(fechaInicio.toISOString().slice(0, 10));
        }

        if (convenioData.fecha_final) {
          const fechaFinal = new Date(convenioData.fecha_final.seconds * 1000);
          fechaFinal.setDate(fechaFinal.getDate() - 1);
          setFechaFin(fechaFinal.toISOString().slice(0, 10));
        }
      }
    };

    obtenerDatosConvenio();
  }, [convenioId]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    console.log("Tipo de Archivo:", selectedFile.type);

    if (selectedFile && selectedFile.type === "application/pdf") {
      setArchivo(selectedFile);
      setNuevoArchivo(true);

      const reader = new FileReader();

      reader.onload = (e) => {
        const base64String = e.target.result.split(",")[1];
        console.log("Base64 String:", base64String);
        setPdfBase64(base64String);
      };

      reader.onerror = (error) => {
        console.error('Error al leer el archivo:', error);
      };

      reader.readAsDataURL(selectedFile);
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, seleccione un archivo PDF.',
        icon: 'error',
      });

      e.target.value = null;
      setArchivo(null);
      setPdfBase64(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const querydb = getFirestore();
    const docuRef = doc(querydb, 'convenios', convenioId);

    const fechaInicioObj = new Date(fechaInicio);
    const fechaFinal = new Date(fechaFin);
    fechaFinal.setDate(fechaFinal.getDate() + 1);

    const docSnapshot = await getDoc(docuRef);
    const fechaInicioConvenio = docSnapshot.data().fecha_inicial.toDate();

    if (fechaFinal <= fechaInicioConvenio) {
      Swal.fire('Error', 'La fecha de fin debe ser mayor que la fecha de inicio', 'error');
      return;
    }

    const convenio = {
      nombre,
      direccion,
      fecha_inicial: fechaInicioObj,
      fecha_final: fechaFinal,
    };

    if (nuevoArchivo) {
      convenio.pdfBase64 = pdfBase64;
    }

    try {
      await updateDoc(docuRef, convenio);
      Swal.fire('¡Éxito!', 'Convenio editado con éxito', 'success');
      navigate(`/instituciones/${institucionId}/${institucionN}`);
    } catch (error) {
      console.error('Error al modificar convenio:', error);
      Swal.fire('¡Error!', `Error al modificar convenio: ${error.message}`, 'error');
    }
  };

  return (
    <div>
      <div className="centered-container">
        <Cabecera user={user} />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div id='volver'>
            <Button variant="contained" style={{ marginLeft: '60%', backgroundColor: '#890202', color: 'white' }} onClick={goBack}>
              Volver
            </Button>
          </div>

          <div id='titulo' style={{ marginLeft: '29.5em' }}>
            <h1>Editar Convenio</h1>
          </div>
        </div>
      </div>

      <form id="form_econvenio" onSubmit={handleSubmit}>
        <div id="txtNombre">
          <label htmlFor="nombre"><b>Nombre</b></label>
          <input
            type="text"
            id="l_eConvenio"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div id="txtcedula">
          <label htmlFor="cedula"><b>Dirección</b></label>
          <input
            type="text"
            id="l_eConvenio"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
        </div>

        <div id="txtFechaInicio">
          <label htmlFor="fechaInicio"><b>Fecha de Inicio</b></label>
          <input
            type="date"
            id="l_eConvenio"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            disabled={fechaInicio <= fechaActual} // Deshabilitar si fecha de inicio es mayor o igual a la fecha actual
            min={fechaActual}
          />
        </div>

        <div id="txtFechaFin">
          <label htmlFor="fechaFin"><b>Fecha de Fin</b></label>
          <input
            type="date"
            id="l_eConvenio"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>

        <div id="txtArchivo">
          <label htmlFor="archivo"><b>Subir Archivo</b></label>
          <input
            type="file"
            id="l_eConvenio"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
          />
        </div>

        <button id="buttonBRegistrar" type="submit">Cambiar Datos</button>
      </form>
    </div>
  );
};

export default EditarConvenio;
