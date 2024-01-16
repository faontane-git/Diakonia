import React, { useState } from 'react';
import '../estilos/ListaUsuarios.css';
import { Link } from 'react-router-dom';
import { getFirestore, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';

const ListaUsuarios = ({ usuarios }) => {
  const firestore = getFirestore();
  const navigate = useNavigate();

  const [selectedInstitucion, setSelectedInstitucion] = useState('');

  const handleInstitucionChange = (e) => {
    setSelectedInstitucion(e.target.value);
  };

  async function eliminarUsuario(usuario) {
    // Mostrar la alerta de confirmación
    const result = await Swal.fire({
      title: 'Advertencia',
      text: `¿Está seguro que desea eliminar al usuario?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    });

    // Si el usuario confirma la eliminación, proceder
    if (result.isConfirmed) {
      try {
        const querydb = getFirestore();
        const docRef = doc(querydb, 'usuarios', usuario);

        // Eliminar el documento del usuario en Firestore
        await deleteDoc(docRef);
        Swal.fire('Eliminado', `El usuario ha sido eliminado.`, 'success').then(() => {
          window.location.reload();
        });
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        alert(error.message);
      }
    }
  }

  const exportToXLSX = () => {
    const filteredUsers = selectedInstitucion
      ? usuarios.filter((usuario) => usuario.institucionN === selectedInstitucion)
      : usuarios;

    const ws = XLSX.utils.json_to_sheet(
      filteredUsers.map(({ correo, rol, institucionN }) => ({
        Correo: correo,
        Rol: rol,
        Institución: institucionN,
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');
    XLSX.writeFile(wb, 'usuarios.xlsx');
  };

  return (
    <div className="centered-container">
      <h1>Lista de Usuarios</h1>

      <div className="search-export-container">
        <div className="centered-container">
          <Link to="/usuarios/registrarUsuario">
            <Button variant="contained" style={{ backgroundColor: '#890202', color: 'white' }}>
              Crear Usuario
            </Button>
          </Link>
        </div>
        <div className="centered-container">
          <Button onClick={exportToXLSX} variant="contained" style={{ backgroundColor: '#890202', color: 'white' }}>
            Exportar Tabla
          </Button>
        </div>
      </div>

      <div className="filter-container">
        <label htmlFor="institucionFilter">Filtrar por Institución:</label>
        <select
          id="institucionFilter"
          value={selectedInstitucion}
          onChange={handleInstitucionChange}
          className="custom-select"
        >
          <option value="">Todos</option>
          {Array.from(new Set(usuarios.map((usuario) => usuario.institucionN)))
            .sort() // Ordena las instituciones alfabéticamente
            .map((institucion, index) => (
              <option key={index} value={institucion}>
                {institucion}
              </option>
            ))}
        </select>
      </div>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Responsable</TableCell>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Correo</TableCell>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Rol</TableCell>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Institución</TableCell>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Convenio</TableCell>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios
              .filter((usuario) =>
                selectedInstitucion ? usuario.institucionN === selectedInstitucion : true
              )
              .map((usuario, index) => (
                <TableRow key={index}>
                  <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>{usuario.nombre}</TableCell>
                  <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>{usuario.correo}</TableCell>
                  <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>{usuario.rol}</TableCell>
                  <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>{usuario.institucionN}</TableCell>
                  <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>{usuario.convenioN}</TableCell>
                  <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>
                    <Link to={`/usuarios/editar-usuario/${usuario.id}`}>
                      <Button variant="contained" style={{ backgroundColor: '#4caf50', color: 'white', margin: '5px', fontSize: '14px' }}>
                        Editar
                      </Button>
                    </Link>
                    <Button
                      variant="contained"
                      onClick={() => eliminarUsuario(usuario.id)}
                      style={{ backgroundColor: '#f44336', margin: '5px', fontSize: '14px' }}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ListaUsuarios;
