import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Cabecera from "./Cabecera";


import { getFirestore, doc, collection, setDoc, addDoc, getDoc } from "firebase/firestore";


const LeerExcel = ({ beneficiarios, agregarBeneficiario }) => {

  const { institucionId } = useParams();
  const [Nbeneficiarios, setNBeneficiarios] = useState([]);

  const navigate = useNavigate();

  const goBack = () => {
    navigate('/beneficiarios');
  }

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
        console.error('El encabezado debe contener al menos dos elementos: nombre y edad');
        return;
      }

      // Extrae los nombres y edades de los beneficiarios del objeto JSON
      const nombres = jsonData.slice(1).map((fila) => fila[0]);
      const cedula = jsonData.slice(1).map((fila) => fila[1]);
      const f_nacimiento = jsonData.slice(1).map((fila) => fila[2]);
      const genero = jsonData.slice(1).map((fila) => fila[3]);
      const n_contacto = jsonData.slice(1).map((fila) => fila[4]);
      const n_menores = jsonData.slice(1).map((fila) => fila[5]);
      const n_mayores = jsonData.slice(1).map((fila) => fila[6]);


      // Crea una lista de objetos beneficiario
      const nuevosBeneficiarios = nombres.map((nombre, index) => ({
        institucionId: institucionId,
        nombre,
        cedula: cedula[index],
        fecha_nacimiento: f_nacimiento[index],
        genero: genero[index],
        numero_contacto: n_contacto[index],
        numero_de_personas_menores_en_el_hogar: n_menores[index],
        numero_de_personas_mayores_en_el_hogar: n_mayores[index],
        dias: [],
        asistencias: [],
        registrado: false,
        primer_Peso:"",
        primer_Talla:"",
        primer_HGB:"",
        segundo_Peso:"",
        segundo_Talla:"",
        segundo_HGB:"",
        
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
      const instColect = collection(firestore,"instituciones");
      

      const institutionRef =doc(instColect,beneficiario.institucionId);

      getDoc(institutionRef).then((doc) => {
        if (doc.exists) {
          // Creamos una nueva variable para el beneficiario
    
          // Calculamos la diferencia de días entre las fechas de la institución
          const days = (Date.parse(doc.data().fecha_final)-Date.parse(doc.data().fecha_inicial))/86400000;
          console.log(days)
          // Creamos la lista de fechas
          for (let i = 0; i <= days; i++) {
            beneficiario.dias.push(new Date(Date.parse(doc.data().fecha_inicial) + (i * 24 * 60 * 60 * 1000)));
          }
    
          // Llenamos la lista de asistencias con "-"
          for (const date of beneficiario.dias) {
            beneficiario.asistencias.push("-");
          }
    
          // Añadimos el nuevo beneficiario a la colección "asistencias"
          addDoc(beneficiarioCollection, beneficiario).catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(errorMessage)});
          
        } else {
          // La institución no existe
        }});

      
    };
    alert("se agregarón los beneficiarios");
    console.log("crea");
    goBack();
  }

  return (
    <div>
      <div className="centered-container">
        <Cabecera />
        <h1>Lista de Beneficiarios</h1>
        <input type="file" onChange={handleFileUpload} />
        {Nbeneficiarios.length > 0 && (
          <ul>
            {Nbeneficiarios.map((Nbeneficiario, index) => (
              <li key={index}>
                Nombre: {Nbeneficiario.nombre}, cedula: {Nbeneficiario.cedula}, fecha_nacimiento: {Nbeneficiario.f_nacimiento},genero: {Nbeneficiario.genero}, contacto: {Nbeneficiario.numero_contacto}, N_menores_Hogar: {Nbeneficiario.numero_de_personas_menores_en_el_hogar}, n_mayores_hogar: {Nbeneficiario.numero_de_personas_mayores_en_el_hogar}
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

export default LeerExcel;
