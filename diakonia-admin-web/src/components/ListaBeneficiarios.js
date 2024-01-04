import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Cabecera from './Cabecera';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../estilos/ListaBeneficiarios.css';
import { getFirestore, collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import QRCode from 'qrcode.react'; // Importa la biblioteca qrcode.react

const ListaBeneficiarios = ({ user }) => {
  const { institucionId, institucionN, convenioId, convenioN } = useParams();
  const navigate = useNavigate();
  const goAñadirBenef = () => {
    navigate('añadirBenef');
  };

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const convertirTimestampAFecha = (timestamp) => {
    const fecha = new Date(timestamp.seconds * 1000);
    return fecha.toLocaleDateString('es-ES');
  };

  useEffect(() => {
    const querydb = getFirestore();
    const beneficiariosCollection = collection(querydb, 'beneficiarios');
    //const beneficiariosQuery = query(beneficiariosCollection, where('institucionId', '==', institucionId));
    const beneficiariosQuery = query(
      beneficiariosCollection,
      where('institucionId', '==', institucionId),
      where('convenioId', '==', convenioId)
    );

    getDocs(beneficiariosQuery).then((res) =>
      setData(res.docs.map((benf) => ({ id: benf.id, ...benf.data() })))
    );
  }, [institucionId]);

  const filteredData = data.filter((beneficiario) =>
    beneficiario.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function esActivo(beneficiario) {
    return beneficiario.activo === true;
  }

  async function eliminarBeneficiario(beneficiario) {
    Swal.fire({
      title: 'Advertencia',
      text: `Está seguro que desea eliminar ${beneficiario.nombre}`,
      icon: 'error',
      showDenyButton: true,
      denyButtonText: "No",
      confirmButtonText: "Si",
      confirmButtonColor: "#000000"
    }).then(async response => {
      if (response.isConfirmed) {
        const querydb = getFirestore();
        const docuRef = doc(querydb, 'beneficiarios', beneficiario.id);
        try {
          await updateDoc(docuRef, { activo: false });
          window.location.reload()
        } catch (error) {
          console.error('Error al eliminar institución:', error);
          alert(error.message);
        }
      }
    })
  };

  return (
    <div className="centered-container">
      <Cabecera user={user} />
      <h1>Lista de Beneficiarios de {institucionN}</h1>
      <h2>Convenio: {convenioN}</h2>
      <button id="buttonABeneficiarios" onClick={goAñadirBenef}>
        Añadir Beneficiarios
      </button>

      <div className="search-container-name">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cédula</th>
            <th>Fecha de nacimiento</th>
            <th>Género</th>
            <th>Menores en casa</th>
            <th>Mayores en casa</th>
            <th>Desayuno</th>
            <th>Almuerzo</th>
            <th>Código QR</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.filter(esActivo).map((beneficiario) => (
            <tr key={beneficiario.id}>
              <td>{beneficiario.nombre}</td>
              <td>{beneficiario.cedula}</td>
              <td>{convertirTimestampAFecha(beneficiario.fecha_nacimiento)}</td>
              <td>{beneficiario.genero}</td>
              <td>{beneficiario.numero_de_personas_menores_en_el_hogar}</td>
              <td>{beneficiario.numero_de_personas_mayores_en_el_hogar}</td>
              {beneficiario.desayuno.length !== 0 ? <td>Si</td> : <td>No</td>}
              {beneficiario.almuerzo.length !== 0 ? <td>Si</td> : <td>No</td>}
              {/* Muestra el código QR utilizando la biblioteca qrcode.react */}
              <td>
                <QRCode value={beneficiario.cedula} size={64} />
              </td>
              <td>
                <Link to={`/editar-beneficiario/${institucionId}/${institucionN}/${convenioId}/${convenioN}/${beneficiario.id}`}>
                  <button>Editar</button>
                </Link>
                <button onClick={() => eliminarBeneficiario(beneficiario)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaBeneficiarios;
