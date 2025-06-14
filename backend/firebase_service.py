import firebase_admin
from firebase_admin import credentials, db
from datetime import datetime, timedelta
import os
import json

class FirebaseService:
    def __init__(self):
        # Initialize Firebase
        cred = credentials.Certificate(json.loads(os.getenv('FIREBASE_CREDENTIALS')))
        firebase_admin.initialize_app(cred, {
            'databaseURL': os.getenv('FIREBASE_DB_URL')
        })
        
        # Initialize database references
        self.energy_ref = db.reference('/energy_data')
        self.control_ref = db.reference('/control_status')
    
    def save_energy_data(self, data):
        """Save energy data to Firebase with timestamp as key"""
        timestamp = data['timestamp']
        self.energy_ref.child(timestamp).set(data)
        
        # Also update the latest readings
        for device in ['fan', 'light', 'ac']:
            if device in data:
                self.energy_ref.child(f'latest/{device}').set(data[device])
    
    def get_control_status(self):
        """Get current control status for all devices"""
        return self.control_ref.get() or {
            'fan': False,
            'light': False,
            'ac': False
        }
    
    def update_device_state(self, device, state):
        """Update control state for a specific device"""
        self.control_ref.update({device: state})
    
    def get_energy_history(self, device, hours=24):
        """Get energy history for a device over specified hours"""
        end_time = datetime.utcnow()
        start_time = end_time - timedelta(hours=hours)
        
        query = self.energy_ref.order_by_key().start_at(start_time.isoformat()).end_at(end_time.isoformat())
        snapshot = query.get()
        
        history = []
        for timestamp, data in snapshot.items():
            if device in data:
                history.append({
                    'timestamp': timestamp,
                    'power': data[device].get('power', 0),
                    'energy': data[device].get('energy', 0),
                    'cost': data[device].get('cost', 0)
                })
        
        return history