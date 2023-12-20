import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Cabecera from './Cabecera';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../estilos/ListaBeneficiarios.css';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const ListaBeneficiarios = ({ instituciones, beneficiarios }) => {
  const { institucionId, institucionN } = useParams();
  const navigate = useNavigate();
  const goAñadirBenef = () => {
    navigate('añadirBenef');
  };

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const querydb = getFirestore();
    const beneficiariosCollection = collection(querydb, 'beneficiarios');
    const beneficiariosQuery = query(beneficiariosCollection, where('institucionId', '==', institucionId));

    getDocs(beneficiariosQuery).then((res) =>
      setData(res.docs.map((benf) => ({ id: benf.id, ...benf.data() })))
    );
  }, [institucionId]);

  const filteredData = data.filter((beneficiario) =>
    beneficiario.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="centered-container">
      <Cabecera />
      <h1>Lista de Beneficiarios de {institucionN}</h1>
      <button id="buttonABeneficiarios" onClick={goAñadirBenef}>
        Añadir Beneficiarios
      </button>

      <div className="search-container-name">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cédula</th>
            <th>Fecha de nacimiento</th>
            <th>Género</th>
            <th>Número de personas menores en el hogar</th>
            <th>Número de personas mayores en el hogar</th>
            <th>Desayuno</th>
            <th>Almuerzo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((beneficiario) => (
            <tr key={beneficiario.id}>
              <td>{beneficiario.nombre}</td>
              <td>{beneficiario.cedula}</td>
              <td>{beneficiario.fecha_nacimiento}</td>
              <td>{beneficiario.genero}</td>
              <td>{beneficiario.numero_de_personas_menores_en_el_hogar}</td>
              <td>{beneficiario.numero_de_personas_mayores_en_el_hogar}</td>
              {beneficiario.desayuno.length !== 0 ? <td>Si</td> : <td>No</td>}
              {beneficiario.almuerzo.length !== 0 ? <td>Si</td> : <td>No</td>}
              <td>
                <Link to={`/editar-beneficiario/${institucionId}/${beneficiario.id}`}>
                  <button>Editar</button>
                </Link>
                
                <Link to={`/editar-beneficiario/${institucionId}/${beneficiario.id}`}>
                  <button>Eliminar</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaBeneficiarios;
