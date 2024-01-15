import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import Cabecera from './Cabecera';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import '../estilos/Horarios.css';

const Horarios = () => {
    const [horaDesayunoInicial, setHoraDesayunoInicial] = useState('');
    const [horaDesayunoFinal, setHoraDesayunoFinal] = useState('');
    const [horaAlmuerzoInicial, setHoraAlmuerzoInicial] = useState('');
    const [horaAlmuerzoFinal, setHoraAlmuerzoFinal] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validar que ningún campo esté en blanco
        if (
            horaDesayunoInicial === '' ||
            horaDesayunoFinal === '' ||
            horaAlmuerzoInicial === '' ||
            horaAlmuerzoFinal === ''
        ) {
            Swal.fire({
                icon: 'error',
                title: 'Campos Vacíos',
                text: 'Por favor, complete todos los campos antes de continuar.',
            });
            return;
        }

        // Aquí se asume que ya tienes inicializado Firebase y configurada tu base de datos Firestore
        const db = getFirestore();
        const horariosCollection = collection(db, 'horarios');

        // Crear un nuevo documento en la colección 'horarios' con las horas de desayuno y almuerzo
        try {
            await addDoc(horariosCollection, {
                horaDesayuno: {
                    inicial: horaDesayunoInicial,
                    final: horaDesayunoFinal,
                },
                horaAlmuerzo: {
                    inicial: horaAlmuerzoInicial,
                    final: horaAlmuerzoFinal,
                },
            });

            // Limpiar el formulario después de enviar los datos
            setHoraDesayunoInicial('');
            setHoraDesayunoFinal('');
            setHoraAlmuerzoInicial('');
            setHoraAlmuerzoFinal('');

            // Mostrar notificación de éxito
            Swal.fire({
                icon: 'success',
                title: 'Horarios Registrados',
                text: 'Los horarios se han registrado con éxito.',
            });

            console.log('Horarios guardados exitosamente');
        } catch (error) {
            console.error('Error al guardar los horarios:', error);
        }
    };

    return (
        <div className="centered-container">
            <div>
                <Cabecera />
                <h1>Horarios</h1>
            </div>

            <form id="form_horarios" onSubmit={handleSubmit}>
                <div id="horaDesayuno" className="horario-group">
                    <label id="l_desayuno" htmlFor="desayunoInicial">
                        <b>Horario de Desayuno</b>
                    </label>
                    <div className="hora-container">
                        <b style={{ marginRight: '10px' }}>Inicio</b>
                        <input
                            type="time"
                            id="desayunoInicial"
                            value={horaDesayunoInicial}
                            onChange={(e) => setHoraDesayunoInicial(e.target.value)}
                        />

                        <b style={{ margin: '0 10px' }}>Fin</b>
                        <input
                            type="time"
                            id="desayunoFinal"
                            value={horaDesayunoFinal}
                            onChange={(e) => setHoraDesayunoFinal(e.target.value)}
                        />
                    </div>
                </div>

                <div id="horaAlmuerzo">
                    <label id="l_almuerzo" htmlFor="almuerzoInicial">
                        <b>Horario de Almuerzo</b>
                    </label>
                    <div className="hora-container">
                        <b style={{ marginRight: '10px' }}>Inicio</b>
                        <input
                            type="time"
                            id="almuerzoInicial"
                            value={horaAlmuerzoInicial}
                            onChange={(e) => setHoraAlmuerzoInicial(e.target.value)}
                        />
                        <b style={{ margin: '0 10px' }}>Fin</b>
                        <input
                            type="time"
                            id="almuerzoFinal"
                            value={horaAlmuerzoFinal}
                            onChange={(e) => setHoraAlmuerzoFinal(e.target.value)}
                        />
                    </div>
                </div>

                <div id="btnRegistrar">
                    <button id="buttonRRegistrar" type="submit">
                        Aceptar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Horarios;
