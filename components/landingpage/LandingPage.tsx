"use client";

import React, { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import ShaderBackground from "./ShaderBackground";
import {
  Sparkles,
  ArrowRight,
  Zap,
  Layers,
  Image as ImageIcon,
  Code2,
  CheckCircle2,
  Github,
  Layout,
  Palette,
  Share2,
  Wand2,
  ChevronRight,
  Shield,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const { data: session } = authClient.useSession();
  const [activeTab, setActiveTab] = useState<"blog" | "product" | "repo" | "event">("blog");
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
      });
    } catch (err) {
      console.error("Sign in error:", err);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="relative min-h-screen text-slate-100 font-sans selection:bg-purple-500/30 selection:text-purple-200 overflow-x-hidden">
      {/* Animated WebGL Shader Background */}
      <ShaderBackground />

      {/* Subtle Overlay to enhance text contrast over dynamic shader */}
      <div className="fixed inset-0 bg-slate-950/40 pointer-events-none -z-5 backdrop-blur-[1px]" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/60 backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-pink-500 p-0.5 shadow-lg shadow-purple-500/25">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Wand2 className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-purple-300">
              OpenGraph Studio
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-purple-300 transition-colors">
              Features
            </a>
            <a href="#preview" className="hover:text-purple-300 transition-colors">
              Live Preview
            </a>
            <a href="#templates" className="hover:text-purple-300 transition-colors">
              Templates
            </a>
            <a href="#tech" className="hover:text-purple-300 transition-colors">
              Workflow
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {session ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg shadow-lg shadow-purple-500/20 transition duration-200 flex items-center gap-2"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <button
                onClick={handleSignIn}
                disabled={isSigningIn}
                className="px-4 py-2 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/15 rounded-lg transition duration-200 flex items-center gap-2 shadow-sm backdrop-blur-sm disabled:opacity-50"
              >
                <Github className="w-4 h-4" />
                {isSigningIn ? "Signing in..." : "Sign in with GitHub"}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-36 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto space-y-8"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-purple-950/40 backdrop-blur-md text-purple-300 text-xs sm:text-sm font-medium shadow-inner">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>Interactive WebGL Powered Social Card Generator</span>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Create Eye-Catching{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-300 to-pink-400">
              Open Graph Cards
            </span>{" "}
            in Seconds
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Elevate your brand presence across Twitter, LinkedIn, and Meta. Craft dynamic, pixel-perfect social banners with custom textures, live previewers, and instant export.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {session ? (
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl shadow-xl shadow-purple-600/30 transition-all duration-200 flex items-center justify-center gap-3 group"
              >
                Launch Studio
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <button
                onClick={handleSignIn}
                disabled={isSigningIn}
                className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl shadow-xl shadow-purple-600/30 transition-all duration-200 flex items-center justify-center gap-3 group disabled:opacity-50"
              >
                <Github className="w-5 h-5" />
                {isSigningIn ? "Connecting..." : "Get Started Free with GitHub"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
            <a
              href="#preview"
              className="w-full sm:w-auto px-8 py-4 text-base font-medium text-slate-200 bg-slate-900/60 hover:bg-slate-800/80 border border-white/10 rounded-xl transition duration-200 flex items-center justify-center gap-2 backdrop-blur-md"
            >
              Explore Templates
            </a>
          </div>

          {/* Social Proof Stats */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-white/10">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white">100%</div>
              <div className="text-xs sm:text-sm text-slate-400">Customizable SVGs</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white">&lt; 50ms</div>
              <div className="text-xs sm:text-sm text-slate-400">Export Latency</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white">4K+</div>
              <div className="text-xs sm:text-sm text-slate-400">Social Banners</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white">WebGL1</div>
              <div className="text-xs sm:text-sm text-slate-400">Flow Shader BG</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Live Interactive Preview Showcase */}
      <section id="preview" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Designed for Instant Social Engagement
          </h2>
          <p className="mt-3 text-slate-400 text-base sm:text-lg">
            See how your OG cards look live with different themes and dynamic content.
          </p>

          {/* Tabs */}
          <div className="mt-8 flex flex-wrap justify-center gap-2 p-1.5 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/10 max-w-xl mx-auto">
            {(
              [
                { id: "blog", label: "Blog Post" },
                { id: "product", label: "Product Launch" },
                { id: "repo", label: "GitHub Repo" },
                { id: "event", label: "Tech Event" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                  activeTab === tab.id
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Canvas Mockup */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative max-w-4xl mx-auto rounded-3xl border border-white/15 bg-slate-950/70 p-6 sm:p-10 shadow-2xl backdrop-blur-xl overflow-hidden group"
        >
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Simulated OG Card Banner */}
          <div className="relative aspect-[1200/630] w-full rounded-2xl border border-white/20 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/80 p-8 sm:p-12 flex flex-col justify-between shadow-inner">
            {/* Texture background overlay simulation */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/30 via-transparent to-transparent pointer-events-none" />
            
            {/* Header info */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-300" />
                </div>
                <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-purple-300">
                  {activeTab === "blog" && "ENGINEERING BLOG"}
                  {activeTab === "product" && "NEW FEATURE RELEASE"}
                  {activeTab === "repo" && "OPEN SOURCE PROJECT"}
                  {activeTab === "event" && "GLOBAL DEV SUMMIT 2026"}
                </span>
              </div>
              <span className="text-xs text-slate-400 border border-slate-700/60 px-3 py-1 rounded-full bg-slate-900/60 backdrop-blur-sm">
                1200 x 630 px
              </span>
            </div>

            {/* Main content */}
            <div className="z-10 my-4">
              <h3 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {activeTab === "blog" && "Building High-Performance WebGL Shaders with Next.js 16"}
                {activeTab === "product" && "Introducing OpenGraph Studio: Realtime Social Card Editor"}
                {activeTab === "repo" && "rohitlodhii/OpenGraphGenerator — Dynamic Banners for Developers"}
                {activeTab === "event" && "Future of Web Graphics & Dynamic Image Rendering"}
              </h3>
              <p className="mt-3 text-slate-300 text-sm sm:text-base line-clamp-2 max-w-xl">
                {activeTab === "blog" && "Learn how custom GLSL fragment shaders combined with OKLab color interpolation create silky smooth background dynamics."}
                {activeTab === "product" && "Design, export, and automate social media thumbnails with custom paper textures, torn borders, and glowing gradients."}
                {activeTab === "repo" && "A complete suite of canvas previewers, drag-and-drop elements, and automated social card generators."}
                {activeTab === "event" && "Join top design engineers discussing GPU acceleration, framer-motion, and reactive UI patterns."}
              </p>
            </div>

            {/* Footer info */}
            <div className="flex items-center justify-between z-10 pt-4 border-t border-white/10 text-xs sm:text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500" />
                <span className="font-medium text-slate-200">Rohit Lodhi</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-purple-300">opengraph.studio</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Cards Grid */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-5xl font-bold text-white">
            Everything You Need for Pixel-Perfect Cards
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Powerful tools tailored for developers, creators, and marketers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Layout,
              title: "Interactive Canvas",
              desc: "Full drag-and-drop workspace with customizable layers, text nodes, textures, and custom dimensions.",
              color: "from-purple-500 to-indigo-500",
            },
            {
              icon: Palette,
              title: "Rich Texture Library",
              desc: "Integrate authentic paper textures, torn borders, wooden platforms, and colorful duct tape overlays.",
              color: "from-pink-500 to-rose-500",
            },
            {
              icon: Zap,
              title: "WebGL Flow Shaders",
              desc: "High-frequency 60 FPS GPU-accelerated background shader effects rendered directly in WebGL1.",
              color: "from-indigo-500 to-cyan-500",
            },
            {
              icon: Code2,
              title: "Developer First",
              desc: "Export clean code snippets, SVGs, or dynamic image URLs directly compatible with Next.js Metadata.",
              color: "from-emerald-500 to-teal-500",
            },
            {
              icon: Share2,
              title: "Multi-Platform Banners",
              desc: "Presets engineered for Twitter Card Large, LinkedIn Post, Meta Graph, and GitHub Repository Banners.",
              color: "from-amber-500 to-orange-500",
            },
            {
              icon: Shield,
              title: "Secure Auth & Storage",
              desc: "Seamless GitHub OAuth login powered by Better Auth and Supabase cloud asset management.",
              color: "from-blue-500 to-purple-500",
            },
          ].map((feat, idx) => {
            const IconComp = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-8 rounded-2xl border border-white/10 bg-slate-950/60 backdrop-blur-xl hover:border-purple-500/50 transition-all group hover:-translate-y-1 shadow-lg"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feat.color} p-0.5 mb-6`}>
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <IconComp className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feat.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="relative rounded-3xl border border-white/20 bg-gradient-to-b from-purple-950/80 via-slate-950 to-slate-950 p-10 sm:p-16 text-center overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-pink-500/10 pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight relative z-10">
            Ready to Supercharge Your Social Banners?
          </h2>
          <p className="mt-4 text-slate-300 text-lg max-w-xl mx-auto relative z-10">
            Join developers and creators building high-conversion social cards today. Free to get started.
          </p>

          <div className="mt-8 flex justify-center relative z-10">
            {session ? (
              <Link
                href="/dashboard"
                className="px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-xl shadow-purple-600/30 transition duration-200 flex items-center gap-3"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <button
                onClick={handleSignIn}
                disabled={isSigningIn}
                className="px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-xl shadow-purple-600/30 transition duration-200 flex items-center gap-3 disabled:opacity-50"
              >
                <Github className="w-5 h-5" />
                {isSigningIn ? "Signing in..." : "Start Building Free"}
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950/80 backdrop-blur-md py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-purple-400" />
            <span className="font-semibold text-white">OpenGraph Studio</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#preview" className="hover:text-white transition-colors">Preview</a>
            <a href="https://github.com/rohitlodhii/OpenGraphGenerator" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
              <Github className="w-4 h-4" /> GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
