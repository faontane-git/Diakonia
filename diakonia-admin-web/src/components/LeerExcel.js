import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Cabecera from "./Cabecera";
import QRCode from 'qrcode.react';
import Swal from 'sweetalert2';
import { getFirestore, doc, collection, addDoc, getDoc, getDocs, where, query } from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  IconButton,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
} from '@mui/material';
import { Search } from '@mui/icons-material';

const LeerExcel = ({ user }) => {
  const { institucionId, institucionN, convenioId, convenioN } = useParams();
  const [Nbeneficiarios, setNBeneficiarios] = useState([]);
  const navigate = useNavigate();

  const goBack = () => {
    navigate(`/beneficiarios/${institucionId}/${institucionN}/${convenioId}/${convenioN}`);
  };

  const convertirTimestampAFecha = (timestamp) => {
    return timestamp.toLocaleDateString('es-ES');
  };

  const [data, setData] = useState([]);

  useEffect(() => {
    const querydb = getFirestore();
    const beneficiariosCollection = collection(querydb, 'beneficiarios');
    const beneficiariosQuery = query(
      beneficiariosCollection,
      where('institucionId', '==', institucionId),
      where('convenioId', '==', convenioId)
    );

    getDocs(beneficiariosQuery).then((res) =>
      setData({
        cedulas: res.docs.map((benf) => benf.data().cedula),
        activos: res.docs.map((benf) => benf.data().activo)
      })
    );
  }, [institucionId]);

  const generateQRCode = (nombre, cedula) => {
    return `Nombre: ${nombre},ConvenioNombre:${convenioN},ConvenioID:${convenioId},Institución: ${institucionN}, Institución_ID: ${institucionId}, Cédula: ${cedula}`;
  };

  const handleFileUpload = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      console.error('No se seleccionó ningún archivo');
      return;
    }
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

      const nuevosBeneficiarios = nombres.map((nombre, index) => {
        const fechaNacimiento = new Date((f_nacimiento[index] - 2) * 24 * 60 * 60 * 1000 + new Date(1900, 0, 1).getTime());
        const codigoQR = generateQRCode(nombre, cedula[index]);
        return {
          institucionId: institucionId,
          institucionN: institucionN,
          convenioId: convenioId,
          ConvenioNombre: convenioN,
          nombre,
          cedula: cedula[index],
          fecha_nacimiento: fechaNacimiento,
          genero: genero[index],
          numero_contacto: n_contacto[index],
          numero_de_personas_menores_en_el_hogar: n_menores[index],
          numero_de_personas_mayores_en_el_hogar: n_mayores[index],
          dias: [],
          desayuno: [],
          almuerzo: [],
          registrado: false,
          fecha_seguimiento: [],
          pesos: [],
          talla: [],
          hgb: [],
          activo: true,
          observacion: '',
          //qr_url: codigoQR,
        };
      });

      setNBeneficiarios(nuevosBeneficiarios);
    };

    reader.readAsBinaryString(file);
  };

  async function añadir() {
    const firestore = getFirestore()
    const beneficiarioCollection = collection(firestore, 'beneficiarios');
    const ConvenioColect = collection(firestore, "convenios");
    const ConvenioRef = doc(ConvenioColect, convenioId);

    getDoc(ConvenioRef).then((doc) => {
      if (doc.exists) {
        const final = new Date(doc.data().fecha_final.seconds * 1000)
        const inicio = new Date(doc.data().fecha_inicial.seconds * 1000)
        const diferenciaEnMilisegundos = final - inicio;

        for (const beneficiario of Nbeneficiarios) {
          if (data.cedulas.includes(beneficiario.cedula)) {
            Swal.fire({
              title: 'Usuario Repetido',
              text: `El usuario ${beneficiario.nombre} ya está registrado`,
              icon: 'error',
            });
          } else {
            for (let i = 0; i <= diferenciaEnMilisegundos; i += 24 * 60 * 60 * 1000) {
              const fechaActual = new Date(inicio.getTime() + i);
              beneficiario.dias.push(fechaActual);
            }
            for (const date of beneficiario.dias) {
              if (doc.data().desayuno === true) {
                beneficiario.desayuno.push(0);
              }
              if (doc.data().almuerzo === true) {
                beneficiario.almuerzo.push(0);
              }
            }
            addDoc(beneficiarioCollection, beneficiario).catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              alert(errorMessage);
            })
          }
        };
      } else {
        // La institución no existe
      }
    });
    Swal.fire({
      title: 'Beneficiarios Agregados',
      text: 'Se han agregado los beneficiarios correctamente',
      icon: 'success',
    });
    goBack();
  }

  return (
    <div className="centered-container">
      <Cabecera user={user} />
      <h1>Institución: {institucionN}</h1>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div id='volver'>
          <Button variant="contained" style={{ marginLeft: '60%', backgroundColor: '#890202', color: 'white' }} onClick={goBack}>
            Volver
          </Button>
        </div>
      </div>

      <h3>Añadir Beneficiarios</h3>
      <h3>¡Por favor, suba el Excel con la información solicitada!</h3>
      <input type="file" onChange={handleFileUpload} />
      {Nbeneficiarios.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Nombre</TableCell>
                <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Cédula</TableCell>
                <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Fecha de nacimiento</TableCell>
                <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Género</TableCell>
                <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Número de contacto</TableCell>
                <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Menores en casa</TableCell>
                <TableCell id='cuerpo_tabla' style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Mayores en casa</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Nbeneficiarios.map((Nbeneficiario, index) => (
                <TableRow key={index}>
                  <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>{Nbeneficiario.nombre}</TableCell>
                  <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>{Nbeneficiario.cedula}</TableCell>
                  <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>{convertirTimestampAFecha(Nbeneficiario.fecha_nacimiento)}</TableCell>
                  <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>{Nbeneficiario.genero}</TableCell>
                  <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>{Nbeneficiario.numero_contacto}</TableCell>
                  <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>{Nbeneficiario.numero_de_personas_menores_en_el_hogar}</TableCell>
                  <TableCell id='cuerpo_tabla' style={{ fontSize: '14px' }}>{Nbeneficiario.numero_de_personas_mayores_en_el_hogar}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {Nbeneficiarios.length > 0 && (
        <Button
          onClick={añadir}
          variant="contained"
          style={{ backgroundColor: '#890202', color: 'white', marginBottom: '4px', width: '100%' }}
        >
          Añadir
        </Button>
      )}
    </div>
  );
};

export default LeerExcel;