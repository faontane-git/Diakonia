import React, { useState, useEffect } from 'react';
import Cabecera from './Cabecera';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import '../estilos/EditarBeneficiario.css';

const EditarInstitucion = ({user}) => {
  const { institucionId } = useParams();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [ubicacion, setUbicacion] = useState('');

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
        setUbicacion(beneficiarioData.direccion || '');
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
      direccion: ubicacion,
    };

    try {
      await updateDoc(docuRef, institucion);
      console.log('Datos enviados:', institucion);
      navigate(`/verInstitucion`);
    } catch (error) {
      console.error('Error al modificar beneficiario:', error);
      alert(error.message);
    }
  };

  return (
    <div className="centered-container">
      <Cabecera user={user}/>
      <h1>Editar Institución</h1>

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

        <div id="txtcedula">
          <label htmlFor="cedula"><b>telefono:</b></label>
          <input
            type="text"
            id="cedula"
            value={telefono}
            onChange={(e) => {
              // Permitir solo números y limitar la longitud a 10 dígitos
              const inputTelefono = e.target.value.replace(/\D/g, '').slice(0, 10);
              setTelefono(inputTelefono);
            }}
          />
        </div>

        <div id="txtf_nacimiento">
          <label htmlFor="f_nacimiento"><b>Ubicación:</b></label>
          <input
            type="text"
            id="f_nacimiento"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
          />
        </div>
        <button id="buttonBRegistrar" type="submit">Cambiar Datos</button>
      </form>
    </div>
  );
};

export default EditarInstitucion;
