import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  FileText,
  Globe2,
  Package,
  Ship,
  Plane,
  Anchor,
  Scale,
  BookOpen,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type ResourceTopic = {
  id: string;
  title: string;
  icon: LucideIcon;
  summary: string;
};

type ResourceCategory = {
  id: string;
  title: string;
  icon: LucideIcon;
  summary: string;
  topics: ResourceTopic[];
};

type View =
  | { level: 'categories' }
  | { level: 'topics'; categoryId: string }
  | { level: 'detail'; categoryId: string; topicId: string };

const categories: ResourceCategory[] = [
  {
    id: 'import-export',
    title: 'Import & Export',
    icon: Package,
    summary: 'Shipping documents, customs, trade terms, and export procedures.',
    topics: [
      { id: 'bill-of-lading', title: 'Bill of Lading', icon: Ship, summary: 'The exporter\u2019s most important shipping document \u2014 title, receipt, and contract in one.' },
      { id: 'airway-bill', title: 'Airway Bill', icon: Plane, summary: 'The air-freight equivalent of a B/L \u2014 not a document of title.' },
      { id: 'letter-of-credit', title: 'Letter of Credit', icon: FileText, summary: 'Bank-guaranteed payment instrument used in international trade.' },
      { id: 'customs-clearance', title: 'Customs Clearance', icon: Scale, summary: 'Documentation and procedures for clearing goods through ports.' },
    ],
  },
  {
    id: 'trade-finance',
    title: 'Trade Finance',
    icon: Globe2,
    summary: 'Payment instruments, risk mitigation, and financing options for international trade.',
    topics: [
      { id: 'lc-types', title: 'Types of Letter of Credit', icon: FileText, summary: 'Revocable, irrevocable, confirmed, transferable, back-to-back.' },
      { id: 'forfeiting', title: 'Forfeiting', icon: Anchor, summary: 'Discounting export receivables without recourse.' },
      { id: 'ecgc', title: 'ECGC & Export Credit', icon: Scale, summary: 'Export credit insurance and guarantees.' },
    ],
  },
  {
    id: 'shipping-logistics',
    title: 'Shipping & Logistics',
    icon: Ship,
    summary: 'Freight types, containerization, Incoterms, and multimodal transport.',
    topics: [
      { id: 'incoterms', title: 'Incoterms 2020', icon: Globe2, summary: 'EXW, FOB, CIF, DDP and the allocation of risk and cost.' },
      { id: 'containerization', title: 'Containerization', icon: Package, summary: 'FCL, LCL, container types, and standardization.' },
      { id: 'freight-types', title: 'Freight Types', icon: Ship, summary: 'Ocean, air, road, rail, and multimodal freight.' },
    ],
  },
];

function findCategory(id: string) {
  return categories.find((c) => c.id === id);
}



export default function Resources() {
  const [view, setView] = useState<View>({ level: 'categories' });

  const goCategories = () => setView({ level: 'categories' });
  const goTopics = (categoryId: string) => setView({ level: 'topics', categoryId });
  const goDetail = (categoryId: string, topicId: string) =>
    setView({ level: 'detail', categoryId, topicId });

  if (view.level === 'detail') {
    return (
      <BillOfLadingView
        onBack={goCategories}
        onTopics={() => goTopics(view.categoryId)}
      />
    );
  }

  if (view.level === 'topics') {
    const cat = findCategory(view.categoryId);
    if (!cat) return null;
    return (
      <div className="space-y-8">
        <Breadcrumb onBack={goCategories} trail={[cat.title]} />
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#2e6d5d]">
            {cat.title}
          </p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-[-0.04em] text-[#163d3a] sm:text-5xl">
            Choose a topic
          </h2>
          <p className="mt-4 text-base leading-7 text-[#607871]">{cat.summary}</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cat.topics.map((topic, i) => (
            <button
              key={topic.id}
              onClick={() => goDetail(view.categoryId, topic.id)}
              className="group rounded-3xl border border-[#dfe6de] bg-white p-7 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#c8942e] hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf1e8] text-[#2e6d5d] transition group-hover:bg-[#c8942e] group-hover:text-white">
                  <topic.icon className="h-6 w-6" />
                </span>
                <span className="text-xs font-extrabold text-[#c8942e]">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="mt-6 text-xl font-extrabold text-[#163d3a]">
                {topic.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#607871]">{topic.summary}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#2e6d5d] transition group-hover:gap-2">
                Read more <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#2e6d5d]">
          Knowledge library
        </p>
        <h2 className="mt-3 text-4xl font-extrabold tracking-[-0.04em] text-[#163d3a] sm:text-5xl">
          Resources
        </h2>
        <p className="mt-4 text-base leading-7 text-[#607871]">
          A curated reference library on import-export documentation, trade finance,
          and shipping logistics. Pick a category, then drill into any topic for a
          detailed breakdown.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat, i) => (
          <button
            key={cat.id}
            onClick={() => goTopics(cat.id)}
            className="group rounded-3xl border border-[#dfe6de] bg-white p-7 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#c8942e] hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf1e8] text-[#2e6d5d] transition group-hover:bg-[#c8942e] group-hover:text-white">
                <cat.icon className="h-6 w-6" />
              </span>
              <span className="text-xs font-extrabold text-[#c8942e]">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
            <h3 className="mt-6 text-xl font-extrabold text-[#163d3a]">{cat.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#607871]">{cat.summary}</p>
            <div className="mt-5 flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#71837b]">
                {cat.topics.length} topics
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#2e6d5d] transition group-hover:gap-2">
                Explore <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Breadcrumb({ onBack, trail }: { onBack: () => void; trail: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1 text-[#2e6d5d] transition hover:text-[#c8942e]"
      >
        <ArrowLeft className="h-4 w-4" /> Resources
      </button>
      {trail.map((label) => (
        <span key={label} className="flex items-center gap-2">
          <ChevronRight className="h-3.5 w-3.5 text-[#c8942e]" />
          <span className="text-[#607871]">{label}</span>
        </span>
      ))}
    </div>
  );
}

/* ---------- Bill of Lading detail page ---------- */

type BlType = { name: string; meaning: string };
const blTypes: BlType[] = [
  { name: 'Received for Shipment B/L', meaning: 'Goods handed to shipping company but not yet loaded on board.' },
  { name: 'On Board Shipped B/L', meaning: 'Shipping company certifies cargo is actually loaded.' },
  { name: 'Clean B/L', meaning: 'No defect noted in goods/packaging at receipt \u2014 what banks require for negotiation.' },
  { name: 'Claused / Dirty B/L', meaning: 'Carries a remark noting defective condition (e.g., \u201cpackage broken\u201d) \u2014 limits carrier liability, rejected by banks.' },
  { name: 'Transshipment / Through B/L', meaning: 'Journey uses multiple transport modes/vessels, with transshipment en route.' },
  { name: 'Stale B/L', meaning: 'Presented to the bank too late (beyond ~21 days from shipment) \u2014 banks won\u2019t accept it.' },
  { name: 'To Order B/L', meaning: 'Issued to the order of a specified person.' },
  { name: 'Charter Party B/L', meaning: 'Covers shipment on a chartered vessel.' },
  { name: 'Freight Paid B/L', meaning: 'Marked \u201cFreight Paid\u201d \u2014 shipper already paid.' },
  { name: 'Freight Collect B/L', meaning: 'Freight to be collected at destination.' },
];

const blContents = [
  "Shipper's name & address",
  'Vessel name',
  'Port of loading',
  'Loading date',
  'Port of discharge / delivery place',
  'Quantity, quality & marks',
  'Number of packages',
  'Freight paid / payable',
  'Number of originals issued',
  'Shipping company name',
  'Voyage number / date',
  'Signature of issuing authority',
];

function BillOfLadingView({ onBack, onTopics }: { onBack: () => void; onTopics: () => void }) {
  return (
    <div className="space-y-10">
      <Breadcrumb onBack={onBack} trail={['Import & Export', 'Bill of Lading']} />

      {/* Hero */}
      <div className="relative overflow-hidden rounded-[2rem] bg-[#163d3a] p-8 text-white sm:p-12">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full border border-[#d7b45a]/20" />
        <div className="absolute -bottom-20 -left-12 h-56 w-56 rounded-full border border-[#d7b45a]/10" />
        <Ship className="absolute right-8 bottom-8 h-32 w-32 text-[#d7b45a]/10" />
        <div className="relative max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#e0b64f]">
            Import &amp; Export 
          </p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-[-0.04em] sm:text-6xl">
            Bill of Lading
          </h2>
          <p className="mt-5 text-base leading-7 text-slate-200">
            A document issued by the shipping company (or its agent) acknowledging
            receipt of cargo on board, and an undertaking to deliver it in the same
            order/condition to the consignee against freight due. It is the
            exporter\u2019s most important shipping document because it constitutes a
            document of title to the goods.
          </p>
        </div>
      </div>

      {/* Three purposes */}
      <div className="grid gap-5 sm:grid-cols-3">
        {[
          { icon: FileText, title: 'Document of Title', text: 'Confirms ownership of the goods described.' },
          { icon: Check, title: 'Receipt', text: 'Issued by the shipping company upon receiving cargo.' },
          { icon: BookOpen, title: 'Contract of Carriage', text: 'Evidences the agreement to transport goods.' },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-[#dfe6de] bg-white p-6 shadow-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf1e8] text-[#2e6d5d]">
              <item.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-5 text-lg font-bold text-[#163d3a]">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#607871]">{item.text}</p>
          </div>
        ))}
      </div>

      {/* Form note */}
      <div className="rounded-2xl border border-[#dfe6de] bg-[#edf3eb] p-6">
        <p className="text-sm leading-7 text-[#2e6d5d]">
          <span className="font-extrabold text-[#163d3a]">Form:</span> Made in a signed
          set of 2 originals \u2014 any one gives title. Non-negotiable (unsigned) copies
          are also issued for record purposes only.
        </p>
      </div>

      {/* Types table */}
      <div className="overflow-hidden rounded-3xl border border-[#dfe6de] bg-white shadow-sm">
        <div className="border-b border-[#dfe6de] bg-[#f7f8f5] px-6 py-4">
          <h3 className="text-xl font-extrabold text-[#163d3a]">
            Types of Bill of Lading
          </h3>
          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#71837b]">
            10 named types
          </p>
        </div>
        <div className="divide-y divide-[#eef2ed]">
          {blTypes.map((row, i) => (
            <div
              key={row.name}
              className="flex flex-col gap-1 px-6 py-4 transition hover:bg-[#f7f8f5] sm:flex-row sm:items-start sm:gap-5"
            >
              <span className="shrink-0 text-xs font-extrabold text-[#c8942e] sm:w-8 sm:pt-1">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="w-full font-bold text-[#163d3a] sm:max-w-[280px] sm:shrink-0">
                {row.name}
              </span>
              <span className="text-sm leading-6 text-[#607871]">{row.meaning}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Importer preference callout */}
      <div className="rounded-2xl bg-[#c8942e] p-6 text-[#163d3a]">
        <p className="text-sm font-bold leading-7">
          Importers generally prefer a <span className="font-extrabold">\u201cclean on-board shipped\u201d</span> B/L
          that prohibits transshipment (to avoid transit damage/delay).
        </p>
      </div>

      {/* Key mechanics */}
      <div className="rounded-3xl border border-[#dfe6de] bg-white p-7 shadow-sm sm:p-9">
        <h3 className="text-xl font-extrabold text-[#163d3a]">Key mechanics</h3>
        <div className="mt-6 space-y-4">
          {[
            {
              title: 'Transferable but not negotiable',
              text: 'Lets the exporter get paid via the bank before the goods arrive, and lets the importer resell before arrival too.',
            },
            {
              title: 'Three parties named on the B/L',
              text: 'Shipper (consignor), Consignee (or \u201cto order of\u201d), and Notifying Party (informed on arrival).',
            },
            {
              title: 'Directly to a named consignee',
              text: 'The exporter loses the right to redirect title \u2014 used only when advance payment or an irrevocable L/C is already in place.',
            },
            {
              title: 'To his own order',
              text: 'Normally the exporter takes the B/L \u201cto his own order\u201d and endorses it to the bank at negotiation, protecting his interest until paid.',
            },
            {
              title: 'Claims',
              text: 'Whoever holds the negotiable copy (importer after payment, or exporter if unpaid) can claim against the shipping company for non-delivery, short delivery, or damage.',
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-4">
              <Check className="mt-1 h-5 w-5 shrink-0 text-[#c8942e]" />
              <div>
                <p className="font-bold text-[#163d3a]">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-[#607871]">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 12 contents */}
      <div className="rounded-3xl bg-[#0f2d43] p-7 text-white sm:p-9">
        <h3 className="text-xl font-extrabold">12 contents typically on a B/L</h3>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {blContents.map((item, i) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#d7b45a] text-xs font-extrabold text-[#0f2d43]">
                {i + 1}
              </span>
              <span className="text-sm font-semibold text-slate-200">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Significance by party */}
      <div className="grid gap-5 lg:grid-cols-3">
        {[
          {
            role: 'Exporter',
            color: '#163d3a',
            points: [
              'Proof of receipt for shipment',
              'Basis for sending shipping advice',
              'Can claim against carrier if damage occurs (with a clean B/L)',
              'Required for incentive claims',
              'Serves as the carriage contract',
            ],
          },
          {
            role: 'Importer',
            color: '#c8942e',
            points: [
              'Title document enabling transfer by endorsement',
              'Gets advance shipment notice via a non-negotiable copy',
              'Freight details let him verify charges',
            ],
          },
          {
            role: 'Shipping Company',
            color: '#2e6d5d',
            points: [
              'Basis for collecting freight',
              'Protects itself from wrongful claims by noting condition of goods at receipt',
            ],
          },
        ].map((party) => (
          <div
            key={party.role}
            className="rounded-3xl border border-[#dfe6de] bg-white p-6 shadow-sm"
          >
            <span
              className="inline-block rounded-lg px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-white"
              style={{ backgroundColor: party.color }}
            >
              {party.role}
            </span>
            <ul className="mt-5 space-y-3">
              {party.points.map((pt) => (
                <li key={pt} className="flex gap-3 text-sm leading-6 text-[#607871]">
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-[#c8942e]" />
                  {pt}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Airway Bill distinction */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#dfe6de] bg-[#edf3eb] p-6 sm:flex-row sm:items-center sm:gap-6">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#2e6d5d] shadow-sm">
          <Plane className="h-6 w-6" />
        </span>
        <div>
          <h3 className="font-extrabold text-[#163d3a]">
            Related distinction: Airway Bill
          </h3>
          <p className="mt-2 text-sm leading-7 text-[#607871]">
            An Airway Bill (air\u2019s equivalent) is <span className="font-bold">not</span> a
            document of title and isn\u2019t negotiable \u2014 goods are delivered to the
            consignee without needing to produce it, unlike a B/L.
          </p>
        </div>
      </div>

      {/* Back navigation */}
      <div className="flex items-center justify-between border-t border-[#dfe6de] pt-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2e6d5d] transition hover:text-[#c8942e]"
        >
          <ArrowLeft className="h-4 w-4" /> All categories
        </button>
        <button
          onClick={onTopics}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2e6d5d] transition hover:text-[#c8942e]"
        >
          Import &amp; Export topics <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
