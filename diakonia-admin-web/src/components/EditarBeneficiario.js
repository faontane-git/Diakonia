import React, { useState, useEffect } from 'react';
import Cabecera from './Cabecera';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import '../estilos/EditarBeneficiario.css';

const EditarBeneficiario = ({ user }) => {
  const { institucionId, institucionN, convenioId, convenioN ,beneficiarioid } = useParams();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [cedula, setCedula] = useState('');
  const [f_nacimiento, setFNacimiento] = useState('');
  const [genero, setGenero] = useState('');
  const [n_contacto, setNContacto] = useState('');
  const [n_menores, setNMenores] = useState('');
  const [n_mayores, setNMayores] = useState('');

  const convertirTimestampAFecha = (timestamp) => {
    const fecha = new Date(timestamp.seconds * 1000);
    return fecha.toLocaleDateString('es-ES');
  };

  useEffect(() => {
    const obtenerDatosBeneficiario = async () => {
      const querydb = getFirestore();
      const docuRef = doc(querydb, 'beneficiarios', beneficiarioid);
      const docSnapshot = await getDoc(docuRef);

      if (docSnapshot.exists()) {
        const beneficiarioData = docSnapshot.data();

        // Asignar valores iniciales a los estados
        setNombre(beneficiarioData.nombre || '');
        setCedula(beneficiarioData.cedula || '');
        setFNacimiento(convertirTimestampAFecha(beneficiarioData.fecha_nacimiento) || '');
        setGenero(beneficiarioData.genero || '');
        setNContacto(beneficiarioData.numero_contacto || '');
        setNMenores(beneficiarioData.numero_de_personas_menores_en_el_hogar || '');
        setNMayores(beneficiarioData.numero_de_personas_mayores_en_el_hogar || '');
      }
    };

    obtenerDatosBeneficiario();
  }, [beneficiarioid]);


  const validarFormatoFecha = (input) => {
    const regexFecha = /^(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/;

    if (regexFecha.test(input)) {
     
    } else {
      // La fecha no tiene el formato correcto, puedes mostrar un mensaje de error o tomar otra acción.
      alert('Por favor, ingresa una fecha en formato dd/mm/yyyy');
      return false
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const regexFecha = /^(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/;

    if (regexFecha.test(f_nacimiento)) {
      const querydb = getFirestore();
      const docuRef = doc(querydb, 'beneficiarios', beneficiarioid);

      const fechaString =f_nacimiento;
      const [dia, mes, anio] = fechaString.split('/');
      const fechaNaci = new Date(`${anio}-${mes}-${dia}T00:00:00`);
      console.log(fechaNaci);
      const beneficiario = {
        nombre,
        cedula,
        fecha_nacimiento: fechaNaci,
        genero,
        numero_contacto: n_contacto,
        numero_de_personas_menores_en_el_hogar: n_menores,
        numero_de_personas_mayores_en_el_hogar: n_mayores,
      };
      try {
        await updateDoc(docuRef, beneficiario);
        console.log('Datos enviados:', beneficiario);
        navigate(`/beneficiarios/${institucionId}/${institucionN}/${convenioId}/${convenioN}`);
      } catch (error) {
        console.error('Error al modificar beneficiario:', error);
        alert(error.message);
      }
  }else{
    alert('Por favor, ingresa una fecha en formato dd/mm/yyyy');
  }};

  return (
    <div>
      <div className="centered-container">
        <Cabecera user={user} />
        <h3>Institución: {institucionN}</h3>
        <h3>Convenio: {convenioN}</h3>
        <h3>Editar Beneficiario</h3>

      </div>

      <form id="form_ebeneficiario" onSubmit={handleSubmit}>
        <div id="txtNombre">
          <label htmlFor="nombre"><b>Nombre</b></label>
          <input
            type="text"
            id="l_beneficiario"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div id="txtcedula">
          <label htmlFor="cedula"><b>Cédula</b></label>
          <input
            type="text"
            id="l_beneficiario"
            value={cedula}
            onChange={(e) => {
              // Permitir solo números y limitar la longitud a 10 dígitos
              const inputCedula = e.target.value.replace(/\D/g, '').slice(0, 10);
              setCedula(inputCedula);
            }}
          />
        </div>

        <div id="txtf_nacimiento">
          <label htmlFor="f_nacimiento"><b>Fecha de nacimiento</b></label>
          <input
            type="text"
            id="l_beneficiario"
            value={f_nacimiento}
            onChange={(e) => setFNacimiento(e.target.value)}
          />
        </div>

        <div id="txtgenero">
          <label htmlFor="genero"><b>Género</b></label>
          <select
            id="rol"
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
          >
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
          </select>
        </div>
        <div id="txtn_contacto">
          <label htmlFor="n_contacto"><b>Número de contacto</b></label>
          <input
            type="text"
            id="l_beneficiario"
            value={n_contacto}
            onChange={(e) => {
              // Permitir solo números y limitar la longitud a 10 dígitos
              const inputContacto = e.target.value.replace(/\D/g, '').slice(0, 10);
              setNContacto(inputContacto);
            }}
          />
        </div>

        <div id="txtn_menores">
          <label htmlFor="n_menores"><b>N. Hermanos menores</b></label>
          <input
            type="text"
            id="l_beneficiario"
            value={n_menores}
            onChange={(e) => {
              // Permitir solo números y limitar la longitud a 10 dígitos
              const inputMenores = e.target.value.replace(/\D/g, '').slice(0, 1);
              setNMenores(inputMenores);
            }}
          />
        </div>

        <div id="txtn_mayores">
          <label htmlFor="n_mayores"><b>N. Hermanos mayores:</b></label>
          <input
            type="text"
            id="l_beneficiario"
            value={n_mayores}
            onChange={(e) => {
              // Permitir solo números y limitar la longitud a 10 dígitos
              const inputMayores = e.target.value.replace(/\D/g, '').slice(0, 1);
              setNMayores(inputMayores);
            }}
          />
        </div>
        <div id='btnRegistrar'>
          <button id="buttonBRegistrar" type="submit">Cambiar Datos</button>
        </div>
      </form>
    </div>
  );
};

export default EditarBeneficiario;
