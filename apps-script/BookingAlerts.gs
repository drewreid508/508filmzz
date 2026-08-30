/**
 * 508 FILMZZ — booking alerts
 * ═══════════════════════════════════════════════════════════════════════════
 * Texts your iPhone the moment someone books, and emails you the full details.
 *
 * Lives inside the booking form's responses Sheet. Nothing to deploy.
 *
 * SMS goes through Textbelt, a paid HTTP API — not a carrier email gateway.
 * The gateway this replaced was free, undocumented and silently lossy: T-Mobile
 * filtered it with no error and no way to tell a delivered text from a dropped
 * one. Textbelt answers every send with success or a reason.
 */

// ═══════════════════════════════════════════════════════════════════════════
// SETTINGS — the only two lines you edit
// ═══════════════════════════════════════════════════════════════════════════

/** Your iPhone. Digits only: no +1, no spaces, no dashes, no brackets. */
var SMS_TO_NUMBER = "8649154071";

/** Your Textbelt key, from textbelt.com. Replace the whole string. */
var TEXTBELT_KEY = "PASTE_YOUR_TEXTBELT_KEY_HERE";

/** Full booking details by email. Blank = the account this script runs as. */
var EMAIL_TO = "";

// ═══════════════════════════════════════════════════════════════════════════
// Nothing below here needs editing
// ═══════════════════════════════════════════════════════════════════════════

var TEXTBELT_URL = "https://textbelt.com/text";

/** True while the key is still the placeholder shipped with this file. */
function keyMissing() {
  return !TEXTBELT_KEY || TEXTBELT_KEY.indexOf("PASTE_") === 0;
}

// ── Setup and diagnostics ──────────────────────────────────────────────────

/**
 * Reports what is actually wired up, and throws if anything essential is not.
 *
 * Every failure in this system has looked identical from the outside — a phone
 * that does not buzz. This distinguishes them: no trigger, wrong spreadsheet,
 * missing key, or a real delivery problem.
 */
function status() {
  var book = SpreadsheetApp.getActive();
  var triggers = ScriptApp.getProjectTriggers().filter(function (t) {
    return t.getHandlerFunction() === "onBookingSubmit";
  });

  Logger.log("Attached to Sheet : " + (book ? book.getName() : "NOTHING  <-- wrong project"));
  Logger.log("Trigger installed : " + (triggers.length ? "YES (" + triggers.length + ")" : "NO  <-- run setup"));
  Logger.log("SMS to            : " + (SMS_TO_NUMBER || "NOT SET"));
  Logger.log("Textbelt key      : " + (keyMissing() ? "NOT SET  <-- paste your key" : "set"));
  Logger.log("Email to          : " + (inbox() || "NONE"));
  Logger.log("Mail quota left   : " + MailApp.getRemainingDailyQuota());

  if (!keyMissing()) {
    Logger.log("Texts remaining   : " + textbeltQuota());
  }

  if (!book) throw new Error("Not attached to a spreadsheet. Open your responses Sheet, Extensions > Apps Script, and paste this file there.");
  if (!triggers.length) throw new Error("No trigger installed. Run setup.");
  if (keyMissing()) throw new Error("Textbelt key not set. Edit TEXTBELT_KEY at the top of this file.");

  return "ok";
}

/** How many texts are left on the key, or an error string. */
function textbeltQuota() {
  try {
    var res = UrlFetchApp.fetch(
      "https://textbelt.com/quota/" + encodeURIComponent(TEXTBELT_KEY),
      { muteHttpExceptions: true }
    );
    var body = JSON.parse(res.getContentText());
    return body.success ? String(body.quotaRemaining) : "could not read (" + (body.error || "unknown") + ")";
  } catch (err) {
    return "could not read (" + err + ")";
  }
}

function setup() {
  /*
   * This project has to live inside the bookings spreadsheet. Opened from the
   * Sheet it is bound to it and getActive() returns it; created standalone at
   * script.new it is bound to nothing, and the trigger cannot be created —
   * which looks like success and delivers nothing.
   */
  var book = SpreadsheetApp.getActive();
  if (!book) {
    throw new Error(
      "This project is not attached to a spreadsheet, so it cannot watch for " +
      "bookings. Open your booking form's responses Sheet, choose " +
      "Extensions > Apps Script, paste this file there, and run setup again."
    );
  }

  // Clear first. Triggers stack silently, and a second one means two texts per
  // booking with no clue where the duplicate came from.
  var existing = ScriptApp.getProjectTriggers();
  for (var i = 0; i < existing.length; i++) {
    if (existing[i].getHandlerFunction() === "onBookingSubmit") {
      ScriptApp.deleteTrigger(existing[i]);
    }
  }

  ScriptApp.newTrigger("onBookingSubmit")
    .forSpreadsheet(book)
    .onFormSubmit()
    .create();

  Logger.log("Done. Bookings will now text " + SMS_TO_NUMBER + " and email " + inbox());
}

function inbox() {
  if (EMAIL_TO) return EMAIL_TO;
  try {
    return Session.getEffectiveUser().getEmail();
  } catch (err) {
    return "";
  }
}

// ── Reading the form response ──────────────────────────────────────────────

/**
 * Look a question up by title, forgivingly.
 *
 * The form's titles are not tidy — several carry a trailing space ("Phone
 * number ", "budget ") and the casing is inconsistent. Matching literally would
 * work until a title was tidied, then fail silently: texts still arriving, with
 * blank fields. So keys are trimmed, lowercased, and prefix-matched.
 */
function field(named, wanted) {
  if (!named) return "";
  var target = String(wanted).toLowerCase();

  for (var key in named) {
    var norm = String(key).trim().toLowerCase();
    if (norm === target || norm.indexOf(target) === 0) {
      var value = named[key];
      if (Object.prototype.toString.call(value) === "[object Array]") {
        value = value.join(", ");
      }
      return String(value == null ? "" : value).trim();
    }
  }
  return "";
}

/** Placeholders the site sends for blank optional fields read as noise here. */
function clean(value) {
  if (!value || value === "(not given)") return "";
  return value;
}

function readLead(e) {
  var named = (e && e.namedValues) || {};
  return {
    name: field(named, "name"),
    business: clean(field(named, "business")),
    email: field(named, "email"),
    phone: field(named, "phone"),
    projectType: field(named, "project type"),
    budget: field(named, "budget"),
    shootDate: field(named, "shoot date"),
    location: clean(field(named, "location")),
    message: field(named, "message")
  };
}

// ── The alert ──────────────────────────────────────────────────────────────

function onBookingSubmit(e) {
  var lead = readLead(e);

  // Independent on purpose: a failed SMS must never cost you the email too.
  // Neither is allowed to throw, because a throw here would abort the other.
  sendText(lead);
  sendEmail(lead);
}

/**
 * The SMS body.
 *
 * Kept tight — Textbelt bills per 160-character segment, so this carries what
 * decides whether to ring the client back now, and the email carries the rest.
 */
function buildSmsText(lead) {
  var lines = ["508 FILMZZ - NEW BOOKING", ""];
  lines.push((lead.name || "Someone") + " just booked a shoot.");
  if (lead.shootDate) lines.push("Date: " + lead.shootDate);
  if (lead.business) lines.push("Business: " + lead.business);
  if (lead.projectType) lines.push("Service: " + lead.projectType);
  if (lead.budget) lines.push("Budget: " + lead.budget);
  if (lead.location) lines.push("Location: " + lead.location);
  if (lead.phone) lines.push("Call: " + lead.phone);
  lines.push("");
  lines.push("Full details in your email.");
  return lines.join("\n");
}

function sendText(lead) {
  try {
    if (!SMS_TO_NUMBER) return { ok: false, error: "SMS_TO_NUMBER is empty" };
    if (keyMissing()) return { ok: false, error: "TEXTBELT_KEY is not set" };

    var res = UrlFetchApp.fetch(TEXTBELT_URL, {
      method: "post",
      payload: {
        phone: SMS_TO_NUMBER,
        message: buildSmsText(lead),
        key: TEXTBELT_KEY
      },
      muteHttpExceptions: true
    });

    var raw = res.getContentText();
    var body;
    try {
      body = JSON.parse(raw);
    } catch (parseErr) {
      return { ok: false, error: "unreadable reply: " + raw.slice(0, 140) };
    }

    if (!body.success) {
      return { ok: false, error: body.error || "refused, no reason given" };
    }

    Logger.log("SMS sent. Texts remaining: " + body.quotaRemaining);
    return { ok: true, error: "", quotaRemaining: body.quotaRemaining };
  } catch (err) {
    Logger.log("text failed: " + err);
    return { ok: false, error: String(err) };
  }
}

/** The full brief, with reply-to set so hitting Reply answers the client. */
function sendEmail(lead) {
  try {
    var to = inbox();
    if (!to) return { ok: false, error: "no inbox address — set EMAIL_TO" };

    var rows = [
      ["Name", lead.name],
      ["Business", lead.business],
      ["Email", lead.email],
      ["Phone", lead.phone],
      ["Service", lead.projectType],
      ["Budget", lead.budget],
      ["Shoot date", lead.shootDate],
      ["Location", lead.location]
    ];

    var body = "";
    for (var i = 0; i < rows.length; i++) {
      if (rows[i][1]) body += rows[i][0] + ": " + rows[i][1] + "\n";
    }
    body += "\n" + (lead.message || "(no message)") + "\n";

    var options = { name: "508 Filmzz" };
    // Reply-to only when it is a real address — a malformed one makes Gmail
    // reject the whole message, losing the notification over a formatting slip.
    if (lead.email && lead.email.indexOf("@") > 0) options.replyTo = lead.email;

    MailApp.sendEmail(
      to,
      "New booking — " + (lead.name || "someone") +
        (lead.projectType ? " (" + lead.projectType + ")" : ""),
      body,
      options
    );
    return { ok: true, error: "" };
  } catch (err) {
    Logger.log("email failed: " + err);
    return { ok: false, error: String(err) };
  }
}

// ── Tests ──────────────────────────────────────────────────────────────────

/**
 * Loud on purpose.
 *
 * A real booking swallows a failed channel so it cannot take the other down
 * with it. That same silence makes a dead test impossible to diagnose, so here
 * anything that fails is thrown with the reason Textbelt gave.
 */
function testAlert() {
  var lead = {
    name: "Mike Sanders",
    business: "Sanders Diesel",
    email: "mike@example.com",
    phone: "(864) 555-0142",
    projectType: "Automotive",
    budget: "$1,000 - $2,500",
    shootDate: "Fri, Sep 11, 2026",
    location: "Greenville, SC",
    message: "TEST alert. If this reached your phone and inbox, alerts work."
  };

  Logger.log("Texting : " + SMS_TO_NUMBER);
  Logger.log("Emailing: " + (inbox() || "(NO ADDRESS - this is the problem)"));

  var text = sendText(lead);
  var mail = sendEmail(lead);

  Logger.log("sms   -> " + (text.ok ? "sent, " + text.quotaRemaining + " left" : "FAILED: " + text.error));
  Logger.log("email -> " + (mail.ok ? "sent" : "FAILED: " + mail.error));

  if (!text.ok || !mail.ok) {
    throw new Error(
      "sms: " + (text.ok ? "sent" : text.error) +
      " | email: " + (mail.ok ? "sent" : mail.error)
    );
  }

  Logger.log("Both sent. Check your phone and " + inbox() + " (look in spam).");
}

/** Runs a fake form submission through the real path, titles and all. */
function testFormParsing() {
  onBookingSubmit({
    namedValues: {
      "Name": ["Mike Sanders"],
      "Business Name": ["Sanders Diesel"],
      "Email": ["mike@example.com"],
      "Phone number ": ["(864) 555-0142"],
      "project type ": ["Automotive"],
      "budget ": ["$1,000 - $2,500"],
      "shoot date ": ["Fri, Sep 11, 2026"],
      "location of shoot ": ["Greenville, SC"],
      "messages/tell me about your project ": ["TEST parsing check."]
    }
  });
  Logger.log("Sent. Check your phone and " + inbox());
}
