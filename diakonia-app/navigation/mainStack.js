import React from "react"
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {NavigationContainer} from '@react-navigation/native'
import Home from "../Ventanas/Home"
import Login from "../Ventanas/Login"
import Registro from "../Ventanas/Registrar/Registro"
import Asistencia from "../Ventanas/Asistencia/Asistencia"
import VerRegistro from "../Ventanas/VerRegistro/VerRegistro"
import Seguimiento from "../Ventanas/Seguimiento/Seguimiento"
import Opciones from "../Ventanas/Opciones/Opciones"
import CambiarContraseña from "../Ventanas/Opciones/CambiarContraseña"
import OpcionesSeguimiento from "../Ventanas/Seguimiento/OpcionesSeguimiento"
import Peso from "../Ventanas/Seguimiento/Peso"
import Hemoglobina from "../Ventanas/Seguimiento/Hemoglobina"
import Talla from "../Ventanas/Seguimiento/Talla"
import Info from "../Ventanas/VerRegistro/Info"
import TomarAsistencia from "../Ventanas/Asistencia/TomarAsistencia"
import VerAsistencia from "../Ventanas/Asistencia/VerAsistencia"
import TomarHuella from "../Ventanas/Asistencia/TomarHuella"
import QR from "../Ventanas/Asistencia/QR"

 
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
            name="CambiarContraseña" 
            component={CambiarContraseña}
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="OpcionesSeguimiento" 
            component={OpcionesSeguimiento}
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="Regresar" 
            component={Seguimiento}
            options={{ headerShown: false }} 
        />
        <Stack.Screen
            name='Peso'
            component={Peso}
            options={{ headerShown: false }} 
        />
        <Stack.Screen
            name='Hemoglobina'
            component={Hemoglobina}
            options={{ headerShown: false }} 
        />
        <Stack.Screen
            name='Talla'
            component={Talla}
            options={{ headerShown: false }} 
        />
        <Stack.Screen
            name='Info'
            component={Info}
            options={{ headerShown: false }} 
        />
        <Stack.Screen
            name='TomarAsistencia'
            component={TomarAsistencia}
            options={{ headerShown: false }} 
        />
        <Stack.Screen
            name='VerAsistencia'
            component={VerAsistencia}
            options={{ headerShown: false }} 
        />
        <Stack.Screen
            name='TomarHuella'
            component={TomarHuella}
            options={{ headerShown: false }} 
        />
        <Stack.Screen
            name='QR'
            component={QR}
            options={{ headerShown: false }} 
        />
    </Stack.Navigator>
 )
}
export default MainStack