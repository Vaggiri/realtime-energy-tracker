const API_BASE_URL = 'https://your-render-backend.onrender.com';
const API_KEY = 'your-api-key'; // In production, use environment variables

async function fetchEnergyData() {
    const response = await fetch(`${API_BASE_URL}/energy-data/latest`, {
        headers: {
            'X-API-KEY': API_KEY
        }
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
}

async function fetchControlStatus() {
    const response = await fetch(`${API_BASE_URL}/control-status`, {
        headers: {
            'X-API-KEY': API_KEY
        }
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
}

async function fetchEnergyHistory(device, hours) {
    const response = await fetch(`${API_BASE_URL}/energy-history?device=${device}&hours=${hours}`, {
        headers: {
            'X-API-KEY': API_KEY
        }
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
}

async function sendControlCommand(device, state) {
    const response = await fetch(`${API_BASE_URL}/update-control`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY
        },
        body: JSON.stringify({
            device,
            state
        })
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
}