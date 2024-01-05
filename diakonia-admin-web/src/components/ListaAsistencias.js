import React, { useState, useEffect } from 'react';
import '../estilos/ListaAsistencias.css';
import Cabecera from './Cabecera';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as XLSX from 'xlsx';

const ListaAsistencias = ({ user }) => {
  const { institucionId } = useParams();
  const [data, setData] = useState([]);
  const [arregloNombresFechas, setArregloNombresFechas] = useState([]);
  const [filtroServicio, setFiltroServicio] = useState('todos');
  const [filtroFechaInicial, setFiltroFechaInicial] = useState(null);
  const [filtroFechaFinal, setFiltroFechaFinal] = useState(null);
  const [datosFiltrados, setDatosFiltrados] = useState([]);

  const handleFiltroServicioChange = (e) => {
    setFiltroServicio(e.target.value);
  };

  const handleFiltroFechaInicialChange = (date) => {
    setFiltroFechaInicial(date);
  };

  const handleFiltroFechaFinalChange = (date) => {
    setFiltroFechaFinal(date);
  };

  const convertirTimestampAFecha = (timestamp) => {
    const fecha = new Date(timestamp.seconds * 1000);
    return fecha.toLocaleDateString('es-ES');
  };

  const convertirFecha = (fecha) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', options);
  };

  const consulta = async () => {
    const querydb = getFirestore();
    const beneficiariosCollection = collection(querydb, 'beneficiarios');
    const beneficiariosQuery = query(beneficiariosCollection, where('institucionId', '==', institucionId));

    try {
      const querySnapshot = await getDocs(beneficiariosQuery);
      const datos = querySnapshot.docs.map((benf) => ({
        nombre: benf.data().nombre || '',
        desayuno: benf.data().desayuno || [],
        almuerzo: benf.data().almuerzo || [],
        dias: benf.data().dias || [],
      }));

      // Filtrar por rango de fechas
      const datosFiltradosPorFechas = datos.filter(filtrarPorServicioYFechas);
      console.log(datosFiltradosPorFechas);

      setData(datosFiltradosPorFechas);
      setArregloNombresFechas(datosFiltradosPorFechas);
    } catch (error) {
      console.error('Error al obtener documentos:', error);
    }
  };



  const filtrarPorServicioYFechas = (item) => {
    // Filtra por fechas
    if (filtroFechaInicial && filtroFechaFinal) {
      const fechaInicialFormateada = convertirFecha(filtroFechaInicial);
      const fechaFinalFormateada = convertirFecha(filtroFechaFinal);
      return item.dias.some(dia => {
        const fechaDia = convertirTimestampAFecha(dia);
        return fechaDia >= fechaInicialFormateada && fechaDia <= fechaFinalFormateada;
      });
    }

    return true; // Si no hay fechas seleccionadas, retorna true para todos los elementos
  };

  const exportarExcel = () => {
    const ws = XLSX.utils.json_to_sheet([
      // Primera fila con los nombres de las columnas
      { Nombre: 'Nombre', ...arregloNombresFechas[0].dias.reduce((acc, dia, index) => ({ ...acc, [convertirTimestampAFecha(dia)]: '' }), {}) },
      // Filas de datos
      ...arregloNombresFechas.map((item) => ({
        Nombre: item.nombre,
        ...item.dias.reduce((acc, dia, index) => ({ ...acc, [convertirTimestampAFecha(dia)]: dia ? 'A' : '0' }), {}),
      })),
    ]);

    // Elimina la segunda fila con números
    delete ws['A2'];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Asistencias');
    XLSX.writeFile(wb, 'asistencias.xlsx');
  };

  const exportarAsistenciasCompleto = () => {
    // Verifica si hay datos para exportar
    if (arregloNombresFechas.length === 0) {
      alert('No hay datos para exportar.');
      return;
    }

    const ws = XLSX.utils.json_to_sheet([
      // Primera fila con los nombres de las columnas
      { Nombre: 'Nombre', ...arregloNombresFechas[0].dias.reduce((acc, dia, index) => ({ ...acc, [convertirTimestampAFecha(dia)]: '' }), {}) },
      // Filas de datos
      ...arregloNombresFechas.map((item) => ({
        Nombre: item.nombre,
        ...item.dias.reduce((acc, dia, index) => ({ ...acc, [convertirTimestampAFecha(dia)]: dia ? 'A' : '0' }), {}),
      })),
    ]);

    // Elimina la segunda fila con números
    delete ws['A2'];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Asistencias');
    XLSX.writeFile(wb, 'asistencias_completo.xlsx');
  };

  return (
    <div>
      <Cabecera user={user} />
      <div className="centered-container">
        <h1>Asistencias</h1>
      </div>
      <div className="filter-asistencia">
        {/* Filtro por Servicio */}
        <div className="filter-servicio">
          <label htmlFor="filtroServicio">Servicio: </label>
          <select id="filtroServicio" value={filtroServicio} onChange={handleFiltroServicioChange} className="custom-select">
            <option value="">Todos</option>
            <option value="desayuno">Desayuno</option>
            <option value="almuerzo">Almuerzo</option>
          </select>
        </div>

        {/* Filtro por Fecha Inicial */}
        <div className="filter-fecha-inicial">
          <label htmlFor="filtroFechaInicial">Fecha Inicial: </label>
          <DatePicker
            id="filtroFecha"
            selected={filtroFechaInicial}
            onChange={handleFiltroFechaInicialChange}
            dateFormat="dd/MM/yyyy"
          />
        </div>

        {/* Filtro por Fecha Final */}
        <div className="filter-fecha-final">
          <label htmlFor="filtroFechaFinal">Fecha Final: </label>
          <DatePicker
            id="filtroFecha"
            selected={filtroFechaFinal}
            onChange={handleFiltroFechaFinalChange}
            dateFormat="dd/MM/yyyy"
          />
        </div>

        <div id="btn_consultar">
          <button onClick={consulta}>Consultar</button>
        </div>

      </div>

      {/* Mostrar la tabla si hay datos */}
      {arregloNombresFechas.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              {arregloNombresFechas[0].dias.map((dia, index) => (
                <th key={index}>{convertirTimestampAFecha(dia)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {arregloNombresFechas.map((item, index) => (
              <tr key={index}>
                <td>{item.nombre}</td>
                {item.desayuno.map((dia, index) => (
                  <td key={index}>{dia === 1 || dia === '1' ? 'A' : 'F'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="centered-container" >
        <div id='btnEAsistencia'>
          <button onClick={exportarExcel}>Exportar Tabla</button>
        </div>
        <div id="btn_consultar">
          <button onClick={exportarAsistenciasCompleto}>Exportar Asistencias</button>
        </div>
      </div>

    </div>
  );
};

export default ListaAsistencias;
