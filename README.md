📦 3D Object Visualizer (MERN Stack)
A professional Full-Stack application designed for managing and visualizing 3D assets (.glb / .gltf) in real-time. This project demonstrates the integration of cloud storage (AWS S3) with a robust MERN architecture.

🚀 Live Demo
Frontend: https://visualize-3-d-objects-b7nb.vercel.app/signup

Backend: https://visualize-3d-backend.onrender.com

✨ Features
3D Interactive Viewer: Real-time 3D rendering using @google/model-viewer and Three.js.

Secure File Upload: Direct integration with Amazon S3 for hosting heavy 3D assets.

User Authentication: Secure Login/Signup system using JWT (JSON Web Tokens) and BcryptJS.

Protected Routes: Private dashboard access restricted to authenticated users.

Responsive UI: Fully responsive design built with Tailwind CSS.

🛠️ Tech Stack
Frontend
React.js (Vite)

Tailwind CSS (Styling)

Axios (API Requests)

Model-Viewer (3D Rendering)

Backend
Node.js & Express

MongoDB Atlas (Database)

AWS SDK v3 (S3 Storage)

Multer / Multer-S3 (File Handling)

🔧 Installation & Setup
Clone the repository:

Bash
git clone https://github.com/Sheershsharma6/visualize_3D_objects.git
Install dependencies:

Bash
# For Backend
cd server
npm install

# For Frontend
cd ../client
npm install
Environment Variables:
Create a .env file in the server directory and add:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_BUCKET_NAME=your_bucket_name
AWS_REGION=your_region
FRONTEND_URL=http://localhost:5173
Run the application:

Bash
# Start Backend
npm run dev

# Start Frontend
npm run dev
🛡️ CORS & Security Configuration
The project is configured to handle cross-origin requests between Vercel and Render. Ensure that the FRONTEND_URL in the backend environment variables matches your deployed Vercel URL to avoid CORS blocks.

👤 Author
Sheersh Sharma Software Engineer | B.Tech in IT (PSIT Kanpur)
