import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Cabecera from './Cabecera';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../estilos/ListaBeneficiarios.css';
import { getFirestore, collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import QRCode from 'qrcode.react';
import html2canvas from 'html2canvas';
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
import jsPDF from 'jspdf';

const ListaBeneficiarios = ({ user }) => {
  const { institucionId, institucionN, convenioId, convenioN } = useParams();
  const navigate = useNavigate();
  const goAñadirBenef = () => {
    navigate('añadirBenef');
  };

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const tableRef = useRef();

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

  async function eliminarBeneficiario(beneficiario) {
    // ... (sin cambios)
  }

  const exportarCredenciales = () => {
    // Ruta al archivo HTML que deseas exportar (asegúrate de ajustar la ruta según tu estructura de carpetas)
    const rutaArchivoHTML = 'Carnets.html';
    // Cargar el contenido del archivo HTML
    fetch(rutaArchivoHTML)
      .then((response) => response.text())
      .then((codigoHTML) => {
        // Usar html2canvas para convertir el contenido a una imagen
        html2canvas(document.body, { scale: 2 }).then((canvas) => {
          // Crear un nuevo documento PDF
          const pdf = new jsPDF();

          // Obtener el tamaño de la imagen generada
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = 210;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          // Agregar la imagen al documento PDF
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

          // Guardar o descargar el archivo PDF
          pdf.save('ExportedHTML.pdf');
        });
      });
  };

  const generarCredenciales = () => {
    // Codifica el arreglo como un string para pasarlo como parte de la URL
    const encodedData = encodeURIComponent(JSON.stringify(filteredData));
    console.log(encodedData);
    navigate(`/credencial/${encodedData}`);
  };

  return (
    <div className="centered-container">
      <Cabecera user={user} />
      <h1>Lista de Beneficiarios de {institucionN}</h1>
      <h3>Convenio: {convenioN}</h3>
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

      <TableContainer component={Paper} ref={tableRef}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Nombre</TableCell>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Cédula</TableCell>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Fecha de nacimiento</TableCell>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Género</TableCell>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Menores en casa</TableCell>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Mayores en casa</TableCell>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Desayuno</TableCell>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Almuerzo</TableCell>
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
                <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>{beneficiario.desayuno.length !== 0 ? 'Si' : 'No'}</TableCell>
                <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>{beneficiario.almuerzo.length !== 0 ? 'Si' : 'No'}</TableCell>
                <TableCell id='cuerpo_tabla' style={{ fontSize: '14px', marginBottom: '8px' }}>
                  <Link
                    to={`/editar-beneficiario/${institucionId}/${institucionN}/${convenioId}/${convenioN}/${beneficiario.id}`}
                  >
                    <Button variant="contained" style={{ backgroundColor: '#4caf50', color: 'white', marginBottom: '4px' }}>
                      Editar
                    </Button>
                  </Link>
                  <Button
                    onClick={() => eliminarBeneficiario(beneficiario)}
                    variant="contained"
                    style={{ backgroundColor: '#4caf50', color: 'white', marginBottom: '4px' }}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        id="buttonExportarCredenciales"
        style={{ backgroundColor: '#1976D2', color: 'white', marginTop: '10px' }}
        onClick={generarCredenciales}
        variant="contained"
      >
        Generar Credenciales
      </Button>
    </div>
  );
};

export default ListaBeneficiarios;
