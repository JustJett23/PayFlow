<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="light">
<title>Payflow — Payroll Management</title>
<meta name="description" content="Payflow — a front-end payroll management prototype built with HTML, CSS and vanilla JavaScript.">
<meta name="theme-color" content="#879B6D">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='7' fill='%23879B6D'/><text x='16' y='23' text-anchor='middle' font-family='Georgia,serif' font-size='20' font-weight='700' fill='%23ffffff'>P</text></svg>">
<meta property="og:title" content="Payflow — Payroll Management">
<meta property="og:description" content="A front-end payroll management prototype: employees, payroll runs, schedules and payslips, all in the browser.">
<meta property="og:type" content="website">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
<x-css />
<x-js />
</head>
<body>

<a class="skip-link" href="#main">Skip to content</a>

<!-- ============ ICON SPRITE ============ -->
<svg class="sprite" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
  <symbol id="i-home" viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></symbol>
  <symbol id="i-users" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.4"/><path d="M2.6 20c.4-3.6 3.2-5.8 6.4-5.8s6 2.2 6.4 5.8"/><path d="M16.2 5.2a3.2 3.2 0 0 1 0 6.1"/><path d="M17.6 14.6c2.1.6 3.6 2.5 3.8 5"/></symbol>
  <symbol id="i-wallet" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 10h18"/><circle cx="16.5" cy="14.5" r="1.3"/><path d="M6 6V5a2 2 0 0 1 2.5-1.9l9 2.2"/></symbol>
  <symbol id="i-calendar" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/><circle cx="8.5" cy="14.5" r="1"/><circle cx="12.5" cy="14.5" r="1"/><circle cx="16.5" cy="14.5" r="1"/></symbol>
  <symbol id="i-settings" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 14.4a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5v.2a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1.1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.6 1.6 0 0 0 1.4-1.1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1h.2a2 2 0 1 1 0 4h-.2a1.6 1.6 0 0 0-1.4 1z"/></symbol>
  <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.3-4.3"/></symbol>
  <symbol id="i-mic" viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0"/><path d="M12 18v3"/></symbol>
  <symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></symbol>
  <symbol id="i-edit" viewBox="0 0 24 24"><path d="M4 20h4L20 8l-4-4L4 16z"/><path d="m14.5 5.5 4 4"/></symbol>
  <symbol id="i-eye" viewBox="0 0 24 24"><path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12"/><circle cx="12" cy="12" r="2.8"/></symbol>
  <symbol id="i-trash" viewBox="0 0 24 24"><path d="M4 7h16M9.5 7V5.2A1.2 1.2 0 0 1 10.7 4h2.6a1.2 1.2 0 0 1 1.2 1.2V7"/><path d="M6.5 7 7.4 19a1.6 1.6 0 0 0 1.6 1.5h6a1.6 1.6 0 0 0 1.6-1.5L17.5 7"/><path d="M10.5 11v5.5M13.5 11v5.5"/></symbol>
  <symbol id="i-print" viewBox="0 0 24 24"><path d="M7 9V3.8h10V9"/><rect x="3.5" y="9" width="17" height="7.5" rx="2"/><rect x="7" y="14" width="10" height="6.2" rx="1.3"/><circle cx="17" cy="12" r=".9" fill="currentColor" stroke="none"/></symbol>
  <symbol id="i-close" viewBox="0 0 24 24"><path d="M6 6 18 18M18 6 6 18"/></symbol>
  <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></symbol>
  <symbol id="i-chev-down" viewBox="0 0 24 24"><path d="m6 9.5 6 6 6-6"/></symbol>
  <symbol id="i-chev-right" viewBox="0 0 24 24"><path d="m9.5 6 6 6-6 6"/></symbol>
  <symbol id="i-arrow-right" viewBox="0 0 24 24"><path d="M4 12h15M13.5 6.5 19.5 12l-6 5.5"/></symbol>
  <symbol id="i-download" viewBox="0 0 24 24"><path d="M12 3.5v11M7.5 10.5 12 15l4.5-4.5"/><path d="M4.5 19.5h15"/></symbol>
  <symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></symbol>
  <symbol id="i-bell" viewBox="0 0 24 24"><path d="M18 9a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6"/><path d="M13.7 20a2 2 0 0 1-3.4 0"/></symbol>
  <symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 3.2 5 6v6c0 4.3 3 7.4 7 8.8 4-1.4 7-4.5 7-8.8V6z"/><path d="m9.3 12 1.9 1.9 3.6-3.6"/></symbol>
  <symbol id="i-plug" viewBox="0 0 24 24"><path d="M9 3.5v5M15 3.5v5"/><path d="M6.5 8.5h11v3.2a5.5 5.5 0 0 1-11 0z"/><path d="M12 17.2v3.3"/></symbol>
  <symbol id="i-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.6"/><path d="M12 11v5.2"/><circle cx="12" cy="8" r=".9" fill="currentColor" stroke="none"/></symbol>
  <symbol id="i-user" viewBox="0 0 24 24"><circle cx="12" cy="8.4" r="3.6"/><path d="M5 20c.5-3.9 3.5-6 7-6s6.5 2.1 7 6"/></symbol>
  <symbol id="i-logout" viewBox="0 0 24 24"><path d="M14.5 7.5V5.6A1.6 1.6 0 0 0 12.9 4H5.6A1.6 1.6 0 0 0 4 5.6v12.8A1.6 1.6 0 0 0 5.6 20h7.3a1.6 1.6 0 0 0 1.6-1.6v-1.9"/><path d="M10 12h10M17 8.8l3.2 3.2-3.2 3.2"/></symbol>
  <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.6"/><path d="M12 7.4V12l3.1 2"/></symbol>
  <symbol id="i-sliders" viewBox="0 0 24 24"><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2.2"/><circle cx="8" cy="17" r="2.2"/></symbol>
  <symbol id="i-warn" viewBox="0 0 24 24"><path d="M12 4.2 2.8 20h18.4z"/><path d="M12 10v4.2"/><circle cx="12" cy="17.2" r=".9" fill="currentColor" stroke="none"/></symbol>
  <symbol id="i-receipt" viewBox="0 0 24 24"><path d="M6 3.5h12v17l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4-2 1.4z"/><path d="M9 8.5h6M9 12.5h6M9 16h3"/></symbol>
  <symbol id="i-refresh" viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-2.6-5.9"/><path d="M20.2 4v4.4h-4.4"/></symbol>
  <symbol id="i-building" viewBox="0 0 24 24"><path d="M4 20.5V6.2l7-2.7v17M11 20.5h9V9.5l-9-3.3"/><path d="M6.6 9.2h1.8M6.6 12.4h1.8M6.6 15.6h1.8M14 11.4h3M14 14.6h3M14 17.8h3"/></symbol>
  <symbol id="i-gavel" viewBox="0 0 24 24"><path d="m13.8 3.6 6.6 6.6M17.1 2l4 4M10.5 6.9l6.6 6.6M13.8 5.3l-8.5 8.5"/><path d="M3 21h10M4.6 12.2l4.2 4.2-2 2-4.2-4.2z"/></symbol>
</svg>

<!-- ============ LOGIN ============ -->
<div class="login" id="loginScreen">
  <div class="login__art" aria-hidden="true">
    <div class="login__mark">Payflow</div>
    <p class="login__tag">Payroll, scheduling and payslips for small Philippine teams — kept in one calm place.</p>
    <ul class="login__facts">
      <li><span>8</span> employee records seeded</li>
      <li><span>2</span> pay periods per month</li>
      <li><span>₱</span> peso-denominated throughout</li>
    </ul>
  </div>
  <div class="login__panel">
    <form class="login__form" id="loginForm" novalidate>
      <h1 class="login__title">Sign in to Payflow</h1>
      <p class="login__sub">This is a front-end prototype. Any username and password will get you in.</p>

      <div class="field">
        <label for="loginUser">Username</label>
        <input id="loginUser" name="username" type="text" autocomplete="username" value="admin" required>
        <p class="field__error" data-error-for="loginUser"></p>
      </div>

      <div class="field">
        <label for="loginPass">Password</label>
        <input id="loginPass" name="password" type="password" autocomplete="current-password" value="payre123" required>
        <p class="field__error" data-error-for="loginPass"></p>
      </div>

      <label class="checkline"><input type="checkbox" id="loginRemember" checked> <span>Keep me signed in on this browser</span></label>

      <button class="btn btn--primary btn--block" type="submit">Sign in</button>
      <p class="login__note">Demo credentials are pre-filled: <strong>admin / payre123</strong></p>
    </form>
  </div>
</div>

<!-- ============ APP ============ -->
<div class="app" id="app" hidden>

  <header class="topbar">
    <button class="iconbtn topbar__menu" id="menuBtn" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="sidebar">
      <svg class="icon"><use href="#i-menu"></use></svg>
    </button>

    <a class="topbar__brand" href="#/home"><span class="topbar__name">Payflow</span></a>

    <span class="topbar__page">
      <svg class="icon topbar__page-icon" aria-hidden="true"><use href="#i-home" id="topbarPageIcon"></use></svg>
      <span id="topbarPageName">Home</span>
    </span>

    <div class="topbar__right">
      <span class="topbar__period" id="topbarPeriod"></span>
      <div class="profile">
        <button class="profile__btn" id="profileBtn" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="profileMenu">
          <svg class="icon profile__chev" aria-hidden="true"><use href="#i-chev-down"></use></svg>
          <span class="profile__role">Admin</span>
          <span class="profile__avatar" aria-hidden="true"><svg class="icon"><use href="#i-user"></use></svg></span>
        </button>
        <div class="dropdown" id="profileMenu" role="menu" hidden>
          <p class="dropdown__head">Signed in as <strong id="dropdownUser">admin</strong></p>
          <button class="dropdown__item" role="menuitem" type="button" data-profile-action="profile"><svg class="icon"><use href="#i-user"></use></svg> Profile</button>
          <button class="dropdown__item" role="menuitem" type="button" data-profile-action="account"><svg class="icon"><use href="#i-shield"></use></svg> Account</button>
          <hr class="dropdown__rule">
          <button class="dropdown__item dropdown__item--danger" role="menuitem" type="button" data-profile-action="logout"><svg class="icon"><use href="#i-logout"></use></svg> Log out</button>
        </div>
      </div>
    </div>
  </header>

  <div class="shell">
    <aside class="sidebar" id="sidebar" aria-label="Sidebar">
      <div class="sidebar__head">
        <p class="sidebar__eyebrow">Payroll workspace</p>
        <p class="sidebar__company" id="sidebarCompany">Payflow Technologies Inc.</p>
      </div>

      <nav class="nav" aria-label="Main navigation">
        <a class="nav__item" href="#/home" data-route="home"><span class="nav__dot"><svg class="icon"><use href="#i-home"></use></svg></span><span class="nav__label">Home</span></a>
        <a class="nav__item" href="#/employee" data-route="employee"><span class="nav__dot"><svg class="icon"><use href="#i-users"></use></svg></span><span class="nav__label">Employee</span></a>
        <a class="nav__item" href="#/payroll" data-route="payroll"><span class="nav__dot"><svg class="icon"><use href="#i-wallet"></use></svg></span><span class="nav__label">Payroll</span></a>
        <a class="nav__item" href="#/schedule" data-route="schedule"><span class="nav__dot"><svg class="icon"><use href="#i-calendar"></use></svg></span><span class="nav__label">Schedule</span></a>
        <a class="nav__item" href="#/settings" data-route="settings"><span class="nav__dot"><svg class="icon"><use href="#i-settings"></use></svg></span><span class="nav__label">Settings</span></a>
      </nav>

      <div class="sidebar__foot">
        <div class="paycard">
          <p class="paycard__label">Next payout</p>
          <p class="paycard__date" id="sidebarPayDate">—</p>
          <p class="paycard__meta" id="sidebarPayMeta">—</p>
        </div>
        <button class="btn btn--ghost btn--block" type="button" data-profile-action="logout">
          <svg class="icon"><use href="#i-logout"></use></svg> Log out
        </button>
      </div>
    </aside>

    <div class="scrim" id="scrim" hidden></div>

    <main class="main" id="main" tabindex="-1">

      <!-- ---------- HOME ---------- -->
      <section class="view" id="view-home" data-view="home" hidden>
        <div class="pagehead pagehead--plain">
          <span class="pagehead__text">
            <span class="pagehead__title">Overview Dashboard</span>
            <span class="pagehead__sub" id="homeGreeting">Payroll at a glance</span>
          </span>
        </div>

        <div class="dashgrid">
          <article class="card wf">
            <div class="wf__top">
              <span class="wf__num" id="statWorkforce">0</span>
              <span class="wf__text">
                <span class="wf__label">Active Workforce</span>
                <span class="wf__hint">Employees actively enrolled</span>
              </span>
            </div>
            <div class="wf__foot">
              <div class="avstack" id="statAvatars"></div>
              <button class="btn btn--tiny btn--ghost" type="button" data-goto="employee">View all <svg class="icon"><use href="#i-arrow-right"></use></svg></button>
            </div>
          </article>

          <article class="card">
            <p class="stat__label">Total Estimated Pay</p>
            <p class="stat__value" id="statGross">₱0.00</p>
            <dl class="minilist">
              <div><dt>Withholding Tax</dt><dd id="statTax">₱0.00</dd></div>
              <div><dt>Est. Net Pay</dt><dd id="statNet">₱0.00</dd></div>
            </dl>
          </article>

          <article class="card">
            <p class="stat__label">Upcoming Payroll</p>
            <p class="stat__value stat__value--date" id="statNextDate">—</p>
            <p class="cutoff"><svg class="icon" aria-hidden="true"><use href="#i-clock"></use></svg><span id="statCutoff">—</span></p>
            <button class="btn btn--tiny btn--ghost wf__cta" type="button" data-goto="payroll">Open payroll run <svg class="icon"><use href="#i-arrow-right"></use></svg></button>
          </article>
        </div>

        <div class="twocol">
          <section class="card">
            <header class="card__head">
              <div>
                <h2 class="card__title">Recent Approved Wage Items</h2>
                <p class="card__desc">Pre-cleared payouts ready for upcoming bank distribution</p>
              </div>
              <button class="linkbtn" type="button" data-goto="payroll">View All Records</button>
            </header>
            <div class="table-wrap">
              <table class="table table--soft" id="recentWagesTable">
                <caption class="sr-only">Most recently paid employees for the current period</caption>
                <thead><tr><th scope="col">Employee</th><th scope="col">Department</th><th scope="col" class="num">Gross Payout</th></tr></thead>
                <tbody></tbody>
              </table>
            </div>
            <ul class="cardlist" id="recentWagesCards"></ul>
            <p class="empty" id="recentWagesEmpty" hidden>No wages approved yet. Run payroll to see them here.</p>
          </section>

          <section class="card">
            <header class="card__head">
              <div>
                <h2 class="card__title">Cost by Department</h2>
                <p class="card__desc" id="deptDesc">Distribution across 5 business branches</p>
              </div>
              <span class="card__amount" id="deptTotal">₱0.00</span>
            </header>
            <div class="deptbar" id="deptBar" role="img" aria-label="Payroll cost split by department"></div>
            <ul class="deptlist" id="deptList"></ul>
          </section>
        </div>
      </section>

      <!-- ---------- EMPLOYEE ---------- -->
      <section class="view" id="view-employee" data-view="employee" hidden>
        <div class="pagehead pagehead--banner">
          <span class="pagehead__icon" aria-hidden="true"><svg class="icon"><use href="#i-users"></use></svg></span>
          <span class="pagehead__text"><span class="pagehead__title">Employee</span></span>
        </div>

        <div class="toolbar">
          <div class="search search--lg">
            <svg class="icon search__icon" aria-hidden="true"><use href="#i-search"></use></svg>
            <label class="sr-only" for="empSearch">Search employee ID or name</label>
            <input id="empSearch" type="search" placeholder="Search employee ID" autocomplete="off">
            <button class="search__mic" id="empMic" type="button" aria-label="Search by voice" hidden>
              <svg class="icon"><use href="#i-mic"></use></svg>
            </button>
          </div>
          <div class="toolbar__group">
            <label class="sr-only" for="empDept">Filter by department</label>
            <select id="empDept" class="select"><option value="all">All departments</option></select>
            <label class="sr-only" for="empStatus">Filter by status</label>
            <select id="empStatus" class="select">
              <option value="all">All</option><option value="Active">Active</option><option value="Inactive">Inactive</option>
            </select>
            <button class="btn btn--primary" type="button" id="addEmpBtn"><svg class="icon"><use href="#i-plus"></use></svg> Add employee</button>
          </div>
        </div>

        <div class="card card--flush">
          <div class="table-wrap">
            <table class="table table--grid table--emp" id="empTable">
              <caption class="sr-only">Employee records</caption>
              <thead><tr>
                <th scope="col">Employees ID</th><th scope="col">Name</th><th scope="col">Department</th>
                <th scope="col" class="num">Hours work</th><th scope="col" class="num">Rate</th>
                <th scope="col" class="num">Gross Salary</th><th scope="col" class="actions-col">Actions</th>
              </tr></thead>
              <tbody></tbody>
            </table>
          </div>
          <ul class="cardlist" id="empCards"></ul>
          <p class="empty" id="empEmpty" hidden>No employees found. Try a different search, or clear the filters.</p>
        </div>

        <div class="summary">
          <div class="summary__cell">
            <p class="summary__label">Total Employee</p>
            <p class="summary__value" id="empTotal">0</p>
            <p class="summary__hint" id="empTotalHint">—</p>
          </div>
          <div class="summary__cell">
            <p class="summary__label">Total Payroll Expense</p>
            <p class="summary__value" id="empExpense">₱0.00</p>
            <p class="summary__hint">Gross for the current period</p>
          </div>
          <div class="summary__cell">
            <p class="summary__label">Average Salary</p>
            <p class="summary__value" id="empAverage">₱0.00</p>
            <p class="summary__hint">Gross per active employee</p>
          </div>
        </div>
      </section>

      <!-- ---------- PAYROLL ---------- -->
      <section class="view" id="view-payroll" data-view="payroll" hidden>
        <div class="pagehead pagehead--plain pagehead--hasactions">
          <span class="pagehead__text">
            <span class="pagehead__title">Payroll</span>
            <span class="pagehead__sub" id="payrollSub">Run, review and correct pay</span>
          </span>
          <div class="pagehead__actions">
            <button class="btn btn--ghost" type="button" id="exportCsvBtn"><svg class="icon"><use href="#i-download"></use></svg> Export CSV</button>
          </div>
        </div>

        <div class="toolbar">
          <div class="search">
            <svg class="icon search__icon" aria-hidden="true"><use href="#i-search"></use></svg>
            <label class="sr-only" for="payTitleSearch">Search employee name or role</label>
            <input id="payTitleSearch" type="search" placeholder="Search employee name or role…" autocomplete="off">
          </div>
          <div class="toolbar__group">
            <label class="sr-only" for="payPeriod">Payroll period</label>
            <select id="payPeriod" class="select"></select>
            <span class="toolbar__label" aria-hidden="true">Filter status:</span>
            <label class="sr-only" for="payStatus">Filter status</label>
            <select id="payStatus" class="select">
              <option value="all">All statuses</option><option value="Paid">Paid</option>
              <option value="Pending">Pending</option><option value="Processing">Processing</option>
            </select>
            <button class="btn btn--primary" type="button" id="runAllBtn"><svg class="icon"><use href="#i-refresh"></use></svg> Run payroll</button>
          </div>
        </div>

        <div class="runbar card" id="runbar">
          <div><p class="runbar__label">Gross pay</p><p class="runbar__value" id="runGross">₱0.00</p></div>
          <div><p class="runbar__label">Total deductions</p><p class="runbar__value" id="runDed">₱0.00</p></div>
          <div><p class="runbar__label">Net pay</p><p class="runbar__value runbar__value--strong" id="runNet">₱0.00</p></div>
          <div><p class="runbar__label">Released</p><p class="runbar__value" id="runPaid">0 of 0</p></div>
        </div>

        <div class="card card--flush">
          <div class="table-wrap">
            <table class="table table--grid" id="payTable">
              <caption class="sr-only">Payroll register for the selected period</caption>
              <thead><tr>
                <th scope="col">Employee</th><th scope="col" class="num">Gross Pay</th>
                <th scope="col" class="num">Total Tax</th><th scope="col" class="num">Net Pay</th>
                <th scope="col">Status</th><th scope="col" class="actions-col">Actions</th>
              </tr></thead>
              <tbody></tbody>
            </table>
          </div>
          <ul class="paycards" id="payCards"></ul>
          <p class="empty" id="payEmpty" hidden>No payroll records match this filter.</p>
        </div>
      </section>

      <!-- ---------- SCHEDULE ---------- -->
      <section class="view" id="view-schedule" data-view="schedule" hidden>
        <div class="pagehead pagehead--plain pagehead--withicon pagehead--hasactions">
          <span class="pagehead__icon" aria-hidden="true"><svg class="icon"><use href="#i-calendar"></use></svg></span>
          <span class="pagehead__text">
            <span class="pagehead__title">Schedule</span>
            <span class="pagehead__sub">Shifts, time in and time out</span>
          </span>
          <div class="pagehead__actions">
            <div class="segmented" role="group" aria-label="Schedule view">
              <button class="segmented__btn is-on" type="button" data-schview="list" aria-pressed="true">List</button>
              <button class="segmented__btn" type="button" data-schview="week" aria-pressed="false">Week</button>
            </div>
          </div>
        </div>

        <div class="toolbar">
          <div class="search">
            <svg class="icon search__icon" aria-hidden="true"><use href="#i-search"></use></svg>
            <label class="sr-only" for="schSearch">Search employee</label>
            <input id="schSearch" type="search" placeholder="Search employee" autocomplete="off">
          </div>
          <div class="toolbar__group">
            <label class="sr-only" for="schEmployee">Filter by employee</label>
            <select id="schEmployee" class="select"><option value="all">All employees</option></select>
            <label class="sr-only" for="schDate">Filter by date</label>
            <input id="schDate" class="select" type="date">
            <button class="btn btn--ghost" type="button" id="schClearDate">Clear date</button>
            <button class="btn btn--primary" type="button" id="addSchBtn"><svg class="icon"><use href="#i-plus"></use></svg> Add schedule</button>
          </div>
        </div>

        <div class="card card--flush" id="schListWrap">
          <div class="table-wrap">
            <table class="table table--lined" id="schTable">
              <caption class="sr-only">Employee schedules</caption>
              <thead><tr>
                <th scope="col">Employees</th><th scope="col">Time</th><th scope="col">Date</th>
                <th scope="col">In</th><th scope="col">Out</th><th scope="col" class="actions-col">Actions</th>
              </tr></thead>
              <tbody></tbody>
            </table>
          </div>
          <ul class="cardlist" id="schCards"></ul>
          <p class="empty" id="schEmpty" hidden>No shifts scheduled for this filter. Add one to get started.</p>
        </div>

        <div id="schWeekWrap" hidden>
          <ul class="weekgrid" id="schWeek"></ul>
          <p class="empty empty--card" id="schWeekEmpty" hidden>No shifts in this seven-day window.</p>
        </div>
      </section>

      <!-- ---------- SETTINGS ---------- -->
      <section class="view" id="view-settings" data-view="settings" hidden>
        <div class="pagehead pagehead--plain">
          <span class="pagehead__text">
            <span class="pagehead__title">Settings</span>
            <span class="pagehead__sub">Company, deductions and preferences</span>
          </span>
        </div>

        <section class="card">
          <header class="card__head card__head--icon">
            <span class="cardicon" aria-hidden="true"><svg class="icon"><use href="#i-building"></use></svg></span>
            <div>
              <h2 class="card__title">Active Workforce</h2>
              <p class="card__desc">General business entity credentials for payroll calculation and receipts.</p>
            </div>
          </header>
          <form class="form" id="generalForm" novalidate>
            <div class="saverow">
              <div class="field">
                <label for="setCompany">System Company Name</label>
                <input id="setCompany" type="text" required maxlength="60">
                <p class="field__error" data-error-for="setCompany"></p>
              </div>
              <button class="btn btn--primary" type="submit">Save Changes</button>
            </div>
            <div class="form__grid">
              <div class="field">
                <label for="setOt">Overtime multiplier</label>
                <input id="setOt" type="number" min="1" max="3" step="0.05" required inputmode="decimal">
                <p class="field__hint">Applied to the hourly rate for overtime hours.</p>
              </div>
              <div class="field">
                <label for="setPayday">Payout lag (days after cut-off)</label>
                <input id="setPayday" type="number" min="0" max="15" step="1" required inputmode="numeric">
                <p class="field__hint">If the payout lands on a weekend, it moves to the Friday before.</p>
              </div>
            </div>
          </form>
        </section>

        <section class="card">
          <header class="card__head card__head--icon">
            <span class="cardicon" aria-hidden="true"><svg class="icon"><use href="#i-gavel"></use></svg></span>
            <div>
              <h2 class="card__title">Taxation &amp; Deductions</h2>
              <p class="card__desc">Sample statutory schedules and non-taxable allowances. These are prototype values, not official SSS, PhilHealth, Pag-IBIG or BIR tables.</p>
            </div>
          </header>
          <p class="sublabel">Mandatory Republic Statutory Deductions</p>
          <div class="dedgrid" id="dedGrid"></div>
          <div class="form__actions">
            <button class="btn btn--ghost" type="button" id="resetDedBtn">Reset to sample rates</button>
            <button class="btn btn--primary" type="button" id="saveDedBtn">Save Changes</button>
          </div>
        </section>

        <section class="card card--flush">
          <ul class="sectionlist" id="settingsSections"></ul>
        </section>

        <button class="btn btn--primary btn--block settings__logout" type="button" data-profile-action="logout">
          <svg class="icon"><use href="#i-logout"></use></svg> Log Out
        </button>
      </section>

    </main>
  </div>

  <nav class="tabbar" aria-label="Mobile navigation">
    <a class="tabbar__item" href="#/home" data-route="home"><svg class="icon"><use href="#i-home"></use></svg><span>Home</span></a>
    <a class="tabbar__item" href="#/employee" data-route="employee"><svg class="icon"><use href="#i-users"></use></svg><span>Employee</span></a>
    <a class="tabbar__item" href="#/payroll" data-route="payroll"><svg class="icon"><use href="#i-wallet"></use></svg><span>Payroll</span></a>
    <a class="tabbar__item" href="#/schedule" data-route="schedule"><svg class="icon"><use href="#i-calendar"></use></svg><span>Schedule</span></a>
    <a class="tabbar__item" href="#/settings" data-route="settings"><svg class="icon"><use href="#i-settings"></use></svg><span>Settings</span></a>
  </nav>
</div>

<!-- ============ OVERLAYS ============ -->
<div class="modal-root" id="modalRoot" hidden></div>
<div class="toasts" id="toasts" role="status" aria-live="polite"></div>
<div class="printarea" id="printArea" aria-hidden="true"></div>

</body>
</html>