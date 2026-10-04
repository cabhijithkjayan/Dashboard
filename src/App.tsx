import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import {
  ArrowRight,
  Award,
  BarChart3,
  Briefcase,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Coffee,
  Download,
  Eye,
  FolderOpen,
  Facebook,
  FileText,
  Globe2,
  Instagram,
  Languages,
  Link2,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Package,
  Phone,
  Plane,
  Send,
  Ship,
  ShoppingBag,
  Sparkles,
  Target,
  TrendingUp,
  Truck,
  Users,
  WalletCards,
  X,
  Bot,
  Cpu,
  Gauge,
  Lightbulb,
  Repeat,
  Search,
  Settings,
  Workflow,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Resources from './resources';
import { skillLogos, eduLogos, TallyLogo, ExcelLogo, PowerBILogo, MSOfficeLogo, ICAILogo, IGNOULogo, DPYLogo, WiproLogo, KalaLogo, GuptaLogo, BPLogo } from './logos';
import type { FC } from 'react';

type TabId =
  | 'overview'
  | 'experience'
  | 'sales'
  | 'trade'
  | 'marketing'
  | 'finance'
  | 'ai'
  | 'global'
  | 'social'
  | 'projects'
  | 'education'
  | 'languages'
  | 'skills'
  | 'resources'
  | 'contact';

type Tab = { id: TabId; label: string; shortLabel: string };
type Palette = 'gold' | 'green' | 'orange' | 'navy' | 'cream';

const tabs: Tab[] = [
  { id: 'overview', label: 'Overview', shortLabel: 'Overview' },
  { id: 'resources', label: 'Resources', shortLabel: 'Resources' },
  { id: 'experience', label: 'Experience', shortLabel: 'Experience' },
  { id: 'finance', label: 'Finance Management', shortLabel: 'Finance' },
  { id: 'ai', label: 'AI Generalist', shortLabel: 'AI Generalist' },
  { id: 'sales', label: 'Commercial & Business Support', shortLabel: 'Commercial' },
  { id: 'trade', label: 'Business Operations & Trade', shortLabel: 'Operations' },
  { id: 'marketing', label: 'Supporting Brand & Digital', shortLabel: 'Brand' },
  { id: 'global', label: 'Global Trade', shortLabel: 'Global' },
  { id: 'social', label: 'Social Media Works', shortLabel: 'Social' },
  { id: 'projects', label: 'Projects', shortLabel: 'Projects' },
  { id: 'education', label: 'Education & Certifications', shortLabel: 'Education' },
  { id: 'languages', label: 'Languages', shortLabel: 'Languages' },
  { id: 'skills', label: 'Skills & Tools', shortLabel: 'Skills' },
  { id: 'contact', label: 'Contact', shortLabel: 'Contact' },
];

const images = {
  cardamom: 'https://images.pexels.com/photos/8217944/pexels-photo-8217944.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  spices: 'https://images.pexels.com/photos/8747536/pexels-photo-8747536.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  coffee: 'https://images.pexels.com/photos/14745651/pexels-photo-14745651.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  tea: 'https://images.pexels.com/photos/6870854/pexels-photo-6870854.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  nuts: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  cargo: 'https://images.pexels.com/photos/24246926/pexels-photo-24246926.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  market: 'https://images.pexels.com/photos/5332494/pexels-photo-5332494.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
};

const links = {
  linkedin: 'https://www.linkedin.com/in/abhijithkjayan/',
  email: 'mailto:cabhijithkjayan@gmail.com',
  phone: 'tel:+971506095345',
  whatsapp: 'https://wa.me/+971506095345',
  instagram: 'https://www.instagram.com/abhijith.k.jayan/',
  linktree: 'https://linktr.ee/abhijithkjayan',
  kalaInstagram: 'https://www.instagram.com/kalaspicex/',
  kalaFacebook: 'https://www.facebook.com/kalaspicex',
  marketsInstagram: 'https://www.instagram.com/marketswithabhi/',
  masalewala: 'https://www.masalewala.site/dashboard',
  cv: '/Abhijith_K_Jayan_AFAM.pdf',
  resources: 'https://drive.google.com/drive/folders/1uNKq7bM-FAnd7HqVkJn104RMDL014ytF?usp=sharing',
};

const experience = [
  {
    role: 'Accounts and Finance Manager',
    company: 'Kala SpiceX (Grinix)',
    detail: 'Delhi & Kerala  |  Oct 2023 – Aug 2026  |  FMCG, spice wholesale trading & import-export',
    color: 'gold' as Palette,
    Logo: KalaLogo,
    clientLogo: undefined,
    bullets: [
      'Managed end-to-end Accounts and Finance functions, including bookkeeping, GST, taxation, statutory compliance, vendor accounting, reconciliations, and financial reporting.',
      'Led financial planning, budgeting, forecasting, and cash-flow management, aligning financial resources with procurement, inventory, operating expenses, and business growth requirements.',
      'Managed product costing, pricing, and margin analysis for spice trading operations, evaluating procurement costs, logistics, market prices, and target margins to support profitable decisions.',
      'Prepared and analysed MIS reports, management accounts, and financial statements, providing visibility into revenue, expenses, gross margins, working capital, and overall profitability.',
      'Monitored accounts payable, vendor balances, procurement payments, and reconciliations, ensuring accurate and timely settlement across sourcing and logistics operations.',
      'Analysed cost structures and profitability by product, customer, and channel to support management decisions on pricing, procurement, and sales strategy.',
      'Coordinated demand forecasting, inventory planning, and market research with commercial and operations teams to improve purchasing decisions and working-capital utilisation.',
      'Managed revenue and expense tracking, identified cost-control opportunities, and supported effective allocation of financial resources across business functions.',
      'Supported procurement and sourcing decisions through cost analysis, supplier pricing evaluation, and financial impact assessment.',
      'Developed and implemented digital MIS and AI-enabled tools to streamline financial tracking, reporting, data analysis, and management decision-making.',
      'Maintained financial controls and supported audit, compliance, and documentation requirements, ensuring accuracy and transparency across accounting and commercial transactions.',
      'Worked closely with sales and procurement teams on pricing strategy, customer margins, payment terms, and commercial negotiations, ensuring decisions aligned with profitability and cash-flow objectives.',
      'Conducted market and competitor analysis to support pricing decisions, demand forecasting, and financial planning for the Grinix spice business.',
      'Supported the commercial growth of the business through sales, customer management, and distribution activities, while maintaining a strong focus on cost control, margins, and financial sustainability.',
      'Coordinated quality control and logistics from a financial and cost-management perspective, ensuring supply-chain activities were commercially viable and accurately reflected in financial records.',
    ],
  },
  {
    role: 'Senior Finance Executive',
    company: 'Wipro Ltd.',
    detail: 'Bengaluru  |  Dec 2021 – Aug 2023  |  Information Technology Industry',
    color: 'green' as Palette,
    Logo: WiproLogo,
    clientLogo: BPLogo,
    clientName: 'British Petroleum',
    clientNote: 'One of Wipro\'s Platinum Accounts',
    bullets: [
      'Team Lead of Revenue Centre of Excellence for Europe, UK and Ireland, supporting 160+ accounts.',
      'Led a high-performing finance team of 14 members, including Chartered Accountants, MBAs, and finance professionals.',
      'Forecasted quarterly revenue and budgets, managing revenue operations across approximately $500M in monthly validations.',
      'Associated with Revenue Assurance, FP&A, and Audit teams post quarter-end closures.',
      'Provided strategic guidance for accurate revenue reporting, compliance, and revenue optimization initiatives.',
      'Performed deal pricing and optimized deal prices while negotiating customer delivery-linked business deals.',
      'Reviewed contracts to interpret financial models and financial reporting as per IFRS 15 and IFRS 16.',
      'Ensured attention to detail while validating order booking and downstream activities in Wipro ERP (Quantum).',
      'Managed Accounts Receivable, System Audit, User Acceptance Testing, and month-end revenue closure activities, reporting, and presentations.',
      'Handled Account Reconciliation, Invoice Reconciliation, Debtors Ageing, Unbilled/Unearned Revenue Reconciliation, and Costing.'
    ],
  },
  {
    role: 'Audit Associate',
    company: 'Gupta Raj & Co., Chartered Accountants',
    detail: 'Nagpur  |  Apr 2020 – Nov 2021',
    color: 'navy' as Palette,
    Logo: GuptaLogo,
    clientLogo: undefined,
    bullets: [
      'Specialized in processing loan files for individuals and commercial loan applicants with renowned nationalized banks.',
      'Conducted financial analyses and evaluated creditworthiness using project financing ratios.',
      'Performed financial modelling, equity valuation, restructuring, and various investment studies.',
      'Prepared financial statements for private and public limited companies, partnership firms, and individuals.',
      'Applied Accounting, Ind AS, IFRS, auditing, and Company Law knowledge acquired during CA Final studies.'
    ],
  },
];

const skills = {
  sales: ['Deal Pricing', 'Pricing Strategy', 'Contract Negotiation', 'Customer Relationship Management', 'Stakeholder Management', 'Cross-Functional Collaboration', 'Commercial Finance', 'Margin Analysis'],
  marketing: ['Market Research', 'Branding', 'Marketing', 'Product Positioning', 'Content Strategy', 'Digital Marketing'],
  trade: ['Business Operations', 'Supply Chain Management', 'Logistics', 'Procurement', 'Sourcing', 'Quality Control', 'Demand Forecasting', 'Vendor Management'],
  finance: ['Accounting', 'Financial Accounting', 'Corporate Finance', 'Financial Management', 'Financial Planning & Analysis', 'Financial Reporting', 'Financial Statements Preparation', 'Balance Sheet', 'Profit & Loss Statement', 'Cash Flow Statement', 'General Ledger', 'Accounts Receivable', 'Accounts Payable', 'Account Reconciliation', 'Bank Reconciliation', 'Invoice Reconciliation', 'Debtors Ageing', 'Unbilled Revenue', 'Unearned Revenue', 'Working Capital Management', 'Cost Accounting', 'Costing', 'Budgeting', 'Forecasting', 'Variance Analysis', 'Revenue Assurance', 'Revenue Recognition', 'Revenue Reporting', 'Month-End Close', 'Quarter-End Close', 'MIS Reporting', 'Statutory Reporting'],
  audit: ['Statutory Audit', 'Internal Audit', 'System Audit', 'Audit Associate', 'Audit Assistant', 'Auditing', 'Compliance', 'Regulatory Compliance', 'Company Law', 'Risk Assessment', 'Risk Management', 'Internal Controls', 'GST Filing', 'Taxation', 'Direct Tax', 'Indirect Tax', 'Statutory Compliance', 'Contract Review'],
  leadership: ['Financial Analyst', 'Business Analyst', 'Finance Executive', 'Senior Finance Executive', 'Finance Manager', 'Accountant', 'Accounts Executive', 'Strategic Planning', 'Strategic Decision-Making', 'Team Leadership', 'People Management', 'Team Building', 'Delegation', 'Problem-Solving', 'Attention to Detail', 'Presentation Skills', 'Communication Skills', 'Pricing Strategy', 'Contract Negotiation', 'Stakeholder Management', 'Cross-Functional Collaboration'],
  ai: ['AI Integration', 'Generative AI', 'AI Agents', 'Agentic AI Workflows', 'Prompt Engineering', 'ChatGPT / OpenAI', 'Claude', 'n8n', 'GitHub Actions', 'Docker', 'API Integration', 'Webhooks', 'Telegram Bots', 'Digital Transformation', 'Finance Process Automation', 'Dashboards'],
  reporting: ['Ind AS', 'IAS', 'IFRS', 'IFRS 15', 'IFRS 16', 'GAAP', 'Financial Modelling', 'Equity Valuation', 'Credit Analysis', 'Creditworthiness Assessment', 'Project Financing', 'Loan Processing', 'Financial Restructuring', 'Investment Analysis', 'Investment Planning', 'Technical Analysis', 'Fundamental Analysis', 'Stock Market Analysis'],
  tools: ['Advanced Microsoft Excel', 'Microsoft Excel', 'Microsoft Power BI', 'Microsoft Word', 'Microsoft Outlook', 'SAP', 'SAP ERP', 'Tally ERP', 'ERP Systems', 'Wipro Quantum ERP', 'MIS Tools', 'Adobe Suite'],
};

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setStarted(true);
        observer.disconnect();
      }
    }, { threshold: 0.35 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return undefined;
    let frame = 0;
    const start = performance.now();
    const tick = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, started, target]);

  return { ref, value };
}

function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        element.classList.add('is-visible');
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [cvOpen, setCvOpen] = useState(false);

  const goTo = (id: TabId) => {
    setActiveTab(id);
    setMobileNavOpen(false);
    window.setTimeout(() => document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  };

  return (
    <div className="min-h-screen bg-[#f7f8f5] text-[#163d3a]">
      <Hero onNavigate={goTo} onViewCv={() => setCvOpen(true)} />
      <div className="lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:items-start lg:gap-6">
        <aside className="sticky top-0 z-40 border-b border-[#dfe6de] bg-[#f7f8f5]/95 shadow-sm backdrop-blur-xl lg:min-h-screen lg:border-b-0 lg:border-r lg:shadow-none">
          <div className="mx-auto flex max-w-[1440px] items-center gap-2 px-4 py-2 sm:px-8 lg:mx-0 lg:flex-col lg:items-stretch lg:gap-5 lg:px-4 lg:py-6">
            <button onClick={() => setMobileNavOpen((open) => !open)} className="rounded-lg border border-[#dfe6de] p-2.5 text-[#163d3a] lg:hidden" aria-label="Open navigation">{mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
            <div className="hidden shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#2e6d5d] lg:flex"><span className="h-2 w-2 rounded-full bg-[#c8942e]" /> Explore profile</div>
            <nav className={`${mobileNavOpen ? 'absolute left-4 right-4 top-16 grid rounded-2xl border border-[#dfe6de] bg-white p-3 shadow-2xl sm:left-8 sm:right-8' : 'hidden'} max-h-[70vh] gap-2 overflow-y-auto lg:static lg:flex lg:max-h-[calc(100vh-170px)] lg:flex-col lg:gap-1 lg:overflow-y-auto lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`} aria-label="Profile sections">
              {tabs.map((tab) => <button key={tab.id} onClick={() => goTo(tab.id)} className={`min-h-10 whitespace-nowrap rounded-xl px-3 py-2 text-left text-xs font-bold uppercase tracking-[0.06em] transition lg:w-full lg:text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8942e] ${activeTab === tab.id ? 'bg-[#163d3a] text-white shadow-sm' : 'text-[#55706b] hover:bg-[#e9f0e8] hover:text-[#163d3a]'}`}><span className="lg:hidden">{tab.label}</span><span className="hidden lg:inline">{tab.shortLabel}</span></button>)}
            </nav>
            <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0 lg:w-full lg:flex-col lg:items-stretch"><a href={links.resources} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#c8942e]/50 bg-white px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[#163d3a] transition hover:border-[#c8942e] hover:bg-[#fff7e2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8942e]"><FolderOpen className="h-4 w-4 text-[#c8942e]" /> <span className="hidden sm:inline lg:hidden">Resources</span><span className="hidden lg:inline">Resources</span></a><button onClick={() => setCvOpen(true)} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#c8942e] px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[#163d3a] transition hover:bg-[#e0b64f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#163d3a]"><Eye className="h-4 w-4" /> <span className="hidden sm:inline">View CV</span></button></div>
          </div>
        </aside>

        <main id={`section-${activeTab}`} className="scroll-mt-24 mx-auto max-w-[1440px] px-4 py-6 sm:scroll-mt-20 sm:px-8 lg:mx-0 lg:px-6 lg:py-8">
        <div key={activeTab} className="tab-enter">
          {activeTab === 'overview' && <Overview onNavigate={goTo} />}
          {activeTab === 'experience' && <Experience auditOpen={auditOpen} setAuditOpen={setAuditOpen} />}
          {activeTab === 'sales' && <Sales />}
          {activeTab === 'trade' && <Trade />}
          {activeTab === 'marketing' && <Marketing />}
          {activeTab === 'finance' && <Finance />}
          {activeTab === 'global' && <GlobalTrade />}
          {activeTab === 'social' && <Social />}
          {activeTab === 'projects' && <Projects />}
          {activeTab === 'education' && <Education />}
          {activeTab === 'languages' && <LanguagesSection />}
          {activeTab === 'skills' && <Skills />}
          {activeTab === 'resources' && <Resources />}
          {activeTab === 'contact' && <Contact onContact={() => setContactOpen(true)} onViewCv={() => setCvOpen(true)} />}
        </div>
      </main>
      </div>

      <Footer onContact={() => setContactOpen(true)} onNavigate={goTo} onViewCv={() => setCvOpen(true)} />
      {cvOpen && <CvViewer onClose={() => setCvOpen(false)} />}
      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
    </div>
  );
}

function Hero({ onNavigate, onViewCv }: { onNavigate: (id: TabId) => void; onViewCv: () => void }) {
  return <header className="relative overflow-hidden bg-[#eaf1e8]">
    <div className="hero-map" aria-hidden="true"><div className="route route-one" /><div className="route route-two" /><div className="route route-three" /><Ship className="ship-icon" /><Plane className="plane-icon" /><span className="particle particle-one" /><span className="particle particle-two" /><span className="particle particle-three" /></div>
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="logo-marquee-layer marquee-skills" style={{ top: '28%', opacity: 0.19 }}>
        <div className="logo-marquee-row">{skillLogos.concat(skillLogos).map(({ Component }, i) => <span key={i} className="hero-logo-skill flex items-center justify-center" style={{ width: '220px' }}><Component className="h-28 w-44 object-contain" /></span>)}</div>
      </div>
      <div className="logo-marquee-layer marquee-edu" style={{ bottom: '28%', opacity: 0.15 }}>
        <div className="logo-marquee-row">{eduLogos.concat(eduLogos).map(({ Component }, i) => <span key={i} className="hero-logo-edu flex items-center justify-center" style={{ width: '200px' }}><Component className="h-28 w-40 object-contain" /></span>)}</div>
      </div>
    </div>
    <div className="relative mx-auto max-w-[1440px] px-5 pb-8 pt-4 sm:px-10 lg:pb-10 lg:pt-5">
      <div className="flex items-center justify-between border-b border-[#cbd9cb] pb-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#163d3a] text-[#e0b64f]"><Globe2 className="h-5 w-5" /></div><div><p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#2e6d5d]">Professional Portfolio</p><p className="text-sm font-bold tracking-wide text-[#163d3a]">ABHIJITH K JAYAN</p></div></div><div className="hidden items-center gap-2 text-xs font-semibold text-[#55706b] sm:flex"><MapPin className="h-4 w-4 text-[#c8942e]" /> Dubai, UAE</div></div>
      <div className="grid items-center gap-6 pt-6 lg:grid-cols-[1.25fr_0.75fr] lg:pt-7"><div className="relative z-10"><div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#c8942e]/40 bg-white/60 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#8a651a]"><Sparkles className="h-3.5 w-3.5" /> Finance · AI · Automation</div><h1 className="max-w-4xl text-5xl font-extrabold leading-[0.98] tracking-[-0.05em] text-[#163d3a] sm:text-7xl lg:text-8xl">ABHIJITH<br /><span className="text-[#c8942e]">K JAYAN</span></h1><p className="mt-7 max-w-3xl text-base font-semibold leading-7 text-[#2e6d5d] sm:text-xl">Building smarter finance systems <span className="text-[#c8942e]">|</span> Finance, AI & Automation <span className="text-[#c8942e]">|</span> Audit & Compliance</p><p className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-[#55706b] sm:text-base">Automate <span className="text-[#c8942e]">•</span> Integrate <span className="text-[#c8942e]">•</span> Build <span className="text-[#c8942e]">•</span> Optimize</p><div className="mt-8 flex flex-wrap gap-3"><SocialButton href={links.linkedin} label="LinkedIn" icon={Linkedin} external /><SocialButton href={links.instagram} label="Instagram" icon={Instagram} external /><SocialButton href={links.linktree} label="Linktree" icon={Link2} external /><SocialButton href={links.email} label="Email Me" icon={Mail} /><SocialButton href={links.phone} label="Call Me" icon={Phone} /><SocialButton href={links.whatsapp} label="WhatsApp" icon={MessageCircle} external /><button onClick={onViewCv} className="inline-flex items-center gap-2 rounded-xl bg-[#163d3a] px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#2e6d5d]"><Eye className="h-4 w-4" /> View CV</button></div><button onClick={() => onNavigate('overview')} className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#2e6d5d] hover:text-[#c8942e]">Explore the profile <ArrowRight className="h-4 w-4" /></button></div><div className="relative mx-auto w-full max-w-[290px] lg:justify-self-end"><div className="absolute -inset-6 rounded-[2rem] border border-[#c8942e]/30 rotate-3" /><div className="relative overflow-hidden rounded-[1.75rem] border-[10px] border-white bg-[#c8942e] shadow-2xl transition duration-500 hover:-translate-y-2 hover:rotate-1"><img src="/profile-photo.jpg" alt="Abhijith K Jayan" className="aspect-[4/5] w-full object-cover object-top" /></div><div className="absolute -bottom-5 -left-6 rounded-2xl bg-[#163d3a] px-4 py-3 text-white shadow-xl"><p className="text-[10px] font-bold uppercase tracking-widest text-[#e0b64f]">Focus</p><p className="mt-1 text-sm font-semibold">Finance + AI + Automation</p></div></div></div>
    </div>
    <div className="relative border-t border-[#cbd9cb] bg-white/40 py-4">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-10">
        <div className="flex items-center gap-2 pb-4"><Sparkles className="h-4 w-4 text-[#c8942e]" /><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#2e6d5d]">Featured projects</p></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <a href={links.masalewala} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 rounded-2xl border border-[#dfe6de] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#c8942e] hover:shadow-md"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf1e8] text-[#2e6d5d]"><BarChart3 className="h-5 w-5" /></span><div><p className="text-sm font-bold text-[#163d3a]">Cardamom Dashboard</p><p className="text-[11px] text-[#71837b]">Market intelligence</p></div></a>
          <a href="https://jobmatch.bolt.host" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 rounded-2xl border border-[#dfe6de] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#c8942e] hover:shadow-md"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf1e8] text-[#2e6d5d]"><Globe2 className="h-5 w-5" /></span><div><p className="text-sm font-bold text-[#163d3a]">JobMatch</p><p className="text-[11px] text-[#71837b]">Job search platform</p></div></a>
          <a href="https://t.me/abhijithkjayanuaejobs" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 rounded-2xl border border-[#dfe6de] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#c8942e] hover:shadow-md"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf1e8] text-[#2e6d5d]"><Send className="h-5 w-5" /></span><div><p className="text-sm font-bold text-[#163d3a]">Finance Jobs Bot</p><p className="text-[11px] text-[#71837b]">Telegram channel</p></div></a>
          <a href={links.kalaInstagram} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 rounded-2xl border border-[#dfe6de] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#c8942e] hover:shadow-md"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf1e8] text-[#2e6d5d]"><Sparkles className="h-5 w-5" /></span><div><p className="text-sm font-bold text-[#163d3a]">Kala SpiceX</p><p className="text-[11px] text-[#71837b]">Brand & social media</p></div></a>
        </div>
      </div>
    </div>
  </header>;
}

function SocialButton({ href, label, icon: Icon, external = false }: { href: string; label: string; icon: LucideIcon; external?: boolean }) {
  return <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className="inline-flex items-center gap-2 rounded-xl border border-[#cbd9cb] bg-white/75 px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#163d3a] shadow-sm transition hover:-translate-y-0.5 hover:border-[#c8942e] hover:bg-white"><Icon className="h-4 w-4 text-[#c8942e]" /> {label}</a>;
}

function SectionHeader({ eyebrow, title, text, icon: Icon = Sparkles, dark = false }: { eyebrow: string; title: string; text?: string; icon?: LucideIcon; dark?: boolean }) {
  return <div className={`max-w-3xl ${dark ? 'text-white' : ''}`}><div className={`mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] ${dark ? 'text-[#e0b64f]' : 'text-[#2e6d5d]'}`}><span className={`flex h-9 w-9 items-center justify-center rounded-xl ${dark ? 'bg-white/10' : 'bg-[#e4efe3]'}`}><Icon className="h-4 w-4" /></span>{eyebrow}</div><h2 className={`text-4xl font-extrabold leading-tight tracking-[-0.04em] sm:text-5xl ${dark ? 'text-white' : 'text-[#163d3a]'}`}>{title}</h2>{text && <p className={`mt-4 max-w-2xl text-base leading-7 ${dark ? 'text-slate-300' : 'text-[#607871]'}`}>{text}</p>}</div>;
}

function Overview({ onNavigate }: { onNavigate: (id: TabId) => void }) {
  return <div className="space-y-8"><Reveal><SectionHeader eyebrow="About" title="Building smarter finance systems through Finance, AI & Automation." text="Finance and Accounts professional with an MBA in Finance Management and Chartered Accountancy studies, with experience across accounting, audit, taxation, financial reporting, FP&A, corporate finance, revenue assurance, and commercial finance. I combine finance domain expertise with AI, automation, and technology to improve how financial work is performed — identifying repetitive, manual, and error-prone processes and turning them into automated workflows, intelligent systems, dashboards, and decision-support tools." /></Reveal><Reveal className="rounded-3xl border border-[#dfe6de] bg-white p-7 shadow-sm sm:p-9"><p className="text-sm leading-7 text-[#607871]">I work with tools such as ChatGPT/OpenAI, Claude, n8n, APIs, webhooks, GitHub, Python, Docker, and low-code/no-code platforms to build practical solutions around finance and business operations. My approach is simple: understand the business process first, then use technology to make it faster, more accurate, scalable, and easier to manage.</p></Reveal><Reveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><StatCard target={160} suffix="+" label="Accounts supported" icon={Briefcase} /><StatCard target={500} prefix="$" suffix="M" label="Monthly revenue validations" icon={CircleDollarSign} /><StatCard target={14} suffix="" label="Finance professionals led" icon={TrendingUp} /><StatCard target={3} suffix="+" label="Automation & AI projects" icon={Cpu} /></Reveal><Reveal className="grid gap-5 md:grid-cols-2 lg:grid-cols-4"><div className="group rounded-2xl border border-[#dfe6de] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:border-[#c8942e]"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf1e8] text-[#2e6d5d]"><BarChart3 className="h-5 w-5" /></span><h3 className="mt-5 text-lg font-bold text-[#163d3a]">Finance + Technology</h3><p className="mt-2 text-sm leading-6 text-[#607871]">Accounting, reporting, audit, FP&A, costing, revenue assurance, controls, and commercial finance combined with AI and automation.</p></div><div className="group rounded-2xl border border-[#dfe6de] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:border-[#c8942e]"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf1e8] text-[#2e6d5d]"><Cpu className="h-5 w-5" /></span><h3 className="mt-5 text-lg font-bold text-[#163d3a]">AI & Automation</h3><p className="mt-2 text-sm leading-6 text-[#607871]">Building AI-assisted workflows, agents, integrations, dashboards, and automated processes to reduce repetitive work and improve operational efficiency.</p></div><div className="group rounded-2xl border border-[#dfe6de] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:border-[#c8942e]"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf1e8] text-[#2e6d5d]"><Settings className="h-5 w-5" /></span><h3 className="mt-5 text-base font-bold text-[#163d3a]">Finance Systems & Process Improvement</h3><p className="mt-2 text-sm leading-6 text-[#607871]">Mapping processes, identifying bottlenecks, eliminating manual steps, connecting systems, and creating repeatable workflows that improve accuracy and productivity.</p></div><div className="group rounded-2xl border border-[#dfe6de] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:border-[#c8942e]"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf1e8] text-[#2e6d5d]"><Gauge className="h-5 w-5" /></span><h3 className="mt-5 text-base font-bold text-[#163d3a]">Business & Decision Intelligence</h3><p className="mt-2 text-sm leading-6 text-[#607871]">Turning financial and operational data into dashboards, analysis, alerts, and actionable information for better business decisions.</p></div></Reveal><Reveal className="grid items-stretch gap-5 lg:grid-cols-[1.2fr_0.8fr]"><div className="relative min-h-[330px] overflow-hidden rounded-[2rem] bg-[#163d3a] p-8 text-white sm:p-10"><img src={images.cardamom} alt="Green cardamom" className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-screen" /><div className="relative max-w-xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e0b64f]">Finance + AI</p><h3 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">Not just using AI — engineering better finance processes.</h3><p className="mt-4 leading-7 text-slate-200">From managing accounts and compliance at a spice trading company to leading revenue operations at a global technology services firm, the work combines deep finance knowledge with AI and automation to make processes faster, more accurate, and scalable.</p><button onClick={() => onNavigate('ai')} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#e0b64f] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#163d3a]">Explore AI & automation <ArrowRight className="h-4 w-4" /></button></div></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1"><MiniInsight icon={Target} title="UAE / GCC focus" text="Finance and accounts perspective shaped by Indian market execution and a Dubai-based global outlook." /><MiniInsight icon={Cpu} title="Technology edge" text="AI, automation, APIs, and dashboards applied to real finance and business operations." /></div></Reveal><Reveal><div className="rounded-3xl border border-[#dfe6de] bg-gradient-to-br from-[#f8faf7] to-[#eaf1e8] p-7 shadow-sm sm:p-9"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#163d3a] text-[#e0b64f]"><Workflow className="h-5 w-5" /></span><div><h3 className="text-lg font-extrabold text-[#163d3a]">How I Work</h3><p className="text-xs font-bold uppercase tracking-wider text-[#2e6d5d]">Process engineering with finance knowledge + AI</p></div></div><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"><div className="group relative rounded-2xl border border-[#dfe6de] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#c8942e] hover:shadow-lg"><div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf1e8] text-[#2e6d5d]"><Search className="h-5 w-5" /></span><span className="text-2xl font-extrabold tracking-tight text-[#c8942e]/30">01</span></div><h4 className="mt-4 font-bold text-[#163d3a]">Understand</h4><p className="mt-2 text-xs leading-5 text-[#607871]">Understand the finance/business process, objective, dependencies and pain points.</p></div><div className="group relative rounded-2xl border border-[#dfe6de] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#c8942e] hover:shadow-lg"><div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf1e8] text-[#2e6d5d]"><Lightbulb className="h-5 w-5" /></span><span className="text-2xl font-extrabold tracking-tight text-[#c8942e]/30">02</span></div><h4 className="mt-4 font-bold text-[#163d3a]">Simplify</h4><p className="mt-2 text-xs leading-5 text-[#607871]">Remove unnecessary steps and identify repetitive or manual activities.</p></div><div className="group relative rounded-2xl border border-[#dfe6de] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#c8942e] hover:shadow-lg"><div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf1e8] text-[#2e6d5d]"><Workflow className="h-5 w-5" /></span><span className="text-2xl font-extrabold tracking-tight text-[#c8942e]/30">03</span></div><h4 className="mt-4 font-bold text-[#163d3a]">Automate</h4><p className="mt-2 text-xs leading-5 text-[#607871]">Use AI, APIs, workflows and integrations to automate suitable processes.</p></div><div className="group relative rounded-2xl border border-[#dfe6de] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#c8942e] hover:shadow-lg"><div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf1e8] text-[#2e6d5d]"><Repeat className="h-5 w-5" /></span><span className="text-2xl font-extrabold tracking-tight text-[#c8942e]/30">04</span></div><h4 className="mt-4 font-bold text-[#163d3a]">Systemize</h4><p className="mt-2 text-xs leading-5 text-[#607871]">Turn one-off solutions into repeatable systems, dashboards and workflows.</p></div><div className="group relative rounded-2xl border border-[#dfe6de] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#c8942e] hover:shadow-lg"><div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf1e8] text-[#2e6d5d]"><Gauge className="h-5 w-5" /></span><span className="text-2xl font-extrabold tracking-tight text-[#c8942e]/30">05</span></div><h4 className="mt-4 font-bold text-[#163d3a]">Improve</h4><p className="mt-2 text-xs leading-5 text-[#607871]">Measure accuracy, time saved, efficiency and decision quality and continuously improve the process.</p></div></div></div></Reveal></div>;
}

function StatCard({ target, prefix = '', suffix, label, icon: Icon }: { target: number; prefix?: string; suffix: string; label: string; icon: LucideIcon }) {
  const { ref, value } = useCountUp(target);
  return <div ref={ref} className="group rounded-2xl border border-[#dfe6de] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="flex items-start justify-between"><span className="rounded-xl bg-[#eaf1e8] p-2.5 text-[#2e6d5d]"><Icon className="h-5 w-5" /></span><ArrowRight className="h-4 w-4 text-[#c8942e] opacity-0 transition group-hover:opacity-100" /></div><p className="mt-6 text-3xl font-extrabold tracking-tight text-[#163d3a]">{prefix}{value}{suffix}</p><p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#71837b]">{label}</p></div>;
}

function StoryCard({ title, text, icon: Icon, palette, onClick }: { title: string; text: string; icon: LucideIcon; palette: Palette; onClick: () => void }) {
  return <button onClick={onClick} className={`group text-left rounded-2xl border border-[#dfe6de] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${palette === 'gold' ? 'hover:border-[#c8942e]' : palette === 'green' ? 'hover:border-[#4c977f]' : palette === 'orange' ? 'hover:border-[#d87a38]' : 'hover:border-[#536f9b]'}`}><span className={`icon-${palette} flex h-11 w-11 items-center justify-center rounded-xl`}><Icon className="h-5 w-5" /></span><h3 className="mt-5 text-lg font-bold text-[#163d3a]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#607871]">{text}</p><span className="mt-5 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#2e6d5d] transition group-hover:gap-2">Explore <ArrowRight className="h-3.5 w-3.5" /></span></button>;
}

function MiniInsight({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return <div className="rounded-2xl border border-[#dfe6de] bg-white p-6 shadow-sm"><Icon className="h-6 w-6 text-[#c8942e]" /><h3 className="mt-4 font-bold text-[#163d3a]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#607871]">{text}</p></div>;
}

function Experience({ auditOpen, setAuditOpen }: { auditOpen: boolean; setAuditOpen: (open: boolean) => void }) {
  return <div className="space-y-6"><Reveal><SectionHeader eyebrow="Finance career timeline" title="Managing the numbers behind confident business decisions." text="Experience spanning accounts, finance operations, revenue assurance, audit, compliance, financial reporting, FP&A, and commercial support across trading and technology environments." icon={Briefcase} /></Reveal><div className="relative space-y-4 before:absolute before:bottom-0 before:left-[19px] before:top-0 before:w-px before:bg-[#d5e0d5] sm:before:left-[25px]">{experience.map((item) => <Reveal key={item.role} className="relative pl-12 sm:pl-16"><span className={`timeline-dot dot-${item.color}`} /><article className="rounded-3xl border border-[#dfe6de] bg-white p-6 shadow-sm sm:p-8"><div className="flex flex-col justify-between gap-3 md:flex-row"><div className="flex items-start gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#dfe6de] bg-[#f8faf7] p-1"><item.Logo className="h-10 w-10 object-contain" /></div><div><span className={`badge-${item.color} rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider`}>{item.color === 'gold' ? 'Finance & accounts management' : item.color === 'green' ? 'Finance leadership' : 'Audit & compliance'}</span><h3 className="mt-4 text-2xl font-extrabold tracking-tight text-[#163d3a]">{item.role}</h3><p className="mt-1 font-bold text-[#2e6d5d]">{item.company}</p></div></div><p className="text-xs font-bold uppercase tracking-wider text-[#71837b]">{item.detail}</p></div><ul className="mt-7 grid gap-3 md:grid-cols-2">{item.bullets.map((bullet) => <li key={bullet} className="flex gap-3 text-sm leading-6 text-[#607871]"><Check className="mt-1 h-4 w-4 shrink-0 text-[#c8942e]" />{bullet}</li>)}</ul>{item.clientLogo && <div className="mt-6 flex items-center gap-4 rounded-2xl border border-[#e0e8df] bg-[#f8faf7] p-4"><div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-xl border border-[#dfe6de] bg-white p-2"><item.clientLogo className="h-10 w-16 object-contain" /></div><div><p className="text-[10px] font-bold uppercase tracking-wider text-[#71837b]">Platinum Account Client</p><p className="mt-0.5 text-sm font-extrabold text-[#163d3a]">{item.clientName}</p><p className="mt-0.5 text-xs text-[#607871]">{item.clientNote} — handled during tenure at Wipro.</p></div></div>}</article></Reveal>)}</div><Reveal><button onClick={() => setAuditOpen(!auditOpen)} className="ml-12 flex w-[calc(100%-3rem)] items-center justify-between rounded-2xl border border-[#dfe6de] bg-[#edf3eb] px-5 py-4 text-left sm:ml-16 sm:w-[calc(100%-4rem)]"><span><span className="block text-xs font-bold uppercase tracking-wider text-[#2e6d5d]">Earlier audit experience</span><span className="mt-1 block text-sm font-semibold text-[#163d3a]">Audit Assistant · Statutory, internal audit & taxation</span></span><ChevronDown className={`h-5 w-5 text-[#2e6d5d] transition ${auditOpen ? 'rotate-180' : ''}`} /></button>{auditOpen && <div className="ml-12 mt-3 grid gap-3 sm:ml-16 sm:grid-cols-2"><div className="rounded-2xl border border-[#dfe6de] bg-white p-5"><p className="font-bold text-[#163d3a]">Jatin Karda & Co.</p><p className="mt-1 text-xs text-[#71837b]">Nagpur · May 2019 – Mar 2020</p><p className="mt-3 text-sm leading-6 text-[#607871]">Statutory and internal audits, accounting, taxation, general ledger review, and account finalisation.</p></div><div className="rounded-2xl border border-[#dfe6de] bg-white p-5"><p className="font-bold text-[#163d3a]">V.K. Srinivasan & Shankar</p><p className="mt-1 text-xs text-[#71837b]">Chennai · Jul 2015 – Aug 2016</p><p className="mt-3 text-sm leading-6 text-[#607871]">Statutory and internal audits, accounting, taxation, and client portfolio support.</p></div></div>}</Reveal></div>;
}

function Sales() {
  const steps = ['Market Research', 'Procurement', 'Pricing', 'Costing', 'Vendor Management', 'Supply Chain', 'Contract Review', 'Margin Control'];
  const capabilities = [
    { title: 'Deal Pricing & Optimization', detail: 'Performed deal pricing and optimized deal prices while negotiating customer delivery-linked business deals at Wipro.', icon: CircleDollarSign },
    { title: 'Contract Negotiation', detail: 'Reviewed contracts to interpret financial models and financial reporting per IFRS 15 and IFRS 16, ensuring favourable commercial terms.', icon: FileText },
    { title: 'Client Relationship Management', detail: 'Supported 160+ European accounts through the Revenue Centre of Excellence, maintaining ongoing revenue operations and reporting.', icon: Briefcase },
    { title: 'Stakeholder Collaboration', detail: 'Worked across Revenue Assurance, FP&A, and Audit teams to align deal structuring with compliance and revenue recognition rules.', icon: Target },
    { title: 'Margin & Costing Analysis', detail: 'Handled product costing and pricing at Kala SpiceX, ensuring accurate margin analysis, cost control, and profitability.', icon: BarChart3 },
    { title: 'Commercial Communication', detail: 'Presented revenue reports, month-end closures, and financial updates to leadership and cross-functional teams.', icon: TrendingUp },
  ];
  return <div className="space-y-6"><Reveal><SectionHeader eyebrow="Sales & commercial capabilities" title="Deal pricing, negotiation, and client relationships that protect margin." text="Bridging finance operations with commercial activity — from deal pricing and contract review at a global technology services firm to product costing and vendor negotiation in spice trading." icon={TrendingUp} /></Reveal><Reveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{capabilities.map(({ title, detail, icon: Icon }) => <div key={title} className="process-card group rounded-2xl border border-[#dfe6de] bg-white p-6 shadow-sm"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf1e8] text-[#2e6d5d]"><Icon className="h-5 w-5" /></span><h3 className="mt-5 text-lg font-bold text-[#163d3a]">{title}</h3><p className="mt-3 text-sm leading-6 text-[#607871]">{detail}</p></div>)}</Reveal><Reveal className="rounded-3xl bg-[#163d3a] p-7 text-white sm:p-10"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e0b64f]">Commercial finance flow</p><h3 className="mt-3 text-2xl font-extrabold sm:text-3xl">From costing to margin to decision.</h3><div className="mt-8 flex flex-wrap items-center gap-2">{steps.map((step, index) => <div key={step} className="flex items-center gap-2"><div className="rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-xs font-bold text-slate-200">{step}</div>{index < steps.length - 1 && <ArrowRight className="h-4 w-4 text-[#e0b64f]" />}</div>)}</div></Reveal><Reveal className="grid gap-4 sm:grid-cols-3"><Highlight title="160+" text="Accounts supported" icon={Briefcase} /><Highlight title="$500M" text="Monthly validations" icon={CircleDollarSign} /><Highlight title="IFRS 15/16" text="Contract review standards" icon={Check} /></Reveal></div>;
}

function Trade() {
  const products = [{ title: 'Cardamom & spice origins', image: images.cardamom, icon: Sparkles }, { title: 'Pepper, cinnamon & cloves', image: images.spices, icon: Package }, { title: 'Tea leaves & coffee', image: images.tea, icon: Coffee }, { title: 'Cashews, almonds & dry fruits', image: images.nuts, icon: ShoppingBag }];
  const stages = ['Origin', 'Sourcing', 'Quality Control', 'Procurement', 'Trading', 'Logistics', 'Wholesale', 'Retail', 'Customer'];
  return <div className="space-y-6"><Reveal><SectionHeader eyebrow="Food & spices trading" title="FROM SOURCE TO MARKET" text="A category-led perspective across spices, tea, coffee, dry fruits, FMCG, and the relationships that keep products moving with quality and consistency." icon={Package} /></Reveal><Reveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{products.map(({ title, image, icon: Icon }) => <div key={title} className="commodity-card group relative min-h-[240px] overflow-hidden rounded-3xl"><img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110" /><div className="absolute inset-0 bg-gradient-to-t from-[#102b2a] via-[#102b2a]/30 to-transparent" /><div className="relative flex h-full flex-col justify-end p-5 text-white"><Icon className="mb-auto h-5 w-5 text-[#e0b64f]" /><h3 className="text-lg font-bold">{title}</h3><p className="mt-1 text-xs text-slate-300">Sourcing · quality · market development</p></div></div>)}</Reveal><Reveal className="rounded-3xl border border-[#dfe6de] bg-white p-7 shadow-sm sm:p-10"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2e6d5d]">The trading chain</p><h3 className="mt-2 text-2xl font-extrabold text-[#163d3a]">A clear path to customer value</h3></div><Truck className="hidden h-10 w-10 text-[#c8942e] sm:block" /></div><div className="mt-8 flex flex-wrap items-center gap-2">{stages.map((stage, index) => <div key={stage} className="flex items-center gap-2"><span className="rounded-full bg-[#eaf1e8] px-4 py-2 text-xs font-bold text-[#2e6d5d]">{stage}</span>{index < stages.length - 1 && <ChevronRight className="h-4 w-4 text-[#c8942e]" />}</div>)}</div></Reveal></div>;
}

function Marketing() {
  return <div className="space-y-6"><Reveal><SectionHeader eyebrow="Marketing & digital" title="Making products discoverable, desirable, and remembered." text="Brand strategy, content, social media, and media marketing come together to create market presence that supports sales and long-term customer trust." icon={Sparkles} /></Reveal><Reveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{skills.marketing.map((item, index) => <div key={item} className="rounded-2xl border border-[#dfe6de] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#c8942e]"><div className="flex items-center justify-between"><span className="text-xs font-extrabold text-[#c8942e]">0{index + 1}</span><ArrowRight className="h-4 w-4 text-[#2e6d5d]" /></div><h3 className="mt-6 font-bold text-[#163d3a]">{item}</h3><p className="mt-2 text-xs leading-5 text-[#71837b]">Strategy · execution · measurement</p></div>)}</Reveal><Reveal className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]"><div className="rounded-3xl bg-[#c8942e] p-8 text-[#163d3a] sm:p-10"><Instagram className="h-8 w-8" /><p className="mt-8 text-6xl font-extrabold tracking-[-0.06em]">20M<span className="text-3xl">+</span></p><h3 className="mt-2 text-xl font-bold">Social media views</h3><p className="mt-4 max-w-sm text-sm leading-6 text-[#465c4d]">Views generated through brand content strategy and digital marketing for the spice trading business.</p><div className="mt-8 h-2 overflow-hidden rounded-full bg-[#163d3a]/15"><div className="h-full w-[82%] rounded-full bg-[#163d3a]" /></div><p className="mt-2 text-xs font-bold uppercase tracking-wider text-[#465c4d]">Audience momentum</p></div><div className="relative overflow-hidden rounded-3xl bg-[#163d3a] p-8 text-white sm:p-10"><img src={images.market} alt="Colorful spice market" className="absolute inset-0 h-full w-full object-cover opacity-25" /><div className="relative"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e0b64f]">Campaign mindset</p><h3 className="mt-4 max-w-lg text-3xl font-extrabold">Every campaign should answer one question: why this brand, now?</h3><div className="mt-8 grid gap-3 sm:grid-cols-3">{['Position', 'Engage', 'Convert'].map((item) => <div key={item} className="rounded-xl border border-white/10 bg-white/10 p-4 text-center text-sm font-bold">{item}</div>)}</div></div></div></Reveal></div>;
}

function Finance() {
  const financeItems = skills.finance;
  const auditItems = skills.audit;
  return <div className="space-y-6"><Reveal><SectionHeader eyebrow="Finance management" title="The analytical edge behind better business decisions." text="Finance leadership built around accurate reporting, audit discipline, revenue assurance, planning, costing, taxation, and the commercial detail needed to protect margin while supporting growth." icon={BarChart3} /></Reveal><Reveal className="grid gap-5 lg:grid-cols-[1fr_0.8fr]"><div className="rounded-3xl bg-[#0f2d43] p-7 text-white sm:p-10"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d7b45a]">Finance & accounts operations</p><h3 className="mt-3 text-2xl font-extrabold">Decision-ready finance</h3></div><BarChart3 className="h-9 w-9 text-[#d7b45a]" /></div><div className="mt-8 space-y-4"><ChartBar label="Financial reporting" width="94%" value="94" /><ChartBar label="Audit & compliance" width="88%" value="88" /><ChartBar label="Planning & forecasting" width="82%" value="82" /><ChartBar label="Taxation & GST" width="86%" value="86" /><ChartBar label="Costing & margin control" width="90%" value="90" /></div><p className="mt-8 text-xs leading-5 text-slate-400">Illustrative capability profile based on finance leadership responsibilities, not a performance score.</p></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">{financeItems.map((item, index) => <div key={item} className="flex items-center justify-between rounded-2xl border border-[#dfe6de] bg-white p-4 shadow-sm"><span className="text-sm font-bold text-[#163d3a]">{item}</span><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eaf1e8] text-xs font-bold text-[#2e6d5d]">{index + 1}</span></div>)}</div></Reveal><Reveal className="rounded-3xl border border-[#dfe6de] bg-white p-7 shadow-sm sm:p-9"><div className="flex items-center gap-3"><Check className="h-6 w-6 text-[#c8942e]" /><h3 className="text-xl font-extrabold text-[#163d3a]">Audit & compliance capabilities</h3></div><div className="mt-6 flex flex-wrap gap-2">{auditItems.map((item) => <span key={item} className="rounded-lg bg-[#edf3eb] px-3 py-2 text-sm font-semibold text-[#2e6d5d]">{item}</span>)}</div></Reveal><Reveal className="grid gap-4 sm:grid-cols-3"><Highlight title="$500M+" text="Monthly validation portfolio" icon={CircleDollarSign} /><Highlight title="160+" text="European accounts supported" icon={Briefcase} /><Highlight title="14" text="Finance team members led" icon={TrendingUp} /></Reveal></div>;
}

function ChartBar({ label, width, value }: { label: string; width: string; value: string }) {
  return <div><div className="mb-2 flex justify-between text-xs font-bold text-slate-300"><span>{label}</span><span className="text-[#d7b45a]">{value}%</span></div><div className="h-2 rounded-full bg-white/10"><div className="chart-fill h-full rounded-full bg-[#d7b45a]" style={{ width }} /></div></div>;
}

function Highlight({ title, text, icon: Icon }: { title: string; text: string; icon: LucideIcon }) {
  return <div className="rounded-2xl border border-[#dfe6de] bg-white p-5 shadow-sm"><Icon className="h-5 w-5 text-[#c8942e]" /><p className="mt-4 text-2xl font-extrabold text-[#163d3a]">{title}</p><p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#71837b]">{text}</p></div>;
}

function AiGeneralist() {
  const capabilities = [
    { title: 'AI Workflow Automation', text: 'Designing automated workflows that connect business applications, APIs, databases and AI models.', icon: Workflow },
    { title: 'AI Agents & Intelligent Systems', text: 'Building AI-assisted agents for research, data processing, monitoring, classification, reporting and decision support.', icon: Bot },
    { title: 'Finance Process Automation', text: 'Automating repetitive finance activities such as reporting, reconciliations, validation, data preparation and financial monitoring.', icon: Zap },
    { title: 'Systems & Productivity', text: 'Reducing manual work by redesigning processes, connecting tools and creating repeatable systems.', icon: Settings },
  ];
  const technologies = skills.ai;
  return <div className="space-y-6"><Reveal><SectionHeader eyebrow="AI Generalist" title="Finance & Business Automation" text="Automate, integrate, build, and optimize — combining finance domain expertise with AI, automation, and technology to improve how financial work is performed." icon={Cpu} /></Reveal><Reveal className="rounded-3xl bg-[#0f2d43] p-7 text-white sm:p-10"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d7b45a]">AI & automation capabilities</p><h3 className="mt-3 text-2xl font-extrabold">From process to system</h3></div><Cpu className="h-9 w-9 text-[#d7b45a]" /></div><div className="mt-8 space-y-4"><ChartBar label="AI workflow automation" width="88%" value="88" /><ChartBar label="AI agents & intelligent systems" width="82%" value="82" /><ChartBar label="Finance process automation" width="90%" value="90" /><ChartBar label="Systems & productivity" width="85%" value="85" /></div><p className="mt-8 text-xs leading-5 text-slate-400">Illustrative capability profile based on AI & automation project work, not a performance score.</p></Reveal><Reveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{capabilities.map(({ title, text, icon: Icon }) => <div key={title} className="group rounded-2xl border border-[#dfe6de] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:border-[#c8942e]"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf1e8] text-[#2e6d5d]"><Icon className="h-5 w-5" /></span><h3 className="mt-5 text-lg font-bold text-[#163d3a]">{title}</h3><p className="mt-3 text-sm leading-6 text-[#607871]">{text}</p></div>)}</Reveal><Reveal className="rounded-3xl border border-[#dfe6de] bg-white p-7 shadow-sm sm:p-9"><div className="flex items-center gap-3"><Zap className="h-6 w-6 text-[#c8942e]" /><h3 className="text-xl font-extrabold text-[#163d3a]">AI, automation & technology toolkit</h3></div><div className="mt-6 flex flex-wrap gap-2">{technologies.map((item) => <span key={item} className="rounded-lg bg-[#edf3eb] px-3 py-2 text-sm font-semibold text-[#2e6d5d]">{item}</span>)}</div></Reveal><Reveal className="grid gap-4 sm:grid-cols-3"><Highlight title="3+" text="Automation & AI projects built" icon={Cpu} /><Highlight title="10+" text="AI & automation technologies" icon={Workflow} /><Highlight title="24/7" text="Automated alerts & monitoring" icon={Zap} /></Reveal></div>;
}

function GlobalTrade() {
  return <div className="space-y-6"><Reveal><SectionHeader eyebrow="Global trade" title="FROM ORIGINS TO OPPORTUNITIES" text="A visual representation of how food commodities connect markets: India, the Middle East, GCC, and international markets. The routes are a creative expression of global commerce, not a claim of confirmed trading lanes." icon={Globe2} /></Reveal><Reveal className="relative min-h-[440px] overflow-hidden rounded-[2rem] bg-[#102e43] p-7 text-white sm:p-10"><div className="trade-grid absolute inset-0 opacity-40" /><div className="world-shape absolute left-[8%] top-[18%] h-[220px] w-[80%] rounded-[50%] border border-[#6e9e9b]/30 opacity-50" /><div className="world-shape world-shape-two absolute left-[17%] top-[30%] h-[140px] w-[60%] rounded-[50%] border border-[#6e9e9b]/20 opacity-50" /><div className="trade-route trade-route-a" /><div className="trade-route trade-route-b" /><div className="trade-route trade-route-c" /><div className="relative z-10 flex h-full min-h-[380px] flex-col justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d7b45a]">India → Middle East → GCC → International Markets</p><h3 className="mt-5 max-w-xl text-4xl font-extrabold tracking-[-0.04em] sm:text-6xl">Sourcing.<br /><span className="text-[#d7b45a]">Trading.</span><br />Expanding.</h3></div><div className="grid gap-3 sm:grid-cols-4"><TradeNode icon={Ship} label="Ports & cargo" /><TradeNode icon={Plane} label="Air freight" /><TradeNode icon={Package} label="Commodities" /><TradeNode icon={Globe2} label="Global markets" /></div></div></Reveal><Reveal className="grid gap-4 sm:grid-cols-3"><MiniInsight icon={MapPin} title="Origin" text="Understanding product, quality, seasonality, and the people behind supply." /><MiniInsight icon={Truck} title="Movement" text="Sourcing, procurement, logistics, and distribution aligned to demand." /><MiniInsight icon={Globe2} title="Opportunity" text="Partnerships and market expansion shaped by a global perspective." /></Reveal></div>;
}

function TradeNode({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-3 text-sm font-semibold"><Icon className="h-5 w-5 text-[#d7b45a]" />{label}</div>;
}

function Social() {
  const cards = [{ title: 'Kala SpiceX — Instagram', text: 'Brand building, product storytelling, and market-facing content.', href: links.kalaInstagram, label: 'View Instagram Work', icon: Instagram, image: images.cardamom }, { title: 'Kala SpiceX — Facebook', text: 'Community-led communication and digital brand presence.', href: links.kalaFacebook, label: 'View Facebook Work', icon: Facebook, image: images.spices }, { title: 'Markets with Abhi — Instagram', text: 'Market insights and a personal lens on business and finance.', href: links.marketsInstagram, label: 'View Instagram Work', icon: Instagram, image: images.coffee }];
  return <div className="space-y-6"><Reveal><SectionHeader eyebrow="Social media works" title="A digital portfolio for brands, markets, and ideas." text="Explore the public-facing work across brand platforms and market insights. No invented metrics — just the work, the channels, and the stories." icon={Instagram} /></Reveal><Reveal className="grid gap-5 lg:grid-cols-3">{cards.map((card) => <a key={card.title} href={card.href} target="_blank" rel="noopener noreferrer" className="group overflow-hidden rounded-3xl border border-[#dfe6de] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><div className="relative h-52 overflow-hidden"><img src={card.image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" /><div className="absolute inset-0 bg-[#163d3a]/35" /><div className="absolute left-5 top-5 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#163d3a]"><card.icon className="h-5 w-5" /></div></div><div className="p-6"><h3 className="text-lg font-extrabold text-[#163d3a]">{card.title}</h3><p className="mt-2 text-sm leading-6 text-[#607871]">{card.text}</p><span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2e6d5d]">{card.label} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span></div></a>)}</Reveal></div>;
}

function Projects() {
  const projects = [
    { title: 'AI Job-Search Agent', tools: 'n8n · GitHub Actions · Python · Telegram Bot API · Google Jobs API', detail: 'Built an automated system that searches UAE job listings daily and scores each role against a CV using ATS-style keyword matching. Enriched shortlisted roles with public company data, delivered real-time Telegram alerts, and added scheduled cloud runs with duplicate detection and API-usage controls.', icon: Target },
    { title: 'Finance Automation Workflows', tools: 'n8n · Docker · REST APIs', detail: 'Built and self-hosted automated workflows for exchange-rate tracking and alerts.', icon: TrendingUp },
    { title: 'Cardamom Market Intelligence Dashboard', tools: 'TradingView · React · Financial analytics', detail: 'Built a market dashboard for cardamom traders and auction market analysts with candlestick, area, and line charts across 1D to 5Y timeframes; technical indicators including SMA, EMA, Bollinger Bands, RSI, and MACD; plus auction lot, supply-demand, and net-flow analysis.', icon: BarChart3, link: links.masalewala },
    { title: 'Kala SpiceX: Brand Building & Social Media', tools: 'Branding · Content strategy · Digital marketing', detail: 'Built the brand’s social media presence to 20M+ views through content strategy and digital marketing, while driving brand awareness and customer reach for the spice trading business.', icon: Sparkles, link: links.kalaInstagram },
    { title: 'Job Search Bot for Accounts & Finance', tools: 'Telegram Bot · Automated job alerts · Accounting & finance roles', detail: 'A Telegram channel delivering automated, targeted job alerts for accounts and finance positions. Each posting is filtered for relevance to accounting, audit, finance, and compliance roles so job seekers receive only the right opportunities.', icon: Briefcase, link: 'https://web.telegram.org/a/#-1004296140869' },
    { title: 'JobMatch — Job Search Website', tools: 'Web platform · Job matching · Bolt', detail: 'A website built for job search, helping candidates discover and match with relevant roles. Designed and deployed as a practical tool connecting job seekers with the right opportunities.', icon: Globe2, link: 'https://jobmatch.bolt.host' },
    { title: "Abhi's Job Reference Community", tools: 'Supabase · Google Sheets · Gemini AI · ATS CV checker · Member portal', detail: 'A community platform for finance and accounting professionals to join a job referral and reference pool. Features a CV auto-fill member sign-up form, a free ATS CV checker powered by Gemini AI that scores resumes and suggests best-fit roles, and automated submission forwarding to Google Sheets for tracking.', icon: Users },
  ];
  const telegramChannels = [
    { name: 'Accounting | Finance | Audit JOBS UAE', handle: '@abhijithkjayanuaejobs', url: 'https://t.me/abhijithkjayanuaejobs', detail: 'Automated job alerts filtered for accounting, finance, and audit roles across the UAE.' },
    { name: 'ALL JOBS UAE', handle: '@jobsinuaeabhi', url: 'https://t.me/jobsinuaeabhi', detail: 'General UAE job alerts covering all industries and role types.' },
    { name: 'KALASPICEX PRICE LIST', handle: '@kalaspices', url: 'https://t.me/kalaspices', detail: 'Live spice price lists and product updates for Kala SpiceX wholesale trading.' },
  ];
  return <div className="space-y-6"><Reveal><SectionHeader eyebrow="Projects" title="Finance, automation, analytics, and market-facing work." text="Selected projects spanning AI job-search automation, finance workflows, commodity analytics, brand growth, and a job-matching platform." icon={Briefcase} /></Reveal><Reveal className="grid gap-5 md:grid-cols-2">{projects.map(({ title, tools, detail, icon: Icon, link }) => <article key={title} className="group rounded-3xl border border-[#dfe6de] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-[#c8942e] hover:shadow-xl"><div className="flex items-start justify-between gap-4"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf1e8] text-[#2e6d5d]"><Icon className="h-5 w-5" /></span>{link && <a href={link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#2e6d5d] hover:text-[#c8942e]">View <ArrowRight className="h-3.5 w-3.5" /></a>}</div><h3 className="mt-6 text-xl font-extrabold text-[#163d3a]">{title}</h3><p className="mt-2 text-xs font-bold uppercase tracking-wider text-[#c8942e]">{tools}</p><p className="mt-4 text-sm leading-6 text-[#607871]">{detail}</p></article>)}</Reveal><Reveal><div className="flex items-center gap-3"><Send className="h-6 w-6 text-[#c8942e]" /><div><h3 className="text-xl font-extrabold text-[#163d3a]">Telegram Channels</h3><p className="text-xs font-bold uppercase tracking-wider text-[#2e6d5d]">Automated alerts & business channels</p></div></div><div className="mt-6 grid gap-4 sm:grid-cols-3">{telegramChannels.map(({ name, handle, url, detail }) => <a key={handle} href={url} target="_blank" rel="noopener noreferrer" className="group rounded-2xl border border-[#dfe6de] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#c8942e] hover:shadow-lg"><div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf1e8] text-[#2e6d5d]"><Send className="h-5 w-5" /></span><div><p className="text-sm font-extrabold text-[#163d3a]">{name}</p><p className="mt-0.5 text-xs font-bold text-[#c8942e]">{handle}</p></div></div><p className="mt-4 text-sm leading-6 text-[#607871]">{detail}</p><span className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#2e6d5d] transition group-hover:gap-2">Open channel <ArrowRight className="h-3.5 w-3.5" /></span></a>)}</div></Reveal></div>;
}

function Education() {
  const credentials = [{ title: 'MBA — Finance Management', org: 'DY Patil Vidyapeeth University, Pune', date: 'Jan 2023 – Dec 2025', icon: Award, Logo: DPYLogo }, { title: 'B.Com — Accounting & Finance', org: 'Indira Gandhi Open University, Nagpur', date: 'Apr 2018 – Jan 2021', icon: WalletCards, Logo: IGNOULogo }, { title: 'CA Final — Chartered Accountancy', org: 'Institute of Chartered Accountants of India', date: 'Nov 2017 – Present', icon: BarChart3, Logo: ICAILogo }];
  const certifications = ['ICAI Orientation Programme', 'Information Technology Training', 'General Management & Communication Skills', 'Advanced Management & Communication Skills', 'Advanced Management & Communication Skills Examination', 'Microsoft Excel 2013 Certification', 'Microsoft Power BI', 'Microsoft Outlook 2013', 'Microsoft Word 2013 Certification', 'Stock Market Trading'];
  return <div className="space-y-6"><Reveal><SectionHeader eyebrow="Education & certifications" title="Credentials built for finance management and control." text="MBA Finance Management, B.Com Accounting & Finance, and Chartered Accountancy studies supported by certifications in Excel, Power BI, Outlook, Word, stock market trading, and ICAI training." icon={Award} /></Reveal><Reveal className="grid gap-4 lg:grid-cols-3">{credentials.map(({ title, org, date, icon: Icon, Logo }) => <div key={title} className="group rounded-3xl border border-[#dfe6de] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="flex items-start justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf1e8] text-[#2e6d5d]"><Icon className="h-5 w-5" /></span><div className="opacity-80 transition group-hover:scale-110 group-hover:opacity-100"><Logo className="h-16 w-28 object-contain" /></div></div><h3 className="mt-7 text-xl font-extrabold text-[#163d3a]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#2e6d5d]">{org}</p><p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#71837b]">{date}</p></div>)}</Reveal><Reveal className="rounded-3xl border border-[#dfe6de] bg-white p-7 shadow-sm sm:p-9"><div className="flex items-center gap-3"><Languages className="h-6 w-6 text-[#c8942e]" /><h3 className="text-xl font-extrabold text-[#163d3a]">Certifications & training</h3></div><div className="mt-6 flex flex-wrap gap-2">{certifications.map((item) => <span key={item} className="rounded-lg bg-[#edf3eb] px-3 py-2 text-sm font-semibold text-[#2e6d5d]">{item}</span>)}</div></Reveal></div>;
}

function Skills() {
  const groups: { title: string; items: string[]; icon: LucideIcon; palette: Palette }[] = [{ title: 'Finance Management', items: skills.finance, icon: BarChart3, palette: 'navy' }, { title: 'AI & Finance Automation', items: skills.ai, icon: Sparkles, palette: 'gold' }, { title: 'Audit & Compliance', items: skills.audit, icon: Check, palette: 'cream' }, { title: 'Reporting Standards & Analysis', items: skills.reporting, icon: BarChart3, palette: 'orange' }, { title: 'Executive & Analytical Skills', items: skills.leadership, icon: Target, palette: 'green' }, { title: 'Tools & Systems', items: skills.tools, icon: WalletCards, palette: 'gold' }, { title: 'Business & Operations Support', items: skills.trade, icon: Package, palette: 'orange' }, { title: 'Commercial Finance Support', items: skills.sales, icon: TrendingUp, palette: 'gold' }, { title: 'Supporting Brand & Digital', items: skills.marketing, icon: Sparkles, palette: 'green' }];
  const toolkitLogos: { Component: FC<{ className?: string }>; name: string; category: string }[] = [{ Component: TallyLogo, name: 'Tally', category: 'Accounting' }, { Component: ExcelLogo, name: 'Excel', category: 'Analytics' }, { Component: PowerBILogo, name: 'Power BI', category: 'Business Intelligence' }, { Component: MSOfficeLogo, name: 'MS Office', category: 'Productivity' }];
  return <div className="space-y-6"><Reveal><SectionHeader eyebrow="Skills & tools" title="The capabilities behind the outcomes." text="Hover-friendly skill groups make it easy to scan the full toolkit across finance management, audit, compliance, commercial support, operations, and technology." icon={Target} /></Reveal><Reveal className="rounded-3xl border border-[#dfe6de] bg-gradient-to-br from-[#f8faf7] to-[#eaf1e8] p-7 shadow-sm sm:p-9"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#163d3a] text-[#e0b64f]"><WalletCards className="h-5 w-5" /></span><div><h3 className="text-lg font-extrabold text-[#163d3a]">Professional Toolkit</h3><p className="text-xs font-bold uppercase tracking-wider text-[#2e6d5d]">The software and tools behind the work</p></div></div><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{toolkitLogos.map(({ Component, name, category }) => <div key={name} className="toolkit-card group flex flex-col items-center justify-center gap-3 rounded-2xl border border-[#dfe6de] bg-white p-6 shadow-sm transition hover:-translate-y-1.5 hover:border-[#c8942e] hover:shadow-xl"><div className="transition group-hover:scale-110"><Component className="h-24 w-40 object-contain" /></div><p className="text-sm font-extrabold text-[#163d3a]">{name}</p><p className="text-[10px] font-bold uppercase tracking-wider text-[#71837b]">{category}</p></div>)}</div></Reveal><Reveal className="grid gap-4 md:grid-cols-2"><div className="grid gap-4 sm:grid-cols-2">{groups.slice(0, 4).map((group) => <SkillGroup key={group.title} {...group} />)}</div><div className="grid gap-4 sm:grid-cols-2">{groups.slice(4).map((group) => <SkillGroup key={group.title} {...group} />)}</div></Reveal></div>;
}

function SkillGroup({ title, items, icon: Icon, palette }: { title: string; items: string[]; icon: LucideIcon; palette: Palette }) {
  return <div className="group rounded-3xl border border-[#dfe6de] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="flex items-center gap-3"><span className={`icon-${palette} flex h-10 w-10 items-center justify-center rounded-xl`}><Icon className="h-5 w-5" /></span><h3 className="text-base font-extrabold text-[#163d3a]">{title}</h3></div><div className="mt-5 flex flex-wrap gap-2">{items.map((item) => <span key={item} className="rounded-lg border border-[#e0e8df] bg-[#f8faf7] px-2.5 py-1.5 text-xs font-semibold text-[#607871] transition group-hover:border-[#cbd9cb] group-hover:text-[#2e6d5d]">{item}</span>)}</div></div>;
}

function Contact({ onContact, onViewCv }: { onContact: () => void; onViewCv: () => void }) {
  return <div className="space-y-6"><Reveal><section className="relative overflow-hidden rounded-[2rem] bg-[#163d3a] p-8 text-white sm:p-14"><div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-[#d7b45a]/20" /><div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full border border-[#d7b45a]/10" /><div className="relative"><SectionHeader dark eyebrow="Dubai, UAE" title="LET’S BUILD BETTER FINANCE TOGETHER" text="For finance management, accounts, audit, compliance, reporting, or commercial finance opportunities, I’d be glad to connect." icon={Send} /><div className="mt-10 flex flex-wrap gap-3"><SocialButton href={links.linkedin} label="Connect on LinkedIn" icon={Linkedin} external /><SocialButton href={links.email} label="Send Email" icon={Mail} /><SocialButton href={links.phone} label="Call Me" icon={Phone} /><SocialButton href={links.whatsapp} label="WhatsApp Me" icon={MessageCircle} external /><button onClick={onViewCv} className="inline-flex items-center gap-2 rounded-xl bg-[#d7b45a] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#163d3a] transition hover:bg-[#ebd18d]"><Eye className="h-4 w-4" /> View My CV</button></div></div></section></Reveal><Reveal className="grid gap-4 sm:grid-cols-3"><ContactCard icon={Mail} label="Email" value="cabhijithkjayan@gmail.com" href={links.email} /><ContactCard icon={Phone} label="UAE Phone" value="+971 50 609 5345" href={links.phone} /><ContactCard icon={MessageCircle} label="WhatsApp" value="+971 506095345" href={links.whatsapp} /></Reveal><Reveal><button onClick={onContact} className="flex w-full items-center justify-between rounded-2xl border border-[#dfe6de] bg-white p-5 text-left shadow-sm transition hover:border-[#c8942e]"><span><span className="block text-xs font-bold uppercase tracking-wider text-[#2e6d5d]">Prefer a message?</span><span className="mt-1 block font-bold text-[#163d3a]">Open the contact form</span></span><ArrowRight className="h-5 w-5 text-[#c8942e]" /></button></Reveal></div>;
}

function ContactCard({ icon: Icon, label, value, href }: { icon: LucideIcon; label: string; value: string; href: string }) {
  return <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} className="rounded-2xl border border-[#dfe6de] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#c8942e]"><Icon className="h-5 w-5 text-[#c8942e]" /><p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#71837b]">{label}</p><p className="mt-1 break-all text-sm font-bold text-[#163d3a]">{value}</p></a>;
}

function Footer({ onContact, onNavigate, onViewCv }: { onContact: () => void; onNavigate: (id: TabId) => void; onViewCv: () => void }) {
  return <footer className="bg-[#0f2929] text-white"><div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-10"><div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="text-2xl font-extrabold tracking-tight">ABHIJITH K JAYAN</p><p className="mt-2 text-sm text-slate-300">Finance, AI & Automation | Building Smarter Finance Systems</p><p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#d7b45a]">Automate · Integrate · Build · Optimize</p></div><div className="flex flex-wrap gap-2"><FooterIcon href={links.linkedin} icon={Linkedin} label="LinkedIn" external /><FooterIcon href={links.email} icon={Mail} label="Email" /><FooterIcon href={links.phone} icon={Phone} label="Phone" /><FooterIcon href={links.whatsapp} icon={MessageCircle} label="WhatsApp" external /><FooterIcon href={links.kalaInstagram} icon={Instagram} label="Instagram" external /><FooterIcon href={links.kalaFacebook} icon={Facebook} label="Facebook" external /><button onClick={() => onNavigate('projects')} aria-label="Projects" className="footer-icon"><Briefcase className="h-4 w-4" /></button><button onClick={onContact} className="ml-1 rounded-lg bg-[#d7b45a] px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#163d3a]">Contact</button></div></div><div className="mt-10 border-t border-white/10 pt-5 text-xs text-slate-500"><span>© 2026 Abhijith K Jayan</span><button onClick={onViewCv} className="ml-5 transition hover:text-[#d7b45a]">View CV</button></div></div></footer>;
}

function FooterIcon({ href, icon: Icon, label, external = false }: { href: string; icon: LucideIcon; label: string; external?: boolean }) {
  return <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} aria-label={label} className="footer-icon"><Icon className="h-4 w-4" /></a>;
}

function LanguagesSection() {
  const languages = [
    { name: 'Hindi', level: 'Listed in CV', detail: 'Language included in the updated professional profile.', icon: Languages },
    { name: 'Tamil', level: 'Listed in CV', detail: 'Language included in the updated professional profile.', icon: Languages },
    { name: 'Malayalam', level: 'Listed in CV', detail: 'Language included in the updated professional profile.', icon: Languages },
    { name: 'English', level: 'Listed in CV', detail: 'Language included in the updated professional profile.', icon: Globe2 },
  ];
  return <div className="space-y-6"><Reveal><SectionHeader eyebrow="Languages" title="Communicating across markets and teams." text="Multilingual capability shaped by work across Indian and UAE/GCC business environments." icon={Languages} /></Reveal><Reveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{languages.map(({ name, level, detail, icon: Icon }) => <div key={name} className="group rounded-3xl border border-[#dfe6de] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf1e8] text-[#2e6d5d]"><Icon className="h-5 w-5" /></span><h3 className="mt-5 text-xl font-extrabold text-[#163d3a]">{name}</h3><p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#c8942e]">{level}</p><p className="mt-3 text-sm leading-6 text-[#607871]">{detail}</p></div>)}</Reveal></div>;
}

function CvViewer({ onClose }: { onClose: () => void }) {
  return <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0f2929]/80 p-4 backdrop-blur-sm" onClick={onClose}><div className="flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}><div className="flex items-center justify-between border-b border-[#dfe6de] bg-[#f7f8f5] px-5 py-3"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#163d3a] text-[#e0b64f]"><FileText className="h-4 w-4" /></div><div><p className="text-sm font-extrabold text-[#163d3a]">Abhijith K Jayan — CV</p><p className="text-[10px] font-bold uppercase tracking-wider text-[#71837b]">Finance Management</p></div></div><div className="flex items-center gap-2"><a href={links.cv} download="Abhijith_K_Jayan_AFAM.pdf" className="inline-flex items-center gap-2 rounded-xl bg-[#c8942e] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#163d3a] transition hover:bg-[#e0b64f]"><Download className="h-4 w-4" /> Download</a><button onClick={onClose} className="rounded-lg p-2.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600" aria-label="Close CV viewer"><X className="h-5 w-5" /></button></div></div><div className="flex-1 overflow-hidden bg-[#f0f0f0]"><iframe src={`${links.cv}#toolbar=1&navpanes=0&view=FitH`} title="Abhijith K Jayan CV" className="h-full w-full border-0" /></div></div></div>;
}

function ContactModal({ onClose }: { onClose: () => void }) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.location.href = links.email;
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f2929]/70 p-4 backdrop-blur-sm"><div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2e6d5d]">Start a conversation</p><h2 className="mt-2 text-2xl font-extrabold text-[#163d3a]">Let’s connect</h2></div><button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label="Close contact form"><X className="h-5 w-5" /></button></div><form onSubmit={handleSubmit} className="mt-6 space-y-4"><input required type="text" placeholder="Your name" className="field" /><input required type="email" placeholder="Your email" className="field" /><textarea required rows={4} placeholder="How can we work together?" className="field resize-none" /><button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#163d3a] px-4 py-3 text-sm font-bold text-white hover:bg-[#2e6d5d]"><Send className="h-4 w-4" /> Continue by email</button></form></div></div>;
}

export default App;
