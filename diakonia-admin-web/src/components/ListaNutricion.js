import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Cabecera from './Cabecera';
import '../estilos/ListaNutricion.css';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
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
import { Search } from '@mui/icons-material'; import { toBeInvalid } from '@testing-library/jest-dom/matchers';
import { differenceInYears, differenceInMonths } from 'date-fns';
import * as XLSX from 'xlsx';



const ListaBeneficiarios = ({ user }) => {
  const { institucionId, institucionN, convenioId, convenioN } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);
  const [activoFilter, setActivoFilter] = useState('activos');

  const filteredData = data
    .filter((beneficiario) => {
      const nombreMatches = beneficiario.nombre.toLowerCase().includes(searchTerm.toLowerCase());
      if (activoFilter === 'activos') {
        // Filtrar solo los beneficiarios activos
        return nombreMatches && beneficiario.activo;
      } else if (activoFilter === 'inactivos') {
        // Filtrar solo los beneficiarios inactivos
        return nombreMatches && !beneficiario.activo;
      }
    });

  const navigate = useNavigate();
  const goAñadirNutri = () => {
    navigate('añadirNutricion');
  };

  const convertirTimestampAFecha = (timestamp) => {
    const fecha = new Date(timestamp.seconds * 1000);
    if (isNaN(fecha)) {
      return "-";
    }
    return fecha.toLocaleDateString('es-ES');
  };

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return '-';
    const fechaNac = new Date(fechaNacimiento.seconds * 1000);
    const edad = differenceInYears(new Date(), fechaNac);
    return edad;
  };
  const calcularEdadEnMeses = (fechaNacimiento) => {
    if (!fechaNacimiento) return '-';
    const fechaNac = new Date(fechaNacimiento.seconds * 1000);
    const edadEnMeses = differenceInMonths(new Date(), fechaNac);
    return edadEnMeses;
  };


  /*const institucionSeleccionada = instituciones.find((inst) => inst.id === parseInt(institucionId, 10));
  const beneficiariosDeInstitucion = nutricion.filter(
    (nutricion) => nutricion.institucionId === institucionSeleccionada.id
  );*/


  useEffect(() => {
    const querydb = getFirestore();
    const beneficiariosCollection = collection(querydb, 'beneficiarios');
    const beneficiariosQuery = query(beneficiariosCollection, where('institucionId', '==', institucionId));

    getDocs(beneficiariosQuery).then((res) =>
      setData(res.docs.map((benf) => ({ id: benf.id, ...benf.data() })))
    );
  }, [institucionId]);

  function LeerUltimoValor(valor, fechas) {
    if (fechas.length > 0) {
      const fechaMayor = fechas.reduce((fechaMayorActual, fecha) => {
        const fechaActual = new Date(fecha.seconds * 1000);
        const fechaMayor = new Date(fechaMayorActual.seconds * 1000);

        if (fechaActual > fechaMayor) {
          fechaMayorActual = fecha;
        }

        return fechaMayorActual;
      });

      const indexFechaMayor = fechas.indexOf(fechaMayor);
      return valor[indexFechaMayor];
    } else {
      return "-";
    }
  }



  const handleModifyExcel = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.xlsx';
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];

      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const hoja = new Uint8Array(e.target.result);
          const workbook = XLSX.read(hoja, { type: 'array' });

          workbook.Props = {
            ...workbook.Props,
            language: 'es-ES' // Reemplaza 'es-ES' con el código de idioma correcto
          };

          // Modificar el workbook según tus necesidades
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          //const firstSheetData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

          const secondSheet = workbook.Sheets[workbook.SheetNames[1]];
          const thirdSheet = workbook.Sheets[workbook.SheetNames[2]];
          const fourthSheet = workbook.Sheets[workbook.SheetNames[3]];

          // Agregar los datos de data.Hgb en la columna "J", comenzando desde la fila 4
          data.forEach((value, index) => {
            const rowIndex = index + 3; // Offset de 3 para comenzar desde la fila 4

            const nameCellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: 0 }); // Columna "A" es el índice 0
            firstSheet[nameCellAddress] = { v: value.nombre };

            const SeguimientoCellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: 1 }); // Columna "A" es el índice 0
            firstSheet[SeguimientoCellAddress] = { v: convertirTimestampAFecha(LeerUltimoValor(value.fecha_seguimiento, value.fecha_seguimiento)) };

            const NacimientoCellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: 5 }); // Columna "A" es el índice 0
            firstSheet[NacimientoCellAddress] = { v: convertirTimestampAFecha(value.fecha_nacimiento) };

            const EdadCellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: 6 }); // Columna "A" es el índice 0
            firstSheet[EdadCellAddress] = { v: calcularEdad(value.fecha_nacimiento) };

            const hgbCellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: 9 }); // Columna "J" es el índice 9
            firstSheet[hgbCellAddress] = { v: LeerUltimoValor(value.hgb, value.fecha_seguimiento) };



            const nameCellAddress2 = XLSX.utils.encode_cell({ r: rowIndex, c: 8 }); // Columna "A" es el índice 0
            secondSheet[nameCellAddress2] = { v: value.nombre };

            const SeguimientoCellAddress2 = XLSX.utils.encode_cell({ r: rowIndex, c: 9 }); // Columna "A" es el índice 0
            secondSheet[SeguimientoCellAddress2] = { v: convertirTimestampAFecha(LeerUltimoValor(value.fecha_seguimiento, value.fecha_seguimiento)) };

            const EdadMesesCellAddress2 = XLSX.utils.encode_cell({ r: rowIndex, c: 10 }); // Columna "A" es el índice 0
            secondSheet[EdadMesesCellAddress2] = { v: calcularEdadEnMeses(value.fecha_nacimiento) };

            const SexoCellAddress2 = XLSX.utils.encode_cell({ r: rowIndex, c: 11 }); // Columna "A" es el índice 0
            secondSheet[SexoCellAddress2] = { v: value.genero };

            const PesoCellAddress2 = XLSX.utils.encode_cell({ r: rowIndex, c: 12 }); // Columna "J" es el índice 9
            secondSheet[PesoCellAddress2] = { v: LeerUltimoValor(value.pesos, value.fecha_seguimiento) };

            const TallaCellAddress2 = XLSX.utils.encode_cell({ r: rowIndex, c: 13 }); // Columna "J" es el índice 9
            secondSheet[TallaCellAddress2] = { v: LeerUltimoValor(value.talla, value.fecha_seguimiento) };



            const nameCellAddress3 = XLSX.utils.encode_cell({ r: rowIndex, c: 8 }); // Columna "A" es el índice 0
            thirdSheet[nameCellAddress3] = { v: value.nombre };

            const SeguimientoCellAddress3 = XLSX.utils.encode_cell({ r: rowIndex, c: 9 }); // Columna "A" es el índice 0
            thirdSheet[SeguimientoCellAddress3] = { v: convertirTimestampAFecha(LeerUltimoValor(value.fecha_seguimiento, value.fecha_seguimiento)) };

            const EdadMesesCellAddress3 = XLSX.utils.encode_cell({ r: rowIndex, c: 10 }); // Columna "A" es el índice 0
            thirdSheet[EdadMesesCellAddress3] = { v: calcularEdadEnMeses(value.fecha_nacimiento) };

            const SexoCellAddress3 = XLSX.utils.encode_cell({ r: rowIndex, c: 11 }); // Columna "A" es el índice 0
            thirdSheet[SexoCellAddress3] = { v: value.genero };

            const PesoCellAddress3 = XLSX.utils.encode_cell({ r: rowIndex, c: 12 }); // Columna "J" es el índice 9
            thirdSheet[PesoCellAddress3] = { v: LeerUltimoValor(value.pesos, value.fecha_seguimiento) };

            const TallaCellAddress3 = XLSX.utils.encode_cell({ r: rowIndex, c: 13 }); // Columna "J" es el índice 9
            thirdSheet[TallaCellAddress3] = { v: LeerUltimoValor(value.talla, value.fecha_seguimiento) };



            const nameCellAddress4 = XLSX.utils.encode_cell({ r: rowIndex, c: 8 }); // Columna "A" es el índice 0
            fourthSheet[nameCellAddress4] = { v: value.nombre };

            const SeguimientoCellAddress4 = XLSX.utils.encode_cell({ r: rowIndex, c: 9 }); // Columna "A" es el índice 0
            fourthSheet[SeguimientoCellAddress4] = { v: convertirTimestampAFecha(LeerUltimoValor(value.fecha_seguimiento, value.fecha_seguimiento)) };

            const EdadMesesCellAddress4 = XLSX.utils.encode_cell({ r: rowIndex, c: 10 }); // Columna "A" es el índice 0
            fourthSheet[EdadMesesCellAddress4] = { v: calcularEdadEnMeses(value.fecha_nacimiento) };

            const SexoCellAddress4 = XLSX.utils.encode_cell({ r: rowIndex, c: 11 }); // Columna "A" es el índice 0
            fourthSheet[SexoCellAddress4] = { v: value.genero };

            const PesoCellAddress4 = XLSX.utils.encode_cell({ r: rowIndex, c: 12 }); // Columna "J" es el índice 9
            fourthSheet[PesoCellAddress4] = { v: LeerUltimoValor(value.pesos, value.fecha_seguimiento) };

            const TallaCellAddress4 = XLSX.utils.encode_cell({ r: rowIndex, c: 13 }); // Columna "J" es el índice 9
            fourthSheet[TallaCellAddress4] = { v: LeerUltimoValor(value.talla, value.fecha_seguimiento) };

          });

          // Actualizar la hoja de cálculo con los nuevos datos
          //XLSX.utils.sheet_add_json(firstSheet, firstSheetData, { header: 1, skipHeader: true });

          // Guardar el workbook modificado
          XLSX.writeFile(workbook, 'modified_lista_beneficiarios.xlsx');
        };
        reader.readAsArrayBuffer(file);
      }
    });

    fileInput.click();
  };

  return (
    <div className="centered-container">
      <Cabecera user={user} />
      <h1>Lista de Nutrición de {institucionN}</h1>
      <h3>Convenio: {convenioN}</h3>

      <FormControl component="fieldset">
        <RadioGroup
          row
          aria-label="activoFilter"
          name="activoFilter"
          value={activoFilter}
          onChange={(e) => setActivoFilter(e.target.value)}
        >
          <FormControlLabel value="activos" control={<Radio />} label="Activos" />
          <FormControlLabel value="inactivos" control={<Radio />} label="No Activos" />
        </RadioGroup>
      </FormControl>

      <div className="button-container" disabled={true}>
        <Button
          id="buttonABeneficiarios"
          className="custom-button"
          onClick={goAñadirNutri}
          variant="contained"
          style={{ backgroundColor: '#890202', color: 'white', marginBottom: '10px' }}
        >
          Añadir Seguimiento
        </Button>

        <Button
          className="custom-button"
          onClick={handleModifyExcel}
          variant="contained"
          style={{ backgroundColor: '#890202', color: 'white', marginBottom: '10px' }}
        >
          Modificar Excel
        </Button>
      </div>

      <div className="search-export-container">
        <div className="search-container-nutricion">
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Nombre</TableCell>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Edad</TableCell>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Último Peso(kg)</TableCell>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Última Talla(cm)</TableCell>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Último HGB(mg/dL)</TableCell>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Última revisión</TableCell>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((beneficiario) => (
              <TableRow key={beneficiario.id}>
                <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>{beneficiario.nombre}</TableCell>
                <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>{calcularEdad(beneficiario.fecha_nacimiento)}</TableCell>
                <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>{LeerUltimoValor(beneficiario.pesos, beneficiario.fecha_seguimiento)}</TableCell>
                <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>{LeerUltimoValor(beneficiario.talla, beneficiario.fecha_seguimiento)}</TableCell>
                <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>{LeerUltimoValor(beneficiario.hgb, beneficiario.fecha_seguimiento)}</TableCell>
                <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>{convertirTimestampAFecha(LeerUltimoValor(beneficiario.fecha_seguimiento, beneficiario.fecha_seguimiento))}</TableCell>
                <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>
                  <Link to={`/verGrafica/${institucionId}/${institucionN}/${convenioId}/${convenioN}/${beneficiario.id}`}>
                    <Button variant="contained" style={{ backgroundColor: '#4caf50', color: 'white' }}>
                      Ver gráfica
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ListaBeneficiarios;
