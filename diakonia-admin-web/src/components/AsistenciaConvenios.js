import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Cabecera from './Cabecera';
import { useNavigate } from 'react-router-dom';
import '../estilos/ListaBeneficiarios.css';
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
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl
} from '@mui/material';
import { Search } from '@mui/icons-material';

const AsistenciaConvenios = () => {
  const { institucionId, institucionN } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtro, setFiltro] = useState('activos');

  useEffect(() => {
    const querydb = getFirestore();
    const conveniosCollection = collection(querydb, 'convenios');
    const conveniosQuery = query(
      conveniosCollection,
      where('institucionId', '==', institucionId)
    );

    getDocs(conveniosQuery).then((res) =>
      setData(res.docs.map((benf) => ({ id: benf.id, ...benf.data() })))
    );
  }, [institucionId]);

  function convertirTimestampAFecha(timestamp) {
    const fecha = new Date(timestamp.seconds * 1000);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Meses son indexados desde 0
    const anio = fecha.getFullYear().toString();

    // Formatea la fecha como "DD-MM-YYYY"
    const fechaFormateada = `${dia}-${mes}-${anio}`;
    return fechaFormateada;
  }


  function esActivo(convenio) {
    if (filtro === 'activos') {
      return convenio.activo === true;
    } else if (filtro === 'inactivos') {
      return convenio.activo === false;
    }
  }

  const filteredData = data.filter(
    (convenio) =>
      convenio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
      esActivo(convenio)
  );

  const goBack = () => {
    navigate('/nutricion');
  };

  return (
    <div className="centered-container">
      <Cabecera />

      <div style={{ textAlign: 'left', marginLeft: '30px', marginTop: '10px' }}>
        <Button variant="contained" style={{ backgroundColor: '#890202', color: 'white' }} onClick={goBack} >
          Volver
        </Button>
      </div>

      <h1>Asistencias</h1>
      <h3>{institucionN}</h3>
      <h3>Seleccione un Convenio</h3>

      <FormControl component="fieldset">
        <RadioGroup
          row
          aria-label="filtro-convenios"
          name="filtro-convenios"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        >
          <FormControlLabel
            value="activos"
            control={<Radio />}
            label="Activos"
          />
          <FormControlLabel
            value="inactivos"
            control={<Radio />}
            label="Inactivos"
          />
        </RadioGroup>
      </FormControl>


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
                      to={`/asistencias/${institucionId}/${institucionN}/${convenio.id}/${convenio.nombre}/${convertirTimestampAFecha(convenio.fecha_inicial)}/${convertirTimestampAFecha(convenio.fecha_final)}`}
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
