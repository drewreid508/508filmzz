/**
 * 508 FILMZZ — booking alerts
 * ═══════════════════════════════════════════════════════════════════════════
 * Texts your iPhone and emails you the moment someone books, and sends the
 * client a receipt.
 *
 * This is the SMALL script — alerts only. It lives inside your booking form's
 * responses Sheet, so there is nothing to deploy and no web app to configure.
 *
 * BookingSystem.gs in the same folder does all of this plus approvals and the
 * signable contract. Use that one later. For now, this is the file that makes
 * your phone buzz, and it is deliberately short so there is less to go wrong.
 *
 * ── SETUP ──────────────────────────────────────────────────────────────────
 *   1. Open the booking form's responses Sheet.
 *   2. Extensions → Apps Script.
 *   3. Select all the placeholder code and paste this whole file over it.
 *   4. Put your Textbelt key on line 44 (search PASTE_YOUR). Save.
 *   5. Function dropdown → setup → Run. Authorise when asked.
 *   6. Function dropdown → status → Run. Every line should read YES or a value.
 *   7. Function dropdown → testAlert → Run. Your phone should buzz.
 */

// ═══════════════════════════════════════════════════════════════════════════
// THE ONLY TWO LINES YOU EDIT
// ═══════════════════════════════════════════════════════════════════════════

/** Your iPhone. Digits only — no +1, no spaces, no dashes, no brackets. */
var SMS_TO_NUMBER = "8649154071";

/**
 * Your Textbelt key from textbelt.com/purchase.
 *
 * Replace the whole placeholder, keeping the quote marks. Keep this private:
 * anyone holding it can spend your texts. It belongs here, inside your Google
 * account — never in the website and never in the public GitHub repository.
 *
 * To try the pipeline before paying, put the single word  textbelt  here. That
 * is a free key good for one message a day, rate-limited per IP — and Apps
 * Script runs from Google's shared servers, so the day's free message has
 * usually been spent by someone else. An "out of quota" reply from it says
 * nothing about your setup.
 */
var TEXTBELT_KEY = "PASTE_YOUR_TEXTBELT_KEY_HERE";

/** Where your copy of each booking goes. Blank = the account this runs as. */
var EMAIL_TO = "";

// ═══════════════════════════════════════════════════════════════════════════
// Nothing below here needs editing
// ═══════════════════════════════════════════════════════════════════════════

var STUDIO_NAME = "508 Filmzz";
var STUDIO_TAGLINE = "Cinematic media built to move.";
var STUDIO_EMAIL = "508filmz@gmail.com";
var STUDIO_PHONE = "864-915-4071";
var TEXTBELT_URL = "https://textbelt.com/text";

function keyMissing() {
  return !TEXTBELT_KEY || TEXTBELT_KEY.indexOf("PASTE_") === 0;
}

function inbox() {
  if (EMAIL_TO) return EMAIL_TO;
  try {
    return Session.getEffectiveUser().getEmail();
  } catch (err) {
    return "";
  }
}

// ── Setup and diagnostics ──────────────────────────────────────────────────

function setup() {
  /*
   * This project has to live inside the bookings spreadsheet. Opened from the
   * Sheet it is bound to it; created standalone at script.new it is bound to
   * nothing, the trigger cannot be created, and everything looks fine while no
   * notification ever arrives.
   */
  var book = SpreadsheetApp.getActive();
  if (!book) {
    throw new Error(
      "This project is not attached to a spreadsheet. Open your booking " +
      "responses Sheet, choose Extensions > Apps Script, paste this file " +
      "there, and run setup again."
    );
  }

  // Clear first: triggers stack silently, and a second one means two of
  // everything with nothing to show where the duplicate came from.
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

  Logger.log("Setup complete. Bookings will now text " + SMS_TO_NUMBER +
             " and email " + inbox() + ".");
}

/**
 * Says what is actually wired up, and throws if anything essential is not.
 *
 * Every failure here looks identical from the outside — a phone that does not
 * buzz. This separates them: wrong project, no trigger, missing key, or a real
 * delivery problem.
 */
function status() {
  var book = SpreadsheetApp.getActive();
  var triggers = ScriptApp.getProjectTriggers().filter(function (t) {
    return t.getHandlerFunction() === "onBookingSubmit";
  });

  Logger.log("Attached to Sheet : " + (book ? book.getName() : "NOTHING  <-- wrong project"));
  Logger.log("Trigger installed : " + (triggers.length ? "YES" : "NO  <-- run setup"));
  Logger.log("SMS to            : " + (SMS_TO_NUMBER || "NOT SET"));
  Logger.log("Textbelt key      : " + (keyMissing() ? "NOT SET  <-- search this file for PASTE_YOUR" : "set"));
  Logger.log("Email to          : " + (inbox() || "NONE"));
  Logger.log("Mail quota left   : " + MailApp.getRemainingDailyQuota());
  if (!keyMissing()) Logger.log("Texts remaining   : " + textsRemaining());

  if (!book) throw new Error("Not attached to a spreadsheet. See setup.");
  if (!triggers.length) throw new Error("No trigger installed. Run setup.");
  if (keyMissing()) throw new Error("Textbelt key not set. Search this file for PASTE_YOUR.");
  return "ok";
}

/** How many texts are left on the key. */
function textsRemaining() {
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

// ── Reading the booking ────────────────────────────────────────────────────

/**
 * Look a question up by title, forgivingly.
 *
 * The form's titles are not tidy — several carry a trailing space ("Phone
 * number ", "budget ") and the casing is inconsistent. Matching them literally
 * works right up until a title is tidied, then fails silently: alerts still
 * arriving, every field blank. So keys are trimmed, lowercased and matched on
 * their opening words.
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

/** The site sends "(not given)" for blank optional fields; that is noise here. */
function clean(v) {
  return (!v || v === "(not given)") ? "" : v;
}

/**
 * Pulls a labelled line out of the project details.
 *
 * The website appends time, lead source and promo details there because the
 * Google Form has no questions for them. Reading them back is what gets them
 * into the alert.
 */
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
  var lead = readLead((e && e.namedValues) || {});

  // Each channel is attempted on its own and none may throw. A dead Textbelt
  // balance must never cost you the email, and neither must cost the client
  // their receipt.
  sendText(lead);
  sendEmail(lead);
  sendClientReceipt(lead);
}

/**
 * The text.
 *
 * Kept short: Textbelt bills per 160-character segment, so this carries what
 * decides whether to ring the client back now. The email carries everything.
 */
function sendText(lead) {
  try {
    if (!SMS_TO_NUMBER) return { ok: false, error: "SMS_TO_NUMBER is empty" };
    if (keyMissing()) return { ok: false, error: "TEXTBELT_KEY is not set" };

    var lines = ["NEW 508 FILMZZ BOOKING", ""];
    if (lead.name) lines.push("Name: " + lead.name);
    if (lead.business) lines.push("Business: " + lead.business);
    if (lead.service) lines.push("Shoot: " + lead.service);
    if (lead.date) lines.push("Date: " + lead.date);
    if (lead.time) lines.push("Time: " + lead.time);
    if (lead.location) lines.push("Location: " + lead.location);
    lines.push("");
    if (lead.phone) lines.push("Phone: " + lead.phone);
    if (lead.email) lines.push("Email: " + lead.email);
    lines.push("");
    lines.push("Open your booking sheet for full details.");

    var res = UrlFetchApp.fetch(TEXTBELT_URL, {
      method: "post",
      payload: {
        phone: SMS_TO_NUMBER,
        message: lines.join("\n"),
        key: TEXTBELT_KEY,
      },
      muteHttpExceptions: true,
    });

    var raw = res.getContentText();
    var body;
    try {
      body = JSON.parse(raw);
    } catch (parseErr) {
      return { ok: false, error: "unreadable reply: " + raw.slice(0, 140) };
    }

    if (!body.success) return { ok: false, error: body.error || "refused, no reason given" };

    Logger.log("Text sent. Texts remaining: " + body.quotaRemaining);
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
      ["Client Name", lead.name],
      ["Business", lead.business],
      ["Phone", lead.phone],
      ["Email", lead.email],
      ["Service", lead.service],
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
    body += "\nProject Description:\n" + (lead.message || "(none)") + "\n";
    body += "\nSubmitted: " + Utilities.formatDate(
      new Date(), Session.getScriptTimeZone(), "EEE d MMM yyyy, h:mm a") + "\n";

    var options = { name: STUDIO_NAME };
    // Reply-to only when it is a real address: a malformed one makes Gmail
    // reject the whole message, losing the alert over a formatting slip.
    if (lead.email && lead.email.indexOf("@") > 0) options.replyTo = lead.email;

    MailApp.sendEmail(to, "🚨 NEW 508 FILMZZ BOOKING REQUEST", body, options);
    return { ok: true, error: "" };
  } catch (err) {
    Logger.log("email failed: " + err);
    return { ok: false, error: String(err) };
  }
}

/** The client's receipt. Says request received — never that the date is held. */
function sendClientReceipt(lead) {
  try {
    if (!lead.email || lead.email.indexOf("@") < 1) return { ok: false, error: "no client email" };

    var body =
      "Hi " + (lead.name || "there") + ",\n\n" +
      "Thanks for reaching out to " + STUDIO_NAME + ".\n\n" +
      "I've received your project request and will review the details before " +
      "getting back to you regarding availability, pricing and next steps.\n\n" +
      (lead.date ? "Requested date: " + lead.date + (lead.time ? " at " + lead.time : "") + "\n" : "") +
      (lead.location ? "Location: " + lead.location + "\n" : "") +
      (lead.service ? "Service: " + lead.service + "\n" : "") +
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
    Logger.log("client receipt failed: " + err);
    return { ok: false, error: String(err) };
  }
}

// ── Test ───────────────────────────────────────────────────────────────────

/**
 * Loud on purpose.
 *
 * A real booking swallows a failed channel so it cannot take the others down
 * with it. That same silence makes a dead test impossible to diagnose, so this
 * throws with whatever reason Textbelt gave.
 */
function testAlert() {
  var lead = {
    name: "Mike Sanders",
    business: "Sanders Diesel",
    email: inbox(),
    phone: "(864) 555-0142",
    service: "Social Media Content",
    budget: "$500 - $1,000",
    date: "Fri, Sep 11, 2026",
    time: "2:00 PM",
    location: "Greenville, SC",
    referral: "Business card",
    social: "@sandersdiesel",
    promo: "",
    message: "TEST booking from the script editor. Delete this once seen.",
  };

  Logger.log("Texting : " + SMS_TO_NUMBER);
  Logger.log("Emailing: " + (inbox() || "(NO ADDRESS - this is the problem)"));

  var text = sendText(lead);
  var mail = sendEmail(lead);

  Logger.log("sms   -> " + (text.ok ? "sent, " + text.quotaRemaining + " texts left" : "FAILED: " + text.error));
  Logger.log("email -> " + (mail.ok ? "sent" : "FAILED: " + mail.error));

  if (!text.ok || !mail.ok) {
    throw new Error(
      "sms: " + (text.ok ? "sent" : text.error) +
      " | email: " + (mail.ok ? "sent" : mail.error)
    );
  }

  Logger.log("Both sent. Check your phone and " + inbox() + " (look in spam).");
}

/** Runs a fake submission through the real path, messy form titles and all. */
function testFormParsing() {
  onBookingSubmit({
    namedValues: {
      "Name": ["Mike Sanders"],
      "Business Name": ["Sanders Diesel"],
      "Email": [inbox()],
      "Phone number ": ["(864) 555-0142"],
      "project type ": ["Social Media Content"],
      "budget ": ["$500 - $1,000"],
      "shoot date ": ["Fri, Sep 11, 2026"],
      "location of shoot ": ["Greenville, SC"],
      "messages/tell me about your project ": [
        "Need 4 reels.\nPreferred time: 2:00 PM\nHeard about 508 Filmzz via: Business card",
      ],
    },
  });
  Logger.log("Sent. Check your phone and " + inbox() + ".");
}
