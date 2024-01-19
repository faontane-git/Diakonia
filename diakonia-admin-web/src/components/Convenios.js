import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getFirestore, doc, updateDoc, query, collection, where, getDocs, setDoc, getDoc, addDoc, deleteDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { useAuthContext } from './AuthContext';
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
  const { user } = useAuthContext();
  const { institucionId, institucionN } = useParams();
  const [activoFilter, setActivoFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reloading, setReloading] = useState(false);
  const [institucionActiva, setInstitucionActiva] = useState(true);

  const goAñadirBenef = () => {
    navigate('añadirConvenio');
  };

  const goBack = () => {
    navigate('/verInstitucion');
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


  useEffect(() => {
    const checkInstitucionActiva = async () => {
      try {
        const querydb = getFirestore();
        const institucionDocRef = doc(querydb, 'instituciones', institucionId); // Ajusta el nombre de tu colección
        const institucionDocSnapshot = await getDoc(institucionDocRef);

        if (institucionDocSnapshot.exists()) {
          const institucionData = institucionDocSnapshot.data();
          setInstitucionActiva(institucionData.activo);
          if (institucionData.activo) {
            setActivoFilter("activos");
          } else {
            setActivoFilter("inactivos");
          }
        }
      } catch (error) {
        console.error('Error al verificar el estado de la institución:', error);
        // Mostrar mensaje de error o manejar el error
      }
    };

    checkInstitucionActiva();
  }, [institucionId])


  const currentDate = new Date();

  const filteredData = data.filter((convenio) =>
    convenio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (activoFilter === 'activos' ? convenio.activo === true : convenio.activo !== true)
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
      .map(({ nombre, direccion, desayuno, almuerzo, observacion, fecha_inicial, fecha_final }) => ({
        Nombre: nombre,
        Dirección: direccion,
        Servicios: `${desayuno ? 'Desayuno ' : ''}${almuerzo ? 'Almuerzo' : ''}`,
        Observaciones: observacion,
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
      updateDoc(docuRef, { observacion: "¡Convenio Finalizado!", activo: false });

      // Guardar información en el histórico
      const historicoDatos = {
        usuario: "Diakonía WEB",  // Reemplaza con el nombre del usuario real
        correo: "Diakonía WEB",  // Reemplaza con el nombre del usuario real
        accion: 'Convenio Finalizado: ' + convenio.nombre + " Institución: " + institucionN,  // Mensaje personalizado
        fecha: new Date().toLocaleDateString(),
        hora: new Date().toLocaleTimeString(),  // Hora actual
      };
      const firestore = getFirestore();
      const hitoricoCollection = collection(firestore, 'historico');
      addDoc(hitoricoCollection, historicoDatos);

      const conveniosQuery = query(collection(querydb, 'beneficiarios'), where('convenioId', '==', convenio.id));
      const conveniosSnapshot = await getDocs(conveniosQuery);

      // Use Promise.all to wait for all beneficiary updates to complete
      await Promise.all(conveniosSnapshot.docs.map(async (beneficiarioDoc) => {
        const convenioRef = doc(querydb, 'beneficiarios', beneficiarioDoc.id);
        await updateDoc(convenioRef, { observacion: '¡Convenio Finalizado!', activo: false });
      }));

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
          // Guardar información en el histórico
          const historicoDatos = {
            usuario: user.nombre,  // Reemplaza con el nombre del usuario real
            correo: user.email,  // Reemplaza con el nombre del usuario real
            accion: 'Convenio Eliminado: ' + convenio.nombre + ' Institución: ' + institucionN,  // Mensaje personalizado
            fecha: new Date().toLocaleDateString(),
            hora: new Date().toLocaleTimeString(),  // Hora actual
          };
          const firestore = getFirestore();
          const hitoricoCollection = collection(firestore, 'historico');
          addDoc(hitoricoCollection, historicoDatos);

          const querydb = getFirestore();
          const docuRef = doc(querydb, 'convenios', convenio.id);
          try {
            const conveniosQuery = query(collection(querydb, 'beneficiarios'), where('convenioId', '==', convenio.id));
            const conveniosSnapshot = await getDocs(conveniosQuery);
            // ELIMINAR cada beneficiario asociado
            conveniosSnapshot.forEach(async (beneficiarioDoc) => {
              const convenioRef = doc(querydb, 'beneficiarios', beneficiarioDoc.id);
              await deleteDoc(convenioRef);
            });
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
            // Guardar información en el histórico
            const historicoDatos = {
              usuario: user.nombre,  // Reemplaza con el nombre del usuario real
              correo: user.email,  // Reemplaza con el nombre del usuario real
              accion: 'Convenio Activado: ' + convenio.nombre + ' Institución: ' + institucionN,  // Mensaje personalizado
              fecha: new Date().toLocaleDateString(),
              hora: new Date().toLocaleTimeString(),  // Hora actual
            };
            const firestore = getFirestore();
            const hitoricoCollection = collection(firestore, 'historico');
            addDoc(hitoricoCollection, historicoDatos);
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
    const confirmResult = await Swal.fire({
      title: 'Advertencia',
      text: `¿Está seguro que desea finalizar el convenio ${convenio.nombre}?`,
      icon: 'error',
      showDenyButton: true,
      denyButtonText: 'No',
      confirmButtonText: 'Si',
      confirmButtonColor: '#000000',
      cancelButtonText: 'Cancelar',
      input: 'text',
      inputPlaceholder: 'Agrega una observación',
    });

    if (confirmResult.isConfirmed) {
      const observacion = confirmResult.value;
      setIsLoading(true); // Activar pantalla de carga

      const querydb = getFirestore();
      const docuRef = doc(querydb, 'convenios', convenio.id);

      try {
        await updateDoc(docuRef, { observacion: observacion, activo: false });
        // Guardar información en el histórico
        const historicoDatos = {
          usuario: user.nombre,  // Reemplaza con el nombre del usuario real
          correo: user.email,  // Reemplaza con el nombre del usuario real
          accion: 'Convenio Finalizado: ' + convenio.nombre + " Institución: " + institucionN,  // Mensaje personalizado
          fecha: new Date().toLocaleDateString(),
          hora: new Date().toLocaleTimeString(),  // Hora actual
        };
        const firestore = getFirestore();
        const hitoricoCollection = collection(firestore, 'historico');
        addDoc(hitoricoCollection, historicoDatos);

        const conveniosQuery = query(collection(querydb, 'beneficiarios'), where('convenioId', '==', convenio.id));
        const conveniosSnapshot = await getDocs(conveniosQuery);

        // Use Promise.all to wait for all beneficiary updates to complete
        await Promise.all(conveniosSnapshot.docs.map(async (beneficiarioDoc) => {
          const convenioRef = doc(querydb, 'beneficiarios', beneficiarioDoc.id);
          await updateDoc(convenioRef, { observacion: '¡Institución Inactivada!', activo: false });
        }));

        // Set reloading after all updates are completed
        setReloading(true);
        window.location.reload();
      } catch (error) {
        alert(error.message);
        setIsLoading(false); // Desactivar pantalla de carga en caso de error
      }
    }
    // Don't reload here, as it might interrupt the async operations
    // window.location.reload();
  }

  return (
    <div className="centered-container">
      <Cabecera />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div id='volver'>
          <Button variant="contained" style={{ marginLeft: '60%', backgroundColor: '#890202', color: 'white' }} onClick={goBack}>
            Volver
          </Button>
        </div>

        <div id='titulo' style={{ marginLeft: '25em' }}>
          <h1>Lista de convenios de {institucionN}</h1>
        </div>
      </div>

      <h3>Estado: {institucionActiva ? 'Activo' : 'Inactivo'}</h3>

      <FormControl component="fieldset">
        {(institucionActiva) && (
          <>
            <RadioGroup
              row
              aria-label="activoFilter"
              name="activoFilter"
              value={activoFilter}
              onChange={(e) => setActivoFilter(e.target.value)}
            >
              <FormControlLabel value="activos" control={<Radio />} label="Activos" />
              <FormControlLabel value="inactivos" control={<Radio />} label="Inactivos" />
            </RadioGroup>
          </>
        )}
        {(institucionActiva) == false && (
          <>
            <RadioGroup
              row
              aria-label="activoFilter"
              name="activoFilter"
              value={activoFilter}
              onChange={(e) => setActivoFilter(e.target.value)}
            >
              <FormControlLabel value="inactivos" control={<Radio />} label="Inactivos" />
            </RadioGroup>
          </>
        )}

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

        <div className="centered-container">
          {activoFilter === 'activos' && (
            <Button
              variant="contained"
              onClick={goAñadirBenef}
              style={{ backgroundColor: '#890202', color: 'white', marginRight: '10px', marginBottom: '10px', fontSize: '14px', width: '200px', height: '40px' }}
            >
              Añadir Convenio
            </Button>
          )}
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
                {activoFilter !== 'activos' && (
                  <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }} align="center">Observaciones</TableCell>
                )}
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
                      {activoFilter !== 'activos' && (
                        <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }} align="center">{convenio.observacion}</TableCell>
                      )}
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
                            {institucionActiva && (
                              <Button variant="contained" onClick={() => activarConvenio(convenio)} style={{ backgroundColor: '#4caf50', color: 'white', margin: '5px', fontSize: '14px' }}>
                                Activar
                              </Button>
                            )}
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
