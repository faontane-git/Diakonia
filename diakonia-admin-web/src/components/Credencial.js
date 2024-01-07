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
      console.log(datos);
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
      html2pdf(container, {
        margin: 0,
        filename: 'credenciales.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
        pagebreak: { avoid: '.avoid-this-class' },
      });
    } else {
      console.error('No se encontró el contenedor para generar el PDF.');
    }
  };

  // Contenido de tu componente de credenciales
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
                  <h2>{item.Nombre}</h2>
                  <p>Cédula: {item.Cédula}</p>
                  <p>Institución: {item.Institución}</p>
                  <p>Convenio: {item.ConvenioNombre}</p>
                  {/* Agrega más información según las propiedades de tu objeto */}
                </div>
                <div className="codigo-qr-container">
                  <QRCode value={JSON.stringify(item)} size={128} />
                </div>
              </div>
            ))}
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
