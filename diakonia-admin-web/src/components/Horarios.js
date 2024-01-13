import React, { useState, useEffect } from 'react';
import Cabecera from './Cabecera';
import '../estilos/Horarios.css';

const Horarios = () => {
    const [horaDesayuno, setHoraDesayuno] = useState('');
    const [horaAlmuerzo, setHoraAlmuerzo] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // Aquí puedes realizar la lógica para manejar los datos del formulario
        console.log('Hora de Desayuno:', horaDesayuno);
        console.log('Hora de Almuerzo:', horaAlmuerzo);
    };

    return (
        <div className="centered-container">
            <div>
                <Cabecera />
                <h1>Horarios</h1>
            </div>

            <form id="form_horarios" onSubmit={handleSubmit}>
                <div id="horaDesayuno">
                    <label id="l_desayuno" htmlFor="desayuno"><b>Hora de Desayuno</b></label>
                    <input
                        type="time"
                        id="desayuno"
                        value={horaDesayuno}
                        onChange={(e) => setHoraDesayuno(e.target.value)}
                    />
                </div>

                <div id="horaAlmuerzo">
                    <label id="l_almuerzo" htmlFor="almuerzo"><b>Hora de Almuerzo</b></label>
                    <input
                        type="time"
                        id="almuerzo"
                        value={horaAlmuerzo}
                        onChange={(e) => setHoraAlmuerzo(e.target.value)}
                    />
                </div>

                <div id="btnRegistrar">
                    <button id="buttonRRegistrar" type="submit">
                        Aceptar
                    </button>
                </div>
            </form>

        </div>
    );
}

export default Horarios;
