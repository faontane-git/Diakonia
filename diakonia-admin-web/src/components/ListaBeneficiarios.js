import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Cabecera from './Cabecera';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../estilos/ListaBeneficiarios.css';
import { getFirestore, collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import QRCode from 'qrcode.react';
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

const ListaBeneficiarios = ({ user }) => {
  const { institucionId, institucionN, convenioId, convenioN } = useParams();
  const navigate = useNavigate();
  const goAñadirBenef = () => {
    navigate('añadirBenef');
  };

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const convertirTimestampAFecha = (timestamp) => {
    const fecha = new Date(timestamp.seconds * 1000);
    return fecha.toLocaleDateString('es-ES');
  };

  useEffect(() => {
    const querydb = getFirestore();
    const beneficiariosCollection = collection(querydb, 'beneficiarios');
    const beneficiariosQuery = query(
      beneficiariosCollection,
      where('institucionId', '==', institucionId),
      where('convenioId', '==', convenioId)
    );

    getDocs(beneficiariosQuery).then((res) =>
      setData(res.docs.map((benf) => ({ id: benf.id, ...benf.data() })))
    );
  }, [institucionId]);

  const filteredData = data.filter((beneficiario) =>
    beneficiario.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function esActivo(beneficiario) {
    return beneficiario.activo === true;
  }

  const generarCredencial = (beneficiario) => {
    // Codifica el objeto como un string para pasarlo como parte de la URL
    const encodedData = encodeURIComponent(JSON.stringify([beneficiario]));
    navigate(`/credencial/${encodedData}`);
  };

  const generarCredenciales = () => {
    // Codifica el arreglo como un string para pasarlo como parte de la URL
    const encodedData = encodeURIComponent(JSON.stringify(filteredData));
    navigate(`/credencial/${encodedData}`);
  };

  async function eliminarBeneficiario(beneficiario) {
    Swal.fire({
      title: 'Advertencia',
      text: `¿Está seguro que desea eliminar ${beneficiario.nombre}?`,
      icon: 'error',
      showDenyButton: true,
      denyButtonText: 'No',
      confirmButtonText: 'Si',
      confirmButtonColor: '#000000',
    }).then(async (response) => {
      if (response.isConfirmed) {
        const querydb = getFirestore();
        const docuRef = doc(querydb, 'beneficiarios', beneficiario.id);
        try {
          await updateDoc(docuRef, { activo: false });
          window.location.reload();
        } catch (error) {
          console.error('Error al eliminar beneficiario:', error);
          alert(error.message);
        }
      }
    });
  }

  return (
    <div className="centered-container">
      <Cabecera user={user} />
      <h1>Lista de Beneficiarios de {institucionN}</h1>
      <h3>Convenio: {convenioN}</h3>
      <h3>Servicios: {data[0]?.desayuno.length !== 0 ? 'Desayuno ' : ''}{data[0]?.almuerzo.length !== 0 ? 'Almuerzo' : ''}</h3>

      <Button
        id="buttonABeneficiarios"
        style={{ backgroundColor: '#890202', color: 'white', marginBottom: '10px' }}
        onClick={goAñadirBenef}
        variant="contained"
      >
        Añadir Beneficiarios
      </Button>

      <div className="search-container">
        <TextField
          type="text"
          placeholder="Buscar por Nombre"
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Nombre</TableCell>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Cédula</TableCell>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Fecha de nacimiento</TableCell>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Género</TableCell>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>N° de personas menores en casa que viven con el beneficiario</TableCell>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>N° de personas mayores en casa que viven con el beneficiario</TableCell>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.filter(esActivo).map((beneficiario) => (
              <TableRow key={beneficiario.id}>
                <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>{beneficiario.nombre}</TableCell>
                <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>{beneficiario.cedula}</TableCell>
                <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>{convertirTimestampAFecha(beneficiario.fecha_nacimiento)}</TableCell>
                <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>{beneficiario.genero}</TableCell>
                <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>{beneficiario.numero_de_personas_menores_en_el_hogar}</TableCell>
                <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>{beneficiario.numero_de_personas_mayores_en_el_hogar}</TableCell>

                <TableCell id='cuerpo_tabla' style={{ fontSize: '14px', marginBottom: '8px' }}>
                  <Link
                    to={`/editar-beneficiario/${institucionId}/${institucionN}/${convenioId}/${convenioN}/${beneficiario.id}`}
                  >
                    <Button variant="contained" style={{ backgroundColor: '#4caf50', color: 'white', marginBottom: '4px', width: '100%' }}>
                      Editar
                    </Button>
                  </Link>
                  <Button
                    onClick={() => eliminarBeneficiario(beneficiario)}
                    variant="contained"
                    style={{ backgroundColor: '#4caf50', color: 'white', marginBottom: '4px', width: '100%' }}
                  >
                    Eliminar
                  </Button>
                  <Button
                    id="buttonGenerarCarnet"
                    style={{ backgroundColor: '#4caf50', color: 'white', width: '100%' }}
                    onClick={() => generarCredencial(beneficiario)}
                    variant="contained"
                  >
                    Credencial
                  </Button>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        id="buttonExportarCredenciales"
        style={{ backgroundColor: '#890202', color: 'white', marginTop: '10px' }}
        onClick={() => generarCredenciales(filteredData)}
        variant="contained"
      >
        Generar Credenciales
      </Button>
    </div>
  );
};

export default ListaBeneficiarios;
