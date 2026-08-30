/**
 * 508 FILMZZ — booking alerts (Twilio)
 * ═══════════════════════════════════════════════════════════════════════════
 * On every booking: texts you, texts the client, emails you, emails the client.
 *
 * Lives inside the booking form's responses Sheet. Nothing to deploy, no web
 * app, and no credential anywhere near the website.
 *
 * ── WHERE THE CREDENTIALS GO ───────────────────────────────────────────────
 * Project Settings (⚙) → Script Properties. Never in this file, because this
 * file is committed to a public GitHub repository:
 *
 *   TWILIO_ACCOUNT_SID   starts AC…            (Twilio Console home)
 *   TWILIO_AUTH_TOKEN    the secret            (Twilio Console home)
 *   TWILIO_FROM          +18642522868          (your Twilio number, E.164)
 *
 * Optional, and preferred by Twilio for production sending:
 *   TWILIO_MESSAGING_SERVICE_SID   starts MG…
 *   Set it and it is used instead of TWILIO_FROM.
 *
 * ── SETUP ──────────────────────────────────────────────────────────────────
 *   1. Open the booking form's responses Sheet.
 *   2. Extensions → Apps Script. Paste this whole file over what is there.
 *   3. ⚙ Project Settings → Script Properties → add the three above. Save.
 *   4. Function dropdown → setup → Run. Authorise when asked.
 *   5. Function dropdown → status → Run. Every line should read YES or a value.
 *   6. Function dropdown → testAlert → Run. Your phone should buzz.
 */

// ═══════════════════════════════════════════════════════════════════════════
// SETTINGS — not secret, so they live here rather than in Script Properties
// ═══════════════════════════════════════════════════════════════════════════

/** Where booking alerts are texted. E.164: +1 then the ten digits. */
var OWNER_SMS = "+18649154071";

/** Where bookings are emailed. Blank = the account this script runs as. */
var EMAIL_TO = "";

var STUDIO_NAME = "508 Filmzz";
var STUDIO_TAGLINE = "Cinematic media built to move.";
var STUDIO_EMAIL = "508filmz@gmail.com";
var STUDIO_PHONE = "864-915-4071";

// ═══════════════════════════════════════════════════════════════════════════
// Nothing below here needs editing
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Columns this script owns, added to the right of whatever the Form writes.
 *
 * The Form owns the left-hand columns and inserts a new one whenever a
 * question is added, so these are always found by header name and never by
 * position — otherwise adding a question starts writing statuses into a
 * client's phone number.
 */
var ADMIN_HEADERS = [
  "Booking ID",
  "Notified At",
  "Owner SMS",
  "Client SMS",
  "Owner Email",
  "Client Email",
  "Notify Error",
];

function prop(key) {
  var v = PropertiesService.getScriptProperties().getProperty(key);
  return v === null ? "" : String(v).trim();
}

function inbox() {
  if (EMAIL_TO) return EMAIL_TO;
  try {
    return Session.getEffectiveUser().getEmail();
  } catch (err) {
    return "";
  }
}

function sheet() {
  var book = SpreadsheetApp.getActive();
  return book ? book.getSheets()[0] : null;
}

// ── Setup and diagnostics ──────────────────────────────────────────────────

function setup() {
  var book = SpreadsheetApp.getActive();
  if (!book) {
    throw new Error(
      "This project is not attached to a spreadsheet. Open your booking " +
      "responses Sheet, choose Extensions > Apps Script, paste this file " +
      "there, and run setup again."
    );
  }

  ensureAdminColumns();

  // Clear first: triggers stack silently, and a second one is two of every
  // message with nothing to show where the duplicate came from.
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

  Logger.log("Setup complete. Bookings will text " + OWNER_SMS +
             " and email " + inbox() + ".");
}

function ensureAdminColumns() {
  var sh = sheet();
  if (!sh) return;
  var lastCol = Math.max(sh.getLastColumn(), 1);
  var headers = sh.getRange(1, 1, 1, lastCol).getValues()[0];

  var missing = ADMIN_HEADERS.filter(function (h) {
    return headers.indexOf(h) === -1;
  });
  if (!missing.length) return;

  sh.getRange(1, lastCol + 1, 1, missing.length).setValues([missing]);
  sh.getRange(1, 1, 1, lastCol + missing.length).setFontWeight("bold");
  sh.setFrozenRows(1);
}

function colOf(header) {
  var sh = sheet();
  if (!sh) return 0;
  var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  return headers.indexOf(header) + 1;
}

function setCell(row, header, value) {
  var c = colOf(header);
  if (c && row > 1) sheet().getRange(row, c).setValue(value);
}

function getCell(row, header) {
  var c = colOf(header);
  if (!c || row < 2) return "";
  return String(sheet().getRange(row, c).getValue() || "").trim();
}

function status() {
  var book = SpreadsheetApp.getActive();
  var triggers = ScriptApp.getProjectTriggers().filter(function (t) {
    return t.getHandlerFunction() === "onBookingSubmit";
  });
  var sid = prop("TWILIO_ACCOUNT_SID");
  var token = prop("TWILIO_AUTH_TOKEN");
  var from = prop("TWILIO_FROM");
  var svc = prop("TWILIO_MESSAGING_SERVICE_SID");

  var lines = [
    "Attached to Sheet : " + (book ? book.getName() : "NOTHING  <-- wrong project"),
    "Trigger installed : " + (triggers.length ? "YES" : "NO  <-- run setup"),
    "Admin columns     : " + (colOf("Booking ID") ? "YES" : "NO  <-- run setup"),
    "Twilio SID        : " + (sid ? (sid.indexOf("AC") === 0 ? "set" : "SET BUT WRONG — should start AC") : "NOT SET"),
    "Twilio token      : " + (token ? "set" : "NOT SET"),
    "Sending from      : " + (svc ? "Messaging Service " + svc : (from || "NOT SET")),
    "Texting you at    : " + (OWNER_SMS || "NOT SET"),
    "Email to          : " + (inbox() || "NONE"),
    "Mail quota left   : " + MailApp.getRemainingDailyQuota(),
  ];
  lines.forEach(function (l) { Logger.log(l); });

  if (sid && token) Logger.log("Twilio reachable  : " + twilioReachable());

  try {
    SpreadsheetApp.getUi().alert("508 Filmzz — status", lines.join("\n"),
      SpreadsheetApp.getUi().ButtonSet.OK);
  } catch (err) {
    // Run from the editor rather than the Sheet: the log is the output.
  }

  if (!book) throw new Error("Not attached to a spreadsheet. See setup.");
  if (!triggers.length) throw new Error("No trigger installed. Run setup.");
  if (!sid || !token) throw new Error("Twilio credentials missing. Project Settings > Script Properties.");
  if (!from && !svc) throw new Error("No TWILIO_FROM or TWILIO_MESSAGING_SERVICE_SID set.");
  return "ok";
}

/** Confirms the credentials work, without sending anything. */
function twilioReachable() {
  try {
    var sid = prop("TWILIO_ACCOUNT_SID");
    var res = UrlFetchApp.fetch(
      "https://api.twilio.com/2010-04-01/Accounts/" + encodeURIComponent(sid) + ".json",
      { headers: { Authorization: basicAuth() }, muteHttpExceptions: true }
    );
    var code = res.getResponseCode();
    if (code === 200) {
      var body = JSON.parse(res.getContentText());
      return "YES — account " + (body.friendly_name || sid) + ", status " + body.status;
    }
    if (code === 401) return "NO — SID or auth token is wrong";
    return "NO — HTTP " + code + " " + res.getContentText().slice(0, 120);
  } catch (err) {
    return "NO — " + err;
  }
}

function basicAuth() {
  return "Basic " + Utilities.base64Encode(
    prop("TWILIO_ACCOUNT_SID") + ":" + prop("TWILIO_AUTH_TOKEN")
  );
}

// ── Sending ────────────────────────────────────────────────────────────────

/**
 * One text through Twilio.
 *
 * Returns { ok, error } and never throws: a refused message must not abort the
 * booking's other notifications. Twilio's own error text is passed straight
 * through, because "unverified number" and "campaign not registered" need
 * completely different fixes and a generic failure hides which.
 */
function sendSms(to, body) {
  try {
    var sid = prop("TWILIO_ACCOUNT_SID");
    var token = prop("TWILIO_AUTH_TOKEN");
    if (!sid || !token) return { ok: false, error: "Twilio credentials not set" };
    if (!to) return { ok: false, error: "no destination number" };

    var payload = { To: to, Body: body };
    var svc = prop("TWILIO_MESSAGING_SERVICE_SID");
    if (svc) {
      payload.MessagingServiceSid = svc;
    } else {
      var from = prop("TWILIO_FROM");
      if (!from) return { ok: false, error: "no TWILIO_FROM or messaging service" };
      payload.From = from;
    }

    var res = UrlFetchApp.fetch(
      "https://api.twilio.com/2010-04-01/Accounts/" + encodeURIComponent(sid) + "/Messages.json",
      {
        method: "post",
        headers: { Authorization: basicAuth() },
        payload: payload,
        muteHttpExceptions: true,
      }
    );

    var code = res.getResponseCode();
    var text = res.getContentText();
    if (code >= 200 && code < 300) {
      var ok = JSON.parse(text);
      return { ok: true, error: "", sid: ok.sid, status: ok.status };
    }

    var msg = text;
    try {
      var err = JSON.parse(text);
      msg = (err.message || text) + (err.code ? " (Twilio code " + err.code + ")" : "");
    } catch (parseErr) {
      msg = text.slice(0, 200);
    }
    return { ok: false, error: "HTTP " + code + ": " + msg };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

/** Digits to E.164. Anything already in +… form is left alone. */
function toE164(raw) {
  var s = String(raw || "").trim();
  if (!s) return "";
  if (s.charAt(0) === "+") return s;
  var digits = s.replace(/\D/g, "");
  if (digits.length === 10) return "+1" + digits;
  if (digits.length === 11 && digits.charAt(0) === "1") return "+" + digits;
  // Anything else is not a US number this script can reason about; returning
  // it unchanged lets Twilio reject it with a message worth reading.
  return digits ? "+" + digits : "";
}

// ── Reading the booking ────────────────────────────────────────────────────

/**
 * Look a question up by title, forgivingly.
 *
 * The form's titles carry trailing spaces ("Phone number ", "budget ") and
 * inconsistent casing. Matching literally works until a title is tidied, then
 * fails silently — alerts still arriving, every field blank.
 */
function field(named, wanted) {
  if (!named) return "";
  var target = String(wanted).toLowerCase();
  for (var key in named) {
    var norm = String(key).trim().toLowerCase();
    if (norm === target || norm.indexOf(target) === 0) {
      var v = named[key];
      if (Object.prototype.toString.call(v) === "[object Array]") v = v.join(", ");
      return String(v == null ? "" : v).trim();
    }
  }
  return "";
}

function clean(v) {
  return (!v || v === "(not given)") ? "" : v;
}

/** Pulls a labelled line out of the project details the website appends. */
function fromMessage(message, label) {
  var re = new RegExp(label + "\\s*:\\s*([^\\n\\r]+)", "i");
  var m = re.exec(message || "");
  return m ? m[1].trim() : "";
}

function readLead(named) {
  var message = field(named, "message");
  return {
    name: field(named, "name"),
    business: clean(field(named, "business")),
    email: field(named, "email"),
    phone: field(named, "phone"),
    service: field(named, "project type"),
    budget: field(named, "budget"),
    date: field(named, "shoot date"),
    time: fromMessage(message, "preferred time"),
    location: clean(field(named, "location")),
    referral: fromMessage(message, "heard about 508 filmzz via"),
    social: fromMessage(message, "social"),
    promo: fromMessage(message, "promo code used"),
    message: message,
  };
}

// ── The alert ──────────────────────────────────────────────────────────────

function onBookingSubmit(e) {
  ensureAdminColumns();

  var lead = readLead((e && e.namedValues) || {});
  var row = (e && e.range && e.range.getRow()) || sheet().getLastRow();

  /*
   * Duplicate protection.
   *
   * A form-submit trigger can fire twice — a retried submission, a double tap,
   * or Google replaying the event. Without a guard that is two texts and two
   * emails per booking, which reads to a client as a system that is broken.
   *
   * The lock serialises concurrent fires; the "Notified At" cell is what makes
   * it idempotent across separate ones. Stamped BEFORE anything is sent, so a
   * crash halfway through cannot cause a resend on the retry.
   */
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
  } catch (err) {
    return;
  }

  try {
    if (getCell(row, "Notified At")) return;
    setCell(row, "Booking ID", getCell(row, "Booking ID") || newBookingId());
    setCell(row, "Notified At", stamp());
  } finally {
    lock.releaseLock();
  }

  var bookingId = getCell(row, "Booking ID");
  var errors = [];

  // Four independent channels. None may throw: a refused text must not cost
  // the email, and neither must cost the client their receipt.
  var ownerSms = sendSms(OWNER_SMS, ownerSmsText(lead, bookingId));
  setCell(row, "Owner SMS", ownerSms.ok ? "sent" : "failed");
  if (!ownerSms.ok) errors.push("owner sms: " + ownerSms.error);

  var clientNumber = toE164(lead.phone);
  var clientSms = clientNumber
    ? sendSms(clientNumber, clientSmsText())
    : { ok: false, error: "no usable client number" };
  setCell(row, "Client SMS", clientSms.ok ? "sent" : "failed");
  if (!clientSms.ok) errors.push("client sms: " + clientSms.error);

  var ownerMail = sendOwnerEmail(lead, bookingId);
  setCell(row, "Owner Email", ownerMail.ok ? "sent" : "failed");
  if (!ownerMail.ok) errors.push("owner email: " + ownerMail.error);

  var clientMail = sendClientEmail(lead);
  setCell(row, "Client Email", clientMail.ok ? "sent" : "failed");
  if (!clientMail.ok) errors.push("client email: " + clientMail.error);

  setCell(row, "Notify Error", errors.length ? errors.join(" | ") : "");
}

function newBookingId() {
  return "508-" + Utilities.getUuid().replace(/-/g, "").slice(0, 8).toUpperCase();
}

function stamp() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm");
}

/**
 * Your text.
 *
 * Trimmed to what decides whether to ring the client back now. Twilio bills
 * per 160-character segment, and the project details can run to paragraphs —
 * those stay in the email, which has no such limit.
 */
function ownerSmsText(lead, bookingId) {
  var lines = ["NEW 508 FILMZZ BOOKING", ""];
  if (lead.name) lines.push("Client: " + lead.name);
  if (lead.business) lines.push("Business: " + lead.business);
  if (lead.service) lines.push("Shoot: " + lead.service);
  if (lead.date) lines.push("Date: " + lead.date);
  if (lead.time) lines.push("Time: " + lead.time);
  if (lead.location) lines.push("Location: " + lead.location);
  lines.push("");
  if (lead.phone) lines.push("Phone: " + lead.phone);
  if (lead.email) lines.push("Email: " + lead.email);
  if (lead.message) lines.push("", "Details: " + lead.message.split("\n")[0].slice(0, 140));
  lines.push("", "ACTION: Contact customer to confirm.");
  if (bookingId) lines.push(bookingId);
  return lines.join("\n");
}

/** The client's text. Says request received — never that the date is held. */
function clientSmsText() {
  return "🎥 " + STUDIO_NAME + "\n\n" +
    "Thanks for your booking request! We received your shoot details. " +
    "I'll review your request and text you shortly to confirm your date and time.\n\n" +
    "— " + STUDIO_NAME;
}

function sendOwnerEmail(lead, bookingId) {
  try {
    var to = inbox();
    if (!to) return { ok: false, error: "no inbox address" };

    var rows = [
      ["Booking ID", bookingId],
      ["Client Name", lead.name],
      ["Business", lead.business],
      ["Phone", lead.phone],
      ["Email", lead.email],
      ["Shoot Type", lead.service],
      ["Preferred Date", lead.date],
      ["Preferred Time", lead.time],
      ["Location", lead.location],
      ["Budget", lead.budget],
      ["Instagram / TikTok", lead.social],
      ["How They Found Us", lead.referral],
      ["Promo Code", lead.promo],
    ];

    var body = "🚨 NEW 508 FILMZZ BOOKING REQUEST\n\n";
    for (var i = 0; i < rows.length; i++) {
      if (rows[i][1]) body += rows[i][0] + ": " + rows[i][1] + "\n";
    }
    body += "\nProject Details:\n" + (lead.message || "(none)") + "\n";
    body += "\nSubmitted: " + Utilities.formatDate(
      new Date(), Session.getScriptTimeZone(), "EEE d MMM yyyy, h:mm a") + "\n";
    body += "\nACTION: Contact the customer to confirm the shoot.\n";

    var options = { name: STUDIO_NAME };
    // Reply-to only when it is a real address: a malformed one makes Gmail
    // reject the whole message, losing the alert over a formatting slip.
    if (lead.email && lead.email.indexOf("@") > 0) options.replyTo = lead.email;

    MailApp.sendEmail(to, "🚨 NEW 508 FILMZZ BOOKING REQUEST", body, options);
    return { ok: true, error: "" };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

function sendClientEmail(lead) {
  try {
    if (!lead.email || lead.email.indexOf("@") < 1) return { ok: false, error: "no client email" };

    var body =
      "Hi " + (lead.name || "there") + ",\n\n" +
      "Your booking request has been received.\n\n" +
      "Your shoot is not officially confirmed until " + STUDIO_NAME +
      " contacts you. I'll review the details and get back to you shortly " +
      "regarding availability, pricing and next steps.\n\n" +
      (lead.service ? "Shoot type: " + lead.service + "\n" : "") +
      (lead.date ? "Requested date: " + lead.date + (lead.time ? " (" + lead.time + ")" : "") + "\n" : "") +
      (lead.location ? "Location: " + lead.location + "\n" : "") +
      "\n" + STUDIO_NAME + "\n" + STUDIO_EMAIL + "\n" + STUDIO_PHONE + "\n" +
      STUDIO_TAGLINE + "\n";

    MailApp.sendEmail({
      to: lead.email,
      subject: STUDIO_NAME + " — Booking Request Received",
      body: body,
      name: STUDIO_NAME,
      replyTo: STUDIO_EMAIL,
    });
    return { ok: true, error: "" };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

// ── Tests ──────────────────────────────────────────────────────────────────

/**
 * Loud on purpose.
 *
 * A real booking swallows a failed channel so it cannot take the others down.
 * That silence makes a dead test impossible to diagnose, so this throws with
 * whatever Twilio actually said.
 */
function testAlert() {
  var lead = {
    name: "Mike Sanders",
    business: "Sanders Diesel",
    email: inbox(),
    phone: OWNER_SMS,
    service: "Automotive Reel",
    budget: "$500 - $1,000",
    date: "Fri, Sep 11, 2026",
    time: "Golden hour",
    location: "Greenville, SC",
    referral: "Business card",
    social: "@sandersdiesel",
    promo: "",
    message: "TEST booking from the script editor. Delete this once seen.",
  };

  Logger.log("Twilio reachable: " + twilioReachable());

  var ownerSms = sendSms(OWNER_SMS, ownerSmsText(lead, "508-TESTID"));
  var ownerMail = sendOwnerEmail(lead, "508-TESTID");

  Logger.log("your sms   -> " + (ownerSms.ok ? "sent, Twilio status " + ownerSms.status : "FAILED: " + ownerSms.error));
  Logger.log("your email -> " + (ownerMail.ok ? "sent" : "FAILED: " + ownerMail.error));

  if (!ownerSms.ok) throw new Error("SMS failed — " + ownerSms.error);
  if (!ownerMail.ok) throw new Error("Email failed — " + ownerMail.error);

  Logger.log("Sent. Check your phone and " + inbox() + ".");
}

/** Runs a fake submission through the real path, messy form titles and all. */
function testFormParsing() {
  onBookingSubmit({
    namedValues: {
      "Name": ["Mike Sanders"],
      "Business Name": ["Sanders Diesel"],
      "Email": [inbox()],
      "Phone number ": [OWNER_SMS],
      "project type ": ["Automotive Reel"],
      "budget ": ["$500 - $1,000"],
      "shoot date ": ["Fri, Sep 11, 2026"],
      "location of shoot ": ["Greenville, SC"],
      "messages/tell me about your project ": [
        "Need 4 reels.\nPreferred time: Golden hour\nSocial: @sandersdiesel\nHeard about 508 Filmzz via: Business card",
      ],
    },
  });
  Logger.log("Processed. Check your phone, " + inbox() + ", and the Sheet columns.");
}
