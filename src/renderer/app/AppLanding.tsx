import React, { useEffect, useState } from 'react';
import logoUrl from '../assets/logo.png';

interface AppLandingProps {
  onStart: () => void;
}

export const AppLanding: React.FC<AppLandingProps> = ({ onStart }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Slight delay for smooth entrance animation
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={styles.root}>
      {/* Animated Mesh Gradient Background */}
      <div style={styles.meshContainer}>
        <div style={{...styles.blob, ...styles.blob1}} />
        <div style={{...styles.blob, ...styles.blob2}} />
        <div style={{...styles.blob, ...styles.blob3}} />
        <div style={{...styles.blob, ...styles.blob4}} />
        <div style={styles.noiseOverlay} />
      </div>

      {/* Main Content */}
      <div style={{
        ...styles.content,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
      }}>
        <div style={styles.logoWrap}>
          <img src={logoUrl} alt="Billium Logo" style={styles.logoImg} />
          <h1 style={styles.logoText}>Billium</h1>
        </div>

        <h2 style={styles.title}>
          The smartest way to<br />
          <span style={styles.titleGradient}>manage your business.</span>
        </h2>
        
        <p style={styles.subtitle}>
          Create professional invoices, manage clients, and track payments.<br/>
          Designed for speed. Built for privacy.
        </p>

        <button style={styles.btn} onClick={onStart}
          onMouseEnter={e => { 
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; 
            (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 30px rgba(0, 77, 230, 0.4)'; 
          }}
          onMouseLeave={e => { 
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; 
            (e.currentTarget as HTMLElement).style.boxShadow = '0 0px 0px rgba(0,0,0,0)'; 
          }}
        >
          Get Started
          <span style={styles.btnArrow}>→</span>
        </button>
      </div>
      
      {/* Inject Keyframes for background animation */}
      <style>{`
        @keyframes blobBounce {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 0 rgba(0, 77, 230, 0.4); }
          70% { box-shadow: 0 0 0 20px rgba(0, 77, 230, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0, 77, 230, 0); }
        }
      `}</style>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  root: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: '#0a0a0a', // Deep elegant dark
    fontFamily: "'Inter', -apple-system, sans-serif",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  meshContainer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    overflow: 'hidden',
    zIndex: 1,
    filter: 'blur(80px)', // The magic that makes it a mesh gradient
    opacity: 0.8,
  },
  blob: {
    position: 'absolute',
    borderRadius: '50%',
    animation: 'blobBounce 15s infinite ease-in-out',
  },
  blob1: {
    top: '-10%', left: '-10%',
    width: '60vw', height: '60vw',
    backgroundColor: 'rgba(0, 77, 230, 0.4)', // Deep Blue
    animationDelay: '0s',
  },
  blob2: {
    top: '40%', right: '-20%',
    width: '50vw', height: '50vw',
    backgroundColor: 'rgba(124, 58, 237, 0.3)', // Purple
    animationDelay: '2s',
  },
  blob3: {
    bottom: '-20%', left: '20%',
    width: '45vw', height: '45vw',
    backgroundColor: 'rgba(56, 189, 248, 0.3)', // Light Blue/Cyan
    animationDelay: '4s',
  },
  blob4: {
    top: '10%', left: '40%',
    width: '30vw', height: '30vw',
    backgroundColor: 'rgba(236, 72, 153, 0.15)', // Pink accent
    animationDelay: '6s',
  },
  noiseOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'url(https://grainy-gradients.vercel.app/noise.svg)',
    opacity: 0.4,
    mixBlendMode: 'overlay',
  },
  content: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)',
    maxWidth: 800,
    padding: 24,
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 40,
    background: 'rgba(255, 255, 255, 0.03)',
    padding: '12px 24px',
    borderRadius: 100,
    border: '1px solid rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)',
  },
  logoImg: {
    height: 32,
    width: 'auto',
  },
  logoText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: '-0.5px',
    margin: 0,
  },
  title: {
    color: '#fff',
    fontSize: 'clamp(42px, 5vw, 64px)',
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: '-1.5px',
    marginBottom: 24,
  },
  titleGradient: {
    background: 'linear-gradient(to right, #60a5fa, #c084fc)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    color: '#9ca3af',
    fontSize: 'clamp(16px, 2vw, 20px)',
    lineHeight: 1.6,
    marginBottom: 48,
    fontWeight: 400,
    maxWidth: 540,
  },
  btn: {
    padding: '18px 40px',
    borderRadius: 100,
    border: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'linear-gradient(135deg, rgba(255,255,255,1), rgba(220,220,220,1))',
    color: '#000',
    fontSize: 18,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    animation: 'pulseGlow 3s infinite',
  },
  btnArrow: {
    fontSize: 20,
    fontWeight: 400,
  }
};
