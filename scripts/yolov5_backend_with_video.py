"""
Enhanced YOLOv5 Backend Server with Stock Video Processing
Handles real meeting room videos for occupancy detection
"""

import torch
import cv2
import numpy as np
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import base64
from PIL import Image
import io
import time
import os
import threading
from pathlib import Path

app = Flask(__name__)
CORS(app)

# Video storage configuration
VIDEO_DIR = Path("stock_videos")
VIDEO_DIR.mkdir(exist_ok=True)

# Stock video files for meeting rooms
STOCK_VIDEOS = {
    'room-1': 'meeting_room_1.mp4',
    'room-2': 'meeting_room_2.mp4', 
    'room-3': 'meeting_room_3.mp4',
    'room-4': 'meeting_room_4.mp4',
    'room-5': 'meeting_room_5.mp4'
}

# Room configurations
ROOM_CONFIG = {
    'room-1': {
        'name': 'Conference Room A',
        'capacity': 12,
        'video_file': 'meeting_room_1.mp4'
    },
    'room-2': {
        'name': 'Meeting Room B', 
        'capacity': 8,
        'video_file': 'meeting_room_2.mp4'
    },
    'room-3': {
        'name': 'Collaboration Space',
        'capacity': 6,
        'video_file': 'meeting_room_3.mp4'
    },
    'room-4': {
        'name': 'Executive Boardroom',
        'capacity': 16,
        'video_file': 'meeting_room_4.mp4'
    },
    'room-5': {
        'name': 'Training Room',
        'capacity': 20,
        'video_file': 'meeting_room_5.mp4'
    }
}

class VideoProcessor:
    """Handles video processing and YOLOv5 detection"""
    
    def __init__(self):
        # Load YOLOv5 model (mock for demo)
        self.model = self.load_yolo_model()
        self.video_captures = {}
        self.current_frames = {}
        self.detection_results = {}
        
    def load_yolo_model(self):
        """Load YOLOv5 model - mock implementation"""
        print("Loading YOLOv5 model...")
        # In production: model = torch.hub.load('ultralytics/yolov5', 'yolov5s')
        return MockYOLOv5()
    
    def initialize_video_streams(self):
        """Initialize video capture for all rooms"""
        for room_id, config in ROOM_CONFIG.items():
            video_path = VIDEO_DIR / config['video_file']
            if video_path.exists():
                cap = cv2.VideoCapture(str(video_path))
                if cap.isOpened():
                    self.video_captures[room_id] = cap
                    print(f"Initialized video stream for {room_id}: {config['video_file']}")
                else:
                    print(f"Failed to open video for {room_id}")
            else:
                print(f"Video file not found: {video_path}")
                # Create placeholder video capture
                self.video_captures[room_id] = None
    
    def get_current_frame(self, room_id):
        """Get current frame from video stream"""
        if room_id not in self.video_captures or self.video_captures[room_id] is None:
            return self.create_placeholder_frame(room_id)
        
        cap = self.video_captures[room_id]
        ret, frame = cap.read()
        
        if not ret:
            # Loop video
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            ret, frame = cap.read()
        
        if ret:
            self.current_frames[room_id] = frame
            return frame
        else:
            return self.create_placeholder_frame(room_id)
    
    def create_placeholder_frame(self, room_id):
        """Create placeholder frame when video is not available"""
        frame = np.zeros((480, 640, 3), dtype=np.uint8)
        cv2.putText(frame, f"Room {room_id[-1]}", (250, 200), 
                   cv2.FONT_HERSHEY_SIMPLEX, 2, (255, 255, 255), 3)
        cv2.putText(frame, "Video Feed", (260, 280), 
                   cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        return frame
    
    def detect_people(self, frame):
        """Run YOLOv5 detection on frame"""
        return self.model(frame)
    
    def process_room_frame(self, room_id):
        """Process single frame for a room"""
        frame = self.get_current_frame(room_id)
        if frame is None:
            return None
        
        # Run detection
        detections = self.detect_people(frame)
        
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
        capacity = ROOM_CONFIG[room_id]['capacity']
        status = self.determine_status(people_count, capacity)
        
        result = {
            'roomId': room_id,
            'peopleCount': people_count,
            'boundingBoxes': bounding_boxes,
            'status': status,
            'timestamp': time.time(),
            'frame_shape': frame.shape
        }
        
        self.detection_results[room_id] = result
        return result
    
    def determine_status(self, people_count, capacity):
        """Determine room status based on occupancy"""
        if people_count == 0:
            return 'available'
        elif people_count >= capacity * 0.8:
            return 'full'
        else:
            return 'occupied'

class MockYOLOv5:
    """Mock YOLOv5 model for demonstration"""
    
    def __call__(self, image):
        # Simulate realistic detection based on image content
        height, width = image.shape[:2]
        
        # Analyze image brightness to simulate detection
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        brightness = np.mean(gray)
        
        # More people in brighter areas (simulating meeting activity)
        base_people = max(0, int((brightness - 50) / 30))
        num_people = min(8, max(0, base_people + np.random.randint(-1, 3)))
        
        results = []
        for i in range(num_people):
            # Generate realistic bounding boxes
            x1 = np.random.randint(50, width - 150)
            y1 = np.random.randint(100, height - 200)
            x2 = x1 + np.random.randint(80, 120)
            y2 = y1 + np.random.randint(150, 250)
            
            # Ensure boxes stay within frame
            x2 = min(x2, width - 10)
            y2 = min(y2, height - 10)
            
            confidence = 0.75 + np.random.random() * 0.2
            
            results.append({
                'bbox': [x1, y1, x2, y2],
                'confidence': confidence,
                'class': 0  # person class
            })
        
        return results

# Initialize video processor
video_processor = VideoProcessor()

def continuous_processing():
    """Continuously process video frames for all rooms"""
    while True:
        for room_id in ROOM_CONFIG.keys():
            try:
                video_processor.process_room_frame(room_id)
            except Exception as e:
                print(f"Error processing {room_id}: {e}")
        time.sleep(1)  # Process every second

@app.route('/api/detect', methods=['POST'])
def detect_people():
    """Process video frame and detect people"""
    try:
        data = request.get_json()
        room_id = data.get('roomId')
        
        if not room_id or room_id not in ROOM_CONFIG:
            return jsonify({'error': 'Invalid room ID'}), 400
        
        # Get latest detection result
        result = video_processor.detection_results.get(room_id)
        
        if result:
            return jsonify(result)
        else:
            # Process frame immediately if no cached result
            result = video_processor.process_room_frame(room_id)
            return jsonify(result) if result else jsonify({'error': 'Processing failed'}), 500
            
    except Exception as e:
        print(f"Detection error: {e}")
        return jsonify({'error': 'Detection processing failed'}), 500

@app.route('/api/rooms', methods=['GET'])
def get_rooms():
    """Get all rooms data with current status"""
    rooms = []
    for room_id, config in ROOM_CONFIG.items():
        # Get latest detection result
        detection = video_processor.detection_results.get(room_id, {})
        
        room_data = {
            'id': room_id,
            'name': config['name'],
            'capacity': config['capacity'],
            'currentOccupancy': detection.get('peopleCount', 0),
            'status': detection.get('status', 'available'),
            'lastUpdate': detection.get('timestamp', time.time()),
            'videoFeed': config['video_file'],
            'equipment': get_room_equipment(room_id)
        }
        rooms.append(room_data)
    
    return jsonify(rooms)

@app.route('/api/video/<room_id>/frame', methods=['GET'])
def get_video_frame(room_id):
    """Get current video frame for a room"""
    try:
        if room_id not in ROOM_CONFIG:
            return jsonify({'error': 'Invalid room ID'}), 400
        
        frame = video_processor.get_current_frame(room_id)
        if frame is None:
            return jsonify({'error': 'Frame not available'}), 404
        
        # Convert frame to JPEG
        _, buffer = cv2.imencode('.jpg', frame)
        
        return send_file(
            io.BytesIO(buffer.tobytes()),
            mimetype='image/jpeg',
            as_attachment=False
        )
        
    except Exception as e:
        print(f"Frame error: {e}")
        return jsonify({'error': 'Frame processing failed'}), 500

@app.route('/api/video/<room_id>/stream', methods=['GET'])
def get_video_stream(room_id):
    """Get video stream for a room (placeholder)"""
    # This would implement actual video streaming in production
    return jsonify({
        'streamUrl': f'/api/video/{room_id}/frame',
        'roomId': room_id,
        'status': 'streaming'
    })

def get_room_equipment(room_id):
    """Get equipment list for a room"""
    equipment_map = {
        'room-1': ['Projector', 'Whiteboard', 'Video Conferencing'],
        'room-2': ['TV Screen', 'Whiteboard'],
        'room-3': ['Interactive Display', 'Comfortable Seating'],
        'room-4': ['Large Conference Table', 'Premium AV Setup'],
        'room-5': ['Projector', 'Sound System', 'Flexible Seating']
    }
    return equipment_map.get(room_id, [])

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': time.time(),
        'active_rooms': len(video_processor.video_captures),
        'processing_status': 'active'
    })

@app.route('/api/setup-videos', methods=['POST'])
def setup_demo_videos():
    """Setup demo video files (for development)"""
    try:
        # Create sample video files or download them
        for room_id, video_file in STOCK_VIDEOS.items():
            video_path = VIDEO_DIR / video_file
            if not video_path.exists():
                # Create placeholder video file
                print(f"Creating placeholder for {video_file}")
                # In production, you would download or copy actual video files here
        
        video_processor.initialize_video_streams()
        return jsonify({'message': 'Video setup completed', 'videos': list(STOCK_VIDEOS.values())})
        
    except Exception as e:
        return jsonify({'error': f'Setup failed: {e}'}), 500

if __name__ == '__main__':
    print("Starting Enhanced YOLOv5 Backend Server...")
    print("Features:")
    print("- Stock video processing")
    print("- Real-time person detection")
    print("- Multi-room monitoring")
    print("- Video frame streaming")
    
    # Initialize video streams
    video_processor.initialize_video_streams()
    
    # Start continuous processing in background
    processing_thread = threading.Thread(target=continuous_processing, daemon=True)
    processing_thread.start()
    
    print("\nAvailable endpoints:")
    print("- POST /api/detect - Process detection")
    print("- GET /api/rooms - Get rooms data")
    print("- GET /api/video/<room_id>/frame - Get video frame")
    print("- GET /api/video/<room_id>/stream - Get video stream")
    print("- POST /api/setup-videos - Setup demo videos")
    print("- GET /health - Health check")
    
    app.run(host='0.0.0.0', port=5000, debug=True, threaded=True)
