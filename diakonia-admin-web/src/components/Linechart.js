import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function LinesChart({ fechas,peso, talla,hgb }) {
    const midata = {
        labels: fechas,
        datasets: [
            {
                label: 'Peso',
                data: peso,
                
              
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                pointRadius: 5,
                pointBorderColor: 'rgba(255, 99, 132)',
                pointBackgroundColor: 'rgba(255, 99, 132)',
            },
            {
                label: 'Talla',
                data: talla,
            },
            {
                label:'Hgb',
                data: hgb,
            },
        ],
    };

    const misoptions = {
        scales: {
            y: {
                min: 0,
            },
            x: {
                ticks: { color: 'rgb(255, 99, 132)' },
            },
        },
    };

    return <Line data={midata} options={misoptions} />;
}