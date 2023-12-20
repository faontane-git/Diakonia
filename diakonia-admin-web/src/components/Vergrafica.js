import React, { useState, useEffect } from 'react';
import Cabecera from './Cabecera';
import LinesChart from './Linechart';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, collection, getDoc } from 'firebase/firestore';
import '../estilos/Vergrafica.css';

const VerGrafica = ({ nutricion }) => {
  const { beneficiarioid } = useParams();
  const [data, setData] = useState({});

  useEffect(() => {
    async function extraer() {
      const querydb = getFirestore();
      const docuRef = collection(querydb, `beneficiarios`);
      const docuCifrada = doc(docuRef, beneficiarioid);
      const documento = await getDoc(docuCifrada);
      setData(documento.data());
    }
    extraer();
  }, []);

  return (
    <div className="centered-container">
      <Cabecera />
      <h1>Nutricion gráfica de {data.nombre}</h1>
      <div id="graficas" style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ width: '50%', height: '50%' }}>
          <LinesChart
            fechas={data.fecha_seguimiento}
            datos={data.pesos}
            dato="Peso"
          />
        </div>

        <div style={{ width: '50%', height: '50%' }}>
          <LinesChart
            fechas={data.fecha_seguimiento}
            datos={data.talla}
            dato="Talla"
          />
        </div>

        <div style={{ width: '50%', height: '50%' }}>
          <LinesChart
            fechas={data.fecha_seguimiento}
            datos={data.hgb}
            dato="HGB"
          />
        </div>
      </div>



      <table className="table">
        <thead>
          <tr>
            <th>Fechas</th>
            <th>Peso(KG)</th>
            <th>Talla(M)</th>
            <th>HGB(g/dL)</th>
          </tr>
        </thead>
        <tbody>
          {data.fecha_seguimiento?.map((mes, index) => (
            <tr key={index}>
              <td>{mes}</td>
              <td>{data.pesos[index]}</td>
              <td>{data.talla[index]}</td>
              <td>{data.hgb[index]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VerGrafica;
