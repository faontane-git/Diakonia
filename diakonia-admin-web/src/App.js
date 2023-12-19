import { Routes, Route } from "react-router-dom"

import { useState } from "react"

import firebaseApp from "./firebase-config.js"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";



import Inicio from "./components/Inicio.js"
import Instituciones from "./components/Instituciones.js"
import Beneficiarios from "./components/Beneficiarios.js"
import Seguimiento from "./components/Seguimiento.js"
import Usuarios from "./components/Usuarios.js"
import Registrar from "./components/Registrar.js"
import VerInstitucion from "./components/VerInstitucion.js"
import ListaBeneficiarios from "./components/ListaBeneficiarios.js"
import EditarBeneficiario from "./components/EditarBeneficiario.js"
import Login from "./components/login.js"
import RegistroUsuario from "./components/RegistraUsuario.js"
import VerUsuarios from "./components/VerUsuarios.js"
import VerAsistencias from "./components/VerAsistencias.js"
import ListaAsistencias from "./components/ListaAsistencias.js"
import Nutricion from "./components/Nutricion.js"
import ListaNutricion from "./components/ListaNutricion.js"
import VerGrafica from "./components/Vergrafica.js"
import LeerExcel from "./components/LeerExcel.js"
import AñadirNutricion from "./components/AñadirNutricion.js"


const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);




function Aplicacion() {
  const [instituciones, setInstituciones] = useState([
    {
      id: 1,
      nombre: 'Institución 1',
      telefono: '123-456-7890',
      ubicacion: 'Ciudad A',
      desayuno: true,
      almuerzo: false,
    },
    {
      id: 2,
      nombre: 'Institución 2',
      telefono: '987-654-3210',
      ubicacion: 'Ciudad B',
      desayuno: false,
      almuerzo: true,
    },
    // Agrega más instituciones según sea necesario
  ]);
  const [beneficiarios, setBeneficiarios] = useState([
    {
      id: 1,
      institucionId: 1,
      nombre: 'benf 1',
      edad: 15,
    },
    {
      id: 3,
      institucionId: 1,
      nombre: 'benf 3',
      edad: 16,
    },
    {
      id: 2,
      nombre: 'benf 2',
      institucionId: 2,
      edad: 8,

    },

  ]);

  const agregarBeneficiario = (nuevoBeneficiario) => {
    setBeneficiarios((prevBeneficiarios) => [...prevBeneficiarios, ...nuevoBeneficiario]);
  };
  const usuarios = [
    {
      id: 1,
      nombre: 'pepe',
      contraseña: '12345',
      usuario: 'user 1',

    },
    {
      id: 3,
      nombre: 'ana',
      contraseña: '54321',
      usuario: 'user 3',

    },
    {
      id: 2,
      nombre: 'titi',
      contraseña: '45321',
      usuario: 'user 2',

    },

  ];

  const asistencias = [
    {
      id: 1,
      nombre: 'benf 1',
      instituciones: [
        {
          id: 1,
          asistencias: [
            { mes: 'enero', dias: ['24', '25', '26', '27'], cantidad: 4 },
            { mes: 'febrero', dias: ['28'], cantidad: 1 },
            { mes: 'marzo', dias: ['01'], cantidad: 1 },
            { mes: 'diciembre', dias: ['01', '02', '03'], cantidad: 3 },
          ],
        },
        {
          id: 2,
          asistencias: [
            { mes: 'febrero', dias: ['29'], cantidad: 1 },
            { mes: 'marzo', dias: [], cantidad: 0 },
            { mes: 'diciembre', dias: ['30', '31'], cantidad: 2 },
          ],
        },
      ],
    },
    {
      id: 2,
      nombre: 'benf 2',
      instituciones: [
        {
          id: 1,
          asistencias: [
            { mes: 'febrero', dias: ['24', '25', '26'], cantidad: 3 },
            // Continuar para los meses siguientes...
            { mes: 'diciembre', dias: ['01', '02'], cantidad: 2 },
          ],
        },
        {
          id: 2,
          asistencias: [
            { mes: 'febrero', dias: ['27'], cantidad: 1 },
            { mes: 'marzo', dias: ['28', '29'], cantidad: 2 },
            // Continuar para los meses siguientes...
            { mes: 'diciembre', dias: ['03', '04'], cantidad: 2 },
          ],
        },
      ],
    },
    {
      id: 3,
      nombre: 'benf 3',
      instituciones: [
        {
          id: 1,
          asistencias: [
            { mes: 'enero', dias: ['24', '25', '26'], cantidad: 3 },
            { mes: 'febrero', dias: ['27', '28'], cantidad: 2 },
            { mes: 'marzo', dias: ['01'], cantidad: 1 },
            // Continuar para los meses siguientes...
            { mes: 'diciembre', dias: ['02', '03'], cantidad: 2 },
          ],
        },
      ],
    },
   ];


  const nutricion = [
    {
      id: 1,
      institucionId: 1,
      nombre: 'benf 1',
      imc: '40',
      peso: '45',

    },
    {
      id: 3,
      institucionId: 1,
      nombre: 'benf 3',
      imc: '40',
      peso: '45',

    },
    {
      id: 2,
      institucionId: 2,
      nombre: 'benf 2',
      imc: '40',
      peso: '45',
    },
  ];

  const [user, setUser] = useState(null);


  async function getRol(uid) {
    const docuRef = doc(firestore, `usuarios/${uid}`);
    const docuCifrada = await getDoc(docuRef);
    const infoFinal = docuCifrada.data().rol;
    return infoFinal;
  }

  function setUserWithFirebaseAndRol(usuarioFirebase) {
    getRol(usuarioFirebase.uid).then((rol) => {
      const userData = {
        uid: usuarioFirebase.uid,
        email: usuarioFirebase.email,
        rol: rol,
      };
      setUser(userData);
    });
  }


  onAuthStateChanged(auth, (usuarioFirebase) => {
    if (usuarioFirebase) {
      //funcion final

      if (!user) {
        //setUser(usuarioFirebase);
        setUserWithFirebaseAndRol(usuarioFirebase);
      }
    } else {
      setUser(null);
    }
  });


  return (
    <div className="Aplicacion">

      {user === null ? <Login user={user} setUser={setUser} /> :
        <Routes>


          <Route path="/" element={<Inicio />} />
          <Route path="instituciones" element={<Instituciones />} />
          <Route path="beneficiarios" element={<Beneficiarios instituciones={instituciones} />} />
          <Route path="seguimiento" element={<Seguimiento />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="registrar" element={<Registrar />} />
          <Route path="verInstitucion" element={<VerInstitucion instituciones={instituciones} />} />
          <Route path="beneficiarios/:institucionId/:institucionN" element={<ListaBeneficiarios instituciones={instituciones} beneficiarios={beneficiarios} />} />
          <Route path="editar-beneficiario/:institucionId/:beneficiarioid" element={<EditarBeneficiario instituciones={instituciones} beneficiarios={beneficiarios} />} />
          <Route path="registrarUsuario" element={<RegistroUsuario />} />
          <Route path="verUsuarios" element={<VerUsuarios usuarios={usuarios} />} />
          <Route path="asistencias" element={<VerAsistencias instituciones={instituciones} />} />
          <Route path="asistencias/:institucionId" element={<ListaAsistencias instituciones={instituciones} asistencias={asistencias} />} />
          <Route path="nutricion" element={<Nutricion instituciones={instituciones} />} />
          <Route path="nutricion/:institucionId/:institucionN" element={<ListaNutricion instituciones={instituciones} nutricion={nutricion} />} />
          <Route path="verGrafica/:institucionId/:beneficiarioid" element={<VerGrafica nutricion={nutricion} />} />
          <Route path="beneficiarios/:institucionId/:institucionN/añadirbenef" element={<LeerExcel beneficiarios={beneficiarios} agregarBeneficiario={agregarBeneficiario} />} />
          <Route path="nutricion/:institucionId/:institucionN/añadirNutricion" element={<AñadirNutricion />} />
        </Routes>
      }
    </div>
  )
}

export default Aplicacion