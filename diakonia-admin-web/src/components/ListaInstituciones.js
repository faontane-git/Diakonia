import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import '../estilos/ListaInstituciones.css';

const ListaInstituciones = ({ instituciones }) => {
  const navigate = useNavigate();

  const goConvenios = (institucion) => {
    navigate(`/instituciones/${institucion.id}/${institucion.nombre}`);
  };

  const [searchTerm, setSearchTerm] = useState('');

  const filteredInstituciones = instituciones.filter((institucion) =>
    institucion.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function esActivo(institucion) {
    return institucion.activo === true;
  }

  async function eliminarInstitucion(institucion) {
    Swal.fire({
      title: 'Advertencia',
      text: `¿Está seguro que desea eliminar ${institucion.nombre}?`,
      icon: 'error',
      showDenyButton: true,
      denyButtonText: 'No',
      confirmButtonText: 'Sí',
      confirmButtonColor: '#000000',
    }).then(async (response) => {
      if (response.isConfirmed) {
        const querydb = getFirestore();
        const docuRef = doc(querydb, 'instituciones', institucion.id);
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

  const exportToXLSX = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredInstituciones
        .filter(esActivo)
        .map(({ nombre, telefono, direccion, desayuno, almuerzo, fecha_inicial, fecha_final }) => ({
          Nombre: nombre,
          Teléfono: telefono,
          Ubicación: direccion,
          Servicios: `${desayuno ? 'Desayuno ' : ''}${almuerzo ? 'Almuerzo' : ''}`,
          'Fecha Inicio': fecha_inicial,
          'Fecha Final': fecha_final,
        }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Instituciones');
    XLSX.writeFile(wb, 'instituciones.xlsx');
  };

  return (
    <div className="beneficiarios-container">
      <div className="centered-container">
        <h1 style={{ fontSize: '24px' }}>Lista de Instituciones</h1>
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

      <div id='tabla'>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }} align="center">Institución</TableCell>
                <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }} align="center">Teléfono</TableCell>
                <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }} align="center">RUC</TableCell>
                <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }} align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInstituciones.filter(esActivo).map((institucion, index) => (
                <TableRow key={index}>
                  <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }} align="center">{institucion.nombre}</TableCell>
                  <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }} align="center">{institucion.telefono}</TableCell>
                  <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }} align="center">{institucion.ruc}</TableCell>
                  <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }} align="center">
                    <Link to={`/editar-institucion/${institucion.id}`}>
                      <Button variant="contained" style={{ backgroundColor: '#4caf50', color: 'white', margin: '5px', fontSize: '14px' }}>
                        Editar
                      </Button>
                    </Link>
                    <Button onClick={() => goConvenios(institucion)} variant="contained" style={{ backgroundColor: '#4caf50', color: 'white', margin: '5px', fontSize: '14px' }}>
                      Convenios
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div className="centered-container">
        <button className="centered-button" onClick={exportToXLSX} style={{ fontSize: '16px' }}>
          Exportar Tabla
        </button>
      </div>
    </div>
  );
};

export default ListaInstituciones;
