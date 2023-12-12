import React from 'react';
import Cabecera from './Cabecera';
import LinesChart from './Linechart';
import { useParams } from 'react-router-dom';


const VerGrafica = ({nutricion}) => {
    
    const {institucionId,beneficiarioid} = useParams();

    const beneficios = [0, 56, 20, 36, 80, 40, 30, -20, 25, 30, 12, 60];
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const data = [20, 25, 60, 65, 45, 10, 0, 25, 35, 7, 20, 25]
    const beneficiarioSeleccionado = nutricion.find((benf) => benf.id ===  parseInt(beneficiarioid, 10)) ;
    return (
    <div>
        <Cabecera/>
      <h1>Nutricion gráfica de {beneficiarioSeleccionado.nombre}</h1>
      <div className="bg-light mx-auto px-2 border border-2 border-primary" style={{width:"450px", height:"230px"}}>
                    <LinesChart beneficios={beneficios} meses={meses} datos={data}/>
                </div>
        </div>
  )
}

export default VerGrafica;