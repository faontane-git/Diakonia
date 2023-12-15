import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const LeerExcel = ({beneficiarios,agregarBeneficiario}) => {
    
    const { institucionId } = useParams();
  const [Nbeneficiarios, setNBeneficiarios] = useState([]);

  const navigate = useNavigate();
 
  const goBack = () => {    
      navigate('/beneficiarios');
    }

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryData = event.target.result;
      const workbook = XLSX.read(binaryData, { type: 'binary' });

      // Supongamos que tienes un solo hoja de cálculo, si hay múltiples hojas,
      // debes especificar la hoja que deseas leer.
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convierte la hoja de cálculo a un objeto JSON
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Asegúrate de que el encabezado tenga al menos dos elementos (nombre y edad)
      if (jsonData[0].length < 2) {
        console.error('El encabezado debe contener al menos dos elementos: nombre y edad');
        return;
      }

      // Extrae los nombres y edades de los beneficiarios del objeto JSON
      const nombres = jsonData.slice(1).map((fila) => fila[0]);
      const edades = jsonData.slice(1).map((fila) => fila[1]);

      // Crea una lista de objetos beneficiario
      const nuevosBeneficiarios = nombres.map((nombre, index) => ({
        nombre,
        edad: edades[index],
        institucionId: parseInt(institucionId,10),
        id: beneficiarios.length+1+index,
      }));

      // Actualiza el estado con la nueva lista de beneficiarios
      setNBeneficiarios(nuevosBeneficiarios);
    };

    reader.readAsBinaryString(file);
  };

  const añadir = () => {
    
    agregarBeneficiario(Nbeneficiarios);
    console.log(beneficiarios)
    goBack();
}

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      <div>
          <h2>Lista de Beneficiarios:</h2>
      {Nbeneficiarios.length > 0 && (
          <ul>
            {Nbeneficiarios.map((Nbeneficiario, index) => (
              <li key={index}>
                Nombre: {Nbeneficiario.nombre}, Edad: {Nbeneficiario.edad}, institucionId: {Nbeneficiario.institucionId}
              </li>
            ))}
          </ul> 
      )}
      {Nbeneficiarios.length > 0 && (
      <button onClick={añadir}>Añadir</button>
      )}
      </div>
    </div>
  );
};

export default LeerExcel;
