import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Cabecera from './Cabecera';
import '../estilos/ListaNutricion.css';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';


const ListaBeneficiarios = ({ instituciones, nutricion }) => {
  const { institucionId, institucionN } = useParams();

  const navigate = useNavigate();
  const goAñadirNutri = () => {
    navigate('añadirNutricion');
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

  function LeerUltimoValor(valor){
    for (let i = valor.length - 1; i >= 0; i--) {
      if(valor[i]!=="-"){return valor[i]}
    }
    return "-";

  };

  return (
    <div className="centered-container">
      <Cabecera />
      <h1>Lista de Nutricion de {institucionN}</h1>
      <button id="buttonABeneficiarios" onClick={goAñadirNutri}>
        Añadir Seguimiento
      </button>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Ultimo Peso</th>
            <th>Ultima Talla</th>
            <th>Ultimo HGB</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((beneficiario) => (
            <tr key={beneficiario.id}>
              <td>{beneficiario.nombre}</td>
              <td>{LeerUltimoValor(beneficiario.pesos)}</td>
              <td>{LeerUltimoValor(beneficiario.talla)}</td>
              <td>{LeerUltimoValor(beneficiario.hgb)}</td>
              <td>
                <Link to={`/verGrafica/${institucionId}/${beneficiario.id}`}>
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
