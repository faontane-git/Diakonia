import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Cabecera from './Cabecera';
import { useNavigate } from 'react-router-dom';
import '../estilos/NutricionConvenios.css';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
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

const NutricionConvenios = () => {
  const { institucionId, institucionN } = useParams();
  const navigate = useNavigate();
  const goBack = () => {
    navigate('/beneficiarios');
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
    const conveniosQuery = query(
      conveniosCollection,
      where('institucionId', '==', institucionId)
    );

    getDocs(conveniosQuery).then((res) => {
      const conveniosData = res.docs.map((convenio) => ({
        id: convenio.id,
        ...convenio.data(),
      }));

      // Ordenar por nombre alfabéticamente
      const sortedData = conveniosData.sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
      );

      setData(sortedData);
    });
  }, [institucionId]);

  const filteredData = data.filter((convenio) =>
    convenio.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="centered-container">
      <Cabecera />
      <h1>Nutricion</h1>
      <h3>Seleccione un Convenio de {institucionN}</h3>

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

      <div className="list-container">
        {filteredData.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Convenio</TableCell>
                  <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Fecha Inicial</TableCell>
                  <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Fecha Final</TableCell>
                  <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((convenio) => (
                  <TableRow key={convenio.id}>
                    <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>{convenio.nombre}</TableCell>
                    <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>{convertirTimestampAFecha(convenio.fecha_inicial)}</TableCell>
                    <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>{convertirTimestampAFecha(convenio.fecha_final)}</TableCell>
                    <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>
                      <Link
                        to={`/nutricion/${institucionId}/${institucionN}/${convenio.id}/${convenio.nombre}`}
                        className="centered-link"
                      >
                        <Button variant="contained" style={{ backgroundColor: '#4caf50', color: 'white' }}>
                          Acceder
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <p id="especial">¡No hay convenios disponibles!</p>
        )}
      </div>
    </div>
  );
};

export default NutricionConvenios;
