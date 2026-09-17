import { type FC, useState } from 'react';
import { useAppDispatch } from '../state/configureStore';
import { setDbReady, enableLoading, disableLoading, addToast } from '../state/pageSlice';
import { getApi, isWebMode } from '../shared/api/restApi';
import logoUrl from '../assets/logo.png';

// ─── Styles ───────────────────────────────────────────────────────────────────
const S: Record<string, React.CSSProperties> = {
  root: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #0a0f2e 0%, #001a4d 50%, #003080 100%)',
    fontFamily: "'Inter', -apple-system, sans-serif", padding: 24,
  },
  card: {
    width: '100%', maxWidth: 640, background: '#fff',
    borderRadius: 20, boxShadow: '0 40px 80px rgba(0,0,0,0.35)',
    overflow: 'hidden',
  },
  header: {
    background: 'linear-gradient(135deg, #001a4d, #004de6)',
    padding: '32px 40px', textAlign: 'center',
  },
  logoWrap: { display: 'flex', justifyContent: 'center', marginBottom: 12 },
  logoImg: { height: 52, width: 'auto' },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: '-0.5px' },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 6 },
  body: { padding: '36px 40px' },
  label: { fontSize: 13, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 14, display: 'block' },
  modeGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  modeCard: {
    border: '2px solid #e5e7eb', borderRadius: 14, padding: '24px 20px',
    textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', background: '#fafafa',
  },
  modeCardActive: {
    border: '2px solid #004de6', background: '#eff6ff',
    boxShadow: '0 4px 20px rgba(0,77,230,0.15)',
  },
  modeIcon: { fontSize: 36, marginBottom: 10, display: 'block' },
  modeTitle: { fontWeight: 700, fontSize: 16, color: '#1a1a2e', marginBottom: 4 },
  modeDesc: { fontSize: 13, color: '#6b7280', lineHeight: 1.5 },
  providerGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24, marginTop: 16 },
  providerCard: {
    border: '2px solid #e5e7eb', borderRadius: 12, padding: '18px 16px',
    textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', background: '#fafafa',
  },
  providerCardActive: { border: '2px solid #004de6', background: '#eff6ff' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: 700, color: '#374151', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 },
  videoPlaceholder: {
    background: '#f3f4f6', borderRadius: 10, border: '2px dashed #d1d5db',
    height: 120, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center',
    color: '#9ca3af', fontSize: 13, gap: 6, marginBottom: 16,
  },
  codeBlock: {
    background: '#0f172a', borderRadius: 10, padding: '16px',
    fontSize: 11, lineHeight: 1.6, color: '#94a3b8',
    fontFamily: "'Courier New', monospace", overflow: 'auto',
    maxHeight: 200, marginBottom: 16,
  },
  copyBtn: {
    fontSize: 12, padding: '4px 10px', borderRadius: 6, border: '1px solid #004de6',
    background: 'transparent', color: '#004de6', cursor: 'pointer', float: 'right' as const,
  },
  input: {
    width: '100%', padding: '10px 14px', borderRadius: 8,
    border: '1.5px solid #e5e7eb', fontSize: 14, outline: 'none',
    transition: 'border-color 0.2s', boxSizing: 'border-box' as const,
  },
  inputGroup: { marginBottom: 14 },
  inputLabel: { fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block' },
  btnPrimary: {
    width: '100%', padding: '13px', borderRadius: 10, border: 'none',
    background: 'linear-gradient(135deg, #004de6, #001a4d)',
    color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(0,77,230,0.3)', transition: 'all 0.2s',
  },
  btnOutline: {
    width: '100%', padding: '13px', borderRadius: 10,
    border: '1.5px solid #e5e7eb', background: '#fff',
    color: '#374151', fontSize: 15, fontWeight: 600, cursor: 'pointer',
    transition: 'all 0.2s', marginBottom: 12,
  },
  btnSecondary: {
    width: '100%', padding: '13px', borderRadius: 10,
    border: '1.5px solid #004de6', background: '#fff',
    color: '#004de6', fontSize: 15, fontWeight: 700, cursor: 'pointer',
    transition: 'all 0.2s',
  },
  alert: (type: 'error' | 'success') => ({
    padding: '12px 16px', borderRadius: 10, marginBottom: 16, fontSize: 13,
    background: type === 'error' ? '#fef2f2' : '#f0fdf4',
    border: `1px solid ${type === 'error' ? '#fecaca' : '#bbf7d0'}`,
    color: type === 'error' ? '#dc2626' : '#16a34a',
  }),
  testResult: {
    marginBottom: 16, padding: '12px 16px', borderRadius: 10, fontSize: 13,
    fontWeight: 600,
  },
  divider: { display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0', color: '#9ca3af', fontSize: 13 },
  dividerLine: { flex: 1, height: 1, background: '#e5e7eb' },
  backBtn: {
    background: 'none', border: 'none', color: '#6b7280', fontSize: 13,
    cursor: 'pointer', padding: '4px 0', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 4,
  },
};

type Mode = 'offline' | 'online';
type Provider = 'neon' | 'supabase';
type TestStatus = 'idle' | 'testing' | 'success' | 'fail';
type OnlineStep = 'choose-provider' | 'setup';

interface DatabaseChooserProps {
  onBackToLanding?: () => void;
}

export const DatabaseChooser: FC<DatabaseChooserProps> = ({ onBackToLanding }) => {
  const dispatch = useAppDispatch();
  const [mode, setMode] = useState<Mode | null>(null);
  const [onlineStep, setOnlineStep] = useState<OnlineStep>('choose-provider');
  const [provider, setProvider] = useState<Provider | null>(null);
  const [dbUrl, setDbUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [dbName, setDbName] = useState('billium.db');
  const [testStatus, setTestStatus] = useState<TestStatus>('idle');
  const [testError, setTestError] = useState('');
  const [sqlCopied, setSqlCopied] = useState(false);
  const [showUrl, setShowUrl] = useState(false);

  const api = getApi();

  // ─── Offline handlers ─────────────────────────────────────────────────────
  const handleCreateSqlite = async () => {
    dispatch(enableLoading());
    setError(null);
    try {
      if (isWebMode()) {
        const result = await api.createSqliteDb(dbName);
        if (result?.success) {
          localStorage.setItem('billium_db', JSON.stringify({ type: 'sqlite', name: dbName }));
          dispatch(setDbReady(true));
        } else setError(result?.error || 'Failed to create database');
      } else {
        const result = await api.createSqliteDb();
        if (result?.success && (result as any).path) {
          localStorage.setItem('billium_db', JSON.stringify({ type: 'sqlite', path: (result as any).path }));
          dispatch(setDbReady(true));
        } else setError(result?.error || 'Cancelled');
      }
    } catch (err) { setError(String(err)); }
    finally { dispatch(disableLoading()); }
  };

  const handleOpenSqlite = async () => {
    dispatch(enableLoading());
    setError(null);
    try {
      if (isWebMode()) {
        const result = await api.openSqliteDb(dbName);
        if (result?.success) {
          localStorage.setItem('billium_db', JSON.stringify({ type: 'sqlite', name: dbName }));
          dispatch(setDbReady(true));
        } else setError(result?.error || 'Failed to open database');
      } else {
        const result = await api.openSqliteDb();
        if (result?.success && (result as any).path) {
          localStorage.setItem('billium_db', JSON.stringify({ type: 'sqlite', path: (result as any).path }));
          dispatch(setDbReady(true));
        } else setError(result?.error || 'Cancelled');
      }
    } catch (err) { setError(String(err)); }
    finally { dispatch(disableLoading()); }
  };

  // Robust parser that handles @ signs inside passwords (e.g. 'Satyaki@29AS')
  // Standard URL() breaks when password contains @ — we split on the LAST @ instead
  const parseDbUrl = (url: string) => {
    try {
      const stripped = url.replace(/^postgres(ql)?:\/\//, '');
      // Last @ separates credentials from host
      const lastAt = stripped.lastIndexOf('@');
      if (lastAt === -1) return null;

      const credsPart = stripped.slice(0, lastAt);
      const hostPart = stripped.slice(lastAt + 1);

      // Split creds into user:password
      const colonIdx = credsPart.indexOf(':');
      const user = colonIdx === -1 ? credsPart : credsPart.slice(0, colonIdx);
      const password = colonIdx === -1 ? '' : credsPart.slice(colonIdx + 1);

      // Parse host:port/database?params
      const [hostPortDb] = hostPart.split('?');
      const slashIdx = hostPortDb.indexOf('/');
      const hostPort = slashIdx === -1 ? hostPortDb : hostPortDb.slice(0, slashIdx);
      const database = slashIdx === -1 ? 'postgres' : hostPortDb.slice(slashIdx + 1);

      const portIdx = hostPort.lastIndexOf(':');
      const host = portIdx === -1 ? hostPort : hostPort.slice(0, portIdx);
      const port = portIdx === -1 ? 5432 : parseInt(hostPort.slice(portIdx + 1)) || 5432;

      if (!host) return null;

      return { host, port, user, password, database: database || 'postgres', ssl: true };
    } catch {
      return null;
    }
  };

  const handleTestConnection = async () => {
    setTestStatus('testing');
    setTestError('');
    const config = parseDbUrl(dbUrl);
    if (!config) {
      setTestStatus('fail');
      setTestError('Invalid connection URL. Please check the format.');
      return;
    }
    try {
      const result = await api.testPostgresConnection(config);
      if (result?.success) {
        setTestStatus('success');
      } else {
        setTestStatus('fail');
        setTestError(result?.error || 'Connection failed. Check your credentials and try again.');
      }
    } catch (err) {
      setTestStatus('fail');
      setTestError(String(err));
    }
  };

  const handleConnectOnline = async () => {
    if (testStatus !== 'success') {
      await handleTestConnection();
      return;
    }
    const config = parseDbUrl(dbUrl);
    if (!config) return;
    dispatch(enableLoading());
    setError(null);
    try {
      const result = await api.openPostgresDb(config);
      if (result?.success) {
        localStorage.setItem('billium_db', JSON.stringify({ type: 'postgres', config }));
        dispatch(setDbReady(true));
        dispatch(addToast({ message: 'Connected successfully!', type: 'success' }));
      } else {
        setError(result?.error || 'Failed to connect');
      }
    } catch (err) { setError(String(err)); }
    finally { dispatch(disableLoading()); }
  };

  // ─── Render helpers ───────────────────────────────────────────────────────
  const renderModePicker = () => (
    <>
      {onBackToLanding && (
        <button 
          onClick={onBackToLanding}
          style={{ 
            background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', 
            padding: 0, marginBottom: 20, fontWeight: 600, fontSize: 13,
            display: 'flex', alignItems: 'center', gap: 4
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#004de6'}
          onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Landing
        </button>
      )}
      <span style={S.label}>How do you want to store your data?</span>
      <div style={S.modeGrid}>
        {([
          { key: 'offline', icon: '💻', title: 'Offline / Local', desc: 'Store data on your device. Works without internet. Perfect for most users.' },
          { key: 'online', icon: '☁️', title: 'Online / Cloud', desc: 'Connect to a cloud PostgreSQL database. Sync across devices.' },
        ] as const).map(m => (
          <div key={m.key}
            style={{ ...S.modeCard, ...(mode === m.key ? S.modeCardActive : {}) }}
            onClick={() => { setMode(m.key); setError(null); }}
            onMouseEnter={e => { if (mode !== m.key) (e.currentTarget as HTMLElement).style.borderColor = '#93c5fd'; }}
            onMouseLeave={e => { if (mode !== m.key) (e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb'; }}
          >
            <span style={S.modeIcon}>{m.icon}</span>
            <div style={S.modeTitle}>{m.title}</div>
            <div style={S.modeDesc}>{m.desc}</div>
          </div>
        ))}
      </div>
    </>
  );

  const renderOfflineForm = () => (
    <>
      <div style={S.section}>
        <div style={S.sectionTitle}>💻 Local SQLite Database</div>
        {error && <div style={S.alert('error')}>{error}</div>}
        {isWebMode() && (
          <div style={S.inputGroup}>
            <label style={S.inputLabel}>Database File Name</label>
            <input style={S.input} value={dbName} onChange={e => setDbName(e.target.value)} placeholder="billium.db" />
          </div>
        )}
        <button style={S.btnPrimary} onClick={handleCreateSqlite}
          onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          ✨ Create New Database
        </button>
        <div style={S.divider}><span style={S.dividerLine}></span>or<span style={S.dividerLine}></span></div>
        <button style={S.btnSecondary} onClick={handleOpenSqlite}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#eff6ff'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; }}
        >
          📂 Open Existing Database
        </button>
      </div>
    </>
  );

  const renderProviderPicker = () => (
    <>
      <span style={S.label}>Choose your cloud PostgreSQL provider</span>
      <div style={S.providerGrid}>
        {/* NEON */}
        <div
          style={{ ...S.providerCard, ...(provider === 'neon' ? S.providerCardActive : {}), position: 'relative' }}
          onClick={() => setProvider('neon')}
          onMouseEnter={e => { if (provider !== 'neon') (e.currentTarget as HTMLElement).style.borderColor = '#93c5fd'; }}
          onMouseLeave={e => { if (provider !== 'neon') (e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb'; }}
        >
          {/* Recommended badge */}
          <div style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', background: '#004de6', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 12px', borderRadius: 99, whiteSpace: 'nowrap' as const }}>
            ⭐ Recommended
          </div>
          <div style={{ marginBottom: 10, marginTop: 8 }}>
            {/* Official Neon Logo - from neon.com brand page */}
            <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="6" fill="#000" />
              <path fill="#37C38F" d="M3.8 3.009V25l9.569-8.46V20.3H24.2V3z" />
              <path fill="#000" d="M6.809 21.74h8.964V10.84l9.568 8.46V3.01L6.808 3z" />
            </svg>
          </div>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e' }}>Neon</div>
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Serverless Postgres</div>
          <div style={{ fontSize: 11, color: '#00b37e', fontWeight: 600, marginTop: 6 }}>Free · Never pauses</div>
        </div>

        {/* SUPABASE */}
        <div
          style={{ ...S.providerCard, ...(provider === 'supabase' ? S.providerCardActive : {}) }}
          onClick={() => setProvider('supabase')}
          onMouseEnter={e => { if (provider !== 'supabase') (e.currentTarget as HTMLElement).style.borderColor = '#93c5fd'; }}
          onMouseLeave={e => { if (provider !== 'supabase') (e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb'; }}
        >
          <div style={{ marginBottom: 10 }}>
            {/* Supabase Official SVG Logo */}
            <svg width="48" height="48" viewBox="0 0 109 113" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" fill="url(#paint0_linear)" />
              <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" fill="url(#paint1_linear)" fillOpacity="0.2" />
              <path d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z" fill="#3ECF8E" />
              <defs>
                <linearGradient id="paint0_linear" x1="53.9738" y1="54.974" x2="94.1635" y2="71.8295" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#249361" />
                  <stop offset="1" stopColor="#3ECF8E" />
                </linearGradient>
                <linearGradient id="paint1_linear" x1="36.1558" y1="30.578" x2="54.4844" y2="65.0806" gradientUnits="userSpaceOnUse">
                  <stop />
                  <stop offset="1" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e' }}>Supabase</div>
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Open Source Backend</div>
          <div style={{ fontSize: 11, color: '#f59e0b', fontWeight: 600, marginTop: 6 }}>Free · Pauses after 1 week</div>
        </div>
      </div>
      {provider && (
        <button style={S.btnPrimary} onClick={() => setOnlineStep('setup')}
          onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          Continue with {provider === 'neon' ? 'Neon' : 'Supabase'} →
        </button>
      )}
    </>
  );

  const renderOnlineSetup = () => {
    const isNeon = provider === 'neon';
    const providerName = isNeon ? 'Neon' : 'Supabase';
    const signupUrl = isNeon ? 'https://neon.tech' : 'https://supabase.com';

    return (
      <>
        {/* Step 1: Video */}
        <div style={S.section}>
          <div style={S.sectionTitle}>
            <span>{isNeon ? '⚡' : '🟢'}</span> Step 1 - Set up {providerName}
          </div>
          <div style={S.videoPlaceholder}>
            <span style={{ fontSize: 32 }}>▶️</span>
            <span>Setup video for {providerName} coming soon</span>
            <a href={signupUrl} target="_blank" rel="noreferrer"
              style={{ color: '#004de6', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
              Open {providerName} →
            </a>
          </div>
        </div>

        {/* Step 2: Connection URL */}
        <div style={S.section}>
          <div style={S.sectionTitle}>🔑 Step 2 - Paste your connection URL</div>
          {isNeon ? (
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>
              ✅ <strong>Find your connection URL in Neon:</strong><br /><br />
              Click the <strong style={{ color: '#00e599' }}>Connect</strong> button at the top left → Ensure <strong>Connection pooling</strong> is ON → Change dropdown to <strong>Node.js</strong> → Click the <strong>Connection String</strong> tab → Copy the <code>Copy Snippet</code>
            </div>
          ) : (
            <div style={{ marginBottom: 12 }}>
              <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#92400e', marginBottom: 8 }}>
                ⚠️ <strong>Do NOT use the Direct Connection URL</strong> (the one starting with <code>db.xxx.supabase.co</code>). Supabase free tier restricts direct connections to IPv6 only, which causes DNS failures.
              </div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>
                ✅ Use the <strong>Pooler URL</strong> instead:<br /><br />
                Click the <strong style={{ color: '#3ecf8e' }}>⊕ Connect</strong> button at the top of your Supabase project → scroll to <strong>Connection Pooling</strong> → choose <strong>Transaction</strong> mode → copy the URI
              </div>
            </div>
          )}
          <div style={S.inputGroup}>
            <label style={S.inputLabel}>PostgreSQL Connection URL</label>
            <div style={{ position: 'relative' }}>
              <input
                style={{ ...S.input, fontFamily: 'monospace', fontSize: 12, paddingRight: 44 }}
                value={dbUrl}
                onChange={e => { setDbUrl(e.target.value); setTestStatus('idle'); setTestError(''); }}
                placeholder={isNeon
                  ? 'postgresql://user:password@ep-xxx-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'
                  : 'postgresql://postgres.xxxx:password@aws-0-ap-south-1.pooler.supabase.com:6543/postgres'}
                type={showUrl ? 'text' : 'password'}
                onFocus={e => (e.currentTarget.style.borderColor = '#004de6')}
                onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
              />
              <button
                type="button"
                onClick={() => setShowUrl(v => !v)}
                style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                  color: '#9ca3af', lineHeight: 1, display: 'flex', alignItems: 'center',
                }}
                title={showUrl ? 'Hide URL' : 'Show URL'}
              >
                {showUrl ? (
                  // Eye-off icon
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  // Eye icon
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Test result */}
          {testStatus === 'success' && (
            <div style={{ ...S.testResult, background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a' }}>
              ✅ Connection successful! You can now proceed.
            </div>
          )}
          {testStatus === 'fail' && (
            <div style={{ ...S.testResult, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
              ❌ {testError}
            </div>
          )}

          {error && <div style={S.alert('error')}>{error}</div>}

          {testStatus !== 'success' ? (
            <button
              style={{ ...S.btnPrimary, opacity: !dbUrl || testStatus === 'testing' ? 0.6 : 1 }}
              disabled={!dbUrl || testStatus === 'testing'}
              onClick={handleTestConnection}
            >
              {testStatus === 'testing' ? '⏳ Testing connection...' : '🔌 Test Connection'}
            </button>
          ) : (
            <button style={S.btnPrimary} onClick={handleConnectOnline}>
              🚀 Connect & Launch Billium
            </button>
          )}
        </div>
      </>
    );
  };

  const renderContent = () => {
    if (!mode) return renderModePicker();

    const handleBack = () => {
      setError(null);
      setTestStatus('idle');
      setTestError('');
      
      if (mode === 'online' && onlineStep !== 'choose-provider') {
        setOnlineStep('choose-provider');
      } else {
        setMode(null);
      }
    };

    return (
      <>
        <button 
          onClick={handleBack}
          style={{ 
            background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', 
            padding: 0, marginBottom: 20, fontWeight: 600, fontSize: 13,
            display: 'flex', alignItems: 'center', gap: 4
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#004de6'}
          onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </button>
        {mode === 'offline' && renderOfflineForm()}
        {mode === 'online' && onlineStep === 'choose-provider' && renderProviderPicker()}
        {mode === 'online' && onlineStep !== 'choose-provider' && renderOnlineSetup()}
      </>
    );
  };

  return (
    <div style={S.root}>
      <div style={S.card}>
        {/* Header */}
        <div style={S.header}>
          <div style={S.logoWrap}>
          <img src={logoUrl} alt="Billium Logo" style={S.logoImg} />
        </div>
          <h1 style={S.headerTitle}>Welcome to Billium</h1>
          <p style={S.headerSub}>
            {!mode ? 'Choose how you want to store your data' :
              mode === 'offline' ? 'Local SQLite — your data stays on this device' :
                onlineStep === 'choose-provider' ? 'Select your cloud database provider' :
                  `Connect to ${provider === 'neon' ? 'Neon' : 'Supabase'} PostgreSQL`}
          </p>
        </div>

        {/* Body */}
        <div style={S.body}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
