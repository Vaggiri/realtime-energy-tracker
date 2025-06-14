document.addEventListener('DOMContentLoaded', () => {
    // Initialize the dashboard
    initDashboard();
    
    // Set up real-time updates
    setInterval(updateDashboard, 5000);
});

async function initDashboard() {
    try {
        // Load initial data
        const devices = ['fan', 'light', 'ac'];
        const energyData = await fetchEnergyData();
        const controlStatus = await fetchControlStatus();
        
        // Render device cards
        devices.forEach(device => {
            const cardData = {
                ...energyData[device],
                state: controlStatus[device],
                name: device.toUpperCase()
            };
            renderDeviceCard(device, cardData);
        });
        
        // Initialize chart with fan data by default
        const historyData = await fetchEnergyHistory('fan', 24);
        renderEnergyChart('fan', historyData);
        
        // Update summary stats
        updateSummaryStats(energyData);
        
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        showError('Failed to load dashboard data');
    }
}

async function updateDashboard() {
    try {
        const energyData = await fetchEnergyData();
        const controlStatus = await fetchControlStatus();
        
        // Update device cards
        ['fan', 'light', 'ac'].forEach(device => {
            updateDeviceCard(device, {
                ...energyData[device],
                state: controlStatus[device]
            });
        });
        
        // Update summary stats
        updateSummaryStats(energyData);
        
    } catch (error) {
        console.error('Error updating dashboard:', error);
    }
}

function updateSummaryStats(data) {
    // Calculate totals
    let totalEnergy = 0;
    let totalCost = 0;
    
    ['fan', 'light', 'ac'].forEach(device => {
        if (data[device]) {
            totalEnergy += data[device].energy || 0;
            totalCost += data[device].cost || 0;
        }
    });
    
    // Update UI
    document.getElementById('total-energy').textContent = `${totalEnergy.toFixed(2)} kWh`;
    document.getElementById('total-cost').textContent = `$${totalCost.toFixed(2)}`;
    
    // Calculate CO2 savings (approx 0.92 kg per kWh)
    const co2Saved = totalEnergy * 0.92;
    document.getElementById('carbon-footprint').textContent = `${co2Saved.toFixed(2)} kg`;
}

function showError(message) {
    // Create error toast notification
    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 5000);
}