import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Cabecera from './Cabecera';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import '../estilos/EditarConvenio.css';

const EditarConvenio = ({ user }) => {
  const { institucionId, institucionN, convenioId } = useParams();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [fechaFin, setFechaFin] = useState('');

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
          setFechaFin(
            fechaFinal.toISOString().slice(0, 10)
          );
        }
      }
    };

    obtenerDatosConvenio();
  }, [convenioId]);

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

        <button id="buttonBRegistrar" type="submit">Cambiar Datos</button>
      </form>
    </div>
  );
};

export default EditarConvenio;
