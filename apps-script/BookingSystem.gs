/**
 * 508 FILMZZ — booking & contract system
 * ═══════════════════════════════════════════════════════════════════════════
 * Replaces BookingAlerts.gs. Everything that file did, plus approval,
 * a signable contract, and status tracking.
 *
 * FLOW
 *   Website form → Google Form → this Sheet → onBookingSubmit
 *     · row stamped "New Request" with a private token
 *     · client gets "Booking Request Received"
 *     · you get an email + a text
 *   You pick the row → 508 Filmzz menu → Approve
 *     · status "Confirmed", contract link generated
 *     · client gets "Shoot Confirmed" with their own contract link
 *   Client signs on their phone
 *     · signature saved to Drive, status "Contract Signed"
 *     · you get an email + a text, client gets "Agreement Received"
 *
 * WHAT THIS NEEDS THAT THE OLD SCRIPT DID NOT
 * A web app deployment. A contract that prefills itself, is unique per client,
 * and records a signature has to be served by something — and GitHub Pages
 * serves files only. Deploying this script as a web app is the whole of that
 * "something": no server to rent, no third-party e-sign subscription.
 */

// ═══════════════════════════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════════════════════════

/** Your phone for booking texts. Digits only. Leave "" to switch texts off. */
var SMS_TO_NUMBER = "8649154071";

/** Textbelt key from textbelt.com. Leave the placeholder to switch texts off. */
var TEXTBELT_KEY = "PASTE_YOUR_TEXTBELT_KEY_HERE";

/** Where your copy of everything goes. Blank = the Google account this runs as. */
var EMAIL_TO = "";

/** Shown to clients as the sender and in the contract. */
var STUDIO_NAME = "508 Filmzz";
var STUDIO_TAGLINE = "Cinematic media built to move.";
var STUDIO_EMAIL = "508filmz@gmail.com";
var STUDIO_PHONE = "(864) 915-4071";

/** Drive folder for signature images. Blank = the root of your Drive. */
var SIGNATURE_FOLDER_ID = "";

// ═══════════════════════════════════════════════════════════════════════════
// Nothing below here needs editing for day-to-day use
// ═══════════════════════════════════════════════════════════════════════════

var TEXTBELT_URL = "https://textbelt.com/text";

/** Appended to the right of whatever columns the Google Form writes. */
var ADMIN_HEADERS = [
  "Status",
  "Token",
  "Contract Link",
  "Approved At",
  "Contract Sent At",
  "Signed At",
  "Signed By",
  "Signature File",
  "Closed At",
  "Promo Code Used",
  "First-Time Discount",
  "Repeat Client",
  "Admin Notes",
];

var STATUSES = [
  "New Request",
  "Under Review",
  "Confirmed",
  "Contract Sent",
  "Contract Signed",
  "Completed",
  "Cancelled",
];

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

function sheet() {
  var book = SpreadsheetApp.getActive();
  if (!book) return null;
  // The form's responses tab is the one the trigger fires against. Named tabs
  // get renamed; the first sheet is what Google actually writes to.
  return book.getSheets()[0];
}

// ═══════════════════════════════════════════════════════════════════════════
// Setup, menu, diagnostics
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Runs whenever you open the spreadsheet. Adds the 508 Filmzz menu.
 *
 * A simple trigger, so it needs no authorisation of its own — the menu is
 * there the first time you open the Sheet after pasting this in.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("508 Filmzz")
    .addItem("Approve selected booking", "approveSelected")
    .addItem("Resend contract link", "resendContract")
    .addSeparator()
    .addItem("Mark completed", "markCompleted")
    .addItem("Cancel booking", "cancelSelected")
    .addSeparator()
    .addItem("Check system status", "status")
    .addItem("Send a test booking", "testBooking")
    .addToUi();
}

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

  // Triggers stack silently; a second one means two of every email.
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

  Logger.log("Setup complete. Reload the Sheet to see the 508 Filmzz menu.");
}

/**
 * Adds the admin columns once, to the right of the form's own columns.
 *
 * Anchored to the header row rather than a fixed column number: the Google
 * Form owns the left-hand columns and inserts a new one whenever a question is
 * added, which would silently shift hard-coded positions and start writing
 * statuses into a client's phone number.
 */
function ensureAdminColumns() {
  var sh = sheet();
  var lastCol = sh.getLastColumn();
  var headers = sh.getRange(1, 1, 1, Math.max(lastCol, 1)).getValues()[0];

  var missing = ADMIN_HEADERS.filter(function (h) {
    return headers.indexOf(h) === -1;
  });
  if (!missing.length) return;

  sh.getRange(1, lastCol + 1, 1, missing.length).setValues([missing]);
  sh.getRange(1, 1, 1, lastCol + missing.length)
    .setFontWeight("bold")
    .setBackground("#111111")
    .setFontColor("#ffffff");
  sh.setFrozenRows(1);

  // A dropdown on Status, so a booking cannot end up in a state nothing checks.
  var statusCol = colOf("Status");
  if (statusCol) {
    var rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(STATUSES, true)
      .setAllowInvalid(false)
      .build();
    sh.getRange(2, statusCol, Math.max(sh.getMaxRows() - 1, 1), 1).setDataValidation(rule);
  }
}

/** 1-based column index for a header, or 0. */
function colOf(header) {
  var sh = sheet();
  var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  return headers.indexOf(header) + 1;
}

function status() {
  var book = SpreadsheetApp.getActive();
  var triggers = ScriptApp.getProjectTriggers().filter(function (t) {
    return t.getHandlerFunction() === "onBookingSubmit";
  });
  var url = webAppUrl();

  var lines = [
    "Attached to Sheet : " + (book ? book.getName() : "NOTHING  <-- wrong project"),
    "Trigger installed : " + (triggers.length ? "YES" : "NO  <-- run setup"),
    "Admin columns     : " + (colOf("Status") ? "YES" : "NO  <-- run setup"),
    "Web app deployed  : " + (url ? url : "NO  <-- Deploy > New deployment > Web app"),
    "Email to          : " + (inbox() || "NONE"),
    "SMS to            : " + (SMS_TO_NUMBER || "off"),
    "Textbelt key      : " + (keyMissing() ? "NOT SET  <-- texts are off" : "set"),
    "Mail quota left   : " + MailApp.getRemainingDailyQuota(),
  ];
  lines.forEach(function (l) { Logger.log(l); });

  try {
    SpreadsheetApp.getUi().alert("508 Filmzz — system status", lines.join("\n"), SpreadsheetApp.getUi().ButtonSet.OK);
  } catch (err) {
    // Running from the editor rather than the Sheet: the log is the output.
  }

  if (!book) throw new Error("Not attached to a spreadsheet.");
  if (!triggers.length) throw new Error("No trigger installed. Run setup.");
  return "ok";
}

/** The deployed web app's URL, or "" before the first deployment. */
function webAppUrl() {
  try {
    var url = ScriptApp.getService().getUrl();
    return url || "";
  } catch (err) {
    return "";
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Reading a booking
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Look a question up by title, forgivingly.
 *
 * The form's titles carry trailing spaces ("Phone number ", "budget ") and
 * inconsistent casing. Matching literally works until a title is tidied, then
 * fails silently — emails still sending, fields blank.
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
  if (!v || v === "(not given)") return "";
  return v;
}

/**
 * Pulls the requested time out of the message.
 *
 * The Google Form has no time question yet, so the website appends
 * "Preferred time: ..." to the project details. Reading it back here means the
 * time is captured today, and the moment a real time question is added this
 * finds that instead and the fallback stops being used.
 */
function extractTime(named, message) {
  var explicit = clean(field(named, "shoot time")) || clean(field(named, "preferred time"));
  if (explicit) return explicit;
  var m = /preferred time\s*:\s*([^\n\r]+)/i.exec(message || "");
  return m ? m[1].trim() : "";
}

function leadFromNamedValues(named) {
  var message = field(named, "message");
  return {
    name: field(named, "name"),
    business: clean(field(named, "business")),
    email: field(named, "email"),
    phone: field(named, "phone"),
    service: field(named, "project type"),
    budget: field(named, "budget"),
    date: field(named, "shoot date"),
    time: extractTime(named, message),
    location: clean(field(named, "location")),
    message: message,
  };
}

/** Same shape, read back out of a row — used by approval and the contract. */
function leadFromRow(rowIndex) {
  var sh = sheet();
  var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  var values = sh.getRange(rowIndex, 1, 1, sh.getLastColumn()).getValues()[0];

  var named = {};
  for (var i = 0; i < headers.length; i++) {
    if (headers[i]) named[headers[i]] = [values[i]];
  }

  var lead = leadFromNamedValues(named);
  lead.row = rowIndex;
  lead.status = get(headers, values, "Status");
  lead.token = get(headers, values, "Token");
  lead.contractLink = get(headers, values, "Contract Link");
  lead.signedAt = get(headers, values, "Signed At");
  lead.signedBy = get(headers, values, "Signed By");
  return lead;
}

function get(headers, values, header) {
  var i = headers.indexOf(header);
  return i === -1 ? "" : String(values[i] == null ? "" : values[i]).trim();
}

function setCell(rowIndex, header, value) {
  var c = colOf(header);
  if (c) sheet().getRange(rowIndex, c).setValue(value);
}

function stamp() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm");
}

/** Unguessable per-booking token. Nothing about it is derived from the client. */
function makeToken() {
  return Utilities.getUuid().replace(/-/g, "");
}

function findRowByToken(token) {
  if (!token) return 0;
  var sh = sheet();
  var c = colOf("Token");
  if (!c || sh.getLastRow() < 2) return 0;
  var values = sh.getRange(2, c, sh.getLastRow() - 1, 1).getValues();
  for (var i = 0; i < values.length; i++) {
    if (String(values[i][0]).trim() === token) return i + 2;
  }
  return 0;
}

// ═══════════════════════════════════════════════════════════════════════════
// STEP 1 + 2 — a booking arrives
// ═══════════════════════════════════════════════════════════════════════════

function onBookingSubmit(e) {
  ensureAdminColumns();

  var lead = leadFromNamedValues((e && e.namedValues) || {});
  var promo = promoFromMessage(lead.message);
  var repeat = hasBookedBefore(lead.email, (e && e.range && e.range.getRow()) || 0);
  var row = (e && e.range && e.range.getRow()) || sheet().getLastRow();
  lead.row = row;
  lead.token = makeToken();

  setCell(row, "Status", "New Request");
  setCell(row, "Token", lead.token);
  setCell(row, "Promo Code Used", promo.code || "None");
  setCell(row, "First-Time Discount", promo.valid ? "Yes" : "No");
  setCell(row, "Repeat Client", repeat ? "YES — check eligibility" : "No");

  // Independent on purpose: one failing channel must not stop the others, and
  // a throw anywhere here would abandon the rest of the booking.
  emailClientReceived(lead);
  emailStudioNew(lead);
  sendText(studioSmsText(lead));
}

function emailClientReceived(lead) {
  try {
    if (!lead.email || lead.email.indexOf("@") < 1) return;
    var body =
      "🎥 " + STUDIO_NAME + " — Booking Request Received\n\n" +
      "Hey! Thanks for booking with " + STUDIO_NAME + ". Your shoot request has " +
      "been received and I'm reviewing the details now.\n\n" +
      "📅 Requested Date: " + or(lead.date, "To be confirmed") + "\n" +
      "⏰ Requested Time: " + or(lead.time, "To be confirmed") + "\n" +
      "📍 Location: " + or(lead.location, "To be confirmed") + "\n" +
      "🎬 Service: " + or(lead.service, "To be confirmed") + "\n\n" +
      "I'll confirm your availability and send over the next steps shortly.\n\n" +
      "Once everything is approved, you'll receive the " + STUDIO_NAME +
      " Client Agreement to review and sign.\n\n" +
      "Thanks for choosing " + STUDIO_NAME + " — " + STUDIO_TAGLINE + "\n\n" +
      STUDIO_PHONE + " · " + STUDIO_EMAIL + "\n";

    MailApp.sendEmail({
      to: lead.email,
      subject: STUDIO_NAME + " — booking request received",
      body: body,
      name: STUDIO_NAME,
      replyTo: STUDIO_EMAIL,
    });
  } catch (err) {
    Logger.log("client receipt failed: " + err);
  }
}

function emailStudioNew(lead) {
  try {
    var to = inbox();
    if (!to) return;
    var body =
      "NEW BOOKING REQUEST\n\n" +
      detailBlock(lead) + "\n" +
      "Project details:\n" + or(lead.message, "(none)") + "\n\n" +
      (promoFromMessage(lead.message).valid
        ? "PROMO: FIRST15 claimed — check the Repeat Client column before honouring it.\n\n"
        : "") +
      "─────────────────────────────\n" +
      "TO APPROVE: open the bookings Sheet, click this booking's row,\n" +
      "then 508 Filmzz > Approve selected booking.\n" +
      "That sets it to Confirmed and emails the client their contract link.\n";

    var options = { name: STUDIO_NAME };
    if (lead.email && lead.email.indexOf("@") > 0) options.replyTo = lead.email;

    MailApp.sendEmail(
      to,
      "New booking — " + or(lead.name, "someone") + (lead.service ? " (" + lead.service + ")" : ""),
      body,
      options
    );
  } catch (err) {
    Logger.log("studio email failed: " + err);
  }
}

function detailBlock(lead) {
  var rows = [
    ["Client", lead.name],
    ["Business", lead.business],
    ["Phone", lead.phone],
    ["Email", lead.email],
    ["Date", lead.date],
    ["Time", lead.time],
    ["Location", lead.location],
    ["Service", lead.service],
    ["Budget", lead.budget],
  ];
  var out = "";
  for (var i = 0; i < rows.length; i++) {
    if (rows[i][1]) out += rows[i][0] + ": " + rows[i][1] + "\n";
  }
  return out;
}

function studioSmsText(lead) {
  var lines = ["508 FILMZZ - NEW BOOKING", ""];
  lines.push(or(lead.name, "Someone") + " just requested a shoot.");
  if (lead.date) lines.push("Date: " + lead.date + (lead.time ? " " + lead.time : ""));
  if (lead.business) lines.push("Business: " + lead.business);
  if (lead.service) lines.push("Service: " + lead.service);
  if (lead.location) lines.push("Location: " + lead.location);
  if (lead.phone) lines.push("Call: " + lead.phone);
  lines.push("", "Approve it in the Sheet.");
  return lines.join("\n");
}

/**
 * Reads the promo code back out of the project details.
 *
 * The website appends it there because the Google Form has no field for it.
 * Recording it in its own column is what makes eligibility checkable at all —
 * a static page cannot know who has booked before, so the judgement happens
 * here, against the Sheet, where the history actually lives.
 */
function promoFromMessage(message) {
  var m = /promo code used\s*:\s*([^\n\r]+)/i.exec(message || "");
  if (!m) return { code: "", valid: false };
  var code = m[1].trim();
  var v = /first-time discount\s*:\s*(yes)/i.test(message || "");
  return { code: code, valid: v };
}

/**
 * Has this email booked before?
 *
 * Advisory, not enforcement. The row is flagged so the code can be honoured or
 * declined on the quote — silently refusing it on the website would be a rule
 * the visitor cannot see, applied to a person who may simply have mistyped
 * their address last time.
 */
function hasBookedBefore(email, currentRow) {
  try {
    if (!email) return false;
    var sh = sheet();
    var c = colOf("Email");
    if (!c || sh.getLastRow() < 3) return false;
    var values = sh.getRange(2, c, sh.getLastRow() - 1, 1).getValues();
    var target = String(email).trim().toLowerCase();
    var seen = 0;
    for (var i = 0; i < values.length; i++) {
      if (i + 2 === currentRow) continue;
      if (String(values[i][0]).trim().toLowerCase() === target) seen++;
    }
    return seen > 0;
  } catch (err) {
    return false;
  }
}

function or(v, fallback) {
  return v ? v : fallback;
}

// ═══════════════════════════════════════════════════════════════════════════
// STEP 3 — approving from the Sheet
// ═══════════════════════════════════════════════════════════════════════════

function selectedRow() {
  var sh = sheet();
  var row = sh.getActiveRange() ? sh.getActiveRange().getRow() : 0;
  if (row < 2) {
    ui().alert("Click any cell in the booking's row first, then choose the menu item again.");
    return 0;
  }
  return row;
}

function ui() {
  return SpreadsheetApp.getUi();
}

function approveSelected() {
  var row = selectedRow();
  if (!row) return;

  ensureAdminColumns();
  var lead = leadFromRow(row);

  if (!lead.email || lead.email.indexOf("@") < 1) {
    ui().alert("That row has no usable client email, so the contract cannot be sent.");
    return;
  }

  var url = webAppUrl();
  if (!url) {
    ui().alert(
      "No web app deployment yet.\n\n" +
      "In the Apps Script editor: Deploy > New deployment > Web app, " +
      "Execute as Me, Who has access Anyone. Then approve again."
    );
    return;
  }

  if (!lead.token) {
    lead.token = makeToken();
    setCell(row, "Token", lead.token);
  }

  var link = url + "?t=" + lead.token;
  var confirmed = ui().alert(
    "Approve this booking?",
    "Client: " + or(lead.name, "(no name)") + "\n" +
    "Date: " + or(lead.date, "TBC") + "  Time: " + or(lead.time, "TBC") + "\n\n" +
    "This sets the booking to Confirmed and emails " + lead.email +
    " their contract link.",
    ui().ButtonSet.OK_CANCEL
  );
  if (confirmed !== ui().Button.OK) return;

  setCell(row, "Status", "Contract Sent");
  setCell(row, "Contract Link", link);
  setCell(row, "Approved At", stamp());
  setCell(row, "Contract Sent At", stamp());

  emailClientConfirmed(lead, link);
  ui().alert("Approved. Contract link emailed to " + lead.email + ".");
}

function emailClientConfirmed(lead, link) {
  var body =
    "🎥 " + STUDIO_NAME + " — Shoot Confirmed\n\n" +
    "You're officially booked! ✅\n\n" +
    "📅 Date: " + or(lead.date, "To be confirmed") + "\n" +
    "⏰ Time: " + or(lead.time, "To be confirmed") + "\n" +
    "📍 Location: " + or(lead.location, "To be confirmed") + "\n" +
    "🎬 Service: " + or(lead.service, "To be confirmed") + "\n\n" +
    "Before the shoot, please complete and sign the " + STUDIO_NAME +
    " Client Agreement using the link below:\n\n" +
    "🔗 " + link + "\n\n" +
    "The shoot is not fully locked in until the agreement is completed.\n" +
    "It takes about a minute and works on your phone.\n\n" +
    "If you have any questions or need to make changes to the shoot, just reply here.\n\n" +
    STUDIO_NAME + "\n" + STUDIO_TAGLINE + "\n" +
    STUDIO_PHONE + " · " + STUDIO_EMAIL + "\n";

  MailApp.sendEmail({
    to: lead.email,
    subject: STUDIO_NAME + " — shoot confirmed, one step left",
    body: body,
    name: STUDIO_NAME,
    replyTo: STUDIO_EMAIL,
  });
}

function resendContract() {
  var row = selectedRow();
  if (!row) return;
  var lead = leadFromRow(row);
  if (!lead.token || !lead.contractLink) {
    ui().alert("This booking has no contract link yet. Approve it first.");
    return;
  }
  emailClientConfirmed(lead, lead.contractLink);
  setCell(row, "Contract Sent At", stamp());
  ui().alert("Contract link resent to " + lead.email + ".");
}

function markCompleted() {
  var row = selectedRow();
  if (!row) return;
  setCell(row, "Status", "Completed");
  setCell(row, "Closed At", stamp());
  ui().alert("Marked completed.");
}

function cancelSelected() {
  var row = selectedRow();
  if (!row) return;
  var yes = ui().alert("Cancel this booking?", "The client is not emailed automatically.", ui().ButtonSet.OK_CANCEL);
  if (yes !== ui().Button.OK) return;
  setCell(row, "Status", "Cancelled");
  setCell(row, "Closed At", stamp());
  ui().alert("Marked cancelled.");
}

// ═══════════════════════════════════════════════════════════════════════════
// STEP 4 — the contract, served by this script
// ═══════════════════════════════════════════════════════════════════════════

function doGet(e) {
  var token = (e && e.parameter && e.parameter.t) || "";
  var row = findRowByToken(token);

  if (!row) return page(notFoundHtml());

  var lead = leadFromRow(row);
  if (lead.signedAt) return page(alreadySignedHtml(lead));
  return page(contractHtml(lead));
}

function page(html) {
  return HtmlService.createHtmlOutput(html)
    .setTitle(STUDIO_NAME + " — Client Agreement")
    .addMetaTag("viewport", "width=device-width, initial-scale=1")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Called from the contract page by google.script.run.
 *
 * Deliberately not doPost: google.script.run runs inside Google's own frame,
 * so there is no cross-origin request to arrange and no endpoint accepting
 * anonymous posts. The token still decides which booking is written to.
 */
function submitSignature(payload) {
  var row = findRowByToken(payload && payload.token);
  if (!row) return { ok: false, error: "This link is no longer valid." };

  var lead = leadFromRow(row);
  if (lead.signedAt) return { ok: false, error: "This agreement has already been signed." };

  var typed = String((payload && payload.typedName) || "").trim();
  if (typed.length < 2) return { ok: false, error: "Please type your full name to sign." };

  var fileUrl = "";
  try {
    if (payload.signatureImage && payload.signatureImage.indexOf("data:image") === 0) {
      var base64 = payload.signatureImage.split(",")[1];
      var blob = Utilities.newBlob(Utilities.base64Decode(base64), "image/png",
        "signature-" + (lead.name || "client").replace(/[^\w]+/g, "-") + "-" + lead.token.slice(0, 8) + ".png");
      var folder = SIGNATURE_FOLDER_ID ? DriveApp.getFolderById(SIGNATURE_FOLDER_ID) : DriveApp.getRootFolder();
      fileUrl = folder.createFile(blob).getUrl();
    }
  } catch (err) {
    // A signature image that will not save must not lose the signature itself —
    // the typed name and timestamp are the parts that carry legal weight.
    Logger.log("signature image failed: " + err);
  }

  var when = stamp();
  setCell(row, "Status", "Contract Signed");
  setCell(row, "Signed At", when);
  setCell(row, "Signed By", typed);
  if (fileUrl) setCell(row, "Signature File", fileUrl);

  lead.signedAt = when;
  lead.signedBy = typed;

  emailClientSigned(lead);
  emailStudioSigned(lead, fileUrl);
  sendText(
    "508 FILMZZ - AGREEMENT SIGNED\n\n" + typed + " signed the agreement.\n" +
    (lead.date ? "Shoot: " + lead.date + (lead.time ? " " + lead.time : "") + "\n" : "") +
    (lead.location ? lead.location + "\n" : "")
  );

  return { ok: true, signedAt: when };
}

function emailClientSigned(lead) {
  try {
    var body =
      "✅ " + STUDIO_NAME + " — Agreement Received\n\n" +
      "Your client agreement has been successfully completed and your shoot is " +
      "officially locked in.\n\n" +
      "📅 Date: " + or(lead.date, "To be confirmed") + "\n" +
      "⏰ Time: " + or(lead.time, "To be confirmed") + "\n" +
      "📍 Location: " + or(lead.location, "To be confirmed") + "\n\n" +
      "I'll see you on shoot day.\n\n" +
      "Thanks for choosing " + STUDIO_NAME + ".\n" + STUDIO_TAGLINE + "\n" +
      STUDIO_PHONE + " · " + STUDIO_EMAIL + "\n";

    MailApp.sendEmail({
      to: lead.email,
      subject: STUDIO_NAME + " — agreement received, you're locked in",
      body: body,
      name: STUDIO_NAME,
      replyTo: STUDIO_EMAIL,
    });
  } catch (err) {
    Logger.log("client signed email failed: " + err);
  }
}

function emailStudioSigned(lead, fileUrl) {
  try {
    var to = inbox();
    if (!to) return;
    MailApp.sendEmail(
      to,
      "Agreement signed — " + or(lead.name, "client"),
      "CONTRACT SIGNED\n\n" +
      "Signed by: " + lead.signedBy + "\n" +
      "Signed at: " + lead.signedAt + "\n" +
      (fileUrl ? "Signature image: " + fileUrl + "\n" : "") +
      "\n" + detailBlock(lead),
      { name: STUDIO_NAME }
    );
  } catch (err) {
    Logger.log("studio signed email failed: " + err);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SMS
// ═══════════════════════════════════════════════════════════════════════════

function sendText(message) {
  try {
    if (!SMS_TO_NUMBER || keyMissing()) return { ok: false, error: "texts not configured" };
    var res = UrlFetchApp.fetch(TEXTBELT_URL, {
      method: "post",
      payload: { phone: SMS_TO_NUMBER, message: message, key: TEXTBELT_KEY },
      muteHttpExceptions: true,
    });
    var body = JSON.parse(res.getContentText());
    if (!body.success) return { ok: false, error: body.error || "refused" };
    return { ok: true, quotaRemaining: body.quotaRemaining };
  } catch (err) {
    Logger.log("text failed: " + err);
    return { ok: false, error: String(err) };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Test
// ═══════════════════════════════════════════════════════════════════════════

/** Writes a fake booking through the real path, so every step is exercised. */
function testBooking() {
  onBookingSubmit({
    namedValues: {
      "Name": ["Mike Sanders"],
      "Business Name": ["Sanders Diesel"],
      "Email": [inbox()],
      "Phone number ": ["(864) 555-0142"],
      "project type ": ["Automotive"],
      "budget ": ["$1,000 - $2,500"],
      "shoot date ": ["Fri, Sep 11, 2026"],
      "location of shoot ": ["Greenville, SC"],
      "messages/tell me about your project ": [
        "TEST booking from the script. Preferred time: 2:00 PM",
      ],
    },
    range: sheet().getRange(sheet().getLastRow(), 1),
  });
  Logger.log("Test booking processed. Check " + inbox() + " and your phone.");
}

// ═══════════════════════════════════════════════════════════════════════════
// The contract page
// ═══════════════════════════════════════════════════════════════════════════

/**
 * The agreement itself.
 *
 * NOT LEGAL ADVICE. These are plain-language production terms written to be
 * readable and fair; have a lawyer review them before relying on them. Edit
 * freely — each entry is a heading and a paragraph, and the page builds itself
 * from this list.
 */
function agreementTerms(lead) {
  var monthly = monthlyTerms(lead);

  var terms = [
    ["Scope of work",
     "508 Filmzz will produce the service described above. Deliverables, shoot " +
     "length and locations are as quoted. Anything added later is quoted separately " +
     "before it is produced."],
    ["Scheduling",
     "The date and time above are reserved for you. If either of us needs to move " +
     "the shoot, we agree to give the other as much notice as reasonably possible " +
     "and to reschedule to the next mutually workable date."],
    ["Weather and conditions",
     "Outdoor and aerial work depends on conditions. If light, weather or safety " +
     "make the shoot unworkable, it is rescheduled rather than cancelled, at no " +
     "extra charge."],
    ["Payment",
     "Payment is due as quoted. Final delivery follows payment in full unless we " +
     "have agreed otherwise in writing."],
  ];

  if (monthly.isMonthly) {
    terms.push(["Monthly term", monthly.termText]);
    terms.push(["Introductory rate", monthly.discountText]);
  }

  terms = terms.concat([
    ["Cancellation",
     "You may cancel before the shoot; anything already produced or reserved is " +
     "chargeable. For monthly packages, the minimum term above applies before the " +
     "package can be ended."],
    ["Usage rights",
     "You receive the delivered files for your own marketing and social media use, " +
     "for as long as you want them. 508 Filmzz keeps ownership of the original " +
     "footage and the right to show the finished work as a portfolio piece. Tell me " +
     "before the shoot if any material must stay private and it will not be shown."],
    ["Delivery",
     "Most projects are delivered within 3 to 7 business days of the shoot. Larger " +
     "productions are quoted with their own timeline."],
  ]);

  return terms;
}

/**
 * Reads monthly terms back out of the project details.
 *
 * The website writes labelled lines into the message when a monthly package is
 * chosen, because the Google Form has no field for a rate. Parsing them here is
 * what puts the client's actual quoted price into their contract instead of a
 * figure typed by hand — which is the part that would eventually be wrong.
 */
function monthlyTerms(lead) {
  var msg = lead.message || "";
  var pkg = /monthly package\s*:\s*([^\n\r]+)/i.exec(msg);
  if (!pkg) return { isMonthly: false };

  var std = /standard rate\s*:\s*([^\n\r]+)/i.exec(msg);
  var first = /first month[^:]*:\s*([^\n\r]+)/i.exec(msg);
  var term = /minimum term\s*:\s*([^\n\r]+)/i.exec(msg);

  var packageName = pkg[1].trim();
  var standard = std ? std[1].trim() : "as quoted";
  var firstMonth = first ? first[1].trim() : "";
  var minimum = term ? term[1].trim() : "3 months";

  return {
    isMonthly: true,
    packageName: packageName,
    standard: standard,
    firstMonth: firstMonth,
    minimum: minimum,
    termText:
      "This is a monthly content package (" + packageName + ") at " + standard +
      ", with a minimum term of " + minimum + ". After the minimum term the " +
      "package continues month to month until either of us ends it.",
    discountText: firstMonth
      ? "As a new monthly client, month one is billed at " + firstMonth +
        ". Months after the first are billed at the standard rate of " + standard +
        ". The introductory rate applies to the first month only."
      : "Your rate is set by your quote.",
  };
}

function esc(v) {
  return String(v == null ? "" : v)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Shared shell: the site's palette, sized for a phone first. */
function shell(inner) {
  return '' +
'<style>' +
'*{box-sizing:border-box}' +
'body{margin:0;background:#0A0A0A;color:#F5F5F4;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased}' +
'.wrap{max-width:44rem;margin:0 auto;padding:2rem 1.15rem 4rem}' +
'.eyebrow{font-size:.62rem;letter-spacing:.2em;text-transform:uppercase;color:#7A7A78;margin:0 0 .5rem}' +
'.brand{font-size:.72rem;letter-spacing:.24em;text-transform:uppercase;color:#F5F5F4;font-weight:600}' +
'.accent{color:#1E90FF}' +
'h1{font-size:2rem;line-height:1.05;margin:.3rem 0 0;letter-spacing:-.01em}' +
'h2{font-size:.78rem;letter-spacing:.16em;text-transform:uppercase;color:#1E90FF;margin:2.4rem 0 .8rem;font-weight:600}' +
'.lead{color:#A3A3A0;margin:.9rem 0 0}' +
'.card{border:1px solid #262626;background:#141414;padding:1.15rem;margin-top:1.4rem;border-radius:2px}' +
'.row{display:flex;justify-content:space-between;gap:1rem;padding:.5rem 0;border-bottom:1px solid #1F1F1F;font-size:.9rem}' +
'.row:last-child{border-bottom:0}' +
'.row dt{color:#7A7A78;flex:none}' +
'.row dd{margin:0;text-align:right;color:#F5F5F4}' +
'.term{margin-top:1.3rem}' +
'.term h3{font-size:.95rem;margin:0 0 .3rem;color:#F5F5F4}' +
'.term p{margin:0;color:#A3A3A0;font-size:.88rem}' +
'label{display:block;font-size:.68rem;letter-spacing:.14em;text-transform:uppercase;color:#7A7A78;margin:1.3rem 0 .45rem}' +
'input[type=text]{width:100%;padding:.85rem .9rem;background:#0A0A0A;border:1px solid #333;color:#F5F5F4;font-size:1rem;border-radius:2px}' +
'input[type=text]:focus{outline:none;border-color:#1E90FF}' +
'canvas{width:100%;height:170px;background:#0A0A0A;border:1px solid #333;border-radius:2px;touch-action:none;display:block}' +
'.sigbar{display:flex;justify-content:space-between;align-items:center;margin-top:.5rem}' +
'.clear{background:none;border:0;color:#7A7A78;font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;padding:.4rem 0}' +
'.agree{display:flex;gap:.7rem;align-items:flex-start;margin-top:1.6rem;font-size:.88rem;color:#A3A3A0}' +
'.agree input{margin-top:.25rem;width:1.1rem;height:1.1rem;accent-color:#1E90FF;flex:none}' +
'button.submit{width:100%;margin-top:1.6rem;padding:1.05rem;background:#F5F5F4;color:#0A0A0A;border:0;font-size:.76rem;letter-spacing:.2em;text-transform:uppercase;font-weight:600;border-radius:2px;cursor:pointer}' +
'button.submit:disabled{opacity:.45;cursor:not-allowed}' +
'.msg{margin-top:1rem;padding:.85rem 1rem;border-radius:2px;font-size:.88rem;display:none}' +
'.msg.err{display:block;background:#2C1310;border:1px solid #FF6B5E;color:#FF9A90}' +
'.done{text-align:center;padding:3rem 0}' +
'.done .tick{font-size:2.6rem}' +
'.foot{margin-top:2.6rem;padding-top:1.3rem;border-top:1px solid #262626;color:#5F5F5D;font-size:.74rem}' +
'</style>' +
'<div class="wrap">' + inner + '</div>';
}

function notFoundHtml() {
  return shell(
    '<p class="brand">508 <span class="accent">FILMZZ</span></p>' +
    '<div class="done"><p class="eyebrow">Link not valid</p>' +
    '<h1>This agreement link isn\'t active</h1>' +
    '<p class="lead">It may have been replaced by a newer one. Reply to your ' +
    'confirmation email and I\'ll send a fresh link.</p></div>' +
    '<p class="foot">' + esc(STUDIO_NAME) + ' · ' + esc(STUDIO_EMAIL) + '</p>'
  );
}

function alreadySignedHtml(lead) {
  return shell(
    '<p class="brand">508 <span class="accent">FILMZZ</span></p>' +
    '<div class="done"><p class="tick">✅</p>' +
    '<p class="eyebrow">Agreement received</p>' +
    '<h1>You\'re locked in</h1>' +
    '<p class="lead">Signed by ' + esc(lead.signedBy) + ' on ' + esc(lead.signedAt) +
    '. Nothing else is needed — I\'ll see you on shoot day.</p></div>' +
    '<p class="foot">' + esc(STUDIO_NAME) + ' · ' + esc(STUDIO_TAGLINE) + '</p>'
  );
}

function contractHtml(lead) {
  var m = monthlyTerms(lead);

  var details = [
    ["Client", lead.name],
    ["Business", lead.business],
    ["Email", lead.email],
    ["Phone", lead.phone],
    ["Service", lead.service],
    ["Date", lead.date],
    ["Time", lead.time],
    ["Location", lead.location],
  ];
  if (m.isMonthly) {
    details.push(["Package", m.packageName]);
    details.push(["Standard rate", m.standard]);
    if (m.firstMonth) details.push(["First month", m.firstMonth]);
    details.push(["Minimum term", m.minimum]);
  } else if (lead.budget) {
    details.push(["Budget", lead.budget]);
  }

  var rows = "";
  for (var i = 0; i < details.length; i++) {
    if (!details[i][1]) continue;
    rows += '<div class="row"><dt>' + esc(details[i][0]) + '</dt><dd>' + esc(details[i][1]) + '</dd></div>';
  }

  var terms = agreementTerms(lead);
  var termHtml = "";
  for (var j = 0; j < terms.length; j++) {
    termHtml += '<div class="term"><h3>' + esc(terms[j][0]) + '</h3><p>' + esc(terms[j][1]) + '</p></div>';
  }

  var today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "MMMM d, yyyy");

  return shell(
    '<p class="brand">508 <span class="accent">FILMZZ</span></p>' +
    '<p class="eyebrow" style="margin-top:1.6rem">Client Agreement</p>' +
    '<h1>Let\'s make it official</h1>' +
    '<p class="lead">Everything below is taken from your booking. Read it through, ' +
    'sign at the bottom, and your shoot is locked in. It takes about a minute.</p>' +

    '<h2>Your booking</h2><dl class="card">' + rows + '</dl>' +
    '<h2>Terms</h2>' + termHtml +

    '<h2>Sign</h2>' +
    '<label for="typed">Type your full name</label>' +
    '<input type="text" id="typed" autocomplete="name" placeholder="' + esc(lead.name) + '">' +
    '<label for="sig">Draw your signature</label>' +
    '<canvas id="sig"></canvas>' +
    '<div class="sigbar"><span class="eyebrow" style="margin:0">Dated ' + esc(today) + '</span>' +
    '<button type="button" class="clear" id="clear">Clear</button></div>' +

    '<div class="agree"><input type="checkbox" id="agree">' +
    '<label for="agree" style="margin:0;text-transform:none;letter-spacing:0;font-size:.88rem;color:#A3A3A0">' +
    'I have read and agree to the terms above, and I am authorised to sign for ' +
    esc(lead.business || lead.name || "this booking") + '.</label></div>' +

    '<button class="submit" id="send" disabled>Sign and lock in my shoot</button>' +
    '<div class="msg" id="msg"></div>' +
    '<p class="foot">' + esc(STUDIO_NAME) + ' · ' + esc(STUDIO_TAGLINE) + '<br>' +
    esc(STUDIO_PHONE) + ' · ' + esc(STUDIO_EMAIL) + '</p>' +

    '<script>' +
    'var token=' + JSON.stringify(lead.token) + ';' +
    'var c=document.getElementById("sig"),x=c.getContext("2d"),drawn=false,down=false;' +
    // Backing store at device resolution: a canvas scaled by CSS alone records
    // a signature that is visibly soft when opened later.
    'function fit(){var r=c.getBoundingClientRect(),d=window.devicePixelRatio||1;' +
    'c.width=r.width*d;c.height=r.height*d;x.scale(d,d);' +
    'x.lineWidth=2.2;x.lineCap="round";x.lineJoin="round";x.strokeStyle="#F5F5F4";}fit();' +
    'function pt(e){var r=c.getBoundingClientRect();var t=e.touches?e.touches[0]:e;' +
    'return{x:t.clientX-r.left,y:t.clientY-r.top};}' +
    'function start(e){e.preventDefault();down=true;drawn=true;var p=pt(e);x.beginPath();x.moveTo(p.x,p.y);check();}' +
    'function move(e){if(!down)return;e.preventDefault();var p=pt(e);x.lineTo(p.x,p.y);x.stroke();}' +
    'function end(){down=false;}' +
    'c.addEventListener("mousedown",start);c.addEventListener("mousemove",move);' +
    'window.addEventListener("mouseup",end);' +
    'c.addEventListener("touchstart",start,{passive:false});' +
    'c.addEventListener("touchmove",move,{passive:false});' +
    'c.addEventListener("touchend",end);' +
    'document.getElementById("clear").onclick=function(){x.clearRect(0,0,c.width,c.height);drawn=false;check();};' +
    'var typed=document.getElementById("typed"),agree=document.getElementById("agree"),' +
    'send=document.getElementById("send"),msg=document.getElementById("msg");' +
    // A drawn squiggle is optional; a typed name and the tick are not.
    'function check(){send.disabled=!(typed.value.trim().length>1&&agree.checked);}' +
    'typed.addEventListener("input",check);agree.addEventListener("change",check);' +
    'send.onclick=function(){send.disabled=true;send.textContent="Sending...";msg.className="msg";' +
    'google.script.run.withSuccessHandler(function(r){' +
    'if(r&&r.ok){document.querySelector(".wrap").innerHTML=' +
    '\'<p class="brand">508 <span class="accent">FILMZZ</span></p>\'+' +
    '\'<div class="done"><p class="tick">✅</p><p class="eyebrow">Agreement received</p>\'+' +
    '\'<h1>You\\\'re locked in</h1><p class="lead">Thanks — a confirmation is on its way to your email. See you on shoot day.</p></div>\';' +
    'window.scrollTo(0,0);}else{msg.className="msg err";msg.textContent=(r&&r.error)||"Something went wrong.";' +
    'send.disabled=false;send.textContent="Sign and lock in my shoot";}})' +
    '.withFailureHandler(function(err){msg.className="msg err";' +
    'msg.textContent="Could not submit: "+err;send.disabled=false;send.textContent="Sign and lock in my shoot";})' +
    '.submitSignature({token:token,typedName:typed.value,' +
    'signatureImage:drawn?c.toDataURL("image/png"):""});};' +
    '</script>'
  );
}
