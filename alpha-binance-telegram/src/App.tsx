import { useState, useEffect } from "react";
import CompetitionTable from "./components/CompetitionTable";

function App() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  const handleScroll = () => {
    setShowBackToTop(window.scrollY > 100);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-white text-black min-h-screen font-serif wrapper-project">
      <main className="max-w-md mx-auto p-4">
        <CompetitionTable />
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
      <div className="copyright-text">© 71 Ambition</div>
    </div>
  );
}

export default App;
