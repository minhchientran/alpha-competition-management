import { useState, useEffect } from "react";
import CompetitionTable from "./components/CompetitionTable";
// import MysteryBox from "./components/MysteryBox";

function App() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  // const [showMysteryBox, setShowMysteryBox] = useState(false);

  const handleScroll = () => {
    setShowBackToTop(window.scrollY > 100);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // const handleMysteryBoxClose = () => {
  //   setShowMysteryBox(false);
  //   // Set a flag in localStorage to hide the box for 1 day
  //   localStorage.setItem('mysteryBoxDismissedAt', Date.now().toString());
  // };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    // Only show the box if not dismissed in the last 24 hours
    // const dismissedAt = localStorage.getItem('mysteryBoxDismissedAt');
    // if (!dismissedAt || (Date.now() - parseInt(dismissedAt, 10)) > 24 * 60 * 60 * 1000) {
    //   setShowMysteryBox(true);
    // }
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
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
      {/* Mystery Box Giveaway - only show if not dismissed */}
      {/* {showMysteryBox && (
        <MysteryBox onClose={handleMysteryBoxClose} />
      )} */}
      <div className="copyright-text">© 71 Ambition</div>
    </div>
  );
}

export default App;
