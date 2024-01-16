import React, { useState, useEffect } from 'react';
import '../estilos/ListaAsistencias.css';
import Cabecera from './Cabecera';
import { getFirestore, collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Button,
  Typography,
} from '@mui/material';

const ListaAsistencias = ({ user }) => {
  const { institucionId, convenioId } = useParams();
  const [fechas, setFechas] = useState([]);
  const [datos, setData] = useState([]);

  const [desayuno, setDesayuno] = useState(false);
  const [almuerzo, setAlmuerzo] = useState(false);

  const [fechasFiltradas, setFechasFiltradas] = useState([]);
  const [asistenciaDesayuno, setAsistenciaDesayuno] = useState([]);
  const [asistenciaAlmuerzo, setAsistenciaAlmuerzo] = useState([]);

  const [arregloNombresFechas, setArregloNombresFechas] = useState([]);
  const [filtroServicio, setFiltroServicio] = useState('todos');
  const [filtroFechaInicial, setFiltroFechaInicial] = useState(null);
  const [filtroFechaFinal, setFiltroFechaFinal] = useState(null);

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
    // Validar que ambas fechas estén seleccionadas
    if (!filtroFechaInicial || !filtroFechaFinal) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor, selecciona ambas fechas.',
      });
      return;
    }

    const querydb = getFirestore();
    const conveniosCollection = collection(querydb, 'convenios');
    try {
      // Obtener el documento de convenios con el ID específico (convenioId)
      const convenioDoc = await getDoc(doc(conveniosCollection, convenioId));
      // Obtener los datos del documento de convenios
      const convenioDias = convenioDoc.data().dias.map((fecha) => convertirTimestampAFecha(fecha));
      setDesayuno(convenioDoc.data().desayuno);
      setAlmuerzo(convenioDoc.data().almuerzo);
      setFechas(convenioDias);
    } catch (error) {
      console.error('Error al obtener el documento de convenios:', error);
    }

    //Datos Asistencias
    const beneficiariosCollection = collection(querydb, 'beneficiarios');
    const beneficiariosQuery = query(beneficiariosCollection, where('convenioId', '==', convenioId));
    try {
      const querySnapshot = await getDocs(beneficiariosQuery);
      const arregloBeneficiarios = querySnapshot.docs.map((benf) => ({
        nombre: benf.data().nombre || '',
        desayuno: benf.data().desayuno || [],
        almuerzo: benf.data().almuerzo || [],
      }));
      setData(arregloBeneficiarios);

    } catch (error) {
      console.error('Error al obtener documentos:', error);
    }
    const indices = indicesFechasFiltradas(filtroFechaInicial, filtroFechaFinal);
    setFechasFiltradas(filtrarFechas(filtroFechaInicial, filtroFechaFinal));
    setAsistenciaDesayuno(desayunoBeneficiario(datos, indices));
    setAsistenciaAlmuerzo(almuerzoBeneficiario(datos, indices));
    console.log("SEXOOOOO");
    console.log(asistenciaDesayuno);
    console.log(asistenciaAlmuerzo);
  };

  const indicesFechasFiltradas = (fechaInicial, fechaFinal) => {
    const fechasFiltradas = fechas.filter((fecha, index) => {
      return fecha >= convertirFecha(fechaInicial) && fecha <= convertirFecha(fechaFinal);
    });
    const indices = fechas.map((fecha, index) => {
      return fechasFiltradas.includes(fecha) ? index : null;
    }).filter(index => index !== null);
    return indices;
  };

  const filtrarFechas = (fechaInicial, fechaFinal) => {
    const fechasFiltradas = fechas.filter(fecha => {
      return fecha >= convertirFecha(fechaInicial) && fecha <= convertirFecha(fechaFinal);
    });
    return (fechasFiltradas);
  };

  const desayunoBeneficiario = (datos, indices) => {
    const desayuno = datos.map(dato => {
      const fechasFiltradas = dato.desayuno.slice(indices[0], indices[indices.length - 1] + 1);
      return {
        nombre: dato.nombre,
        asistencia_desayuno: fechasFiltradas
      };
    });
    return desayuno;
  };

  const almuerzoBeneficiario = (datos, indices) => {
    const almuerzo = datos.map(dato => {
      const fechasFiltradas = dato.almuerzo.slice(indices[0], indices[indices.length - 1] + 1);
      return {
        nombre: dato.nombre,
        asistencia_almuerzo: fechasFiltradas
      };
    });
    return almuerzo;
  };

  const renderTablaDesayuno = () => {
    return (
      <div>
        <Typography variant="h6" gutterBottom>
          Desayuno
        </Typography>
        <Paper style={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ backgroundColor: '#890202', color: 'white', margin: '5px', fontSize: '14px' }}>Nombre</TableCell>
                {fechasFiltradas.map((dia, index) => (
                  <TableCell style={{ backgroundColor: '#890202', color: 'white', margin: '5px', fontSize: '14px' }} key={index}>{dia}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {asistenciaDesayuno.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.nombre}</TableCell>
                  {item.asistencia_desayuno.map((dia, index) => (
                    <TableCell key={index}>{dia === 1 || dia === '1' ? 'A' : 'F'}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  };

  const renderTablaAlmuerzo = () => {
    return (
      <div>
        <Typography variant="h6" gutterBottom>
          Almuerzo
        </Typography>
        <Paper style={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ backgroundColor: '#890202', color: 'white', margin: '5px', fontSize: '14px' }}>Nombre</TableCell>
                {fechasFiltradas.map((dia, index) => (
                  <TableCell style={{ backgroundColor: '#890202', color: 'white', margin: '5px', fontSize: '14px' }} key={index}>{dia}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {asistenciaAlmuerzo.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.nombre}</TableCell>
                  {item.asistencia_almuerzo.map((dia, index) => (
                    <TableCell key={index}>{dia === 1 || dia === '1' ? 'A' : 'F'}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
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

  return (
    <div>
      <div className="centered-container">
        <Cabecera user={user} />
        <h1>Asistencias</h1>
      </div>
      <div className="filter-asistencia">
        {/* Filtro por Servicio */}
        <div className="filter-servicio">
          <label htmlFor="filtroServicio">Servicio: </label>
          <select id="filtroServicio" value={filtroServicio} onChange={handleFiltroServicioChange} className="custom-select">
            <option value="todos">Todos</option>
            <option value="desayuno">Desayuno</option>
            <option value="almuerzo">Almuerzo</option>
          </select>
        </div>

        {/* Filtro por Fecha Inicial */}
        <div className="filter-fecha-inicial">
          <label htmlFor="filtroFechaInicial">Fecha Inicial: </label>
          <DatePicker id="filtroFecha" selected={filtroFechaInicial} onChange={handleFiltroFechaInicialChange} dateFormat="dd/MM/yyyy" />
        </div>

        {/* Filtro por Fecha Final */}
        <div className="filter-fecha-final">
          <label htmlFor="filtroFechaFinal">Fecha Final: </label>
          <DatePicker id="filtroFecha" selected={filtroFechaFinal} onChange={handleFiltroFechaFinalChange} dateFormat="dd/MM/yyyy" />
        </div>

        <div id="btn_consultar">
          <button onClick={consulta}>Consultar</button>
        </div>
      </div>

      {filtroServicio === 'todos' && desayuno && renderTablaDesayuno()}
      {filtroServicio === 'todos' && almuerzo && renderTablaAlmuerzo()}

      {filtroServicio === 'desayuno' && desayuno && renderTablaDesayuno()}

      {filtroServicio === 'almuerzo' && almuerzo && renderTablaAlmuerzo()}

      <div className="centered-container">
        <div id='btnEAsistencia'>
          <Button variant="contained" onClick={exportarExcel} style={{ backgroundColor: '#890202', color: 'white', margin: '5px', fontSize: '14px' }}>
            Exportar Tabla
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ListaAsistencias;
