import React, { useState, useEffect } from 'react';
import Cabecera from './Cabecera';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc, getDocs, collection } from 'firebase/firestore';
import '../estilos/EditarBeneficiario.css';

const EditarInstitucion = () => {
  const { usuarioId } = useParams();
  const navigate = useNavigate();

  const [rol, setRol] = useState('');
  const [institucionId, setInstitucionId] = useState('');
  const [institucionN, setInstitucionN] = useState('');
  const [mostrarBarraAdicional, setMostrarBarraAdicional] = useState(false);
  const [roloriginal, setRoloriginal]= useState('');
  //const [institucionIdoriginal, setInstitucionIdoriginal]= useState('');
  const [institucionNoriginal, setInstitucionNoriginal]= useState('');

  const [data, setData] = useState([]);

  useEffect(() => {
    const querydb = getFirestore();
    const queryCollection = collection(querydb, 'instituciones');

    getDocs(queryCollection).then((res) =>
      setData(res.docs.map((institucion) => ({ id: institucion.id, ...institucion.data() })))
    );
  }, []);
  
  useEffect(() => {
    const obtenerDatosInstitucion = async () => {
      const querydb = getFirestore();
      const docuRef = doc(querydb, 'usuarios', usuarioId);
      const docSnapshot = await getDoc(docuRef);

      if (docSnapshot.exists()) {
        const beneficiarioData = docSnapshot.data();

        // Asignar valores iniciales a los estados
        setRoloriginal(beneficiarioData.rol || '');
        setInstitucionId(beneficiarioData.institucionId || '');
        setInstitucionNoriginal(beneficiarioData.institucionN || '');
      }
    };

    obtenerDatosInstitucion();
  }, [usuarioId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const querydb = getFirestore();
    const docuRef = doc(querydb, 'usuarios', usuarioId);
    
    if(mostrarBarraAdicional === false){setInstitucionId("DiakoníaWeb");
    setInstitucionN("DiakoníaWeb");
    }

    const usuario = {
      rol,
      institucionId,
      institucionN,
    };

    try {
      await updateDoc(docuRef, usuario);
      console.log('Datos enviados:', usuario);
      navigate(`/verUsuarios`);
    } catch (error) {
      console.error('Error al modificar beneficiario:', error);
      alert(error.message);
    }
  };

  return (
    <div className="centered-container">
      <Cabecera />
      <h1>Editar Usuario</h1>
        <h2>Datos originales:</h2>
        <label>Rol: {roloriginal} </label>
        <label>Instinción: {institucionNoriginal} </label>
      <form onSubmit={handleSubmit}>
      <div id="txtUrol">           
          <label htmlFor="rol">Rol:</label>
          <select id="rol" onChange={(e) => {setRol(e.target.value);
          setMostrarBarraAdicional(e.target.value === "Registrador");
          console.log(mostrarBarraAdicional)}}>
            <option value="Admin">Administrador</option>
            <option value="Editor">Editor</option>
            <option value="Registrador">Registrador</option>
          </select>
        </div>

        {mostrarBarraAdicional && (
  <div id="txtUrol">
    <label htmlFor="rol">Instinción a la que pertenece:</label>
    <select id="rol" onChange={(e) => {
    setInstitucionId(e.target.value);
    const selectedInstitucion = data.find((institucion) => institucion.id === e.target.value);
    setInstitucionN(selectedInstitucion?.nombre); // Use optional chaining for safety
  }}>
    <option value="" disabled selected>Selecciona una institucion</option>
      {data.map((institucion) => (
        <option value={institucion.id}>{institucion.nombre}</option>
      ))}
    </select>
  </div>
)}

        <button id="buttonBRegistrar" type="submit">Cambiar Datos</button>
      </form>
    </div>
  );
};

export default EditarInstitucion;
