import React, { useState, useEffect } from 'react';
import '../estilos/ListaAsistencias.css';
import Cabecera from './Cabecera';

const ListaAsistencias = ({ asistencias }) => {
  // Obtener la lista única de meses
  const mesesUnicos = Array.from(
    new Set(
      asistencias.flatMap((beneficiario) =>
        beneficiario.instituciones.flatMap((institucion) =>
          institucion.asistencias.map((asistencia) => asistencia.mes)
        )
      )
    )
  );


  // Estado local para rastrear el mes seleccionado (inicializado en "enero")
  const [mesSeleccionado, setMesSeleccionado] = useState('enero');
  const [diasDelMes, setDiasDelMes] = useState([]);

  // Actualizar los días del mes cuando se cambia el mes seleccionado
  useEffect(() => {
    if (mesSeleccionado) {
      const diasUnicos = Array.from(
        new Set(
          asistencias.flatMap((beneficiario) =>
            beneficiario.instituciones.flatMap((institucion) =>
              institucion.asistencias
                .filter((asistencia) => asistencia.mes === mesSeleccionado)
                .flatMap((asistencia) => asistencia.dias)
            )
          )
        )
      );
      setDiasDelMes(diasUnicos);
      console.log(diasUnicos);
    } else {
      setDiasDelMes([]);
    }
  }, [mesSeleccionado, asistencias]);

  return (
    <div className="centered-container">
      <Cabecera />
      <h1>Asistencias</h1>

      <label htmlFor="mesSeleccionado" id="labelMes">
        Filtrar por mes:
        <select
          id="mesSeleccionado"
          value={mesSeleccionado}
          onChange={(e) => setMesSeleccionado(e.target.value)}
        >
          {mesesUnicos.map((mes, index) => (
            <option key={index} value={mes}>
              {mes}
            </option>
          ))}
        </select>
      </label>

      {/* Mostrar el mes seleccionado en un h2 */}
      <h2>{mesSeleccionado.toUpperCase()}</h2>

      <table>
        <thead>
          <tr>
            <th>Beneficiario</th>
            {diasDelMes.map((dia, index) => (
              <th key={index}>{dia}</th>
            ))}
            {/* Nueva columna para días asistidos */}
            <th>Días Asistidos</th>
          </tr>
        </thead>
        <tbody>
          {asistencias.map((beneficiario) => (
            <tr key={beneficiario.id}>
              <td>{beneficiario.nombre}</td>

              {diasDelMes.map((dia, index) => {
                const asistio = beneficiario.instituciones.some(
                  (institucion) =>
                    institucion.asistencias
                      .filter(
                        (asistencia) =>
                          asistencia.mes === mesSeleccionado &&
                          asistencia.dias.includes(dia)
                      )
                      .reduce(
                        (total, asistencia) => total + asistencia.cantidad,
                        0
                      ) > 0
                );

                return (
                  <td key={index} className={asistio ? 'asistencia' : 'falta'}>
                    {asistio ? 'A' : 'F'}
                  </td>
                );
              })}
              {/* Nueva celda para la cantidad de días asistidos */}
              <td>
                {beneficiario.instituciones
                  .flatMap((institucion) =>
                    institucion.asistencias
                      .filter((asistencia) => asistencia.mes === mesSeleccionado)
                      .reduce(
                        (total, asistencia) => total + asistencia.cantidad,
                        0
                      )
                  )
                  .reduce((total, cantidad) => total + cantidad, 0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaAsistencias;
