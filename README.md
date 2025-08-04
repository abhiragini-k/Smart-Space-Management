# Smart Space Management System

A comprehensive web application for real-time room occupancy monitoring and booking management, powered by YOLOv5 computer vision.

## Features

### 🏢 Dashboard
- Real-time room occupancy status
- Visual occupancy indicators with progress bars
- Equipment information for each room
- Quick booking and room details functionality
- Auto-updating room status every 5 seconds

### 📅 Room Booking System
- Interactive room selection with availability filtering
- Date and time picker for reservations
- User-friendly booking confirmation
- Integration with occupancy data

### 👨‍💼 Admin Panel
- System-wide analytics and metrics
- Live video monitoring with simulated YOLOv5 detection
- Bounding box visualization for detected people
- Recent bookings management
- Real-time occupancy statistics

### 🤖 AI-Powered Detection
- YOLOv5 integration for person detection
- Real-time video frame processing
- Confidence scoring for detections
- Automatic status determination (Available/Occupied/Full)

## Technology Stack

### Frontend
- **Next.js 14** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Lucide React** for icons

### Backend (Simulated)
- **Next.js API Routes** for demonstration
- **Python Flask** backend structure provided
- **YOLOv5** integration (mock implementation)
- **OpenCV** for video processing

## Getting Started

### Prerequisites
- Node.js 18+ 
- Python 3.8+ (for backend)
- Modern web browser

### Installation

1. **Clone and setup the frontend:**
\`\`\`bash
npm install
npm run dev
\`\`\`

2. **For Python backend (optional):**
\`\`\`bash
pip install torch torchvision flask flask-cors opencv-python pillow numpy
python scripts/yolov5_backend.py
\`\`\`

### Usage

1. **Dashboard**: View real-time room occupancy and status
2. **Book Room**: Reserve available rooms for meetings
3. **Admin Panel**: Monitor live feeds and system analytics

## System Architecture

### Frontend Components
- `app/page.tsx` - Main application with tabbed interface
- `app/api/detect/route.ts` - Mock YOLOv5 detection endpoint
- `app/api/rooms/route.ts` - Room data management API
- `components/video-processor.tsx` - Video processing component

### Backend Structure
- `scripts/yolov5_backend.py` - Python Flask server with YOLOv5
- Real-time frame processing
- Person detection and counting
- Room status determination

## Key Features Explained

### Real-Time Occupancy Monitoring
- Simulated YOLOv5 person detection
- Automatic status updates (Available/Occupied/Full)
- Visual bounding boxes around detected people
- Confidence scoring for each detection

### Smart Room Management
- Capacity-based status determination
- Equipment tracking per room
- Booking conflict prevention
- Historical usage analytics

### Responsive Design
- Mobile-friendly interface
- Adaptive layouts for different screen sizes
- Touch-friendly controls
- Optimized for various devices

## Deployment Considerations

### Production Setup
1. Replace mock detection with actual YOLOv5 model
2. Implement proper database for room/booking data
3. Add user authentication and authorization
4. Set up real video streaming infrastructure
5. Implement WebSocket connections for real-time updates

### Scalability
- Horizontal scaling for multiple rooms
- Load balancing for video processing
- Caching strategies for frequent requests
- Database optimization for large datasets

## Future Enhancements

- [ ] Real webcam integration
- [ ] Advanced analytics and reporting
- [ ] Mobile app development
- [ ] Integration with calendar systems
- [ ] Multi-building support
- [ ] Advanced booking rules and policies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
