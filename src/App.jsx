import React, { useState, useEffect } from 'react';
import BackgroundCanvas from './components/BackgroundCanvas.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Skills from './components/Skills.jsx';
import Projects from './components/Projects.jsx';
import ProjectModal from './components/ProjectModal.jsx';
import Experience from './components/Experience.jsx';
import Terminal from './components/Terminal.jsx';
import Contact from './components/Contact.jsx';
import AdminModal from './components/AdminModal.jsx';
import Toast from './components/Toast.jsx';
import Footer from './components/Footer.jsx';
import { profileData } from './data/profile.js';

export default function App() {
  const [luxoraModalOpen, setLuxoraModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  const handleCopyEmail = () => {
    navigator.clipboard
      .writeText(profileData.socialLinks.email)
      .then(() => {
        showToast('Email address copied to clipboard!');
      })
      .catch(() => {
        showToast(`Email: ${profileData.socialLinks.email}`);
      });
  };

  // Expose global methods for backward compatibility with scripts/terminals
  useEffect(() => {
    window.scrollTo(0, 0);

    window.showToast = showToast;
    window.openAdminPrivacyModal = () => setAdminModalOpen(true);
    window.closeAdminPrivacyModal = () => setAdminModalOpen(false);
    window.openLuxoraModal = () => setLuxoraModalOpen(true);
    window.closeLuxoraModal = () => setLuxoraModalOpen(false);
    window.copyEmailToClipboard = handleCopyEmail;

    // Apply ecosystem visibility after React mounts
    if (window.EcosystemVisibility && typeof window.EcosystemVisibility.applyVisibility === 'function') {
      window.EcosystemVisibility.applyVisibility();
    }

    // Scroll reveal observer
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px'
      }
    );

    document.querySelectorAll('.reveal').forEach((el) => {
      revealObserver.observe(el);
    });

    // Mouse spotlight interaction for spotlight-cards
    const handleMouseMove = (e) => {
      const cards = document.querySelectorAll('.spotlight-card');
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      revealObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="bg-dark-950 text-slate-200 font-sans antialiased selection:bg-cyan-500/30 selection:text-cyan-200 min-h-screen relative overflow-x-hidden">
      <BackgroundCanvas />

      <Navbar onOpenAdmin={() => setAdminModalOpen(true)} />

      <main className="pt-20 sm:pt-24 pb-28 w-full min-w-0 overflow-x-hidden">
        <Hero onCopyEmail={handleCopyEmail} />
        <About />
        <Skills />
        <Projects onOpenLuxoraModal={() => setLuxoraModalOpen(true)} />
        <Experience />
        <Terminal onAdminLogin={() => setAdminModalOpen(true)} />
        <Contact onCopyEmail={handleCopyEmail} />
      </main>

      <Footer />

      <ProjectModal
        isOpen={luxoraModalOpen}
        onClose={() => setLuxoraModalOpen(false)}
      />

      <AdminModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        onToast={showToast}
      />

      <Toast message={toastMessage} />
    </div>
  );
}
