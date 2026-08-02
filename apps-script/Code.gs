/**
 * 508 FILMZZ — booking endpoint
 * ---------------------------------------------------------------------------
 * The site is hosted on GitHub Pages, which serves files and cannot run code.
 * This script is the booking backend: the form POSTs here, and this fans the
 * lead out to four places.
 *
 *   1. a row in the Google Sheet
 *   2. a full brief emailed to the studio
 *   3. a confirmation emailed to the customer
 *   4. an SMS to Drew's phone via Twilio
 *
 * Every channel is attempted independently and none can throw, so a dead Twilio
 * balance or a renamed Sheet tab can never cost a booking. Setup instructions
 * are in docs/GITHUB-PAGES.md.
 *
 * Credentials live in Script Properties, never in this file and never in the
 * public repo. Project Settings → Script Properties.
 */

// ── Configuration ──────────────────────────────────────────────────────────
// Set these in Project Settings → Script Properties. Only SHEET_ID is required.
//
//   SHEET_ID          the long id from the Sheet's URL
//   SHEET_TAB         tab name (default "Leads")
//   NOTIFY_EMAIL      where the studio brief goes
//   DRIVE_FOLDER_ID   optional: folder for uploaded reference files
//   TWILIO_SID        optional: Twilio Account SID
//   TWILIO_TOKEN      optional: Twilio Auth Token
//   TWILIO_FROM       optional: your Twilio number, E.164
//   SMS_TO            optional: where the alert lands, E.164
//
// The site is the only intended caller, but the endpoint is public — so treat
// everything arriving here as untrusted and validate it again.

var SHEET_HEADERS = [
  "Received",
  "Name",
  "Phone",
  "Email",
  "Project Type",
  "Budget",
  "Preferred Shoot Date",
  "Message",
  "Business Name",
  "Location",
  "Attachments",
];

var PROJECT_TYPES = [
  "Automotive",
  "Business Advertisement",
  "Commercial",
  "Social Media Content",
  "Drone",
  "Photography",
  "Hunting & Outdoor",
  "Product Launch",
  "Monthly Content",
  "Other",
];

var MAX_FILES = 3;
var MAX_FILE_BYTES = 5 * 1024 * 1024;

function prop(key, fallback) {
  var value = PropertiesService.getScriptProperties().getProperty(key);
  return value === null || value === "" ? fallback || "" : value;
}

/** Apps Script cannot answer a CORS preflight, so responses stay simple. */
function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}

// ── Validation ─────────────────────────────────────────────────────────────

function str(value, max) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max || 500);
}

function validate(body) {
  var errors = {};
  var lead = {
    name: str(body.name, 120),
    businessName: str(body.businessName, 160),
    email: str(body.email, 180),
    phone: str(body.phone, 40),
    projectType: str(body.projectType, 60),
    shootDate: str(body.shootDate, 20),
    location: str(body.location, 180),
    budget: str(body.budget, 60),
    message: str(body.message, 4000),
  };

  if (lead.name.length < 2) errors.name = "Please enter your name";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(lead.email))
    errors.email = "Please enter a valid email address";
  if (lead.phone.length < 7) errors.phone = "Please enter a contact number";
  if (PROJECT_TYPES.indexOf(lead.projectType) === -1)
    errors.projectType = "Choose a project type";
  if (!lead.budget) errors.budget = "Choose a budget range";
  if (lead.message.length < 20)
    errors.message = "Tell me a bit more — 20 characters minimum";
  if (lead.shootDate && !/^\d{4}-\d{2}-\d{2}$/.test(lead.shootDate))
    errors.shootDate = "Use the date picker";

  return { lead: lead, errors: errors };
}

function formatShootDate(iso) {
  if (!iso) return "Flexible";
  var parts = iso.split("-");
  var date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return Utilities.formatDate(date, Session.getScriptTimeZone(), "EEE, MMM d yyyy");
}

// ── Channels ───────────────────────────────────────────────────────────────
// Each returns { ok: Boolean, error: String } and never throws.

function saveFiles(files) {
  var folderId = prop("DRIVE_FOLDER_ID");
  if (!folderId || !files.length) return { ok: true, links: [], names: [] };

  try {
    var folder = DriveApp.getFolderById(folderId);
    var links = [];
    var names = [];
    for (var i = 0; i < files.length && i < MAX_FILES; i++) {
      var f = files[i];
      if (!f || !f.data) continue;
      var bytes = Utilities.base64Decode(f.data);
      if (bytes.length > MAX_FILE_BYTES) continue;
      var blob = Utilities.newBlob(bytes, f.type || "application/octet-stream", f.name);
      var saved = folder.createFile(blob);
      links.push(saved.getUrl());
      names.push(f.name);
    }
    return { ok: true, links: links, names: names };
  } catch (err) {
    return { ok: false, error: String(err), links: [], names: [] };
  }
}

function appendRow(lead, attachmentNames) {
  try {
    var sheetId = prop("SHEET_ID");
    if (!sheetId) return { ok: false, error: "SHEET_ID is not set" };

    var book = SpreadsheetApp.openById(sheetId);
    var tabName = prop("SHEET_TAB", "Leads");
    var sheet = book.getSheetByName(tabName);
    if (!sheet) sheet = book.insertSheet(tabName);

    // Write the header row the first time, so a fresh Sheet just works.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(SHEET_HEADERS);
      sheet.getRange(1, 1, 1, SHEET_HEADERS.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      new Date(),
      lead.name,
      lead.phone,
      lead.email,
      lead.projectType,
      lead.budget,
      formatShootDate(lead.shootDate),
      lead.message,
      lead.businessName,
      lead.location,
      attachmentNames.join(", "),
    ]);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

function emailStudio(lead, attachmentLinks, attachmentNames) {
  try {
    var to = prop("NOTIFY_EMAIL");
    if (!to) return { ok: false, error: "NOTIFY_EMAIL is not set" };

    var rows = [
      ["Name", lead.name],
      ["Business", lead.businessName || "—"],
      ["Email", lead.email],
      ["Phone", lead.phone],
      ["Project type", lead.projectType],
      ["Preferred date", formatShootDate(lead.shootDate)],
      ["Location", lead.location || "—"],
      ["Budget", lead.budget],
    ];

    var table = rows
      .map(function (r) {
        return (
          '<tr><td style="padding:9px 0;border-bottom:1px solid #eaeaea;color:#767676;' +
          'font-size:12px;letter-spacing:.12em;text-transform:uppercase;width:170px;' +
          'vertical-align:top">' +
          r[0] +
          '</td><td style="padding:9px 0;border-bottom:1px solid #eaeaea;color:#0a0a0a;' +
          'font-size:15px;vertical-align:top">' +
          escapeHtml(r[1]) +
          "</td></tr>"
        );
      })
      .join("");

    var linkList = attachmentLinks.length
      ? '<p style="margin:22px 0 0;font-size:14px">Attachments: ' +
        attachmentLinks
          .map(function (url, i) {
            return '<a href="' + url + '">' + escapeHtml(attachmentNames[i]) + "</a>";
          })
          .join(", ") +
        "</p>"
      : "";

    var html =
      '<div style="background:#f6f6f6;padding:30px 16px;font-family:Helvetica,Arial,sans-serif">' +
      '<div style="max-width:620px;margin:0 auto;background:#fff">' +
      '<div style="background:#0a0a0a;padding:26px 30px">' +
      '<p style="margin:0;color:#fff;font-size:20px;font-weight:700;letter-spacing:.06em">508 FILMZZ</p>' +
      '<p style="margin:6px 0 0;color:#1e90ff;font-size:12px;letter-spacing:.22em;text-transform:uppercase">New booking request</p>' +
      "</div>" +
      '<div style="padding:26px 30px">' +
      '<table style="width:100%;border-collapse:collapse">' +
      table +
      "</table>" +
      '<p style="margin:24px 0 6px;color:#767676;font-size:12px;letter-spacing:.12em;text-transform:uppercase">Message</p>' +
      '<p style="margin:0;color:#0a0a0a;font-size:15px;line-height:1.65;white-space:pre-wrap">' +
      escapeHtml(lead.message) +
      "</p>" +
      linkList +
      "</div></div></div>";

    MailApp.sendEmail({
      to: to,
      replyTo: lead.email,
      subject: "New booking — " + lead.name + " · " + lead.projectType,
      htmlBody: html,
      body:
        "NEW BOOKING — 508 Filmzz\n\n" +
        rows
          .map(function (r) {
            return r[0] + ": " + r[1];
          })
          .join("\n") +
        "\n\n" +
        lead.message,
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

function emailCustomer(lead) {
  try {
    var studio = prop("NOTIFY_EMAIL");
    var firstName = lead.name.split(" ")[0];

    var html =
      '<div style="background:#f6f6f6;padding:30px 16px;font-family:Helvetica,Arial,sans-serif">' +
      '<div style="max-width:620px;margin:0 auto;background:#fff">' +
      '<div style="background:#0a0a0a;padding:34px 30px">' +
      '<p style="margin:0;color:#fff;font-size:22px;font-weight:700;letter-spacing:.06em">508 FILMZZ</p>' +
      '<p style="margin:8px 0 0;color:#1e90ff;font-size:12px;letter-spacing:.22em;text-transform:uppercase">Request received</p>' +
      "</div>" +
      '<div style="padding:30px">' +
      '<p style="margin:0 0 16px;color:#0a0a0a;font-size:19px;line-height:1.45">Thanks, ' +
      escapeHtml(firstName) +
      " — I&rsquo;ve got your request.</p>" +
      '<p style="margin:0 0 16px;color:#444;font-size:15px;line-height:1.7">I read every enquiry personally and I&rsquo;ll get back to you as soon as possible with availability and a straight answer on what your project takes.</p>' +
      '<p style="margin:0 0 6px;color:#767676;font-size:12px;letter-spacing:.12em;text-transform:uppercase">What you sent</p>' +
      '<p style="margin:0;color:#0a0a0a;font-size:15px;line-height:1.7">' +
      escapeHtml(lead.projectType) +
      " &middot; " +
      escapeHtml(formatShootDate(lead.shootDate)) +
      " &middot; " +
      escapeHtml(lead.budget) +
      "</p>" +
      '<p style="margin:24px 0 0;color:#444;font-size:15px;line-height:1.7">Need me sooner? Call or text <strong>(864) 915-4071</strong>.</p>' +
      '<p style="margin:28px 0 0;padding-top:20px;border-top:1px solid #eaeaea;color:#999;font-size:12px;line-height:1.7">508 Filmzz — Building Brands Through Cinematic Storytelling.<br>Greenville, South Carolina</p>' +
      "</div></div></div>";

    MailApp.sendEmail({
      to: lead.email,
      replyTo: studio || undefined,
      subject: "Your 508 Filmzz booking request",
      htmlBody: html,
      body:
        "Thanks, " +
        firstName +
        " — I've got your request.\n\n" +
        "I read every enquiry personally and I'll get back to you as soon as possible.\n\n" +
        lead.projectType +
        " · " +
        formatShootDate(lead.shootDate) +
        " · " +
        lead.budget +
        "\n\nNeed me sooner? Call or text (864) 915-4071.",
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

function sendSms(lead) {
  var sid = prop("TWILIO_SID");
  var token = prop("TWILIO_TOKEN");
  var from = prop("TWILIO_FROM");
  var to = prop("SMS_TO");
  if (!sid || !token || !from || !to) {
    return { ok: false, error: "Twilio is not configured" };
  }

  var body =
    "NEW BOOKING — 508 Filmzz\n" +
    lead.name +
    (lead.businessName ? " (" + lead.businessName + ")" : "") +
    "\n" +
    lead.projectType +
    " · " +
    lead.budget +
    "\nDate: " +
    formatShootDate(lead.shootDate) +
    (lead.location ? "\nWhere: " + lead.location : "") +
    "\nCall: " +
    lead.phone +
    "\n" +
    lead.email;

  try {
    var res = UrlFetchApp.fetch(
      "https://api.twilio.com/2010-04-01/Accounts/" + sid + "/Messages.json",
      {
        method: "post",
        headers: {
          Authorization:
            "Basic " + Utilities.base64Encode(sid + ":" + token, Utilities.Charset.UTF_8),
        },
        payload: { To: to, From: from, Body: body },
        muteHttpExceptions: true,
      }
    );
    var code = res.getResponseCode();
    if (code >= 200 && code < 300) return { ok: true };
    return { ok: false, error: "Twilio " + code + ": " + res.getContentText().slice(0, 200) };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── Entry points ───────────────────────────────────────────────────────────

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ ok: false, error: "Empty request." });
    }

    var body;
    try {
      body = JSON.parse(e.postData.contents);
    } catch (err) {
      return jsonResponse({ ok: false, error: "Could not read the submission." });
    }

    // Honeypot: bots fill this, humans never see it. Report success so the bot
    // learns nothing, but drop the lead on the floor.
    if (body.website) return jsonResponse({ ok: true, confirmationEmailed: false });

    var checked = validate(body);
    if (Object.keys(checked.errors).length) {
      return jsonResponse({ ok: false, fieldErrors: checked.errors });
    }
    var lead = checked.lead;
    var files = Array.isArray(body.files) ? body.files.slice(0, MAX_FILES) : [];

    /*
     * Order matters. The Sheet is the cheapest, most reliable record, so it
     * goes first and the lead survives even if every other channel fails.
     */
    var saved = saveFiles(files);
    var sheet = appendRow(lead, saved.names);
    var studio = emailStudio(lead, saved.links, saved.names);
    var customer = emailCustomer(lead);
    var sms = sendSms(lead);

    var channels = {
      drive: saved,
      sheet: sheet,
      studioEmail: studio,
      clientEmail: customer,
      sms: sms,
    };

    Object.keys(channels).forEach(function (key) {
      if (!channels[key].ok) {
        console.error("[booking] " + key + " failed: " + channels[key].error);
      }
    });

    // The lead counts as captured if it reached the Sheet, the inbox, or the
    // phone. Only if all three fail do we tell the customer to call instead.
    var captured = sheet.ok || studio.ok || sms.ok;
    if (!captured) {
      console.error("[booking] LEAD NOT CAPTURED: " + JSON.stringify(lead));
      return jsonResponse({
        ok: false,
        error:
          "Something went wrong on my end. Please call (864) 915-4071 or email info@508filmzz.com directly.",
      });
    }

    return jsonResponse({ ok: true, confirmationEmailed: customer.ok });
  } catch (err) {
    console.error("[booking] unhandled: " + err);
    return jsonResponse({
      ok: false,
      error: "Something went wrong on my end. Please call (864) 915-4071.",
    });
  }
}

/** Visiting the URL in a browser should say something useful, not error. */
function doGet() {
  return jsonResponse({ ok: true, service: "508 Filmzz booking endpoint" });
}

/**
 * Run this once from the editor to confirm the wiring before going live.
 * Check the Sheet, both inboxes, and your phone.
 */
function testBooking() {
  var result = doPost({
    postData: {
      contents: JSON.stringify({
        name: "Test Client",
        businessName: "Test Motors",
        email: prop("NOTIFY_EMAIL", "you@example.com"),
        phone: "8645551234",
        projectType: "Automotive",
        shootDate: "",
        location: "Greenville, SC",
        budget: "$2,500 – $5,000",
        message:
          "This is a test submission from the Apps Script editor to confirm the booking endpoint is wired up correctly.",
        files: [],
      }),
    },
  });
  console.log(result.getContent());
}
