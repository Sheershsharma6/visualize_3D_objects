import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Stage,
  Html,
  useProgress,
} from "@react-three/drei";

// 1. The Loader (Must return <Html> if inside Canvas)
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{ color: "white", whiteSpace: "nowrap" }}>
        {progress.toFixed(0)} % loaded
      </div>
    </Html>
  );
}

// 2. The Model Component
function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

// 3. The Main Viewer
export default function Viewer3D({ modelUrl }) {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000" }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        {/* Suspense must be INSIDE Canvas to catch the useGLTF promise */}
        <Suspense fallback={<Loader />}>
          <Stage environment="city" intensity={0.6}>
            <Model url={modelUrl} />
          </Stage>
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}
