import { type FC, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

export const LandingPage: FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [release, setRelease] = useState<any>(null);
  const [osName, setOsName] = useState<'Windows' | 'Mac' | 'Linux' | 'Unknown'>('Unknown');

  useEffect(() => {
    // Detect OS
    const platform = window.navigator.platform.toLowerCase();
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (platform.includes('win') || userAgent.includes('windows')) {
      setOsName('Windows');
    } else if (platform.includes('mac') || userAgent.includes('mac')) {
      setOsName('Mac');
    } else if (platform.includes('linux') || userAgent.includes('linux')) {
      setOsName('Linux');
    }

    // Fetch latest release
    fetch('https://api.github.com/repos/satyakiabhijit/Billium/releases/latest')
      .then(res => res.json())
      .then(data => {
        if (data && data.assets) {
          setRelease(data);
        }
      })
      .catch(err => console.error('Failed to fetch latest release:', err));
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Three.js Scene Setup
    const scene = new THREE.Scene();

    // Add soft fog
    scene.fog = new THREE.Fog('#f0f5fa', 10, 40);

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 18;

    // Use alpha: true for a transparent background so we can use CSS gradients
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvasRef.current.appendChild(renderer.domElement);

    // Beautiful soft lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    const blueLight = new THREE.PointLight(0x004de6, 3, 50);
    blueLight.position.set(-10, 10, -5);
    scene.add(blueLight);

    const greenLight = new THREE.PointLight(0x22c55e, 2, 50);
    greenLight.position.set(10, -10, 5);
    scene.add(greenLight);

    // Create a texture that looks like an invoice (header + lines)
    const createInvoiceTexture = (isBlue = false) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 712;
      const ctx = canvas.getContext('2d')!;

      // Base paper color
      ctx.fillStyle = isBlue ? '#f5f8ff' : '#ffffff';
      ctx.fillRect(0, 0, 512, 712);

      // Header area
      ctx.fillStyle = isBlue ? '#e0ebff' : '#f0f0f5';
      ctx.fillRect(0, 0, 512, 160);

      // Logo box placeholder
      ctx.fillStyle = isBlue ? '#004de6' : '#d1d5db';
      ctx.beginPath();
      ctx.roundRect(40, 40, 80, 80, 16);
      ctx.fill();

      // Title lines
      ctx.fillStyle = isBlue ? '#004de6' : '#9ca3af';
      ctx.beginPath();
      ctx.roundRect(150, 50, 200, 24, 12);
      ctx.roundRect(150, 90, 140, 20, 10);
      ctx.fill();

      // Table header
      ctx.fillStyle = isBlue ? '#e0ebff' : '#f3f4f6';
      ctx.beginPath();
      ctx.roundRect(40, 200, 432, 40, 8);
      ctx.fill();

      // Table rows
      ctx.fillStyle = isBlue ? '#d1e0ff' : '#e5e7eb';
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.roundRect(40, 260 + (i * 60), 280, 16, 8); // Item desc
        ctx.roundRect(350, 260 + (i * 60), 122, 16, 8); // Price
        ctx.fill();

        // Separator line
        ctx.fillStyle = isBlue ? '#e0ebff' : '#f3f4f6';
        ctx.fillRect(40, 300 + (i * 60), 432, 2);
        ctx.fillStyle = isBlue ? '#d1e0ff' : '#e5e7eb';
      }

      // Total box
      ctx.fillStyle = isBlue ? '#004de6' : '#4b5563';
      ctx.beginPath();
      ctx.roundRect(300, 580, 172, 48, 12);
      ctx.fill();

      const texture = new THREE.CanvasTexture(canvas);
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return texture;
    };

    const texNormal = createInvoiceTexture(false);
    const texBlue = createInvoiceTexture(true);

    // Create floating invoices
    const invoiceGeometry = new THREE.BoxGeometry(4.5, 6.3, 0.08); // A4 roughly

    // Smooth, premium paper material with slight rounded edge illusion
    const createMaterial = (texture: THREE.CanvasTexture) => new THREE.MeshPhysicalMaterial({
      map: texture,
      color: 0xffffff,
      roughness: 0.4,
      metalness: 0.1,
      clearcoat: 0.3,
      clearcoatRoughness: 0.2,
      envMapIntensity: 1.0,
      side: THREE.FrontSide
    });

    const matNormal = createMaterial(texNormal);
    const matBlue = createMaterial(texBlue);

    // Back side of paper
    const backMat = new THREE.MeshPhysicalMaterial({
      color: 0xf9fafb,
      roughness: 0.6,
      metalness: 0.1
    });

    const invoices: { mesh: THREE.Group, rotX: number, rotY: number, rotZ: number, floatSpeed: number, floatOffset: number }[] = [];

    for (let i = 0; i < 15; i++) {
      const group = new THREE.Group();

      // Materials array: [right, left, top, bottom, front, back]
      const materials = [backMat, backMat, backMat, backMat, i % 3 === 0 ? matBlue : matNormal, backMat];
      const mesh = new THREE.Mesh(invoiceGeometry, materials);

      // Cast soft shadows (simulated)
      group.add(mesh);

      // Position them around the edges to avoid blocking center text
      const angle = (i / 15) * Math.PI * 2;
      const radius = 10 + Math.random() * 8;
      const height = (Math.random() - 0.5) * 25;

      // Distribute in an elliptical cylinder, pushing away from the center (0,0)
      let x = Math.cos(angle) * radius * 1.5;
      let y = height;
      let z = (Math.random() - 0.5) * 12 - 5;

      // Ensure nothing is directly in front of the center text (x: -5 to 5, y: -5 to 5)
      if (Math.abs(x) < 7 && Math.abs(y) < 7 && z > 0) {
        z -= 10; // Push it far back
      }

      group.position.set(x, y, z);

      // Nice gentle initial rotations
      group.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        (Math.random() - 0.5) * 0.5
      );

      scene.add(group);
      invoices.push({
        mesh: group,
        rotX: (Math.random() - 0.5) * 0.005,
        rotY: (Math.random() - 0.5) * 0.008,
        rotZ: (Math.random() - 0.5) * 0.002,
        floatSpeed: 0.001 + Math.random() * 0.001,
        floatOffset: Math.random() * Math.PI * 2
      });
    }

    // Gentle floating particles for premium feel
    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 100;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 40;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.1,
      color: 0x004de6,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particlesGeo, particleMat);
    scene.add(particles);

    // Animation Loop
    let time = 0;
    let rafId: number;
    // Mouse interaction
    let targetX = 0;
    let targetY = 0;
    const onMouseMove = (event: MouseEvent) => {
      targetX = (event.clientX / window.innerWidth) * 2 - 1;
      targetY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      time += 1;

      // Smooth camera parallax based on mouse
      camera.position.x += (targetX * 2 - camera.position.x) * 0.05;
      camera.position.y += (targetY * 2 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      // Rotate entire scene very slowly
      scene.rotation.y = Math.sin(time * 0.0005) * 0.1;

      // Slowly rotate particles
      particles.rotation.y = time * 0.001;

      // Animate individual invoices
      invoices.forEach((inv) => {
        inv.mesh.rotation.x += inv.rotX;
        inv.mesh.rotation.y += inv.rotY;
        inv.mesh.rotation.z += inv.rotZ;

        // Gentle bobbing up and down
        inv.mesh.position.y += Math.sin(time * inv.floatSpeed + inv.floatOffset) * 0.03;
      });

      renderer.render(scene, camera);
    };
    animate();

    // Handle Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
      if (canvasRef.current) {
        canvasRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      texNormal.dispose();
      texBlue.dispose();
    };
  }, []);

  useEffect(() => {
    // Fetch GitHub Contributors
    fetch('https://api.github.com/repos/satyakiabhijit/Billium/contributors')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setContributors(data);
        } else {
          throw new Error('No public contributors found or repo is private');
        }
      })
      .catch(err => {
        console.error("Using mock contributors:", err);
        // Fallback to mock data so the UI is visible for demonstration
        setContributors([
          { login: 'satyakiabhijit', avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4', html_url: 'https://github.com/satyakiabhijit', contributions: 42 },
          { login: 'open-source-dev', avatar_url: 'https://avatars.githubusercontent.com/u/2?v=4', html_url: '#', contributions: 12 },
          { login: 'designer-pro', avatar_url: 'https://avatars.githubusercontent.com/u/3?v=4', html_url: '#', contributions: 5 },
        ]);
      });
  }, []);

  const goToApp = () => navigate('/app');

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const styles: Record<string, React.CSSProperties> = {
    root: {
      position: 'relative', minHeight: '100vh',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: '#1a1a2e',
      background: 'radial-gradient(ellipse at top, #ffffff 0%, #f0f5fa 100%)',
      overflowX: 'hidden',
    },
    canvas: { position: 'fixed', inset: 0, zIndex: 0, width: '100%', height: '100%', pointerEvents: 'none' },
    nav: {
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      width: '100%', boxSizing: 'border-box',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 48px', height: 64,
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(0,0,0,0.06)',
      boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
    },
    logo: { display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit', cursor: 'pointer' },
    logoImg: { height: 32, width: 'auto' },
    logoText: { fontSize: 20, fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.3px' },
    navLinks: { display: 'flex', gap: 32, listStyle: 'none', margin: 0, padding: 0 },
    navLink: { fontSize: 15, fontWeight: 500, color: '#4a4a6a', cursor: 'pointer', textDecoration: 'none', transition: 'color 0.2s' },
    navActions: { display: 'flex', gap: 12, alignItems: 'center' },
    btnOutline: {
      padding: '8px 20px', borderRadius: 6,
      border: '1.5px solid #004de6', background: 'transparent',
      color: '#004de6', fontSize: 14, fontWeight: 600, cursor: 'pointer',
      transition: 'all 0.2s',
    },
    btnPrimary: {
      padding: '8px 20px', borderRadius: 6, border: 'none',
      background: 'linear-gradient(135deg, #004de6, #001a4d)',
      color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0,77,230,0.3)',
      transition: 'all 0.2s',
    },
    hero: {
      position: 'relative', zIndex: 10,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      textAlign: 'center', padding: '88px 24px 60px', maxWidth: 900, margin: '0 auto',
    },
    heroContent: {
      background: 'rgba(255, 255, 255, 0.75)',
      backdropFilter: 'blur(20px)',
      padding: '40px 60px',
      borderRadius: 32,
      border: '1px solid rgba(255,255,255,0.8)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.05)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
    },
    heroBadge: {
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '6px 16px', borderRadius: 99,
      background: 'rgba(0,77,230,0.08)',
      border: '1px solid rgba(0,77,230,0.2)',
      color: '#004de6', fontSize: 13, fontWeight: 700, marginBottom: 28,
    },
    h1: {
      fontSize: 'clamp(38px, 6vw, 72px)', fontWeight: 800,
      lineHeight: 1.1, marginBottom: 24, color: '#001a4d',
      letterSpacing: '-1.5px',
      textShadow: '0 2px 10px rgba(255,255,255,1)'
    },
    h1Accent: { color: '#004de6' },
    heroSub: {
      fontSize: 19, color: '#4b5563', maxWidth: 560,
      lineHeight: 1.7, marginBottom: 44,
      textShadow: '0 1px 5px rgba(255,255,255,1)'
    },
    heroCta: { display: 'flex', gap: 14, flexWrap: 'wrap' as const, justifyContent: 'center', marginBottom: 56 },
    btnHero: {
      padding: '15px 36px', borderRadius: 8, border: 'none',
      background: 'linear-gradient(135deg, #004de6, #001a4d)',
      color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer',
      boxShadow: '0 4px 20px rgba(0,77,230,0.35)',
      transition: 'all 0.25s',
    },
    btnHeroSecondary: {
      padding: '15px 30px', borderRadius: 8,
      border: '1.5px solid rgba(0,0,0,0.15)',
      background: 'rgba(255,255,255,0.9)', color: '#374151',
      fontSize: 16, fontWeight: 600, cursor: 'pointer', textDecoration: 'none',
      display: 'flex', alignItems: 'center', gap: 8,
      transition: 'all 0.25s',
      backdropFilter: 'blur(10px)',
    },
  };

  return (
    <div style={styles.root}>
      {/* 3D Background Container */}
      <div ref={canvasRef} style={styles.canvas} />

      {/* NAV */}
      <nav style={styles.nav}>
        <div style={styles.logo} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src="/billium logo.png" alt="Billium Logo" style={styles.logoImg} />
          <span style={styles.logoText}>Billium</span>
        </div>
        <ul style={styles.navLinks}>
          <li onClick={() => scrollTo('features')}><a style={styles.navLink} onMouseEnter={e => (e.currentTarget.style.color = '#004de6')} onMouseLeave={e => (e.currentTarget.style.color = '#4a4a6a')}>Features</a></li>
          <li onClick={() => scrollTo('pricing')}><a style={styles.navLink} onMouseEnter={e => (e.currentTarget.style.color = '#004de6')} onMouseLeave={e => (e.currentTarget.style.color = '#4a4a6a')}>Pricing</a></li>
          <li onClick={() => scrollTo('contribute')}><a style={styles.navLink} onMouseEnter={e => (e.currentTarget.style.color = '#004de6')} onMouseLeave={e => (e.currentTarget.style.color = '#4a4a6a')}>Contribute</a></li>
        </ul>
        <div style={styles.navActions}>
          <a href="https://github.com/satyakiabhijit/Billium" target="_blank" rel="noreferrer" style={{ ...styles.btnOutline, textDecoration: 'none', display: 'inline-block' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#004de6'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#004de6'; }}
          >GitHub ★</a>
          <button style={styles.btnPrimary} onClick={goToApp}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
          >Get Started Free</button>
        </div>
      </nav>      {/* HERO */}
      <section style={{ position: 'relative', zIndex: 10 }}>
        <div style={styles.hero}>
          <div style={styles.heroContent}>
            <div style={styles.heroBadge}>
              <span>🎉</span> Free & Open Source · No subscriptions
            </div>
            <h1 style={styles.h1}>
              The smarter way to<br />
              <span style={styles.h1Accent}>invoice your clients.</span>
            </h1>
            <p style={styles.heroSub}>
              Create professional invoices and quotes in seconds. Manage clients, track payments, and export beautiful PDFs - all offline, all free, forever.
            </p>
            <div style={styles.heroCta}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
                <button style={styles.btnHero} onClick={goToApp}
                  onMouseEnter={e => { (e.target as HTMLElement).style.transform = 'translateY(-2px)'; (e.target as HTMLElement).style.boxShadow = '0 8px 30px rgba(0,77,230,0.45)'; }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.transform = 'translateY(0)'; (e.target as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,77,230,0.35)'; }}
                >
                  Start Web App Free →
                </button>
                
                {(release || true) && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8, fontWeight: 600 }}>OR DOWNLOAD DESKTOP APP</div>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                      {['Windows', 'Mac', 'Linux'].map(os => {
                        let asset;
                        if (release) {
                          if (os === 'Windows') asset = release.assets?.find((a: any) => a.name.endsWith('.exe'));
                          if (os === 'Mac') asset = release.assets?.find((a: any) => a.name.endsWith('.dmg'));
                          if (os === 'Linux') asset = release.assets?.find((a: any) => a.name.endsWith('.deb') || a.name.endsWith('.AppImage'));
                        }
                        
                        const isRecommended = os === osName;
                        const isPlaceholder = !release || !asset;
                        
                        return (
                          <a key={os} href={asset ? asset.browser_download_url : '#'} style={{
                            ...styles.btnHeroSecondary, 
                            padding: '10px 20px', 
                            fontSize: 14,
                            borderColor: isRecommended ? '#004de6' : 'rgba(0,0,0,0.15)',
                            background: isRecommended ? '#f0f5fa' : 'rgba(255,255,255,0.9)',
                            color: isRecommended ? '#004de6' : '#374151',
                            opacity: isPlaceholder ? 0.6 : 1,
                            cursor: isPlaceholder ? 'not-allowed' : 'pointer'
                          }}
                            title={isPlaceholder ? 'Release is building on GitHub...' : `Download for ${os}`}
                            onClick={e => { if(isPlaceholder) e.preventDefault(); }}
                            onMouseEnter={e => { if(!isPlaceholder) { (e.currentTarget as HTMLElement).style.background = isRecommended ? '#e0ebff' : '#fff'; (e.currentTarget as HTMLElement).style.borderColor = '#004de6'; } }}
                            onMouseLeave={e => { if(!isPlaceholder) { (e.currentTarget as HTMLElement).style.background = isRecommended ? '#f0f5fa' : 'rgba(255,255,255,0.9)'; (e.currentTarget as HTMLElement).style.borderColor = isRecommended ? '#004de6' : 'rgba(0,0,0,0.15)'; } }}
                          >
                            {isRecommended && <span style={{ marginRight: 6 }}>⭐</span>}
                            Download for {os}
                          </a>
                        );
                      })}
                    </div>
                    <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 8 }}>
                      {release ? `Latest Release: ${release.tag_name}` : '⚙️ GitHub Action is building the first release...'}
                    </div>
                  </div>
                )}
              </div>
              <a href="https://github.com/satyakiabhijit/Billium" target="_blank" rel="noreferrer" style={styles.btnHeroSecondary}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,77,230,0.4)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.9)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.15)'; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#374151"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
                View on GitHub
              </a>
            </div>
          </div>

          {/* Social proof */}
          <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' as const, justifyContent: 'center', color: '#6b7280', fontSize: 14, background: 'rgba(255,255,255,0.7)', padding: '20px 40px', borderRadius: 16, backdropFilter: 'blur(10px)', border: '1px solid rgba(0,0,0,0.05)', marginTop: 40 }}>
            {[['∞', 'Unlimited Invoices'], ['100%', 'Offline First'], ['₹0', 'Forever Free'], ['MIT', 'Licensed']].map(([val, label]) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 2 }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: '#004de6' }}>{val}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mock app screenshot / preview */}
        <div style={{ position: 'relative', zIndex: 10, maxWidth: 960, margin: '0 auto 80px', padding: '0 24px' }}>
          <div style={{
            borderRadius: 16, overflow: 'hidden',
            boxShadow: '0 32px 80px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06)',
            background: '#fff',
          }}>
            {/* Fake browser chrome */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '12px 16px', background: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ width: 12, height: 12, borderRadius: 99, background: '#ff5f57' }}></div>
              <div style={{ width: 12, height: 12, borderRadius: 99, background: '#febc2e' }}></div>
              <div style={{ width: 12, height: 12, borderRadius: 99, background: '#28c840' }}></div>
              <div style={{ flex: 1, margin: '0 12px', background: '#fff', borderRadius: 4, padding: '4px 12px', fontSize: 12, color: '#9ca3af', border: '1px solid #e5e7eb' }}>billium.app</div>
            </div>
            {/* Dashboard preview content */}
            <div style={{ display: 'flex', height: 380, background: '#f8fafc' }}>
              {/* Sidebar */}
              <div style={{ width: 200, background: '#001a4d', padding: 16, display: 'flex', flexDirection: 'column' as const, gap: 4 }}>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Billium</div>
                {['📄 Invoices', '💬 Quotes', '👥 Clients', '📦 Items', '📊 Reports', '⚙️ Settings'].map((item, i) => (
                  <div key={item} style={{ padding: '8px 10px', borderRadius: 6, fontSize: 13, color: i === 0 ? '#fff' : '#a5b4fc', background: i === 0 ? 'rgba(255,255,255,0.15)' : 'transparent', cursor: 'pointer' }}>{item}</div>
                ))}
              </div>
              {/* Main content */}
              <div style={{ flex: 1, padding: 24, overflowY: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a2e' }}>Invoices</div>
                  <div style={{ padding: '8px 16px', borderRadius: 6, background: '#004de6', color: '#fff', fontSize: 13, fontWeight: 600 }}>+ New Invoice</div>
                </div>
                {/* KPI cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
                  {[['Total Revenue', '₹2,45,000', '#22c55e'], ['Outstanding', '₹48,500', '#f59e0b'], ['Invoices', '47', '#004de6']].map(([label, val, color]) => (
                    <div key={label} style={{ background: '#fff', borderRadius: 10, padding: '14px 16px', border: '1px solid #f0f0f5' }}>
                      <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>{label}</div>
                      <div style={{ fontSize: 22, fontWeight: 700, color }}>{val}</div>
                    </div>
                  ))}
                </div>
                {/* Fake table */}
                <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #f0f0f5', overflow: 'hidden' }}>
                  {[
                    ['INV-001', 'Acme Corp', '₹12,500', 'Paid'],
                    ['INV-002', 'TechStart Ltd', '₹8,250', 'Pending'],
                    ['INV-003', 'Global Media', '₹25,000', 'Paid'],
                  ].map(([num, client, amount, status]) => (
                    <div key={num} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr', padding: '10px 14px', borderBottom: '1px solid #f9f9fb', fontSize: 13, alignItems: 'center' }}>
                      <span style={{ color: '#004de6', fontWeight: 600 }}>{num}</span>
                      <span style={{ color: '#374151' }}>{client}</span>
                      <span style={{ fontWeight: 600, color: '#1a1a2e' }}>{amount}</span>
                      <span style={{ padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: status === 'Paid' ? '#dcfce7' : '#fef9c3', color: status === 'Paid' ? '#16a34a' : '#a16207', display: 'inline-block' }}>{status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ background: '#fff', padding: '100px 24px', position: 'relative', zIndex: 10, borderTop: '1px solid #f0f0f5' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#004de6', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Features</div>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.5px', marginBottom: 16 }}>
              Everything your business needs.
            </h2>
            <p style={{ fontSize: 18, color: '#6b7280', maxWidth: 520, margin: '0 auto' }}>
              From first invoice to paid - without the monthly subscription.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28 }}>
            {[
              { icon: '🧾', title: 'Professional Invoices', desc: 'Beautiful PDF invoices with your branding. Custom colors, fonts, templates - all offline.' },
              { icon: '💬', title: 'Quotes & Estimates', desc: 'Send professional quotations. Convert approved quotes to invoices with one click.' },
              { icon: '📊', title: 'Business Reports', desc: 'Revenue charts, invoice status breakdown, and outstanding balance - all at a glance.' },
              { icon: '🏦', title: 'Bank Details & UPI QR', desc: 'Add bank info and UPI QR codes on invoices. Get paid 3x faster.' },
              { icon: '🌍', title: 'Multi-Currency & GST', desc: 'Full support for GST, VAT, multi-currency invoicing. Works for any market.' },
              { icon: '🔒', title: 'Offline & Private', desc: 'Your data never leaves your machine. No account, no cloud, no privacy concerns.' },
            ].map(f => (
              <div key={f.title} style={{
                padding: '28px', borderRadius: 14,
                border: '1.5px solid #f0f0f5',
                background: '#fafafa',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = '#004de6'; el.style.boxShadow = '0 8px 32px rgba(0,77,230,0.12)'; el.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = '#f0f0f5'; el.style.boxShadow = 'none'; el.style.transform = 'translateY(0)'; }}
              >
                <div style={{ fontSize: 40, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: '100px 24px', position: 'relative', zIndex: 10, background: '#fafafa', borderTop: '1px solid #f0f0f5' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#004de6', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Pricing</div>
          <h2 style={{ fontSize: 40, fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.5px', marginBottom: 16 }}>
            Why pay for invoicing software?
          </h2>
          <p style={{ fontSize: 18, color: '#6b7280', marginBottom: 52 }}>Billium is free, and always will be. No tricks, no upgrades, no credit card.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 720, margin: '0 auto' }}>
            {/* Free card */}
            <div style={{ background: '#fff', borderRadius: 16, padding: '40px 32px', border: '2px solid #004de6', position: 'relative', boxShadow: '0 12px 40px rgba(0,77,230,0.15)' }}>
              <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#004de6', color: '#fff', fontSize: 12, fontWeight: 700, padding: '4px 16px', borderRadius: 99 }}>Recommended</div>
              <div style={{ fontSize: 14, color: '#004de6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Billium</div>
              <div style={{ fontSize: 48, fontWeight: 800, color: '#1a1a2e', marginBottom: 4 }}>₹0</div>
              <div style={{ color: '#9ca3af', marginBottom: 28, fontSize: 14 }}>forever, no limits</div>
              {['Unlimited Invoices', 'Unlimited Clients', 'PDF Export', 'Offline Access', 'GST / VAT Support', 'Open Source (MIT)', 'No Account Required', 'UPI QR Code'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, fontSize: 15, color: '#374151' }}>
                  <span style={{ color: '#22c55e', fontWeight: 700 }}>✓</span> {f}
                </div>
              ))}
              <button style={{ ...styles.btnHero, width: '100%', marginTop: 24, borderRadius: 8 }} onClick={goToApp}>Get Started Free</button>
            </div>

            {/* SaaS card */}
            <div style={{ background: '#fff', borderRadius: 16, padding: '40px 32px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: 14, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                {"\"Premium\" SaaS 😅"}
              </div>
              <div style={{ fontSize: 48, fontWeight: 800, color: '#1a1a2e', marginBottom: 4 }}>₹499<span style={{ fontSize: 18 }}>/mo</span></div>
              <div style={{ color: '#9ca3af', marginBottom: 28, fontSize: 14 }}>after free trial ends</div>
              {['Limited Invoices', '5 Clients on Free', 'PDF (paywalled)', 'Cloud Only', 'Partial GST Support', 'Closed Source', 'Mandatory Account', 'No UPI QR'].map((f, i) => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, fontSize: 15, color: '#9ca3af', textDecoration: i < 2 ? 'line-through' : undefined }}>
                  <span style={{ color: '#ef4444', fontWeight: 700 }}>✗</span> {f}
                </div>
              ))}
              <button style={{ width: '100%', marginTop: 24, padding: '14px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#f9fafb', color: '#9ca3af', fontSize: 15, fontWeight: 600, cursor: 'not-allowed' }} disabled>Pay More, Get Less</button>
            </div>
          </div>
        </div>
      </section>

      {/* CONTRIBUTE */}
      <section id="contribute" style={{ background: '#fff', padding: '100px 24px', position: 'relative', zIndex: 10, borderTop: '1px solid #f0f0f5' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#004de6', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Open Source</div>
          <h2 style={{ fontSize: 40, fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.5px', marginBottom: 16 }}>
            Built by the community, for everyone.
          </h2>
          <p style={{ fontSize: 18, color: '#6b7280', marginBottom: 40, lineHeight: 1.6 }}>
            Billium is proudly open source and entirely community-driven. Whether you're a developer, designer, or just want to suggest a feature, your contributions are welcome!
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, textAlign: 'left', marginBottom: 40 }}>
            <div style={{ padding: 24, border: '1px solid #e5e7eb', borderRadius: 12, background: '#fafafa' }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>🐛</div>
              <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>Report Bugs & Features</div>
              <div style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.5 }}>Found a bug or have a great idea? Open an issue on our GitHub repository to help us improve.</div>
            </div>
            <div style={{ padding: 24, border: '1px solid #e5e7eb', borderRadius: 12, background: '#fafafa' }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>💻</div>
              <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>Submit Code</div>
              <div style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.5 }}>Fork the repo, create a branch, and submit a PR! We review and merge community contributions regularly.</div>
            </div>
          </div>

          {contributors.length > 0 && (
            <div style={{ marginBottom: 40 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#4b5563', marginBottom: 16 }}>Meet our amazing contributors</div>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, justifyContent: 'center', gap: 12 }}>
                {contributors.slice(0, 15).map(c => (
                  <a key={c.login} href={c.html_url} target="_blank" rel="noreferrer" title={`@${c.login} (${c.contributions} contributions)`}
                    style={{
                      display: 'block', width: 44, height: 44, borderRadius: 99,
                      overflow: 'hidden', border: '2px solid #fff',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15) translateY(-4px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1) translateY(0)'}
                  >
                    <img src={c.avatar_url} alt={c.login} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </a>
                ))}
              </div>
            </div>
          )}

          <a href="https://github.com/satyakiabhijit/Billium" target="_blank" rel="noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', gap: 12, padding: '16px 32px',
            background: '#1a1a2e', color: '#fff', borderRadius: 8, fontSize: 16, fontWeight: 600,
            textDecoration: 'none', transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 8px 24px rgba(26,26,46,0.3)'
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 30px rgba(26,26,46,0.4)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(26,26,46,0.3)'; }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
            Contribute on GitHub
          </a>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #004de6, #001a4d)', padding: '80px 24px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <h2 style={{ fontSize: 42, fontWeight: 800, color: '#fff', marginBottom: 16, letterSpacing: '-0.5px' }}>
          Start invoicing today.
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 18, marginBottom: 36 }}>
          No account. No credit card. No nonsense.
        </p>
        <button style={{ padding: '16px 44px', borderRadius: 8, border: '2px solid rgba(255,255,255,0.4)', background: '#fff', color: '#004de6', fontSize: 17, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
          onClick={goToApp}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.color = '#004de6'; }}
        >
          Open Billium →
        </button>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#fff', padding: '32px 48px', borderTop: '1px solid #f0f0f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: 16, position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/billium logo.png" alt="Billium Logo" style={{ height: 26, width: 'auto' }} />
          <span style={{ fontWeight: 700, color: '#1a1a2e' }}>Billium</span>
          <span style={{ color: '#d1d5db', marginLeft: 8 }}>·</span>
          <span style={{ color: '#9ca3af', fontSize: 13 }}>Open Source Invoicing</span>
        </div>
        <div style={{ fontSize: 13, color: '#9ca3af' }}>
          MIT License · Made with ❤️ · <a href="https://github.com/satyakiabhijit/Billium" style={{ color: '#004de6', textDecoration: 'none', fontWeight: 600 }}>GitHub</a>
        </div>
      </footer>
    </div>
  );
};
