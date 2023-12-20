import React,{useState,useEffect} from 'react';
import Cabecera from './Cabecera';
import LinesChart from './Linechart';
import { useParams } from 'react-router-dom';
import {getFirestore, doc,collection, getDoc, query, where, updateDoc} from 'firebase/firestore'
import '../estilos/Vergrafica.css';


const VerGrafica = ({ nutricion }) => {
const { institucionId, beneficiarioid } = useParams();
const [data,setData]= useState({});

useEffect(  () => {
  async function extraer(){
  const querydb= getFirestore();
  const docuRef = collection(querydb, `beneficiarios`);
  const docuCifrada= doc(docuRef,beneficiarioid);
  const documento= await getDoc(docuCifrada);
  //console.log("entra")
  setData(documento.data());
  }
  extraer();
  
}, []);

  return (
    <div className="centered-container">
      <Cabecera />
      <h1>Nutricion gráfica de {data.nombre}</h1>
      <div id="centered-chart-container" className="mb-4 d-flex justify-content-center align-items-center" >
        <div className="d-flex justify-content-center align-items-center bg-light px-2 border border-2 border-primary" style={{ width: "550px", height: "300px" }}>
          <LinesChart fechas={data.fecha_seguimiento} peso={data.pesos} talla={data.talla} hgb={data.hgb} />
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Fechas</th>
            <th>Peso</th>
            <th>Talla</th>
            <th>HGB</th>
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
 