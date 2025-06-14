function renderDeviceCard(device, data) {
    const dashboardGrid = document.querySelector('.dashboard-grid');
    
    const card = document.createElement('div');
    card.className = 'device-card';
    card.id = `${device}-card`;
    
    card.innerHTML = `
        <div class="device-header">
            <h3 class="device-title">${data.name}</h3>
            <i class="device-icon fas ${getDeviceIcon(device)}"></i>
        </div>
        <div class="device-stats">
            <div class="stat-item">
                <span class="stat-label">Current</span>
                <span class="stat-value" id="${device}-current">${data.current ? data.current.toFixed(2) : '0.00'} A</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Power</span>
                <span class="stat-value" id="${device}-power">${data.power ? data.power.toFixed(2) : '0.00'} W</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Energy</span>
                <span class="stat-value" id="${device}-energy">${data.energy ? data.energy.toFixed(4) : '0.0000'} kWh</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Cost</span>
                <span class="stat-value" id="${device}-cost">$${data.cost ? data.cost.toFixed(4) : '0.0000'}</span>
            </div>
        </div>
        <div class="device-control">
            <label class="toggle-switch">
                <input type="checkbox" id="${device}-toggle" ${data.state ? 'checked' : ''}>
                <span class="toggle-slider"></span>
            </label>
        </div>
    `;
    
    // Insert before the chart container
    const chartContainer = document.querySelector('.chart-container');
    dashboardGrid.insertBefore(card, chartContainer);
    
    // Add event listener for toggle switch
    const toggle = card.querySelector(`#${device}-toggle`);
    toggle.addEventListener('change', () => {
        updateDeviceState(device, toggle.checked);
    });
}

function updateDeviceCard(device, data) {
    const card = document.getElementById(`${device}-card`);
    if (!card) return;
    
    // Update current
    const currentElement = card.querySelector(`#${device}-current`);
    if (currentElement) {
        currentElement.textContent = `${data.current ? data.current.toFixed(2) : '0.00'} A`;
    }
    
    // Update power
    const powerElement = card.querySelector(`#${device}-power`);
    if (powerElement) {
        powerElement.textContent = `${data.power ? data.power.toFixed(2) : '0.00'} W`;
    }
    
    // Update energy
    const energyElement = card.querySelector(`#${device}-energy`);
    if (energyElement) {
        energyElement.textContent = `${data.energy ? data.energy.toFixed(4) : '0.0000'} kWh`;
    }
    
    // Update cost
    const costElement = card.querySelector(`#${device}-cost`);
    if (costElement) {
        costElement.textContent = `$${data.cost ? data.cost.toFixed(4) : '0.0000'}`;
    }
    
    // Update toggle state without triggering change event
    const toggle = card.querySelector(`#${device}-toggle`);
    if (toggle) {
        toggle.checked = data.state;
    }
}

function getDeviceIcon(device) {
    switch(device) {
        case 'fan': return 'fa-fan';
        case 'light': return 'fa-lightbulb';
        case 'ac': return 'fa-snowflake';
        default: return 'fa-plug';
    }
}

async function updateDeviceState(device, state) {
    try {
        await sendControlCommand(device, state);
    } catch (error) {
        console.error(`Error updating ${device} state:`, error);
        showError(`Failed to update ${device}`);
        
        // Revert toggle state if update failed
        const toggle = document.querySelector(`#${device}-toggle`);
        if (toggle) {
            toggle.checked = !state;
        }
    }
}