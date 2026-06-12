import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html, useProgress, Bounds, Center } from "@react-three/drei";
import { colors, fonts } from "../styles/theme";

// In-browser 3D viewer for glb/gltf project media. Deliberately self-contained:
// manual lighting (no CDN HDR fetch) so it works offline, auto-fits the model,
// and lazy-loads three.js at the call site.

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{ fontFamily: fonts.mono, fontSize: 11, letterSpacing: 2, color: colors.accentText }}>
        {progress.toFixed(0)}%
      </div>
    </Html>
  );
}

export default function ModelViewer({ url, accent = colors.accent, height = 460 }) {
  return (
    <div style={{
      height, width: "100%", borderRadius: 16, overflow: "hidden",
      border: `1px solid ${colors.border}`, background: "radial-gradient(circle at 50% 40%, #141414, #080808)",
      position: "relative",
    }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.3} />
        <directionalLight position={[-5, -3, -5]} intensity={0.5} color={accent} />
        <Suspense fallback={<Loader />}>
          <Bounds fit clip observe margin={1.2}>
            <Center>
              <Model url={url} />
            </Center>
          </Bounds>
        </Suspense>
        <OrbitControls makeDefault autoRotate autoRotateSpeed={1.1} enablePan={false} minDistance={1} maxDistance={20} />
      </Canvas>

      <span style={{
        position: "absolute", bottom: 12, left: 14, fontFamily: fonts.mono,
        fontSize: 10, letterSpacing: 2, color: colors.textMuted, pointerEvents: "none",
      }}>
        ⟲ DRAG TO ORBIT · SCROLL TO ZOOM
      </span>
    </div>
  );
}
