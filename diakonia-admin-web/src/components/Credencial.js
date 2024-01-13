import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import html2pdf from 'html2pdf.js';
import '../estilos/Credencial.css';
import { useParams } from 'react-router-dom';
import { Button } from '@mui/material';

const CredencialesComponent = () => {
  const { arreglo } = useParams();
  const [datosCredencial, setDatosCredencial] = useState([]);

  useEffect(() => {
    try {
      const decodedData = JSON.parse(decodeURIComponent(arreglo));
      const datos = parseDatosCredencial(decodedData);
      setDatosCredencial(datos);
    } catch (error) {
      console.error('Error al decodificar los datos:', error);
    }
  }, [arreglo]);

  const parseDatosCredencial = (datos) => {
    return datos.map((item) => {
      const keyValuePairs = item.qr_url.split(',');
      const objeto = {};

      keyValuePairs.forEach((pair) => {
        const [clave, valor] = pair.split(':');
        objeto[clave.trim()] = valor.trim();
      });

      return objeto;
    });
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
                  <h3>{item.Nombre}</h3>
                  <p><b>Cédula:</b> {item.Cédula} </p>
                  <p><b>Institución:</b> {item.Institución}</p>
                  <p><b>Convenio:</b> {item.ConvenioNombre}</p>
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
