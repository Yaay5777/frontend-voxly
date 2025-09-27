import React, { useRef, useState } from 'react'

export default function Player({ src }: { src: string | null }) {
  const audioRef = useRef<HTMLAudioElement|null>(null)
  const [playing,setPlaying] = useState(false)
  if(!src) return <div className="text-slate-400">No preview yet</div>

  function toggle(){
    if(!audioRef.current) return
    if(playing) audioRef.current.pause()
    else audioRef.current.play()
    setPlaying(!playing)
  }

  return (
    <div className="flex items-center gap-3">
      <button onClick={toggle} className="px-3 py-1 rounded bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
        {playing ? 'Pause' : 'Play'}
      </button>
      <audio ref={audioRef} src={src} onEnded={()=> setPlaying(false)} />
      <a className="ml-auto px-3 py-1 rounded bg-amber-400 text-black" href={src} download="voxly.wav">Download</a>
    </div>
  )
}
