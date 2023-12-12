import { Routes, Route } from "react-router-dom"
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




function Aplicacion() {
  const instituciones = [
    {
      id: 1,
      nombre: 'Institución 1',
      telefono: '123-456-7890',
      ubicacion: 'Ciudad A',
      desayuno: true,
      almuerzo: false,
    },
    {
      id:2,
      nombre: 'Institución 2',
      telefono: '987-654-3210',
      ubicacion: 'Ciudad B',
      desayuno: false,
      almuerzo: true,
    },
    // Agrega más instituciones según sea necesario
  ];
  const beneficiarios = [
    {
      id: 1,
      institucionId: 1,
      nombre: 'benf 1',
      edad: 15,
      ubicacion: 'Ciudad A',
      
    },
    {
      id: 3,
      institucionId: 1,
      nombre: 'benf 3',
      edad: 16,
      ubicacion: 'Ciudad A',
      
    },
    {
      id:2,
      nombre: 'benf 2',
      institucionId: 2,
      edad: 8,
      ubicacion: 'Ciudad B',
      
    },
   
  ];
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
      id:2,
      nombre: 'titi',
      contraseña: '45321',
      usuario: 'user 2',
      
    },
   
  ];
  
  const asistencias = [
    {
      id: 1,
      institucionId: 1,
      nombre: 'benf 1',
      asistencias: '4',
      lista: ['24-ene','25-ene','26-ene','27-ene'],
      
    },
    {
      id: 3,
      institucionId: 1,
      nombre: 'benf 3',
      asistencias: '3',
      lista: ['24-ene','25-ene','26-ene'],
      
    },
    {
      id:2,
      institucionId: 2,
      nombre: 'benf 2',
      asistencias: '4',
      lista: ['24-ene','25-ene','26-ene','27-ene'],
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
    id:2,
    institucionId: 2,
    nombre: 'benf 2',
    imc: '40',
    peso: '45',
  },
 ];
  return (
    <div className="Aplicacion">
      <Routes>
        <Route path="/" element={ <Login /> } />

        <Route path="inicio" element={ <Inicio /> } />
        <Route path="instituciones" element={ <Instituciones /> } />
        <Route path="beneficiarios" element={ <Beneficiarios instituciones={instituciones} /> } />
        <Route path="seguimiento" element={ <Seguimiento /> } />
        <Route path="usuarios" element={ <Usuarios /> } />
        <Route path="registrar" element={ <Registrar /> } />
        <Route path="verInstitucion" element={ <VerInstitucion instituciones={instituciones}/> } />
        <Route path="beneficiarios/:institucionId" element={<ListaBeneficiarios instituciones={instituciones}  beneficiarios={beneficiarios} />} />
        <Route path="editar-beneficiario/:institucionId/:beneficiarioid" element={<EditarBeneficiario instituciones={instituciones}  beneficiarios={beneficiarios} />} />
        <Route path="registrarUsuario" element={ <RegistroUsuario /> } />
        <Route path="verUsuarios" element={ <VerUsuarios usuarios={usuarios}/> } />
        <Route path="asistencias" element={ <VerAsistencias instituciones={instituciones} /> } />
        <Route path="asistencias/:institucionId" element={<ListaAsistencias instituciones={instituciones}  asistencias={asistencias} />} />
        <Route path="nutricion" element={ <Nutricion instituciones={instituciones} /> } />
        <Route path="nutricion/:institucionId" element={<ListaNutricion instituciones={instituciones}  nutricion={nutricion} />} />
        <Route path="verGrafica/:institucionId/:beneficiarioid" element={<VerGrafica nutricion={nutricion} />} />
      </Routes>
    </div>
  )
}

export default Aplicacion