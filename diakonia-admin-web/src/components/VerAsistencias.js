import React, { useState, useEffect } from 'react';
import Cabecera from './Cabecera';
import { Link } from 'react-router-dom';
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
import '../estilos/VerAsistencias.css';

import { getFirestore, collection, getDocs } from 'firebase/firestore';

const VerAsistencias = ({ user }) => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const querydb = getFirestore();
    const queryCollection = collection(querydb, 'instituciones');

    getDocs(queryCollection).then((res) =>
      setData(res.docs.map((institucion) => ({ id: institucion.id, ...institucion.data() })))
    );
  }, []);

  const filteredData = data.filter((institucion) =>
    institucion.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="centered-container">
      <Cabecera user={user} />
      <h1>Seguimiento asistencias</h1>
      <h3>Seleccione una institución</h3>

      <div className="search-container">
        <TextField
          type="text"
          placeholder="Buscar por Convenio"
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

      <TableContainer component={Paper} className="list-container-verAsistencias">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Institución</TableCell>
               <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((institucion) => (
                <TableRow key={institucion.id}>
                  <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>{institucion.nombre}</TableCell>
                   <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>
                    <Link to={`/asistencias/${institucion.id}/${institucion.nombre}`} className="centered-link">
                      <Button variant="contained" style={{ backgroundColor: '#4caf50', color: 'white' }}>
                        Acceder
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} id="no-instituciones">
                  ¡No hay instituciones disponibles!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default VerAsistencias;
