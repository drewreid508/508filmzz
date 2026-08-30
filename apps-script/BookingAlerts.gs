/**
 * 508 FILMZZ — booking alerts
 * ═══════════════════════════════════════════════════════════════════════════
 * Emails you the moment someone books, and sends the client a receipt.
 *
 * ── NO SMS SERVICE, ON PURPOSE ─────────────────────────────────────────────
 * Textbelt is gone. Every paid SMS route added an account, a key and a bill
 * for something Gmail already does: the Gmail app on an iPhone pushes a
 * banner the moment mail lands, which is the same buzz in your pocket.
 *
 * It also removes the last credential from this file. There is now nothing
 * here that can leak, expire, run out of credit, or silently refuse.
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
 *   4. Save.
 *   5. Function dropdown → setup → Run. Authorise when asked.
 *   6. Function dropdown → status → Run. Every line should read YES or a value.
 *   7. Function dropdown → testAlert → Run. Check your inbox.
 *
 * Then turn on Gmail notifications on your iPhone and the email becomes a
 * push alert. Nothing to buy and nothing to configure here.
 */

// ═══════════════════════════════════════════════════════════════════════════
// SETTINGS — one optional line
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Where bookings are emailed. Leave blank and it goes to the Google account
 * this script runs as, which is almost always what you want.
 */
var EMAIL_TO = "";

// ═══════════════════════════════════════════════════════════════════════════
// Nothing below here needs editing
// ═══════════════════════════════════════════════════════════════════════════

var STUDIO_NAME = "508 Filmzz";
var STUDIO_TAGLINE = "Cinematic media built to move.";
var STUDIO_EMAIL = "508filmz@gmail.com";
var STUDIO_PHONE = "864-915-4071";

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

  Logger.log("Setup complete. Bookings will now email " + inbox() + ".");
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
  Logger.log("Email to          : " + (inbox() || "NONE  <-- this is the problem"));
  Logger.log("Mail quota left   : " + MailApp.getRemainingDailyQuota());

  if (!book) throw new Error("Not attached to a spreadsheet. See setup.");
  if (!triggers.length) throw new Error("No trigger installed. Run setup.");
  if (!inbox()) throw new Error("No inbox address. Set EMAIL_TO at the top.");
  return "ok";
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

  // Each is attempted on its own and neither may throw: a failure reaching you
  // must never cost the client their receipt, or the reverse.
  sendEmail(lead);
  sendClientReceipt(lead);
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
 * throws with whatever reason the failure gave.
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

  Logger.log("Emailing: " + (inbox() || "(NO ADDRESS - this is the problem)"));

  var mail = sendEmail(lead);
  var receipt = sendClientReceipt(lead);

  Logger.log("your email   -> " + (mail.ok ? "sent" : "FAILED: " + mail.error));
  Logger.log("client email -> " + (receipt.ok ? "sent" : receipt.error));

  if (!mail.ok) throw new Error("email: " + mail.error);

  Logger.log("Sent. Check " + inbox() + " — look in spam the first time.");
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
