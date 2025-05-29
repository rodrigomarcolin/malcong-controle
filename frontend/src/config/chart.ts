export const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top' as const,
        },
    },
    scales: {
        x: {
            type: 'linear' as const,
            position: 'bottom' as const,
            title: {
                display: true,
                text: 'Tempo (s)'
            }
        },
        y: {
            title: {
                display: true,
                text: 'Amplitude'
            }
        }
    }
};