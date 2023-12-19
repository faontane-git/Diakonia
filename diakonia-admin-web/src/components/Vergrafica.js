import React from 'react';
import Cabecera from './Cabecera';
import LinesChart from './Linechart';
import { useParams } from 'react-router-dom';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import '../estilos/Vergrafica.css';

const VerGrafica = ({ nutricion }) => {
  const { beneficiarioid } = useParams();
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const data = [20, 25, 60, 65, 45, 10, 0, 25, 35, 7, 20, 25];
  const beneficiarioSeleccionado = nutricion.find((benf) => benf.id === parseInt(beneficiarioid, 10));

  return (
    <div className="centered-container">
      <Cabecera />
      <h1>Nutricion gráfica de {beneficiarioSeleccionado.nombre}</h1>
      <div id="centered-chart-container" className="mb-4 d-flex justify-content-center align-items-center" >
        <div className="d-flex justify-content-center align-items-center bg-light px-2 border border-2 border-primary" style={{ width: "550px", height: "300px" }}>
          <LinesChart beneficios={data} meses={meses} datos={data} />
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Mes</th>
            <th>Peso</th>
          </tr>
        </thead>
        <tbody>
          {meses.map((mes, index) => (
            <tr key={index}>
              <td>{mes}</td>
              <td>{data[index]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VerGrafica;
 