import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Cabecera from "./Cabecera";


import { getFirestore, doc, collection, query, where, getDocs, updateDoc } from "firebase/firestore";


const AñadirNutricion = () => {

  const { institucionId, institucionN } = useParams();
  const [Nbeneficiarios, setNBeneficiarios] = useState([]);
  const [data, setData] = useState([]);
 // const [update, setUpdate]=useState({});
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

      // Supongamos que tienes un solo hoja de cálculo, si hay múltiples hojas,
      // debes especificar la hoja que deseas leer.
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convierte la hoja de cálculo a un objeto JSON
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Asegúrate de que el encabezado tenga al menos dos elementos (nombre y edad)
      if (jsonData[0].length < 2) {
        console.error('El encabezado debe contener al menos dos elementos: nombre y fecha de nacimiento');
        return;
      }

      // Extrae los nombres y edades de los beneficiarios del objeto JSON
      const nombres = jsonData.slice(1).map((fila) => fila[0])
      const f_nacimiento = jsonData.slice(1).map((fila) => fila[1]);
      const f_registro = jsonData.slice(1).map((fila) => fila[2]);
      const peso = jsonData.slice(1).map((fila) => fila[3]);
      const talla = jsonData.slice(1).map((fila) => fila[4]);
      const hgb = jsonData.slice(1).map((fila) => fila[5]);


      // Crea una lista de objetos beneficiario
      const nuevosBeneficiarios = nombres.map((nombre, index) => ({
        nombre,
        fecha_nacimiento:f_nacimiento[index],
        fecha_seguimiento:f_registro[index],
        pesos:peso[index],
        talla:talla[index],
        hgb:hgb[index],
        
      }));

      // Actualiza el estado con la nueva lista de beneficiarios
      setNBeneficiarios(nuevosBeneficiarios);
    };

    reader.readAsBinaryString(file);
  };

  async function añadir() {
    
    const firestore = getFirestore()
    const beneficiarioCollection = collection(firestore, 'beneficiarios');
    for (const beneficiario of Nbeneficiarios) {
        const update= data.find((doc) => doc.nombre === beneficiario.nombre && doc.fecha_nacimiento === beneficiario.fecha_nacimiento );  
        if(update != undefined){
        update.fecha_seguimiento.push(beneficiario.fecha_seguimiento);
        update.pesos.push(beneficiario.pesos);
        update.talla.push(beneficiario.talla);
        update.hgb.push(beneficiario.hgb);

        
        
        const docuCifrada= doc(beneficiarioCollection,update.id);
        
        const modificar = updateDoc(docuCifrada,update)
    modificar.catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(error.message);
    })}
    }
    
    
    alert("se agregarón los datos nutricionales");
    //console.log(data);
    goBack();
  }

  return (
    <div>
      <div className="centered-container">
        <Cabecera />
        <h1>Añadir Seguimiento en {institucionN}</h1>
        <input type="file" onChange={handleFileUpload} />
        {Nbeneficiarios.length > 0 && (
          <ul>
            {Nbeneficiarios.map((Nbeneficiario, index) => (
              <li key={index}>
                Nombre: {Nbeneficiario.nombre}, f_nacimiento: {Nbeneficiario.fecha_nacimiento}, f_registro: {Nbeneficiario.fecha_seguimiento},peso: {Nbeneficiario.pesos}, talla: {Nbeneficiario.talla}, hgb: {Nbeneficiario.hgb}
              </li>
            ))}
          </ul>
        )}
        {Nbeneficiarios.length > 0 && (
          <button onClick={añadir}>Añadir</button>
        )}
      </div>
    </div>
  );
};

export default AñadirNutricion;
