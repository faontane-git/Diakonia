import React, { useState, useEffect } from 'react';
import { Await, useParams } from 'react-router-dom';
import Cabecera from './Cabecera';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../estilos/ListaBeneficiarios.css';
import { getFirestore, collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

const BeneficiariosConvenios = () => {
  const { institucionId, institucionN } = useParams();
  const navigate = useNavigate();
  const goBack = () => {
    navigate('/beneficiarios');
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

  
  function esActivo(convenio) {
    console.log(convenio.activo)
    return convenio.activo === true;
  }


  return (
    <div className="centered-container">
      <Cabecera />
      <h1>Beneficiarios</h1>
      <h2>Seleccione un Convenio de {institucionN}</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar institución"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="list-container">
        <ul id="listaInstituciones">
          {filteredData.length > 0 ? (
            filteredData.map((convenio) => (
              <li key={convenio.id}>
                <Link to={`/beneficiarios/${institucionId}/${institucionN}/${convenio.id}/${convenio.nombre}`} className="centered-link">
                  {convenio.nombre}- Rango de Fecha: {convertirTimestampAFecha(convenio.fecha_inicial)} - {convertirTimestampAFecha(convenio.fecha_final)}
                </Link>
              </li>
            ))
          ) : (
            <li id="especial">¡No hay convenios disponibles!</li>
          )}
        </ul>
      </div>
    </div>
  );
};


export default BeneficiariosConvenios;
