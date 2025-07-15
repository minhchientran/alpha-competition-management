import { useState, useEffect } from "react";
import CompetitionTable from "./components/CompetitionTable";
import AlphaSoonTable from "./components/AlphaSoonTable";
// import LibreChat from "./components/LibreChat";


import MysteryBox from "./components/MysteryBox";

function App() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('theme');
    return stored ? stored : 'dark';
  });
  // const [showLibreChat, setShowLibreChat] = useState(false);

  const [currentMode, setCurrentMode] = useState<'competition' | 'alphaSoon'>('competition');
  const [showMysteryBox, setShowMysteryBox] = useState(false);

  useEffect(() => {
    // Set theme class on <html>
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleScroll = () => {
    setShowBackToTop(window.scrollY > 100);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMysteryBoxClose = () => {
    setShowMysteryBox(false);
    // Set a flag in localStorage to hide the box for 1 day
    localStorage.setItem('mysteryBoxDismissedAt', Date.now().toString());
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    // Only show the box if not dismissed in the last 24 hours
    const dismissedAt = localStorage.getItem('mysteryBoxDismissedAt');
    if (!dismissedAt || (Date.now() - parseInt(dismissedAt, 10)) > 24 * 60 * 60 * 1000) {
      setShowMysteryBox(true);
    }
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // const toggleLibreChat = () => {
  //   setShowLibreChat(prev => !prev);
  // };

  const toggleMode = () => {
    setCurrentMode(prev => prev === 'competition' ? 'alphaSoon' : 'competition');
  };

  return (
    <div className="min-h-screen p-2 wrapper-project">
      <main className="max-w-md mx-auto p-4">
        <div className=" flex justify-between items-center mb-2">
            <button
              onClick={toggleMode}
              className="mode-toggle-btn px-3 py-1 text-sm font-medium rounded border transition-colors bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
              title="Toggle mode"
            >
              {currentMode === 'competition' ? 'Alpha mode' : 'Competition mode'}
            </button>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn"
              title="Toggle dark/light mode"
            >
              {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>
        </div>
        {currentMode === 'competition' ? <CompetitionTable /> : <AlphaSoonTable />}
      </main>

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 z-50 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-5 rounded-full shadow-lg"
          title="Go to top"
        >
          ↑
        </button>
      )}
      {/* <div className="ai-chat-container"><LibreChat isOpen={showLibreChat} onToggle={toggleLibreChat} /></div> */}

      {/* Mystery Box Giveaway - only show if not dismissed */}
      {showMysteryBox && (
        <MysteryBox onClose={handleMysteryBoxClose} />
      )}
      <div className="copyright-text">© 71 Ambition - ver 2.0.1</div>
    </div>
  );
}

export default App;
