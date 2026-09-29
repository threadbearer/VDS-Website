"use client";
import React, { useEffect, useState } from "react";
import Portfolio from "./components/Portfolio"
import { Hero } from "./components/Hero";
import Services from "./components/Services"
import Pricing from "./components/Pricing";
import Process from "./components/Process";
import About from "./components/About";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen text-white" style={{ background: 'var(--bg)' }}>
      <Hero/>
      <Services/>
      <Pricing/>
      <Process/>
      <Portfolio/>
      <About/>
      <Footer/>
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-[rgba(198,166,100,0.05)]" />
    </div>
  );
}

