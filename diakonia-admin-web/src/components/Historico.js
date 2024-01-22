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
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Historico = () => {
  const [historicoData, setHistoricoData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistoricoData = async () => {
      try {
        const querydb = getFirestore();
        const historicoCollection = collection(querydb, 'historico');

        const historicoSnapshot = await getDocs(historicoCollection);
        const datosHistorico = historicoSnapshot.docs
          .map((doc) => {
            const fecha = doc.data().fecha;
            const hora = doc.data().hora;
            const fechaHora = moment(`${fecha} ${hora}`, 'DD/MM/YYYY HH:mm:ss').toISOString();
            return { id: doc.id, fechaHora, ...doc.data() };
          })
          .sort((a, b) => (a.fechaHora > b.fechaHora) ? -1 : 1);

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

  // Function to handle date selection
  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = moment(date).format('DD/MM/YYYY');
      console.log('Selected Date:', formattedDate);
    }
  };

  return (
    <div>
      <div className="centered-container">
        <Cabecera />
        <h1>Histórico</h1>

        <div className="filter-fecha-final">
          <label htmlFor="filtroFechaFinal">Seleccione una Fecha</label>
          <DatePicker
            id="filtroFecha"
            dateFormat="dd/MM/yyyy"
            selected={selectedDate}
            onChange={handleDateChange}
          />
        </div>

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
              {historicoData
                .filter((item) => {
                  return !selectedDate || moment(item.fecha, 'DD/MM/YYYY').isSame(selectedDate, 'day');
                })
                .map((item) => (
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
