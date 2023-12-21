import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Cabecera from "./Cabecera";
import { getFirestore, doc, collection, addDoc, getDoc, getDocs,where,query } from "firebase/firestore";

const LeerExcel = ({ user }) => {
  const { institucionId , institucionN} = useParams();
  const [Nbeneficiarios, setNBeneficiarios] = useState([]);
  const navigate = useNavigate();

  const goBack = () => {
    navigate(`/beneficiarios/${institucionId}/${institucionN}`);
  }

  const [data, setData] = useState([]);

  useEffect(() => {
    const querydb = getFirestore();
    const beneficiariosCollection = collection(querydb, 'beneficiarios');
    const beneficiariosQuery = query(beneficiariosCollection, where('institucionId', '==', institucionId));

    getDocs(beneficiariosQuery).then((res) =>
      setData({ cedulas: res.docs.map((benf) => benf.data().cedula) })
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
        console.error('El encabezado debe contener al menos dos elementos: nombre y edad');
        return;
      }

      const nombres = jsonData.slice(1).map((fila) => fila[0]);
      const cedula = jsonData.slice(1).map((fila) => fila[1]);
      const f_nacimiento = jsonData.slice(1).map((fila) => fila[2]);
      const genero = jsonData.slice(1).map((fila) => fila[3]);
      const n_contacto = jsonData.slice(1).map((fila) => fila[4]);
      const n_menores = jsonData.slice(1).map((fila) => fila[5]);
      const n_mayores = jsonData.slice(1).map((fila) => fila[6]);

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
        desayuno: [],
        almuerzo:[],
        registrado: false,
        fecha_seguimiento:[],
        pesos:[],
        talla:[],
        hgb:[],
        activo:true,
        
      }));

      setNBeneficiarios(nuevosBeneficiarios);
    };

    reader.readAsBinaryString(file);
  };

  async function añadir() {
    const firestore = getFirestore()
    const beneficiarioCollection = collection(firestore, 'beneficiarios');
        const instColect = collection(firestore,"instituciones");
    const institutionRef = doc(instColect, institucionId);

    //for (const beneficiario of Nbeneficiarios) {
      

      getDoc(institutionRef).then((doc) => {
        if (doc.exists) {
          const days = (Date.parse(doc.data().fecha_final)-Date.parse(doc.data().fecha_inicial))/86400000;
          
          for (const beneficiario of Nbeneficiarios) {  
            //console.log(data.cedulas.includes(beneficiario.cedula))
            if(data.cedulas.includes(beneficiario.cedula)){console.log("Se repite:",beneficiario.nombre)}else{

            for (let i = 0; i <= days; i++) {
              beneficiario.dias.push(new Date(Date.parse(doc.data().fecha_inicial) + (i * 24 * 60 * 60 * 1000)));
            }
            for (const date of beneficiario.dias) {
              if(doc.data().desayuno===true){beneficiario.desayuno.push("-");}
              if(doc.data().almuerzo===true){beneficiario.almuerzo.push("-");} 
            }
            addDoc(beneficiarioCollection, beneficiario).catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              alert(errorMessage)
          })}};
        } else {
          // La institución no existe
        }
      });
    

    alert("Se han agregado los beneficiarios correctamente");
    goBack();
  }

  return (
    <div className="centered-container">
      <Cabecera user={user} />
      <h1>Lista de Beneficiarios</h1>
      <h3>¡Porfavor suba el excel con la información solicitada!</h3>
      <input type="file" onChange={handleFileUpload} />
      {Nbeneficiarios.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cédula</th>
              <th>Fecha de nacimiento</th>
              <th>Género</th>
              <th>Número de contacto</th>
              <th>Número de menores en el hogar</th>
              <th>Número de mayores en el hogar</th>
            </tr>
          </thead>
          <tbody>
            {Nbeneficiarios.map((Nbeneficiario, index) => (
              <tr key={index}>
                <td>{Nbeneficiario.nombre}</td>
                <td>{Nbeneficiario.cedula}</td>
                <td>{Nbeneficiario.fecha_nacimiento}</td>
                <td>{Nbeneficiario.genero}</td>
                <td>{Nbeneficiario.numero_contacto}</td>
                <td>{Nbeneficiario.numero_de_personas_menores_en_el_hogar}</td>
                <td>{Nbeneficiario.numero_de_personas_mayores_en_el_hogar}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {Nbeneficiarios.length > 0 && (
        <button onClick={añadir}>Añadir</button>    
      )}
    </div>
  );
};

export default LeerExcel;
