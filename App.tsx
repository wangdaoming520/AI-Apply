import React, { useState, useCallback } from 'react';
import { BookOpen, Plus, Sparkles, Layout, Save, Wand2, Globe } from 'lucide-react';
import { StoryProject, MangaPanel, GenerationStatus, Language } from './types';
import { generateMangaScript, generatePanelImage } from './services/geminiService';
import { PanelCard } from './components/PanelCard';
import { translations, ART_STYLES } from './translations';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const t = translations[language];

  const [project, setProject] = useState<StoryProject>({
    id: '1',
    title: 'New Manga Project',
    genre: 'Sci-Fi Action',
    artStyle: 'shonen', // Default ID
    panels: [],
    createdAt: Date.now()
  });

  const [storyIdea, setStoryIdea] = useState('');
  const [isScriptLoading, setIsScriptLoading] = useState(false);
  const [panelCount, setPanelCount] = useState(4);
  const [activeTab, setActiveTab] = useState<'setup' | 'editor'>('setup');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  const handleGenerateScript = async () => {
    if (!storyIdea.trim()) return;
    
    setIsScriptLoading(true);
    try {
      const response = await generateMangaScript(storyIdea, panelCount, project.genre, language);
      
      const newPanels: MangaPanel[] = response.panels.map((p, index) => ({
        id: crypto.randomUUID(),
        panelNumber: index + 1,
        scriptDescription: p.description,
        dialogue: p.dialogue,
        characterNotes: p.characterFocus,
        imageStatus: GenerationStatus.IDLE
      }));

      setProject(prev => ({ ...prev, panels: newPanels }));
      setActiveTab('editor');
    } catch (error) {
      console.error("Script generation failed:", error);
      alert("Failed to generate script. Please check your API Key and try again.");
    } finally {
      setIsScriptLoading(false);
    }
  };

  const handleGenerateImage = async (panelId: string) => {
    const panel = project.panels.find(p => p.id === panelId);
    if (!panel) return;

    // Find the English label for the style to ensure consistent AI prompt results
    // We use the ID stored in project.artStyle to lookup the style object
    const styleObj = ART_STYLES.find(s => s.id === project.artStyle);
    const styleDescription = styleObj ? styleObj.label.en : project.artStyle;

    // Update status to loading
    setProject(prev => ({
      ...prev,
      panels: prev.panels.map(p => 
        p.id === panelId ? { ...p, imageStatus: GenerationStatus.LOADING } : p
      )
    }));

    try {
      const imageUrl = await generatePanelImage(
        panel.scriptDescription, 
        styleDescription, 
        panel.characterNotes
      );

      setProject(prev => ({
        ...prev,
        panels: prev.panels.map(p => 
          p.id === panelId ? { ...p, imageUrl, imageStatus: GenerationStatus.SUCCESS } : p
        )
      }));
    } catch (error) {
      console.error("Image generation failed:", error);
      setProject(prev => ({
        ...prev,
        panels: prev.panels.map(p => 
          p.id === panelId ? { ...p, imageStatus: GenerationStatus.ERROR } : p
        )
      }));
    }
  };

  const handleUpdateText = useCallback((id: string, field: 'dialogue' | 'scriptDescription', value: string) => {
    setProject(prev => ({
      ...prev,
      panels: prev.panels.map(p => 
        p.id === id ? { ...p, [field]: value } : p
      )
    }));
  }, []);

  const handleAddPanel = () => {
    const newPanel: MangaPanel = {
      id: crypto.randomUUID(),
      panelNumber: project.panels.length + 1,
      scriptDescription: language === 'zh' ? "一个新的场景..." : "A new scene...",
      dialogue: "",
      characterNotes: language === 'zh' ? "主角" : "Main Character",
      imageStatus: GenerationStatus.IDLE
    };
    setProject(prev => ({ ...prev, panels: [...prev.panels, newPanel] }));
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 font-sans selection:bg-brand-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-dark-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-brand-600 p-2 rounded-lg">
              <BookOpen size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              {t.title}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button 
                onClick={() => setActiveTab('setup')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'setup' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                {t.nav.setup}
              </button>
              <button 
                onClick={() => setActiveTab('editor')}
                disabled={project.panels.length === 0}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'editor' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white disabled:opacity-30'}`}
              >
                {t.nav.editor}
              </button>
            </nav>

            <div className="h-6 w-px bg-slate-800"></div>

            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              title="Switch Language"
            >
              <Globe size={18} />
              <span className="uppercase">{language}</span>
            </button>

            <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 rounded-lg text-sm font-semibold transition-colors">
              <Save size={16} /> <span className="hidden sm:inline">{t.nav.export}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-6">
        
        {activeTab === 'setup' && (
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold mb-4">{t.setup.heading}</h2>
              <p className="text-slate-400">{t.setup.subheading}</p>
            </div>

            <div className="bg-dark-800 border border-slate-700 rounded-2xl p-8 shadow-2xl space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">{t.setup.conceptLabel}</label>
                <textarea 
                  value={storyIdea}
                  onChange={(e) => setStoryIdea(e.target.value)}
                  placeholder={t.setup.conceptPlaceholder}
                  className="w-full h-32 bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none placeholder:text-slate-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">{t.setup.styleLabel}</label>
                  <select 
                    value={project.artStyle}
                    onChange={(e) => setProject(p => ({ ...p, artStyle: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-100 focus:ring-2 focus:ring-brand-500 outline-none"
                  >
                    {ART_STYLES.map(style => (
                      <option key={style.id} value={style.id}>
                        {style.label[language]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-300 mb-2">{t.setup.panelsLabel}</label>
                   <div className="flex items-center gap-4 bg-slate-900 border border-slate-700 rounded-xl p-2">
                      <input 
                        type="range" 
                        min="2" 
                        max="10" 
                        value={panelCount}
                        onChange={(e) => setPanelCount(Number(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
                      />
                      <span className="bg-slate-800 px-3 py-1 rounded-lg text-sm font-mono">{panelCount}</span>
                   </div>
                </div>
              </div>

              <button 
                onClick={handleGenerateScript}
                disabled={isScriptLoading || !storyIdea.trim()}
                className="w-full py-4 bg-gradient-to-r from-brand-600 to-violet-600 hover:from-brand-500 hover:to-violet-500 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isScriptLoading ? (
                  <>
                     <Sparkles className="animate-spin" /> {t.setup.generatingBtn}
                  </>
                ) : (
                  <>
                    <Wand2 className="group-hover:scale-110 transition-transform" /> {t.setup.generateBtn}
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'editor' && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                 <h2 className="text-2xl font-bold">{project.title}</h2>
                 <p className="text-sm text-slate-400 font-mono mt-1">
                   {project.panels.length} {t.editor.panelsCount} • {ART_STYLES.find(s => s.id === project.artStyle)?.label[language]}
                 </p>
              </div>
              <button 
                onClick={handleAddPanel}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors border border-slate-700"
              >
                <Plus size={18} /> {t.editor.addPanel}
              </button>
            </div>

            <div className="grid gap-8">
              {project.panels.map((panel) => (
                <PanelCard 
                  key={panel.id} 
                  panel={panel} 
                  language={language}
                  onGenerateImage={handleGenerateImage}
                  onUpdateText={handleUpdateText}
                />
              ))}
            </div>
            
            <div className="h-20 flex items-center justify-center text-slate-600 border-t border-slate-800 border-dashed">
              <Layout size={24} className="mr-2 opacity-50" /> {t.editor.endScene}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}