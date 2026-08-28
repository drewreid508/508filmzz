/**
 * 508 FILMZZ — booking alerts
 * ═══════════════════════════════════════════════════════════════════════════
 * Texts your phone the moment someone books, and emails you the full details.
 *
 * This is NOT the web app in Code.gs. It lives inside the booking form's
 * responses Sheet, so there is nothing to deploy, no web-app URL, and no
 * "who has access" setting to get wrong.
 *
 * ── SETUP ──────────────────────────────────────────────────────────────────
 *   1. Open the booking form's responses Sheet.
 *   2. Extensions → Apps Script.
 *   3. Select ALL the placeholder code in the editor and paste this over it.
 *      (This whole file — the first line is a comment, not a project name.)
 *   4. Save.
 *   5. Function dropdown → `setup` → Run. Authorize when asked.
 *   6. Function dropdown → `testAlert` → Run. Your phone should buzz.
 *
 * Run `setup` once. Running it again is safe — it clears the old trigger first,
 * so you cannot end up with two texts per booking.
 */

// ── Settings ───────────────────────────────────────────────────────────────

/**
 * Your phone, as your carrier's email-to-text address.
 *
 * T-Mobile: 8649154071@tmomail.net
 * If you change carriers, swap the domain: Verizon @vtext.com,
 * AT&T @txt.att.net. Number only, no +1, no dashes.
 */
var SMS_TO = "8649154071@tmomail.net";

/** Full booking details by email. Blank = the account this script runs as. */
var EMAIL_TO = "";

// ── Setup ──────────────────────────────────────────────────────────────────

function setup() {
  // Clear first. Triggers stack silently, and a second one means two texts per
  // booking with no clue where the duplicate came from.
  var existing = ScriptApp.getProjectTriggers();
  for (var i = 0; i < existing.length; i++) {
    if (existing[i].getHandlerFunction() === "onBookingSubmit") {
      ScriptApp.deleteTrigger(existing[i]);
    }
  }

  ScriptApp.newTrigger("onBookingSubmit")
    .forSpreadsheet(SpreadsheetApp.getActive())
    .onFormSubmit()
    .create();

  Logger.log("Done. Bookings will now text " + SMS_TO + " and email " + inbox());
}

function inbox() {
  if (EMAIL_TO) return EMAIL_TO;
  try {
    return Session.getEffectiveUser().getEmail();
  } catch (err) {
    return "";
  }
}

// ── Reading the response ───────────────────────────────────────────────────

/**
 * Look a question up by title, forgivingly.
 *
 * The form's question titles are not tidy — several carry a trailing space
 * ("Phone number ", "budget "), and the casing is inconsistent. Matching them
 * literally would work until someone tidied a title in the form, then fail
 * silently: the text would still send, with blank fields. So every key is
 * trimmed and lowercased, and a prefix match is accepted.
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

// ── The alert ──────────────────────────────────────────────────────────────

function onBookingSubmit(e) {
  var named = (e && e.namedValues) || {};

  var lead = {
    name: field(named, "name"),
    business: clean(field(named, "business")),
    email: field(named, "email"),
    phone: field(named, "phone"),
    projectType: field(named, "project type"),
    budget: field(named, "budget"),
    shootDate: field(named, "shoot date"),
    location: clean(field(named, "location")),
    message: field(named, "message"),
  };

  // Independent on purpose: a carrier gateway that drops the text must never
  // cost you the email as well. Neither is allowed to throw.
  sendText(lead);
  sendEmail(lead);
}

/**
 * The text.
 *
 * Carrier gateways split anything long into multiple messages and some simply
 * truncate, so this stays short and front-loads what you need to decide whether
 * to call back now: who, what, and how much. The full brief is in the email.
 */
function sendText(lead) {
  try {
    if (!SMS_TO) return;

    var lines = ["New booking — 508 Filmzz", ""];
    lines.push(lead.name || "(no name)");
    if (lead.business) lines.push(lead.business);
    if (lead.phone) lines.push(lead.phone);

    var summary = [lead.projectType, lead.budget].filter(String).join(" · ");
    if (summary) lines.push(summary);
    if (lead.shootDate) lines.push("Shoot: " + lead.shootDate);

    MailApp.sendEmail(SMS_TO, "New booking", lines.join("\n"));
  } catch (err) {
    Logger.log("text failed: " + err);
  }
}

/** The full brief, with reply-to set so hitting Reply answers the client. */
function sendEmail(lead) {
  try {
    var to = inbox();
    if (!to) return;

    var rows = [
      ["Name", lead.name],
      ["Business", lead.business],
      ["Email", lead.email],
      ["Phone", lead.phone],
      ["Project", lead.projectType],
      ["Budget", lead.budget],
      ["Shoot date", lead.shootDate],
      ["Location", lead.location],
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
  } catch (err) {
    Logger.log("email failed: " + err);
  }
}

// ── Test ───────────────────────────────────────────────────────────────────

/** Run this from the editor to check both alerts without filling the form. */
function testAlert() {
  onBookingSubmit({
    namedValues: {
      "Name": ["Mike Sanders"],
      "Business Name": ["Sanders Diesel"],
      "Email": ["mike@example.com"],
      "Phone number ": ["(864) 555-0142"],
      "project type ": ["Automotive"],
      "budget ": ["$1,000 – $2,500"],
      "shoot date ": ["Fri, Sep 11, 2026"],
      "location of shoot ": ["Greenville, SC"],
      "messages/tell me about your project ": [
        "TEST alert from the script editor. If this reached your phone and your inbox, booking alerts are working.",
      ],
    },
  });
  Logger.log("Sent. Check your phone and " + inbox());
}
