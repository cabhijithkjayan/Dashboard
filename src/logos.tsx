import type { FC } from 'react';

type LogoProps = { className?: string };

export const TallyLogo: FC<LogoProps> = ({ className = '' }) => (
  <img src="/Tally_-_Logo.png" alt="Tally" className={`object-contain ${className}`} />
);

export const ExcelLogo: FC<LogoProps> = ({ className = '' }) => (
  <img src="/logos/skills/Excel.png" alt="Microsoft Excel" className={`object-contain ${className}`} />
);

export const PowerBILogo: FC<LogoProps> = ({ className = '' }) => (
  <img src="/logos/skills/Power_Bi.png" alt="Microsoft Power BI" className={`object-contain ${className}`} />
);

export const MSOfficeLogo: FC<LogoProps> = ({ className = '' }) => (
  <img src="/logos/skills/Ms_Office.png" alt="Microsoft Office" className={`object-contain ${className}`} />
);

export const ICAILogo: FC<LogoProps> = ({ className = '' }) => (
  <img src="/logos/education/ICAI.jpg" alt="Institute of Chartered Accountants of India" className={`object-contain ${className}`} />
);

export const IGNOULogo: FC<LogoProps> = ({ className = '' }) => (
  <img src="/IGNOU-Logo.jpg" alt="Indira Gandhi National Open University" className={`object-contain ${className}`} />
);

export const DPYLogo: FC<LogoProps> = ({ className = '' }) => (
  <img src="/DY.jpg" alt="Dr. D. Y. Patil Vidyapeeth" className={`object-contain ${className}`} />
);

export const WiproLogo: FC<LogoProps> = ({ className = '' }) => (
  <img src="/Wipro.webp" alt="Wipro" className={`object-contain ${className}`} />
);

export const KalaLogo: FC<LogoProps> = ({ className = '' }) => (
  <img src="/Kala.png" alt="Kala SpiceX" className={`object-contain ${className}`} />
);

export const BPLogo: FC<LogoProps> = ({ className = '' }) => (
  <img src="/BP-removebg-preview.png" alt="British Petroleum" className={`object-contain ${className}`} />
);

export const GuptaLogo: FC<LogoProps> = ({ className = '' }) => (
  <span className={`inline-flex items-center justify-center gap-1.5 ${className}`}>
    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#445D5A] text-[8px] font-bold text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      GR
    </span>
    <span className="text-sm font-bold text-[#445D5A]">Gupta Raj</span>
  </span>
);

export type SkillLogoDef = {
  Component: FC<LogoProps>;
  name: string;
  category: string;
};

export const skillLogos: SkillLogoDef[] = [
  { Component: TallyLogo, name: 'Tally', category: 'Accounting' },
  { Component: ExcelLogo, name: 'Excel', category: 'Analytics' },
  { Component: PowerBILogo, name: 'Power BI', category: 'Business Intelligence' },
  { Component: MSOfficeLogo, name: 'MS Office', category: 'Productivity' },
];

export type EduLogoDef = {
  Component: FC<LogoProps>;
  name: string;
};

export const eduLogos: EduLogoDef[] = [
  { Component: ICAILogo, name: 'ICAI' },
  { Component: IGNOULogo, name: 'IGNOU' },
  { Component: DPYLogo, name: 'DY Patil' },
  { Component: WiproLogo, name: 'Wipro' },
  { Component: BPLogo, name: 'British Petroleum' },
];
