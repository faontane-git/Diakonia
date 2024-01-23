import React from 'react';
import Cabecera from './Cabecera';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Swal from 'sweetalert2';
import '../estilos/Registrar.css';
import { Button } from '@mui/material';
import { getFirestore, doc, updateDoc, query, collection, where, getDocs, addDoc } from 'firebase/firestore';
import { useAuthContext } from './AuthContext'; // Ruta real a tu AuthContext

const RegistroInstitucion = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const goBack = () => {
    navigate('/verInstitucion');
  };

  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [ruc, setRuc] = useState('');
  const [direccion, setDireccion] = useState('');
  const [desayuno, setDesayuno] = useState(false);
  const [almuerzo, setAlmuerzo] = useState(false);
  const [archivo, setArchivo] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (nombre === '' || telefono === '' || ruc === '') {
      Swal.fire({
        title: 'Error',
        text: '¡Por favor llene todos los campos!',
        icon: 'error',
      });
      return;
    } else if (ruc.length < 13) {
      Swal.fire({
        title: 'Error',
        text: '¡El ruc debe tener 13 dígitos!',
        icon: 'error',
      });
      return;
    }

    const firestore = getFirestore();
    const InstitucionCollection = collection(firestore, 'instituciones');

    const institucion = {
      nombre: nombre,
      telefono: telefono,
      ruc: ruc,
      activo: true,
      observacion: '',
    };

    // Aquí puedes manejar el archivo como sea necesario, por ejemplo, subirlo a un servicio de almacenamiento.

    const agregar = addDoc(InstitucionCollection, institucion);

    agregar
      .then(() => {
        Swal.fire({
          title: 'Éxito',
          text: '¡Nueva institución añadida!',
          icon: 'success',
        });
        goBack();
        // Guardar información en el histórico
        const historicoDatos = {
          usuario: user.nombre,  // Reemplaza con el nombre del usuario real
          correo: user.email,  // Reemplaza con el nombre del usuario real
          accion: 'Institución Creada: ' + institucion.nombre,  // Mensaje personalizado
          fecha: new Date().toLocaleDateString(),
          hora: new Date().toLocaleTimeString(),  // Hora actual
        };
        const firestore = getFirestore();
        const hitoricoCollection = collection(firestore, 'historico');
        addDoc(hitoricoCollection, historicoDatos);
      })
      .catch((error) => {
        Swal.fire({
          title: 'Error',
          text: '¡Error al agregar institución!',
          icon: 'error',
        });
        console.error('Error al agregar institución:', error);
      });
  };

  const handleArchivoChange = (event) => {
    const archivoSeleccionado = event.target.files[0];
    setArchivo(archivoSeleccionado);
  };

  return (
    <div>
      <div className="centered-container">
        <Cabecera />
        <div style={{ textAlign: 'left', marginLeft: '30px', marginTop: '10px' }}>
          <Button variant="contained" style={{ backgroundColor: '#890202', color: 'white' }} onClick={goBack}>
            Volver
          </Button>
        </div>
        <h1>Registrar Institución</h1>
      </div>


      <form id="form_eregistrar" onSubmit={handleSubmit}>
        <div id="txtNombre">
          <label htmlFor="nombre">
            <b>Nombre</b>
          </label>
          <input type="text" id="l_registrar" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>

        <div id="txtTelefono">
          <label htmlFor="telefono">
            <b>Teléfono</b>
          </label>
          <input
            type="text"
            id="l_registrar"
            value={telefono}
            onChange={(e) => {
              const inputTelefono = e.target.value.replace(/\D/g, '').slice(0, 10);
              setTelefono(inputTelefono);
            }}
          />
        </div>

        <div id="txtDireccion">
          <label htmlFor="direccion">
            <b>RUC</b>
          </label>
          <input
            type="text"
            id="l_registrar"
            value={ruc}
            onChange={(e) => {
              const inputRuc = e.target.value.replace(/\D/g, '').slice(0, 13);
              setRuc(inputRuc);
            }}
          />
        </div>

        <div id="btnRegistrar">
          <button id="buttonRRegistrar" type="submit">
            Registrar
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistroInstitucion;
