import React from 'react'
import VoiceCard, { VoiceObject } from './VoiceCard'

type VoiceLibraryProps = {
  voices: Array<VoiceObject | null | undefined>;
  onAudition?: (v: VoiceObject) => void;
  onSelect?: (v: VoiceObject) => void;
  onUpload?: (file?: File) => void;
};

const VoiceLibrary: React.FC<VoiceLibraryProps> = ({ 
  voices = [], 
  onAudition, 
  onSelect, 
  onUpload 
}) => {
  // Filter out any null/undefined voices and ensure we have valid data
  const validVoices = React.useMemo(() => {
    return (Array.isArray(voices) ? voices : [])
      .filter((v): v is VoiceObject => !!v && typeof v === 'object' && 'id' in v);
  }, [voices]);
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Voice Library</h3>
        <div className="text-sm text-slate-400">Curated voices • drag to upload</div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {validVoices.length > 0 ? (
          validVoices.map((v) => (
            <VoiceCard 
              key={typeof v.id === 'number' || typeof v.id === 'string' ? v.id : Math.random().toString()}
              v={v} 
              onSelect={onSelect} 
              onAudition={onAudition} 
            />
          ))
        ) : (
          <div className="col-span-2 text-center text-slate-400 text-sm py-4">
            No valid voices found
          </div>
        )}
      </div>

      <div className="mt-3 p-3 rounded glass flex items-center justify-between">
        <div className="text-sm text-slate-400">Drop a WAV/MP3 here to add</div>
        <input type="file" accept=".wav,.mp3,.m4a" onChange={(e)=> onUpload?.(e.target.files?.[0])}/>
      </div>
    </div>
  )
}
