import React from "react"
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {NavigationContainer} from '@react-navigation/native'
import Home from "../Ventanas/Home"
import Login from "../Ventanas/Login"
import Registro from "../Ventanas/Registro"
import Asistencia from "../Ventanas/Asistencia"
import VerRegistro from "../Ventanas/VerRegistro"
import Seguimiento from "../Ventanas/Seguimiento"
import Opciones from "../Ventanas/Opciones"
import EditarPerfil from "../Ventanas/EditarPerfil"

const Stack = createNativeStackNavigator()
const MainStack = () => {
return (
    <Stack.Navigator>
        <Stack.Screen
            name='Login'
            component={Login}
        />
        <Stack.Screen
            name='Home'
            component={Home}
        />
        <Stack.Screen 
            name="Registrar" 
            component={Registro} 
        />
        <Stack.Screen 
            name="Asistencia" 
            component={Asistencia} 
        />
        <Stack.Screen 
            name="VerRegistro" 
            component={VerRegistro} 
        />
         <Stack.Screen 
            name="Seguimiento" 
            component={Seguimiento} 
        />
        <Stack.Screen 
            name="Opciones" 
            component={Opciones} 
        />
        <Stack.Screen 
            name="EditarPerfil" 
            component={EditarPerfil} 
        />
    </Stack.Navigator>
 )
}
export default MainStack