"use client";
import React, { useEffect, useState } from "react";
import Portfolio from "./components/Portfolio"
import { Hero } from "./components/Hero";
import Services from "./components/Services"
import Pricing from "./components/Pricing";
import Process from "./components/Process";
import About from "./components/About";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot"
// --- Shared ---
const CYAN = "#00FFFF";
function Container({ children }) {
  return <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>;
}
const BOOKING = "https://calendar.app.google/MCoM4jfg2dWgypC47";
const BRAND = {
  name: "Vega Design Studio",
  city: "Los Angeles",
  gold: "#C6A664",
  dark: "#0B0B0B",
  mid: "#1A1A1A",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Hero/>
      <Services/>
      <Pricing/>
      <Process/>
      <Portfolio/>
      <About/>
      <Chatbot/>
      <Footer/>
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-[rgba(0,255,255,0.08)]" />
    </div>
  );
}

