import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Cabecera from './Cabecera';
import { useNavigate } from 'react-router-dom';
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
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import Swal from 'sweetalert2';
import '../estilos/ListaBeneficiarios.css';

const BeneficiariosConvenios = () => {
  const { institucionId, institucionN } = useParams();
  const navigate = useNavigate();

  const convertirTimestampAFecha = (timestamp) => {
    const fecha = new Date(timestamp.seconds * 1000);
    return fecha.toLocaleDateString('es-ES');
  };

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const querydb = getFirestore();
      const conveniosCollection = collection(querydb, 'convenios');
      const conveniosQuery = query(
        conveniosCollection,
        where('institucionId', '==', institucionId)
      );

      const querySnapshot = await getDocs(conveniosQuery);
      setData(querySnapshot.docs.map((convenio) => ({ id: convenio.id, ...convenio.data() })));
    };

    fetchData();
  }, [institucionId]);

  const filteredData = data.filter((convenio) =>
    convenio.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVerBeneficiarios = (convenioId, convenioNombre) => {
    navigate(`/beneficiarios/${institucionId}/${institucionN}/${convenioId}/${convenioNombre}`);
  };

  const handleVolver = () => {
    navigate('/beneficiarios');
  };

  return (
    <div className="beneficiarios-container">
      <Cabecera />
      <div className="centered-container">
        <h1>Beneficiarios</h1>
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

      </div>

      <div id="tabla">
        {filteredData.length > 0 ? (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>
                    Convenio
                  </TableCell>
                  <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>
                    Fecha Inicial
                  </TableCell>
                  <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>
                    Fecha Final
                  </TableCell>
                  <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((convenio) => (
                  <TableRow key={convenio.id}>
                    <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>{convenio.nombre}</TableCell>
                    <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>{convertirTimestampAFecha(convenio.fecha_inicial)} </TableCell>
                    <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>{convertirTimestampAFecha(convenio.fecha_final)}</TableCell>
                    <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>
                      <Button variant="contained" onClick={() => handleVerBeneficiarios(convenio.id, convenio.nombre)} style={{ backgroundColor: '#4caf50', color: 'white' }}>
                        Ver Beneficiarios
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <p className="centered-container">¡No hay convenios disponibles!</p>
        )}
      </div>

      <div className="centered-container">
        <Button style={{ backgroundColor: '#890202', color: 'white' }} variant="contained" onClick={handleVolver}>
          Volver
        </Button>
      </div>
    </div>
  );
};

export default BeneficiariosConvenios;
