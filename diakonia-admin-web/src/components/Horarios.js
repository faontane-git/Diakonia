import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Cabecera from './Cabecera';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, updateDoc, query, collection, where, getDocs, setDoc, getDoc, addDoc } from 'firebase/firestore';
import '../estilos/Horarios.css';
import { useAuthContext } from './AuthContext'; // Ruta real a tu AuthContext


const Horarios = () => {
  const { institucionId, institucionN } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const [horaDesayunoInicial, setHoraDesayunoInicial] = useState('');
  const [horaDesayunoFinal, setHoraDesayunoFinal] = useState('');
  const [horaAlmuerzoInicial, setHoraAlmuerzoInicial] = useState('');
  const [horaAlmuerzoFinal, setHoraAlmuerzoFinal] = useState('');

  useEffect(() => {
    const obtenerDatosHorario = async () => {
      const querydb = getFirestore();
      const docuRef = doc(querydb, 'horarios', 'QkbgLVC4va77hSdDT9DL');
      const docSnapshot = await getDoc(docuRef);

      if (docSnapshot.exists()) {
        const horarioData = docSnapshot.data();

        setHoraDesayunoInicial(horarioData.horaDesayuno.inicial || '');
        setHoraDesayunoFinal(horarioData.horaDesayuno.final || '');
        setHoraAlmuerzoInicial(horarioData.horaAlmuerzo.inicial || '');
        setHoraAlmuerzoFinal(horarioData.horaAlmuerzo.final || '');
      }
    };

    obtenerDatosHorario();
  }, []); // El segundo argumento es un array de dependencias que está vacío


  const handleSubmit = async (event) => {
    event.preventDefault();
    const querydb = getFirestore();
    const docuRef = doc(querydb, 'horarios', 'QkbgLVC4va77hSdDT9DL');

    const horario = {
      horaDesayuno: {
        inicial: horaDesayunoInicial,
        final: horaDesayunoFinal,
      },
      horaAlmuerzo: {
        inicial: horaAlmuerzoInicial,
        final: horaAlmuerzoFinal,
      },
    };

    try {
      // Verificar si el horario ya existe
      const horarioSnapshot = await getDoc(docuRef);

      if (horarioSnapshot.exists()) {
        // Si existe, actualizar el documento
        await updateDoc(docuRef, horario);
      } else {
        // Si no existe, crear un nuevo documento
        await setDoc(docuRef, horario);
      }

      // Guardar información en el histórico
      const historicoDatos = {
        usuario: user.nombre,  // Reemplaza con el nombre del usuario real
        correo: user.email,  // Reemplaza con el nombre del usuario real
        accion: 'Horario Cambiado',  // Mensaje personalizado
        fecha: new Date().toLocaleDateString(),
        hora: new Date().toLocaleTimeString(),  // Hora actual
      };
      const firestore = getFirestore();
      const hitoricoCollection = collection(firestore, 'historico');
      addDoc(hitoricoCollection, historicoDatos);

      Swal.fire('¡Éxito!', 'Horario editado con éxito', 'success');
      navigate('/horarios');
    } catch (error) {
      console.error('Error al modificar horario:', error);
      Swal.fire('¡Error!', `Error al modificar horario: ${error.message}`, 'error');
    }
  };

  return (
    <div>
      <div className="centered-container">
        <Cabecera user={user} />
        <h1>Editar Horario</h1>
      </div>

      <form id="form_horarios" onSubmit={handleSubmit}>
        <div id="horaDesayuno" className="horario-group">
          <label id="l_desayuno" htmlFor="desayunoInicial">
            <b>Horario de Desayuno</b>
          </label>
          <div className="hora-container">
            <b style={{ marginRight: '10px' }}>Inicio</b>
            <input
              type="time"
              id="desayunoInicial"
              value={horaDesayunoInicial}
              onChange={(e) => setHoraDesayunoInicial(e.target.value)}
            />

            <b style={{ margin: '0 10px' }}>Fin</b>
            <input
              type="time"
              id="desayunoFinal"
              value={horaDesayunoFinal}
              onChange={(e) => setHoraDesayunoFinal(e.target.value)}
            />
          </div>
        </div>

        <div id="horaAlmuerzo">
          <label id="l_almuerzo" htmlFor="almuerzoInicial">
            <b>Horario de Almuerzo</b>
          </label>
          <div className="hora-container">
            <b style={{ marginRight: '10px' }}>Inicio</b>
            <input
              type="time"
              id="almuerzoInicial"
              value={horaAlmuerzoInicial}
              onChange={(e) => setHoraAlmuerzoInicial(e.target.value)}
            />
            <b style={{ margin: '0 10px' }}>Fin</b>
            <input
              type="time"
              id="almuerzoFinal"
              value={horaAlmuerzoFinal}
              onChange={(e) => setHoraAlmuerzoFinal(e.target.value)}
            />
          </div>
        </div>

        <div id="btnRegistrar">
          <button id="buttonRRegistrar" type="submit">
            Aceptar
          </button>
        </div>
      </form>
    </div>
  );
};

export default Horarios;
