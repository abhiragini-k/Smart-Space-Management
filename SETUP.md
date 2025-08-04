# Smart Space Management System - Setup Guide

## Quick Start

### Frontend Setup
\`\`\`bash
npm install
npm run dev
\`\`\`
Access the application at `http://localhost:3000`

### Backend Setup (Optional)
\`\`\`bash
pip install torch torchvision flask flask-cors opencv-python pillow numpy
python scripts/yolov5_backend_with_video.py
\`\`\`

## UI Improvements Made

### ✅ **Fixed Issues:**
- **Removed cluttered calendar popup** - Now uses simple date input
- **Cleaner navigation** - Compact tab layout that doesn't interfere
- **Better spacing** - Reduced padding and improved layout
- **Simplified cards** - Less information overload
- **Fixed responsive design** - Better mobile experience

### 🎨 **UI Enhancements:**
- Streamlined room cards with essential info only
- Compact admin panel with better organization  
- Simple date/time inputs instead of complex popups
- Improved button layouts and sizing
- Better visual hierarchy

## Backend Video Features

### 📹 **Stock Video Integration:**
- Support for 5 meeting room videos (`meeting_room_1.mp4` to `meeting_room_5.mp4`)
- Continuous video processing in background
- Real-time frame extraction and analysis
- Video looping for continuous monitoring

### 🤖 **Enhanced Detection:**
- Improved mock YOLOv5 with realistic results
- Frame-based people counting
- Brightness-based detection simulation
- Proper bounding box generation

### 🔄 **Real-time Processing:**
- Background thread for continuous processing
- Cached detection results for performance
- Video frame streaming endpoints
- Health monitoring and status checks

## File Structure
\`\`\`
├── app/
│   ├── page.tsx              # Main application (cleaned up)
│   └── api/
│       ├── detect/route.ts   # Detection endpoint
│       └── rooms/route.ts    # Room management
├── scripts/
│   └── yolov5_backend_with_video.py  # Enhanced backend
└── stock_videos/             # Video files directory
    ├── meeting_room_1.mp4
    ├── meeting_room_2.mp4
    ├── meeting_room_3.mp4
    ├── meeting_room_4.mp4
    └── meeting_room_5.mp4
\`\`\`

## Usage

1. **Dashboard** - Clean room overview with status indicators
2. **Book Room** - Simple booking form with date/time inputs  
3. **Admin Panel** - Compact monitoring and analytics

The interface is now much cleaner and easier to navigate!
