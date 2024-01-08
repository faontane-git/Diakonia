import React, { useState } from 'react';
import '../estilos/ListaUsuarios.css';
import { Link } from 'react-router-dom';
import { getFirestore, deleteUser } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
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
} from '@mui/material';

const ListaUsuarios = ({ usuarios }) => {
  const auth = getAuth();
  const firestore = getFirestore();

  const [selectedInstitucion, setSelectedInstitucion] = useState('');

  const handleInstitucionChange = (e) => {
    setSelectedInstitucion(e.target.value);
  };

  async function eliminarUsuario(usuario) {
    const auth = getAuth();
    const firestore = getFirestore();

    try {
      // Eliminar el usuario de Firebase Auth
      // await deleteUser(usuario);

      // Eliminar el documento del usuario en Firestore
      // await deleteDoc(doc(firestore, 'usuarios', usuario));

      // Actualizar el estado de los usuarios (si es necesario)
      // ...

    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert(error.message);
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

      <div className="filter-container">
        <label htmlFor="institucionFilter">Filtrar por Institución:</label>
        <select
          id="institucionFilter"
          value={selectedInstitucion}
          onChange={handleInstitucionChange}
          className="custom-select"
        >
          <option value="">Todos</option>
          {Array.from(new Set(usuarios.map((usuario) => usuario.institucionN))).map(
            (institucion, index) => (
              <option key={index} value={institucion}>
                {institucion}
              </option>
            )
          )}
        </select>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Responsable</TableCell>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Correo</TableCell>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Rol</TableCell>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Institución</TableCell>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Convenio</TableCell>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Acción</TableCell>
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
                    {/* Descomenta la siguiente línea si deseas permitir eliminar usuarios */}
                    {/* <Button variant="contained" color="secondary" onClick={() => eliminarUsuario(usuario.id)}>
                      Eliminar
                    </Button> */}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>


      <Button onClick={exportToXLSX} variant="contained" style={{ marginTop: '10px', backgroundColor: '#890202', color: 'white' }}>
        Exportar Tabla
      </Button>
    </div>
  );
};

export default ListaUsuarios;
