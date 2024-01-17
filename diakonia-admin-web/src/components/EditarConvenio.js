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
  const [fechaFin, setFechaFin] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [pdfBase64, setPdfBase64] = useState(null);

  useEffect(() => {
    const obtenerDatosConvenio = async () => {
      const querydb = getFirestore();
      const docuRef = doc(querydb, 'convenios', convenioId);
      const docSnapshot = await getDoc(docuRef);

      if (docSnapshot.exists()) {
        const convenioData = docSnapshot.data();

        setNombre(convenioData.nombre || '');
        setDireccion(convenioData.direccion || '');

        // Si fecha_final existe en los datos, asignarla al estado
        if (convenioData.fecha_final) {
          const fechaFinal = new Date(convenioData.fecha_final.seconds * 1000);
          // Restar un día para compensar cualquier problema con la zona horaria
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const querydb = getFirestore();
    const docuRef = doc(querydb, 'convenios', convenioId);

    const fechaFinal = new Date(fechaFin); // Convertir la cadena de fecha a un objeto Date

    // Agregar un día a la fecha
    fechaFinal.setDate(fechaFinal.getDate() + 1);

    // Obtener la fecha de inicio del convenio
    const docSnapshot = await getDoc(docuRef);
    const fechaInicioConvenio = docSnapshot.data().fecha_inicial.toDate();

    // Verificar que la fecha de fin sea mayor que la fecha de inicio
    if (fechaFinal <= fechaInicioConvenio) {
      // Mostrar notificación de error
      Swal.fire('Error', 'La fecha de fin debe ser mayor que la fecha de inicio', 'error');
      return;
    }

    const convenio = {
      nombre,
      direccion,
      fecha_final: fechaFinal,
      pdfBase64: pdfBase64, // Agrega el contenido base64 del archivo PDF
    };

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
      <Cabecera user={user} />
      <div className="centered-container">
        <h1>Editar Convenio</h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div id='volver'>
          <Button variant="contained" style={{ marginLeft: '60%', backgroundColor: '#890202', color: 'white' }} onClick={goBack}>
            Volver
          </Button>
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