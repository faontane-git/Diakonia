import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Cabecera from "./Cabecera";
import { getFirestore, doc, collection, query, where, getDocs, updateDoc } from "firebase/firestore";

const AñadirNutricion = ({user}) => {
  const { institucionId, institucionN } = useParams();
  const [Nbeneficiarios, setNBeneficiarios] = useState([]);
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const goBack = () => {
    navigate(`/nutricion/${institucionId}/${institucionN}`);
  }

  useEffect(() => {
    const querydb = getFirestore();
    const beneficiariosCollection = collection(querydb, 'beneficiarios');
    const beneficiariosQuery = query(beneficiariosCollection, where('institucionId', '==', institucionId));

    getDocs(beneficiariosQuery).then((res) =>
      setData(res.docs.map((benf) => ({ id: benf.id, ...benf.data() })))
    );
  }, [institucionId]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryData = event.target.result;
      const workbook = XLSX.read(binaryData, { type: 'binary' });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (jsonData[0].length < 2) {
        console.error('El encabezado debe contener al menos dos elementos: nombre y fecha de nacimiento');
        return;
      }

      const nombres = jsonData.slice(1).map((fila) => fila[0])
      const cedula = jsonData.slice(1).map((fila) => fila[1]);
      const f_registro = jsonData.slice(1).map((fila) => fila[2]);
      const peso = jsonData.slice(1).map((fila) => fila[3]);
      const talla = jsonData.slice(1).map((fila) => fila[4]);
      const hgb = jsonData.slice(1).map((fila) => fila[5]);

      const nuevosBeneficiarios = nombres.map((nombre, index) => ({
        nombre,
        cedula: cedula[index],
        fecha_seguimiento: f_registro[index],
        pesos: peso[index],
        talla: talla[index],
        hgb: hgb[index],
      }));

      setNBeneficiarios(nuevosBeneficiarios);
    };

    reader.readAsBinaryString(file);
  };

  async function añadir() {
    const firestore = getFirestore()
    const beneficiarioCollection = collection(firestore, 'beneficiarios');
    for (const beneficiario of Nbeneficiarios) {
      const update = data.find((doc) => doc.cedula === beneficiario.cedula);
      if (update != undefined) {
        update.fecha_seguimiento.push(beneficiario.fecha_seguimiento);
        update.pesos.push(beneficiario.pesos);
        update.talla.push(beneficiario.talla);
        update.hgb.push(beneficiario.hgb);

        const docuCifrada = doc(beneficiarioCollection, update.id);

        const modificar = updateDoc(docuCifrada, update)
        modificar.catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(error.message);
        })
      }
    }

    alert("se agregarón los datos nutricionales");
    goBack();
  }

  return (
    <div>
      <div className="centered-container">
        <Cabecera user={user}/>
        <h1>Añadir Seguimiento en {institucionN}</h1>
        <h3>¡Porfavor suba el excel con la información solicitada!</h3>
        <input type="file" onChange={handleFileUpload} />
        {Nbeneficiarios.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Fecha de Nacimiento</th>
                <th>Fecha de Registro</th>
                <th>Peso</th>
                <th>Talla</th>
                <th>HGB</th>
              </tr>
            </thead>
            <tbody>
              {Nbeneficiarios.map((Nbeneficiario, index) => (
                <tr key={index}>
                  <td>{Nbeneficiario.nombre}</td>
                  <td>{Nbeneficiario.fecha_nacimiento}</td>
                  <td>{Nbeneficiario.fecha_seguimiento}</td>
                  <td>{Nbeneficiario.pesos}</td>
                  <td>{Nbeneficiario.talla}</td>
                  <td>{Nbeneficiario.hgb}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {Nbeneficiarios.length > 0 && (
          <button onClick={añadir}>Añadir</button>
        )}
      </div>
    </div>
  );
};

export default AñadirNutricion;