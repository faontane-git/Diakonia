import React, { useState, useEffect } from 'react';
import Cabecera from './Cabecera';
import { Link } from 'react-router-dom';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';
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
import '../estilos/Nutricion.css';

const Nutricion = ({ user }) => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const querydb = getFirestore();
    const queryCollection = collection(querydb, 'instituciones');
    // Ordenar por el campo 'nombre' de forma ascendente
    const orderedQuery = query(queryCollection, orderBy('nombre'));
    getDocs(orderedQuery).then((res) =>
      setData(res.docs.map((institucion) => ({ id: institucion.id, ...institucion.data() })))
    );
  }, []);

  const filteredData = data.filter((institucion) =>
    institucion.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="centered-container">
      <Cabecera user={user} />
      <h1>Seguimiento</h1>
      <div className="list-container-nutricion">
        <h3>Seleccione una institución</h3>

        <div className="search-export-container">
          <div className="search-container">
            <TextField
              type="text"
              placeholder="Buscar por Institución"
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

        {filteredData.length > 0 ? (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Institución</TableCell>
                  <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((institucion) => (
                  <TableRow key={institucion.id}>
                    <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>{institucion.nombre}</TableCell>
                    <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>
                      <Link to={`/asistencias/${institucion.id}/${institucion.nombre}`} className="centered-link">
                        <Button variant="contained" style={{ backgroundColor: '#4cb8c4', margin: '5px', color: 'white' }}>
                          Asistencia
                        </Button>
                      </Link>
                      <Link to={`/nutricion/${institucion.id}/${institucion.nombre}`}>
                        <Button variant="contained" style={{ backgroundColor: '#4caf50', margin: '5px', color: 'white' }}>
                          Nutrición
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <p className="centered-container">¡No hay instituciones disponibles!</p>
        )}
      </div>
    </div>
  );
};

export default Nutricion;
