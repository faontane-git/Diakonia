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
import '../estilos/Beneficiarios.css';
import firebaseApp from '../firebase-config';

const Beneficiarios = ({ user }) => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const querydb = getFirestore();
      const queryCollection = collection(querydb, 'instituciones');

      // Ordenar por nombre alfabéticamente
      const orderedQuery = query(queryCollection, orderBy('nombre'));

      const querySnapshot = await getDocs(orderedQuery);

      setData(
        querySnapshot.docs.map((institucion) => ({
          id: institucion.id,
          ...institucion.data(),
        }))
      );
    };

    fetchData();
  }, []);

  const filteredData = data.filter((institucion) =>
    institucion.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVerDetalle = (id, nombre) => {
    // Lógica para redirigir a la siguiente ventana, por ejemplo:
    // history.push(`/detalle/${id}/${nombre}`);
    console.log(`Ver detalles de ${nombre}`);
  };

  return (
    <div className="beneficiarios-container">
      <Cabecera user={user} />
      <div className="centered-container">
        <h1>Beneficiarios</h1>
        <h3>Seleccione una institución</h3>
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

      <div className="table-container">
        {filteredData.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Institución</TableCell>
                  <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>RUC</TableCell>
                  <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((institucion, index) => (
                  <TableRow key={institucion.id}>
                    <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>{institucion.nombre}</TableCell>
                    <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>{institucion.ruc}</TableCell>
                    <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>
                      <Link to={`/beneficiarios/${institucion.id}/${institucion.nombre}`}>
                        <Button variant="contained" style={{ backgroundColor: '#4caf50', color: 'white' }}>
                          Ingresar
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

export default Beneficiarios;
