import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  FormLabel,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { getFirestore, doc, updateDoc, query, collection, where, getDocs, getDoc, addDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import '../estilos/ListaInstituciones.css';
import { useAuthContext } from './AuthContext'; // Ruta real a tu AuthContext


const ListaInstituciones = ({ instituciones }) => {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const goConvenios = (institucion) => {
    navigate(`/instituciones/${institucion.id}/${institucion.nombre}`);
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [activoFilter, setActivoFilter] = useState('activos');

  const filteredInstituciones = instituciones
    .filter((institucion) =>
      institucion.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((institucion) =>
      activoFilter === 'activos' ? institucion.activo === true : institucion.activo === false
    );

  function esActivo(institucion) {
    return institucion.activo === true;
  }


  async function eliminarInstitucion(institucion) {
    const confirmResult = await Swal.fire({
      title: 'Advertencia',
      text: `¿Está seguro que desea inactivar ${institucion.nombre}?`,
      icon: 'error',
      showDenyButton: true,
      denyButtonText: 'No',
      confirmButtonText: 'Sí',
      confirmButtonColor: '#000000',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      input: 'text',
      inputPlaceholder: 'Agrega una observación',
    });
    if (confirmResult.isConfirmed) {
      const querydb = getFirestore();
      const docuRef = doc(querydb, 'instituciones', institucion.id);
      const observacion = confirmResult.value;
      try {

        // Inactivar la institución
        await updateDoc(docuRef, { observacion: observacion, activo: false });

        // Obtener los convenios asociados a la institución
        const conveniosQuery = query(collection(querydb, 'convenios'), where('institucionId', '==', institucion.id));
        const conveniosSnapshot = await getDocs(conveniosQuery);

        // Inactivar cada convenio asociado
        await Promise.all(conveniosSnapshot.docs.map(async (convenioDoc) => {
          const convenioRef = doc(querydb, 'convenios', convenioDoc.id);

          // Obtener datos del convenio
          const convenioSnap = await getDoc(convenioRef);
          const convenioData = convenioSnap.data();
          const nombreConvenio = convenioData.nombre; // Asegúrate de que el campo 'nombre' exista en tu documento de convenio

          // Guardar información en el histórico
          const historicoDatos = {
            usuario: user.nombre,
            correo: user.email,
            accion: `Convenio Inactivado: ${nombreConvenio} Institución: ${institucion.nombre}`,  // Mensaje personalizado
            fecha: new Date().toLocaleDateString(),
            hora: new Date().toLocaleTimeString(),
          };
          const firestore = getFirestore();
          const historicoCollection = collection(firestore, 'historico');
          await addDoc(historicoCollection, historicoDatos);

          await updateDoc(convenioRef, { observacion: "¡Institución Inactivada!", activo: false });

          const conveniosQuery = query(collection(querydb, 'beneficiarios'), where('convenioId', '==', convenioDoc.id));
          const conveniosSnapshot = await getDocs(conveniosQuery);

          // Use Promise.all to wait for all beneficiary updates to complete
          await Promise.all(conveniosSnapshot.docs.map(async (beneficiarioDoc) => {
            const convenioRef = doc(querydb, 'beneficiarios', beneficiarioDoc.id);
            await updateDoc(convenioRef, { observacion: '¡Institución Inactivada!', activo: false });
          }));
        }));

        // Guardar información en el histórico
        const historicoDatos = {
          usuario: user.nombre,  // Reemplaza con el nombre del usuario real
          correo: user.email,  // Reemplaza con el nombre del usuario real
          accion: 'Institución Inactivada: ' + institucion.nombre,  // Mensaje personalizado
          fecha: new Date().toLocaleDateString(),
          hora: new Date().toLocaleTimeString(),  // Hora actual
        };
        const firestore = getFirestore();
        const hitoricoCollection = collection(firestore, 'historico');
        addDoc(hitoricoCollection, historicoDatos);

      } catch (error) {
        console.error('Error al inactivar institución, convenios y beneficiarios:', error);
        alert(error.message);
      }
    }
    window.location.reload();
  }

  async function activarInstitucion(institucion) {
    Swal.fire({
      title: 'Advertencia',
      text: `¿Está seguro que desea activar ${institucion.nombre}?`,
      icon: 'warning',
      showDenyButton: true,
      showCancelButton: true,
      denyButtonText: 'No',
      confirmButtonText: 'Sí',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const querydb = getFirestore();
        const docuRef = doc(querydb, 'instituciones', institucion.id);
        try {
          await updateDoc(docuRef, { activo: true });
          Swal.fire('Activado', `${institucion.nombre} ha sido activado.`, 'success');
          // Guardar información en el histórico
          const historicoDatos = {
            usuario: user.nombre,  // Reemplaza con el nombre del usuario real
            correo: user.email,  // Reemplaza con el nombre del usuario real
            accion: 'Institución Activada: ' + institucion.nombre,  // Mensaje personalizado
            fecha: new Date().toLocaleDateString(),
            hora: new Date().toLocaleTimeString(),  // Hora actual
          };
          const firestore = getFirestore();
          const hitoricoCollection = collection(firestore, 'historico');
          addDoc(hitoricoCollection, historicoDatos);
          window.location.reload();
        } catch (error) {
          console.error('Error al activar institución:', error);
          Swal.fire('Error', `Hubo un error al activar la institución: ${error.message}`, 'error');
        }
      }
    });
  }

  const goRegistrar = () => {
    navigate('/registrar');
  }

  const exportToXLSX = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredInstituciones
        .filter(esActivo)
        .map(({ nombre, telefono, direccion, desayuno, almuerzo, fecha_inicial, fecha_final }) => ({
          Nombre: nombre,
          Teléfono: telefono,
          Ubicación: direccion,
          Servicios: `${desayuno ? 'Desayuno ' : ''}${almuerzo ? 'Almuerzo' : ''}`,
          'Fecha Inicio': fecha_inicial,
          'Fecha Final': fecha_final,
        }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Instituciones');
    XLSX.writeFile(wb, 'instituciones.xlsx');
  };

  return (
    <div className="beneficiarios-container">
      <div className="centered-container">
        <h1 style={{ fontSize: '24px' }}>Lista de Instituciones</h1>

        <FormControl component="fieldset" style={{ margin: '10px 0' }}>
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
            <Button className="button-exportar" onClick={goRegistrar} style={{ backgroundColor: '#890202', color: 'white', marginRight: '10px', marginBottom: '10px', fontSize: '14px', width: '200px', height: '40px' }}>
              Crear Institución
            </Button>
            <Button className="button-exportar" onClick={exportToXLSX} style={{ backgroundColor: '#890202', color: 'white', marginBottom: '10px', fontSize: '14px', width: '150px', height: '40px' }}>
              Exportar Tabla
            </Button>
          </div>
        </div>

      </div>

      <div id='tabla'>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }} align="center">Institución</TableCell>
                <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }} align="center">Teléfono</TableCell>
                <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }} align="center">RUC</TableCell>
                {activoFilter !== 'activos' && (
                  <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Observaciones</TableCell>
                )}
                <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }} align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInstituciones.map((institucion, index) => (
                <TableRow key={index}>
                  <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }} align="center">{institucion.nombre}</TableCell>
                  <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }} align="center">{institucion.telefono}</TableCell>
                  <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }} align="center">{institucion.ruc}</TableCell>
                  {activoFilter !== 'activos' && (
                    <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }} align="center">{institucion.observacion}</TableCell>
                  )}
                  <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }} align="center">
                    {activoFilter === 'activos' && (
                      <>
                        <Button onClick={() => goConvenios(institucion)} variant="contained" style={{ backgroundColor: '#4cb8c4', color: 'white', margin: '5px', fontSize: '14px' }}>
                          Convenios
                        </Button>
                        <Link to={`/editar-institucion/${institucion.id}`}>
                          <Button variant="contained" style={{ backgroundColor: '#4caf50', color: 'white', margin: '5px', fontSize: '14px' }}>
                            Editar
                          </Button>
                        </Link>
                        <Button onClick={() => eliminarInstitucion(institucion)} variant="contained" style={{ backgroundColor: '#f44336', color: 'white', margin: '5px', fontSize: '14px' }}>
                          Inactivar
                        </Button>
                      </>
                    )}
                    {activoFilter === 'inactivos' && (
                      <>
                        <Button onClick={() => goConvenios(institucion)} variant="contained" style={{ backgroundColor: '#4cb8c4', color: 'white', margin: '5px', fontSize: '14px' }}>
                          Convenios
                        </Button>
                        <Button onClick={() => activarInstitucion(institucion)} variant="contained" style={{ backgroundColor: '#4caf50', color: 'white', margin: '5px', fontSize: '14px' }}>
                          Activar
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>


    </div>
  );
};

export default ListaInstituciones;
