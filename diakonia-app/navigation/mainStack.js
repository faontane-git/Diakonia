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
import CambiarContraseña from "../Ventanas/CambiarContraseña"
import OpcionesSeguimiento from "../Ventanas/OpcionesSeguimiento"
 
const Stack = createNativeStackNavigator()
const MainStack = () => {
return (
    <Stack.Navigator>
        <Stack.Screen
            name='Login'
            component={Login}
            options={{ headerShown: false }}
        />
        <Stack.Screen
            name='Home'
            component={Home}
            options={{ headerShown: false }}
        />
        <Stack.Screen 
            name="Registrar" 
            component={Registro} 
            options={{ headerShown: false }}
        />
        <Stack.Screen 
            name="Asistencia" 
            component={Asistencia}
            options={{ headerShown: false }}
        />
        <Stack.Screen 
            name="VerRegistro" 
            component={VerRegistro}
            options={{ headerShown: false }}
        />
         <Stack.Screen 
            name="Seguimiento" 
            component={Seguimiento}
            options={{ headerShown: false }}
        />
        <Stack.Screen 
            name="Opciones" 
            component={Opciones}
            options={{ headerShown: false }}
        />
        <Stack.Screen 
            name="EditarPerfil" 
            component={EditarPerfil}
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="CambiarContraseña" 
            component={CambiarContraseña}
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="OpcionesSeguimiento" 
            component={OpcionesSeguimiento}
            options={{ headerShown: false }} 
        />
    </Stack.Navigator>
 )
}
export default MainStack