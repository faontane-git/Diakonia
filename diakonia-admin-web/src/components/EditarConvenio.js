import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Cabecera from './Cabecera';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, updateDoc, query, collection, where, getDocs, setDoc, getDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import '../estilos/EditarConvenio.css';
import { Button } from '@mui/material';
import { useAuthContext } from './AuthContext'; // Ruta real a tu AuthContext

const EditarConvenio = () => {
  const { institucionId, institucionN, convenioId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const goBack = () => {
    navigate(`/instituciones/${institucionId}/${institucionN}`);
  };

  const [nombre, setNombre] = useState('');
  const [nombreAnterior, setNombreAnterior] = useState('');
  const [direccion, setDireccion] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [pdfBase64, setPdfBase64] = useState(null);
  const [nuevoArchivo, setNuevoArchivo] = useState(false);
  const fechaActual = new Date().toISOString().slice(0, 10);

  const [fechaInicialOriginal, setFechaInicialOriginal] = useState(null);
  const [fechaFinalOriginal, setFechaFinalOriginal] = useState(null);

  const [OriginalAlmuerzo, setOriginalAlmuerzo] = useState(null);
  const [OriginalDesayuno, setOriginalDesayuno] = useState(null);


  useEffect(() => {
    const obtenerDatosConvenio = async () => {
      const querydb = getFirestore();
      const docuRef = doc(querydb, 'convenios', convenioId);
      const docSnapshot = await getDoc(docuRef);

      if (docSnapshot.exists()) {
        const convenioData = docSnapshot.data();

        setNombre(convenioData.nombre || '');
        setNombreAnterior(convenioData.nombre || '');
        setDireccion(convenioData.direccion || '');

        setOriginalAlmuerzo(convenioData.almuerzo || '');
        setOriginalDesayuno(convenioData.desayuno || '');

        if (convenioData.fecha_inicial) {
          const fechaInicio = new Date(convenioData.fecha_inicial.seconds * 1000);
          setFechaInicio(fechaInicio.toISOString().slice(0, 10));
          setFechaInicialOriginal(fechaInicio.toISOString().slice(0, 10))
        }

        if (convenioData.fecha_final) {
          const fechaFinal = new Date(convenioData.fecha_final.seconds * 1000);
          setFechaFin(fechaFinal.toISOString().slice(0, 10));
          setFechaFinalOriginal(fechaFinal.toISOString().slice(0, 10));
        }
      }
    };

    obtenerDatosConvenio();
  }, [convenioId]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    console.log("Tipo de Archivo:", selectedFile.type);

    if (selectedFile && selectedFile.type === "application/pdf") {
      setArchivo(selectedFile);
      setNuevoArchivo(true);

      const reader = new FileReader();

      reader.onload = (e) => {
        const base64String = e.target.result.split(",")[1];
        console.log("Base64 String:", base64String);
        setPdfBase64(base64String);
      };

      reader.onerror = (error) => {
        console.error('Error al leer el archivo:', error);
      };

      reader.readAsDataURL(selectedFile);
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, seleccione un archivo PDF.',
        icon: 'error',
      });

      e.target.value = null;
      setArchivo(null);
      setPdfBase64(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const querydb = getFirestore();
    const docuRef = doc(querydb, 'convenios', convenioId);

    const fechaInicioObj = new Date(fechaInicio + 'T00:00:00');
    const fechaFinal = new Date(fechaFin + 'T00:00:00');

    const fechaInicioOriginalObj = new Date(fechaInicialOriginal + 'T00:00:00');
    const fechaFinalOriginalObj = new Date(fechaFinalOriginal + 'T00:00:00');

    console.log(fechaInicioObj);
    console.log(fechaInicioOriginalObj);

    const docSnapshot = await getDoc(docuRef);
    const fechaInicioConvenio = docSnapshot.data().fecha_inicial.toDate();

    if (fechaFinal <= fechaInicioConvenio) {
      Swal.fire('Error', 'La fecha de fin debe ser mayor que la fecha de inicio', 'error');
      return;
    }
    const dias = [];



    const diferenciaEnMilisegundos = fechaFinal - fechaInicioObj;
    for (let i = 0; i <= diferenciaEnMilisegundos; i += 24 * 60 * 60 * 1000) {

      const fechaActual = new Date(fechaInicioObj.getTime() + i);
      console.log(fechaActual)
      dias.push(fechaActual);
    }

    const convenio = {
      nombre,
      direccion,
      fecha_inicial: fechaInicioObj,
      fecha_final: fechaFinal,
      dias: dias,
    };

    if (nuevoArchivo) {
      convenio.pdfBase64 = pdfBase64;
    }

    try {
      await updateDoc(docuRef, convenio);
      // Guardar información en el histórico
      const historicoDatos = {
        usuario: user.nombre,  // Reemplaza con el nombre del usuario real
        correo: user.email,  // Reemplaza con el nombre del usuario real
        accion: 'Convenio Editado: ' + nombreAnterior,  // Mensaje personalizado
        fecha: new Date().toLocaleDateString(),
        hora: new Date().toLocaleTimeString(),  // Hora actual
        tiempo: serverTimestamp(), // Utiliza serverTimestamp para obtener la marca de tiempo actual del servidor
      };
      const firestore = getFirestore();
      const hitoricoCollection = collection(firestore, 'historico');
      addDoc(hitoricoCollection, historicoDatos);


      //Actualiza los beneficiarios
      if (fechaInicioOriginalObj.getTime() !== fechaInicioObj.getTime()) {
        console.log(" se cambia benef")
        const querydb = getFirestore();
        const beneficiariosCollection = collection(querydb, 'beneficiarios');
        const beneficiariosQuery = query(
          beneficiariosCollection,
          where('institucionId', '==', institucionId),
          where('convenioId', '==', convenioId)
        );
        //const inicio = fechaInicioObj.seconds * 1000;
        //const final = fechaFinal * 1000;
        const diferenciaEnMilisegundos = fechaFinal - fechaInicioObj;
        console.log("diferencia: ", diferenciaEnMilisegundos)
        const desayuno = [];
        const almuerzo = [];
        const dias = [];

        //const diferenciaEndias= diferenciaEnMilisegundos/(1000 * 60 * 60 * 24);
        for (let i = 0; i <= diferenciaEnMilisegundos; i += 24 * 60 * 60 * 1000) {

          const fechaActual = new Date(fechaInicioObj.getTime() + i);
          console.log(fechaActual)
          dias.push(fechaActual);
          if (OriginalDesayuno === true) {
            desayuno.push(0);
          }
          if (OriginalAlmuerzo === true) {
            almuerzo.push(0); // Agregar 0 al campo almuerzo
          }
        }
        console.log(dias.length);
        const documentos = await getDocs(beneficiariosQuery);
        documentos.forEach(async (doc) => {
          const docRef = doc.ref;

          // Realizar la actualización de los campos deseados
          await updateDoc(docRef, { dias: dias, desayuno: desayuno, almuerzo: almuerzo });
          // Agrega más campos según sea necesario

        });

      } else if (fechaFinalOriginalObj.getTime() !== fechaFinal.getTime()) {
        const querydb = getFirestore();
        const beneficiariosCollection = collection(querydb, 'beneficiarios');
        const beneficiariosQuery = query(
          beneficiariosCollection,
          where('institucionId', '==', institucionId),
          where('convenioId', '==', convenioId)
        );
        const diferenciaEnMilisegundos = fechaFinal - fechaInicioObj;

        if (fechaFinalOriginalObj.getTime() > fechaFinal.getTime()) {
          const documentos = await getDocs(beneficiariosQuery);
          documentos.forEach(async (doc) => {
            const docRef = doc.ref;
            const data = doc.data();

            // Obtén las listas actuales
            const diasOriginales = data.dias || [];
            const desayunoOriginales = data.desayuno || [];
            const almuerzoOriginales = data.almuerzo || [];

            // Ajusta las listas según la diferencia de días
            const diferenciaDias = Math.ceil(diferenciaEnMilisegundos / (24 * 60 * 60 * 1000));

            const nuevosDias = diasOriginales.slice(0, diferenciaDias + 1);
            const nuevosDesayuno = desayunoOriginales.slice(0, diferenciaDias + 1);
            const nuevosAlmuerzo = almuerzoOriginales.slice(0, diferenciaDias + 1);

            // Actualiza el documento en la colección 'beneficiarios'
            await updateDoc(docRef, { dias: nuevosDias, desayuno: nuevosDesayuno, almuerzo: nuevosAlmuerzo });
          });

        } else if (fechaFinalOriginalObj.getTime() < fechaFinal.getTime()) {

          const documentos = await getDocs(beneficiariosQuery);
          documentos.forEach(async (doc) => {
            const docRef = doc.ref;
            const data = doc.data();

            const diferenciaDias = Math.ceil(diferenciaEnMilisegundos / (24 * 60 * 60 * 1000));

            const diasAgregar = diferenciaDias - (data.dias || []).length;
            const ceros = Array(diasAgregar + 1).fill(0);

            // Ajusta las listas agregando ceros al final
            const nuevosDias = [];
            const nuevosDesayuno = (data.desayuno || []).concat(ceros);
            const nuevosAlmuerzo = (data.almuerzo || []).concat(ceros);

            for (let i = 0; i <= diferenciaEnMilisegundos; i += 24 * 60 * 60 * 1000) {

              const fechaActual = new Date(fechaInicioObj.getTime() + i);
              console.log(fechaActual)
              nuevosDias.push(fechaActual);
            }

            // Actualiza el documento en la colección 'beneficiarios'
            await updateDoc(docRef, { dias: nuevosDias, desayuno: nuevosDesayuno, almuerzo: nuevosAlmuerzo });
          });

        }
      }

      Swal.fire('¡Éxito!', 'Convenio editado con éxito', 'success');
      navigate(`/instituciones/${institucionId}/${institucionN}`);
    } catch (error) {
      console.error('Error al modificar convenio:', error);
      Swal.fire('¡Error!', `Error al modificar convenio: ${error.message}`, 'error');
    }
  };

  return (
    <div>
      <div className="centered-container">
        <Cabecera user={user} />
        <div style={{ textAlign: 'left', marginLeft: '30px', marginTop: '10px' }}>
          <Button variant="contained" style={{ backgroundColor: '#890202', color: 'white' }} onClick={goBack}>
            Volver
          </Button>
        </div>

        <h1>Editar Convenio</h1>
      </div>

      <form id="form_econvenio" onSubmit={handleSubmit}>
        <div id="linea">
          <div id="txtNombreConvenio">
            <label htmlFor="nombre"><b>Nombre</b></label>
            <input
              type="text"
              id="l_eConvenio"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div id="txtDireccionConvenio">
            <label htmlFor="cedula"><b>Dirección</b></label>
            <input
              type="text"
              id="l_eConvenio"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
            />
          </div>
        </div>

        <div id="linea2">
          <div id="rangoFechasInicial">
            <label htmlFor="fechaInicio"><b>Fecha de Inicio</b></label>
            <input
              type="date"
              id="l_eConvenio"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              disabled={fechaInicio <= fechaActual} // Deshabilitar si fecha de inicio es mayor o igual a la fecha actual
              min={fechaActual}
            />
          </div>

          <div id="rangoFechasFinal">
            <label htmlFor="fechaFin"><b>Fecha de Fin</b></label>
            <input
              type="date"
              id="l_eConvenio"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
          </div>
        </div>

        <div id="txtArchivo">
          <label htmlFor="archivo"><b>Subir Archivo</b></label>
          <input
            type="file"
            id="l_eConvenio"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
          />
        </div>


        <button id="buttonBRegistrar" type="submit">Cambiar Datos</button>
      </form>
    </div >
  );
};

export default EditarConvenio;
