<style>
        /* =========================================================
    Payflow — Payroll Management System (front-end prototype)
    style.css
        1. Tokens        6. Layout          11. Settings
        2. Base          7. Page heads      12. Modals
        3. Buttons       8. Dashboard       13. Toasts
        4. Forms         9. Tables          14. Login
        5. Status       10. Mobile cards    15. Responsive  16. Print
    ========================================================= */

    /* ---------- 1. TOKENS ---------- */
    :root {
    --sage-900:#36402A;
    --sage-800:#455234;
    --sage-700:#56683F;
    --sage-600:#6E8256;
    --sage-500:#879B6D;   /* primary */
    --sage-400:#A2B489;
    --sage-300:#BFCEA9;
    --sage-200:#D7E0C6;
    --sage-100:#E8EEDC;
    --sage-050:#F1F4EA;

    --cream:#F5F1E8;
    --cream-50:#FBF9F4;
    --beige:#E9E3D5;
    --beige-700:#D9D1BD;
    --beige-900:#C8BEA5;
    --white:#FFFFFF;

    --ink:#2F332A;
    --ink-70:#5C6354;
    --ink-50:#7F8677;
    --ink-30:#A7AC9E;

    --ochre:#9A751C;
    --ochre-bg:#F7EEDA;
    --slate:#4E6A73;
    --slate-bg:#E4EDEF;
    --brick:#A24F3C;
    --brick-bg:#F6E4DF;

    --r-pill:999px;
    --r-lg:18px;
    --r-md:14px;
    --r-sm:10px;

    --sh-1:0 1px 2px rgba(47,51,42,.05);
    --sh-2:0 1px 2px rgba(47,51,42,.04), 0 10px 28px -20px rgba(47,51,42,.35);
    --sh-3:0 24px 60px -24px rgba(47,51,42,.40);

    --topbar-h:66px;
    --sidebar-w:252px;
    --gutter:30px;

    --sans:"Instrument Sans","Segoe UI",system-ui,-apple-system,sans-serif;
    --display:"Bricolage Grotesque","Instrument Sans",system-ui,sans-serif;

    --ease:cubic-bezier(.32,.72,.34,1);
    }

    /* ---------- 2. BASE ---------- */
    *,*::before,*::after{box-sizing:border-box;}
    html{-webkit-text-size-adjust:100%;scroll-padding-top:calc(var(--topbar-h) + env(safe-area-inset-top,0px) + 12px);}
    body{
    margin:0;
    font-family:var(--sans);
    font-size:15px;line-height:1.5;
    color:var(--ink);background:var(--cream);
    -webkit-font-smoothing:antialiased;
    overflow-x:hidden;
    }
    h1,h2,h3,h4,p,dl,dd,figure{margin:0;}
    ul,ol{margin:0;padding:0;list-style:none;}
    button{font:inherit;color:inherit;}
    a{color:inherit;text-decoration:none;}
    img,svg{max-width:100%;}
    table{border-collapse:collapse;width:100%;}

    .sprite{position:absolute;width:0;height:0;overflow:hidden;}
    .icon{width:20px;height:20px;flex:none;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;}
    .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0;}
    .skip-link{position:fixed;top:8px;left:8px;z-index:200;padding:10px 16px;border-radius:var(--r-pill);background:var(--sage-700);color:var(--white);transform:translateY(-200%);}
    .skip-link:focus{transform:none;}

    :where(a,button,input,select,textarea,[tabindex]):focus-visible{
    outline:2.5px solid var(--sage-700);outline-offset:2px;border-radius:var(--r-sm);
    }
    .num{text-align:right;font-variant-numeric:tabular-nums;}
    .money{font-variant-numeric:tabular-nums;}

    /* ---------- 3. BUTTONS ---------- */
    .btn{
    display:inline-flex;align-items:center;justify-content:center;gap:8px;
    padding:10px 18px;min-height:42px;
    border:1.5px solid transparent;border-radius:var(--r-pill);
    font-size:14px;font-weight:600;
    background:var(--white);color:var(--ink);cursor:pointer;
    transition:background .16s var(--ease),color .16s var(--ease),border-color .16s var(--ease),transform .12s var(--ease);
    }
    .btn .icon{width:17px;height:17px;}
    .btn:hover{transform:translateY(-1px);}
    .btn:active{transform:translateY(0);}
    .btn--primary{background:var(--sage-600);color:var(--white);border-color:var(--sage-600);box-shadow:var(--sh-1);}
    .btn--primary:hover{background:var(--sage-700);border-color:var(--sage-700);}
    .btn--ghost{background:var(--white);border-color:var(--beige-700);color:var(--ink-70);}
    .btn--ghost:hover{border-color:var(--sage-400);color:var(--sage-700);background:var(--sage-050);}
    .btn--danger{background:var(--brick-bg);color:var(--brick);border-color:#EBD2CA;}
    .btn--danger:hover{background:var(--brick);color:var(--white);border-color:var(--brick);}
    .btn--solid-danger{background:var(--brick);color:var(--white);border-color:var(--brick);}
    .btn--solid-danger:hover{background:#8E4232;}
    .btn--tiny{min-height:33px;padding:5px 13px;font-size:12.5px;}
    .btn--tiny .icon{width:15px;height:15px;}
    .btn--block{width:100%;}
    .btn[disabled]{opacity:.45;pointer-events:none;}

    .linkbtn{
    background:none;border:0;padding:4px 2px;cursor:pointer;
    font-size:13.5px;font-weight:600;color:var(--sage-600);
    border-bottom:1.5px solid transparent;
    }
    .linkbtn:hover{color:var(--sage-700);border-bottom-color:var(--sage-400);}

    .iconbtn{display:inline-grid;place-items:center;width:38px;height:38px;border:1.5px solid transparent;border-radius:12px;background:transparent;cursor:pointer;transition:background .16s var(--ease),border-color .16s var(--ease);}
    .rowbtn{display:inline-grid;place-items:center;width:32px;height:32px;border:1.5px solid var(--beige-700);border-radius:9px;background:var(--white);color:var(--ink-70);cursor:pointer;transition:all .16s var(--ease);}
    .rowbtn:hover{border-color:var(--sage-400);color:var(--sage-700);background:var(--sage-050);}
    .rowbtn--danger:hover{border-color:#E4C8C0;color:var(--brick);background:var(--brick-bg);}
    .rowbtn .icon{width:16px;height:16px;}
    .textbtn{
    background:none;border:0;padding:4px 8px;border-radius:var(--r-sm);cursor:pointer;
    font-size:13px;font-weight:600;color:var(--sage-700);white-space:nowrap;
    }
    .textbtn:hover{background:var(--sage-100);}

    .segmented{display:inline-flex;gap:3px;padding:3px;background:var(--beige);border-radius:var(--r-pill);}
    .segmented__btn{
    padding:7px 18px;border:0;border-radius:var(--r-pill);background:transparent;cursor:pointer;
    font-size:13px;font-weight:600;color:var(--ink-70);transition:background .16s var(--ease),color .16s var(--ease);
    }
    .segmented__btn:hover{color:var(--sage-700);}
    .segmented__btn.is-on{background:var(--sage-600);color:var(--white);}

    /* ---------- 4. FORMS ---------- */
    .field{display:flex;flex-direction:column;gap:6px;min-width:0;}
    .field label{font-size:12.5px;font-weight:600;color:var(--ink-70);}
    .field input,.field select,.field textarea,.select{
    width:100%;padding:11px 15px;min-height:44px;
    font:inherit;font-size:14.5px;color:var(--ink);
    background:var(--white);border:1.5px solid var(--beige-700);border-radius:var(--r-md);
    transition:border-color .16s var(--ease),box-shadow .16s var(--ease);
    }
    .field textarea{min-height:92px;resize:vertical;line-height:1.55;}
    .field input:hover,.field select:hover,.select:hover{border-color:var(--sage-300);}
    .field input:focus,.field select:focus,.field textarea:focus,.select:focus{outline:none;border-color:var(--sage-500);box-shadow:0 0 0 3.5px var(--sage-100);}
    .field input[aria-invalid="true"]{border-color:var(--brick);box-shadow:0 0 0 3.5px var(--brick-bg);}
    .field input[readonly]{background:var(--cream);color:var(--ink-70);}
    .field__hint{font-size:12px;color:var(--ink-50);}
    .field__error{font-size:12px;color:var(--brick);font-weight:600;}
    .field__error:empty{display:none;}
    .select{
    min-height:42px;padding:9px 38px 9px 15px;font-size:14px;font-weight:500;
    border-radius:var(--r-pill);appearance:none;cursor:pointer;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235C6354' stroke-width='2' stroke-linecap='round'><path d='m6 9.5 6 6 6-6'/></svg>");
    background-repeat:no-repeat;background-position:right 13px center;background-size:16px;
    }
    input[type="date"].select,input[type="time"]{background-image:none;padding-right:15px;}
    .form{display:grid;gap:18px;}
    .form__grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
    .form__grid .span2{grid-column:1/-1;}
    .form__actions{display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap;margin-top:18px;}
    .saverow{display:grid;grid-template-columns:minmax(0,1fr) 220px;gap:14px;align-items:start;}
    .saverow .btn{margin-top:24px;min-height:46px;}
    .checkline{display:flex;align-items:center;gap:10px;font-size:13.5px;color:var(--ink-70);cursor:pointer;}
    .checkline input{width:18px;height:18px;accent-color:var(--sage-600);flex:none;}

    .switch{position:relative;display:inline-flex;align-items:center;flex:none;}
    .switch input{position:absolute;opacity:0;width:44px;height:25px;margin:0;cursor:pointer;}
    .switch__track{width:44px;height:25px;border-radius:var(--r-pill);background:var(--beige-900);transition:background .2s var(--ease);position:relative;pointer-events:none;}
    .switch__track::after{content:"";position:absolute;top:3px;left:3px;width:19px;height:19px;border-radius:50%;background:var(--white);box-shadow:var(--sh-1);transition:transform .2s var(--ease);}
    .switch input:checked + .switch__track{background:var(--sage-600);}
    .switch input:checked + .switch__track::after{transform:translateX(19px);}
    .switch input:focus-visible + .switch__track{outline:2.5px solid var(--sage-700);outline-offset:2px;}

    /* ---------- 5. STATUS ---------- */
    .pill{display:inline-flex;align-items:center;gap:6px;padding:4px 11px 4px 9px;border-radius:var(--r-pill);font-size:12px;font-weight:600;white-space:nowrap;}
    .pill::before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor;flex:none;}
    .pill--paid,.pill--active{background:var(--sage-100);color:var(--sage-700);}
    .pill--pending{background:var(--ochre-bg);color:var(--ochre);}
    .pill--processing{background:var(--slate-bg);color:var(--slate);}
    .pill--inactive{background:var(--beige);color:var(--ink-50);}

    /* ---------- 6. LAYOUT ---------- */
    .app{min-height:100dvh;display:flex;flex-direction:column;}
    .app[hidden]{display:none;}

    .topbar{
    position:sticky;top:0;z-index:40;
    display:flex;align-items:center;gap:14px;
    height:calc(var(--topbar-h) + env(safe-area-inset-top,0px));
    padding:env(safe-area-inset-top,0px) 26px 0;
    background:var(--sage-500);color:var(--white);
    }
    .topbar__menu{display:none;color:var(--white);}
    .topbar__menu:hover{background:rgba(255,255,255,.16);}
    .topbar__brand{display:flex;align-items:center;min-width:0;}
    .topbar__name{font-family:var(--display);font-size:25px;font-weight:600;letter-spacing:-.015em;}
    .topbar__page{display:none;align-items:center;gap:11px;min-width:0;font-family:var(--display);font-size:21px;font-weight:600;letter-spacing:-.015em;}
    .topbar__page-icon{width:25px;height:25px;}
    .topbar__right{margin-left:auto;display:flex;align-items:center;gap:16px;}
    .topbar__period{font-size:12.5px;font-weight:500;color:rgba(255,255,255,.9);padding:6px 13px;border-radius:var(--r-pill);background:rgba(255,255,255,.15);white-space:nowrap;}

    .profile{position:relative;}
    .profile__btn{display:flex;align-items:center;gap:9px;padding:3px;background:none;border:0;color:var(--white);cursor:pointer;border-radius:var(--r-pill);}
    .profile__chev{width:18px;height:18px;opacity:.9;}
    .profile__role{font-size:15px;font-weight:500;}
    .profile__avatar{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:var(--white);color:var(--sage-600);}
    .profile__avatar .icon{width:21px;height:21px;stroke-width:1.6;}
    .profile__btn:hover .profile__avatar{background:var(--sage-050);}

    .dropdown{position:absolute;right:0;top:calc(100% + 12px);z-index:60;width:218px;padding:8px;background:var(--white);color:var(--ink);border:1px solid var(--beige);border-radius:var(--r-md);box-shadow:var(--sh-3);}
    .dropdown[hidden]{display:none;}
    .dropdown__head{padding:8px 12px 10px;font-size:12.5px;color:var(--ink-50);border-bottom:1px solid var(--cream);margin-bottom:6px;}
    .dropdown__item{display:flex;align-items:center;gap:10px;width:100%;padding:10px 12px;border:0;border-radius:var(--r-sm);background:transparent;text-align:left;font-size:14px;font-weight:500;cursor:pointer;}
    .dropdown__item:hover{background:var(--sage-050);color:var(--sage-700);}
    .dropdown__item--danger:hover{background:var(--brick-bg);color:var(--brick);}
    .dropdown__rule{border:0;border-top:1px solid var(--cream);margin:6px 0;}

    .shell{flex:1;display:flex;min-height:0;}

    .sidebar{
    position:sticky;top:calc(var(--topbar-h) + env(safe-area-inset-top,0px));
    align-self:flex-start;width:var(--sidebar-w);flex:none;
    height:calc(100dvh - var(--topbar-h) - env(safe-area-inset-top,0px));
    display:flex;flex-direction:column;gap:22px;
    padding:22px 14px 20px;background:var(--beige);overflow-y:auto;
    }
    .sidebar__head{padding:0 10px;}
    .sidebar__eyebrow{font-size:11.5px;color:var(--ink-50);}
    .sidebar__company{font-family:var(--display);font-size:16px;font-weight:600;line-height:1.25;margin-top:3px;letter-spacing:-.01em;}
    .nav{display:flex;flex-direction:column;gap:10px;}
    .nav__item{
    position:relative;display:flex;align-items:center;gap:13px;
    padding:9px 26px 9px 9px;border-radius:var(--r-pill);
    background:var(--white);color:var(--ink-70);
    font-size:15px;font-weight:500;
    border:1.5px solid transparent;
    transition:background .16s var(--ease),color .16s var(--ease),border-color .16s var(--ease);
    }
    .nav__dot{display:grid;place-items:center;width:30px;height:30px;flex:none;border-radius:50%;background:var(--sage-200);color:var(--sage-700);transition:background .16s var(--ease),color .16s var(--ease);}
    .nav__dot .icon{width:17px;height:17px;}
    .nav__item:hover{border-color:var(--sage-300);color:var(--sage-800);}
    .nav__item::after{content:"";position:absolute;right:13px;width:7px;height:7px;border-radius:50%;background:transparent;transition:background .16s var(--ease);}
    .nav__item.is-active{background:var(--sage-500);color:var(--white);border-color:var(--sage-500);box-shadow:var(--sh-1);}
    .nav__item.is-active .nav__dot{background:var(--sage-300);color:var(--sage-800);}
    .nav__item.is-active::after{background:var(--sage-200);}
    .nav__item.is-active:hover{background:var(--sage-600);border-color:var(--sage-600);color:var(--white);}

    .sidebar__foot{margin-top:auto;display:grid;gap:12px;}
    .paycard{padding:15px;border-radius:var(--r-md);background:var(--sage-700);color:var(--white);}
    .paycard__label{font-size:11.5px;color:var(--sage-200);}
    .paycard__date{font-family:var(--display);font-size:17px;font-weight:600;margin-top:2px;letter-spacing:-.01em;}
    .paycard__meta{font-size:11.5px;color:var(--sage-200);margin-top:4px;}

    .scrim{position:fixed;inset:0;z-index:44;background:rgba(47,51,42,.42);border:0;}
    .scrim[hidden]{display:none;}

    .main{flex:1;min-width:0;padding:var(--gutter) var(--gutter) 60px;}
    .view{display:grid;gap:20px;max-width:1180px;}
    .view[hidden]{display:none;}
    .tabbar{display:none;}

    /* ---------- 7. PAGE HEADS ---------- */
    .pagehead{display:flex;align-items:center;gap:16px;}
    .pagehead__text{display:flex;flex-direction:column;min-width:0;}
    .pagehead__title{font-family:var(--display);font-size:29px;font-weight:600;line-height:1.1;letter-spacing:-.025em;}
    .pagehead__sub{font-size:13.5px;color:var(--ink-50);margin-top:3px;}
    .pagehead__actions{margin-left:auto;display:flex;gap:10px;align-items:center;flex-wrap:wrap;}

    .pagehead--plain .pagehead__title{color:var(--sage-600);}
    .pagehead--withicon .pagehead__icon{display:grid;place-items:center;width:44px;height:44px;flex:none;border-radius:13px;background:var(--sage-100);color:var(--sage-700);}
    .pagehead--withicon .pagehead__icon .icon{width:24px;height:24px;}
    .pagehead--withicon .pagehead__title{color:var(--sage-700);}

    .pagehead--banner{
    align-self:flex-start;
    padding:16px 34px 16px 20px;border-radius:var(--r-lg);
    background:var(--sage-500);color:var(--white);
    }
    .pagehead--banner .pagehead__icon{display:grid;place-items:center;width:44px;height:44px;flex:none;}
    .pagehead--banner .pagehead__icon .icon{width:34px;height:34px;stroke-width:1.9;}
    .pagehead--banner .pagehead__title{font-size:33px;font-weight:700;}

    /* ---------- 8. CARDS & DASHBOARD ---------- */
    .card{background:var(--white);border:1px solid var(--beige);border-radius:var(--r-lg);padding:22px;box-shadow:var(--sh-2);}
    .card--flush{padding:0;overflow:hidden;}
    .card__head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:16px;}
    .card__head--icon{justify-content:flex-start;align-items:flex-start;gap:13px;}
    .cardicon{display:grid;place-items:center;width:38px;height:38px;flex:none;border-radius:11px;background:var(--sage-100);color:var(--sage-700);}
    .card__title{font-family:var(--display);font-size:18px;font-weight:600;letter-spacing:-.015em;}
    .card__desc{font-size:12.5px;color:var(--ink-50);margin-top:3px;max-width:64ch;line-height:1.5;}
    .card__amount{font-family:var(--display);font-size:19px;font-weight:600;letter-spacing:-.02em;font-variant-numeric:tabular-nums;white-space:nowrap;}
    .sublabel{font-size:12px;color:var(--ink-50);margin:-4px 0 12px;}

    .dashgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;align-items:stretch;}
    .dashgrid > .card{display:flex;flex-direction:column;}
    .stat__label{font-size:16px;font-weight:600;color:var(--ink);}
    .stat__value{font-family:var(--display);font-size:37px;font-weight:600;line-height:1.1;letter-spacing:-.035em;font-variant-numeric:tabular-nums;margin-top:4px;}
    .stat__value--date{font-size:34px;}

    .wf__top{display:flex;align-items:flex-end;gap:12px;}
    .wf__num{font-family:var(--display);font-size:66px;font-weight:500;line-height:.86;letter-spacing:-.05em;flex:none;}
    .wf__text{display:flex;flex-direction:column;padding-bottom:3px;min-width:0;}
    .wf__label{font-size:16px;font-weight:600;}
    .wf__hint{font-size:12.5px;color:var(--ink-50);margin-top:1px;}
    .wf__foot{margin-top:auto;padding-top:20px;display:flex;align-items:center;justify-content:space-between;gap:12px;}
    .wf__cta{margin-top:auto;align-self:flex-start;}
    .avstack{display:flex;}
    .avstack span{
    display:grid;place-items:center;width:28px;height:28px;border-radius:50%;
    background:var(--sage-200);color:var(--sage-800);
    font-size:9.5px;font-weight:700;letter-spacing:.02em;
    border:2px solid var(--white);margin-right:-8px;
    }
    .avstack span:last-child{margin-right:0;background:var(--cream);color:var(--ink-50);}

    .minilist{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px;}
    .minilist > div{flex:1 1 130px;padding:11px 14px;border-radius:12px;background:var(--cream);border:1px solid var(--beige);}
    .minilist dt{font-size:11.5px;color:var(--ink-70);font-weight:600;}
    .minilist dd{margin:2px 0 0;font-size:17px;font-weight:600;font-variant-numeric:tabular-nums;letter-spacing:-.015em;}

    .cutoff{display:flex;align-items:center;gap:8px;margin-top:14px;font-size:12.5px;color:var(--ink-70);}
    .cutoff .icon{width:17px;height:17px;color:var(--ochre);}

    .twocol{display:grid;grid-template-columns:1.3fr 1fr;gap:18px;align-items:start;}

    .deptbar{display:flex;gap:3px;height:9px;margin-bottom:16px;}
    .deptbar span{display:block;height:100%;border-radius:var(--r-pill);min-width:4px;}
    .deptlist{display:grid;gap:11px;}
    .deptlist li{display:flex;align-items:center;gap:10px;}
    .deptlist__dot{width:9px;height:9px;border-radius:50%;flex:none;}
    .deptlist__text{flex:1;min-width:0;}
    .deptlist__name{display:block;font-size:14.5px;font-weight:600;line-height:1.2;}
    .deptlist__meta{display:block;font-size:11px;color:var(--ink-50);}
    .deptlist__right{text-align:right;}
    .deptlist__amt{display:block;font-size:14.5px;font-weight:600;font-variant-numeric:tabular-nums;line-height:1.2;}
    .deptlist__pct{display:block;font-size:11px;color:var(--ink-50);font-variant-numeric:tabular-nums;}

    .runbar{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;padding:17px 22px;}
    .runbar__label{font-size:12px;font-weight:600;color:var(--ink-50);}
    .runbar__value{font-family:var(--display);font-size:21px;font-weight:600;letter-spacing:-.02em;font-variant-numeric:tabular-nums;margin-top:2px;}
    .runbar__value--strong{color:var(--sage-700);}

    /* ---------- 9. TOOLBAR & TABLES ---------- */
    .toolbar{display:flex;gap:12px;flex-wrap:wrap;align-items:center;}
    .toolbar__group{margin-left:auto;display:flex;gap:10px;flex-wrap:wrap;align-items:center;justify-content:flex-end;}
    .toolbar__label{font-size:13px;color:var(--ink-50);white-space:nowrap;}
    .search{position:relative;flex:1 1 300px;max-width:380px;min-width:0;}
    .search--lg{flex-basis:480px;max-width:560px;}
    .search__icon{position:absolute;left:17px;top:50%;transform:translateY(-50%);color:var(--ink-70);width:19px;height:19px;pointer-events:none;}
    .search input{
    width:100%;padding:12px 18px 12px 47px;min-height:46px;
    font:inherit;font-size:14.5px;
    background:var(--white);border:1.5px solid var(--beige-700);border-radius:var(--r-pill);
    transition:border-color .16s var(--ease),box-shadow .16s var(--ease);
    }
    .search--lg input{min-height:52px;font-size:16px;font-weight:600;padding-right:52px;}
    .search--lg input::placeholder{font-weight:600;color:var(--ink-70);}
    .search input::placeholder{color:var(--ink-30);}
    .search input:focus{outline:none;border-color:var(--sage-500);box-shadow:0 0 0 3.5px var(--sage-100);}
    .search__mic{
    position:absolute;right:10px;top:50%;transform:translateY(-50%);
    display:grid;place-items:center;width:34px;height:34px;
    border:0;border-radius:50%;background:transparent;color:var(--ink-70);cursor:pointer;
    }
    .search__mic:hover{background:var(--sage-100);color:var(--sage-700);}
    .search__mic.is-live{background:var(--sage-600);color:var(--white);}
    .search__mic[hidden]{display:none;}

    .table-wrap{width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch;}
    .table{min-width:680px;font-size:14px;}
    .table caption{text-align:left;}
    .table th,.table td{padding:12px 16px;text-align:left;vertical-align:middle;}
    .table thead th{font-size:12px;font-weight:700;color:var(--ink-70);letter-spacing:.04em;text-transform:uppercase;white-space:nowrap;}
    .table td.num,.table th.num{text-align:right;font-variant-numeric:tabular-nums;}
    .table .actions-col{text-align:right;width:1%;white-space:nowrap;}
    .table .rowactions{display:flex;gap:6px;justify-content:flex-end;align-items:center;}

    /* soft table — dashboard */
    .table--soft{min-width:420px;}
    .table--soft thead th{background:var(--cream);color:var(--ink-50);text-transform:none;letter-spacing:0;font-size:13px;font-weight:500;padding:12px 16px;}
    .table--soft thead th:first-child{border-radius:10px 0 0 10px;}
    .table--soft thead th:last-child{border-radius:0 10px 10px 0;}
    .table--soft tbody tr td{padding-top:13px;padding-bottom:13px;}
    .table--soft tbody tr + tr td{border-top:1px solid var(--cream);}

    /* grid table — employee & payroll */
    .table--grid thead th{background:var(--cream);border-bottom:1px solid var(--beige);}
    .table--grid th,.table--grid td{border-right:1px solid var(--beige);}
    .table--grid th:last-child,.table--grid td:last-child{border-right:0;}
    .table--grid tbody tr{border-bottom:1px solid var(--beige);}
    .table--grid tbody tr:last-child{border-bottom:0;}
    .table--grid tbody tr:hover{background:var(--cream-50);}
    .table--emp thead th{background:var(--sage-500);color:var(--white);font-size:12.5px;border-right-color:rgba(255,255,255,.28);border-bottom:0;}
    .table--emp thead th:last-child{border-right:0;}

    /* lined table — schedule */
    .table--lined thead th{border-bottom:1.5px solid var(--ink-30);color:var(--ink);font-size:13px;text-transform:none;letter-spacing:0;padding-bottom:10px;}
    .table--lined tbody td{border-bottom:1px solid var(--beige);}
    .table--lined tbody tr:hover td{background:var(--cream-50);}

    .person{display:flex;align-items:center;gap:11px;min-width:0;}
    .person > span:not(.avatar){display:flex;flex-direction:column;min-width:0;}
    .avatar{display:grid;place-items:center;width:32px;height:32px;flex:none;border-radius:50%;background:var(--sage-200);color:var(--sage-800);font-size:11px;font-weight:700;letter-spacing:.02em;}
    .avatar--lg{width:42px;height:42px;font-size:13.5px;}
    .person__name{display:block;font-weight:600;line-height:1.25;}
    .person__meta{display:block;font-size:11.5px;color:var(--ink-50);}
    .mono-id{font-variant-numeric:tabular-nums;font-weight:600;color:var(--ink-70);}
    .approved{display:block;font-size:10px;color:var(--sage-600);font-weight:600;margin-top:1px;}

    .empty{padding:44px 24px;text-align:center;color:var(--ink-50);font-size:14px;}
    .empty--card{background:var(--white);border:1px solid var(--beige);border-radius:var(--r-lg);}
    .empty[hidden]{display:none;}

    /* summary strip — employee page */
    .summary{
    display:grid;grid-template-columns:repeat(3,minmax(0,1fr));
    max-width:760px;border:1px solid var(--beige);border-radius:var(--r-md);
    overflow:hidden;box-shadow:var(--sh-2);background:var(--white);
    }
    .summary__cell{padding:0 0 15px;border-right:1px solid var(--beige);}
    .summary__cell:last-child{border-right:0;}
    .summary__label{padding:11px 16px;background:var(--sage-500);color:var(--white);font-size:13px;font-weight:700;}
    .summary__value{padding:13px 16px 0;font-family:var(--display);font-size:25px;font-weight:600;letter-spacing:-.025em;font-variant-numeric:tabular-nums;}
    .summary__hint{padding:2px 16px 0;font-size:11.5px;color:var(--ink-50);}

    /* week view — schedule */
    .weekgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:14px;}
    .dayCard{background:var(--white);border:1px solid var(--beige);border-radius:var(--r-md);padding:15px;box-shadow:var(--sh-2);display:grid;gap:11px;align-content:start;}
    .dayCard__head{display:flex;align-items:center;justify-content:space-between;gap:10px;}
    .dayCard__head > span:first-child{display:flex;flex-direction:column;min-width:0;}
    .dayCard__day{display:block;font-family:var(--display);font-size:17px;font-weight:600;letter-spacing:-.01em;}
    .dayCard__date{display:block;font-size:11.5px;color:var(--ink-50);}
    .dayCard__add{display:grid;place-items:center;width:30px;height:30px;flex:none;border:0;border-radius:50%;background:var(--sage-600);color:var(--white);cursor:pointer;}
    .dayCard__add:hover{background:var(--sage-700);}
    .dayCard__add .icon{width:17px;height:17px;}
    .shift{padding:11px 12px;border-radius:11px;background:var(--cream);border:1px solid var(--beige);display:grid;gap:3px;}
    .shift__time{font-size:11.5px;font-weight:600;color:var(--sage-700);}
    .shift__name{font-size:14px;font-weight:600;line-height:1.25;}
    .shift__meta{font-size:11.5px;color:var(--ink-50);}
    .shift__actions{display:flex;gap:6px;margin-top:5px;}
    .dayCard__none{font-size:12.5px;color:var(--ink-30);padding:6px 0;}

    /* ---------- 10. MOBILE CARD LISTS ---------- */
    .cardlist,.paycards{display:none;}
    .cardlist li,.paycards li{padding:15px;border-bottom:1px solid var(--cream);}
    .cardlist li:last-child,.paycards li:last-child{border-bottom:0;}
    .minicard__top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;}
    .minicard__grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:13px;padding:12px;border-radius:12px;background:var(--cream);}
    .minicard__grid > div{min-width:0;}
    .minicard__k{display:block;font-size:10.5px;font-weight:600;color:var(--ink-50);}
    .minicard__v{display:block;font-size:14.5px;font-weight:600;font-variant-numeric:tabular-nums;letter-spacing:-.01em;margin-top:1px;}
    .minicard__v--net{color:var(--sage-700);}
    .minicard__actions{display:flex;gap:9px;margin-top:12px;}
    .minicard__actions .btn{flex:1;}
    .paycards .minicard__top .pill{align-self:flex-start;margin-top:5px;}
    .paycards .minicard__btns{display:grid;gap:7px;flex:none;width:150px;}
    .paycards .minicard__btns .btn{width:100%;}

    /* ---------- 11. SETTINGS ---------- */
    .dedgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(236px,1fr));gap:13px;}
    .dedcard{padding:15px;border:1px solid var(--beige);border-radius:var(--r-md);background:var(--cream);display:grid;gap:10px;align-content:start;}
    .dedcard__top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;}
    .dedcard__top > span:first-child{display:flex;flex-direction:column;min-width:0;}
    .dedcard__name{display:block;font-size:13.5px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;}
    .dedcard__sub{display:block;font-size:11.5px;color:var(--ink-50);margin-top:1px;}
    .dedcard__inputs{display:grid;grid-template-columns:1fr 1fr;gap:9px;}
    .dedcard__inputs .field input{min-height:38px;padding:8px 11px;font-size:13.5px;}
    .dedcard__foot{display:flex;align-items:center;justify-content:space-between;gap:10px;padding-top:9px;border-top:1px solid var(--beige-700);font-size:11.5px;color:var(--ink-50);}
    .dedcard__state{font-weight:700;color:var(--sage-600);}
    .dedcard.is-off{opacity:.6;}
    .dedcard.is-off .dedcard__inputs{pointer-events:none;}
    .dedcard.is-off .dedcard__state{color:var(--ink-30);}

    .sectionlist li + li{border-top:1px solid var(--cream);}
    .sectionrow{display:flex;align-items:center;gap:14px;width:100%;padding:16px 22px;background:transparent;border:0;text-align:left;cursor:pointer;transition:background .16s var(--ease);}
    .sectionrow:hover{background:var(--sage-050);}
    .sectionrow__icon{display:grid;place-items:center;width:36px;height:36px;flex:none;border-radius:11px;background:var(--sage-100);color:var(--sage-700);}
    .sectionrow__text{flex:1;min-width:0;}
    .sectionrow__title{display:block;font-weight:600;font-size:14.5px;}
    .sectionrow__desc{display:block;font-size:12.5px;color:var(--ink-50);margin-top:1px;}
    .sectionrow__chev{color:var(--ink-30);transition:transform .2s var(--ease);}
    .sectionrow[aria-expanded="true"] .sectionrow__chev{transform:rotate(90deg);color:var(--sage-600);}
    .sectionpanel{padding:0 22px 22px;display:grid;gap:14px;}
    .sectionpanel[hidden]{display:none;}
    .kv{display:grid;grid-template-columns:repeat(auto-fit,minmax(185px,1fr));gap:12px;}
    .kv > div{padding:12px 15px;border-radius:12px;background:var(--cream);border:1px solid var(--beige);}
    .kv dt{font-size:11.5px;font-weight:600;color:var(--ink-50);}
    .kv dd{margin:2px 0 0;font-size:14.5px;font-weight:600;word-break:break-word;}
    .togglelist{display:grid;gap:10px;}
    .togglerow{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:12px 15px;border-radius:12px;background:var(--cream);border:1px solid var(--beige);}
    .togglerow__text{min-width:0;}
    .togglerow__title{font-weight:600;font-size:14px;}
    .togglerow__desc{font-size:12px;color:var(--ink-50);margin-top:1px;}
    .integrations{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px;}
    .integration{padding:14px;border-radius:12px;background:var(--cream);border:1px solid var(--beige);display:grid;gap:8px;}
    .integration__top{display:flex;align-items:center;gap:10px;}
    .integration__logo{display:grid;place-items:center;width:32px;height:32px;border-radius:9px;background:var(--sage-500);color:var(--white);font-weight:700;font-size:12px;}
    .integration__name{font-weight:600;font-size:14px;}
    .integration__desc{font-size:12px;color:var(--ink-50);line-height:1.45;}
    .settings__logout{max-width:300px;}

    /* ---------- 12. MODALS ---------- */
    .modal-root{position:fixed;inset:0;z-index:80;}
    .modal-root[hidden]{display:none;}
    .modal-layer{position:absolute;inset:0;display:grid;place-items:center;padding:20px;}
    .modal__backdrop{position:absolute;inset:0;background:rgba(47,51,42,.48);border:0;}
    .modal-layer + .modal-layer .modal__backdrop{background:rgba(47,51,42,.34);}
    .modal{
    position:relative;z-index:1;width:min(100%,560px);max-height:min(88dvh,780px);
    display:flex;flex-direction:column;background:var(--white);
    border-radius:var(--r-lg);box-shadow:var(--sh-3);animation:modal-in .22s var(--ease);
    }
    .modal--wide{width:min(100%,720px);}
    .modal--slim{width:min(100%,440px);}
    @keyframes modal-in{from{opacity:0;transform:translateY(12px) scale(.985);}to{opacity:1;transform:none;}}
    .modal__head{display:flex;align-items:flex-start;gap:16px;padding:20px 22px;border-bottom:1px solid var(--cream);}
    .modal__title{font-family:var(--display);font-size:19px;font-weight:600;letter-spacing:-.015em;}
    .modal__sub{font-size:13px;color:var(--ink-50);margin-top:3px;}
    .modal__close{margin-left:auto;border-color:var(--beige);}
    .modal__close:hover{background:var(--cream);}
    .modal__body{padding:22px;overflow-y:auto;overscroll-behavior:contain;}
    .modal__foot{display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap;padding:16px 22px;border-top:1px solid var(--cream);background:var(--cream);border-radius:0 0 var(--r-lg) var(--r-lg);}
    .modal__note{display:flex;gap:10px;padding:12px 14px;border-radius:12px;background:var(--ochre-bg);color:#7A5C15;font-size:12.5px;line-height:1.5;}
    .modal__note .icon{width:18px;height:18px;flex:none;margin-top:1px;}
    .modal__prose{font-size:14.5px;line-height:1.6;color:var(--ink-70);}
    .modal__h{font-family:var(--display);font-size:16px;font-weight:600;margin:22px 0 10px;}

    .slip{border:1px solid var(--beige);border-radius:var(--r-md);overflow:hidden;}
    .slip__head{padding:18px 20px;background:var(--sage-500);color:var(--white);}
    .slip__brand{font-family:var(--display);font-size:24px;font-weight:600;letter-spacing:-.02em;}
    .slip__co{font-size:12.5px;color:rgba(255,255,255,.85);}
    .slip__who{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;padding:16px 20px;background:var(--cream);border-bottom:1px solid var(--beige);}
    .slip__who dt{font-size:11px;font-weight:600;color:var(--ink-50);}
    .slip__who dd{margin:2px 0 0;font-size:14px;font-weight:600;}
    .slip__cols{display:grid;grid-template-columns:1fr 1fr;}
    .slip__col{padding:18px 20px;}
    .slip__col + .slip__col{border-left:1px solid var(--beige);}
    .slip__h{font-size:12px;font-weight:700;color:var(--ink-70);letter-spacing:.03em;margin-bottom:10px;}
    .slip__line{display:flex;justify-content:space-between;gap:14px;padding:6px 0;font-size:13.5px;}
    .slip__line span:last-child{font-variant-numeric:tabular-nums;font-weight:500;}
    .slip__line--total{margin-top:8px;padding-top:10px;border-top:1.5px solid var(--beige);font-weight:700;}
    .slip__net{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;padding:18px 20px;background:var(--sage-700);color:var(--white);}
    .slip__net-label{font-size:12.5px;color:var(--sage-200);font-weight:600;}
    .slip__net-value{font-family:var(--display);font-size:31px;font-weight:600;letter-spacing:-.025em;font-variant-numeric:tabular-nums;}
    .slip__foot{padding:12px 20px;font-size:11.5px;color:var(--ink-50);background:var(--cream);line-height:1.5;}

    .detail-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;}
    .detail-grid > div{padding:12px 14px;border-radius:12px;background:var(--cream);border:1px solid var(--beige);}
    .detail-grid dt{font-size:11px;font-weight:600;color:var(--ink-50);}
    .detail-grid dd{margin:2px 0 0;font-size:14px;font-weight:600;word-break:break-word;}
    .loglist{display:grid;gap:8px;}
    .loglist li{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:11px 14px;border-radius:12px;background:var(--cream);border:1px solid var(--beige);font-size:13px;}
    .loglist__amt{font-weight:700;font-variant-numeric:tabular-nums;}

    /* ---------- 13. TOASTS ---------- */
    .toasts{position:fixed;z-index:120;right:20px;bottom:calc(20px + env(safe-area-inset-bottom,0px));display:flex;flex-direction:column;gap:10px;align-items:flex-end;pointer-events:none;}
    .toast{display:flex;align-items:center;gap:11px;padding:13px 18px;max-width:min(92vw,380px);background:var(--sage-700);color:var(--white);border-radius:var(--r-pill);box-shadow:var(--sh-3);font-size:14px;font-weight:500;animation:toast-in .22s var(--ease);}
    .toast .icon{width:18px;height:18px;flex:none;}
    .toast--warn{background:var(--ochre);}
    .toast--error{background:var(--brick);}
    .toast.is-out{animation:toast-out .2s var(--ease) forwards;}
    @keyframes toast-in{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:none;}}
    @keyframes toast-out{to{opacity:0;transform:translateY(8px);}}

    /* ---------- 14. LOGIN ---------- */
    .login{min-height:100dvh;display:grid;grid-template-columns:1.05fr .95fr;background:var(--cream);}
    .login[hidden]{display:none;}
    .login__art{display:flex;flex-direction:column;justify-content:center;gap:22px;padding:60px clamp(32px,6vw,82px);background:var(--sage-700);color:var(--white);}
    .login__mark{font-family:var(--display);font-size:clamp(52px,7vw,84px);font-weight:700;letter-spacing:-.04em;line-height:1;}
    .login__tag{font-size:17px;line-height:1.55;color:var(--sage-200);max-width:34ch;}
    .login__facts{display:grid;gap:11px;margin-top:6px;}
    .login__facts li{display:flex;align-items:baseline;gap:12px;font-size:14px;color:var(--sage-200);}
    .login__facts span{font-family:var(--display);font-size:21px;font-weight:600;color:var(--white);min-width:34px;}
    .login__panel{display:grid;place-items:center;padding:48px clamp(24px,5vw,64px);}
    .login__form{width:min(100%,384px);display:grid;gap:17px;}
    .login__title{font-family:var(--display);font-size:31px;font-weight:600;letter-spacing:-.025em;}
    .login__sub{font-size:14px;color:var(--ink-50);line-height:1.55;margin-top:-8px;}
    .login__note{font-size:12.5px;color:var(--ink-50);text-align:center;}

    /* ---------- 15. RESPONSIVE ---------- */
    @media (min-width:901px){
    .toolbar .select{width:auto;min-width:146px;max-width:262px;}
    }

    @media (max-width:1080px){
    .dashgrid{grid-template-columns:1fr 1fr;}
    .twocol{grid-template-columns:1fr;}
    .runbar{grid-template-columns:repeat(2,1fr);}
    .summary{max-width:none;}
    }

    @media (max-width:900px){
    :root{--gutter:16px;}
    .login{grid-template-columns:1fr;}
    .login__art{padding:44px 28px 36px;gap:16px;}
    .login__mark{font-size:52px;}
    .login__tag{font-size:15.5px;}
    .login__facts{display:none;}
    .login__panel{padding:32px 24px 56px;}

    .topbar{padding-inline:14px;gap:12px;}
    .topbar__menu{display:inline-grid;}
    .topbar__brand{display:none;}
    .topbar__page{display:flex;}
    .topbar__period{display:none;}
    .profile__role,.profile__chev{display:none;}

    .sidebar{
        position:fixed;z-index:50;left:0;
        top:calc(var(--topbar-h) + env(safe-area-inset-top,0px));
        height:calc(100dvh - var(--topbar-h) - env(safe-area-inset-top,0px));
        width:min(288px,84vw);transform:translateX(-102%);
        transition:transform .26s var(--ease);box-shadow:var(--sh-3);
    }
    .sidebar.is-open{transform:none;}

    .main{padding:16px 14px calc(96px + env(safe-area-inset-bottom,0px));}
    .view{gap:14px;}

    /* the green page title lives in the top bar on mobile */
    .pagehead{display:none;}
    .pagehead--hasactions{display:flex;}
    .pagehead--hasactions .pagehead__text,
    .pagehead--hasactions .pagehead__icon{display:none;}
    .pagehead__actions{margin-left:0;width:100%;}
    .pagehead__actions > *{flex:1;}
    .segmented{width:100%;}
    .segmented__btn{flex:1;}

    .card{padding:16px;border-radius:var(--r-md);}
    .card--flush{padding:0;}
    .card__head{flex-direction:column;align-items:flex-start;gap:7px;}
    .card__head--icon{flex-direction:row;}
    .card__amount{font-size:18px;}
    .dashgrid{grid-template-columns:1fr;gap:14px;}
    .stat__value{font-size:32px;}
    .stat__value--date{font-size:27px;}
    .wf__num{font-size:56px;}
    .runbar{grid-template-columns:1fr 1fr;gap:14px;padding:15px;}
    .runbar__value{font-size:19px;}

    .toolbar{flex-direction:column;align-items:stretch;gap:10px;}
    .search,.search--lg{max-width:none;flex:none;}
    .search--lg input{min-height:48px;font-size:15px;}
    .toolbar__group{margin-left:0;display:grid;grid-template-columns:1fr 1fr;gap:9px;justify-content:stretch;}
    .toolbar__group .btn{width:100%;}
    .toolbar__group .btn--primary{grid-column:1/-1;}
    .toolbar__label{display:none;}

    .table-wrap{display:none;}
    .cardlist,.paycards{display:block;}
    .card--flush .empty{padding:34px 18px;}

    .summary{grid-template-columns:1fr;}
    .summary__cell{border-right:0;border-bottom:1px solid var(--beige);}
    .summary__cell:last-child{border-bottom:0;}

    .weekgrid{grid-template-columns:1fr;}

    .form__grid{grid-template-columns:1fr;}
    .saverow{grid-template-columns:1fr;}
    .saverow .btn{margin-top:0;width:100%;}
    .form__actions{flex-direction:column-reverse;}
    .form__actions .btn{width:100%;}
    .dedgrid{grid-template-columns:1fr;}
    .sectionrow{padding:14px 16px;}
    .sectionpanel{padding:0 16px 16px;}
    .settings__logout{max-width:none;}

    .modal-layer{padding:0;place-items:end stretch;}
    .modal{width:100%;max-width:none;max-height:92dvh;border-radius:var(--r-lg) var(--r-lg) 0 0;animation:sheet-in .26s var(--ease);padding-bottom:env(safe-area-inset-bottom,0px);}
    .modal__foot{border-radius:0;}
    .modal__foot .btn{flex:1;min-width:120px;}
    @keyframes sheet-in{from{transform:translateY(22px);opacity:.6;}to{transform:none;opacity:1;}}
    .slip__cols{grid-template-columns:1fr;}
    .slip__col + .slip__col{border-left:0;border-top:1px solid var(--beige);}

    .toasts{right:12px;left:12px;bottom:calc(84px + env(safe-area-inset-bottom,0px));align-items:stretch;}
    .toast{max-width:none;}

    .tabbar{
        position:fixed;z-index:46;left:0;right:0;bottom:0;
        display:grid;grid-template-columns:repeat(5,1fr);gap:2px;
        padding:7px 6px calc(7px + env(safe-area-inset-bottom,0px));
        background:var(--sage-500);
    }
    .tabbar__item{
        display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;
        min-height:50px;padding:5px 2px;border-radius:13px;
        font-size:10px;font-weight:600;color:rgba(255,255,255,.82);
        transition:background .16s var(--ease),color .16s var(--ease);
    }
    .tabbar__item .icon{width:21px;height:21px;}
    .tabbar__item.is-active{background:rgba(255,255,255,.22);color:var(--white);}
    }

    @media (max-width:440px){
    .main{padding:14px 12px calc(94px + env(safe-area-inset-bottom,0px));}
    .card{padding:14px;}
    .card--flush{padding:0;}
    .cardlist li,.paycards li{padding:13px;}
    .stat__value{font-size:29px;}
    .stat__value--date{font-size:23px;}
    .wf__num{font-size:50px;}
    .minicard__grid{grid-template-columns:repeat(3,1fr);gap:7px;padding:10px;}
    .minicard__v{font-size:13px;}
    .minicard__k{font-size:9.5px;}
    .paycards .minicard__btns{width:132px;}
    .runbar{padding:13px;}
    .runbar__value{font-size:18px;}
    .modal__body{padding:17px;}
    .modal__head{padding:16px 17px;}
    .modal__foot{padding:13px 17px;}
    .slip__net-value{font-size:26px;}
    .topbar__page{font-size:19px;}
    .sectionrow__desc{display:none;}
    }

    @media (prefers-reduced-motion:reduce){
    *,*::before,*::after{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important;}
    }

    /* density preference */
    body.is-compact .table th,body.is-compact .table td{padding:8px 14px;}
    body.is-compact .card{padding:17px;}
    body.is-compact .card--flush{padding:0;}
    body.is-compact .person__meta{display:none;}
    body.is-compact .avatar{width:27px;height:27px;font-size:10px;}
    body.is-compact .cardlist li,body.is-compact .paycards li{padding:12px;}

    /* ---------- 16. PRINT ---------- */
    .printarea{display:none;}
    @media print{
    @page{margin:14mm;}
    body{background:var(--white);}
    .app,.login,.modal-root,.toasts,.skip-link{display:none !important;}
    .printarea{display:block;}
    .printarea .slip{border:1px solid #CFCFCF;}
    .printarea .slip__head,.printarea .slip__net{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
    .print-meta{margin-top:14px;font-size:10.5px;color:#666;}
    }
</style><?php /**PATH C:\xampp\htdocs\Payflow_G2_HCI\resources\views/components/css.blade.php ENDPATH**/ ?>