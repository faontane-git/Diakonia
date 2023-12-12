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

export default function LinesChart({ beneficios, meses, datos }) {
    const midata = {
        labels: meses,
        datasets: [
            {
                label: 'Peso lb',
                data: beneficios,
                
              
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                pointRadius: 5,
                pointBorderColor: 'rgba(255, 99, 132)',
                pointBackgroundColor: 'rgba(255, 99, 132)',
            },
            {
                label: 'IMC',
                data: datos,
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