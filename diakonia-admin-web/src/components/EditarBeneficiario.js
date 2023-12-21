import React, { useState, useEffect } from 'react';
import Cabecera from './Cabecera';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import '../estilos/EditarBeneficiario.css';

const EditarBeneficiario = () => {
  const { institucionId, institucionN, beneficiarioid } = useParams();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [cedula, setCedula] = useState('');
  const [f_nacimiento, setFNacimiento] = useState('');
  const [genero, setGenero] = useState('');
  const [n_contacto, setNContacto] = useState('');
  const [n_menores, setNMenores] = useState('');
  const [n_mayores, setNMayores] = useState('');

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
        setFNacimiento(beneficiarioData.fecha_nacimiento || '');
        setGenero(beneficiarioData.genero || '');
        setNContacto(beneficiarioData.numero_contacto || '');
        setNMenores(beneficiarioData.numero_de_personas_menores_en_el_hogar || '');
        setNMayores(beneficiarioData.numero_de_personas_mayores_en_el_hogar || '');
      }
    };

    obtenerDatosBeneficiario();
  }, [beneficiarioid]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const querydb = getFirestore();
    const docuRef = doc(querydb, 'beneficiarios', beneficiarioid);

    const beneficiario = {
      nombre,
      cedula,
      fecha_nacimiento: f_nacimiento,
      genero,
      numero_contacto: n_contacto,
      numero_de_personas_menores_en_el_hogar: n_menores,
      numero_de_personas_mayores_en_el_hogar: n_mayores,
    };

    try {
      await updateDoc(docuRef, beneficiario);
      console.log('Datos enviados:', beneficiario);
      navigate(`/beneficiarios/${institucionId}/${institucionN}`);
    } catch (error) {
      console.error('Error al modificar beneficiario:', error);
      alert(error.message);
    }
  };

  return (
    <div className="centered-container">
      <Cabecera />
      <h1>Editar Beneficiario</h1>

      <form onSubmit={handleSubmit}>
        <div id="txtNombre">
          <label htmlFor="nombre"><b>Nombre:</b></label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div id="txtcedula">
          <label htmlFor="cedula"><b>Cédula:</b></label>
          <input
            type="text"
            id="cedula"
            value={cedula}
            onChange={(e) => {
              // Permitir solo números y limitar la longitud a 10 dígitos
              const inputCedula = e.target.value.replace(/\D/g, '').slice(0, 10);
              setCedula(inputCedula);
            }}
          />
        </div>

        <div id="txtf_nacimiento">
          <label htmlFor="f_nacimiento"><b>Fecha de nacimiento:</b></label>
          <input
            type="text"
            id="f_nacimiento"
            value={f_nacimiento}
            onChange={(e) => setFNacimiento(e.target.value)}
          />
        </div>

        <div id="txtgenero">
          <label htmlFor="genero"><b>Género:</b></label>
          <select
            id="genero"
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
          >
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
          </select>
        </div>
        <div id="txtn_contacto">
          <label htmlFor="n_contacto"><b>Número de contacto:</b></label>
          <input
            type="text"
            id="n_contacto"
            value={n_contacto}
            onChange={(e) => {
              // Permitir solo números y limitar la longitud a 10 dígitos
              const inputContacto = e.target.value.replace(/\D/g, '').slice(0, 10);
              setNContacto(inputContacto);
            }}
          />
        </div>

        <div id="txtn_menores">
          <label htmlFor="n_menores"><b>N. Hermanos menores:</b></label>
          <input
            type="text"
            id="n_menores"
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
            id="n_mayores"
            value={n_mayores}
            onChange={(e) => {
              // Permitir solo números y limitar la longitud a 10 dígitos
              const inputMayores = e.target.value.replace(/\D/g, '').slice(0, 1);
              setNMayores(inputMayores);
            }}
          />
        </div>

        <button id="buttonBRegistrar" type="submit">Cambiar Datos</button>
      </form>
    </div>
  );
};

export default EditarBeneficiario;
