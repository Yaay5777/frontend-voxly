import React from 'react'
export default function Hero(){
  return (
    <section className="py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="glass p-6 rounded-lg">
          <h1 className="text-3xl md:text-5xl font-extrabold">Clone voices that move people — in seconds.</h1>
          <p className="text-slate-300 mt-2">Professional AI voice cloning, curated voices & private local inference.</p>
          <div className="mt-6 h-32 bg-gradient-to-r from-indigo-400 via-purple-400 to-teal-400 rounded-lg overflow-hidden">
            <svg viewBox="0 0 1200 160" className="w-full h-full">
              <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stopColor="#7C3AED"/><stop offset="1" stopColor="#06B6D4"/></linearGradient></defs>
              <path d="M0 80 C200 20 400 140 600 80 C800 20 1000 140 1200 80 L1200 160 L0 160 Z" fill="url(#g)" className="wave-anim"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
