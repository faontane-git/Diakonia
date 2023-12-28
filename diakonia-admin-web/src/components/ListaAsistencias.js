import React, { useState, useEffect } from 'react';
import '../estilos/ListaAsistencias.css';
import Cabecera from './Cabecera';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

const ListaAsistencias = ({ user }) => {
  const { institucionId }= useParams();
  const [data, setData] = useState([]);
  const [arregloNombresFechas, setArregloNombresFechas] = useState([]);
  const [mesSeleccionado, setMesSeleccionado] = useState('enero');

  async function consulta(){
    const querydb = getFirestore();
    const beneficiariosCollection = collection(querydb, 'beneficiarios');
    const beneficiariosQuery = query(beneficiariosCollection, where('institucionId', '==', institucionId ));

    try {
      const querySnapshot = await getDocs(beneficiariosQuery);
      setData(querySnapshot.docs.map((benf) => ({ id: benf.id, ...benf.data() })));
      const arregloNombresFechas = data.map((item) => ({
        nombre: item.nombre,
        fechas: item.dias.map((fecha) => convertirTimestampAFecha(fecha)),
        desayuno: item.desayuno.map((desayuno) => desayuno),
        almuerzo: item.almuerzo.map((almuerzo) => almuerzo)
      }));
      setArregloNombresFechas(arregloNombresFechas);
      console.log(arregloNombresFechas);
    } catch (error) {
      console.error('Error al obtener documentos:', error);
    }
  };

  const convertirTimestampAFecha = (timestamp) => {
    const fecha = new Date(timestamp.seconds * 1000);
    return fecha.toLocaleDateString('es-ES');
  };

  useEffect(() => {
    const obtenerDiasDelMes = () => {
      if (data.length > 0) {
        const primerBeneficiario = data[0];
        const fechasMesSeleccionado = primerBeneficiario.dias
          .filter((fecha) => convertirTimestampAFecha(fecha) === mesSeleccionado);
        setDiasDelMes(fechasMesSeleccionado);
      }
    };

    obtenerDiasDelMes();
  }, [mesSeleccionado, data]);

  const [diasDelMes, setDiasDelMes] = useState([]);

  useEffect(() => {
    consulta();
  }, []);

  return (
    <div className="centered-container">
      <Cabecera user={user} />
      <h1>Asistencias</h1>
      <button onClick={consulta}>Consulta</button>

      {arregloNombresFechas[0].desayuno.length  > 0 ? 
      <>
      <h2>Desayuno</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            {arregloNombresFechas.length > 0 &&
              arregloNombresFechas[0].fechas.map((mes, index) => (
                <th key={index}>{mes}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {arregloNombresFechas.map((item,index) => (
            <tr key={item.nombre}>
              <td>{item.nombre}</td>
              {item.desayuno.map((desayuno) => (<td>{desayuno}</td>))}
              
              {/*{arregloNombresFechas[0].fechas.map((mes, index) => (
                <td key={index}>{item.fechas.includes(mes) ? 'A' : 'F'}</td>
              ))}*/}
            </tr>
          ))}
        </tbody>
      </table>
      </>

      : <h1>No hay servicio de desayunos</h1>}
      
      {arregloNombresFechas[0].almuerzo.length  > 0 ? 
       <>
      <h2>Almuerzos</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            {arregloNombresFechas.length > 0 &&
              arregloNombresFechas[0].fechas.map((mes, index) => (
                <th key={index}>{mes}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {arregloNombresFechas.map((item,index) => (
            <tr key={item.nombre}>
              <td>{item.nombre}</td>
              {item.almuerzo.map((almuerzo) => (<td>{almuerzo}</td>))}
              
              {/*{arregloNombresFechas[0].fechas.map((mes, index) => (
                <td key={index}>{item.fechas.includes(mes) ? 'A' : 'F'}</td>
              ))}*/}
            </tr>
          ))}
        </tbody>
      </table>
      </>

      : <h1>No hay servicio de Almuerzos</h1>}

      
    </div>
  );
};

export default ListaAsistencias;
