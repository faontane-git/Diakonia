import React, { useState, useEffect } from 'react';
import '../estilos/ListaAsistencias.css';
import Cabecera from './Cabecera';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const ListaAsistencias = ({ asistencias }) => {
  const [data, setData] = useState([]);
  const [arregloNombresFechas, setArregloNombresFechas] = useState([]);
  const [mesSeleccionado, setMesSeleccionado] = useState('enero');

  const consulta = async () => {
    const querydb = getFirestore();
    const beneficiariosCollection = collection(querydb, 'beneficiarios');
    const beneficiariosQuery = query(beneficiariosCollection, where('institucionId', '==', '3qcInlJavqtUX49FsFuw'));

    try {
      const querySnapshot = await getDocs(beneficiariosQuery);
      setData(querySnapshot.docs.map((benf) => ({ id: benf.id, ...benf.data() })));
      const arregloNombresFechas = data.map((item) => ({
        nombre: item.nombre,
        fechas: item.dias.map((fecha) => convertirTimestampAFecha(fecha))
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
      <Cabecera />
      <h1>Asistencias</h1>

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
          {arregloNombresFechas.map((item) => (
            <tr key={item.nombre}>
              <td>{item.nombre}</td>
              {arregloNombresFechas[0].fechas.map((mes, index) => (
                <td key={index}>{item.fechas.includes(mes) ? 'A' : 'F'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={consulta}>Consulta</button>
    </div>
  );
};

export default ListaAsistencias;
