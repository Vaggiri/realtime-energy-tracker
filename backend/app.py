from flask import Flask, request, jsonify
from firebase_service import FirebaseService
from datetime import datetime
import os
from functools import wraps
import logging

app = Flask(__name__)
firebase = FirebaseService()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# API Key Middleware (for basic protection)
def require_api_key(view_function):
    @wraps(view_function)
    def decorated_function(*args, **kwargs):
        api_key = request.headers.get('X-API-KEY')
        if api_key != os.getenv('API_KEY', 'default-secret-key'):
            return jsonify({"error": "Unauthorized"}), 401
        return view_function(*args, **kwargs)
    return decorated_function

@app.route('/energy-data', methods=['POST'])
@require_api_key
def receive_energy_data():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        # Calculate energy (kWh) - assuming 5 second interval from ESP32
        interval_hours = 5 / 3600
        
        for device in ['fan', 'light', 'ac']:
            if device in data:
                power = data[device].get('power', 0)
                energy_kwh = power * interval_hours / 1000  # Convert to kWh
                data[device]['energy'] = energy_kwh
                
                # Calculate cost (assuming $0.15 per kWh)
                data[device]['cost'] = energy_kwh * 0.15
        
        # Add timestamp
        data['timestamp'] = datetime.utcnow().isoformat()
        
        # Save to Firebase
        firebase.save_energy_data(data)
        
        logger.info(f"Data saved: {data}")
        return jsonify({"status": "success"}), 200
        
    except Exception as e:
        logger.error(f"Error processing energy data: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/control-status', methods=['GET'])
@require_api_key
def get_control_status():
    try:
        status = firebase.get_control_status()
        return jsonify(status), 200
    except Exception as e:
        logger.error(f"Error getting control status: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/update-control', methods=['POST'])
@require_api_key
def update_control():
    try:
        data = request.get_json()
        device = data.get('device')
        state = data.get('state')
        
        if not device or state is None:
            return jsonify({"error": "Device and state are required"}), 400
            
        firebase.update_device_state(device, state)
        logger.info(f"Control updated: {device} = {state}")
        return jsonify({"status": "success"}), 200
    except Exception as e:
        logger.error(f"Error updating control: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/energy-history', methods=['GET'])
@require_api_key
def get_energy_history():
    try:
        device = request.args.get('device')
        hours = int(request.args.get('hours', 24))
        
        history = firebase.get_energy_history(device, hours)
        return jsonify(history), 200
    except Exception as e:
        logger.error(f"Error getting energy history: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)