import React, { useState, useEffect } from 'react';
import Cabecera from './Cabecera';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc, getDocs, collection, query, where } from 'firebase/firestore';
import '../estilos/EditarUsuarios.css';
import Swal from 'sweetalert2';

const EditarInstitucion = ({ user }) => {
  const { usuarioId } = useParams();
  const navigate = useNavigate();

  const [nombre, setNombre]= useState('')
  const [rol, setRol] = useState('Administrador');
  const [institucionId, setInstitucionId] = useState('DiakoníaWeb');
  const [institucionN, setInstitucionN] = useState('DiakoníaWeb');
  const [correo, setCorreo] = useState('');
  const [mostrarBarraAdicional, setMostrarBarraAdicional] = useState(false);
  const [roloriginal, setRoloriginal] = useState('');
  //const [institucionIdoriginal, setInstitucionIdoriginal]= useState('');
  const [institucionNoriginal, setInstitucionNoriginal] = useState('');

  const [convenios, setConvenios] = useState('')
  const [convenioN, setConvenioN] = useState('DiakoníaWeb')
  const [convenioId, setConvenioId] = useState('DiakoníaWeb')

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
        console.log(beneficiarioData);
        // Asignar valores iniciales a los estados
        setNombre(beneficiarioData.nombre || '')
        setCorreo(beneficiarioData.correo || '');
        setRoloriginal(beneficiarioData.rol || '');
        //setInstitucionId(beneficiarioData.institucionId || '');
        //setInstitucionN(beneficiarioData.institucionN || '');
        setInstitucionNoriginal(beneficiarioData.institucionN || '');
      }
    };

    obtenerDatosInstitucion();
  }, [usuarioId]);

  async function ActualizarUsuario(rol, institucionId, institucionN, convenioId, convenioN, nombre) {
    const querydb = getFirestore();
    const docuRef = doc(querydb, 'usuarios', usuarioId);

    const usuario = {
      nombre,
      rol,
      institucionId,
      institucionN,
      convenioId,
      convenioN
    };

    try {
      await updateDoc(docuRef, usuario);
      console.log('Datos enviados:', usuario);
      navigate(`/usuarios/verUsuarios`);
    } catch (error) {
      console.error('Error al modificar beneficiario:', error);
      alert(error.message);
    }

  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('institucion:', institucionN)
    if(rol=== "Registrador"){
      console.log("entra")
      if(institucionId==="DiakoníaWeb"){
        Swal.fire('Error', 'Institución no seleccionado', 'error');
        return
      }
      else if(convenioId=== ""){
        Swal.fire('Error', 'Convenio no seleccionado', 'error');
        return
      }
    }
    ActualizarUsuario(rol, institucionId, institucionN,convenioId,convenioN,nombre);
  };

  useEffect(() => {
    console.log(institucionId)
    if (institucionId) {
      console.log("entra")
      const querydb = getFirestore();
      const conveniosCollection = collection(querydb, 'convenios');
      const conveniosQuery = query(conveniosCollection,where('institucionId', '==', institucionId));

      getDocs(conveniosQuery).then((res) =>{
          if(res!== undefined){
            console.log("cambio")
            setConvenios(res.docs.map((convenio) => ({ id: convenio.id, ...convenio.data() })))
          }
      }  
      );
      
    }
  }, [institucionId]);


  return (
    <div>
      <div className="centered-container">
        <Cabecera user={user} />
        <h1>Editar Usuario</h1>
      </div>

      <form id="form_eusuario" onSubmit={handleSubmit}>
        <label>Correo: {correo} </label>
        <label>Rol: {roloriginal} </label>
        <label>Instinción: {institucionNoriginal} </label>
        <br></br>
        <div id="txtUemail">
          <label htmlFor="email">Nombre Completo</label>
          <input
            type="nombre"
            id="email_usuario"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div id="txtUrol">
          <label htmlFor="rol">Nuevo Rol</label>
          <select id="rol" onChange={(e) => {
            setRol(e.target.value);
            setMostrarBarraAdicional(e.target.value === "Registrador");
            if (e.target.value !== "Registrador") {
              setInstitucionId("DiakoníaWeb");
              setInstitucionN("DiakoníaWeb");
              setConvenioId("DiakoníaWeb");
              setConvenioN("DiakoníaWeb");
            }
          }}>
            <option value="Administrador">Administrador</option>
            <option value="Editor">Editor</option>
            <option value="Registrador">Registrador</option>
          </select>
        </div>

        {mostrarBarraAdicional && (
          <>
          <div id="txtUrol">
            <label htmlFor="rol">Institución a la que pertenece:</label>
            <select id="rol" onChange={(e) => {
              setInstitucionId(e.target.value);
              const selectedInstitucion = data.find((institucion) => institucion.id === e.target.value);
              setInstitucionN(selectedInstitucion?.nombre); // Use optional chaining for safety
              setConvenioId("");
              setConvenioN("");
            }}>
              <option value="" disabled selected>Selecciona una institucion</option>
              {data.map((institucion) => (
                <option value={institucion.id}>{institucion.nombre}</option>
              ))}
            </select>
          </div>


        {convenioId !== "DiakoníaWeb" && (<div id="txtConvenios">
          <label htmlFor="convenios">Convenio</label>
          <select id="convenios" value={convenioN} onChange={(e) => {
            const valores = e.target.value.split("/");
            console.log(valores);
            setConvenioId(valores[0]);         
            setConvenioN(valores[1]);
            console.log("convenio", convenioId, convenioN)
            }}>
            <option value="" disabled selected>Selecciona un convenio</option>
            {convenios.map((convenio) => (
              <option key={convenio.id} value={convenio.id+"/"+convenio.nombre}>{convenio.nombre}</option>
            ))}
          </select>
        </div>)}
          
          </>
        )}

        <button id="buttonIRegistrar" type="submit">Cambiar Datos</button>
      </form>
    </div>
  );
};

export default EditarInstitucion;
