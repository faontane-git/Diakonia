import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Cabecera from "./Cabecera";
import { getFirestore, doc, collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const AñadirNutricion = ({user}) => {
  const { institucionId, institucionN, convenioId, convenioN } = useParams();
  const [Nbeneficiarios, setNBeneficiarios] = useState([]);
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const goBack = () => {
    navigate(`/nutricion/${institucionId}/${institucionN}/${convenioId}/${convenioN}`);
  }

  const convertirTimestampAFecha = (timestamp) => {
    return timestamp.toLocaleDateString('es-ES');
  };


  useEffect(() => {
    const querydb = getFirestore();
    const beneficiariosCollection = collection(querydb, 'beneficiarios');
    const beneficiariosQuery = query(
      beneficiariosCollection,
      where('institucionId', '==', institucionId),
      where('convenioId', '==', convenioId)
    );


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

      const nuevosBeneficiarios = nombres.map((nombre, index) => {
        
        const fechaSegui = new Date((f_registro[index] - 2) * 24 * 60 * 60 * 1000 + new Date(1900, 0, 1).getTime());

        return {
          nombre,
          cedula: cedula[index],
          fechas_seguimiento: fechaSegui,
          pesos: peso[index],
          talla: talla[index],
          hgb: hgb[index],
        };
      });


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
        console.log("update: ", update.fechas_seguimiento);
        console.log("fecha: ", beneficiario.fechas_seguimiento);
        
        const lista_Fechas = update.fechas_seguimiento.map(timestamp => new Date(timestamp.seconds * 1000));
        const index = lista_Fechas.findIndex(fecha => fecha.getTime() === beneficiario.fechas_seguimiento.getTime());

        if (index !== -1) {
          // Si la fechas_seguimiento existe, actualiza los valores en el índice correspondiente

          console.log("Se repite")
          update.pesos[index] = beneficiario.pesos;
          update.talla[index] = beneficiario.talla;
          update.hgb[index] = beneficiario.hgb;
        } else {
          // Si la fechas_seguimiento no existe, agrégala al final de los arrays
          console.log("No se repite")
          update.fechas_seguimiento.push(beneficiario.fechas_seguimiento);
          update.pesos.push(beneficiario.pesos);
          update.talla.push(beneficiario.talla);
          update.hgb.push(beneficiario.hgb);
        }
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
        <div style={{ display: 'flex', alignItems: 'center' }}>
        <div id='volver'>
          <Button variant="contained" style={{ marginLeft: '60%', backgroundColor: '#890202', color: 'white' }} onClick={goBack}>
            Volver
          </Button>
        </div>
      </div>
        <h2>Convenio: {convenioN}</h2>
        <h3>¡Porfavor suba el excel con la información solicitada!</h3>
        <input type="file" onChange={handleFileUpload} />
        {Nbeneficiarios.length > 0 && (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell style={{ backgroundColor: '#890202', color: 'white', margin: '5px', fontSize: '12px', maxWidth: '80px' }}>Nombre</TableCell>
                  <TableCell style={{ backgroundColor: '#890202', color: 'white', margin: '5px', fontSize: '12px', maxWidth: '80px' }}>Cédula</TableCell>
                  <TableCell style={{ backgroundColor: '#890202', color: 'white', margin: '5px', fontSize: '12px', maxWidth: '80px' }}>Fecha de Registro</TableCell>
                  <TableCell style={{ backgroundColor: '#890202', color: 'white', margin: '5px', fontSize: '12px', maxWidth: '80px' }}>Peso</TableCell>
                  <TableCell style={{ backgroundColor: '#890202', color: 'white', margin: '5px', fontSize: '12px', maxWidth: '80px' }}>Talla</TableCell>
                  <TableCell style={{ backgroundColor: '#890202', color: 'white', margin: '5px', fontSize: '12px', maxWidth: '80px' }}>HGB</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Nbeneficiarios.map((Nbeneficiario, index) => (
                  <TableRow key={index}>
                    <TableCell>{Nbeneficiario.nombre}</TableCell>
                    <TableCell>{Nbeneficiario.cedula}</TableCell>
                    <TableCell>{convertirTimestampAFecha(Nbeneficiario.fechas_seguimiento)}</TableCell>
                    <TableCell>{Nbeneficiario.pesos}</TableCell>
                    <TableCell>{Nbeneficiario.talla}</TableCell>
                    <TableCell>{Nbeneficiario.hgb}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {Nbeneficiarios.length > 0 && (
          <button onClick={añadir}>Añadir</button>
        )}
      </div>
    </div>
  );
};

export default AñadirNutricion;