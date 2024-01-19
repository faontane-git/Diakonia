import { Routes, Route } from "react-router-dom"

import { useState } from "react"

import firebaseApp from "./firebase-config.js"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";



import Inicio from "./components/Inicio.js"
import Instituciones from "./components/Instituciones.js"
import Beneficiarios from "./components/Beneficiarios.js"
import CredencialesComponent from "./components/Credencial.js"
import Seguimiento from "./components/Seguimiento.js"

import Registrar from "./components/Registrar.js"
import VerInstitucion from "./components/VerInstitucion.js"
import ListaBeneficiarios from "./components/ListaBeneficiarios.js"
import EditarBeneficiario from "./components/EditarBeneficiario.js"
import BeneficiariosConvenios from "./components/BeneficiariosConvenios.js";
import Login from "./components/login.js"


import VerAsistencias from "./components/VerAsistencias.js"
import ListaAsistencias from "./components/ListaAsistencias.js"
import Nutricion from "./components/Nutricion.js"
import ListaNutricion from "./components/ListaNutricion.js"
import VerGrafica from "./components/Vergrafica.js"
import LeerExcel from "./components/LeerExcel.js"
import AñadirNutricion from "./components/AñadirNutricion.js"
import EditarInstitucion from "./components/EditarInstitucion.js";

import Convenios from "./components/Convenios.js";
import EditarConvenio from "./components/EditarConvenio.js";
import AñadirConvenio from "./components/AñadirConvenio.js";

import Usuarios from "./components/Usuarios.js"
import RegistroUsuario from "./components/RegistraUsuario.js"
import VerUsuarios from "./components/VerUsuarios.js"
import EditarUsuarios from "./components/EditarUsuarios.js"
import Horarios from "./components/Horarios.js"
import Historico from "./components/Historico.js"



import CambiarContra from "./components/CambiarContra.js"
import { useAuthContext } from './components/AuthContext.js';
import AuthContextProvider from "./components/AuthContext.js";



import Publicas from "./components/Publicas.js"
import Privada from "./components/Privadas.js"
import UserRoute from "./components/UserRoute.js"
import RegistradorRoute from "./components/RegistradorRoute.js"
import { SupervisedUserCircleOutlined } from "@mui/icons-material";
import AsistenciaConvenios from "./components/AsistenciaConvenios.js";
import NutricionConvenios from "./components/NutricionConvenios.js";






const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);




function Aplicacion() {

  //const {  user } = useAuthContext();

  //const [user, setUser] = useState(null);


  /*async function getRol(uid) {
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
  });*/


  return (
    <div className="Aplicacion">
      <AuthContextProvider>

        <Routes>

          <Route path="/login" element={<Publicas />} >
            <Route index element={<Login />} />
          </Route>

          <Route path="Registrador" element={<RegistradorRoute />}>
            <Route index element={<Inicio />} />
            <Route path="cambiarContra" element={<CambiarContra />} />
          </Route>

          <Route path="/" element={<Privada />}>

            <Route index element={<Inicio />} />
            <Route path="cambiarContra" element={<CambiarContra />} />

            <Route path="instituciones" element={<Instituciones />} />

            <Route path="instituciones/:institucionId/:institucionN" element={<Convenios />} />
            <Route path="editar-convenio/:institucionId/:institucionN/:convenioId" element={<EditarConvenio />} />
            <Route path="instituciones/:institucionId/:institucionN/añadirConvenio" element={<AñadirConvenio />} />

            <Route path="beneficiarios" element={<Beneficiarios />} />
            <Route path="credencial/:institucionId/:institucionN/:convenioId/:convenioN/:arreglo" element={<CredencialesComponent />} />

            <Route path="seguimiento" element={<Seguimiento />} />

            <Route path="registrar" element={<Registrar />} />
            <Route path="verInstitucion" element={<VerInstitucion />} />
            <Route path="editar-institucion/:institucionId" element={<EditarInstitucion />} />
            <Route path="beneficiarios/:institucionId/:institucionN" element={<BeneficiariosConvenios />} />
            <Route path="beneficiarios/:institucionId/:institucionN/:convenioId/:convenioN" element={<ListaBeneficiarios />} />
            <Route path="editar-beneficiario/:institucionId/:institucionN/:convenioId/:convenioN/:beneficiarioid" element={<EditarBeneficiario />} />

            <Route path="asistencias" element={<VerAsistencias />} />
            <Route path="asistencias/:institucionId/:institucionN" element={<AsistenciaConvenios />} />
            <Route path="asistencias/:institucionId/:institucionN/:convenioId/:convenioN" element={<ListaAsistencias />} />
            <Route path="nutricion" element={<Nutricion />} />
            <Route path="horarios" element={<Horarios />} />
            <Route path="historico" element={<Historico />} />

            <Route path="nutricion/:institucionId/:institucionN" element={<NutricionConvenios />} />
            <Route path="nutricion/:institucionId/:institucionN/:convenioId/:convenioN" element={<ListaNutricion />} />
            <Route path="verGrafica/:institucionId/:institucionN/:convenioId/:convenioN/:beneficiarioid" element={<VerGrafica />} />
            <Route path="beneficiarios/:institucionId/:institucionN/:convenioId/:convenioN/añadirbenef" element={<LeerExcel />} />
            <Route path="nutricion/:institucionId/:institucionN/:convenioId/:convenioN/añadirNutricion" element={<AñadirNutricion />} />

            <Route path="usuarios" element={<UserRoute />}>
              <Route index element={<Usuarios />} />
              <Route path="verUsuarios" element={<VerUsuarios />} />
              <Route path="registrarUsuario" element={<RegistroUsuario />} />
              <Route path="editar-usuario/:usuarioId" element={<EditarUsuarios />} />

            </Route>
          </Route>


        </Routes>



        {/*}            // El usuario no está autenticado, mostrar componente de inicio de sesión
            <Login user={user} /> 
          ) : (
            // El usuario está autenticado, mostrar rutas protegidas
           


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
          )*/}


      </AuthContextProvider>

    </div>
  )
}

export default Aplicacion


/*<div className="Aplicacion">

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
    </div>*/