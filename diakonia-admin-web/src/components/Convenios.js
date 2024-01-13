import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getFirestore, collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  InputAdornment,
  IconButton,
  TextField,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import Cabecera from './Cabecera';
import '../estilos/ListaBeneficiarios.css';

const Convenios = () => {
  const navigate = useNavigate();
  const { institucionId, institucionN } = useParams();

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

  const handleVerBeneficiarios = (convenioId, convenioNombre) => {
    navigate(`/beneficiarios/${institucionId}/${institucionN}/${convenioId}/${convenioNombre}`);
  };

  const exportToXLSX = () => {
    const wsData = filteredData
      .filter(esActivo)
      .map(({ nombre, direccion, desayuno, almuerzo, fecha_inicial, fecha_final }) => ({
        Nombre: nombre,
        Dirección: direccion,
        Servicios: `${desayuno ? 'Desayuno ' : ''}${almuerzo ? 'Almuerzo' : ''}`,
        'Fecha Inicio': convertirTimestampAFecha(fecha_inicial),
        'Fecha Fin': convertirTimestampAFecha(fecha_final),
      }));

    const ws = XLSX.utils.json_to_sheet(wsData);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Convenios');

    // Agrega el nombre de la institución al nombre del archivo
    const fileName = `convenios_${institucionN}.xlsx`;

    XLSX.writeFile(wb, fileName);
  };

  function esActivo(convenio) {
    return convenio.activo === true;
  }

  async function eliminarConvenio(convenio) {
    Swal.fire({
      title: 'Advertencia',
      text: `Está seguro que desea eliminar ${convenio.nombre}`,
      icon: 'error',
      showDenyButton: true,
      denyButtonText: 'No',
      confirmButtonText: 'Si',
      confirmButtonColor: '#000000',
    }).then(async (response) => {
      if (response.isConfirmed) {
        const querydb = getFirestore();
        const docuRef = doc(querydb, 'convenios', convenio.id);
        try {
          await updateDoc(docuRef, { activo: false });
          window.location.reload();
        } catch (error) {
          console.error('Error al eliminar institución:', error);
          alert(error.message);
        }
      }
    });
  }

  return (
    <div className="centered-container">
      <div>
        <Cabecera />
        <h1>Lista de convenios de {institucionN}</h1>
      </div>

      <div className="search-export-container">

        <div className="centered-container">
          <Button variant="contained" onClick={goAñadirBenef} style={{ marginTop: '10px', backgroundColor: '#890202', color: 'white' }}>
            Añadir Convenio
          </Button>
        </div>

        <div className="centered-container">
          <Button variant="contained" style={{ marginTop: '10px', backgroundColor: '#890202', color: 'white' }} onClick={exportToXLSX}>
            Exportar a Excel
          </Button>
        </div>

      </div>
      <div className="search-export-container">
        <div className="search-container">
          <TextField
            type="text"
            placeholder="Buscar por nombre"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <Search />
                  </IconButton>
                </InputAdornment>
              ),
              style: { fontSize: '14px' }, // Ajusta el tamaño del texto de búsqueda
            }}
            fullWidth
            variant="outlined"
          />
        </div>
      </div>

      <div id="tabla">
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }} align="center">Nombre</TableCell>
                <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }} align="center">Dirección</TableCell>
                <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }} align="center">Servicios</TableCell>
                <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }} align="center">Fecha Inicio</TableCell>
                <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }} align="center">Fecha Fin</TableCell>
                <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }} align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.filter(esActivo).map((convenio) => (
                <TableRow key={convenio.id}>
                  <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }} align="center">{convenio.nombre}</TableCell>
                  <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }} align="center">{convenio.direccion}</TableCell>
                  <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }} align="center">
                    {convenio.desayuno && 'Desayuno '}
                    {convenio.almuerzo && 'Almuerzo'}
                  </TableCell>
                  <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }} align="center">{convertirTimestampAFecha(convenio.fecha_inicial)}</TableCell>
                  <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }} align="center">{convertirTimestampAFecha(convenio.fecha_final)}</TableCell>
                  <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }} align="center">
                    <Button variant="contained" onClick={() => handleVerBeneficiarios(convenio.id, convenio.nombre)} style={{ backgroundColor: '#4caf50', color: 'white' }}>
                      Beneficiarios
                    </Button>
                    <Link to={`/editar-convenio/${institucionId}/${institucionN}/${convenio.id}`}>
                      <Button variant="contained" style={{ backgroundColor: '#4caf50', color: 'white', margin: '5px', fontSize: '14px' }}>
                        Editar
                      </Button>
                    </Link>
                    <Button variant="contained" onClick={() => eliminarConvenio(convenio)} style={{ backgroundColor: '#4caf50', color: 'white', margin: '5px', fontSize: '14px' }}>
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <h1>Tabla de reportes</h1>


    </div>
  );
};

export default Convenios;
