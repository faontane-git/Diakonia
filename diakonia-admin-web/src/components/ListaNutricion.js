import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Cabecera from './Cabecera';
import '../estilos/ListaNutricion.css';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { toBeInvalid } from '@testing-library/jest-dom/matchers';
import { differenceInYears } from 'date-fns';


const ListaBeneficiarios = ({ user }) => {
  const { institucionId, institucionN, convenioId, convenioN } = useParams();

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
  /*const institucionSeleccionada = instituciones.find((inst) => inst.id === parseInt(institucionId, 10));
  const beneficiariosDeInstitucion = nutricion.filter(
    (nutricion) => nutricion.institucionId === institucionSeleccionada.id
  );*/

  const [data, setData] = useState([]);

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
        const fechaActual = new Date(fecha);
        const fechaMayor = new Date(fechaMayorActual);

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

  return (
    <div className="centered-container">
      <Cabecera user={user} />
      <h1>Lista de Nutrición de {institucionN}</h1>
      <Button id="buttonABeneficiarios" style={{ backgroundColor: '#890202', color: 'white' }} onClick={goAñadirNutri} variant="contained">
        Añadir Seguimiento
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Nombre</TableCell>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Edad</TableCell>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Último Peso(KG)</TableCell>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Última Talla(M)</TableCell>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Último HGB(g/dL)</TableCell>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Última revisión</TableCell>
              <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((beneficiario) => (
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
