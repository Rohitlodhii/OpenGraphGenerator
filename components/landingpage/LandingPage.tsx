"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import ShaderBackground from "./ShaderBackground";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-white font-['Plus_Jakarta_Sans',sans-serif] selection:bg-purple-500/30 selection:text-purple-200 overflow-hidden">
      {/* Animated WebGL Shader Background */}
      <ShaderBackground />

      {/* Subtle background overlay to enhance text readability */}
      <div className="fixed inset-0 bg-slate-950/30 pointer-events-none -z-5 backdrop-blur-[1px]" />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 max-w-4xl text-center flex flex-col items-center space-y-6"
      >
        {/* Logo with rounded-3xl */}
        <Image
          src="/logo.png"
          alt="Opengg Logo"
          width={80}
          height={80}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-4xl outline-1 outline-neutral-100/30 object-contain shadow-xl"
          priority
        />

        {/* Title: max-w-4xl restored, 'Opengg' in white Instrument Serif */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tighter text-white leading-tight">
          <span className="font-['Instrument_Serif',serif] italic inline-block font-normal text-[1.12em] mr-1 text-white">
            Opengg
          </span>{" "}
          creates the best  opengraphs for your website
        </h1>

        {/* Sub-description: max-w-xl so it finishes in 2 lines */}
        <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
          Effortlessly design, preview, and export high-converting social preview images and OG banners with custom textures and live WebGL shaders.
        </p>

        {/* Dashboard Button */}
        <div className="pt-1">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-neutral-900 bg-white relative overflow-hidden rounded-xl shadow-lg border border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group"
          >
            {/* Subtle bottom-to-top gradient overlay (neutral 900 -> neutral 500 -> neutral 100) */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/20 via-neutral-500/10 to-neutral-100/20 pointer-events-none" />
            <LayoutDashboard className="w-4 h-4 text-neutral-900 relative z-10" />
            <span className="relative z-10">Create New</span>
           
          </Link>
        </div>
      </motion.section>
    </main>
  );
}
