import React, { useState } from 'react';
import '../estilos/ListaInstituciones.css';
import { Link } from 'react-router-dom';

import { getFirestore, doc, updateDoc } from "firebase/firestore";
import Swal from 'sweetalert2';


const ListaInstituciones = ({ instituciones }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInstituciones = instituciones.filter((institucion) =>
    institucion.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );
  function esActivo(institucion) {
    console.log(institucion.activo)
    return institucion.activo === true;
 }

 async function eliminarInstitucion(institucion) {
  Swal.fire({
    title:'Advertencia',
    text:`Está seguro que desea eliminar ${institucion.nombre}`,
    icon:'error',
    showDenyButton: true,
    denyButtonText: "No",
    confirmButtonText:"Si",
    confirmButtonColor: "#000000"
  }).then(async response=>{if(response.isConfirmed){
    const querydb = getFirestore();
    const docuRef = doc(querydb, 'instituciones', institucion.id);
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
      <h1>Lista de Instituciones</h1>

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
            <th>Teléfono</th>
            <th>Ubicación</th>
            <th>Servicios</th>
            <th>Fecha Inicio</th>
            <th>Fecha Final</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredInstituciones.filter(esActivo).map((institucion, index) => (
            <tr key={index}>
              
              <td>{institucion.nombre}</td>
              <td>{institucion.telefono}</td>
              <td>{institucion.direccion}</td>
              <td>
                {institucion.desayuno && 'Desayuno '}
                {institucion.almuerzo && 'Almuerzo'}
              </td>
              <td>{institucion.fecha_inicial}</td>
              <td>{institucion.fecha_final}</td>
              <td>
              <Link to={`/editar-institucion/${institucion.id}`}>
                  <button>Editar</button>
                </Link>

                
               <button onClick={() => eliminarInstitucion(institucion)}>Eliminar</button>
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaInstituciones;
