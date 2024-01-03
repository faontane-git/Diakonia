import React, { useState, useEffect } from 'react';
import '../estilos/ListaAsistencias.css';
import Cabecera from './Cabecera';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

const ListaAsistencias = ({ user }) => {
  const { institucionId } = useParams();
  const [data, setData] = useState([]);
  const [arregloNombresFechas, setArregloNombresFechas] = useState([]);
  const [filtroServicio, setFiltroServicio] = useState('todos');
  const [datosFiltrados, setDatosFiltrados] = useState([]);

  const handleFiltroServicioChange = (e) => {
    setFiltroServicio(e.target.value);
  };

  const convertirTimestampAFecha = (timestamp) => {
    const fecha = new Date(timestamp.seconds * 1000);
    return fecha.toLocaleDateString('es-ES');
  };

  const consulta = async () => {
    const querydb = getFirestore();
    const beneficiariosCollection = collection(querydb, 'beneficiarios');
    const beneficiariosQuery = query(beneficiariosCollection, where('institucionId', '==', institucionId));

    try {
      const querySnapshot = await getDocs(beneficiariosQuery);
      setData(querySnapshot.docs.map((benf) => ({ id: benf.id, ...benf.data() })));
      console.log(data);
    } catch (error) {
      console.error('Error al obtener documentos:', error);
    }
  };

  useEffect(() => {
    // Filtrar los datos según el servicio seleccionado
    setDatosFiltrados(arregloNombresFechas.filter(filtrarPorServicio));
  }, [arregloNombresFechas, filtroServicio]);

  const filtrarPorServicio = (item) => {
    if (filtroServicio === 'todos') {
      return true;
    } else if (filtroServicio === 'desayuno') {
      return item.desayuno.length > 0;
    } else if (filtroServicio === 'almuerzo') {
      return item.almuerzo.length > 0;
    }
    return true;
  };

  return (
    <div className="centered-container">
      <Cabecera user={user} />
      <h1>Asistencias</h1>
      <div className="filter-asistencia">
        {/* Filtro por Servicio */}
        <div className="filter-servicio">
          <label htmlFor="filtroServicio">Filtrar por Servicio: </label>
          <select id="filtroServicio" value={filtroServicio} onChange={handleFiltroServicioChange} className="custom-select">
            <option value="desayuno">Desayuno</option>
            <option value="almuerzo">Almuerzo</option>
          </select>
        </div>

        {/* Filtro por Mes */}
        <div className="filter-mes">
          <label htmlFor="filtroMes">Filtrar por Mes: </label>
          <select id="filtroMes" className="custom-select">
            <option value="01">Enero</option>
            <option value="02">Febrero</option>
            <option value="03">Marzo</option>
            <option value="04">Abril</option>
            <option value="05">Mayo</option>
            <option value="06">Junio</option>
            <option value="07">Julio</option>
            <option value="08">Agosto</option>
            <option value="09">Septiembre</option>
            <option value="10">Octubre</option>
            <option value="11">Noviembre</option>
            <option value="12">Diciembre</option>
          </select>
        </div>

        {/* Filtro por Año */}
        <div className="filter-anio">
          <label htmlFor="filtroAnio">Filtrar por Año: </label>
          <select id="filtroAnio" className="custom-select">
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>
        </div>
      </div>

      <div>
        <button onClick={consulta}>Consultar</button>
      </div>

    </div>
  );
};

export default ListaAsistencias;
