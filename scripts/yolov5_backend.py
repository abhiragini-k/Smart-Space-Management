"""
YOLOv5 Backend Server for Smart Space Management System
This script demonstrates the Python backend structure for real YOLOv5 integration
"""

import torch
import cv2
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
from PIL import Image
import io
import time

app = Flask(__name__)
CORS(app)

# Load YOLOv5 model (in production)
# model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)
# model.classes = [0]  # Only detect 'person' class

class MockYOLOv5:
    """Mock YOLOv5 model for demonstration"""
    
    def __init__(self):
        self.classes = ['person']
    
    def __call__(self, image):
        # Simulate detection results
        height, width = image.shape[:2]
        num_people = np.random.randint(0, 8)
        
        results = []
        for i in range(num_people):
            x1 = np.random.randint(0, width - 100)
            y1 = np.random.randint(0, height - 150)
            x2 = x1 + np.random.randint(60, 120)
            y2 = y1 + np.random.randint(100, 200)
            confidence = 0.7 + np.random.random() * 0.3
            
            results.append({
                'bbox': [x1, y1, x2, y2],
                'confidence': confidence,
                'class': 0  # person class
            })
        
        return results

# Initialize model
model = MockYOLOv5()

# Room capacity configuration
ROOM_CAPACITIES = {
    'room-1': 12,
    'room-2': 8,
    'room-3': 6,
    'room-4': 16,
    'room-5': 20
}

def decode_base64_image(base64_string):
    """Decode base64 image string to numpy array"""
    try:
        # Remove data URL prefix if present
        if ',' in base64_string:
            base64_string = base64_string.split(',')[1]
        
        # Decode base64
        image_data = base64.b64decode(base64_string)
        image = Image.open(io.BytesIO(image_data))
        
        # Convert to numpy array
        image_np = np.array(image)
        
        # Convert RGB to BGR for OpenCV
        if len(image_np.shape) == 3:
            image_np = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)
        
        return image_np
    except Exception as e:
        print(f"Error decoding image: {e}")
        return None

def determine_room_status(people_count, room_capacity):
    """Determine room status based on occupancy"""
    if people_count == 0:
        return 'available'
    elif people_count >= room_capacity * 0.8:
        return 'full'
    else:
        return 'occupied'

@app.route('/api/detect', methods=['POST'])
def detect_people():
    """Process video frame and detect people using YOLOv5"""
    try:
        data = request.get_json()
        frame_data = data.get('frameData')
        room_id = data.get('roomId')
        
        if not frame_data or not room_id:
            return jsonify({'error': 'Missing frame data or room ID'}), 400
        
        # Decode image
        image = decode_base64_image(frame_data)
        if image is None:
            return jsonify({'error': 'Invalid image data'}), 400
        
        # Run YOLOv5 inference
        detections = model(image)
        
        # Process results
        people_count = len(detections)
        bounding_boxes = []
        
        for detection in detections:
            bbox = detection['bbox']
            bounding_boxes.append({
                'x': int(bbox[0]),
                'y': int(bbox[1]),
                'width': int(bbox[2] - bbox[0]),
                'height': int(bbox[3] - bbox[1]),
                'confidence': float(detection['confidence'])
            })
        
        # Determine room status
        room_capacity = ROOM_CAPACITIES.get(room_id, 10)
        status = determine_room_status(people_count, room_capacity)
        
        result = {
            'roomId': room_id,
            'peopleCount': people_count,
            'boundingBoxes': bounding_boxes,
            'status': status,
            'timestamp': time.time()
        }
        
        return jsonify(result)
        
    except Exception as e:
        print(f"Detection error: {e}")
        return jsonify({'error': 'Detection processing failed'}), 500

@app.route('/api/rooms', methods=['GET'])
def get_rooms():
    """Get all rooms data"""
    rooms = [
        {
            'id': 'room-1',
            'name': 'Conference Room A',
            'capacity': 12,
            'equipment': ['Projector', 'Whiteboard', 'Video Conferencing']
        },
        {
            'id': 'room-2',
            'name': 'Meeting Room B',
            'capacity': 8,
            'equipment': ['TV Screen', 'Whiteboard']
        },
        {
            'id': 'room-3',
            'name': 'Collaboration Space',
            'capacity': 6,
            'equipment': ['Interactive Display', 'Comfortable Seating']
        },
        {
            'id': 'room-4',
            'name': 'Executive Boardroom',
            'capacity': 16,
            'equipment': ['Large Conference Table', 'Premium AV Setup']
        },
        {
            'id': 'room-5',
            'name': 'Training Room',
            'capacity': 20,
            'equipment': ['Projector', 'Sound System', 'Flexible Seating']
        }
    ]
    return jsonify(rooms)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': time.time()})

if __name__ == '__main__':
    print("Starting YOLOv5 Backend Server...")
    print("Available endpoints:")
    print("- POST /api/detect - Process video frames")
    print("- GET /api/rooms - Get rooms data")
    print("- GET /health - Health check")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
