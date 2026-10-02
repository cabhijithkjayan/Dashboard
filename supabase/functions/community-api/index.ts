// Community API edge function — handles CV parse, form submit, and ATS check
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const GEMINI_MODELS = ["gemini-3.5-flash-lite", "gemini-3.8-flash"];
const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbynuDCXKQwsJuoOKGe7_cqDyMy4uh5dOTnBqzJsDVecLqqwezBdjmjBgMrz0Ecid5b4ig/exec";

let cachedGeminiKey = "";
let cachedTelegramLink = "";
let cachedSheetUrl = "";

async function getConfig(key: string): Promise<string> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { data, error } = await supabase.from("app_config").select("value").eq("key", key).maybeSingle();
  if (error || !data) return "";
  return data.value;
}

async function getGeminiKey(): Promise<string> {
  if (cachedGeminiKey) return cachedGeminiKey;
  cachedGeminiKey = await getConfig("GEMINI_API_KEY");
  return cachedGeminiKey;
}

async function getTelegramLink(): Promise<string> {
  if (cachedTelegramLink) return cachedTelegramLink;
  cachedTelegramLink = await getConfig("TELEGRAM_LINK");
  return cachedTelegramLink || "https://t.me/+3YgVLwcYQZ01NzQ0";
}

async function getSheetUrl(): Promise<string> {
  if (cachedSheetUrl) return cachedSheetUrl;
  cachedSheetUrl = await getConfig("SHEET_API_URL");
  return cachedSheetUrl || SHEET_API_URL;
}

function buildUrlEncoded(fields: Record<string, string>): string {
  return Object.entries(fields)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
}

async function postToSheet(fields: Record<string, string>): Promise<void> {
  const sheetUrl = await getSheetUrl();
  const body = buildUrlEncoded(fields);
  try {
    const res = await fetch(sheetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      redirect: "manual",
    });
    console.log("Sheet response status:", res.status);
  } catch (err) {
    console.error("Google Sheets forwarding failed (non-blocking):", err.message);
  }
}

async function forwardToSheet(data: SubmitData, cv: { name: string; mime: string; base64: string } | null): Promise<void> {
  const fields: Record<string, string> = {
    action: "submit",
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    city: data.city,
    linkedin: data.linkedin,
    jobTitle: data.jobTitle,
    company: data.company,
    experienceYears: data.experienceYears,
    industry: data.industry,
    skills: data.skills.join(", "),
    qualification: data.qualification,
    certifications: data.certifications.join(", "),
    openTo: data.openTo,
    preferred: data.preferred,
    notice: data.notice,
    expectedSalary: data.expectedSalary,
    source: data.source,
    consent: String(data.consent),
  };
  if (cv) {
    fields.cvFileName = cv.name;
    fields.cvMime = cv.mime;
  }
  await postToSheet(fields);
}

async function forwardAtsToSheet(atsResult: { ats?: { score?: number; band?: string }; roles?: { title: string; fit: number }[]; match?: { score?: number; band?: string } | null }): Promise<void> {
  const roles = atsResult.roles || [];
  const fields: Record<string, string> = {
    action: "ats",
    atsScore: String(atsResult.ats?.score ?? ""),
    atsBand: atsResult.ats?.band ?? "",
    role1: roles[0]?.title ?? "",
    role1Fit: String(roles[0]?.fit ?? ""),
    role2: roles[1]?.title ?? "",
    role2Fit: String(roles[1]?.fit ?? ""),
    role3: roles[2]?.title ?? "",
    role3Fit: String(roles[2]?.fit ?? ""),
    matchScore: String(atsResult.match?.score ?? ""),
    matchBand: atsResult.match?.band ?? "",
    timestamp: new Date().toISOString(),
  };
  await postToSheet(fields);
}

type ParseFields = {
  fullName?: string;
  email?: string;
  phone?: string;
  city?: string;
  linkedin?: string;
  jobTitle?: string;
  company?: string;
  experienceYears?: string | number;
  industry?: string;
  skills?: string[];
  qualification?: string;
  certifications?: string[];
};

type SubmitData = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  linkedin: string;
  jobTitle: string;
  company: string;
  experienceYears: string;
  industry: string;
  skills: string[];
  qualification: string;
  certifications: string[];
  openTo: string;
  preferred: string;
  notice: string;
  expectedSalary: string;
  source: string;
  consent: boolean;
};

async function callGemini(prompt: string, maxTokens = 2048): Promise<string> {
  const apiKey = await getGeminiKey();
  if (!apiKey) throw new Error("Gemini API key not configured");

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: maxTokens,
      responseMimeType: "application/json",
    },
  };

  let lastError = "";
  for (const model of GEMINI_MODELS) {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    try {
      const res = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errText = await res.text();
        lastError = `Gemini API error ${res.status}: ${errText.substring(0, 300)}`;
        if (res.status === 404 || res.status === 503) continue;
        throw new Error(lastError);
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("Gemini returned empty response");
      return text;
    } catch (err) {
      lastError = err.message;
      continue;
    }
  }
  throw new Error(lastError || "All Gemini models failed");
}

async function handleParse(cvText: string): Promise<Response> {
  const prompt = `You are a CV/resume parser. Extract the following fields from the CV text below and return ONLY a JSON object (no markdown, no code fences). If a field is not found, omit it or use null.

Fields to extract:
- fullName: string (full name of the person)
- email: string
- phone: string
- city: string (city and country if available)
- linkedin: string (LinkedIn URL)
- jobTitle: string (current or most recent job title)
- company: string (current or most recent company)
- experienceYears: number (total years of experience as a number)
- industry: string (primary industry)
- skills: array of strings (key skills, max 15)
- qualification: string (highest qualification)
- certifications: array of strings (professional certifications)

CV text:
${cvText.substring(0, 15000)}`;

  const text = await callGemini(prompt, 2048);

  let fields: ParseFields;
  try {
    fields = JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Could not parse Gemini response as JSON");
    fields = JSON.parse(match[0]);
  }

  return new Response(JSON.stringify({ ok: true, fields }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function handleSubmit(data: SubmitData, cv: { name: string; mime: string; base64: string } | null): Promise<Response> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const row = {
    full_name: data.fullName,
    email: data.email,
    phone: data.phone,
    city: data.city,
    linkedin: data.linkedin,
    job_title: data.jobTitle,
    company: data.company,
    experience_years: data.experienceYears,
    industry: data.industry,
    skills: data.skills,
    qualification: data.qualification,
    certifications: data.certifications,
    open_to: data.openTo,
    preferred: data.preferred,
    notice: data.notice,
    expected_salary: data.expectedSalary,
    source: data.source,
    consent: data.consent,
    cv_file_name: cv?.name || null,
    cv_mime: cv?.mime || null,
    cv_base64: cv?.base64 || null,
  };

  const { error } = await supabase.from("community_submissions").insert(row);
  if (error) throw new Error(`Database error: ${error.message}`);

  await forwardToSheet(data, cv);

  const telegramLink = await getTelegramLink();
  return new Response(JSON.stringify({ ok: true, telegramLink }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function handleAts(cvText: string, job: string): Promise<Response> {
  const hasJob = job.trim().length > 0;

  const atsPrompt = `You are an ATS (Applicant Tracking System) CV analyzer. Analyze the CV text below and return ONLY a JSON object (no markdown, no code fences) with this exact structure:
{
  "ats": {
    "score": number (0-100 overall ATS-friendliness score),
    "band": string ("Strong" if score>=70, "Fair" if 40-69, "Weak" if <40),
    "readable": number (0-20, how readable/parsable the text is),
    "sections": number (0-20, presence of standard sections like summary, experience, education, skills),
    "keywords": number (0-25, relevant keywords and skills present),
    "experience": number (0-20, quality and detail of experience descriptions),
    "format": number (0-15, appropriate length and formatting),
    "strengths": array of strings (3-5 strengths),
    "notes": array of strings (3-5 improvement suggestions)
  },
  "roles": array of 3 objects, each with { "title": string, "fit": number (0-100), "why": string }
}

${hasJob ? `Also analyze job match against this job description and include a "match" field:
{
  "match": {
    "score": number (0-100),
    "band": string ("Strong" if >=70, "Fair" if 40-69, "Weak" if <40),
    "skills": number (0-40, required skills match),
    "experience": number (0-25, experience and seniority match),
    "relevance": number (0-15, role relevance),
    "qualifications": number (0-10, qualifications match),
    "keywords": number (0-10, job keyword match),
    "missing": array of strings (missing key skills/qualifications),
    "notes": array of strings (3-5 match improvement suggestions)
  }
}

Job description:
${job.substring(0, 5000)}
` : ""}

CV text:
${cvText.substring(0, 15000)}`;

  const text = await callGemini(atsPrompt, 4096);

  let result;
  try {
    result = JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Could not parse Gemini response as JSON");
    result = JSON.parse(match[0]);
  }

  await forwardAtsToSheet(result);

  return new Response(JSON.stringify({ ok: true, result }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const action = body.action;

    if (action === "parse") {
      if (!body.text || typeof body.text !== "string") {
        return new Response(JSON.stringify({ ok: false, error: "Missing text" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return await handleParse(body.text);
    }

    if (action === "submit") {
      if (!body.data) {
        return new Response(JSON.stringify({ ok: false, error: "Missing data" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return await handleSubmit(body.data, body.cv || null);
    }

    if (action === "ats") {
      if (!body.text || typeof body.text !== "string") {
        return new Response(JSON.stringify({ ok: false, error: "Missing text" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return await handleAts(body.text, body.job || "");
    }

    return new Response(JSON.stringify({ ok: false, error: "Unknown action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ ok: false, error: err.message || "Server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
