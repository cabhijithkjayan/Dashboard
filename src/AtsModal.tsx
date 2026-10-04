import { useState, useCallback, useRef, type DragEvent, type ChangeEvent } from 'react';
import {
  Upload,
  FileText,
  X,
  Check,
  AlertCircle,
  Loader2,
  Users,
  Shield,
  RotateCcw,
  Target,
  Briefcase,
  TrendingUp,
} from 'lucide-react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const API_URL = `${SUPABASE_URL}/functions/v1/community-api`;
const TELEGRAM_LINK = import.meta.env.VITE_TELEGRAM_LINK || 'https://t.me/+3YgVLwcYQZ01NzQ0';
const MAX_FILE_SIZE = 5 * 1024 * 1024;

type Phase = 'idle' | 'uploading' | 'checking' | 'results' | 'error';

type AtsResult = {
  ats: {
    score: number;
    band: string;
    readable: number;
    sections: number;
    keywords: number;
    experience: number;
    format: number;
    strengths: string[];
    notes: string[];
  };
  roles: { title: string; fit: number; why: string }[];
  match: null | {
    score: number;
    band: string;
    skills: number;
    experience: number;
    relevance: number;
    qualifications: number;
    keywords: number;
    missing: string[];
    notes: string[];
  };
};

const ATS_BREAKDOWN = [
  { key: 'readable', label: 'Readable text', max: 20 },
  { key: 'sections', label: 'Standard sections', max: 20 },
  { key: 'keywords', label: 'Keywords & skills', max: 25 },
  { key: 'experience', label: 'Experience detail', max: 20 },
  { key: 'format', label: 'Length & format', max: 15 },
];

const MATCH_BREAKDOWN = [
  { key: 'skills', label: 'Required skills', max: 40 },
  { key: 'experience', label: 'Experience & seniority', max: 25 },
  { key: 'relevance', label: 'Role relevance', max: 15 },
  { key: 'qualifications', label: 'Qualifications', max: 10 },
  { key: 'keywords', label: 'Job keywords', max: 10 },
];

function bandColor(band: string): string {
  if (band === 'Strong') return 'text-[#2e6d5d] bg-[#eaf1e8]';
  if (band === 'Fair') return 'text-[#8a651a] bg-[#fff7e2]';
  return 'text-[#b03820] bg-[#fef0ec]';
}

function scoreColor(band: string): string {
  if (band === 'Strong') return 'text-[#2e6d5d]';
  if (band === 'Fair') return 'text-[#c8942e]';
  return 'text-[#b03820]';
}

function barColor(band: string): string {
  if (band === 'Strong') return 'bg-[#2e6d5d]';
  if (band === 'Fair') return 'bg-[#c8942e]';
  return 'bg-[#b03820]';
}

export default function AtsModal({ onClose, onJoinCommunity }: { onClose: () => void; onJoinCommunity?: () => void }) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [fileName, setFileName] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [result, setResult] = useState<AtsResult | null>(null);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const extractText = async (file: File): Promise<string> => {
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isDocx = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.toLowerCase().endsWith('.docx');
    if (!isPdf && !isDocx) throw new Error('Only PDF and DOCX files are accepted.');

    if (isPdf) {
      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: { str?: string }) => item.str || '').join(' ') + '\n';
      }
      return text;
    }
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const res = await mammoth.extractRawText({ arrayBuffer });
    return res.value;
  };

  const handleFile = useCallback(async (file: File) => {
    if (file.size > MAX_FILE_SIZE) { setError('File too large. Maximum 5 MB.'); return; }
    setError('');
    setFileName(file.name);
    setPhase('uploading');
    try {
      const text = await extractText(file);
      if (!text.trim()) { setError('Could not read text from this file. If it is a scanned PDF, try a text-based PDF or DOCX.'); setPhase('idle'); return; }
      setCvText(text);
      setUploadedFile(file);
      setPhase('idle');
    } catch (e) {
      setUploadedFile(null);
      setPhase('idle');
      setError(e instanceof Error ? e.message : 'Could not read this file.');
    }
  }, []);

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const runCheck = async () => {
    if (!cvText.trim()) { setError('Please upload your CV first.'); return; }
    setPhase('checking');
    setError('');
    try {
      const job = [jobTitle.trim(), jobDesc.trim()].filter(Boolean).join('\n\n');
      const cv = uploadedFile ? await new Promise<{ name: string; mime: string; base64: string }>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const content = String(reader.result || '');
          resolve({
            name: uploadedFile.name,
            mime: uploadedFile.type || 'application/octet-stream',
            base64: content.includes(',') ? content.split(',')[1] : content,
          });
        };
        reader.onerror = () => reject(new Error('File read failed'));
        reader.readAsDataURL(uploadedFile);
      }) : null;
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ action: 'ats', text: cvText, job, cv }),
      });
      const responseText = await res.text();
      let data;
      try { data = JSON.parse(responseText); }
      catch { console.error('ATS response not JSON:', responseText.substring(0, 500)); throw new Error('Invalid response from server'); }
      if (!data.ok) throw new Error(data.error || 'Check failed');
      setResult(data.result);
      setPhase('results');
    } catch (err) {
      console.error('ATS check error:', err);
      setPhase('error');
      const msg = err instanceof Error ? err.message : 'Something went wrong, please try again';
      setError(msg.includes('Gemini') || msg.includes('fetch') ? 'The AI service is busy, please try again in a moment.' : msg);
    }
  };

  const reset = () => {
    setPhase('idle');
    setResult(null);
    setError('');
    setJobTitle('');
    setJobDesc('');
  };

  const clearJob = () => {
    setJobTitle('');
    setJobDesc('');
    setResult(null);
    setPhase('idle');
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-[#0f2929]/80 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="my-8 w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#dfe6de] bg-[#f7f8f5] px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#163d3a] text-[#e0b64f]">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#163d3a]">Free ATS CV Checker</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#71837b]">Check your CV in seconds</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto px-5 py-6 sm:px-7 sm:py-8">
          {/* IDLE / ERROR — Upload + Job input */}
          {(phase === 'idle' || phase === 'error') && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-[#163d3a] sm:text-3xl">Check your CV</h2>
                <p className="mt-2 text-sm leading-6 text-[#607871]">
                  Upload your CV to get an ATS score, best-fit job roles, and an optional job-match score.
                  No sign-up needed.
                </p>
              </div>

              <div
                onDrop={onDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                className={`rounded-2xl border-2 border-dashed p-8 text-center transition ${dragOver ? 'border-[#c8942e] bg-[#fff7e2]' : 'border-[#dfe6de] bg-[#f8faf7]'} ${cvText ? 'border-solid border-[#2e6d5d] bg-[#eaf1e8]' : ''}`}
              >
                {cvText ? (
                  <div className="flex items-center justify-center gap-3">
                    <Check className="h-6 w-6 text-[#2e6d5d]" />
                    <div className="text-left">
                      <p className="text-sm font-bold text-[#163d3a]">{fileName}</p>
                      <p className="text-xs text-[#2e6d5d]">CV loaded — ready to check</p>
                    </div>
                    <button onClick={() => { setCvText(''); setFileName(''); setUploadedFile(null); }} className="ml-2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-10 w-10 text-[#c8942e]" />
                    <p className="mt-4 text-sm font-bold text-[#163d3a]">Drag &amp; drop your CV here</p>
                    <p className="mt-1 text-xs text-[#71837b]">PDF or DOCX, max 5 MB</p>
                    <button onClick={() => fileRef.current?.click()} className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#163d3a] px-4 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#2e6d5d]">
                      <FileText className="h-4 w-4" /> Choose file
                    </button>
                    <input ref={fileRef} type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={onFileInput} className="hidden" />
                  </>
                )}
              </div>

              {error && (
                <div className="rounded-xl border border-[#e8927a] bg-[#fef0ec] px-4 py-3">
                  <div className="flex items-start gap-2 text-xs text-[#b03820]">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
                  </div>
                  <button onClick={runCheck} disabled={!cvText.trim()} className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#b03820] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white transition hover:bg-[#8a2a18] disabled:opacity-50">
                    <RotateCcw className="h-3 w-3" /> Retry
                  </button>
                </div>
              )}

              {/* Optional job fields */}
              <div className="space-y-4 rounded-2xl border border-[#dfe6de] bg-white p-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#2e6d5d]">Optional: Target job</p>
                  <p className="mt-1 text-xs text-[#71837b]">Add a job title or description to get a job-match score too.</p>
                </div>
                <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Finance Manager" className="field" />
                <textarea value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} rows={3} placeholder="Paste the job description here (optional)" className="field resize-none" />
              </div>

              <button onClick={runCheck} disabled={!cvText.trim()} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#163d3a] px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#2e6d5d] disabled:opacity-50">
                <Target className="h-4 w-4 text-[#e0b64f]" /> Check my CV
              </button>

              <div className="flex items-start gap-2 rounded-xl bg-[#eaf1e8] px-4 py-3 text-xs text-[#2e6d5d]">
                <Shield className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Your CV and ATS results are saved to Drive and logged in the ATS sheet.</span>
              </div>
            </div>
          )}

          {/* UPLOADING */}
          {phase === 'uploading' && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-[#c8942e]" />
              <p className="mt-5 text-sm font-bold text-[#163d3a]">Reading your CV...</p>
              <p className="mt-1 text-xs text-[#71837b]">{fileName}</p>
            </div>
          )}

          {/* CHECKING */}
          {phase === 'checking' && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-[#c8942e]" />
              <p className="mt-5 text-sm font-bold text-[#163d3a]">Checking your CV...</p>
              <p className="mt-1 text-xs text-[#71837b]">This takes about 10-15 seconds</p>
            </div>
          )}

          {/* RESULTS */}
          {phase === 'results' && result && (
            <div className="space-y-6">
              {/* ATS Score Card */}
              <div className="rounded-2xl border border-[#dfe6de] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-[#c8942e]" />
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#163d3a]">ATS Score</h3>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${bandColor(result.ats.band)}`}>{result.ats.band}</span>
                </div>
                <div className="mt-4 flex items-end gap-2">
                  <span className={`text-5xl font-extrabold tracking-tight ${scoreColor(result.ats.band)}`}>{result.ats.score}</span>
                  <span className="mb-1.5 text-lg font-bold text-[#71837b]">/ 100</span>
                </div>
                {/* Breakdown bars */}
                <div className="mt-5 space-y-3">
                  {ATS_BREAKDOWN.map(({ key, label, max }) => {
                    const val = result.ats[key as keyof typeof result.ats] as number;
                    return (
                      <div key={key}>
                        <div className="mb-1 flex justify-between text-xs font-bold text-[#607871]">
                          <span>{label}</span>
                          <span className="text-[#71837b]">{val}/{max}</span>
                        </div>
                        <div className="h-2 rounded-full bg-[#f0f0f0]">
                          <div className={`h-full rounded-full ${barColor(result.ats.band)}`} style={{ width: `${(val / max) * 100}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Strengths */}
                {result.ats.strengths?.length > 0 && (
                  <div className="mt-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#2e6d5d]">What's working</p>
                    <ul className="mt-2 space-y-1.5">
                      {result.ats.strengths.map((s, i) => (
                        <li key={i} className="flex gap-2 text-xs leading-5 text-[#607871]">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2e6d5d]" /> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Notes */}
                {result.ats.notes?.length > 0 && (
                  <div className="mt-5 rounded-xl bg-[#fff7e2] p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#8a651a]">Why you lost points</p>
                    <ul className="mt-2 space-y-2">
                      {result.ats.notes.map((n, i) => (
                        <li key={i} className="flex gap-2 text-xs leading-5 text-[#8a651a]">
                          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {n}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Best-fit roles */}
              {result.roles?.length > 0 && (
                <div className="rounded-2xl border border-[#dfe6de] bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-[#c8942e]" />
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#163d3a]">Best-fit roles</h3>
                  </div>
                  <div className="mt-4 space-y-4">
                    {result.roles.map((role, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-[#163d3a]">{role.title}</p>
                          <span className={`text-sm font-extrabold ${scoreColor(role.fit >= 80 ? 'Strong' : role.fit >= 60 ? 'Fair' : 'Low')}`}>{role.fit}%</span>
                        </div>
                        <div className="mt-1.5 h-2 rounded-full bg-[#f0f0f0]">
                          <div className={`h-full rounded-full ${barColor(role.fit >= 80 ? 'Strong' : role.fit >= 60 ? 'Fair' : 'Low')}`} style={{ width: `${role.fit}%` }} />
                        </div>
                        <p className="mt-1.5 text-xs leading-5 text-[#607871]">{role.why}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Job match */}
              {result.match && (
                <div className="rounded-2xl border border-[#dfe6de] bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-[#c8942e]" />
                      <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#163d3a]">Job-match score</h3>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${bandColor(result.match.band)}`}>{result.match.band}</span>
                  </div>
                  <div className="mt-4 flex items-end gap-2">
                    <span className={`text-5xl font-extrabold tracking-tight ${scoreColor(result.match.band)}`}>{result.match.score}</span>
                    <span className="mb-1.5 text-lg font-bold text-[#71837b]">/ 100</span>
                  </div>
                  <div className="mt-5 space-y-3">
                    {MATCH_BREAKDOWN.map(({ key, label, max }) => {
                      const val = result.match![key as keyof typeof result.match] as number;
                      return (
                        <div key={key}>
                          <div className="mb-1 flex justify-between text-xs font-bold text-[#607871]">
                            <span>{label}</span>
                            <span className="text-[#71837b]">{val}/{max}</span>
                          </div>
                          <div className="h-2 rounded-full bg-[#f0f0f0]">
                            <div className={`h-full rounded-full ${barColor(result.match!.band)}`} style={{ width: `${(val / max) * 100}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Missing keywords */}
                  {result.match.missing?.length > 0 && (
                    <div className="mt-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#b03820]">Missing keywords</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {result.match.missing.map((kw, i) => (
                          <span key={i} className="rounded-lg bg-[#fef0ec] px-2.5 py-1 text-xs font-semibold text-[#b03820]">{kw}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Notes */}
                  {result.match.notes?.length > 0 && (
                    <div className="mt-5 rounded-xl bg-[#fff7e2] p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#8a651a]">How to improve</p>
                      <ul className="mt-2 space-y-2">
                        {result.match.notes.map((n, i) => (
                          <li key={i} className="flex gap-2 text-xs leading-5 text-[#8a651a]">
                            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {n}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <button onClick={clearJob} className="flex items-center justify-center gap-2 rounded-xl border border-[#dfe6de] bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#607871] transition hover:bg-[#f8faf7]">
                  <RotateCcw className="h-4 w-4" /> Check another job
                </button>
                {onJoinCommunity && <button onClick={onJoinCommunity} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#c8942e] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#163d3a] transition hover:bg-[#e0b64f]">
                  <Users className="h-4 w-4" /> Join Abhi's Reference Community
                </button>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
