"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { LoyaltyCard3D } from "../3d/LoyaltyCard3D";

export const Hero = () => {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 min-h-screen flex flex-col justify-center">
      {/* Glow Spots */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[128px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[128px] pointer-events-none -z-10" />

      <div className="container mx-auto px-6 h-full">
        <div className="grid lg:grid-cols-2 gap-12 h-full items-center">
          {/* TEXT SIDE */}
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="z-10 relative"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span>
              <span>The Digital Wallet Standard</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.95]">
              Loyalty <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-600">
                Unleashed.
              </span>
            </h1>

            <p className="text-lg text-neutral-400 max-w-lg mb-10 leading-relaxed">
              Replace physical cards with a powerful, 3D-native wallet
              infrastructure. Built for brands who refuse to be boring.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group relative h-12 px-8 rounded-full bg-indigo-600 text-white font-medium overflow-hidden">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative flex items-center gap-2">
                  Start Building <ArrowRight size={16} />
                </span>
              </button>
              <button className="h-12 px-8 rounded-full border border-white/10 text-white font-medium hover:bg-white/5 transition-colors">
                View Demo
              </button>
            </div>

            <div className="mt-12 flex items-center gap-4 text-xs text-neutral-500 font-mono">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-neutral-800 border border-black"
                  />
                ))}
              </div>
              <p>Trusted by 12,000+ Merchants</p>
            </div>
          </motion.div>

          {/* 3D CANVAS SIDE */}
          <div className="h-[600px] w-full relative z-20 cursor-grab active:cursor-grabbing">
            {/* FIX: Adjusted camera position (z=8) and FOV (42) to zoom out */}
            <Canvas camera={{ position: [0, 0, 8], fov: 42 }}>
              <Environment preset="city" />
              <ambientLight intensity={0.5} />
              <spotLight
                position={[10, 10, 10]}
                angle={0.15}
                penumbra={1}
                intensity={1}
              />
              <pointLight
                position={[-10, -10, -10]}
                intensity={1}
                color="#6366f1"
              />

              <LoyaltyCard3D />

              <OrbitControls
                enableZoom={false}
                enablePan={false}
                minPolarAngle={Math.PI / 3}
                maxPolarAngle={Math.PI / 1.5}
              />
            </Canvas>

            {/* Helper Text */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-neutral-500 text-xs font-mono uppercase tracking-widest pointer-events-none opacity-50">
              Drag to Rotate • 360° View
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
