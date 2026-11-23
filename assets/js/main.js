/* ===== Logo ===== */
const LOGO_PATHS = [
  [
    "M19.6 0C6.982 0 -2.346 11.852 0.521 24.242L37.093 182.269C39.161 191.21 47.066 197.534 56.172 197.534H164.402L230.192 234.922C233.061 236.552 236.524 234.104 235.981 230.829L230.462 197.534H261.553C271.495 197.534 279.86 190.026 281.013 180.07L299.298 22.042C300.655 10.305 291.558 0 279.838 0H19.6Z",
    "#09AF72",
  ],
  [
    "M102.585 81.854C113.012 81.854 121.466 73.332 121.466 62.818C121.466 52.304 113.012 43.781 102.585 43.781C92.157 43.781 83.704 52.304 83.704 62.818C83.704 73.332 92.157 81.854 102.585 81.854Z",
    "#0A8A66",
  ],
  [
    "M178.738 81.854C189.166 81.854 197.619 73.332 197.619 62.818C197.619 52.304 189.166 43.781 178.738 43.781C168.311 43.781 159.857 52.304 159.857 62.818C159.857 73.332 168.311 81.854 178.738 81.854Z",
    "#0A8A66",
  ],
  [
    "M197.359 100.75C197.359 106.976 196.143 113.14 193.78 118.892C191.417 124.644 187.953 129.87 183.587 134.273C179.221 138.675 174.037 142.167 168.333 144.55C162.628 146.932 156.513 148.158 150.339 148.158C144.164 148.158 138.05 146.932 132.345 144.55C126.64 142.167 121.457 138.675 117.09 134.273C112.724 129.87 109.26 124.644 106.897 118.892C104.535 113.14 103.318 106.976 103.318 100.75H150.339H197.359Z",
    "#0A8A66",
  ],
  [
    "M100.069 79.308C110.497 79.308 118.95 70.785 118.95 60.271C118.95 49.757 110.497 41.234 100.069 41.234C89.642 41.234 81.189 49.757 81.189 60.271C81.189 70.785 89.642 79.308 100.069 79.308Z",
    "white",
  ],
  [
    "M176.223 79.308C186.65 79.308 195.103 70.785 195.103 60.271C195.103 49.757 186.65 41.234 176.223 41.234C165.795 41.234 157.342 49.757 157.342 60.271C157.342 70.785 165.795 79.308 176.223 79.308Z",
    "white",
  ],
  [
    "M195.4 98.758C195.4 104.984 194.184 111.148 191.821 116.9C189.458 122.652 185.994 127.878 181.628 132.281C177.262 136.683 172.078 140.175 166.374 142.557C160.669 144.94 154.554 146.166 148.38 146.166C142.205 146.166 136.091 144.94 130.386 142.557C124.681 140.175 119.498 136.683 115.131 132.281C110.765 127.878 107.301 122.652 104.939 116.9C102.576 111.148 101.359 104.984 101.359 98.758H148.38H195.4Z",
    "white",
  ],
  [
    "M355.062 157.683V54.142H331.55V35.047H377.264V157.683H355.062Z",
    "#0D163F",
  ],
  [
    "M420.909 157.683V54.142H397.397V35.047H443.112V157.683H420.909Z",
    "#0D163F",
  ],
  [
    "M489.141 137.04H544.074V157.683H460.8V138.789L515.383 56.215H460.8V35.572H544.074V54.466L489.141 137.04Z",
    "#0D163F",
  ],
  [
    "M642.472 134.415H593.838L585.79 157.683H560.074L603.985 35.397H632.5L676.412 157.683H650.52L642.472 134.415ZM635.824 114.822L618.155 63.738L600.486 114.822H635.824Z",
    "#0D163F",
  ],
  [
    "M724.993 63.365C719.695 63.365 714.843 62.048 710.441 59.415C706.112 56.782 702.642 53.283 700.031 48.919C697.493 44.48 696.225 39.627 696.225 34.361C696.225 28.943 697.493 24.053 700.031 19.689C702.642 15.325 706.112 11.864 710.441 9.30599C714.843 6.74799 719.695 5.46899 724.993 5.46899C728.947 5.46899 732.641 6.22099 736.074 7.72599C739.508 9.15599 742.53 11.187 745.141 13.82C747.752 16.454 749.806 19.539 751.298 23.075C752.789 26.611 753.536 30.373 753.536 34.361C753.536 39.627 752.269 44.48 749.73 48.919C747.192 53.283 743.762 56.782 739.432 59.415C735.103 62.048 730.29 63.365 724.993 63.365ZM724.993 55.352C728.799 55.352 732.269 54.412 735.403 52.531C738.537 50.65 741.036 48.129 742.902 44.969C744.769 41.734 745.701 38.198 745.701 34.361C745.701 30.448 744.73 26.912 742.79 23.752C740.924 20.517 738.425 17.959 735.291 16.078C732.232 14.196 728.799 13.256 724.993 13.256C721.039 13.256 717.493 14.234 714.359 16.19C711.225 18.071 708.726 20.629 706.859 23.865C704.993 27.025 704.061 30.523 704.061 34.361C704.061 38.273 704.993 41.847 706.859 45.082C708.726 48.242 711.261 50.763 714.471 52.644C717.681 54.449 721.187 55.352 724.993 55.352ZM712.792 49.596V19.012H726.112C729.395 19.012 732.12 19.839 734.283 21.495C736.447 23.075 737.53 25.671 737.53 29.282C737.53 31.614 736.97 33.495 735.85 34.925C734.807 36.355 733.463 37.483 731.821 38.311L738.201 49.596H729.358L723.65 39.214H721.075V49.596H712.792ZM721.075 32.216H726.336C727.231 32.216 727.939 31.915 728.463 31.313C729.059 30.712 729.358 29.997 729.358 29.169C729.358 28.266 729.059 27.552 728.463 27.025C727.939 26.423 727.231 26.122 726.336 26.122H721.075V32.216Z",
    "#0D163F",
  ],
];
const logoSvg = (full) =>
  `<img class="logo-img${full ? " full" : ""}" src="assets/images/11ZA_logo.png" alt="11za" width="1508" height="${full ? 692 : 530}">`;
document
  .querySelectorAll("[data-logo]")
  .forEach((el) => (el.innerHTML = logoSvg(!!el.closest("footer"))));

function wireShots(root = document) {
  root.querySelectorAll(".shot img").forEach((img) => {
    const sh = img.closest(".shot");
    const miss = () => sh.classList.add("missing");
    if (img.complete && img.naturalWidth === 0) miss();
    img.addEventListener("error", miss, { once: true });
    img.addEventListener(
      "load",
      () => {
        if (img.naturalWidth) sh.querySelector(".lab")?.remove();
      },
      { once: true },
    );
  });
}

/* hero product tour */
const TOUR = [
  {
    k: "inbox",
    t: "Team inbox",
    phrase: "puts your whole team on one inbox.",
    url: "app.11za.in/inbox",
    a: "Assigned in 2 seconds",
    a2: "Auto-routing · sales",
    b: "4 Team Members · 1 number",
    b2: "Shared inbox",
    pop: [
      ["c", "Hi, 3BHK price at Vesu?"],
      ["b", "Here are the brochure and price list. Book a site visit?"],
    ],
  },
  {
    k: "broadcasts",
    t: "Broadcasts",
    phrase: "reaches every customer in one click.",
    url: "app.11za.in/broadcasts",
    a: "Sent to 4,820 customers",
    a2: "Diwali offer campaign",
    b: "Read reports live",
    b2: "Delivered · read · replied",
    pop: [
      [
        "b",
        "Diwali special: 20% off this weekend only. Show this message at billing.",
      ],
      ["c", "Booking for Saturday!"],
    ],
  },
  {
    k: "chatbot",
    t: "Chatbots",
    phrase: "answers FAQs while you sleep.",
    url: "app.11za.in/flows",
    a: "Answered at 11:47 PM",
    a2: "Chatbot · fee query",
    b: "No-code flow builder",
    b2: "Buttons, lists, forms",
    pop: [
      ["c", "JEE batch ki fees kitni hai?"],
      [
        "b",
        "Here are the fee structure and timings. Book a free demo class?",
      ],
    ],
  },
  {
    k: "analytics",
    t: "Analytics",
    phrase: "shows who replied, and who didn't.",
    url: "app.11za.in/analytics",
    a: "Avg. first reply: 38 sec",
    a2: "Team performance",
    b: "12 chats need a reply",
    b2: "Follow-up alert",
    pop: [
      ["b", "Priya: 41 chats · 96% replied"],
      ["b", "Rahul: 33 chats · 71% replied"],
    ],
  },
];
const tabsEl = document.getElementById("tabs"),
  slidesEl = document.getElementById("slides");
const rot = document.getElementById("rotText");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
let cur = 0,
  runId = 0,
  paused = false;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function paint(i) {
  const t = TOUR[i];
  tabsEl.querySelectorAll(".tab").forEach((b, j) => {
    b.setAttribute("aria-selected", j === i);
    b.tabIndex = j === i ? 0 : -1;
    b.querySelector(".bar").style.cssText = "";
  });
  slidesEl.querySelectorAll(".shot").forEach((s, j) => {
    s.classList.toggle("on", j === i);
    const vid = s.querySelector("video");
    if (vid) {
      if (j === i) {
        vid.currentTime = 0;
        vid.play().catch(() => { });
      } else vid.pause();
    }
  });
  document.getElementById("burl").textContent = t.url;
  document.getElementById("fA").textContent = t.a;
  document.getElementById("fA2").textContent = t.a2;
  document.getElementById("fB").textContent = t.b;
  document.getElementById("fB2").textContent = t.b2;
  document.getElementById("pop").innerHTML = t.pop
    .map(([w, x]) => `<div class="m ${w === "b" ? "b" : ""}">${x}</div>`)
    .join("");
}
async function typeTo(text, id) {
  const curText = rot.textContent;
  for (let k = curText.length; k >= 0; k--) {
    if (id !== runId) return;
    rot.textContent = curText.slice(0, k);
    await sleep(18);
  }
  for (let k = 1; k <= text.length; k++) {
    if (id !== runId) return;
    rot.textContent = text.slice(0, k);
    await sleep(42);
  }
}
const HOLD = 5200;
async function go(i, manual) {
  const id = ++runId;
  cur = i;
  paint(i);
  if (reduce) {
    rot.textContent = TOUR[i].phrase;
    if (!manual) {
      setTimeout(() => {
        if (id === runId) go((i + 1) % TOUR.length);
      }, HOLD);
    }
    return;
  }
  if (rot.textContent !== TOUR[i].phrase)
    await typeTo(TOUR[i].phrase, id);
  if (id !== runId) return;
  const bar = tabsEl.children[i].querySelector(".bar");
  bar.style.transition = "none";
  bar.style.width = "0";
  void bar.offsetWidth;
  bar.style.transition = `width ${HOLD}ms linear`;
  bar.style.width = "100%";
  await sleep(HOLD);
  while (paused && id === runId) await sleep(300);
  if (id === runId) go((i + 1) % TOUR.length);
}
tabsEl.addEventListener("click", (e) => {
  const b = e.target.closest(".tab");
  if (b) go([...tabsEl.children].indexOf(b), true);
});
tabsEl.addEventListener("keydown", (e) => {
  let n = cur;
  if (e.key === "ArrowRight") n = (cur + 1) % TOUR.length;
  else if (e.key === "ArrowLeft")
    n = (cur - 1 + TOUR.length) % TOUR.length;
  else return;
  e.preventDefault();
  go(n, true);
  tabsEl.children[n].focus();
});
const stage = document.querySelector(".stage");
stage.addEventListener("mouseenter", () => (paused = true));
stage.addEventListener("mouseleave", () => (paused = false));
paint(0);
setTimeout(() => go(0), 1200);

/* calculator */
const fmt = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
function calc() {
  const leads = +cLeads.value,
    miss = +cMiss.value / 100,
    conv = +cConv.value / 100,
    val = Math.max(0, +cVal.value || 0);
  oLeads.textContent = (+cLeads.value).toLocaleString("en-IN");
  oMiss.textContent = cMiss.value + "%";
  oConv.textContent = cConv.value + "%";
  const late = leads * miss,
    cust = late * conv;
  rLate.textContent = Math.round(late).toLocaleString("en-IN");
  rCust.textContent = cust.toFixed(1);
  rBig.textContent = fmt(cust * val);
}
["cLeads", "cMiss", "cConv", "cVal"].forEach((id) =>
  document.getElementById(id).addEventListener("input", calc),
);
calc();

/* message cost calculator */
const RATES = { marketing: 1, utility: 0.15 };
const inr = (n, d) =>
  "₹" +
  n.toLocaleString("en-IN", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
const money = (n) =>
  inr(n, Number.isInteger(Math.round(n * 100) / 100) ? 0 : 2);
const mcPeople = document.getElementById("mcPeople"),
  mcTimes = document.getElementById("mcTimes");
function mcCalc() {
  const people = Math.max(0, Math.floor(+mcPeople.value || 0)),
    times = Math.min(60, Math.max(1, Math.floor(+mcTimes.value || 1)));
  const cat = document.querySelector('input[name="mcCat"]:checked').value,
    other = cat === "marketing" ? "utility" : "marketing";
  const msgs = people * times,
    cost = msgs * RATES[cat],
    alt = msgs * RATES[other];
  document.getElementById("mcTotal").textContent = money(cost);
  document.getElementById("mcLine").textContent =
    `${people.toLocaleString("en-IN")} people × ${times} ${cat} message${times > 1 ? "s" : ""} × ${inr(RATES[cat], 2)}`;
  document.getElementById("mcMsgs").textContent =
    msgs.toLocaleString("en-IN");
  document.getElementById("mcRate").textContent = inr(RATES[cat], 2);
  document.getElementById("mcYear").textContent = money(cost * 12);
  document.getElementById("mcAlt").textContent =
    `The same send as ${other[0].toUpperCase() + other.slice(1)} messages would cost ${money(alt)}.`;
  document
    .querySelectorAll("#mcQuick button")
    .forEach((b) =>
      b.setAttribute("aria-pressed", +b.dataset.v === people),
    );
}
document.getElementById("mcQuick").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  mcPeople.value = b.dataset.v;
  mcCalc();
});
document.getElementById("mcMinus").addEventListener("click", () => {
  mcTimes.value = Math.max(1, (+mcTimes.value || 1) - 1);
  mcCalc();
});
document.getElementById("mcPlus").addEventListener("click", () => {
  mcTimes.value = Math.min(60, (+mcTimes.value || 1) + 1);
  mcCalc();
});
document.getElementById("mcForm").addEventListener("input", mcCalc);
document.getElementById("mcForm").addEventListener("change", mcCalc);
mcCalc();

wireShots();

/* customer logo slider */
(() => {
  const box = document.getElementById("logos");
  const all = [...box.children];
  const ROWS = 3; // row 1: left→right, row 2: right→left, row 3: left→right
  const perRow = Math.ceil(all.length / ROWS);
  box.classList.add("logo-rows");
  for (let r = 0; r < ROWS; r++) {
    const slides = all.slice(r * perRow, (r + 1) * perRow);
    if (!slides.length) continue;
    const row = document.createElement("div");
    row.className = "logo-row" + (r % 2 === 0 ? " to-right" : " to-left");
    const track = document.createElement("div");
    track.className = "logo-track";
    slides.forEach((s) => track.appendChild(s));
    slides.forEach((s) => {
      const c = s.cloneNode(true);
      c.setAttribute("aria-hidden", "true");
      track.appendChild(c);
    });
    row.appendChild(track);
    box.appendChild(row);
    track.style.setProperty("--n", slides.length);
  }
})();

/* sticky header */
const hdr = document.getElementById("top");
addEventListener(
  "scroll",
  () => hdr.classList.toggle("scrolled", scrollY > 20),
  { passive: true },
);

/* count-up + scroll reveal (below the first screen only) */
if (!reduce && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        io.unobserve(el);
        if (el.dataset.count) {
          const end = +el.dataset.count,
            suf = el.dataset.suffix || "";
          const t0 = performance.now();
          const step = (t) => {
            const p = Math.min(1, (t - t0) / 1400);
            el.textContent =
              Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString(
                "en-IN",
              ) + suf;
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        } else {
          el.classList.remove("pre");
        }
      }),
    { threshold: 0.15 },
  );
  const vh = innerHeight;
  document.querySelectorAll("[data-count]").forEach((el) => {
    if (el.getBoundingClientRect().top > vh) {
      el.textContent = "0" + (el.dataset.suffix || "");
      io.observe(el);
    }
  });
  document
    .querySelectorAll(
      ".head, .prob, .pillar, .ind, .au, .steps .step, .story, .plan, .cmp, .calc, .mc, .faq details, .final",
    )
    .forEach((el, i) => {
      if (el.getBoundingClientRect().top > vh) {
        el.classList.add("rv", "pre");
        el.style.transitionDelay = (i % 4) * 70 + "ms";
        io.observe(el);
      }
    });
}
