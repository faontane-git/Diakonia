import React, { useState, useEffect } from 'react';
import Cabecera from './Cabecera';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import '../estilos/EditarBeneficiario.css';

const EditarConvenio = ({user}) => {
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

        // Asignar valores iniciales a los estados
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
      console.log('Datos enviados:', convenio);
      navigate(`/instituciones/${institucionId}/${institucionN}`);
    } catch (error) {
      console.error('Error al modificar convenio:', error);
      alert(error.message);
    }
  };

  return (
    <div className="centered-container">
      <Cabecera user={user}/>
      <h1>Editar Convenio</h1>

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
          <label htmlFor="cedula"><b>Dirección:</b></label>
          <input
            type="text"
            id="cedula"
            value={direccion}
            onChange={(e) => {
              // Permitir solo números y limitar la longitud a 10 dígitos
         
              setDireccion(e.target.value);
            }}
          />
        </div>


        <button id="buttonBRegistrar" type="submit">Cambiar Datos</button>
      </form>
    </div>
  );
};

export default EditarConvenio;
