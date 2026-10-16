import { useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import {
  AlertCircle,
  BarChart3,
  Calendar,
  Check,
  Eye,
  FileText,
  Globe2,
  Loader2,
  Lock,
  LogOut,
  RefreshCw,
  Settings,
  Upload,
  Users,
  X,
} from 'lucide-react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const API_URL = `${SUPABASE_URL}/functions/v1/community-api`;
const TOKEN_KEY = 'dashboard_admin_token';
const VISITOR_KEY = 'dashboard_visitor_id';
const SESSION_KEY = 'dashboard_visit_counted';
const MAX_CV_SIZE = 10 * 1024 * 1024;

export type CvInfo = { url: string; fileName: string; updatedAt: string; size: number };

type Stats = {
  total: number;
  unique: number;
  today: number;
  last7: number;
  last30: number;
  unique30: number;
  daily: { date: string; visits: number }[];
  referrers: { source: string; visits: number }[];
  countries: { country: string; visits: number }[];
  recent: { at: string; referrer: string; country: string; device: string }[];
};

async function callApi<T>(payload: Record<string, unknown>): Promise<T> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    body: JSON.stringify(payload),
  });
  let data: T & { ok?: boolean; error?: string };
  try { data = await res.json(); } catch { throw new Error('Invalid response from server'); }
  if (!data.ok) throw Object.assign(new Error(data.error || 'Request failed'), { status: res.status });
  return data;
}

function storageGet(store: Storage, key: string): string | null {
  try { return store.getItem(key); } catch { return null; }
}

function storageSet(store: Storage, key: string, value: string | null) {
  try {
    if (value === null) store.removeItem(key);
    else store.setItem(key, value);
  } catch { /* storage unavailable */ }
}

/** Records one visit per browser session (skipped for the signed-in owner) and returns the current CV, if one was uploaded. */
export async function trackVisit(): Promise<CvInfo | null> {
  if (!SUPABASE_URL) return null;
  let visitorId = storageGet(localStorage, VISITOR_KEY);
  if (!visitorId) {
    visitorId = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    storageSet(localStorage, VISITOR_KEY, visitorId);
  }
  const isOwner = Boolean(storageGet(localStorage, TOKEN_KEY));
  const count = !isOwner && !storageGet(sessionStorage, SESSION_KEY);
  let referrer = '';
  try {
    if (document.referrer) {
      const host = new URL(document.referrer).hostname.replace(/^www\./, '');
      if (host !== window.location.hostname.replace(/^www\./, '')) referrer = host;
    }
  } catch { /* ignore malformed referrer */ }
  const utm = new URLSearchParams(window.location.search).get('utm_source');
  if (utm) referrer = utm;
  let region = '';
  try { region = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch { /* ignore */ }

  if (count) storageSet(sessionStorage, SESSION_KEY, '1');
  try {
    const data = await callApi<{ cv: CvInfo | null }>({ action: 'visit', visitorId, referrer, region, count });
    return data.cv;
  } catch {
    return null;
  }
}

export function SettingsButton({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick} className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#cbd9cb] bg-white/70 text-[#55706b] transition hover:border-[#c8942e] hover:text-[#163d3a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8942e]" aria-label="Owner settings" title="Settings"><Settings className="h-5 w-5" /></button>;
}

export default function AdminPanel({ onClose, onCvUpdated }: { onClose: () => void; onCvUpdated: (cv: CvInfo) => void }) {
  const [token, setToken] = useState<string | null>(() => storageGet(localStorage, TOKEN_KEY));

  const signOut = useCallback(() => {
    storageSet(localStorage, TOKEN_KEY, null);
    setToken(null);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#0f2929]/80 p-4 backdrop-blur-sm" onClick={onClose}>
    <div className={`flex max-h-[92vh] w-full flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ${token ? 'max-w-5xl' : 'max-w-md'}`} onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between border-b border-[#dfe6de] bg-[#f7f8f5] px-5 py-3">
        <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#163d3a] text-[#e0b64f]"><Settings className="h-4 w-4" /></div><div><p className="text-sm font-extrabold text-[#163d3a]">Dashboard Settings</p><p className="text-[10px] font-bold uppercase tracking-wider text-[#71837b]">Owner access</p></div></div>
        <div className="flex items-center gap-1">
          {token && <button onClick={signOut} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#55706b] transition hover:bg-slate-100 hover:text-[#163d3a]"><LogOut className="h-4 w-4" /> Sign out</button>}
          <button onClick={onClose} className="rounded-lg p-2.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600" aria-label="Close settings"><X className="h-5 w-5" /></button>
        </div>
      </div>
      <div className="overflow-y-auto">
        {token
          ? <AdminDashboard token={token} onExpired={signOut} onCvUpdated={onCvUpdated} />
          : <LoginForm onLogin={(t) => { storageSet(localStorage, TOKEN_KEY, t); setToken(t); }} />}
      </div>
    </div>
  </div>;
}

function LoginForm({ onLogin }: { onLogin: (token: string) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await callApi<{ token: string }>({ action: 'admin-login', username, password });
      onLogin(data.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setBusy(false);
    }
  };

  const inputClass = 'mt-1.5 w-full rounded-xl border border-[#dfe6de] bg-white px-4 py-3 text-sm text-[#163d3a] outline-none transition focus:border-[#c8942e] focus:ring-2 focus:ring-[#c8942e]/30';
  return <form onSubmit={submit} className="space-y-4 p-6">
    <div className="flex items-center gap-2 text-sm text-[#55706b]"><Lock className="h-4 w-4 text-[#c8942e]" /> Sign in to view visitor stats and manage your CV.</div>
    <label className="block text-xs font-bold uppercase tracking-wider text-[#2e6d5d]">Username<input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" autoFocus required className={inputClass} /></label>
    <label className="block text-xs font-bold uppercase tracking-wider text-[#2e6d5d]">Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required className={inputClass} /></label>
    {error && <p className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700"><AlertCircle className="h-4 w-4 shrink-0" /> {error}</p>}
    <button type="submit" disabled={busy} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#163d3a] px-4 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#1f524d] disabled:opacity-60">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />} Sign in</button>
  </form>;
}

function AdminDashboard({ token, onExpired, onCvUpdated }: { token: string; onExpired: () => void; onCvUpdated: (cv: CvInfo) => void }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [cv, setCv] = useState<CvInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await callApi<{ stats: Stats; cv: CvInfo | null }>({ action: 'admin-stats', token });
      setStats(data.stats);
      setCv(data.cv);
    } catch (err) {
      if ((err as { status?: number }).status === 401) onExpired();
      else setError(err instanceof Error ? err.message : 'Could not load stats');
    } finally {
      setLoading(false);
    }
  }, [token, onExpired]);

  useEffect(() => { load(); }, [load]);

  return <div className="space-y-6 p-5 sm:p-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-[#c8942e]" /><h2 className="text-lg font-extrabold text-[#163d3a]">Profile visit status</h2></div>
      <button onClick={load} disabled={loading} className="inline-flex items-center gap-1.5 rounded-lg border border-[#dfe6de] px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#55706b] transition hover:border-[#c8942e] hover:text-[#163d3a] disabled:opacity-60"><RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh</button>
    </div>

    {error && <p className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700"><AlertCircle className="h-4 w-4 shrink-0" /> {error}</p>}
    {loading && !stats && <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-[#c8942e]" /></div>}

    {stats && <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile icon={Eye} label="Total visits" value={stats.total} />
        <StatTile icon={Users} label="Unique visitors" value={stats.unique} />
        <StatTile icon={Calendar} label="Today" value={stats.today} hint="Dubai time" />
        <StatTile icon={BarChart3} label="Last 30 days" value={stats.last30} hint={`${stats.unique30} unique · ${stats.last7} in 7 days`} />
      </div>
      <DailyChart daily={stats.daily} />
      <div className="grid gap-4 md:grid-cols-2">
        <BarList title="Top sources" icon={Globe2} rows={stats.referrers.map((r) => ({ label: r.source, value: r.visits }))} />
        <BarList title="Top locations" icon={Globe2} rows={stats.countries.map((c) => ({ label: c.country, value: c.visits }))} />
      </div>
      <RecentVisits recent={stats.recent} />
    </>}

    <CvManager token={token} cv={cv} onExpired={onExpired} onUploaded={(next) => { setCv(next); onCvUpdated(next); }} />
  </div>;
}

function StatTile({ icon: Icon, label, value, hint }: { icon: typeof Eye; label: string; value: number; hint?: string }) {
  return <div className="rounded-2xl border border-[#dfe6de] bg-[#f7f8f5] p-4">
    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#55706b]"><Icon className="h-3.5 w-3.5 text-[#c8942e]" /> {label}</div>
    <p className="mt-2 text-3xl font-extrabold tabular-nums text-[#163d3a]">{value.toLocaleString()}</p>
    {hint && <p className="mt-1 text-[11px] text-[#71837b]">{hint}</p>}
  </div>;
}

function DailyChart({ daily }: { daily: Stats['daily'] }) {
  const max = Math.max(1, ...daily.map((d) => d.visits));
  const fmt = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
  return <div className="rounded-2xl border border-[#dfe6de] p-4">
    <div className="flex items-baseline justify-between"><p className="text-sm font-bold text-[#163d3a]">Daily visits</p><p className="text-[11px] text-[#71837b]">Last 30 days</p></div>
    <div className="mt-4 flex h-36 items-end gap-[3px]">
      {daily.map((d) => <div key={d.date} className="group relative flex h-full flex-1 items-end">
        <div className="w-full rounded-t-[3px] bg-[#2e6d5d] transition group-hover:bg-[#c8942e]" style={{ height: `${Math.max(d.visits ? 4 : 1, (d.visits / max) * 100)}%`, opacity: d.visits ? 1 : 0.25 }} />
        <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#163d3a] px-2 py-1 text-[10px] font-bold text-white opacity-0 transition group-hover:opacity-100">{fmt(d.date)}: {d.visits}</div>
      </div>)}
    </div>
    {daily.length > 0 && <div className="mt-2 flex justify-between text-[10px] text-[#71837b]"><span>{fmt(daily[0].date)}</span><span>{fmt(daily[daily.length - 1].date)}</span></div>}
  </div>;
}

function BarList({ title, icon: Icon, rows }: { title: string; icon: typeof Eye; rows: { label: string; value: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return <div className="rounded-2xl border border-[#dfe6de] p-4">
    <p className="flex items-center gap-2 text-sm font-bold text-[#163d3a]"><Icon className="h-4 w-4 text-[#c8942e]" /> {title}</p>
    {rows.length === 0 ? <p className="mt-3 text-sm text-[#71837b]">No visits yet.</p> : <ul className="mt-3 space-y-2">
      {rows.map((r) => <li key={r.label} className="relative overflow-hidden rounded-lg">
        <div className="absolute inset-y-0 left-0 bg-[#eaf1e8]" style={{ width: `${(r.value / max) * 100}%` }} />
        <div className="relative flex items-center justify-between px-3 py-1.5 text-sm"><span className="truncate text-[#163d3a]">{r.label}</span><span className="ml-3 font-bold tabular-nums text-[#163d3a]">{r.value}</span></div>
      </li>)}
    </ul>}
  </div>;
}

function RecentVisits({ recent }: { recent: Stats['recent'] }) {
  return <div className="rounded-2xl border border-[#dfe6de] p-4">
    <p className="text-sm font-bold text-[#163d3a]">Recent visits</p>
    {recent.length === 0 ? <p className="mt-3 text-sm text-[#71837b]">No visits yet.</p> : <div className="mt-3 overflow-x-auto">
      <table className="w-full min-w-[420px] text-left text-sm">
        <thead><tr className="text-[10px] uppercase tracking-wider text-[#71837b]"><th className="pb-2 font-bold">When</th><th className="pb-2 font-bold">Source</th><th className="pb-2 font-bold">Location</th><th className="pb-2 font-bold">Device</th></tr></thead>
        <tbody>{recent.map((v, i) => <tr key={i} className="border-t border-[#eef2ed] text-[#163d3a]"><td className="py-1.5 pr-3 tabular-nums">{new Date(v.at).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</td><td className="py-1.5 pr-3">{v.referrer}</td><td className="py-1.5 pr-3">{v.country}</td><td className="py-1.5">{v.device}</td></tr>)}</tbody>
      </table>
    </div>}
  </div>;
}

function CvManager({ token, cv, onExpired, onUploaded }: { token: string; cv: CvInfo | null; onExpired: () => void; onUploaded: (cv: CvInfo) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  const pick = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.files?.[0] ?? null;
    setMessage(null);
    if (!next) return setFile(null);
    if (!(next.type === 'application/pdf' || next.name.toLowerCase().endsWith('.pdf'))) {
      setFile(null);
      return setMessage({ kind: 'error', text: 'Please choose a PDF file.' });
    }
    if (next.size > MAX_CV_SIZE) {
      setFile(null);
      return setMessage({ kind: 'error', text: 'File is larger than 10 MB.' });
    }
    setFile(next);
  };

  const upload = async () => {
    if (!file) return;
    setBusy(true);
    setMessage(null);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '');
        reader.onerror = () => reject(new Error('Could not read the file'));
        reader.readAsDataURL(file);
      });
      const data = await callApi<{ cv: CvInfo }>({ action: 'admin-upload-cv', token, cv: { name: file.name, mime: file.type || 'application/pdf', base64 } });
      onUploaded(data.cv);
      setFile(null);
      if (fileRef.current) fileRef.current.value = '';
      setMessage({ kind: 'ok', text: 'CV updated. Visitors now see the new version.' });
    } catch (err) {
      if ((err as { status?: number }).status === 401) onExpired();
      else setMessage({ kind: 'error', text: err instanceof Error ? err.message : 'Upload failed' });
    } finally {
      setBusy(false);
    }
  };

  return <div className="rounded-2xl border border-[#c8942e]/40 bg-[#fffaf0] p-4 sm:p-5">
    <div className="flex items-center gap-2"><FileText className="h-5 w-5 text-[#c8942e]" /><h2 className="text-lg font-extrabold text-[#163d3a]">Current CV</h2></div>
    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#dfe6de] bg-white px-4 py-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-[#163d3a]">{cv ? cv.fileName : 'Abhijith_K_Jayan_AFAM.pdf (built-in)'}</p>
        <p className="text-[11px] text-[#71837b]">{cv ? `Updated ${new Date(cv.updatedAt).toLocaleString()} · ${(cv.size / 1024).toFixed(0)} KB` : 'No CV uploaded yet. The site uses the file bundled with the build.'}</p>
      </div>
      <a href={cv?.url ?? '/Abhijith_K_Jayan_AFAM.pdf'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-[#dfe6de] px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#55706b] transition hover:border-[#c8942e] hover:text-[#163d3a]"><Eye className="h-3.5 w-3.5" /> View</a>
    </div>
    <div className="mt-3 flex flex-wrap items-center gap-3">
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[#c8942e] bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#163d3a] transition hover:bg-[#fff7e2]">
        <FileText className="h-4 w-4 text-[#c8942e]" /> {file ? file.name : 'Choose new PDF'}
        <input ref={fileRef} type="file" accept=".pdf,application/pdf" onChange={pick} className="sr-only" />
      </label>
      <button onClick={upload} disabled={!file || busy} className="inline-flex items-center gap-2 rounded-xl bg-[#c8942e] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#163d3a] transition hover:bg-[#e0b64f] disabled:cursor-not-allowed disabled:opacity-50">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Replace CV</button>
    </div>
    {message && <p className={`mt-3 flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${message.kind === 'ok' ? 'bg-[#eaf1e8] text-[#2e6d5d]' : 'bg-red-50 text-red-700'}`}>{message.kind === 'ok' ? <Check className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />} {message.text}</p>}
  </div>;
}
