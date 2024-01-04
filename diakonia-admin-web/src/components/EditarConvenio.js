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

  useEffect(() => {
    const obtenerDatosBeneficiario = async () => {
      const querydb = getFirestore();
      const docuRef = doc(querydb, 'convenios', convenioId);
      const docSnapshot = await getDoc(docuRef);

      if (docSnapshot.exists()) {
        const convenioData = docSnapshot.data();

        setNombre(convenioData.nombre || '');
        setDireccion(convenioData.direccion || '');
      }
    };

    obtenerDatosBeneficiario();
  }, [convenioId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const querydb = getFirestore();
    const docuRef = doc(querydb, 'convenios', convenioId);

    const convenio = {
      nombre,
      direccion,
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

        <button id="buttonBRegistrar" type="submit">Cambiar Datos</button>
      </form>
    </div>
  );
};

export default EditarConvenio;
