import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Cabecera from './Cabecera';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import '../estilos/Historico.css';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';

const Historico = () => {
    const [historicoData, setHistoricoData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistoricoData = async () => {
            try {
                const querydb = getFirestore();
                const historicoCollection = collection(querydb, 'historico');

                const historicoSnapshot = await getDocs(historicoCollection);
                const datosHistorico = historicoSnapshot.docs
                    .map((doc) => ({ id: doc.id, ...doc.data() }))
                    .sort((a, b) => {
                        // Comparar fechas primero
                        const fechaA = new Date(a.fecha);
                        const fechaB = new Date(b.fecha);

                        if (fechaA > fechaB) return -1; // Invertir el orden si fechaA es mayor
                        if (fechaA < fechaB) return 1;

                        // Si las fechas son iguales, comparar horas, minutos y segundos
                        const horaA = a.hora.split(':');
                        const horaB = b.hora.split(':');

                        if (horaA[0] < horaB[0]) return -1;
                        if (horaA[0] > horaB[0]) return 1;

                        if (horaA[1] < horaB[1]) return -1;
                        if (horaA[1] > horaB[1]) return 1;

                        // Comparar segundos
                        const segundoA = horaA[2] ? horaA[2] : 0;
                        const segundoB = horaB[2] ? horaB[2] : 0;

                        if (segundoA < segundoB) return -1;
                        if (segundoA > segundoB) return 1;

                        // Si las fechas y horas son iguales
                        return 0;
                    });

                setHistoricoData(datosHistorico);
            } catch (error) {
                console.error('Error al cargar datos históricos:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al cargar datos históricos',
                });
            }
        };

        fetchHistoricoData();
    }, []);

    return (
        <div>
            <div className="centered-container">
                <Cabecera />
                <h1>Histórico</h1>

                <TableContainer component={Paper} className="historico-table">
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Nombre</TableCell>
                                <TableCell style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Correo</TableCell>
                                <TableCell style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Acción</TableCell>
                                <TableCell style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Fecha</TableCell>
                                <TableCell style={{ backgroundColor: '#890202', color: 'white', fontSize: '16px' }}>Hora</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {historicoData.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.usuario}</TableCell>
                                    <TableCell>{item.correo}</TableCell>
                                    <TableCell>{item.accion}</TableCell>
                                    <TableCell>{item.fecha}</TableCell>
                                    <TableCell>{item.hora}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
};

export default Historico;
