import { useState, useRef, useCallback, type FormEvent, type DragEvent, type ChangeEvent } from 'react';
import {
  Upload,
  FileText,
  X,
  Check,
  Send,
  AlertCircle,
  Loader2,
  Sparkles,
  Users,
  Shield,
  Mail,
  Plus,
  RotateCcw,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const API_URL = `${SUPABASE_URL}/functions/v1/community-api`;
const TELEGRAM_LINK = import.meta.env.VITE_TELEGRAM_LINK || 'https://t.me/+3YgVLwcYQZ01NzQ0';
const REMOVE_DATA_EMAIL = 'cabhijithkjayan@gmail.com';
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const INDUSTRIES = [
  'Accounting & Finance', 'IT & Software', 'Banking & Financial Services', 'Healthcare & Pharma',
  'Manufacturing', 'Retail & E-commerce', 'Education & Training', 'Consulting & Advisory',
  'Construction & Real Estate', 'Logistics & Supply Chain', 'Oil & Gas / Energy', 'Telecommunications',
  'Media & Entertainment', 'Hospitality & Tourism', 'Automotive', 'Aerospace & Defense',
  'Legal Services', 'Marketing & Advertising', 'FMCG', 'Agriculture & Commodities',
  'Government & Public Sector', 'Non-profit & NGO', 'Textiles & Garments', 'Import & Export / Trading',
  'Other',
];

const NOTICE_PERIODS = ['Immediately', '15 days', '30 days', '60 days', '90 days', 'Not currently employed'];

const HEARD_OPTIONS = ['LinkedIn', 'Telegram channel', 'Friend or colleague', 'Instagram', 'Google search', 'Other'];

const CURRENCIES = ['INR', 'AED', 'USD', 'EUR', 'GBP', 'SAR', 'QAR', 'OMR', 'KWD', 'BHD', 'SGD', 'AUD', 'CAD'];

type FormState = {
  fullName: string; email: string; phone: string; city: string; linkedin: string;
  jobTitle: string; company: string; experienceYears: string; industry: string;
  skills: string[]; qualification: string; certifications: string[];
  openTo: string; preferred: string; notice: string; salaryCurrency: string;
  salaryAmount: string; source: string; consent: boolean;
};

type CvFieldKey = keyof Pick<FormState, 'fullName' | 'email' | 'phone' | 'city' | 'linkedin' | 'jobTitle' | 'company' | 'experienceYears' | 'industry' | 'skills' | 'qualification' | 'certifications'>;

const EMPTY_FORM: FormState = {
  fullName: '', email: '', phone: '', city: '', linkedin: '',
  jobTitle: '', company: '', experienceYears: '', industry: '',
  skills: [], qualification: '', certifications: [],
  openTo: '', preferred: '', notice: '', salaryCurrency: 'INR',
  salaryAmount: '', source: '', consent: false,
};

const FIELD_LABELS: Record<string, string> = {
  fullName: 'Full name', email: 'Email', phone: 'Phone', city: 'City, country',
  linkedin: 'LinkedIn URL', jobTitle: 'Current job title', company: 'Current company',
  experienceYears: 'Total experience (years)', industry: 'Industry',
  skills: 'Key skills', qualification: 'Highest qualification',
  certifications: 'Certifications',
};

const CV_FIELD_KEYS: CvFieldKey[] = ['fullName', 'email', 'phone', 'city', 'linkedin', 'jobTitle', 'company', 'experienceYears', 'industry', 'skills', 'qualification', 'certifications'];

type Phase = 'idle' | 'parsing' | 'form' | 'submitting' | 'success' | 'error';

export default function CommunityModal({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [cvFields, setCvFields] = useState<Set<string>>(new Set());
  const [skillInput, setSkillInput] = useState('');
  const [certInput, setCertInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [parseError, setParseError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [sheetWarning, setSheetWarning] = useState('');
  const [fileName, setFileName] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const firstErrorRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const update = (key: keyof FormState, value: string | string[] | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => { if (prev[key]) { const next = { ...prev }; delete next[key]; return next; } return prev; });
  };

  const handleFile = useCallback(async (file: File) => {
    if (file.size > MAX_FILE_SIZE) { setParseError('File too large. Maximum 5 MB.'); return; }
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isDocx = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.toLowerCase().endsWith('.docx');
    if (!isPdf && !isDocx) { setParseError('Only PDF and DOCX files are accepted.'); return; }

    setParseError('');
    setFileName(file.name);
    setUploadedFile(file);
    setPhase('parsing');

    try {
      let text = '';
      if (isPdf) {
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item: { str?: string }) => item.str || '').join(' ') + '\n';
        }
      } else {
        const mammoth = await import('mammoth');
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      }

      if (!text.trim()) {
        setPhase('form');
        setParseError('Could not read text from this file. Please fill the form manually.');
        return;
      }

      setCvText(text);

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ action: 'parse', text }),
      });
      const responseText = await res.text();
      let data;
      try { data = JSON.parse(responseText); }
      catch { console.error('Parse response not JSON:', responseText.substring(0, 500)); throw new Error('Invalid response from server'); }
      if (!data.ok) throw new Error(data.error || 'Parse failed');

      const fields = data.fields || {};
      const filled = new Set<string>();
      const next: FormState = { ...EMPTY_FORM };
      const fieldMap: Record<string, keyof FormState> = {
        fullName: 'fullName', email: 'email', phone: 'phone', city: 'city',
        linkedin: 'linkedin', jobTitle: 'jobTitle', company: 'company',
        experienceYears: 'experienceYears', industry: 'industry',
        qualification: 'qualification',
      };
      Object.entries(fieldMap).forEach(([cvKey, formKey]) => {
        const val = fields[cvKey];
        if (val && typeof val === 'string' && val.trim()) { (next as Record<string, unknown>)[formKey] = val.trim(); filled.add(formKey); }
      });
      if (fields.experienceYears != null) { next.experienceYears = String(fields.experienceYears); filled.add('experienceYears'); }
      if (Array.isArray(fields.skills)) { next.skills = fields.skills.filter((s: unknown): s is string => typeof s === 'string' && s.trim()).slice(0, 15); if (next.skills.length) filled.add('skills'); }
      if (Array.isArray(fields.certifications)) { next.certifications = fields.certifications.filter((s: unknown): s is string => typeof s === 'string' && s.trim()); if (next.certifications.length) filled.add('certifications'); }
      if (fields.industry && typeof fields.industry === 'string') {
        const match = INDUSTRIES.find((ind) => ind.toLowerCase() === fields.industry.toLowerCase());
        if (match) { next.industry = match; filled.add('industry'); }
        else { next.industry = 'Other'; filled.add('industry'); }
      }

      setForm(next);
      setCvFields(filled);
      setPhase('form');
    } catch (err) {
      console.error('CV parse error:', err);
      setPhase('form');
      setParseError('Could not parse the CV automatically. Please fill the form manually.');
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

  const addSkill = () => {
    const val = skillInput.trim();
    if (!val || form.skills.length >= 15) return;
    if (form.skills.some((s) => s.toLowerCase() === val.toLowerCase())) { setSkillInput(''); return; }
    update('skills', [...form.skills, val]);
    setSkillInput('');
  };

  const removeSkill = (skill: string) => update('skills', form.skills.filter((s) => s !== skill));

  const addCert = () => {
    const val = certInput.trim();
    if (!val) return;
    if (form.certifications.some((s) => s.toLowerCase() === val.toLowerCase())) { setCertInput(''); return; }
    update('certifications', [...form.certifications, val]);
    setCertInput('');
  };

  const removeCert = (cert: string) => update('certifications', form.certifications.filter((s) => s !== cert));

  const validate = (): boolean => {
    const err: Record<string, string> = {};
    if (!form.fullName.trim()) err.fullName = 'Full name is required';
    if (!form.email.trim()) err.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = 'Enter a valid email';
    if (!form.phone.trim()) err.phone = 'Phone is required';
    if (!form.city.trim()) err.city = 'City and country are required';
    if (!form.jobTitle.trim()) err.jobTitle = 'Job title is required';
    if (!form.experienceYears.trim()) err.experienceYears = 'Experience is required';
    else if (isNaN(Number(form.experienceYears)) || Number(form.experienceYears) < 0) err.experienceYears = 'Enter a valid number';
    if (!form.industry) err.industry = 'Industry is required';
    if (form.skills.length === 0) err.skills = 'Add at least one skill';
    if (!form.qualification.trim()) err.qualification = 'Qualification is required';
    if (!form.openTo) err.openTo = 'Please select an option';
    if (!form.consent) err.consent = 'You must agree to continue';
    setErrors(err);
    if (Object.keys(err).length > 0) {
      setTimeout(() => firstErrorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
      return false;
    }
    return true;
  };

  const doSubmit = async () => {
    if (honeypot) return;
    if (!validate()) return;
    setPhase('submitting');
    setSubmitError('');
    setSheetWarning('');

    try {
      const data = {
        fullName: form.fullName, email: form.email, phone: form.phone, city: form.city,
        linkedin: form.linkedin, jobTitle: form.jobTitle, company: form.company,
        experienceYears: form.experienceYears, industry: form.industry, skills: form.skills,
        qualification: form.qualification, certifications: form.certifications,
        openTo: form.openTo, preferred: form.preferred, notice: form.notice,
        expectedSalary: form.salaryAmount ? `${form.salaryCurrency} ${form.salaryAmount}` : '',
        source: form.source, consent: form.consent,
      };

      let cv: { name: string; mime: string; base64: string } | null = null;
      if (uploadedFile) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            const base64Data = result.includes(',') ? result.split(',')[1] : result;
            resolve(base64Data);
          };
          reader.onerror = () => reject(new Error('File read failed'));
          reader.readAsDataURL(uploadedFile);
        });
        cv = { name: uploadedFile.name, mime: uploadedFile.type, base64 };
      }

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ action: 'submit', data, cv }),
      });
      const responseText = await res.text();
      let result;
      try { result = JSON.parse(responseText); }
      catch { console.error('Submit response not JSON:', responseText.substring(0, 500)); throw new Error('Invalid response from server'); }
      if (!result.ok) throw new Error(result.error || 'Submit failed');
      if (result.sheetSynced === false) {
        setSheetWarning('Your submission is saved in the app, but could not be copied to Google Sheets or Drive. Please contact the site owner; do not submit again.');
      }
      setPhase('success');
    } catch (err) {
      console.error('Submit error:', err);
      setPhase('form');
      const msg = err instanceof Error ? err.message : 'Something went wrong, please try again';
      setSubmitError(msg.includes('Gemini') || msg.includes('fetch') ? 'The AI service is busy, please try again in a moment.' : msg);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    doSubmit();
  };

  const reset = () => {
    setPhase('idle'); setForm(EMPTY_FORM); setCvFields(new Set());
    setErrors({}); setParseError(''); setSubmitError(''); setSheetWarning(''); setFileName('');
    setUploadedFile(null); setCvText('');
    setSkillInput(''); setCertInput('');
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-[#0f2929]/80 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="my-8 w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#dfe6de] bg-[#f7f8f5] px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#163d3a] text-[#e0b64f]">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#163d3a]">Abhi's Reference Community</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#71837b]">Join the member pool</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto px-5 py-6 sm:px-7 sm:py-8">
          {/* IDLE — Upload screen */}
          {phase === 'idle' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-[#163d3a] sm:text-3xl">Join the community</h2>
                <p className="mt-2 text-sm leading-6 text-[#607871]">
                  Upload your CV to auto-fill the form in seconds, or fill it manually. It takes under 3 minutes.
                  Your details help Abhi connect you with relevant job referrals and references.
                </p>
              </div>

              <div
                onDrop={onDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                className={`rounded-2xl border-2 border-dashed p-8 text-center transition ${dragOver ? 'border-[#c8942e] bg-[#fff7e2]' : 'border-[#dfe6de] bg-[#f8faf7]'}`}
              >
                <Upload className="mx-auto h-10 w-10 text-[#c8942e]" />
                <p className="mt-4 text-sm font-bold text-[#163d3a]">Drag &amp; drop your CV here</p>
                <p className="mt-1 text-xs text-[#71837b]">PDF or DOCX, max 5 MB</p>
                <button onClick={() => fileRef.current?.click()} className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#163d3a] px-4 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#2e6d5d]">
                  <FileText className="h-4 w-4" /> Choose file
                </button>
                <input ref={fileRef} type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={onFileInput} className="hidden" />
              </div>

              {parseError && (
                <div className="flex items-start gap-2 rounded-xl border border-[#e8c27a] bg-[#fff7e2] px-4 py-3 text-xs text-[#8a651a]">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {parseError}
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-[#dfe6de]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#71837b]">or</span>
                <div className="h-px flex-1 bg-[#dfe6de]" />
              </div>

              <button onClick={() => setPhase('form')} className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#c8942e]/50 bg-white px-4 py-3.5 text-sm font-bold text-[#163d3a] transition hover:border-[#c8942e] hover:bg-[#fff7e2]">
                <Plus className="h-4 w-4 text-[#c8942e]" /> Fill the form manually
              </button>

              <div className="flex items-start gap-2 rounded-xl bg-[#eaf1e8] px-4 py-3 text-xs text-[#2e6d5d]">
                <Shield className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Your details are stored privately and used only to contact you about references and opportunities. To update or remove your data, email {REMOVE_DATA_EMAIL}.</span>
              </div>
            </div>
          )}

          {/* PARSING */}
          {phase === 'parsing' && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-[#c8942e]" />
              <p className="mt-5 text-sm font-bold text-[#163d3a]">Reading your CV...</p>
              <p className="mt-1 text-xs text-[#71837b]">{fileName}</p>
            </div>
          )}

          {/* FORM / SUBMITTING / ERROR */}
          {(phase === 'form' || phase === 'submitting' || phase === 'error') && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {parseError && (
                <div className="flex items-start gap-2 rounded-xl border border-[#e8c27a] bg-[#fff7e2] px-4 py-3 text-xs text-[#8a651a]">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {parseError}
                </div>
              )}
              {submitError && (
                <div className="rounded-xl border border-[#e8927a] bg-[#fef0ec] px-4 py-3" ref={firstErrorRef}>
                  <div className="flex items-start gap-2 text-xs text-[#b03820]">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {submitError}
                  </div>
                  <button type="button" onClick={doSubmit} className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#b03820] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white transition hover:bg-[#8a2a18]">
                    <RotateCcw className="h-3 w-3" /> Retry
                  </button>
                </div>
              )}

              {fileName && (
                <div className="flex items-center gap-2 rounded-xl bg-[#eaf1e8] px-4 py-2.5 text-xs text-[#2e6d5d]">
                  <FileText className="h-4 w-4 shrink-0" /> {fileName}
                </div>
              )}

              {/* Honeypot */}
              <input type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="absolute -left-[9999px] h-0 w-0 opacity-0" tabIndex={-1} autoComplete="off" aria-hidden="true" />

              <FormGrid form={form} errors={errors} cvFields={cvFields} update={update}
                skillInput={skillInput} setSkillInput={setSkillInput} addSkill={addSkill} removeSkill={removeSkill}
                certInput={certInput} setCertInput={setCertInput} addCert={addCert} removeCert={removeCert}
                errorRef={firstErrorRef} />

              {/* Consent */}
              <div className="rounded-2xl border border-[#dfe6de] bg-[#f8faf7] p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.consent} onChange={(e) => update('consent', e.target.checked)} className="mt-1 h-4 w-4 shrink-0 rounded border-[#c8942e] text-[#c8942e] focus:ring-[#c8942e]" />
                  <span className="text-xs leading-5 text-[#607871]">
                    I agree my details are stored to contact me for references and opportunities.
                    To remove your data at any time, email {REMOVE_DATA_EMAIL}.
                  </span>
                </label>
                {errors.consent && <p className="mt-2 text-xs font-bold text-[#b03820]">{errors.consent}</p>}
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={reset} className="rounded-xl border border-[#dfe6de] bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#607871] transition hover:bg-[#f8faf7]">
                  Back
                </button>
                <button type="submit" disabled={phase === 'submitting'} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#163d3a] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#2e6d5d] disabled:opacity-60">
                  {phase === 'submitting' ? (<><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>) : (<><Send className="h-4 w-4 text-[#e0b64f]" /> Submit</>)}
                </button>
              </div>
            </form>
          )}

          {/* SUCCESS */}
          {phase === 'success' && (
            <div className="flex flex-col items-center py-10 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf1e8]">
                <Check className="h-8 w-8 text-[#2e6d5d]" />
              </div>
              <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-[#163d3a] sm:text-3xl">Thank you for your submission</h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-[#607871]">
                Your details have been saved. We've also emailed you a confirmation with a link to join the community.
              </p>
              {sheetWarning && <p role="alert" className="mt-4 max-w-md rounded-xl border border-[#e8bd73] bg-[#fff7e2] px-4 py-3 text-sm text-[#755515]">{sheetWarning}</p>}
              <a href={TELEGRAM_LINK} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#c8942e] px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-[#163d3a] transition hover:bg-[#e0b64f]">
                <Send className="h-4 w-4" /> Join the community
              </a>
              <p className="mt-4 flex items-center gap-1.5 text-xs text-[#71837b]">
                <Mail className="h-3.5 w-3.5" /> We've also emailed you this link
              </p>
              <button onClick={onClose} className="mt-8 text-xs font-bold uppercase tracking-wider text-[#2e6d5d] transition hover:text-[#c8942e]">
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Form grid with all 18 fields ---

function FormGrid({
  form, errors, cvFields, update,
  skillInput, setSkillInput, addSkill, removeSkill,
  certInput, setCertInput, addCert, removeCert,
  errorRef,
}: {
  form: FormState;
  errors: Record<string, string>;
  cvFields: Set<string>;
  update: (key: keyof FormState, value: string | string[] | boolean) => void;
  skillInput: string;
  setSkillInput: (v: string) => void;
  addSkill: () => void;
  removeSkill: (s: string) => void;
  certInput: string;
  setCertInput: (v: string) => void;
  addCert: () => void;
  removeCert: (s: string) => void;
  errorRef: React.RefObject<HTMLDivElement | null>;
}) {
  const hasError = Object.keys(errors).length > 0;
  const firstErrorKey = hasError ? Object.keys(errors)[0] : '';
  const fieldRef = (key: string) => key === firstErrorKey ? errorRef : undefined;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FieldInput label="Full name" required cvField="fullName" cvFields={cvFields} error={errors.fullName} value={form.fullName} onChange={(v) => update('fullName', v)} ref={fieldRef('fullName')} />
        <FieldInput label="Email" type="email" required cvField="email" cvFields={cvFields} error={errors.email} value={form.email} onChange={(v) => update('email', v)} ref={fieldRef('email')} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FieldInput label="Phone (with country code)" required cvField="phone" cvFields={cvFields} error={errors.phone} value={form.phone} onChange={(v) => update('phone', v)} ref={fieldRef('phone')} />
        <FieldInput label="City, country" required cvField="city" cvFields={cvFields} error={errors.city} value={form.city} onChange={(v) => update('city', v)} ref={fieldRef('city')} />
      </div>
      <FieldInput label="LinkedIn URL" cvField="linkedin" cvFields={cvFields} value={form.linkedin} onChange={(v) => update('linkedin', v)} />
      <div className="grid gap-4 sm:grid-cols-2">
        <FieldInput label="Current job title" required cvField="jobTitle" cvFields={cvFields} error={errors.jobTitle} value={form.jobTitle} onChange={(v) => update('jobTitle', v)} ref={fieldRef('jobTitle')} />
        <FieldInput label="Current company" cvField="company" cvFields={cvFields} value={form.company} onChange={(v) => update('company', v)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FieldInput label="Total experience (years)" type="number" required cvField="experienceYears" cvFields={cvFields} error={errors.experienceYears} value={form.experienceYears} onChange={(v) => update('experienceYears', v)} ref={fieldRef('experienceYears')} />
        <FieldSelect label="Industry" required cvField="industry" cvFields={cvFields} error={errors.industry} value={form.industry} onChange={(v) => update('industry', v)} options={INDUSTRIES} ref={fieldRef('industry')} />
      </div>

      {/* Key skills — tag input */}
      <TagInput
        label="Key skills" required cvField="skills" fromCv={cvFields.has('skills')}
        tags={form.skills} input={skillInput} setInput={setSkillInput}
        onAdd={addSkill} onRemove={removeSkill} max={15}
        error={errors.skills} ref={fieldRef('skills')}
      />

      <FieldInput label="Highest qualification" required cvField="qualification" cvFields={cvFields} error={errors.qualification} value={form.qualification} onChange={(v) => update('qualification', v)} ref={fieldRef('qualification')} />

      {/* Certifications — tag input */}
      <TagInput
        label="Certifications (e.g. CA, CPA, PMP, AWS, CFA)" cvField="certifications" fromCv={cvFields.has('certifications')}
        tags={form.certifications} input={certInput} setInput={setCertInput}
        onAdd={addCert} onRemove={removeCert} max={99}
      />

      {/* Open to opportunities */}
      <FieldRadioGroup
        label="Open to opportunities?" required
        value={form.openTo} onChange={(v) => update('openTo', v)}
        options={[{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }, { value: 'Passive', label: 'Passive' }]}
        error={errors.openTo} ref={fieldRef('openTo')}
      />

      <FieldInput label="Preferred roles / locations" value={form.preferred} onChange={(v) => update('preferred', v)} />

      <div className="grid gap-4 sm:grid-cols-2">
        <FieldSelect label="Notice period" value={form.notice} onChange={(v) => update('notice', v)} options={NOTICE_PERIODS} />
        <div className="grid grid-cols-[100px_1fr] gap-3">
          <FieldSelect label="Currency" value={form.salaryCurrency} onChange={(v) => update('salaryCurrency', v)} options={CURRENCIES} compact />
          <FieldInput label="Expected salary / year" type="number" value={form.salaryAmount} onChange={(v) => update('salaryAmount', v)} />
        </div>
      </div>

      <FieldSelect label="How did you hear about us?" value={form.source} onChange={(v) => update('source', v)} options={HEARD_OPTIONS} />
    </div>
  );
}

// --- Reusable field components ---

function CvBadge({ show }: { show: boolean }) {
  if (!show) return null;
  return <span className="inline-flex items-center gap-1 rounded-full bg-[#eaf1e8] px-2 py-0.5 text-[10px] font-bold text-[#2e6d5d]"><Sparkles className="h-2.5 w-2.5" /> from CV</span>;
}

function FieldInput({
  label, value, onChange, type = 'text', required = false, cvField, cvFields, error, ref,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  cvField?: string;
  cvFields: Set<string>;
  error?: string;
  ref?: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div ref={ref}>
      <div className="mb-1.5 flex items-center gap-2">
        <label className="text-xs font-bold text-[#163d3a]">{label}{required && <span className="text-[#c8942e]"> *</span>}</label>
        {cvField && <CvBadge show={cvFields.has(cvField)} />}
      </div>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={`field ${error ? 'border-[#e8927a] bg-[#fef0ec]' : ''}`} />
      {error && <p className="mt-1 text-xs font-bold text-[#b03820]">{error}</p>}
    </div>
  );
}

function FieldSelect({
  label, value, onChange, options, required = false, cvField, cvFields, error, compact, ref,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  required?: boolean;
  cvField?: string;
  cvFields: Set<string>;
  error?: string;
  compact?: boolean;
  ref?: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div ref={ref}>
      <div className="mb-1.5 flex items-center gap-2">
        <label className="text-xs font-bold text-[#163d3a]">{label}{required && <span className="text-[#c8942e]"> *</span>}</label>
        {cvField && <CvBadge show={cvFields.has(cvField)} />}
      </div>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={`field cursor-pointer ${error ? 'border-[#e8927a] bg-[#fef0ec]' : ''} ${compact ? 'py-2' : ''}`}>
        <option value="">Select...</option>
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      {error && <p className="mt-1 text-xs font-bold text-[#b03820]">{error}</p>}
    </div>
  );
}

function FieldRadioGroup({
  label, value, onChange, options, required, error, ref,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  error?: string;
  ref?: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div ref={ref}>
      <div className="mb-1.5 flex items-center gap-2">
        <label className="text-xs font-bold text-[#163d3a]">{label}{required && <span className="text-[#c8942e]"> *</span>}</label>
      </div>
      <div className="flex gap-2">
        {options.map((opt) => (
          <button key={opt.value} type="button" onClick={() => onChange(opt.value)}
            className={`flex-1 rounded-xl border px-4 py-2.5 text-xs font-bold transition ${value === opt.value ? 'border-[#c8942e] bg-[#fff7e2] text-[#163d3a]' : 'border-[#dfe6de] bg-white text-[#607871] hover:border-[#c8942e]/50'}`}>
            {opt.label}
          </button>
        ))}
      </div>
      {error && <p className="mt-1 text-xs font-bold text-[#b03820]">{error}</p>}
    </div>
  );
}

function TagInput({
  label, tags, input, setInput, onAdd, onRemove, max, required = false, cvField, fromCv, error, ref,
}: {
  label: string;
  tags: string[];
  input: string;
  setInput: (v: string) => void;
  onAdd: () => void;
  onRemove: (s: string) => void;
  max: number;
  required?: boolean;
  cvField?: string;
  fromCv?: boolean;
  error?: string;
  ref?: React.RefObject<HTMLDivElement | null>;
}) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); onAdd(); }
  };
  return (
    <div ref={ref}>
      <div className="mb-1.5 flex items-center gap-2">
        <label className="text-xs font-bold text-[#163d3a]">{label}{required && <span className="text-[#c8942e]"> *</span>}</label>
        {cvField && <CvBadge show={!!fromCv} />}
        {max < 99 && tags.length > 0 && <span className="text-[10px] text-[#71837b]">{tags.length}/{max}</span>}
      </div>
      <div className={`flex flex-wrap gap-2 rounded-xl border bg-white p-3 ${error ? 'border-[#e8927a] bg-[#fef0ec]' : 'border-[#dfe6de]'}`}>
        {tags.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-lg bg-[#eaf1e8] px-2.5 py-1 text-xs font-semibold text-[#2e6d5d]">
            {tag}
            <button type="button" onClick={() => onRemove(tag)} className="text-[#2e6d5d]/60 hover:text-[#b03820]">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        {tags.length < max && (
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={onAdd}
            placeholder={tags.length === 0 ? 'Type and press Enter...' : ''}
            className="flex-1 min-w-[120px] border-0 bg-transparent text-xs text-[#163d3a] outline-none"
          />
        )}
      </div>
      {error && <p className="mt-1 text-xs font-bold text-[#b03820]">{error}</p>}
    </div>
  );
}
