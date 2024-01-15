import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getFirestore, collection, getDocs, query, where, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

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
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from '@mui/material';

import { Search } from '@mui/icons-material';

import Cabecera from './Cabecera';
import '../estilos/ListaBeneficiarios.css';

const Convenios = () => {
  const navigate = useNavigate();
  const { institucionId, institucionN } = useParams();
  const [activoFilter, setActivoFilter] = useState('activos');
  const [isLoading, setIsLoading] = useState(false);
  const [reloading, setReloading] = useState(false);

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
    setIsLoading(true);

    const querydb = getFirestore();
    const conveniosCollection = collection(querydb, 'convenios');
    const conveniosQuery = query(conveniosCollection, where('institucionId', '==', institucionId));

    getDocs(conveniosQuery)
      .then((res) => setData(res.docs.map((benf) => ({ id: benf.id, ...benf.data() }))))
      .finally(() => {
        setIsLoading(false);
        setReloading(false);
      });
  }, [institucionId, reloading]);

  useEffect(() => {
    const handleReload = () => {
      setReloading(true);
      setIsLoading(true);
    };

    window.addEventListener('beforeunload', handleReload);

    return () => {
      window.removeEventListener('beforeunload', handleReload);
    };
  }, []);

  const currentDate = new Date();

  const filteredData = data.filter((convenio) =>
    convenio.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVerBeneficiarios = (convenioId, convenioNombre) => {
    navigate(`/beneficiarios/${institucionId}/${institucionN}/${convenioId}/${convenioNombre}`);
  };

  const descargarPDF = async (convenioId, convenioNombre) => {
    try {
      const db = getFirestore();
      const convenioDocRef = doc(db, 'convenios', convenioId);
      const convenioDocSnapshot = await getDoc(convenioDocRef);

      if (convenioDocSnapshot.exists()) {
        const pdfBase64 = convenioDocSnapshot.data().pdfBase64;
        if (pdfBase64) {
          const byteCharacters = atob(pdfBase64);
          const byteNumbers = new Array(byteCharacters.length);

          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }

          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });

          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `Convenio_${convenioNombre}.pdf`;

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          Swal.fire({
            title: 'Error',
            text: '¡No se encontró un documento del convenio registrado en el sistema!',
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
    return activoFilter === 'activos'
      ? convenio.activo === true
      : convenio.activo !== true;
  }

  async function eliminarConvenioFecha(convenio) {
    const querydb = getFirestore();
    const docuRef = doc(querydb, 'convenios', convenio.id);

    try {
      await updateDoc(docuRef, { activo: false });
    } catch (error) {
      alert(error.message);
    }
  }

  async function eliminarRegistro(convenio) {
    const fechaInicio = new Date(convenio.fecha_inicial.seconds * 1000);

    // Verificar si la fecha de inicio es mayor a la fecha actual
    if (fechaInicio > currentDate) {
      Swal.fire({
        title: 'Advertencia',
        text: `¿Está seguro que desea eliminar el convenio ${convenio.nombre}?`,
        icon: 'error',
        showDenyButton: true,
        denyButtonText: 'No',
        confirmButtonText: 'Si',
        confirmButtonColor: '#000000',
      }).then(async (response) => {
        if (response.isConfirmed) {
          setIsLoading(true); // Activar pantalla de carga

          const querydb = getFirestore();
          const docuRef = doc(querydb, 'convenios', convenio.id);

          try {
            await deleteDoc(docuRef);
            setReloading(true); // Activar pantalla de carga antes de recargar
            window.location.reload();
          } catch (error) {
            alert(error.message);
            setIsLoading(false); // Desactivar pantalla de carga en caso de error
          }
        }
      });
    } else {
      // Mostrar notificación de que no se puede eliminar el convenio
      Swal.fire({
        title: 'Error',
        text: `¡No se puede eliminar el convenio ${convenio.nombre} porque ya empezó!`,
        icon: 'error',
      });
    }
  }

  async function activarConvenio(convenio) {
    const fechaFin = new Date(convenio.fecha_final.seconds * 1000);

    // Verificar si la fecha de fin es menor a la fecha actual
    if (fechaFin >= currentDate) {
      Swal.fire({
        title: 'Advertencia',
        text: `¿Está seguro que desea activar el convenio ${convenio.nombre}?`,
        icon: 'error',
        showDenyButton: true,
        denyButtonText: 'No',
        confirmButtonText: 'Si',
        confirmButtonColor: '#000000',
      }).then(async (response) => {
        if (response.isConfirmed) {
          setIsLoading(true); // Activar pantalla de carga

          const querydb = getFirestore();
          const docuRef = doc(querydb, 'convenios', convenio.id);

          try {
            await updateDoc(docuRef, { activo: true });
            setReloading(true); // Activar pantalla de carga antes de recargar
            window.location.reload();
          } catch (error) {
            alert(error.message);
            setIsLoading(false); // Desactivar pantalla de carga en caso de error
          }
        }
      });
    } else {
      // Mostrar notificación de que no se puede activar el convenio
      Swal.fire({
        title: 'Error',
        text: `¡No se puede activar el convenio ${convenio.nombre} porque ya ha concluído!`,
        icon: 'error',
      });
    }
  }



  async function eliminarConvenio(convenio) {
    Swal.fire({
      title: 'Advertencia',
      text: `¿Está seguro que desea finalizar el convenio ${convenio.nombre}?`,
      icon: 'error',
      showDenyButton: true,
      denyButtonText: 'No',
      confirmButtonText: 'Si',
      confirmButtonColor: '#000000',
    }).then(async (response) => {
      if (response.isConfirmed) {
        setIsLoading(true); // Activar pantalla de carga

        const querydb = getFirestore();
        const docuRef = doc(querydb, 'convenios', convenio.id);

        try {
          await updateDoc(docuRef, { activo: false });
          setReloading(true); // Activar pantalla de carga antes de recargar
          window.location.reload();
        } catch (error) {
          alert(error.message);
          setIsLoading(false); // Desactivar pantalla de carga en caso de error
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

      <FormControl component="fieldset">
        <RadioGroup
          row
          aria-label="activoFilter"
          name="activoFilter"
          value={activoFilter}
          onChange={(e) => setActivoFilter(e.target.value)}
        >
          <FormControlLabel value="activos" control={<Radio />} label="Activos" />
          <FormControlLabel value="inactivos" control={<Radio />} label="Finalizados" />
        </RadioGroup>
      </FormControl>

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

        <div className="centered-container" hidden={activoFilter !== 'activos'}>
          <Button
            variant="contained"
            onClick={goAñadirBenef}
            style={{ backgroundColor: '#890202', color: 'white', marginRight: '10px', marginBottom: '10px', fontSize: '14px', width: '200px', height: '40px' }}
          >
            Añadir Convenio
          </Button>

          <Button
            variant="contained"
            style={{ backgroundColor: '#890202', color: 'white', marginBottom: '10px', fontSize: '14px', width: '200px', height: '40px' }}
            onClick={exportToXLSX}
          >
            Exportar Tabla
          </Button>
        </div>
      </div>

      {isLoading && <p>Cargando...</p>}

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
              {filteredData
                .filter((convenio) => activoFilter === 'activos' ? convenio.activo : true)
                .map((convenio) => {
                  const fechaFin = new Date(convenio.fecha_final.seconds * 1000);

                  // Inactivar automáticamente si la fecha de fin es menor a la fecha actual
                  if (activoFilter === 'activos' && fechaFin < currentDate) {
                    eliminarConvenioFecha(convenio); // Inactivar convenio automáticamente
                  }

                  return (
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
                        {activoFilter === 'activos' ? (
                          <>
                            <Button variant="contained" onClick={() => handleVerBeneficiarios(convenio.id, convenio.nombre)} style={{ backgroundColor: '#7366bd', color: 'white' }}>
                              Beneficiarios
                            </Button>
                            <Button
                              variant="contained"
                              onClick={() => descargarPDF(convenio.id, convenio.nombre)}
                              style={{ backgroundColor: '#2196f3', color: 'white', margin: '5px', fontSize: '14px' }}
                            >
                              Certificado
                            </Button>
                            <Link to={`/editar-convenio/${institucionId}/${institucionN}/${convenio.id}`}>
                              <Button variant="contained" style={{ backgroundColor: '#4caf50', color: 'white', margin: '5px', fontSize: '14px' }}>
                                Editar
                              </Button>
                            </Link>
                            <Button variant="contained" onClick={() => eliminarConvenio(convenio)} style={{ backgroundColor: '#f44336', color: 'white', margin: '5px', fontSize: '14px' }}>
                              Finalizar
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="contained"
                              onClick={() => descargarPDF(convenio.id, convenio.nombre)}
                              style={{ backgroundColor: '#2196f3', color: 'white', margin: '5px', fontSize: '14px' }}
                            >
                              Certificado
                            </Button>
                            <Button variant="contained" onClick={() => activarConvenio(convenio)} style={{ backgroundColor: '#4caf50', color: 'white', margin: '5px', fontSize: '14px' }}>
                              Activar
                            </Button>
                            <Button variant="contained" onClick={() => eliminarRegistro(convenio)} style={{ backgroundColor: '#f44336', color: 'white', margin: '5px', fontSize: '14px' }}>
                              Eliminar
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default Convenios;
