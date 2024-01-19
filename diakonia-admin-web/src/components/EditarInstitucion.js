import React, { useState, useEffect } from 'react';
import Cabecera from './Cabecera';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc, addDoc, collection } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { Button } from '@mui/material';
import '../estilos/EditarInstitucion.css';
import { useAuthContext } from './AuthContext'; // Ruta real a tu AuthContext

const EditarInstitucion = ({  }) => {
  const { institucionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();


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

  const goBack = () => {
    navigate('/verInstitucion');
  };

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

      // Guardar información en el histórico
      const historicoDatos = {
        usuario: user.nombre,  // Reemplaza con el nombre del usuario real
        correo: user.email,  // Reemplaza con el nombre del usuario real
        accion: 'Institución Editada: ' + institucion.nombre,  // Mensaje personalizado
        fecha: new Date().toLocaleDateString(),
        hora: new Date().toLocaleTimeString(),  // Hora actual
      };
      const firestore = getFirestore();
      const hitoricoCollection = collection(firestore, 'historico');
      addDoc(hitoricoCollection, historicoDatos);

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
      <div className="centered-container">
        <Cabecera />
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div id='volver'>
          <Button variant="contained" style={{ marginLeft: '60%', backgroundColor: '#890202', color: 'white' }} onClick={goBack}>
            Volver
          </Button>
        </div>

        <div id='titulo' style={{ marginLeft: '30.5em' }}>
          <h1>Editar Institución</h1>
        </div>
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
