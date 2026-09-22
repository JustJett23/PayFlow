/* =========================================================
   PayFlow — Payroll Management System (front-end prototype)
   script.js — vanilla JS, no framework, no backend.

   All data lives in localStorage (with an in-memory fallback).
   Deduction rates are sample values for the prototype and are
   NOT official SSS / PhilHealth / Pag-IBIG / BIR figures.
   ========================================================= */
(function () {
  'use strict';

  /* =======================================================
     1. SMALL UTILITIES
     ======================================================= */
  const qs = (sel, root) => (root || document).querySelector(sel);
  const qsa = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, (c) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  }

  function round2(n) { return Math.round((Number(n) || 0) * 100) / 100; }
  function clamp(n, min, max) { return Math.min(Math.max(n, min), max); }

  function money(n) {
    const value = (Number(n) || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return state.settings.currencyStyle === 'code' ? 'PHP ' + value : '\u20B1' + value;
  }
  function moneyShort(n) {
    const value = Math.round(Number(n) || 0).toLocaleString('en-PH');
    return state.settings.currencyStyle === 'code' ? 'PHP ' + value : '\u20B1' + value;
  }

  function toDate(iso) {
    if (!iso) return null;
    const p = String(iso).split('-').map(Number);
    if (p.length !== 3 || p.some(isNaN)) return null;
    return new Date(p[0], p[1] - 1, p[2]);
  }
  function toISO(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function fmtDate(iso) {
    const d = toDate(iso);
    if (!d) return '\u2014';
    if (state.settings.dateFormat === 'dmy') {
      return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear();
    }
    return MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }
  function fmtDayDate(iso) {
    const d = toDate(iso);
    if (!d) return '\u2014';
    return DAYS[d.getDay()] + ', ' + MONTHS[d.getMonth()] + ' ' + d.getDate();
  }
  function fmtTime(hhmm) {
    if (!hhmm) return null;
    const p = String(hhmm).split(':').map(Number);
    if (p.length < 2 || isNaN(p[0])) return null;
    const suffix = p[0] >= 12 ? 'PM' : 'AM';
    const hour = p[0] % 12 === 0 ? 12 : p[0] % 12;
    return hour + ':' + String(p[1]).padStart(2, '0') + ' ' + suffix;
  }
  function minutesBetween(a, b) {
    const pa = String(a).split(':').map(Number);
    const pb = String(b).split(':').map(Number);
    let mins = (pb[0] * 60 + pb[1]) - (pa[0] * 60 + pa[1]);
    if (mins < 0) mins += 24 * 60;
    return mins;
  }
  function durationLabel(a, b) {
    if (!a || !b) return '\u2014';
    const m = minutesBetween(a, b);
    return Math.floor(m / 60) + 'h' + (m % 60 ? ' ' + (m % 60) + 'm' : '');
  }

  function initials(first, last) {
    return ((first || '?')[0] + (last || '')[0] || '?').toUpperCase();
  }
  function fullName(e) {
    return [e.firstName, e.middleName ? e.middleName[0] + '.' : '', e.lastName].filter(Boolean).join(' ');
  }
  function plainName(e) { return [e.firstName, e.lastName].filter(Boolean).join(' '); }

  function uid(prefix) {
    return prefix + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }
  function debounce(fn, wait) {
    let t;
    return function () {
      const args = arguments;
      clearTimeout(t);
      t = setTimeout(() => fn.apply(null, args), wait);
    };
  }

  /* =======================================================
     2. STORAGE (localStorage with in-memory fallback)
     ======================================================= */
  const KEYS = {
    employees: 'payflow.employees',
    schedules: 'payflow.schedules',
    payroll: 'payflow.payroll',
    settings: 'payflow.settings',
    session: 'payflow.session'
  };
  const memory = {};
  let storageOK = true;
  try {
    localStorage.setItem('payflow.probe', '1');
    localStorage.removeItem('payflow.probe');
  } catch (err) { storageOK = false; }

  function read(key, fallback) {
    try {
      const raw = storageOK ? localStorage.getItem(key) : memory[key];
      if (raw == null) return fallback;
      const parsed = JSON.parse(raw);
      return parsed == null ? fallback : parsed;
    } catch (err) { return fallback; }
  }
  function write(key, value) {
    const raw = JSON.stringify(value);
    try {
      if (storageOK) localStorage.setItem(key, raw); else memory[key] = raw;
    } catch (err) { memory[key] = raw; }
  }
  function drop(key) {
    try { if (storageOK) localStorage.removeItem(key); } catch (err) { /* ignore */ }
    delete memory[key];
  }

  /* =======================================================
     3. SEED DATA — fictional demo records
     ======================================================= */
  const DEPARTMENTS = ['Engineering', 'Product', 'Operations', 'Sales', 'Marketing'];

  const SEED_EMPLOYEES = [
    { id: 'EMP-1001', firstName: 'Rhianna', middleName: 'Li', lastName: 'Fiesta', email: 'rhianna.fiesta@payflow.test', phone: '0917 402 1188', department: 'Engineering', position: 'Senior Developer', employmentType: 'Regular', dateHired: '2021-03-15', hoursWorked: 88, otHours: 6, hourlyRate: 285, basicSalary: 25080, allowances: 3500, otherDeductions: 0, status: 'Active' },
    { id: 'EMP-1002', firstName: 'Jet', middleName: 'Rigor', lastName: 'Carlos', email: 'jet.carlos@payflow.test', phone: '0928 771 0043', department: 'Product', position: 'Product Analyst', employmentType: 'Regular', dateHired: '2022-07-04', hoursWorked: 88, otHours: 4, hourlyRate: 240, basicSalary: 21120, allowances: 2800, otherDeductions: 500, status: 'Active' },
    { id: 'EMP-1003', firstName: 'Alfred', middleName: '', lastName: 'Sand', email: 'alfred.sand@payflow.test', phone: '0906 233 5519', department: 'Operations', position: 'Operations Lead', employmentType: 'Regular', dateHired: '2020-11-02', hoursWorked: 88, otHours: 2, hourlyRate: 265, basicSalary: 23320, allowances: 3000, otherDeductions: 0, status: 'Active' },
    { id: 'EMP-1004', firstName: 'Carlo', middleName: 'B', lastName: 'Reyes', email: 'carlo.reyes@payflow.test', phone: '0995 118 7702', department: 'Sales', position: 'Account Executive', employmentType: 'Regular', dateHired: '2023-01-09', hoursWorked: 84, otHours: 8, hourlyRate: 210, basicSalary: 17640, allowances: 4200, otherDeductions: 0, status: 'Active' },
    { id: 'EMP-1005', firstName: 'Maria', middleName: 'Luisa', lastName: 'Santos', email: 'maria.santos@payflow.test', phone: '0917 660 9925', department: 'Marketing', position: 'Marketing Specialist', employmentType: 'Probationary', dateHired: '2026-04-20', hoursWorked: 88, otHours: 0, hourlyRate: 195, basicSalary: 17160, allowances: 2000, otherDeductions: 0, status: 'Active' },
    { id: 'EMP-1006', firstName: 'John', middleName: 'P', lastName: 'Dela Cruz', email: 'john.delacruz@payflow.test', phone: '0939 284 1176', department: 'Engineering', position: 'QA Engineer', employmentType: 'Regular', dateHired: '2022-02-14', hoursWorked: 88, otHours: 10, hourlyRate: 230, basicSalary: 20240, allowances: 2500, otherDeductions: 750, status: 'Active' },
    { id: 'EMP-1007', firstName: 'Diana', middleName: '', lastName: 'Reyes', email: 'diana.reyes@payflow.test', phone: '0922 507 3341', department: 'Operations', position: 'HR Coordinator', employmentType: 'Contractual', dateHired: '2025-09-01', hoursWorked: 80, otHours: 3, hourlyRate: 185, basicSalary: 14800, allowances: 1500, otherDeductions: 0, status: 'Active' },
    { id: 'EMP-1008', firstName: 'Noel', middleName: 'T', lastName: 'Bituin', email: 'noel.bituin@payflow.test', phone: '0918 445 2260', department: 'Sales', position: 'Field Sales Representative', employmentType: 'Regular', dateHired: '2024-06-17', hoursWorked: 0, otHours: 0, hourlyRate: 175, basicSalary: 14000, allowances: 1000, otherDeductions: 0, status: 'Inactive' }
  ];

  const DEFAULT_SETTINGS = {
    companyName: 'PayFlow Technologies Inc.',
    otMultiplier: 1.25,
    paydayLag: 5,
    currencyStyle: 'symbol',
    dateFormat: 'mdy',
    density: 'comfortable',
    deductions: {
      sss:        { enabled: true, label: 'SSS contribution', desc: 'Employee share, taken as a share of basic pay.', rate: 4.5, cap: 1350 },
      philhealth: { enabled: true, label: 'PhilHealth',       desc: 'Premium share with a floor and a ceiling.',      rate: 2.5, cap: 2500, floor: 250 },
      pagibig:    { enabled: true, label: 'Pag-IBIG Fund',    desc: 'Housing fund share, capped per pay period.',      rate: 2,   cap: 200 },
      tax:        { enabled: true, label: 'Withholding tax',  desc: 'Flat rate on pay above the exempt amount.',       rate: 15,  exempt: 10417 }
    },
    notifications: { payrollReminder: true, payslipReleased: true, scheduleChanges: false, weeklySummary: true },
    integrations: { timeclock: true, bankfile: true, accounting: false, emailslips: false }
  };

  function seedSchedules(employees) {
    const rows = [];
    const today = new Date();
    const shifts = [
      { start: '08:00', end: '17:00' },
      { start: '09:00', end: '18:00' },
      { start: '10:00', end: '19:00' },
      { start: '13:00', end: '22:00' }
    ];
    const active = employees.filter((e) => e.status === 'Active');
    for (let day = 0; day < 7; day++) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + day);
      if (d.getDay() === 0 || d.getDay() === 6) continue;
      active.forEach((emp, i) => {
        if ((i + day) % 3 === 2) return; // keep the list varied, not every person every day
        const shift = shifts[(i + day) % shifts.length];
        const late = (i + day) % 5 === 0;
        rows.push({
          id: uid('SCH'),
          empId: emp.id,
          date: toISO(d),
          shiftStart: shift.start,
          shiftEnd: shift.end,
          timeIn: day === 0 ? (late ? bumpTime(shift.start, 18) : bumpTime(shift.start, -4)) : '',
          timeOut: day === 0 ? bumpTime(shift.end, 6) : ''
        });
      });
    }
    return rows;
  }
  function bumpTime(hhmm, deltaMinutes) {
    const p = String(hhmm).split(':').map(Number);
    let total = p[0] * 60 + p[1] + deltaMinutes;
    total = (total + 1440) % 1440;
    return String(Math.floor(total / 60)).padStart(2, '0') + ':' + String(total % 60).padStart(2, '0');
  }

  /* =======================================================
     4. PAY PERIODS
     ======================================================= */
  function periodFor(date) {
    const y = date.getFullYear();
    const m = date.getMonth();
    const half = date.getDate() <= 15 ? 1 : 2;
    return buildPeriod(y, m, half);
  }
  function buildPeriod(y, m, half) {
    const lastDay = new Date(y, m + 1, 0).getDate();
    const start = new Date(y, m, half === 1 ? 1 : 16);
    const end = new Date(y, m, half === 1 ? 15 : lastDay);
    return {
      id: y + '-' + String(m + 1).padStart(2, '0') + '-' + half,
      start: toISO(start),
      end: toISO(end),
      label: MONTHS[m] + ' ' + start.getDate() + '\u2013' + end.getDate() + ', ' + y,
      shortLabel: MONTHS[m] + ' ' + (half === 1 ? '1\u201315' : '16\u2013' + lastDay)
    };
  }
  function previousHalf(y, m, half) {
    if (half === 2) return [y, m, 1];
    return m === 0 ? [y - 1, 11, 2] : [y, m - 1, 2];
  }
  function buildPeriodList(count) {
    const now = new Date();
    let y = now.getFullYear();
    let m = now.getMonth();
    let half = now.getDate() <= 15 ? 1 : 2;
    const list = [];
    for (let i = 0; i < count; i++) {
      list.push(buildPeriod(y, m, half));
      const prev = previousHalf(y, m, half);
      y = prev[0]; m = prev[1]; half = prev[2];
    }
    return list;
  }
  function payDateFor(period) {
    const end = toDate(period.end);
    const d = new Date(end.getFullYear(), end.getMonth(), end.getDate() + (Number(state.settings.paydayLag) || 0));
    if (d.getDay() === 6) d.setDate(d.getDate() - 1);      // Saturday -> Friday
    else if (d.getDay() === 0) d.setDate(d.getDate() - 2);  // Sunday   -> Friday
    return toISO(d);
  }

  /* =======================================================
     5. PAYROLL ENGINE
     ======================================================= */
  function computePay(emp, adjustments) {
    const d = state.settings.deductions;
    const adj = adjustments || [];
    let addBasic = 0, addOt = 0, addAllow = 0, addDed = 0;
    adj.forEach((a) => {
      const amt = Number(a.amount) || 0;
      if (a.type === 'Salary Adjustment') addBasic += amt;
      else if (a.type === 'Overtime Correction') addOt += amt;
      else if (a.type === 'Allowance Correction') addAllow += amt;
      else if (a.type === 'Deduction Correction') addDed += amt;
    });

    const basic = round2((Number(emp.basicSalary) || 0) + addBasic);
    const overtime = round2((Number(emp.otHours) || 0) * (Number(emp.hourlyRate) || 0) * (Number(state.settings.otMultiplier) || 1) + addOt);
    const allowances = round2((Number(emp.allowances) || 0) + addAllow);
    const gross = round2(basic + overtime + allowances);

    const sss = d.sss.enabled ? round2(Math.min(basic * d.sss.rate / 100, d.sss.cap)) : 0;
    const philhealth = d.philhealth.enabled ? round2(clamp(basic * d.philhealth.rate / 100, d.philhealth.floor, d.philhealth.cap)) : 0;
    const pagibig = d.pagibig.enabled ? round2(Math.min(basic * d.pagibig.rate / 100, d.pagibig.cap)) : 0;

    const statutory = round2(sss + philhealth + pagibig);
    const taxable = Math.max(0, gross - statutory - (Number(d.tax.exempt) || 0));
    const tax = d.tax.enabled ? round2(taxable * d.tax.rate / 100) : 0;
    const other = round2((Number(emp.otherDeductions) || 0) + addDed);

    const totalDeductions = round2(statutory + tax + other);
    const net = round2(gross - totalDeductions);
    return { basic, overtime, allowances, gross, sss, philhealth, pagibig, statutory, tax, other, totalDeductions, net };
  }

  function recordKey(empId, periodId) { return empId + '::' + periodId; }

  function getRecord(empId, periodId) {
    const key = recordKey(empId, periodId);
    if (!state.payroll[key]) {
      state.payroll[key] = { empId, periodId, status: 'Pending', adjustments: [], processedAt: null };
    }
    return state.payroll[key];
  }

  function seedPayroll(employees, periods) {
    const map = {};
    const statuses = ['Paid', 'Paid', 'Pending', 'Paid', 'Processing', 'Pending', 'Paid'];
    periods.forEach((period, pIndex) => {
      employees.forEach((emp, eIndex) => {
        if (emp.status !== 'Active') return;
        const status = pIndex === 0 ? statuses[eIndex % statuses.length] : 'Paid';
        map[recordKey(emp.id, period.id)] = {
          empId: emp.id,
          periodId: period.id,
          status,
          adjustments: [],
          processedAt: status === 'Paid' ? period.end + 'T09:0' + (eIndex % 6) + ':00' : null
        };
      });
    });
    return map;
  }

  /* =======================================================
     6. STATE
     ======================================================= */
  const state = {
    employees: [],
    schedules: [],
    payroll: {},
    settings: JSON.parse(JSON.stringify(DEFAULT_SETTINGS)),
    periods: [],
    route: 'home',
    filters: {
      empQuery: '', empDept: 'all', empStatus: 'all',
      payQuery: '', payPeriod: '', payStatus: 'all',
      schQuery: '', schEmployee: 'all', schDate: '', schView: 'list'
    }
  };

  function mergeSettings(saved) {
    const base = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    if (!saved || typeof saved !== 'object') return base;
    Object.keys(base).forEach((k) => {
      if (saved[k] == null) return;
      if (typeof base[k] === 'object' && !Array.isArray(base[k])) {
        Object.keys(base[k]).forEach((sub) => {
          if (saved[k][sub] == null) return;
          if (typeof base[k][sub] === 'object') Object.assign(base[k][sub], saved[k][sub]);
          else base[k][sub] = saved[k][sub];
        });
      } else {
        base[k] = saved[k];
      }
    });
    return base;
  }

  function loadState() {
    state.settings = mergeSettings(read(KEYS.settings, null));
    state.employees = read(KEYS.employees, null) || JSON.parse(JSON.stringify(SEED_EMPLOYEES));
    state.periods = buildPeriodList(4);
    state.schedules = read(KEYS.schedules, null) || seedSchedules(state.employees);
    state.payroll = read(KEYS.payroll, null) || seedPayroll(state.employees, state.periods);
    state.filters.payPeriod = state.periods[0].id;
    persistAll();
  }
  function persistAll() {
    write(KEYS.employees, state.employees);
    write(KEYS.schedules, state.schedules);
    write(KEYS.payroll, state.payroll);
    write(KEYS.settings, state.settings);
  }
  const saveEmployees = () => write(KEYS.employees, state.employees);
  const saveSchedules = () => write(KEYS.schedules, state.schedules);
  const savePayroll = () => write(KEYS.payroll, state.payroll);
  const saveSettings = () => write(KEYS.settings, state.settings);

  const findEmployee = (id) => state.employees.find((e) => e.id === id) || null;
  const activeEmployees = () => state.employees.filter((e) => e.status === 'Active');
  const currentPeriod = () => state.periods.find((p) => p.id === state.filters.payPeriod) || state.periods[0];

  /* =======================================================
     7. TOASTS
     ======================================================= */
  const ICON = {
    ok: 'i-check', warn: 'i-warn', error: 'i-warn', info: 'i-info'
  };
  function toast(message, kind) {
    const host = qs('#toasts');
    if (!host) return;
    const type = kind || 'ok';
    const el = document.createElement('div');
    el.className = 'toast' + (type === 'ok' ? '' : ' toast--' + type);
    el.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#' + (ICON[type] || ICON.ok) + '"></use></svg><span></span>';
    qs('span', el).textContent = message;
    host.appendChild(el);
    setTimeout(() => {
      el.classList.add('is-out');
      setTimeout(() => el.remove(), 220);
    }, 3200);
  }

  /* =======================================================
     8. MODAL SYSTEM (stackable, focus-trapped, inert background)
     ======================================================= */
  const modalStack = [];

  function lockBackground(lock) {
    const app = qs('#app');
    if (!app) return;
    if (lock) {
      document.body.style.overflow = 'hidden';
      if ('inert' in HTMLElement.prototype) app.inert = true;
      else app.setAttribute('aria-hidden', 'true');
    } else {
      document.body.style.overflow = '';
      if ('inert' in HTMLElement.prototype) app.inert = false;
      else app.removeAttribute('aria-hidden');
    }
  }

  function openModal(options) {
    const root = qs('#modalRoot');
    if (!root) return null;
    const opts = options || {};
    const layer = document.createElement('div');
    layer.className = 'modal-layer';
    const titleId = uid('mt');

    layer.innerHTML =
      '<button class="modal__backdrop" type="button" aria-label="Close dialog" data-modal-dismiss></button>' +
      '<div class="modal ' + (opts.size ? 'modal--' + opts.size : '') + '" role="dialog" aria-modal="true" aria-labelledby="' + titleId + '">' +
        '<div class="modal__head">' +
          '<div><h2 class="modal__title" id="' + titleId + '">' + esc(opts.title || '') + '</h2>' +
          (opts.subtitle ? '<p class="modal__sub">' + esc(opts.subtitle) + '</p>' : '') + '</div>' +
          '<button class="iconbtn modal__close" type="button" aria-label="Close dialog" data-modal-dismiss><svg class="icon"><use href="#i-close"></use></svg></button>' +
        '</div>' +
        '<div class="modal__body">' + (opts.body || '') + '</div>' +
        (opts.footer ? '<div class="modal__foot">' + opts.footer + '</div>' : '') +
      '</div>';

    root.hidden = false;
    root.appendChild(layer);
    if (modalStack.length === 0) lockBackground(true);

    const entry = {
      layer,
      returnFocus: document.activeElement,
      onClose: opts.onClose || null,
      dismissible: opts.dismissible !== false
    };
    modalStack.push(entry);

    layer.addEventListener('mousedown', (ev) => {
      if (ev.target.hasAttribute && ev.target.hasAttribute('data-modal-dismiss') && ev.target.classList.contains('modal__backdrop')) {
        if (entry.dismissible) closeModal(layer);
      }
    });
    layer.addEventListener('click', (ev) => {
      const btn = ev.target.closest('[data-modal-dismiss]');
      if (btn && !btn.classList.contains('modal__backdrop')) closeModal(layer);
    });

    if (typeof opts.onMount === 'function') opts.onMount(layer);

    const focusTarget = qs('[data-autofocus]', layer) || qs('input,select,textarea,button:not([data-modal-dismiss])', layer) || qs('.modal', layer);
    if (focusTarget) setTimeout(() => { try { focusTarget.focus(); } catch (e) { /* noop */ } }, 40);

    return layer;
  }

  function closeModal(layer) {
    const index = layer ? modalStack.findIndex((m) => m.layer === layer) : modalStack.length - 1;
    if (index < 0) return;
    const entry = modalStack.splice(index, 1)[0];
    entry.layer.remove();
    if (modalStack.length === 0) {
      lockBackground(false);
      const root = qs('#modalRoot');
      if (root) root.hidden = true;
    }
    if (typeof entry.onClose === 'function') entry.onClose();
    if (entry.returnFocus && document.contains(entry.returnFocus)) {
      try { entry.returnFocus.focus(); } catch (e) { /* noop */ }
    }
  }

  function trapFocus(ev) {
    if (!modalStack.length || ev.key !== 'Tab') return;
    const top = modalStack[modalStack.length - 1].layer;
    const nodes = qsa('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])', top)
      .filter((n) => n.offsetParent !== null || n === document.activeElement);
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
    else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
  }

  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && modalStack.length) {
      const top = modalStack[modalStack.length - 1];
      if (top.dismissible) { ev.preventDefault(); closeModal(top.layer); }
      return;
    }
    if (ev.key === 'Escape') {
      closeDropdown();
      closeSidebar();
    }
    trapFocus(ev);
  });

  function confirmDialog(options) {
    const opts = options || {};
    return new Promise((resolve) => {
      let answered = false;
      const layer = openModal({
        title: opts.title || 'Are you sure?',
        size: 'slim',
        body: '<p style="font-size:14.5px;line-height:1.6;color:var(--ink-70)">' + esc(opts.message || '') + '</p>',
        footer:
          '<button class="btn btn--ghost" type="button" data-confirm="no">' + esc(opts.cancelLabel || 'Cancel') + '</button>' +
          '<button class="btn ' + (opts.tone === 'danger' ? 'btn--solid-danger' : 'btn--primary') + '" type="button" data-confirm="yes" data-autofocus>' + esc(opts.confirmLabel || 'Confirm') + '</button>',
        onClose: () => { if (!answered) resolve(false); }
      });
      if (!layer) { resolve(false); return; }
      layer.addEventListener('click', (ev) => {
        const btn = ev.target.closest('[data-confirm]');
        if (!btn) return;
        answered = true;
        resolve(btn.getAttribute('data-confirm') === 'yes');
        closeModal(layer);
      });
    });
  }

  /* =======================================================
     9. FORM HELPERS
     ======================================================= */
  function fieldError(scope, name, message) {
    const input = qs('#' + name, scope);
    const slot = qs('[data-error-for="' + name + '"]', scope);
    if (input) input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (slot) slot.textContent = message || '';
  }
  function clearErrors(scope) {
    qsa('[data-error-for]', scope).forEach((n) => { n.textContent = ''; });
    qsa('[aria-invalid="true"]', scope).forEach((n) => n.setAttribute('aria-invalid', 'false'));
  }
  function val(scope, id) {
    const node = qs('#' + id, scope);
    return node ? node.value.trim() : '';
  }
  function numVal(scope, id) {
    const node = qs('#' + id, scope);
    return node ? Number(node.value) : 0;
  }

  /* =======================================================
     10. ROUTER
     ======================================================= */
  const ROUTES = ['home', 'employee', 'payroll', 'schedule', 'settings'];

  function routeFromHash() {
    const raw = (location.hash || '').replace(/^#\/?/, '').split('?')[0];
    return ROUTES.indexOf(raw) >= 0 ? raw : 'home';
  }

  function applyRoute() {
    const route = routeFromHash();
    state.route = route;
    qsa('.view').forEach((view) => { view.hidden = view.dataset.view !== route; });
    qsa('.nav__item, .tabbar__item').forEach((link) => {
      const on = link.dataset.route === route;
      link.classList.toggle('is-active', on);
      if (on) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
    });
    closeSidebar();
    renderRoute(route);
    const main = qs('#main');
    if (main) main.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function renderRoute(route) {
    if (route === 'home') renderHome();
    else if (route === 'employee') renderEmployees();
    else if (route === 'payroll') renderPayroll();
    else if (route === 'schedule') renderSchedules();
    else if (route === 'settings') renderSettings();
    renderChrome();
  }

  function goto(route) {
    if (location.hash === '#/' + route) applyRoute();
    else location.hash = '#/' + route;
  }

  function refreshAll() {
    renderRoute(state.route);
  }

  /* =======================================================
     11. APP CHROME (topbar, sidebar summary)
     ======================================================= */
  const PAGE_META = {
    home:     { icon: 'i-home',     name: 'Home' },
    employee: { icon: 'i-users',    name: 'Employee' },
    payroll:  { icon: 'i-wallet',   name: 'Payroll' },
    schedule: { icon: 'i-calendar', name: 'Schedule' },
    settings: { icon: 'i-settings', name: 'Settings' }
  };

  function renderChrome() {
    const period = currentPeriod();
    const nextPeriod = state.periods[0];
    const payDate = payDateFor(nextPeriod);

    const meta = PAGE_META[state.route] || PAGE_META.home;
    const pageIcon = qs('#topbarPageIcon');
    if (pageIcon) pageIcon.setAttribute('href', '#' + meta.icon);
    setText('#topbarPageName', meta.name);

    const company = qs('#sidebarCompany');
    if (company) company.textContent = state.settings.companyName;
    const periodChip = qs('#topbarPeriod');
    if (periodChip) periodChip.textContent = 'Period: ' + period.label;

    const payDateEl = qs('#sidebarPayDate');
    if (payDateEl) payDateEl.textContent = fmtDayDate(payDate);
    const payMeta = qs('#sidebarPayMeta');
    if (payMeta) {
      const pending = activeEmployees().filter((e) => getRecord(e.id, nextPeriod.id).status !== 'Paid').length;
      payMeta.textContent = pending ? pending + ' employee' + (pending === 1 ? '' : 's') + ' still to release' : 'All employees released';
    }
    document.body.classList.toggle('is-compact', state.settings.density === 'compact');
  }

  /* =======================================================
     12. HOME / DASHBOARD
     ======================================================= */
  const DEPT_SHADES = ['var(--sage-700)', 'var(--sage-600)', 'var(--sage-400)', 'var(--sage-300)', 'var(--sage-200)'];

  function renderHome() {
    const period = state.periods[0];
    const actives = activeEmployees();

    let gross = 0, tax = 0, net = 0;
    const byDept = {};
    const headcount = {};
    const paid = [];

    actives.forEach((emp) => {
      const rec = getRecord(emp.id, period.id);
      const pay = computePay(emp, rec.adjustments);
      gross += pay.gross; tax += pay.tax; net += pay.net;
      byDept[emp.department] = (byDept[emp.department] || 0) + pay.gross;
      headcount[emp.department] = (headcount[emp.department] || 0) + 1;
      if (rec.status === 'Paid') paid.push({ emp, pay, at: rec.processedAt || '' });
    });

    setText('#statWorkforce', String(actives.length));
    const stack = qs('#statAvatars');
    if (stack) {
      const shown = actives.slice(0, 4);
      stack.innerHTML = shown.map((e) => '<span title="' + esc(plainName(e)) + '">' + esc(initials(e.firstName, e.lastName)) + '</span>').join('') +
        (actives.length > shown.length ? '<span>+' + (actives.length - shown.length) + '</span>' : '');
    }

    setText('#statGross', money(gross));
    setText('#statTax', money(tax));
    setText('#statNet', money(net));

    const payDate = payDateFor(period);
    setText('#statNextDate', fmtDayDate(payDate));
    const end = toDate(period.end);
    const cutoff = new Date(end.getFullYear(), end.getMonth(), end.getDate() - 2);
    setText('#statCutoff', 'Timesheet cutoff: ' + MONTHS[cutoff.getMonth()] + ' ' + cutoff.getDate() + ', 5:00 PM');
    setText('#homeGreeting', 'Payroll at a glance \u2014 ' + period.label);

    // recent approved wage items
    paid.sort((a, b) => String(b.at).localeCompare(String(a.at)));
    const recent = paid.slice(0, 5);
    const tbody = qs('#recentWagesTable tbody');
    if (tbody) {
      tbody.innerHTML = recent.map((row) =>
        '<tr>' +
          '<td><div class="person"><span class="avatar" aria-hidden="true">' + esc(initials(row.emp.firstName, row.emp.lastName)) + '</span>' +
          '<span><span class="person__name">' + esc(fullName(row.emp)) + '</span>' +
          '<span class="person__meta">' + esc(row.emp.id) + '</span></span></div></td>' +
          '<td>' + esc(row.emp.position) + '</td>' +
          '<td class="num money">' + money(row.pay.net) + '<span class="approved">Approved</span></td>' +
        '</tr>'
      ).join('');
    }
    const recentCards = qs('#recentWagesCards');
    if (recentCards) {
      recentCards.innerHTML = recent.map((row) =>
        '<li><div class="minicard__top">' +
          '<div class="person"><span class="avatar" aria-hidden="true">' + esc(initials(row.emp.firstName, row.emp.lastName)) + '</span>' +
          '<span><span class="person__name">' + esc(fullName(row.emp)) + '</span>' +
          '<span class="person__meta">' + esc(row.emp.position) + '</span></span></div>' +
          '<span style="text-align:right"><span class="minicard__v">' + money(row.pay.net) + '</span>' +
          '<span class="approved">Approved</span></span>' +
        '</div></li>'
      ).join('');
    }
    const emptyRecent = qs('#recentWagesEmpty');
    if (emptyRecent) emptyRecent.hidden = recent.length > 0;

    // cost by department
    const depts = DEPARTMENTS.filter((d) => byDept[d]).concat(
      Object.keys(byDept).filter((d) => DEPARTMENTS.indexOf(d) < 0)
    );
    const bar = qs('#deptBar');
    if (bar) {
      bar.innerHTML = depts.map((dept, i) => {
        const pct = gross ? (byDept[dept] / gross) * 100 : 0;
        return '<span style="flex:' + pct.toFixed(2) + ';background:' + DEPT_SHADES[i % DEPT_SHADES.length] + '"></span>';
      }).join('');
      bar.setAttribute('aria-label', depts.map((d) =>
        d + ' ' + (gross ? Math.round((byDept[d] / gross) * 100) : 0) + '%').join(', '));
    }
    const list = qs('#deptList');
    if (list) {
      list.innerHTML = depts.map((dept, i) => {
        const value = byDept[dept] || 0;
        const pct = gross ? (value / gross) * 100 : 0;
        const heads = headcount[dept] || 0;
        return '<li>' +
          '<span class="deptlist__dot" style="background:' + DEPT_SHADES[i % DEPT_SHADES.length] + '"></span>' +
          '<span class="deptlist__text"><span class="deptlist__name">' + esc(dept) + '</span>' +
          '<span class="deptlist__meta">' + heads + ' member' + (heads === 1 ? '' : 's') + '</span></span>' +
          '<span class="deptlist__right"><span class="deptlist__amt">' + money(value) + '</span>' +
          '<span class="deptlist__pct">' + pct.toFixed(1) + '%</span></span>' +
        '</li>';
      }).join('');
    }
    setText('#deptTotal', money(gross));
    setText('#deptDesc', 'Distribution across ' + depts.length + ' business branch' + (depts.length === 1 ? '' : 'es'));
  }

  function setText(sel, text) {
    const node = qs(sel);
    if (node) node.textContent = text;
  }

  /* =======================================================
     13. EMPLOYEE VIEW
     ======================================================= */
  function filteredEmployees() {
    const q = state.filters.empQuery.toLowerCase();
    return state.employees.filter((e) => {
      if (state.filters.empStatus !== 'all' && e.status !== state.filters.empStatus) return false;
      if (state.filters.empDept !== 'all' && e.department !== state.filters.empDept) return false;
      if (!q) return true;
      return (e.id + ' ' + plainName(e) + ' ' + e.department + ' ' + e.position + ' ' + e.email).toLowerCase().indexOf(q) >= 0;
    });
  }

  function renderEmployees() {
    syncDeptOptions();
    const rows = filteredEmployees();
    const tbody = qs('#empTable tbody');
    const cards = qs('#empCards');
    const empty = qs('#empEmpty');

    const rowHTML = rows.map((emp) => {
      const pay = computePay(emp, []);
      return '<tr>' +
        '<td><span class="mono-id">' + esc(emp.id) + '</span></td>' +
        '<td><div class="person"><span class="avatar" aria-hidden="true">' + esc(initials(emp.firstName, emp.lastName)) + '</span>' +
          '<span><span class="person__name">' + esc(fullName(emp)) + '</span>' +
          '<span class="person__meta">' + esc(emp.position) + ' \u00b7 ' + esc(emp.status) + '</span></span></div></td>' +
        '<td>' + esc(emp.department) + '</td>' +
        '<td class="num">' + (Number(emp.hoursWorked) || 0) + '</td>' +
        '<td class="num money">' + money(emp.hourlyRate) + '</td>' +
        '<td class="num money">' + money(pay.gross) + '</td>' +
        '<td class="actions-col"><div class="rowactions">' +
          btn('emp-view', emp.id, 'i-eye', 'View ' + plainName(emp)) +
          btn('emp-edit', emp.id, 'i-edit', 'Edit ' + plainName(emp)) +
          btn('emp-delete', emp.id, 'i-trash', 'Deactivate ' + plainName(emp), 'rowbtn--danger') +
        '</div></td>' +
      '</tr>';
    }).join('');

    const cardHTML = rows.map((emp) => {
      const pay = computePay(emp, []);
      return '<li>' +
        '<div class="minicard__top">' +
          '<div class="person"><span class="avatar avatar--lg" aria-hidden="true">' + esc(initials(emp.firstName, emp.lastName)) + '</span>' +
          '<span><span class="person__name">' + esc(fullName(emp)) + '</span>' +
          '<span class="person__meta">' + esc(emp.id) + ' \u00b7 ' + esc(emp.department) + '</span></span></div>' +
          '<span class="pill pill--' + (emp.status === 'Active' ? 'active' : 'inactive') + '">' + esc(emp.status) + '</span>' +
        '</div>' +
        '<div class="minicard__grid">' +
          kv('Hours', String(Number(emp.hoursWorked) || 0)) +
          kv('Rate', money(emp.hourlyRate)) +
          kv('Gross', money(pay.gross), 'net') +
        '</div>' +
        '<div class="minicard__actions">' +
          '<button class="btn btn--ghost btn--tiny" type="button" data-action="emp-view" data-id="' + esc(emp.id) + '">Details</button>' +
          '<button class="btn btn--ghost btn--tiny" type="button" data-action="emp-edit" data-id="' + esc(emp.id) + '">Edit</button>' +
          '<button class="btn btn--danger btn--tiny" type="button" data-action="emp-delete" data-id="' + esc(emp.id) + '">' +
            (emp.status === 'Active' ? 'Deactivate' : 'Delete') + '</button>' +
        '</div>' +
      '</li>';
    }).join('');

    if (tbody) tbody.innerHTML = rowHTML;
    if (cards) cards.innerHTML = cardHTML;
    if (empty) empty.hidden = rows.length > 0;

    const actives = activeEmployees();
    const inactive = state.employees.length - actives.length;
    const totalGross = actives.reduce((sum, e) => sum + computePay(e, []).gross, 0);
    setText('#empTotal', String(state.employees.length));
    setText('#empTotalHint', actives.length + ' active \u00b7 ' + inactive + ' inactive');
    setText('#empExpense', money(totalGross));
    setText('#empAverage', money(actives.length ? totalGross / actives.length : 0));
  }

  function btn(action, id, icon, label, extra) {
    return '<button class="rowbtn ' + (extra || '') + '" type="button" data-action="' + action + '" data-id="' + esc(id) +
      '" title="' + esc(label) + '" aria-label="' + esc(label) + '"><svg class="icon"><use href="#' + icon + '"></use></svg></button>';
  }
  function kv(label, value, mod) {
    return '<div><p class="minicard__k">' + esc(label) + '</p><p class="minicard__v' + (mod ? ' minicard__v--' + mod : '') + '">' + value + '</p></div>';
  }

  function syncDeptOptions() {
    const select = qs('#empDept');
    if (!select) return;
    const depts = Array.from(new Set(state.employees.map((e) => e.department))).sort();
    const current = state.filters.empDept;
    select.innerHTML = '<option value="all">All departments</option>' +
      depts.map((d) => '<option value="' + esc(d) + '">' + esc(d) + '</option>').join('');
    select.value = depts.indexOf(current) >= 0 ? current : 'all';
    state.filters.empDept = select.value;
  }

  /* ---------- employee form ---------- */
  function employeeFormHTML(emp) {
    const e = emp || {};
    const depts = Array.from(new Set(DEPARTMENTS.concat(state.employees.map((x) => x.department)))).sort();
    const opt = (list, chosen) => list.map((v) => '<option value="' + esc(v) + '"' + (v === chosen ? ' selected' : '') + '>' + esc(v) + '</option>').join('');
    return '<form class="form" id="empForm" novalidate>' +
      '<div class="form__grid">' +
        field('empFid', 'Employee ID', 'text', e.id, { required: true, autofocus: !emp, readonly: !!emp }) +
        selectField('empFstatus', 'Status', opt(['Active', 'Inactive'], e.status || 'Active')) +
        field('empFfirst', 'First name', 'text', e.firstName, { required: true, autofocus: !!emp }) +
        field('empFmiddle', 'Middle name', 'text', e.middleName) +
        field('empFlast', 'Last name', 'text', e.lastName, { required: true }) +
        field('empFemail', 'Email', 'email', e.email, { required: true }) +
        field('empFphone', 'Phone number', 'tel', e.phone) +
        selectField('empFdept', 'Department', opt(depts, e.department || 'Engineering')) +
        field('empFposition', 'Position', 'text', e.position, { required: true }) +
        selectField('empFtype', 'Employment type', opt(['Regular', 'Probationary', 'Contractual', 'Part-time'], e.employmentType || 'Regular')) +
        field('empFhired', 'Date hired', 'date', e.dateHired, { required: true }) +
        field('empFhours', 'Hours worked (per period)', 'number', e.hoursWorked != null ? e.hoursWorked : 88, { min: 0, step: '0.5' }) +
        field('empFot', 'Overtime hours', 'number', e.otHours != null ? e.otHours : 0, { min: 0, step: '0.5' }) +
        field('empFrate', 'Hourly rate', 'number', e.hourlyRate != null ? e.hourlyRate : 200, { min: 0, step: '0.01', required: true }) +
        field('empFbasic', 'Basic salary (per period)', 'number', e.basicSalary != null ? e.basicSalary : 0, { min: 0, step: '0.01', required: true }) +
        field('empFallow', 'Allowances', 'number', e.allowances != null ? e.allowances : 0, { min: 0, step: '0.01' }) +
        field('empFother', 'Other deductions', 'number', e.otherDeductions != null ? e.otherDeductions : 0, { min: 0, step: '0.01' }) +
      '</div>' +
      '<p class="field__hint" id="empFormCalc"></p>' +
    '</form>';
  }
  function field(id, label, type, value, opts) {
    const o = opts || {};
    const attrs = [
      'id="' + id + '"', 'name="' + id + '"', 'type="' + type + '"',
      'value="' + esc(value == null ? '' : value) + '"',
      o.required ? 'required' : '',
      o.readonly ? 'readonly' : '',
      o.min != null ? 'min="' + o.min + '"' : '',
      o.step ? 'step="' + o.step + '"' : '',
      o.autofocus ? 'data-autofocus' : '',
      type === 'number' ? 'inputmode="decimal"' : ''
    ].filter(Boolean).join(' ');
    return '<div class="field"><label for="' + id + '">' + esc(label) + '</label><input ' + attrs + '>' +
      '<p class="field__error" data-error-for="' + id + '"></p></div>';
  }
  function selectField(id, label, options) {
    return '<div class="field"><label for="' + id + '">' + esc(label) + '</label>' +
      '<select id="' + id + '" name="' + id + '">' + options + '</select>' +
      '<p class="field__error" data-error-for="' + id + '"></p></div>';
  }

  function openEmployeeForm(emp) {
    const isEdit = !!emp;
    const layer = openModal({
      title: isEdit ? 'Edit employee' : 'Add employee',
      subtitle: isEdit ? emp.id + ' \u00b7 ' + plainName(emp) : 'New record in the payroll register',
      size: 'wide',
      body: employeeFormHTML(emp),
      footer: '<button class="btn btn--ghost" type="button" data-modal-dismiss>Cancel</button>' +
              '<button class="btn btn--primary" type="button" data-save-emp>' + (isEdit ? 'Save changes' : 'Add employee') + '</button>',
      onMount: (root) => {
        const preview = qs('#empFormCalc', root);
        const update = () => {
          const draft = {
            basicSalary: numVal(root, 'empFbasic'),
            otHours: numVal(root, 'empFot'),
            hourlyRate: numVal(root, 'empFrate'),
            allowances: numVal(root, 'empFallow'),
            otherDeductions: numVal(root, 'empFother')
          };
          const pay = computePay(draft, []);
          preview.textContent = 'Estimated gross ' + money(pay.gross) + ' \u00b7 net ' + money(pay.net) + ' for one pay period.';
        };
        ['empFbasic', 'empFot', 'empFrate', 'empFallow', 'empFother'].forEach((id) => {
          const node = qs('#' + id, root);
          if (node) node.addEventListener('input', update);
        });
        update();
      }
    });
    if (!layer) return;

    layer.addEventListener('click', (ev) => {
      if (!ev.target.closest('[data-save-emp]')) return;
      const form = qs('#empForm', layer);
      clearErrors(form);
      let ok = true;

      const id = val(form, 'empFid').toUpperCase();
      const first = val(form, 'empFfirst');
      const last = val(form, 'empFlast');
      const email = val(form, 'empFemail');
      const position = val(form, 'empFposition');
      const hired = val(form, 'empFhired');
      const rate = numVal(form, 'empFrate');
      const basic = numVal(form, 'empFbasic');

      if (!id) { fieldError(form, 'empFid', 'Employee ID is required.'); ok = false; }
      else if (!isEdit && state.employees.some((x) => x.id.toUpperCase() === id)) { fieldError(form, 'empFid', 'That ID is already taken.'); ok = false; }
      if (!first) { fieldError(form, 'empFfirst', 'First name is required.'); ok = false; }
      if (!last) { fieldError(form, 'empFlast', 'Last name is required.'); ok = false; }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { fieldError(form, 'empFemail', 'Enter a valid email address.'); ok = false; }
      if (!position) { fieldError(form, 'empFposition', 'Position is required.'); ok = false; }
      if (!hired) { fieldError(form, 'empFhired', 'Pick the date hired.'); ok = false; }
      if (!(rate > 0)) { fieldError(form, 'empFrate', 'Hourly rate must be greater than zero.'); ok = false; }
      if (!(basic >= 0)) { fieldError(form, 'empFbasic', 'Basic salary cannot be negative.'); ok = false; }

      if (!ok) {
        toast('Check the highlighted fields.', 'warn');
        const firstBad = qs('[aria-invalid="true"]', form);
        if (firstBad) firstBad.focus();
        return;
      }

      const payload = {
        id: isEdit ? emp.id : id,
        firstName: first,
        middleName: val(form, 'empFmiddle'),
        lastName: last,
        email,
        phone: val(form, 'empFphone'),
        department: val(form, 'empFdept'),
        position,
        employmentType: val(form, 'empFtype'),
        dateHired: hired,
        hoursWorked: numVal(form, 'empFhours'),
        otHours: numVal(form, 'empFot'),
        hourlyRate: rate,
        basicSalary: basic,
        allowances: numVal(form, 'empFallow'),
        otherDeductions: numVal(form, 'empFother'),
        status: val(form, 'empFstatus')
      };

      if (isEdit) {
        Object.assign(emp, payload);
        toast('Employee updated successfully.');
      } else {
        state.employees.push(payload);
        state.periods.forEach((p) => getRecord(payload.id, p.id));
        savePayroll();
        toast('Employee added successfully.');
      }
      saveEmployees();
      closeModal(layer);
      refreshAll();
    });
  }

  function openEmployeeDetails(emp) {
    const period = currentPeriod();
    const rec = getRecord(emp.id, period.id);
    const pay = computePay(emp, rec.adjustments);
    const shifts = state.schedules.filter((s) => s.empId === emp.id).slice(0, 4);

    openModal({
      title: fullName(emp),
      subtitle: emp.id + ' \u00b7 ' + emp.position + ' \u00b7 ' + emp.department,
      size: 'wide',
      body:
        '<dl class="detail-grid">' +
          dd('Status', emp.status) + dd('Employment type', emp.employmentType) +
          dd('Date hired', fmtDate(emp.dateHired)) + dd('Email', emp.email) +
          dd('Phone', emp.phone || '\u2014') + dd('Hours worked', String(emp.hoursWorked || 0) + ' h') +
          dd('Overtime hours', String(emp.otHours || 0) + ' h') + dd('Hourly rate', money(emp.hourlyRate)) +
          dd('Basic salary', money(emp.basicSalary)) + dd('Allowances', money(emp.allowances)) +
          dd('Gross pay', money(pay.gross)) + dd('Net pay', money(pay.net)) +
        '</dl>' +
        '<h3 class="card__title" style="margin:22px 0 10px">Upcoming shifts</h3>' +
        (shifts.length
          ? '<ul class="loglist">' + shifts.map((s) =>
              '<li><span>' + esc(fmtDate(s.date)) + ' \u00b7 ' + esc(fmtTime(s.shiftStart) + ' \u2013 ' + fmtTime(s.shiftEnd)) + '</span>' +
              '<span class="loglist__amt">' + esc(durationLabel(s.shiftStart, s.shiftEnd)) + '</span></li>').join('') + '</ul>'
          : '<p class="field__hint">No shifts scheduled yet.</p>'),
      footer:
        '<button class="btn btn--ghost" type="button" data-modal-dismiss>Close</button>' +
        '<button class="btn btn--ghost" type="button" data-detail-slip>View payslip</button>' +
        '<button class="btn btn--primary" type="button" data-detail-edit>Edit employee</button>',
      onMount: (root) => {
        root.addEventListener('click', (ev) => {
          if (ev.target.closest('[data-detail-edit]')) { closeModal(root); openEmployeeForm(emp); }
          if (ev.target.closest('[data-detail-slip]')) { closeModal(root); openPayslip(emp.id, period.id); }
        });
      }
    });
  }
  function dd(label, value) {
    return '<div><dt>' + esc(label) + '</dt><dd>' + esc(value) + '</dd></div>';
  }

  async function removeEmployee(emp) {
    if (emp.status === 'Active') {
      const ok = await confirmDialog({
        title: 'Deactivate employee?',
        message: 'Are you sure you want to deactivate ' + plainName(emp) + '? They stay in the register and drop out of new payroll runs.',
        confirmLabel: 'Deactivate',
        tone: 'danger'
      });
      if (!ok) return;
      emp.status = 'Inactive';
      saveEmployees();
      toast('Employee deactivated successfully.');
    } else {
      const ok = await confirmDialog({
        title: 'Delete employee record?',
        message: 'This removes ' + plainName(emp) + ' and their schedules from the prototype for good.',
        confirmLabel: 'Delete record',
        tone: 'danger'
      });
      if (!ok) return;
      state.employees = state.employees.filter((e) => e.id !== emp.id);
      state.schedules = state.schedules.filter((s) => s.empId !== emp.id);
      Object.keys(state.payroll).forEach((k) => { if (state.payroll[k].empId === emp.id) delete state.payroll[k]; });
      saveEmployees(); saveSchedules(); savePayroll();
      toast('Employee deleted successfully.');
    }
    refreshAll();
  }

  /* =======================================================
     14. PAYROLL VIEW
     ======================================================= */
  function payrollRows() {
    const period = currentPeriod();
    const q = state.filters.payQuery.toLowerCase();
    return activeEmployees().map((emp) => {
      const rec = getRecord(emp.id, period.id);
      return { emp, rec, pay: computePay(emp, rec.adjustments) };
    }).filter((row) => {
      if (state.filters.payStatus !== 'all' && row.rec.status !== state.filters.payStatus) return false;
      if (!q) return true;
      return (row.emp.id + ' ' + plainName(row.emp) + ' ' + row.emp.department).toLowerCase().indexOf(q) >= 0;
    });
  }

  function renderPayroll() {
    syncPeriodOptions();
    const period = currentPeriod();
    const rows = payrollRows();
    const tbody = qs('#payTable tbody');
    const cards = qs('#payCards');
    const empty = qs('#payEmpty');

    if (tbody) {
      tbody.innerHTML = rows.map((row) => {
        const paid = row.rec.status === 'Paid';
        return '<tr>' +
          '<td><div class="person"><span class="avatar" aria-hidden="true">' + esc(initials(row.emp.firstName, row.emp.lastName)) + '</span>' +
            '<span><span class="person__name">' + esc(fullName(row.emp)) + '</span>' +
            '<span class="person__meta">' + esc(row.emp.position) + '</span></span></div></td>' +
          '<td class="num money">' + money(row.pay.gross) + '</td>' +
          '<td class="num money">' + money(row.pay.tax) + '</td>' +
          '<td class="num money"><strong>' + money(row.pay.net) + '</strong></td>' +
          '<td>' + statusPill(row.rec.status) + '</td>' +
          '<td class="actions-col"><div class="rowactions">' +
            '<button class="textbtn" type="button" data-action="pay-details" data-id="' + esc(row.emp.id) +
              '" aria-label="Payroll details for ' + esc(plainName(row.emp)) + '">Details</button>' +
            btn('pay-slip', row.emp.id, 'i-receipt', 'View payslip for ' + plainName(row.emp)) +
            (paid ? '' : btn('pay-process', row.emp.id, 'i-refresh', 'Process payroll for ' + plainName(row.emp))) +
            btn('pay-correct', row.emp.id, 'i-edit', 'Process correction for ' + plainName(row.emp)) +
          '</div></td>' +
        '</tr>';
      }).join('');
    }

    if (cards) {
      cards.innerHTML = rows.map((row) => {
        const paid = row.rec.status === 'Paid';
        return '<li>' +
          '<div class="minicard__top">' +
            '<div class="person"><span class="avatar avatar--lg" aria-hidden="true">' + esc(initials(row.emp.firstName, row.emp.lastName)) + '</span>' +
            '<span><span class="person__name">' + esc(fullName(row.emp)) + '</span>' +
            '<span class="person__meta">' + esc(row.emp.id) + '</span>' +
            statusPill(row.rec.status) + '</span></div>' +
            '<div class="minicard__btns">' +
              '<button class="btn btn--primary btn--tiny" type="button" data-action="pay-slip" data-id="' + esc(row.emp.id) + '">View Payslip</button>' +
              '<button class="btn ' + (paid ? 'btn--ghost' : 'btn--primary') + ' btn--tiny" type="button" data-action="' +
                (paid ? 'pay-correct' : 'pay-process') + '" data-id="' + esc(row.emp.id) + '">' +
                (paid ? 'Process Correction' : 'Process Payroll') + '</button>' +
            '</div>' +
          '</div>' +
          '<div class="minicard__grid">' +
            kv('Gross Pay', money(row.pay.gross)) +
            kv('Net Pay', money(row.pay.net), 'net') +
            kv('Tax', money(row.pay.tax)) +
          '</div>' +
        '</li>';
      }).join('');
    }
    if (empty) empty.hidden = rows.length > 0;

    const all = activeEmployees().map((emp) => {
      const rec = getRecord(emp.id, period.id);
      return { rec, pay: computePay(emp, rec.adjustments) };
    });
    const gross = all.reduce((s, r) => s + r.pay.gross, 0);
    const ded = all.reduce((s, r) => s + r.pay.totalDeductions, 0);
    const net = all.reduce((s, r) => s + r.pay.net, 0);
    const paidCount = all.filter((r) => r.rec.status === 'Paid').length;
    setText('#runGross', money(gross));
    setText('#runDed', money(ded));
    setText('#runNet', money(net));
    setText('#runPaid', paidCount + ' of ' + all.length);
    setText('#payrollSub', period.label + ' \u00b7 payout ' + fmtDate(payDateFor(period)));

    const runAll = qs('#runAllBtn');
    if (runAll) runAll.disabled = paidCount === all.length && all.length > 0;
  }

  function statusPill(status) {
    const cls = { Paid: 'paid', Pending: 'pending', Processing: 'processing' }[status] || 'pending';
    return '<span class="pill pill--' + cls + '">' + esc(status) + '</span>';
  }

  function syncPeriodOptions() {
    const select = qs('#payPeriod');
    if (!select) return;
    if (select.options.length !== state.periods.length) {
      select.innerHTML = state.periods.map((p, i) =>
        '<option value="' + esc(p.id) + '">' + esc(p.label) + (i === 0 ? ' (current)' : '') + '</option>').join('');
    }
    select.value = state.filters.payPeriod;
  }

  function openPayrollDetails(empId) {
    const emp = findEmployee(empId);
    if (!emp) return;
    const period = currentPeriod();
    const rec = getRecord(empId, period.id);
    const pay = computePay(emp, rec.adjustments);

    openModal({
      title: 'Payroll details',
      subtitle: fullName(emp) + ' \u00b7 ' + period.label,
      size: 'wide',
      body:
        '<dl class="detail-grid">' +
          dd('Status', rec.status) +
          dd('Payout date', fmtDate(payDateFor(period))) +
          dd('Basic salary', money(pay.basic)) +
          dd('Overtime (' + (emp.otHours || 0) + 'h @ ' + state.settings.otMultiplier + 'x)', money(pay.overtime)) +
          dd('Allowances', money(pay.allowances)) +
          dd('Gross pay', money(pay.gross)) +
          dd('SSS', money(pay.sss)) + dd('PhilHealth', money(pay.philhealth)) +
          dd('Pag-IBIG', money(pay.pagibig)) + dd('Withholding tax', money(pay.tax)) +
          dd('Other deductions', money(pay.other)) + dd('Net pay', money(pay.net)) +
        '</dl>' +
        '<h3 class="card__title" style="margin:22px 0 10px">Corrections on this period</h3>' +
        (rec.adjustments.length
          ? '<ul class="loglist">' + rec.adjustments.map((a) =>
              '<li><span><strong>' + esc(a.type) + '</strong><br>' + esc(a.reason || 'No reason given') + '</span>' +
              '<span class="loglist__amt">' + money(a.amount) + '</span></li>').join('') + '</ul>'
          : '<p class="field__hint">No corrections recorded for this period.</p>'),
      footer:
        '<button class="btn btn--ghost" type="button" data-modal-dismiss>Close</button>' +
        '<button class="btn btn--ghost" type="button" data-open-correct>Process correction</button>' +
        '<button class="btn btn--primary" type="button" data-open-slip>View payslip</button>',
      onMount: (root) => {
        root.addEventListener('click', (ev) => {
          if (ev.target.closest('[data-open-slip]')) { closeModal(root); openPayslip(empId, period.id); }
          if (ev.target.closest('[data-open-correct]')) { closeModal(root); openCorrection(empId); }
        });
      }
    });
  }

  /* ---------- payslip ---------- */
  function payslipHTML(emp, period, pay, status) {
    return '<div class="slip">' +
      '<div class="slip__head"><p class="slip__brand">Payflow</p>' +
        '<p class="slip__co">' + esc(state.settings.companyName) + ' \u00b7 payslip</p></div>' +
      '<dl class="slip__who">' +
        '<div><dt>Employee</dt><dd>' + esc(fullName(emp)) + '</dd></div>' +
        '<div><dt>Employee ID</dt><dd>' + esc(emp.id) + '</dd></div>' +
        '<div><dt>Department</dt><dd>' + esc(emp.department) + '</dd></div>' +
        '<div><dt>Payroll period</dt><dd>' + esc(period.label) + '</dd></div>' +
        '<div><dt>Payout date</dt><dd>' + esc(fmtDate(payDateFor(period))) + '</dd></div>' +
        '<div><dt>Status</dt><dd>' + esc(status) + '</dd></div>' +
      '</dl>' +
      '<div class="slip__cols">' +
        '<div class="slip__col"><p class="slip__h">Earnings</p>' +
          line('Basic salary', pay.basic) +
          line('Overtime', pay.overtime) +
          line('Allowances', pay.allowances) +
          line('Gross pay', pay.gross, true) +
        '</div>' +
        '<div class="slip__col"><p class="slip__h">Deductions</p>' +
          line('SSS', pay.sss) +
          line('PhilHealth', pay.philhealth) +
          line('Pag-IBIG', pay.pagibig) +
          line('Withholding tax', pay.tax) +
          line('Other deductions', pay.other) +
          line('Total deductions', pay.totalDeductions, true) +
        '</div>' +
      '</div>' +
      '<div class="slip__net"><span class="slip__net-label">Net pay</span>' +
        '<span class="slip__net-value">' + money(pay.net) + '</span></div>' +
      '<p class="slip__foot">Prototype payslip. Deduction rates are sample values configured in Settings and do not represent official SSS, PhilHealth, Pag-IBIG or BIR contribution tables.</p>' +
    '</div>';
  }
  function line(label, value, total) {
    return '<p class="slip__line' + (total ? ' slip__line--total' : '') + '"><span>' + esc(label) + '</span><span>' + money(value) + '</span></p>';
  }

  function openPayslip(empId, periodId) {
    const emp = findEmployee(empId);
    const period = state.periods.find((p) => p.id === periodId) || currentPeriod();
    if (!emp) return;
    const rec = getRecord(empId, period.id);
    const pay = computePay(emp, rec.adjustments);

    openModal({
      title: 'Payslip',
      subtitle: fullName(emp) + ' \u00b7 ' + period.label,
      size: 'wide',
      body: payslipHTML(emp, period, pay, rec.status),
      footer:
        '<button class="btn btn--ghost" type="button" data-modal-dismiss>Close</button>' +
        '<button class="btn btn--primary" type="button" data-print-slip><svg class="icon"><use href="#i-print"></use></svg> Print payslip</button>',
      onMount: (root) => {
        root.addEventListener('click', (ev) => {
          if (!ev.target.closest('[data-print-slip]')) return;
          printPayslip(emp, period, pay, rec.status);
        });
      }
    });
  }

  function printPayslip(emp, period, pay, status) {
    const area = qs('#printArea');
    if (!area) return;
    area.innerHTML = payslipHTML(emp, period, pay, status) +
      '<p class="print-meta">Generated by PayFlow \u2014 front-end prototype \u00b7 ' + esc(fmtDate(toISO(new Date()))) + '</p>';
    const cleanup = () => { area.innerHTML = ''; window.removeEventListener('afterprint', cleanup); };
    window.addEventListener('afterprint', cleanup);
    setTimeout(() => {
      try { window.print(); } catch (err) { toast('Printing is blocked in this preview. Open the files locally to print.', 'warn'); }
      setTimeout(cleanup, 1200);
    }, 60);
  }

  /* ---------- process payroll ---------- */
  function openProcessPayroll(empId) {
    const emp = findEmployee(empId);
    if (!emp) return;
    const period = currentPeriod();
    const rec = getRecord(empId, period.id);
    const pay = computePay(emp, rec.adjustments);

    openModal({
      title: 'Process payroll',
      subtitle: fullName(emp) + ' \u00b7 ' + period.label,
      size: 'slim',
      body:
        '<dl class="detail-grid">' +
          dd('Gross pay', money(pay.gross)) +
          dd('Total deductions', money(pay.totalDeductions)) +
          dd('Net pay', money(pay.net)) +
          dd('Payout date', fmtDate(payDateFor(period))) +
        '</dl>' +
        '<div class="modal__note" style="margin-top:16px"><svg class="icon"><use href="#i-info"></use></svg>' +
        '<span>Releasing marks the record as paid in this prototype. Nothing is sent anywhere.</span></div>',
      footer:
        '<button class="btn btn--ghost" type="button" data-modal-dismiss>Cancel</button>' +
        '<button class="btn btn--primary" type="button" data-run-one data-autofocus>Release ' + money(pay.net) + '</button>',
      onMount: (root) => {
        root.addEventListener('click', (ev) => {
          if (!ev.target.closest('[data-run-one]')) return;
          closeModal(root);
          markProcessing([rec], 'Payroll processed successfully.');
        });
      }
    });
  }

  async function runWholePeriod() {
    const period = currentPeriod();
    const pending = activeEmployees()
      .map((e) => getRecord(e.id, period.id))
      .filter((r) => r.status !== 'Paid');
    if (!pending.length) { toast('Every employee is already released for this period.', 'info'); return; }
    const ok = await confirmDialog({
      title: 'Run payroll for ' + period.label + '?',
      message: 'This releases ' + pending.length + ' pending record' + (pending.length === 1 ? '' : 's') + '. You can still post corrections afterwards.',
      confirmLabel: 'Run payroll'
    });
    if (!ok) return;
    markProcessing(pending, 'Payroll processed successfully.');
  }

  function markProcessing(records, message) {
    records.forEach((r) => { r.status = 'Processing'; });
    savePayroll();
    refreshAll();
    setTimeout(() => {
      records.forEach((r) => {
        r.status = 'Paid';
        r.processedAt = new Date().toISOString();
      });
      savePayroll();
      refreshAll();
      toast(message);
    }, 900);
  }

  /* ---------- process correction ---------- */
  function openCorrection(empId) {
    const emp = findEmployee(empId);
    if (!emp) return;
    const periodOptions = state.periods.map((p) =>
      '<option value="' + esc(p.id) + '"' + (p.id === state.filters.payPeriod ? ' selected' : '') + '>' + esc(p.label) + '</option>').join('');
    const types = ['Salary Adjustment', 'Overtime Correction', 'Allowance Correction', 'Deduction Correction'];

    const layer = openModal({
      title: 'Process correction',
      subtitle: 'Adjust a released or pending payroll record',
      body:
        '<form class="form" id="corrForm" novalidate>' +
          '<div class="field"><label for="corrEmp">Employee</label>' +
            '<input id="corrEmp" type="text" value="' + esc(plainName(emp) + ' (' + emp.id + ')') + '" readonly></div>' +
          selectField('corrPeriod', 'Payroll period', periodOptions) +
          selectField('corrType', 'Correction type', types.map((t) => '<option>' + esc(t) + '</option>').join('')) +
          field('corrAmount', 'Amount', 'number', '', { step: '0.01', autofocus: true }) +
          '<div class="field"><label for="corrReason">Reason</label>' +
            '<textarea id="corrReason" rows="3" placeholder="Missed overtime on the second week, approved by the department lead."></textarea>' +
            '<p class="field__error" data-error-for="corrReason"></p></div>' +
          '<div class="modal__note"><svg class="icon"><use href="#i-info"></use></svg>' +
          '<span>Use a negative amount to take money off. Deduction corrections reduce net pay.</span></div>' +
        '</form>',
      footer:
        '<button class="btn btn--ghost" type="button" data-modal-dismiss>Cancel</button>' +
        '<button class="btn btn--primary" type="button" data-save-corr>Save correction</button>'
    });
    if (!layer) return;

    layer.addEventListener('click', (ev) => {
      if (!ev.target.closest('[data-save-corr]')) return;
      const form = qs('#corrForm', layer);
      clearErrors(form);
      const amount = numVal(form, 'corrAmount');
      const reason = val(form, 'corrReason');
      let ok = true;
      if (!amount || isNaN(amount)) { fieldError(form, 'corrAmount', 'Enter an amount other than zero.'); ok = false; }
      if (!reason) { fieldError(form, 'corrReason', 'A short reason keeps the audit trail useful.'); ok = false; }
      if (!ok) { toast('Check the highlighted fields.', 'warn'); return; }

      const periodId = val(form, 'corrPeriod');
      const rec = getRecord(empId, periodId);
      rec.adjustments.push({
        id: uid('ADJ'),
        type: val(form, 'corrType'),
        amount,
        reason,
        date: new Date().toISOString()
      });
      if (rec.status === 'Paid') rec.status = 'Processing';
      savePayroll();
      closeModal(layer);
      refreshAll();
      toast('Correction saved successfully.');
      setTimeout(() => {
        if (rec.status === 'Processing') { rec.status = 'Paid'; rec.processedAt = new Date().toISOString(); savePayroll(); refreshAll(); }
      }, 1100);
    });
  }

  /* ---------- CSV export ---------- */
  function exportCSV() {
    const period = currentPeriod();
    const rows = payrollRows();
    if (!rows.length) { toast('Nothing to export with the current filters.', 'warn'); return; }

    const header = ['Employee ID', 'Name', 'Department', 'Period', 'Basic', 'Overtime', 'Allowances', 'Gross',
      'SSS', 'PhilHealth', 'Pag-IBIG', 'Withholding Tax', 'Other Deductions', 'Net Pay', 'Status'];
    const cell = (v) => '"' + String(v).replace(/"/g, '""') + '"';
    const body = rows.map((r) => [
      r.emp.id, plainName(r.emp), r.emp.department, period.label,
      r.pay.basic, r.pay.overtime, r.pay.allowances, r.pay.gross,
      r.pay.sss, r.pay.philhealth, r.pay.pagibig, r.pay.tax, r.pay.other, r.pay.net, r.rec.status
    ].map(cell).join(','));
    const csv = [header.map(cell).join(',')].concat(body).join('\r\n');
    const filename = 'payflow-payroll-' + period.id + '.csv';

    try {
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      toast(rows.length + ' payroll rows exported to CSV.');
    } catch (err) {
      showCSVFallback(csv, filename);
    }
  }

  function showCSVFallback(csv, filename) {
    const layer = openModal({
      title: 'Copy the CSV',
      subtitle: 'Downloads are blocked here \u2014 copy the rows instead.',
      size: 'wide',
      body: '<div class="field"><label for="csvOut">' + esc(filename) + '</label>' +
            '<textarea id="csvOut" rows="12" readonly data-autofocus>' + esc(csv) + '</textarea></div>',
      footer: '<button class="btn btn--ghost" type="button" data-modal-dismiss>Close</button>' +
              '<button class="btn btn--primary" type="button" data-copy-csv>Copy to clipboard</button>'
    });
    if (!layer) return;
    layer.addEventListener('click', (ev) => {
      if (!ev.target.closest('[data-copy-csv]')) return;
      const box = qs('#csvOut', layer);
      box.select();
      try { document.execCommand('copy'); toast('CSV copied to the clipboard.'); }
      catch (e) { toast('Select the text and copy it manually.', 'warn'); }
    });
  }

  /* =======================================================
     15. SCHEDULE VIEW
     ======================================================= */
  function filteredSchedules() {
    const q = state.filters.schQuery.toLowerCase();
    return state.schedules
      .filter((s) => {
        const emp = findEmployee(s.empId);
        if (!emp) return false;
        if (state.filters.schEmployee !== 'all' && s.empId !== state.filters.schEmployee) return false;
        if (state.filters.schDate && s.date !== state.filters.schDate) return false;
        if (!q) return true;
        return (plainName(emp) + ' ' + emp.id + ' ' + emp.department).toLowerCase().indexOf(q) >= 0;
      })
      .sort((a, b) => a.date.localeCompare(b.date) || a.shiftStart.localeCompare(b.shiftStart));
  }

  function renderSchedules() {
    syncScheduleEmployeeOptions();
    const rows = filteredSchedules();
    const isWeek = state.filters.schView === 'week';

    const listWrap = qs('#schListWrap');
    const weekWrap = qs('#schWeekWrap');
    if (listWrap) listWrap.hidden = isWeek;
    if (weekWrap) weekWrap.hidden = !isWeek;
    qsa('[data-schview]').forEach((b) => {
      const on = b.dataset.schview === state.filters.schView;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
    });

    if (isWeek) { renderScheduleWeek(rows); return; }

    const tbody = qs('#schTable tbody');
    const cards = qs('#schCards');
    const empty = qs('#schEmpty');

    if (tbody) {
      tbody.innerHTML = rows.map((s) => {
        const emp = findEmployee(s.empId);
        return '<tr>' +
          '<td><div class="person"><span class="avatar" aria-hidden="true">' + esc(initials(emp.firstName, emp.lastName)) + '</span>' +
            '<span><span class="person__name">' + esc(fullName(emp)) + '</span>' +
            '<span class="person__meta">' + esc(emp.department) + '</span></span></div></td>' +
          '<td>' + esc(fmtTime(s.shiftStart) + ' \u2013 ' + fmtTime(s.shiftEnd)) +
            '<br><span class="person__meta">' + esc(durationLabel(s.shiftStart, s.shiftEnd)) + ' shift</span></td>' +
          '<td>' + esc(fmtDate(s.date)) + '</td>' +
          '<td>' + timeCell(s.timeIn, s.shiftStart, 'in') + '</td>' +
          '<td>' + timeCell(s.timeOut, s.shiftEnd, 'out') + '</td>' +
          '<td class="actions-col"><div class="rowactions">' +
            btn('sch-edit', s.id, 'i-edit', 'Edit shift for ' + plainName(emp)) +
            btn('sch-delete', s.id, 'i-trash', 'Delete shift for ' + plainName(emp), 'rowbtn--danger') +
          '</div></td>' +
        '</tr>';
      }).join('');
    }

    if (cards) {
      cards.innerHTML = rows.map((s) => {
        const emp = findEmployee(s.empId);
        return '<li>' +
          '<div class="minicard__top">' +
            '<div class="person"><span class="avatar avatar--lg" aria-hidden="true">' + esc(initials(emp.firstName, emp.lastName)) + '</span>' +
            '<span><span class="person__name">' + esc(fullName(emp)) + '</span>' +
            '<span class="person__meta">' + esc(fmtDate(s.date)) + '</span></span></div>' +
            '<span class="pill pill--' + (s.timeIn ? 'paid' : 'pending') + '">' + (s.timeIn ? 'Logged' : 'Scheduled') + '</span>' +
          '</div>' +
          '<div class="minicard__grid">' +
            kv('Time', esc(fmtTime(s.shiftStart) + '\u2013' + fmtTime(s.shiftEnd))) +
            kv('In', s.timeIn ? esc(fmtTime(s.timeIn)) : '\u2014') +
            kv('Out', s.timeOut ? esc(fmtTime(s.timeOut)) : '\u2014') +
          '</div>' +
          '<div class="minicard__actions">' +
            '<button class="btn btn--ghost btn--tiny" type="button" data-action="sch-edit" data-id="' + esc(s.id) + '">Edit</button>' +
            '<button class="btn btn--danger btn--tiny" type="button" data-action="sch-delete" data-id="' + esc(s.id) + '">Delete</button>' +
          '</div>' +
        '</li>';
      }).join('');
    }
    if (empty) empty.hidden = rows.length > 0;
  }

  function renderScheduleWeek(rows) {
    const host = qs('#schWeek');
    const empty = qs('#schWeekEmpty');
    if (!host) return;

    const anchor = state.filters.schDate ? toDate(state.filters.schDate) : new Date();
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate() + i);
      days.push(toISO(d));
    }
    const inWindow = rows.filter((s) => days.indexOf(s.date) >= 0);

    host.innerHTML = days.map((iso) => {
      const d = toDate(iso);
      const shifts = inWindow.filter((s) => s.date === iso)
        .sort((a, b) => a.shiftStart.localeCompare(b.shiftStart));
      return '<li class="dayCard">' +
        '<div class="dayCard__head">' +
          '<span><span class="dayCard__day">' + DAYS[d.getDay()] + '</span>' +
          '<span class="dayCard__date">' + esc(fmtDate(iso)) + '</span></span>' +
          '<button class="dayCard__add" type="button" data-action="sch-add-day" data-id="' + iso +
            '" aria-label="Add a shift on ' + esc(fmtDate(iso)) + '"><svg class="icon"><use href="#i-plus"></use></svg></button>' +
        '</div>' +
        (shifts.length ? shifts.map((s) => {
          const emp = findEmployee(s.empId);
          return '<div class="shift">' +
            '<span class="shift__time">Shift: ' + esc(fmtTime(s.shiftStart) + ' \u2013 ' + fmtTime(s.shiftEnd)) + '</span>' +
            '<span class="shift__name">' + esc(plainName(emp)) + '</span>' +
            '<span class="shift__meta">' + esc(emp.department) + ' \u00b7 ' +
              (s.timeIn ? 'in ' + esc(fmtTime(s.timeIn)) : 'not logged') + '</span>' +
            '<span class="shift__actions">' +
              btn('sch-edit', s.id, 'i-edit', 'Edit shift for ' + plainName(emp)) +
              btn('sch-delete', s.id, 'i-trash', 'Delete shift for ' + plainName(emp), 'rowbtn--danger') +
            '</span>' +
          '</div>';
        }).join('') : '<p class="dayCard__none">No shifts</p>') +
      '</li>';
    }).join('');

    if (empty) empty.hidden = inWindow.length > 0;
  }

  function timeCell(actual, scheduled, kind) {
    if (!actual) return '<span class="person__meta">Not logged</span>';
    const diff = minutesBetween(scheduled, actual);
    const late = kind === 'in' && diff > 0 && diff < 720;
    const early = kind === 'out' && diff > 720;
    const note = late ? '<br><span class="person__meta" style="color:var(--ochre)">' + diff + ' min late</span>'
      : early ? '<br><span class="person__meta" style="color:var(--ochre)">left early</span>' : '';
    return esc(fmtTime(actual)) + note;
  }

  function syncScheduleEmployeeOptions() {
    const select = qs('#schEmployee');
    if (!select) return;
    const current = state.filters.schEmployee;
    select.innerHTML = '<option value="all">All employees</option>' +
      state.employees.map((e) => '<option value="' + esc(e.id) + '">' + esc(plainName(e)) + '</option>').join('');
    select.value = state.employees.some((e) => e.id === current) ? current : 'all';
    state.filters.schEmployee = select.value;
  }

  function openScheduleForm(schedule, presetDate) {
    const isEdit = !!schedule;
    const s = schedule || (presetDate ? { date: presetDate } : {});
    const empOptions = activeEmployees()
      .map((e) => '<option value="' + esc(e.id) + '"' + (e.id === s.empId ? ' selected' : '') + '>' + esc(plainName(e) + ' \u00b7 ' + e.id) + '</option>').join('');

    const layer = openModal({
      title: isEdit ? 'Edit schedule' : 'Add schedule',
      subtitle: isEdit ? 'Update the shift window or the logged times' : 'Assign a shift to an active employee',
      body:
        '<form class="form" id="schForm" novalidate>' +
          selectField('schFemp', 'Employee', empOptions) +
          field('schFdate', 'Date', 'date', s.date || toISO(new Date()), { required: true, autofocus: true }) +
          '<div class="form__grid">' +
            field('schFstart', 'Shift start', 'time', s.shiftStart || '09:00', { required: true }) +
            field('schFend', 'Shift end', 'time', s.shiftEnd || '18:00', { required: true }) +
            field('schFin', 'Time in (optional)', 'time', s.timeIn || '') +
            field('schFout', 'Time out (optional)', 'time', s.timeOut || '') +
          '</div>' +
          '<p class="field__hint" id="schFormCalc"></p>' +
        '</form>',
      footer:
        '<button class="btn btn--ghost" type="button" data-modal-dismiss>Cancel</button>' +
        '<button class="btn btn--primary" type="button" data-save-sch>' + (isEdit ? 'Save changes' : 'Add schedule') + '</button>',
      onMount: (root) => {
        const preview = qs('#schFormCalc', root);
        const update = () => {
          const a = val(root, 'schFstart'), b = val(root, 'schFend');
          preview.textContent = (a && b) ? 'Scheduled shift length: ' + durationLabel(a, b) + '.' : '';
        };
        ['schFstart', 'schFend'].forEach((id) => {
          const node = qs('#' + id, root);
          if (node) node.addEventListener('input', update);
        });
        update();
      }
    });
    if (!layer) return;

    layer.addEventListener('click', (ev) => {
      if (!ev.target.closest('[data-save-sch]')) return;
      const form = qs('#schForm', layer);
      clearErrors(form);
      const empId = val(form, 'schFemp');
      const date = val(form, 'schFdate');
      const start = val(form, 'schFstart');
      const end = val(form, 'schFend');
      let ok = true;
      if (!empId) { fieldError(form, 'schFemp', 'Pick an employee.'); ok = false; }
      if (!date) { fieldError(form, 'schFdate', 'Pick a date.'); ok = false; }
      if (!start) { fieldError(form, 'schFstart', 'Set a shift start.'); ok = false; }
      if (!end) { fieldError(form, 'schFend', 'Set a shift end.'); ok = false; }
      if (start && end && minutesBetween(start, end) === 0) { fieldError(form, 'schFend', 'Start and end cannot match.'); ok = false; }
      if (!ok) { toast('Check the highlighted fields.', 'warn'); return; }

      const payload = { empId, date, shiftStart: start, shiftEnd: end, timeIn: val(form, 'schFin'), timeOut: val(form, 'schFout') };
      if (isEdit) {
        Object.assign(schedule, payload);
      } else {
        state.schedules.push(Object.assign({ id: uid('SCH') }, payload));
      }
      saveSchedules();
      closeModal(layer);
      refreshAll();
      toast('Schedule saved successfully.');
    });
  }

  async function removeSchedule(id) {
    const s = state.schedules.find((x) => x.id === id);
    if (!s) return;
    const emp = findEmployee(s.empId);
    const ok = await confirmDialog({
      title: 'Delete this shift?',
      message: 'Remove the ' + fmtDate(s.date) + ' shift for ' + (emp ? plainName(emp) : 'this employee') + '?',
      confirmLabel: 'Delete shift',
      tone: 'danger'
    });
    if (!ok) return;
    state.schedules = state.schedules.filter((x) => x.id !== id);
    saveSchedules();
    refreshAll();
    toast('Schedule deleted successfully.');
  }

  /* =======================================================
     16. SETTINGS VIEW
     ======================================================= */
  function renderSettings() {
    const s = state.settings;
    setValue('#setCompany', s.companyName);
    setValue('#setOt', s.otMultiplier);
    setValue('#setPayday', s.paydayLag);
    renderDeductionCards();
    renderSettingsSections();
  }
  function setValue(sel, v) {
    const node = qs(sel);
    if (node && document.activeElement !== node) node.value = v;
  }

  const DED_META = {
    sss:        { title: 'SSS Contribution', sub: 'Social Security System' },
    philhealth: { title: 'PhilHealth',       sub: 'Health Insurance Corp.' },
    pagibig:    { title: 'Pag-IBIG Fund',    sub: 'HDMF Regular Savings' },
    tax:        { title: 'Withholding Tax',  sub: 'Bureau of Internal Revenue' }
  };

  function renderDeductionCards() {
    const host = qs('#dedGrid');
    if (!host) return;
    const d = state.settings.deductions;
    host.innerHTML = Object.keys(d).map((key) => {
      const item = d[key];
      const meta = DED_META[key] || { title: item.label, sub: '' };
      const extra = key === 'tax'
        ? numberInput('ded-' + key + '-exempt', 'Exempt (\u20B1)', item.exempt)
        : key === 'philhealth'
          ? numberInput('ded-' + key + '-floor', 'Minimum', item.floor)
          : numberInput('ded-' + key + '-cap', 'Cap per period', item.cap);
      const note = key === 'tax'
        ? item.rate + '% above ' + money(item.exempt)
        : key === 'philhealth'
          ? item.rate + '% premium rate'
          : item.rate + '% of basic, ' + money(item.cap) + ' cap';
      return '<div class="dedcard' + (item.enabled ? '' : ' is-off') + '" data-ded="' + key + '">' +
        '<div class="dedcard__top">' +
          '<span><span class="dedcard__name">' + esc(meta.title) + '</span>' +
          '<span class="dedcard__sub">' + esc(meta.sub) + '</span></span>' +
          '<span class="switch"><input type="checkbox" id="ded-' + key + '-on" ' + (item.enabled ? 'checked' : '') +
          ' aria-label="Enable ' + esc(meta.title) + '"><span class="switch__track"></span></span>' +
        '</div>' +
        '<div class="dedcard__inputs">' + numberInput('ded-' + key + '-rate', 'Rate (%)', item.rate, '0.01') + extra + '</div>' +
        '<div class="dedcard__foot"><span>' + esc(note) + '</span>' +
          '<span class="dedcard__state">' + (item.enabled ? 'Active' : 'Off') + '</span></div>' +
      '</div>';
    }).join('');
  }

  function numberInput(id, label, value, step) {
    return '<div class="field"><label for="' + id + '">' + esc(label) + '</label>' +
      '<input id="' + id + '" type="number" min="0" step="' + (step || '1') + '" value="' + esc(value) + '" inputmode="decimal"></div>';
  }

  function collectDeductions() {
    const d = state.settings.deductions;
    Object.keys(d).forEach((key) => {
      const on = qs('#ded-' + key + '-on');
      const rate = qs('#ded-' + key + '-rate');
      if (on) d[key].enabled = on.checked;
      if (rate) d[key].rate = Math.max(0, Number(rate.value) || 0);
      const cap = qs('#ded-' + key + '-cap');
      if (cap) d[key].cap = Math.max(0, Number(cap.value) || 0);
      const floor = qs('#ded-' + key + '-floor');
      if (floor) d[key].floor = Math.max(0, Number(floor.value) || 0);
      const exempt = qs('#ded-' + key + '-exempt');
      if (exempt) d[key].exempt = Math.max(0, Number(exempt.value) || 0);
    });
  }

  const SECTIONS = [
    { key: 'account', icon: 'i-user', title: 'Account', desc: 'Who is signed in to this workspace' },
    { key: 'notifications', icon: 'i-bell', title: 'Notification settings', desc: 'What PayFlow tells you about, and when' },
    { key: 'preferences', icon: 'i-sliders', title: 'System preferences', desc: 'Currency, dates and table density' },
    { key: 'team', icon: 'i-shield', title: 'Team permission', desc: 'Roles and what each one can reach' },
    { key: 'integration', icon: 'i-plug', title: 'Integration', desc: 'Time clock, bank file and accounting' },
    { key: 'about', icon: 'i-info', title: 'About', desc: 'Version, storage and demo data' }
  ];

  function renderSettingsSections() {
    const host = qs('#settingsSections');
    if (!host) return;
    const openKeys = qsa('.sectionrow[aria-expanded="true"]', host).map((b) => b.dataset.section);
    host.innerHTML = SECTIONS.map((sec) => {
      const isOpen = openKeys.indexOf(sec.key) >= 0;
      return '<li>' +
        '<button class="sectionrow" type="button" data-section="' + sec.key + '" aria-expanded="' + isOpen + '" aria-controls="panel-' + sec.key + '">' +
          '<span class="sectionrow__icon" aria-hidden="true"><svg class="icon"><use href="#' + sec.icon + '"></use></svg></span>' +
          '<span class="sectionrow__text"><span class="sectionrow__title">' + esc(sec.title) + '</span>' +
          '<span class="sectionrow__desc">' + esc(sec.desc) + '</span></span>' +
          '<svg class="icon sectionrow__chev" aria-hidden="true"><use href="#i-chev-right"></use></svg>' +
        '</button>' +
        '<div class="sectionpanel" id="panel-' + sec.key + '"' + (isOpen ? '' : ' hidden') + '>' + sectionPanel(sec.key) + '</div>' +
      '</li>';
    }).join('');
  }

  function sectionPanel(key) {
    const s = state.settings;
    if (key === 'account') {
      return '<dl class="kv">' +
        dd('Signed in as', 'admin') + dd('Display name', 'Payroll Administrator') +
        dd('Email', 'admin@' + s.companyName.toLowerCase().replace(/[^a-z]+/g, '').slice(0, 12) + '.test') +
        dd('Role', 'Owner') + dd('Workspace', s.companyName) + dd('Member since', 'January 2024') +
      '</dl>' +
      '<div class="form__actions"><button class="btn btn--ghost" type="button" data-mock="Password reset link sent to your email.">Change password</button></div>';
    }
    if (key === 'notifications') {
      const rows = [
        ['payrollReminder', 'Payroll run reminders', 'Two days before each cut-off'],
        ['payslipReleased', 'Payslip released', 'When a payslip becomes available to an employee'],
        ['scheduleChanges', 'Schedule changes', 'When a shift is added, moved or removed'],
        ['weeklySummary', 'Weekly summary', 'A Monday digest of hours and pending pay']
      ];
      return '<div class="togglelist">' + rows.map((r) =>
        '<div class="togglerow"><div class="togglerow__text"><p class="togglerow__title">' + esc(r[1]) + '</p>' +
        '<p class="togglerow__desc">' + esc(r[2]) + '</p></div>' +
        '<span class="switch"><input type="checkbox" data-notif="' + r[0] + '" ' + (s.notifications[r[0]] ? 'checked' : '') +
        ' aria-label="' + esc(r[1]) + '"><span class="switch__track"></span></span></div>').join('') + '</div>';
    }
    if (key === 'preferences') {
      return '<div class="form__grid">' +
        '<div class="field"><label for="prefCurrency">Currency display</label>' +
          '<select id="prefCurrency" data-pref="currencyStyle">' +
            '<option value="symbol"' + (s.currencyStyle === 'symbol' ? ' selected' : '') + '>\u20B11,234.00</option>' +
            '<option value="code"' + (s.currencyStyle === 'code' ? ' selected' : '') + '>PHP 1,234.00</option>' +
          '</select></div>' +
        '<div class="field"><label for="prefDate">Date format</label>' +
          '<select id="prefDate" data-pref="dateFormat">' +
            '<option value="mdy"' + (s.dateFormat === 'mdy' ? ' selected' : '') + '>Sep 20, 2026</option>' +
            '<option value="dmy"' + (s.dateFormat === 'dmy' ? ' selected' : '') + '>20/09/2026</option>' +
          '</select></div>' +
        '<div class="field"><label for="prefDensity">Table density</label>' +
          '<select id="prefDensity" data-pref="density">' +
            '<option value="comfortable"' + (s.density === 'comfortable' ? ' selected' : '') + '>Comfortable</option>' +
            '<option value="compact"' + (s.density === 'compact' ? ' selected' : '') + '>Compact</option>' +
          '</select></div>' +
      '</div><p class="field__hint">These apply straight away across every page.</p>';
    }
    if (key === 'team') {
      const roles = [
        ['Owner', '1 member', 'Full access, including deductions and team roles'],
        ['Payroll admin', '2 members', 'Run payroll, post corrections, export registers'],
        ['HR staff', '3 members', 'Employee records and schedules, no payout release'],
        ['Viewer', '4 members', 'Read-only dashboards and payslips']
      ];
      return '<div class="togglelist">' + roles.map((r) =>
        '<div class="togglerow"><div class="togglerow__text"><p class="togglerow__title">' + esc(r[0]) + '</p>' +
        '<p class="togglerow__desc">' + esc(r[2]) + '</p></div>' +
        '<span class="pill pill--active">' + esc(r[1]) + '</span></div>').join('') + '</div>';
    }
    if (key === 'integration') {
      const items = [
        ['timeclock', 'TC', 'Time clock', 'Pulls daily time in and time out into Schedule.'],
        ['bankfile', 'BF', 'Bank file', 'Generates a payout file for the company bank.'],
        ['accounting', 'AC', 'Accounting', 'Posts each payroll run to the ledger.'],
        ['emailslips', 'EM', 'Email payslips', 'Sends each payslip as a PDF on payout day.']
      ];
      return '<div class="integrations">' + items.map((it) =>
        '<div class="integration"><div class="integration__top">' +
          '<span class="integration__logo" aria-hidden="true">' + esc(it[1]) + '</span>' +
          '<span class="integration__name">' + esc(it[2]) + '</span>' +
          '<span class="switch" style="margin-left:auto"><input type="checkbox" data-integration="' + it[0] + '" ' +
            (s.integrations[it[0]] ? 'checked' : '') + ' aria-label="Connect ' + esc(it[2]) + '"><span class="switch__track"></span></span>' +
        '</div><p class="integration__desc">' + esc(it[3]) + '</p></div>').join('') + '</div>';
    }
    // about
    const size = (() => {
      try {
        let bytes = 0;
        Object.keys(KEYS).forEach((k) => { bytes += (read(KEYS[k], '') ? JSON.stringify(read(KEYS[k], '')).length : 0); });
        return (bytes / 1024).toFixed(1) + ' KB';
      } catch (e) { return 'unavailable'; }
    })();
    return '<dl class="kv">' +
      dd('Application', 'PayFlow') + dd('Version', '1.0.0 prototype') +
      dd('Build', 'HTML, CSS and vanilla JavaScript') + dd('Data stored in', storageOK ? 'Browser localStorage' : 'Memory only (storage blocked)') +
      dd('Storage used', size) + dd('Employees on file', String(state.employees.length)) +
    '</dl>' +
    '<p class="field__hint">PayFlow is a front-end prototype. There is no server, no database and no API \u2014 every figure here is computed in the browser from sample data. Deduction rates are configurable samples, not official government tables.</p>' +
    '<div class="form__actions"><button class="btn btn--danger" type="button" data-reset-demo>Reset demo data</button></div>';
  }

  async function resetDemoData() {
    const ok = await confirmDialog({
      title: 'Reset demo data?',
      message: 'Every employee, schedule, correction and setting you changed goes back to the original sample set.',
      confirmLabel: 'Reset everything',
      tone: 'danger'
    });
    if (!ok) return;
    Object.keys(KEYS).forEach((k) => { if (k !== 'session') drop(KEYS[k]); });
    loadState();
    refreshAll();
    toast('Demo data reset successfully.');
  }

  /* =======================================================
     17. SIDEBAR / DROPDOWN / AUTH
     ======================================================= */
  function openSidebar() {
    const sb = qs('#sidebar'), scrim = qs('#scrim'), btnEl = qs('#menuBtn');
    if (!sb) return;
    sb.classList.add('is-open');
    if (scrim) scrim.hidden = false;
    if (btnEl) btnEl.setAttribute('aria-expanded', 'true');
    const first = qs('.nav__item', sb);
    if (first) first.focus();
  }
  function closeSidebar() {
    const sb = qs('#sidebar'), scrim = qs('#scrim'), btnEl = qs('#menuBtn');
    if (!sb) return;
    sb.classList.remove('is-open');
    if (scrim) scrim.hidden = true;
    if (btnEl) btnEl.setAttribute('aria-expanded', 'false');
  }
  function closeDropdown() {
    const menu = qs('#profileMenu'), btnEl = qs('#profileBtn');
    if (menu) menu.hidden = true;
    if (btnEl) btnEl.setAttribute('aria-expanded', 'false');
  }

  function showApp() {
    const login = qs('#loginScreen'), app = qs('#app');
    if (login) login.hidden = true;
    if (app) app.hidden = false;
    document.title = 'PayFlow \u2014 Payroll Management';
    applyRoute();
  }
  function showLogin() {
    const login = qs('#loginScreen'), app = qs('#app');
    if (app) app.hidden = true;
    if (login) login.hidden = false;
    const user = qs('#loginUser');
    if (user) user.focus();
  }

  async function logout() {
    closeDropdown();
    const ok = await confirmDialog({
      title: 'Log out of Payre?',
      message: 'Your sample data stays on this browser. You can sign back in with any credentials.',
      confirmLabel: 'Log out',
      tone: 'danger'
    });
    if (!ok) return;
    drop(KEYS.session);
    showLogin();
    toast('You are logged out.');
  }

  function openAccountModal(kind) {
    closeDropdown();
    if (kind === 'profile') {
      openModal({
        title: 'Profile',
        subtitle: 'Payroll Administrator',
        size: 'slim',
        body: '<dl class="detail-grid">' + dd('Name', 'Payroll Administrator') + dd('Username', 'admin') +
              dd('Role', 'Owner') + dd('Workspace', state.settings.companyName) + '</dl>',
        footer: '<button class="btn btn--primary" type="button" data-modal-dismiss>Close</button>'
      });
    } else {
      goto('settings');
      setTimeout(() => {
        const row = qs('.sectionrow[data-section="account"]');
        if (row && row.getAttribute('aria-expanded') !== 'true') row.click();
        if (row) row.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }, 60);
    }
  }

  /* =======================================================
     18. EVENT WIRING
     ======================================================= */
  function wireLogin() {
    const form = qs('#loginForm');
    if (!form) return;
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      clearErrors(form);
      const user = val(form, 'loginUser');
      const pass = val(form, 'loginPass');
      let ok = true;
      if (!user) { fieldError(form, 'loginUser', 'Enter a username.'); ok = false; }
      if (!pass) { fieldError(form, 'loginPass', 'Enter a password.'); ok = false; }
      if (!ok) return;
      const remember = qs('#loginRemember');
      if (!remember || remember.checked) write(KEYS.session, { user, at: Date.now() });
      showApp();
      toast('Signed in as ' + user + '.');
      const label = qs('#dropdownUser');
      if (label) label.textContent = user;
    });
  }

  function wireChrome() {
    const menuBtn = qs('#menuBtn');
    if (menuBtn) menuBtn.addEventListener('click', () => {
      const sb = qs('#sidebar');
      if (sb && sb.classList.contains('is-open')) closeSidebar(); else openSidebar();
    });
    const scrim = qs('#scrim');
    if (scrim) scrim.addEventListener('click', closeSidebar);

    const profileBtn = qs('#profileBtn');
    const menu = qs('#profileMenu');
    if (profileBtn && menu) {
      profileBtn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const open = menu.hidden;
        menu.hidden = !open;
        profileBtn.setAttribute('aria-expanded', String(open));
      });
      document.addEventListener('click', (ev) => {
        if (!menu.hidden && !ev.target.closest('.profile')) closeDropdown();
      });
    }

    document.addEventListener('click', (ev) => {
      const action = ev.target.closest('[data-profile-action]');
      if (!action) return;
      const kind = action.dataset.profileAction;
      if (kind === 'logout') logout();
      else openAccountModal(kind);
    });

    qsa('.nav__item, .tabbar__item').forEach((link) => {
      link.addEventListener('click', () => { closeDropdown(); });
    });
    document.addEventListener('click', (ev) => {
      const jump = ev.target.closest('[data-goto]');
      if (jump) goto(jump.dataset.goto);
    });
  }

  function wireEmployeeView() {
    const search = qs('#empSearch');
    if (search) search.addEventListener('input', debounce((ev) => {
      state.filters.empQuery = ev.target.value.trim();
      renderEmployees();
    }, 140));
    const dept = qs('#empDept');
    if (dept) dept.addEventListener('change', (ev) => { state.filters.empDept = ev.target.value; renderEmployees(); });
    const status = qs('#empStatus');
    if (status) status.addEventListener('change', (ev) => { state.filters.empStatus = ev.target.value; renderEmployees(); });
    const add = qs('#addEmpBtn');
    if (add) add.addEventListener('click', () => openEmployeeForm(null));
  }

  function wirePayrollView() {
    const search = qs('#payTitleSearch');
    if (search) search.addEventListener('input', debounce((ev) => {
      state.filters.payQuery = ev.target.value.trim();
      renderPayroll();
    }, 140));
    const period = qs('#payPeriod');
    if (period) period.addEventListener('change', (ev) => { state.filters.payPeriod = ev.target.value; renderPayroll(); renderChrome(); });
    const status = qs('#payStatus');
    if (status) status.addEventListener('change', (ev) => { state.filters.payStatus = ev.target.value; renderPayroll(); });
    const csv = qs('#exportCsvBtn');
    if (csv) csv.addEventListener('click', exportCSV);
    const run = qs('#runAllBtn');
    if (run) run.addEventListener('click', runWholePeriod);
  }

  function wireScheduleView() {
    const search = qs('#schSearch');
    if (search) search.addEventListener('input', debounce((ev) => {
      state.filters.schQuery = ev.target.value.trim();
      renderSchedules();
    }, 140));
    const emp = qs('#schEmployee');
    if (emp) emp.addEventListener('change', (ev) => { state.filters.schEmployee = ev.target.value; renderSchedules(); });
    const date = qs('#schDate');
    if (date) date.addEventListener('change', (ev) => { state.filters.schDate = ev.target.value; renderSchedules(); });
    const clear = qs('#schClearDate');
    if (clear) clear.addEventListener('click', () => {
      state.filters.schDate = '';
      if (date) date.value = '';
      renderSchedules();
    });
    const add = qs('#addSchBtn');
    if (add) add.addEventListener('click', () => openScheduleForm(null));

    qsa('[data-schview]').forEach((toggle) => {
      toggle.addEventListener('click', () => {
        state.filters.schView = toggle.dataset.schview;
        renderSchedules();
      });
    });
  }

  /* ---------- voice search (progressive enhancement) ---------- */
  function wireVoiceSearch() {
    const mic = qs('#empMic');
    const input = qs('#empSearch');
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!mic || !input || !Recognition) return;

    mic.hidden = false;
    let listening = false;
    let recognition = null;

    mic.addEventListener('click', () => {
      if (listening && recognition) { recognition.stop(); return; }
      try {
        recognition = new Recognition();
      } catch (err) {
        toast('Voice search is not available in this browser.', 'warn');
        mic.hidden = true;
        return;
      }
      recognition.lang = 'en-PH';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => { listening = true; mic.classList.add('is-live'); mic.setAttribute('aria-label', 'Stop voice search'); };
      recognition.onend = () => { listening = false; mic.classList.remove('is-live'); mic.setAttribute('aria-label', 'Search by voice'); };
      recognition.onerror = () => { toast('Could not hear that. Try typing instead.', 'warn'); };
      recognition.onresult = (ev) => {
        const said = (ev.results[0] && ev.results[0][0] && ev.results[0][0].transcript || '').trim();
        if (!said) return;
        input.value = said;
        state.filters.empQuery = said;
        renderEmployees();
        toast('Searching for \u201c' + said + '\u201d.');
      };
      try { recognition.start(); } catch (err) { /* already running */ }
    });
  }

  function wireSettingsView() {
    const general = qs('#generalForm');
    if (general) general.addEventListener('submit', (ev) => {
      ev.preventDefault();
      clearErrors(general);
      const name = val(general, 'setCompany');
      if (!name) { fieldError(general, 'setCompany', 'Give the company a name.'); toast('Company name cannot be empty.', 'warn'); return; }
      state.settings.companyName = name;
      state.settings.otMultiplier = clamp(numVal(general, 'setOt') || 1, 1, 3);
      state.settings.paydayLag = clamp(Math.round(numVal(general, 'setPayday')), 0, 15);
      saveSettings();
      renderChrome();
      renderSettingsSections();
      toast('Settings saved successfully.');
    });

    const saveDed = qs('#saveDedBtn');
    if (saveDed) saveDed.addEventListener('click', () => {
      collectDeductions();
      saveSettings();
      renderDeductionCards();
      renderChrome();
      toast('Settings saved successfully.');
    });

    const resetDed = qs('#resetDedBtn');
    if (resetDed) resetDed.addEventListener('click', async () => {
      const ok = await confirmDialog({
        title: 'Reset deduction rates?',
        message: 'Rates, caps and the exempt amount go back to the sample values PayFlow ships with.',
        confirmLabel: 'Reset rates'
      });
      if (!ok) return;
      state.settings.deductions = JSON.parse(JSON.stringify(DEFAULT_SETTINGS.deductions));
      saveSettings();
      renderDeductionCards();
      renderChrome();
      toast('Deduction rates reset to sample values.');
    });

    const grid = qs('#dedGrid');
    if (grid) grid.addEventListener('change', (ev) => {
      const box = ev.target.closest('input[type="checkbox"]');
      if (!box) return;
      const card = box.closest('.dedcard');
      if (!card) return;
      card.classList.toggle('is-off', !box.checked);
      const state_ = qs('.dedcard__state', card);
      if (state_) state_.textContent = box.checked ? 'Active' : 'Off';
    });

    const sections = qs('#settingsSections');
    if (sections) {
      sections.addEventListener('click', (ev) => {
        const row = ev.target.closest('.sectionrow');
        if (row) {
          const open = row.getAttribute('aria-expanded') === 'true';
          row.setAttribute('aria-expanded', String(!open));
          const panel = qs('#panel-' + row.dataset.section);
          if (panel) panel.hidden = open;
          return;
        }
        const mock = ev.target.closest('[data-mock]');
        if (mock) { toast(mock.dataset.mock); return; }
        if (ev.target.closest('[data-reset-demo]')) resetDemoData();
      });

      sections.addEventListener('change', (ev) => {
        const notif = ev.target.closest('[data-notif]');
        if (notif) {
          state.settings.notifications[notif.dataset.notif] = notif.checked;
          saveSettings();
          toast('Notification preference saved.');
          return;
        }
        const integration = ev.target.closest('[data-integration]');
        if (integration) {
          state.settings.integrations[integration.dataset.integration] = integration.checked;
          saveSettings();
          toast(integration.checked ? 'Integration connected.' : 'Integration disconnected.');
          return;
        }
        const pref = ev.target.closest('[data-pref]');
        if (pref) {
          state.settings[pref.dataset.pref] = pref.value;
          saveSettings();
          renderChrome();
          toast('Preference applied.');
        }
      });
    }
  }

  function wireDelegatedActions() {
    const main = qs('#main');
    if (!main) return;
    main.addEventListener('click', (ev) => {
      const target = ev.target.closest('[data-action]');
      if (!target) return;
      const id = target.dataset.id;
      const action = target.dataset.action;

      if (action === 'emp-view' || action === 'emp-edit' || action === 'emp-delete') {
        const emp = findEmployee(id);
        if (!emp) { toast('That employee is no longer on file.', 'warn'); return; }
        if (action === 'emp-view') openEmployeeDetails(emp);
        if (action === 'emp-edit') openEmployeeForm(emp);
        if (action === 'emp-delete') removeEmployee(emp);
        return;
      }
      if (action === 'pay-details') openPayrollDetails(id);
      if (action === 'pay-slip') openPayslip(id, state.filters.payPeriod);
      if (action === 'pay-process') openProcessPayroll(id);
      if (action === 'pay-correct') openCorrection(id);
      if (action === 'sch-edit') {
        const s = state.schedules.find((x) => x.id === id);
        if (s) openScheduleForm(s);
      }
      if (action === 'sch-delete') removeSchedule(id);
      if (action === 'sch-add-day') openScheduleForm(null, id);
    });
  }

  /* =======================================================
     19. BOOT
     ======================================================= */
  function init() {
    loadState();
    wireLogin();
    wireChrome();
    wireEmployeeView();
    wireVoiceSearch();
    wirePayrollView();
    wireScheduleView();
    wireSettingsView();
    wireDelegatedActions();

    window.addEventListener('hashchange', applyRoute);

    const session = read(KEYS.session, null);
    if (session && session.user) {
      const label = qs('#dropdownUser');
      if (label) label.textContent = session.user;
      showApp();
    } else {
      if (!location.hash) location.hash = '#/home';
      showLogin();
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();