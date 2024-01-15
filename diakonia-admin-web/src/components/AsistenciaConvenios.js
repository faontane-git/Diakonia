import React, { useState, useEffect } from 'react';
import { Await, useParams } from 'react-router-dom';
import Cabecera from './Cabecera';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../estilos/ListaBeneficiarios.css';
import { getFirestore, collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
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
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

const AsistenciaConvenios = () => {
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
    const conveniosQuery = query(conveniosCollection, where('institucionId', '==', institucionId));

    getDocs(conveniosQuery).then((res) =>
      setData(res.docs.map((benf) => ({ id: benf.id, ...benf.data() })))
    );
  }, [institucionId]);

  const filteredData = data.filter((convenio) =>
    convenio.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );


  function esActivo(convenio) {
    console.log(convenio.activo)
    return convenio.activo === true;
  }


  return (
    <div className="centered-container">
      <Cabecera />
      <h1>Asistencias</h1>
      <h3>Seleccione un Convenio de {institucionN}</h3>

      <div className="search-export-container">
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
              style: { fontSize: '14px' },
            }}
            fullWidth
            variant="outlined"
          />
        </div>
      </div>

      <TableContainer component={Paper} className="list-container">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell
                id="cuerpo_tabla"
                style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}
              >
                Convenio
              </TableCell>
              <TableCell
                id="cuerpo_tabla"
                style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}
              >
                Fecha Inicial
              </TableCell>
              <TableCell
                id="cuerpo_tabla"
                style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}
              >
                Fecha Final
              </TableCell>
              <TableCell
                id="cuerpo_tabla"
                style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}
              >
                Acceder
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((convenio) => (
                <TableRow key={convenio.id}>
                  <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>{convenio.nombre}</TableCell>
                  <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>{convertirTimestampAFecha(convenio.fecha_inicial)}</TableCell>
                  <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>{convertirTimestampAFecha(convenio.fecha_final)}</TableCell>
                  <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>
                    <Link
                      to={`/asistencias/${institucionId}/${institucionN}/${convenio.id}/${convenio.nombre}`}
                      className="centered-link"
                    >
                      <Button variant="contained" style={{ backgroundColor: '#4caf50', color: 'white' }}>
                        Ver Asistencia
                      </Button>
                    </Link>

                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} id="especial">
                  ¡No hay convenios disponibles!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};


export default AsistenciaConvenios;
