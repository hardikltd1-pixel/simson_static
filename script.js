(function () {
  "use strict";

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("nav");

  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  toggle.addEventListener("click", function () {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") setMenu(false);
  });

  /* ---------- Process tabs (EVA / PU / AIR / Injection) ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));

  function activate(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById("panel-" + t.dataset.target);
      panel.hidden = !on;
      panel.classList.toggle("is-active", on);
    });
    if (focus) tab.focus();
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { activate(tab, false); });
    tab.addEventListener("keydown", function (e) {
      var next = null;
      if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
      if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === "Home") next = tabs[0];
      if (e.key === "End") next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); activate(next, true); }
    });
  });

  /* Auto-rotate until the visitor interacts */
  var rotating = true;
  var current = 0;
  var timer = setInterval(function () {
    if (!rotating) return;
    current = (current + 1) % tabs.length;
    activate(tabs[current], false);
  }, 5000);

  function stopRotation() { rotating = false; clearInterval(timer); }
  var processBox = document.querySelector(".process");
  ["pointerdown", "keydown", "focusin"].forEach(function (evt) {
    processBox.addEventListener(evt, stopRotation, { once: true });
  });
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) stopRotation();

  /* ---------- Enquiry form: opens the visitor's email app ---------- */
  var form = document.getElementById("enquiry-form");
  var status = document.getElementById("form-status");
  var EMAIL = "simsonfootwearsdelhi@gmail.com";

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = form.elements.name;
    var phone = form.elements.phone;
    var valid = true;

    [name, phone].forEach(function (field) {
      var empty = !field.value.trim();
      field.classList.toggle("invalid", empty);
      if (empty) valid = false;
    });

    status.classList.remove("ok");
    if (!valid) {
      status.textContent = "Please enter your name and phone number.";
      return;
    }

    var subject = "Enquiry: " + form.elements.type.value;
    var body =
      "Name: " + name.value.trim() + "\n" +
      "Phone: " + phone.value.trim() + "\n" +
      "Looking for: " + form.elements.type.value + "\n\n" +
      form.elements.message.value.trim();

    status.classList.add("ok");
    status.textContent = "Opening your email app. Press send there to finish.";
    window.location.href =
      "mailto:" + EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
  });

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
