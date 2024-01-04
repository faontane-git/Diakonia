import React, { useState, useEffect } from 'react';
import { Await, useParams } from 'react-router-dom';
import Cabecera from './Cabecera';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../estilos/ListaBeneficiarios.css';
import { getFirestore, collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';

const Convenios = () => {
    const { institucionId, institucionN } = useParams();
    const navigate = useNavigate();
    const goAñadirBenef = () => {
      navigate('añadirConvenio');
    };

    const convertirTimestampAFecha = (timestamp) => {
        const fecha = new Date(timestamp.seconds * 1000);
        return fecha.toLocaleDateString('es-ES');
      };
  
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
  
    useEffect(() => {
      const querydb = getFirestore();
      const conveniosCollection = collection(querydb, 'convenios');
      const conveniosQuery = query(conveniosCollection, where('institucionId', '==', institucionId));
  
      getDocs(conveniosQuery).then((res) =>
        setData(res.docs.map((benf) => ({ id: benf.id, ...benf.data() })))
      );
    }, [institucionId]);
  
    const filteredData = data.filter((convenio) =>
      convenio.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    function esActivo(convenio) {
      console.log(convenio.activo)
      return convenio.activo === true;
   }
  
   async function eliminarConvenio(convenio) {
    Swal.fire({
      title:'Advertencia',
      text:`Está seguro que desea eliminar ${convenio.nombre}`,
      icon:'error',
      showDenyButton: true,
      denyButtonText: "No",
      confirmButtonText:"Si",
      confirmButtonColor: "#000000"
    }).then(async response=>{if(response.isConfirmed){
      const querydb = getFirestore();
      const docuRef = doc(querydb, 'convenios', convenio.id);
      try {
        await updateDoc(docuRef, {activo:false});
        window.location.reload()
      } catch (error) {
        console.error('Error al eliminar institución:', error);
        alert(error.message);
      }
    }})
  };
  
    return (
      <div className="centered-container">
        <Cabecera />
        <h1>Lista de convenios de {institucionN}</h1>
        <button id="buttonABeneficiarios" onClick={goAñadirBenef}>
          Añadir Convenio
        </button>
  
        <div className="search-container-name">
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
  
        <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Servicios</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.filter(esActivo).map((convenio) => (
            <tr key={convenio.id}>
              <td>{convenio.nombre}</td>
              <td>{convenio.direccion}</td>
              <td> {convenio.desayuno && 'Desayuno '}
                {convenio.almuerzo && 'Almuerzo'}</td>
              <td>{convertirTimestampAFecha(convenio.fecha_inicial)}</td>
              <td>{convertirTimestampAFecha(convenio.fecha_final)}</td>
              <td>
                <Link to={`/editar-convenio/${institucionId}/${institucionN}/${convenio.id}`}>
                  <button>Editar</button>
                </Link>
                
                <button onClick={() => eliminarConvenio(convenio)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    );
  };
  

export default Convenios;





/*<thead>
          <tr>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Servicios</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.filter(esActivo).map((convenio) => (
            <tr key={convenio.id}>
              <td>{convenio.nombre}</td>
              <td>{convenio.direccion}</td>
              <td> {convenio.desayuno && 'Desayuno '}
                {convenio.almuerzo && 'Almuerzo'}</td>
              <td>{convenio.fecha_inicial}</td>
              <td>{convenio.fecha_final}</td>
              <td>
                <Link to={`/editar-convenio/${institucionId}/${institucionN}/${convenio.id}`}>
                  <button>Editar</button>
                </Link>
                
                <button onClick={() => eliminarConvenio(convenio)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>*/