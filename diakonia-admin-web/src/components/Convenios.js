import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getFirestore, collection, getDocs, query, where, doc,getDoc,updateDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { PDFDocument } from 'pdf-lib'; // Importa PDFDocument de pdf-lib
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
import Cabecera from './Cabecera';
import '../estilos/ListaBeneficiarios.css';

const Convenios = () => {
  const navigate = useNavigate();
  const { institucionId, institucionN } = useParams();

  const goAñadirBenef = () => {
    navigate('añadirConvenio');
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

  const handleVerBeneficiarios = (convenioId, convenioNombre) => {
    navigate(`/beneficiarios/${institucionId}/${institucionN}/${convenioId}/${convenioNombre}`);
  };

  const descargarPDF = async (convenioId, convenioNombre) => {
    try {
      const db = getFirestore();
      // Obtener referencia al documento del convenio en Firestore
      const convenioDocRef = doc(db, 'convenios', convenioId);
      // Obtener el documento del convenio
      const convenioDocSnapshot = await getDoc(convenioDocRef);
      // Verificar si el documento existe
      if (convenioDocSnapshot.exists()) {
        // Obtener el atributo pdfBase64 del documento
        const pdfBase64 = convenioDocSnapshot.data().pdfBase64;
        if (pdfBase64) {
          // Descargar el PDF utilizando pdfBase64
          const byteCharacters = atob(pdfBase64);
          const byteNumbers = new Array(byteCharacters.length);
  
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
  
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });
  
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          // Nombre del archivo con el formato 'Convenio_nombre.pdf'
          link.download = `Convenio_${convenioNombre}.pdf`;
  
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          Swal.fire({
            title: 'Error',
            text: 'No se encontró el atributo pdfBase64 en el documento del convenio.',
            icon: 'error',
          });
        }
      } else {
        Swal.fire({
          title: 'Error',
          text: 'No se encontró el documento del convenio.',
          icon: 'error',
        });
      }
    } catch (error) {
      console.error('Error al obtener o descargar el PDF:', error);
      Swal.fire({
        title: 'Error',
        text: '¡Error al obtener o descargar el PDF!',
        icon: 'error',
      });
    }
  };

  const exportToXLSX = () => {
    const wsData = filteredData
      .filter(esActivo)
      .map(({ nombre, direccion, desayuno, almuerzo, fecha_inicial, fecha_final }) => ({
        Nombre: nombre,
        Dirección: direccion,
        Servicios: `${desayuno ? 'Desayuno ' : ''}${almuerzo ? 'Almuerzo' : ''}`,
        'Fecha Inicio': convertirTimestampAFecha(fecha_inicial),
        'Fecha Fin': convertirTimestampAFecha(fecha_final),
      }));

    const ws = XLSX.utils.json_to_sheet(wsData);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Convenios');

    const fileName = `convenios_${institucionN}.xlsx`;

    XLSX.writeFile(wb, fileName);
  };

  function esActivo(convenio) {
    return convenio.activo === true;
  }

  async function eliminarConvenio(convenio) {
    Swal.fire({
      title: 'Advertencia',
      text: `Está seguro que desea eliminar ${convenio.nombre}`,
      icon: 'error',
      showDenyButton: true,
      denyButtonText: 'No',
      confirmButtonText: 'Si',
      confirmButtonColor: '#000000',
    }).then(async (response) => {
      if (response.isConfirmed) {
        const querydb = getFirestore();
        const docuRef = doc(querydb, 'convenios', convenio.id);
        try {
          await updateDoc(docuRef, { activo: false });
          window.location.reload();
        } catch (error) {
          console.error('Error al eliminar institución:', error);
          alert(error.message);
        }
      }
    });
  }


  return (
    <div className="centered-container">
      <div>
        <Cabecera />
        <h1>Lista de convenios de {institucionN}</h1>
      </div>

      <div className="search-export-container">
        <div className="centered-container">
          <Button variant="contained" onClick={goAñadirBenef} style={{ marginTop: '10px', backgroundColor: '#890202', color: 'white' }}>
            Añadir Convenio
          </Button>
        </div>

        <div className="centered-container">
          <Button variant="contained" style={{ marginTop: '10px', backgroundColor: '#890202', color: 'white' }} onClick={exportToXLSX}>
            Exportar a Excel
          </Button>
        </div>
      </div>

      <div className="search-export-container">
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
              style: { fontSize: '14px' },
            }}
            fullWidth
            variant="outlined"
          />
        </div>
      </div>

      <div id="tabla">
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }} align="center">Nombre</TableCell>
                <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }} align="center">Dirección</TableCell>
                <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }} align="center">Servicios</TableCell>
                <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }} align="center">Fecha Inicio</TableCell>
                <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }} align="center">Fecha Fin</TableCell>
                <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }} align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.filter(esActivo).map((convenio) => (
                <TableRow key={convenio.id}>
                  <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }} align="center">{convenio.nombre}</TableCell>
                  <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }} align="center">{convenio.direccion}</TableCell>
                  <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }} align="center">
                    {convenio.desayuno && 'Desayuno '}
                    {convenio.almuerzo && 'Almuerzo'}
                  </TableCell>
                  <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }} align="center">{convertirTimestampAFecha(convenio.fecha_inicial)}</TableCell>
                  <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }} align="center">{convertirTimestampAFecha(convenio.fecha_final)}</TableCell>
                  <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }} align="center">
                    <Button variant="contained" onClick={() => handleVerBeneficiarios(convenio.id, convenio.nombre)} style={{ backgroundColor: '#4caf50', color: 'white' }}>
                      Beneficiarios
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => descargarPDF(convenio.id, convenio.nombre)}
                      style={{ backgroundColor: '#2196f3', color: 'white', margin: '5px', fontSize: '14px' }}
                    >
                      Descargar PDF
                    </Button>
                    <Link to={`/editar-convenio/${institucionId}/${institucionN}/${convenio.id}`}>
                      <Button variant="contained" style={{ backgroundColor: '#4caf50', color: 'white', margin: '5px', fontSize: '14px' }}>
                        Editar
                      </Button>
                    </Link>
                    <Button variant="contained" onClick={() => eliminarConvenio(convenio)} style={{ backgroundColor: '#4caf50', color: 'white', margin: '5px', fontSize: '14px' }}>
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <h1>Tabla de reportes</h1>
    </div>
  );
};

export default Convenios;
