"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Html,
  Float,
  MeshTransmissionMaterial,
  RoundedBox,
} from "@react-three/drei";
import * as THREE from "three";
import { QrCode, Zap, Coffee, Gift } from "lucide-react";

export function LoyaltyCard3D() {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);

  // Gentle rotation when idle
  useFrame((state, delta) => {
    if (mesh.current && !hovered) {
      mesh.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <Float floatIntensity={0} rotationIntensity={0.2} speed={1.1}>
      {/* 
          FIX: Added scale={0.65} here. 
          This shrinks the physical size of the card so it fits within the camera view 
        */}
      <group scale={0.27}>
        {/* The Card Mesh */}
        <RoundedBox
          ref={mesh}
          args={[7.7, 12.8, 0]} // Width, Height, Depth
          radius={0.2}
          smoothness={4}
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
        >
          {/* Glass / Acrylic Material */}
          <MeshTransmissionMaterial
            backside
            backsideThickness={10}
            thickness={2}
            roughness={0}
            transmission={1}
            ior={1.5}
            chromaticAberration={0.2}
            anisotropy={20}
            distortion={0.9}
            distortionScale={0.3}
            temporalDistortion={0.5}
            color="#ffffff"
            background={new THREE.Color("#050505")}
          />

          {/* FRONT CONTENT (HTML projected onto 3D) */}
          <Html
            position={[0, 0, 0.09]}
            transform
            occlude
            style={{ width: "320px", height: "520px", pointerEvents: "none" }}
          >
            <div className="w-full h-full bg-black/90 text-white p-6 flex flex-col justify-between rounded-3xl border border-white/20 shadow-2xl backdrop-blur-md select-none">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-lg shadow-[0_0_15px_rgba(79,70,229,0.6)]">
                  L
                </div>
                <div className="px-2 py-1 bg-white/10 rounded border border-white/10 text-[10px] uppercase tracking-widest text-neutral-400">
                  Priority Pass
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-4">
                <div className="relative p-2 bg-white rounded-xl">
                  <QrCode className="w-40 h-40 text-black" />
                  {/* Scanning Beam Animation */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-red-500 shadow-[0_0_10px_red] animate-[scan_2s_ease-in-out_infinite]" />
                </div>
                <p className="font-mono text-xs text-neutral-500 uppercase">
                  User: Said PoPo
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end text-sm">
                  <span className="text-neutral-400">Balance</span>
                  <span className="text-2xl font-bold">
                    1,420{" "}
                    <span className="text-xs font-normal text-indigo-400">
                      pts
                    </span>
                  </span>
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full w-[80%] bg-gradient-to-r from-indigo-500 to-purple-500" />
                </div>
              </div>
            </div>
          </Html>

          {/* BACK CONTENT */}
          <Html
            position={[0, 0, -0.06]}
            rotation={[0, Math.PI, 0]}
            transform
            occlude
            style={{ width: "320px", height: "520px", pointerEvents: "none" }}
          >
            <div className="w-full h-full bg-neutral-900/95 text-white p-6 flex flex-col rounded-3xl border border-white/20 select-none">
              <h3 className="font-bold text-lg mb-6 text-center border-b border-white/10 pb-4">
                Available Rewards
              </h3>
              <div className="space-y-4 flex-1">
                {[
                  {
                    name: "Free Coffee",
                    cost: 150,
                    icon: <Coffee size={14} />,
                    color: "bg-orange-500",
                  },
                  {
                    name: "Donut Box",
                    cost: 500,
                    icon: <Gift size={14} />,
                    color: "bg-pink-500",
                  },
                  {
                    name: "Premium Hoodie",
                    cost: 2000,
                    icon: <Zap size={14} />,
                    color: "bg-indigo-500",
                  },
                ].map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full ${r.color} flex items-center justify-center text-white`}
                      >
                        {r.icon}
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">{r.name}</div>
                        <div className="text-xs text-neutral-400">
                          {r.cost} pts
                        </div>
                      </div>
                    </div>
                    {i === 0 ? (
                      <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]" />
                    ) : null}
                  </div>
                ))}
              </div>
              <div className="mt-auto text-center text-[10px] text-neutral-500 uppercase tracking-widest">
                Valid at 4 locations
              </div>
            </div>
          </Html>
        </RoundedBox>
      </group>
    </Float>
  );
}
