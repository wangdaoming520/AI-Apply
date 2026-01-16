import React from 'react';
import { MangaPanel, GenerationStatus, Language } from '../types';
import { RefreshCw, MessageSquare, Image as ImageIcon, Sparkles } from 'lucide-react';
import { translations } from '../translations';

interface PanelCardProps {
  panel: MangaPanel;
  language: Language;
  onGenerateImage: (id: string) => void;
  onUpdateText: (id: string, field: 'dialogue' | 'scriptDescription', value: string) => void;
}

export const PanelCard: React.FC<PanelCardProps> = ({ panel, language, onGenerateImage, onUpdateText }) => {
  const isGenerating = panel.imageStatus === GenerationStatus.LOADING;
  const t = translations[language].panel;

  return (
    <div className="bg-dark-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg hover:border-brand-500 transition-colors duration-300 flex flex-col md:flex-row h-full md:h-80">
      
      {/* Left Side: Image Area */}
      <div className="md:w-80 w-full h-80 md:h-full bg-slate-900 flex-shrink-0 relative group">
        {panel.imageUrl ? (
          <>
            <img 
              src={panel.imageUrl} 
              alt={`Panel ${panel.panelNumber}`} 
              className="w-full h-full object-cover"
            />
            {/* Overlay Dialogue Preview */}
            {panel.dialogue && (
               <div className="absolute bottom-4 left-4 right-4 bg-white/90 text-black p-2 rounded-lg text-sm font-comic shadow-md border-2 border-black pointer-events-none">
                 {panel.dialogue}
               </div>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={() => onGenerateImage(panel.id)}
                className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-full flex items-center gap-2 font-medium"
              >
                <RefreshCw size={16} /> {t.regenerate}
              </button>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 p-6 text-center border-r border-slate-700">
            {isGenerating ? (
              <div className="flex flex-col items-center animate-pulse text-brand-400">
                <Sparkles size={48} className="mb-4 animate-spin-slow" />
                <span className="text-sm font-medium">{t.drawing}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <ImageIcon size={48} className="mb-2 opacity-50" />
                <p className="text-sm mb-4">{t.noImage}</p>
                <button
                  onClick={() => onGenerateImage(panel.id)}
                  className="bg-slate-700 hover:bg-brand-600 text-white px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2"
                >
                  <Sparkles size={16} /> {t.generate}
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Panel Number Badge */}
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          #{panel.panelNumber}
        </div>
      </div>

      {/* Right Side: Script Editor */}
      <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <ImageIcon size={14} /> {t.visualLabel}
          </label>
          <textarea
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none h-24"
            value={panel.scriptDescription}
            onChange={(e) => onUpdateText(panel.id, 'scriptDescription', e.target.value)}
            placeholder={t.visualPlaceholder}
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <MessageSquare size={14} /> {t.dialogueLabel}
          </label>
          <textarea
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none h-20 font-comic"
            value={panel.dialogue}
            onChange={(e) => onUpdateText(panel.id, 'dialogue', e.target.value)}
            placeholder={t.dialoguePlaceholder}
          />
        </div>
        
        <div className="mt-auto pt-2 text-xs text-slate-500 flex justify-between items-center">
             <span>{t.focusPrefix}{panel.characterNotes}</span>
             <span className={`px-2 py-1 rounded text-[10px] ${panel.imageStatus === GenerationStatus.SUCCESS ? 'text-green-400 bg-green-900/20' : 'text-slate-400 bg-slate-800'}`}>
                {panel.imageStatus}
             </span>
        </div>
      </div>
    </div>
  );
};