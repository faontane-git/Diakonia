import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Cabecera from './Cabecera';
import '../estilos/ListaNutricion.css';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { toBeInvalid } from '@testing-library/jest-dom/matchers';


const ListaBeneficiarios = ({ user }) => {
  const { institucionId, institucionN, convenioId, convenioN } = useParams();

  const navigate = useNavigate();
  const goAñadirNutri = () => {
    navigate('añadirNutricion');
  };


  const convertirTimestampAFecha = (timestamp) => {
    const fecha = new Date(timestamp.seconds * 1000);
    if(isNaN(fecha)){
      return "-";
    }
    return fecha.toLocaleDateString('es-ES');
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
    console.log("entra")
    getDocs(beneficiariosQuery).then((res) =>
      setData(res.docs.map((benf) => ({ id: benf.id, ...benf.data() })))
    );
  }, [institucionId]);

  function LeerUltimoValor(valor,fechas){

if(fechas.length>0){
  
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
}else{return "-"}}


  return (
    <div className="centered-container">
      <Cabecera user={user}/>
      <h1>Lista de Nutrición de {institucionN}</h1>
      <button id="buttonABeneficiarios" onClick={goAñadirNutri}>
        Añadir Seguimiento
      </button>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Último Peso(KG)</th>
            <th>Última Talla(M)</th>
            <th>Último HGB(g/dL)</th>
            <th>Última revisión</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((beneficiario) => (
            <tr key={beneficiario.id}>
              <td>{beneficiario.nombre}</td>
              <td>{LeerUltimoValor(beneficiario.pesos,beneficiario.fecha_seguimiento)}</td>
              <td>{LeerUltimoValor(beneficiario.talla,beneficiario.fecha_seguimiento)}</td>
              <td>{LeerUltimoValor(beneficiario.hgb,beneficiario.fecha_seguimiento)}</td>
              <td>{convertirTimestampAFecha(LeerUltimoValor(beneficiario.fecha_seguimiento,beneficiario.fecha_seguimiento))}</td>
              <td>
                <Link to={`/verGrafica/${institucionId}/${institucionN}/${convenioId}/${convenioN}/${beneficiario.id}`}>
                  <button>Ver gráfica</button>
                </Link>
                {/* Agrega más botones según sea necesario */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaBeneficiarios;
