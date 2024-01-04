import React, { useState, useEffect } from 'react';
import Cabecera from './Cabecera';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import '../estilos/EditarInstitucion.css';

const EditarInstitucion = ({ user }) => {
  const { institucionId } = useParams();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [ruc, setruc] = useState('');

  useEffect(() => {
    const obtenerDatosInstitucion = async () => {
      const querydb = getFirestore();
      const docuRef = doc(querydb, 'instituciones', institucionId);
      const docSnapshot = await getDoc(docuRef);

      if (docSnapshot.exists()) {
        const beneficiarioData = docSnapshot.data();

        // Asignar valores iniciales a los estados
        setNombre(beneficiarioData.nombre || '');
        setTelefono(beneficiarioData.telefono || '');
        setruc(beneficiarioData.ruc || '');
      }
    };

    obtenerDatosInstitucion();
  }, [institucionId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const querydb = getFirestore();
    const docuRef = doc(querydb, 'instituciones', institucionId);

    const institucion = {
      nombre,
      telefono,
      ruc: ruc,
    };

    try {
      await updateDoc(docuRef, institucion);
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: '¡Institución editada con éxito!',
      });
      navigate(`/verInstitucion`);
    } catch (error) {
      console.error('Error al modificar beneficiario:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `¡Error al modificar beneficiario: ${error.message}!`,
      });
    }
  };

  return (
    <div>
      <Cabecera user={user} />
      <div className="centered-container">
        <h1>Editar Institución</h1>
      </div>

      <form id="form_einstitucion" onSubmit={handleSubmit}>
        <div id="txtNombre">
          <label htmlFor="nombre"><b>Nombre</b></label>
          <input
            type="text"
            id="l_einstitucion"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div id="txtcedula">
          <label htmlFor="cedula"><b>Teléfono</b></label>
          <input
            type="text"
            id="l_einstitucion"
            value={telefono}
            onChange={(e) => {
              // Permitir solo números y limitar la longitud a 10 dígitos
              const inputTelefono = e.target.value.replace(/\D/g, '').slice(0, 10);
              setTelefono(inputTelefono);
            }}
          />
        </div>

        <div id="txtf_nacimiento">
          <label htmlFor="f_nacimiento"><b>Ruc</b></label>
          <input
            type="text"
            id="l_einstitucion"
            value={ruc}
            onChange={(e) => setruc(e.target.value)}
          />
        </div>
        <div id='btneinstitucion'>
          <button id="buttonEInstitucion" type="submit">Cambiar Datos</button>
        </div>
      </form>
    </div>
  );
};

export default EditarInstitucion;
