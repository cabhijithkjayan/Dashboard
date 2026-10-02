function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || "{}");
    const expectedSecret = PropertiesService.getScriptProperties().getProperty("API_SECRET");
    if (!expectedSecret || payload.apiSecret !== expectedSecret) {
      return jsonResponse({ ok: false, error: "Unauthorized" });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(30000);
    try {
      if (payload.action === "submit") return jsonResponse(saveSubmission(payload));
      if (payload.action === "ats") return jsonResponse(saveAtsResult(payload));
      return jsonResponse({ ok: false, error: "Unknown action" });
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, error: "Could not save the submission" });
  }
}

function saveSubmission(payload) {
  const fileUrl = saveCv(payload, "community");
  const headers = [
    "Submitted At", "Full Name", "Email", "Phone", "City", "LinkedIn", "Job Title",
    "Company", "Experience Years", "Industry", "Skills", "Qualification", "Certifications",
    "Open To", "Preferred", "Notice", "Expected Salary", "Source", "Consent",
    "CV File Name", "CV Drive URL"
  ];
  appendRecord("SUBMISSIONS_SHEET", "Submissions", headers, [
    new Date(), payload.fullName, payload.email, payload.phone, payload.city, payload.linkedin,
    payload.jobTitle, payload.company, payload.experienceYears, payload.industry, payload.skills,
    payload.qualification, payload.certifications, payload.openTo, payload.preferred, payload.notice,
    payload.expectedSalary, payload.source, payload.consent, payload.cvFileName, fileUrl
  ]);
  return { ok: true, cvUrl: fileUrl };
}

function saveAtsResult(payload) {
  const fileUrl = saveCv(payload, "ats");
  const result = JSON.parse(payload.analysisJson || "{}");
  const ats = result.ats || {};
  const match = result.match || {};
  const roles = result.roles || [];
  const headers = [
    "Checked At", "CV File Name", "CV Drive URL", "Job Description", "ATS Score", "ATS Band",
    "Role 1", "Role 1 Fit", "Role 2", "Role 2 Fit", "Role 3", "Role 3 Fit",
    "Job Match Score", "Job Match Band", "Full Analysis JSON"
  ];
  appendRecord("ATS_SHEET", "ATS CVs", headers, [
    new Date(), payload.cvFileName, fileUrl, payload.job, ats.score, ats.band,
    roles[0] && roles[0].title, roles[0] && roles[0].fit,
    roles[1] && roles[1].title, roles[1] && roles[1].fit,
    roles[2] && roles[2].title, roles[2] && roles[2].fit,
    match.score, match.band, JSON.stringify(result)
  ]);
  return { ok: true, cvUrl: fileUrl };
}

function saveCv(payload, prefix) {
  if (!payload.cvBase64) return "";
  const properties = PropertiesService.getScriptProperties();
  const folderId = properties.getProperty("DRIVE_FOLDER_ID");
  if (!folderId) throw new Error("DRIVE_FOLDER_ID is not configured");

  const originalName = String(payload.cvFileName || "cv").replace(/[\\/:*?\"<>|]/g, "_");
  const mimeType = payload.cvMime || "application/octet-stream";
  const bytes = Utilities.base64Decode(payload.cvBase64);
  const blob = Utilities.newBlob(bytes, mimeType, prefix + "-" + Date.now() + "-" + originalName);
  return DriveApp.getFolderById(folderId).createFile(blob).getUrl();
}

function appendRecord(propertyName, defaultName, headers, values) {
  const properties = PropertiesService.getScriptProperties();
  const spreadsheetId = properties.getProperty("SPREADSHEET_ID");
  if (!spreadsheetId) throw new Error("SPREADSHEET_ID is not configured");
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sheetName = properties.getProperty(propertyName) || defaultName;
  const sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
  if (sheet.getLastRow() === 0) sheet.appendRow(headers);
  sheet.appendRow(values.map(function (value) { return value == null ? "" : value; }));
}

function jsonResponse(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}