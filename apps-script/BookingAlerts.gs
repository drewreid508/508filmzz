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

/**
 * Pushover — the reliable channel.
 * ─────────────────────────────────────────────────────────────────────────────
 * The carrier gateway above is free but it is a courtesy service: T-Mobile
 * filters it, delays it, and drops it, and you never find out which. Pushover
 * is a $4.99 one-off iPhone app with a real API — it either delivers or returns
 * an error you can read.
 *
 * Set these in Project Settings → Script Properties. They are NOT written in
 * this file, because this repository is public:
 *
 *   PUSHOVER_TOKEN   the API token from your Pushover application
 *   PUSHOVER_USER    your user key, on the Pushover dashboard
 *
 * Leave them unset and nothing changes — the channel simply sits out.
 */
function prop(key) {
  var v = PropertiesService.getScriptProperties().getProperty(key);
  return v === null ? "" : v;
}

// ── Setup ──────────────────────────────────────────────────────────────────

/**
 * Run this any time to see what is actually wired up.
 *
 * The question that has been impossible to answer from the outside is whether
 * the trigger exists at all — without it nothing runs on a booking, and every
 * notification channel is irrelevant. This says so in one line.
 */
function status() {
  var triggers = ScriptApp.getProjectTriggers().filter(function (t) {
    return t.getHandlerFunction() === "onBookingSubmit";
  });

  Logger.log("Trigger installed : " + (triggers.length ? "YES (" + triggers.length + ")" : "NO  <-- run setup"));
  Logger.log("Email to          : " + (inbox() || "NONE"));
  Logger.log("Carrier text to   : " + (SMS_TO || "NONE"));
  Logger.log("Pushover          : " + (prop("PUSHOVER_TOKEN") && prop("PUSHOVER_USER") ? "configured" : "not configured"));
  Logger.log("Mail quota left   : " + MailApp.getRemainingDailyQuota());

  if (!triggers.length) {
    throw new Error("No trigger installed — bookings are not calling this script. Run setup.");
  }
  return "ok";
}

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
  sendPush(lead);
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
    if (!SMS_TO) return { ok: false, error: "SMS_TO is empty" };

    var lines = ["New booking — 508 Filmzz", ""];
    lines.push(lead.name || "(no name)");
    if (lead.business) lines.push(lead.business);
    if (lead.phone) lines.push(lead.phone);

    var summary = [lead.projectType, lead.budget].filter(String).join(" · ");
    if (summary) lines.push(summary);
    if (lead.shootDate) lines.push("Shoot: " + lead.shootDate);

    MailApp.sendEmail(SMS_TO, "New booking", lines.join("\n"));
    return { ok: true, error: "" };
  } catch (err) {
    Logger.log("text failed: " + err);
    return { ok: false, error: String(err) };
  }
}

/**
 * Pushover push notification.
 *
 * Unlike the carrier gateway this reports back: a non-200 means it did not
 * arrive, and the reason comes back in the body rather than vanishing.
 */
function sendPush(lead) {
  try {
    var token = prop("PUSHOVER_TOKEN");
    var user = prop("PUSHOVER_USER");
    if (!token || !user) return { ok: false, error: "not configured" };

    var lines = [];
    if (lead.business) lines.push(lead.business);
    if (lead.phone) lines.push(lead.phone);
    if (lead.email) lines.push(lead.email);
    var svc = [lead.projectType, lead.budget].filter(String).join(" · ");
    if (svc) lines.push(svc);
    if (lead.shootDate) lines.push("Shoot: " + lead.shootDate);
    if (lead.location) lines.push(lead.location);
    if (lead.message) lines.push("", lead.message);

    var res = UrlFetchApp.fetch("https://api.pushover.net/1/messages.json", {
      method: "post",
      payload: {
        token: token,
        user: user,
        title: "📸 NEW 508 FILMZZ BOOKING",
        message: (lead.name || "Someone") + " just booked a shoot.\n\n" + lines.join("\n"),
        priority: "1",       // bypasses quiet hours
        sound: "persistent",
      },
      muteHttpExceptions: true,
    });

    var code = res.getResponseCode();
    if (code !== 200) return { ok: false, error: "HTTP " + code + " " + res.getContentText().slice(0, 160) };
    return { ok: true, error: "" };
  } catch (err) {
    Logger.log("push failed: " + err);
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
    return { ok: true, error: "" };
  } catch (err) {
    Logger.log("email failed: " + err);
    return { ok: false, error: String(err) };
  }
}

// ── Test ───────────────────────────────────────────────────────────────────

/**
 * Run this from the editor to check both alerts without filling the form.
 *
 * Unlike a real booking, this one is LOUD. During a booking a failed channel is
 * swallowed so it cannot take the other down with it — but that same silence
 * makes a test that quietly does nothing impossible to diagnose. Here, anything
 * that fails is thrown, so the editor shows you the reason instead of you
 * staring at a phone that never buzzes.
 */
function testAlert() {
  var lead = {
    name: "Mike Sanders",
    business: "Sanders Diesel",
    email: "mike@example.com",
    phone: "(864) 555-0142",
    projectType: "Automotive",
    budget: "$1,000 – $2,500",
    shootDate: "Fri, Sep 11, 2026",
    location: "Greenville, SC",
    message: "TEST alert. If this reached your phone and inbox, alerts work.",
  };

  Logger.log("Texting:  " + SMS_TO);
  Logger.log("Emailing: " + (inbox() || "(NO ADDRESS — this is the problem)"));
  Logger.log("Quota left today: " + MailApp.getRemainingDailyQuota());

  var push = sendPush(lead);
  var text = sendText(lead);
  var mail = sendEmail(lead);

  Logger.log("push  -> " + (push.ok ? "sent" : push.error));
  Logger.log("text  -> " + (text.ok ? "sent" : "FAILED: " + text.error));
  Logger.log("email -> " + (mail.ok ? "sent" : "FAILED: " + mail.error));

  if (!text.ok || !mail.ok) {
    throw new Error(
      "text: " + (text.ok ? "sent" : text.error) +
      " | email: " + (mail.ok ? "sent" : mail.error)
    );
  }

  Logger.log("Both sent. Check your phone and " + inbox() + " (look in spam).");
}

/** The old test, kept: exercises the field-title parsing too. */
function testFormParsing() {
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
