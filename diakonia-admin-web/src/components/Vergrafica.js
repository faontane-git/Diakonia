import React, { useState, useEffect } from 'react';
import Cabecera from './Cabecera';
import LinesChart from './Linechart';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, collection, getDoc } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import '../estilos/Vergrafica.css';

const VerGrafica = ({ user }) => {
  const { beneficiarioid } = useParams();
  const [data, setData] = useState({});
  const [stringFechas, setStringFechas] = useState([]);

  const convertirTimestampAFecha = (timestamp) => {
    const fecha = new Date(timestamp.seconds * 1000);
    if(isNaN(fecha)){
      return "-";
    }
    return fecha.toLocaleDateString('es-ES');
  };

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

  const exportToXLSX = () => {
    const wsData = data.fecha_seguimiento.map((mes, index) => ({
      Fechas: mes,
      'Peso(KG)': data.pesos[index],
      'Talla(M)': data.talla[index],
      'HGB(g/dL)': data.hgb[index],
    }));

    // Agrega el nombre del beneficiario en la primera celda
    wsData.unshift({ Beneficiario: data.nombre });

    const ws = XLSX.utils.json_to_sheet(wsData);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DatosNutricionales');

    // Incluye el nombre del beneficiario en el nombre del archivo
    const fileName = `datos_nutricionales_${data.nombre}.xlsx`;

    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="centered-container">
      <Cabecera user={user} />
      <h1>Nutricion gráfica de {data.nombre}</h1>
      

      <div id="graficas" style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ width: '50%', height: '50%' }}>
          <LinesChart
            fechas={data.fecha_seguimiento?.map((timestamp) => convertirTimestampAFecha(timestamp))}
            datos={data.pesos}
            dato="Peso"
          />
        </div>

        <div style={{ width: '50%', height: '50%' }}>
          <LinesChart
            fechas={data.fecha_seguimiento?.map((timestamp) => convertirTimestampAFecha(timestamp))}
            datos={data.talla}
            dato="Talla"
          />
        </div>

        <div style={{ width: '50%', height: '50%' }}>
          <LinesChart
            fechas={data.fecha_seguimiento?.map((timestamp) => convertirTimestampAFecha(timestamp))}
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
              <td>{convertirTimestampAFecha(mes)}</td>
              <td>{data.pesos[index]}</td>
              <td>{data.talla[index]}</td>
              <td>{data.hgb[index]}</td>
             b</tr>
          ))}
        </tbody>
      </table>

      <div id="export-button-container">
        <button onClick={exportToXLSX}>Exportar a Excel</button>
      </div>

    </div>
  );
};

export default VerGrafica;
