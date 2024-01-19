import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import html2pdf from 'html2pdf.js';
import '../estilos/Credencial.css';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import Cabecera from './Cabecera';

const CredencialesComponent = () => {
  const { institucionId, institucionN, convenioId, convenioN, arreglo } = useParams();
  const [datosCredencial, setDatosCredencial] = useState([]);

  const navigate = useNavigate();
  const goBack = () => {
    navigate(`/beneficiarios/${institucionId}/${institucionN}/${convenioId}/${convenioN}`);
  };

  useEffect(() => {
    try {
      const decodedData = JSON.parse(decodeURIComponent(arreglo));
      const datos = parseDatosCredencial(decodedData);
      console.log(datos);
      setDatosCredencial(datos);
    } catch (error) {
      console.error('Error al decodificar los datos:', error);
    }
  }, [arreglo]);

  const parseDatosCredencial = (datos) => {
    return datos.map((item) => ({
      nombre: item.nombre,
      convenioN: item.ConvenioNombre,
      convenioId: item.convenioId,
      institucionN: item.institucionN,
      Institucion_ID: item.institucionId,
      cedula: item.cedula,
    }));
  };


  const descargarCredenciales = () => {
    const container = document.getElementById('pdf-container');

    if (container) {
      const options = {
        margin: 0,
        filename: 'credenciales.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 1 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
        pagebreak: { mode: 'avoid-all' }, // Establece el modo de salto de página
      };

      html2pdf(container, options);
    } else {
      console.error('No se encontró el contenedor para generar el PDF.');
    }
  };

  const Carnet = ({ datos }) => {
    const carnetsPorPagina = 9;

    const paginas = [];
    for (let i = 0; i < datos.length; i += carnetsPorPagina) {
      paginas.push(datos.slice(i, i + carnetsPorPagina));
    }

    return (
      <div id="pdf-container">
        {paginas.map((pagina, paginaIndex) => (
          <div key={paginaIndex} className="carnet-container-horizontal">
            {pagina.map((item, index) => (
              <div key={index} className={`carnet-item ${index > 0 ? 'avoid-this-class' : ''}`}>
                <div className="info-container">
                  <h3>{item.nombre}</h3>
                  <p><b>Cédula:</b> {item.cedula} </p>
                  <p><b>Institución:</b> {item.institucionN}</p>
                  <p><b>Convenio:</b> {item.convenioN}</p>
                </div>
                <div className="codigo-qr-container">
                  <QRCode value={JSON.stringify(item)} size={128} />
                </div>
              </div>
            ))}
            {paginaIndex < paginas.length - 1 && <div className="page-break"></div>}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="App">
      <Cabecera/>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div id='volver'>
          <Button variant="contained" style={{ marginLeft: '60%', backgroundColor: '#890202', color: 'white' }} onClick={goBack}>
            Volver
          </Button>
        </div>
      </div>
      <Carnet datos={datosCredencial} />
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Button onClick={descargarCredenciales} variant="contained" color="primary">
          Descargar
        </Button>
      </div>
    </div>
  );
};

export default CredencialesComponent;
