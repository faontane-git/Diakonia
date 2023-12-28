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
import EditarInstitucion from "./components/EditarInstitucion.js";
import EditarUsuarios from "./components/EditarUsuarios.js"
import CambiarContra from "./components/CambiarContra.js"


const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);




function Aplicacion() {
 
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
          <Route path="/" element={<Inicio user={user} />} />
          <Route path="cambiarContra" element={<CambiarContra user={user} />} />
          {user.rol !== undefined && user.rol !== "Registrador" ? 
          <>
          <Route path="instituciones" element={<Instituciones user={user} />} />
          <Route path="beneficiarios" element={<Beneficiarios user={user} />} />
          <Route path="seguimiento" element={<Seguimiento user={user} />} />
          
          <Route path="registrar" element={<Registrar user={user}/>} />
          <Route path="verInstitucion" element={<VerInstitucion user={user} />} />
          <Route path="editar-institucion/:institucionId" element={<EditarInstitucion user={user}/>} />
          <Route path="beneficiarios/:institucionId/:institucionN" element={<ListaBeneficiarios user={user} />} />
          <Route path="editar-beneficiario/:institucionId/:institucionN/:beneficiarioid" element={<EditarBeneficiario user={user} />} />
         
          <Route path="asistencias" element={<VerAsistencias user={user} />} />
          <Route path="asistencias/:institucionId" element={<ListaAsistencias user={user} />} />
          <Route path="nutricion" element={<Nutricion user={user}/>} />
          <Route path="nutricion/:institucionId/:institucionN" element={<ListaNutricion user={user}/>} />
          <Route path="verGrafica/:institucionId/:beneficiarioid" element={<VerGrafica user={user} />} />
          <Route path="beneficiarios/:institucionId/:institucionN/añadirbenef" element={<LeerExcel user={user}/>} />
          <Route path="nutricion/:institucionId/:institucionN/añadirNutricion" element={<AñadirNutricion user={user}/>} />
          
          {user.rol === "Administrador" ? 
        <>
          <Route path="registrarUsuario" element={<RegistroUsuario user={user} />} />
          <Route path="verUsuarios" element={<VerUsuarios user={user} />} />
          <Route path="editar-usuario/:usuarioId" element={<EditarUsuarios user={user}/>} />
          <Route path="usuarios" element={<Usuarios user={user}/>} />
          </>
          : <Route path=""/>}</>
          :<Route path=""/>}
          
        </Routes>
        
      }
    </div>
  )
}

export default Aplicacion