let energyChart = null;

function renderEnergyChart(device, historyData) {
    const ctx = document.getElementById('energyChart').getContext('2d');
    
    // Prepare data for Chart.js
    const labels = historyData.map(item => {
        const date = new Date(item.timestamp);
        return date.toLocaleTimeString();
    });
    
    const powerData = historyData.map(item => item.power);
    const energyData = historyData.map(item => item.energy);
    
    if (energyChart) {
        energyChart.destroy();
    }
    
    energyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Power (W)',
                    data: powerData,
                    borderColor: '#4361ee',
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    yAxisID: 'y'
                },
                {
                    label: 'Energy (kWh)',
                    data: energyData,
                    borderColor: '#4cc9f0',
                    backgroundColor: 'rgba(76, 201, 240, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Power (W)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false,
                    },
                    title: {
                        display: true,
                        text: 'Energy (kWh)'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: `${device.toUpperCase()} Energy Consumption`
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.dataset.label.includes('Power') 
                                    ? `${context.parsed.y.toFixed(2)} W`
                                    : `${context.parsed.y.toFixed(4)} kWh`;
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}

// Tab switching for charts
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Load data for selected device
        const device = btn.dataset.device;
        try {
            const historyData = await fetchEnergyHistory(device, 24);
            renderEnergyChart(device, historyData);
        } catch (error) {
            console.error(`Error loading ${device} history:`, error);
            showError(`Failed to load ${device} data`);
        }
    });
});