"use client";
/* eslint-disable @next/next/no-img-element -- the photo is a small local data URL, next/image adds nothing */
import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { readJSON } from "@/lib/storage";
import {
  EMPTY,
  LINK_FIELDS,
  SKILL_CATS,
  LEVELS as SKILL_LEVELS,
  NOTIFY_FIELDS,
  migrate,
  completion,
  quality,
  skillGap,
  atsCheck,
  readiness,
  type Profile,
} from "@/lib/profile";

const XP_LEVELS = [
  { name: "🌱 Fresher", min: 0 },
  { name: "💻 Junior Dev", min: 100 },
  { name: "⚡ Mid Engineer", min: 300 },
  { name: "🚀 Senior Dev", min: 600 },
  { name: "🏆 Tech Lead", min: 1000 },
];
const ALL_BADGES = [
  { id: "first_search", name: "First Search", emoji: "🔍" },
  { id: "first_save", name: "Job Saver", emoji: "🔖" },
  { id: "first_apply", name: "First Apply", emoji: "📨" },
  { id: "resume_built", name: "Resume Pro", emoji: "📄" },
  { id: "ai_master", name: "AI Master", emoji: "🤖" },
  { id: "mock_done", name: "Interview Ready", emoji: "🎤" },
  { id: "streak_3", name: "On a Roll", emoji: "🔥" },
  { id: "streak_7", name: "Week Warrior", emoji: "⚡" },
  { id: "offer", name: "Offer Getter", emoji: "🏆" },
  { id: "resume_pdf", name: "PDF Master", emoji: "📎" },
];
function getLevel(xp: number) {
  let lvl = XP_LEVELS[0];
  for (const l of XP_LEVELS) if (xp >= l.min) lvl = l;
  const next = XP_LEVELS[XP_LEVELS.indexOf(lvl) + 1];
  return {
    ...lvl,
    pct: next ? Math.round(((xp - lvl.min) / (next.min - lvl.min)) * 100) : 100,
    nextName: next?.name || "Max",
  };
}

const TABS: { group: string; items: [string, string, string][] }[] = [
  {
    group: "Profile",
    items: [
      ["overview", "Overview", "🏠"],
      ["personal", "Personal information", "👤"],
      ["summary", "Professional summary", "📝"],
      ["education", "Education", "🎓"],
      ["experience", "Work experience", "💼"],
      ["skills", "Skills & expertise", "🛠️"],
      ["projects", "Projects portfolio", "🚀"],
      ["achievements", "Certifications & achievements", "🏅"],
      ["languages", "Languages", "🗣️"],
      ["links", "Social & professional links", "🔗"],
    ],
  },
  {
    group: "Career",
    items: [
      ["resume", "Resume management", "📄"],
      ["preferences", "Job preferences", "🎯"],
      ["activity", "Career activity", "📊"],
      ["insights", "AI career insights", "🤖"],
      ["verification", "Profile verification", "✅"],
    ],
  },
  {
    group: "Account",
    items: [
      ["privacy", "Privacy & visibility", "🔒"],
      ["notifications", "Notifications", "🔔"],
      ["settings", "Account settings", "⚙️"],
    ],
  },
];
const ALL_TABS = TABS.flatMap((g) => g.items);

const inp =
  "w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-cyan-500/50 placeholder:text-[var(--t3)]";
const lbl =
  "block text-[11px] uppercase tracking-wider text-[var(--t3)] font-semibold mb-1";
const btn =
  "px-4 py-2 rounded-xl text-sm font-semibold border border-[var(--bds)] hover:bg-[var(--hov)]";
const btnP =
  "px-4 py-2 rounded-xl text-sm font-bold bg-cyan-500 text-white disabled:opacity-50";
const url = (u: string) =>
  u ? (/^https?:\/\//.test(u) ? u : "https://" + u) : "";

function Card({
  title,
  icon,
  children,
  action,
  note,
}: {
  title: string;
  icon?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  note?: string;
}) {
  return (
    <section className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5">
      <div className="flex items-center justify-between gap-3 mb-1 flex-wrap">
        <h2 className="font-display font-bold text-lg">
          {icon} {title}
        </h2>
        {action}
      </div>
      {note && <p className="text-xs text-[var(--t3)] mb-3">{note}</p>}
      <div className={note ? "" : "mt-3"}>{children}</div>
    </section>
  );
}
function F({
  label,
  id,
  children,
  span,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
  span?: boolean;
}) {
  return (
    <div className={span ? "sm:col-span-2" : ""}>
      <label className={lbl} htmlFor={id}>
        {label}
      </label>
      {children}
    </div>
  );
}
function Toggle({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) {
  return (
    <label className="flex items-start justify-between gap-4 py-2.5 border-b border-[var(--bdr)] last:border-0 cursor-pointer">
      <span className="min-w-0">
        <span className="text-sm font-semibold block">{label}</span>
        {hint && <span className="text-xs text-[var(--t3)]">{hint}</span>}
      </span>
      <input
        type="checkbox"
        role="switch"
        className="mt-1 h-5 w-5 shrink-0 accent-[#1D4ED8]"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}
function Meter({ pct, label }: { pct: number; label: string }) {
  const c = pct >= 70 ? "#16A34A" : pct >= 40 ? "#D97706" : "#DC2626";
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="font-semibold">{label}</span>
        <span className="font-bold" style={{ color: c }}>
          {pct}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-[var(--el)] overflow-hidden">
        <div
          className="h-full transition-all"
          style={{ width: pct + "%", background: c }}
        />
      </div>
    </div>
  );
}
function Chips({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value.includes(o);
        return (
          <button
            key={o}
            type="button"
            aria-pressed={on}
            onClick={() =>
              onChange(on ? value.filter((x) => x !== o) : [...value, o])
            }
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${on ? "bg-cyan-500 text-white border-cyan-500" : "border-[var(--bds)]"}`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}
function Empty({ children }: { children: React.ReactNode }) {
  return <div className="text-sm text-[var(--t3)] py-1">{children}</div>;
}
function RemoveBtn({ onClick, what }: { onClick: () => void; what: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Remove ${what}`}
      className="text-xs font-semibold text-red-500 hover:underline"
    >
      Remove
    </button>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [tab, setTab] = useState("overview");
  const [user, setUser] = useState<any>({});
  const [p, setP] = useState<Profile>(EMPTY);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [apps, setApps] = useState<any[]>([]);
  const [saved, setSaved] = useState(0);
  const [aiCount, setAiCount] = useState(0);
  const [resume, setResume] = useState("");
  const [resumeDate, setResumeDate] = useState("");
  const [versions, setVersions] = useState<any[]>([]);
  const [busy, setBusy] = useState("");
  const [aiText, setAiText] = useState("");
  const [skillName, setSkillName] = useState("");
  const [pw, setPw] = useState({ current: "", next: "" });
  const [delPw, setDelPw] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  function flash(m: string) {
    setToast(m);
    setTimeout(() => setToast(""), 3200);
  }

  useEffect(() => {
    const u = readJSON("tl_user", "{}");
    const legacy = {
      name: u.name,
      college: localStorage.getItem("tl_college") || u.college || "",
      role: localStorage.getItem("tl_target_role") || u.targetRole || "",
      bio: localStorage.getItem("tl_bio") || "",
      github: localStorage.getItem("tl_github") || "",
      linkedin: localStorage.getItem("tl_linkedin_url") || "",
      skills: (localStorage.getItem("tl_skills") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    if (!legacy.skills.length && Array.isArray(u.skills))
      legacy.skills = u.skills;
    setUser(u);
    setP(migrate(readJSON("tl_profile", "{}"), legacy));
    setXp(parseInt(localStorage.getItem("tl_xp") || "0") || 0);
    setStreak(parseInt(localStorage.getItem("tl_streak") || "0") || 0);
    setBadges(readJSON("tl_badges", "[]"));
    setApps(readJSON("tl_applications", "[]"));
    setSaved(readJSON("tl_saved", "[]").length);
    setAiCount(parseInt(localStorage.getItem("tl_ai_count") || "0") || 0);
    setResume(localStorage.getItem("tl_resume") || "");
    setResumeDate(localStorage.getItem("tl_resume_updated") || "");
    setVersions(readJSON("tl_resume_versions", "[]"));
    const fromHash = () => {
      const h = window.location.hash.replace("#", "");
      if (ALL_TABS.some((t) => t[0] === h)) setTab(h);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    setLoading(false);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  function go(t: string) {
    setTab(t);
    try {
      history.replaceState(null, "", "#" + t);
    } catch {}
    window.scrollTo({ top: 0 });
  }
  const upd = (patch: Partial<Profile>) => {
    setP((x) => ({ ...x, ...patch }));
    setDirty(true);
  };
  const updPrefs = (patch: Partial<Profile["prefs"]>) =>
    upd({ prefs: { ...p.prefs, ...patch } });
  const updPriv = (patch: Partial<Profile["privacy"]>) =>
    upd({ privacy: { ...p.privacy, ...patch } });
  function setList<
    K extends
      | "education"
      | "experience"
      | "projects"
      | "certs"
      | "awards"
      | "languages"
      | "skills",
  >(k: K, i: number, patch: Partial<Profile[K][number]>) {
    upd({
      [k]: (p[k] as any[]).map((x, j) => (j === i ? { ...x, ...patch } : x)),
    } as any);
  }
  const addTo = (k: keyof Profile, item: any) =>
    upd({ [k]: [...(p[k] as any[]), item] } as any);
  const removeFrom = (k: keyof Profile, i: number) =>
    upd({ [k]: (p[k] as any[]).filter((_, j) => j !== i) } as any);

  function save() {
    if (!p.name.trim()) {
      flash("Please enter your name first");
      go("personal");
      return;
    }
    const clean: Profile = {
      ...p,
      name: p.name.trim(),
      skills: p.skills.filter((s) => s.name.trim()),
    };
    try {
      localStorage.setItem("tl_profile", JSON.stringify(clean));
      // keep the keys other pages read in step
      const u = readJSON("tl_user", "{}");
      u.name = clean.name;
      u.college = clean.education[0]?.college || "";
      u.targetRole = clean.headline;
      u.skills = clean.skills.map((s) => s.name);
      localStorage.setItem("tl_user", JSON.stringify(u));
      localStorage.setItem("tl_college", u.college);
      localStorage.setItem("tl_target_role", clean.headline);
      localStorage.setItem("tl_bio", clean.bio);
      localStorage.setItem("tl_github", clean.links.github || "");
      localStorage.setItem("tl_linkedin_url", clean.links.linkedin || "");
      localStorage.setItem("tl_skills", u.skills.join(","));
      setUser(u);
      setP(clean);
      setDirty(false);
      flash("✅ Profile saved");
    } catch {
      flash(
        "Could not save: browser storage is full or blocked. Try removing the photo.",
      );
    }
  }

  const done = useMemo(
    () => completion(p, resume.trim().length > 50),
    [p, resume],
  );
  const qual = useMemo(() => quality(p), [p]);
  const ats = useMemo(() => atsCheck(resume), [resume]);
  const gap = useMemo(() => skillGap(p), [p]);
  const ready = readiness(
    done.pct,
    qual.pct,
    resume ? ats.score : 0,
    apps.filter((a) => a.status !== "saved").length,
  );
  const level = getLevel(xp);
  const count = (s: string) => apps.filter((a) => a.status === s).length;
  const applied = apps.filter((a) => a.status !== "saved").length;

  async function onPhoto(f?: File) {
    if (!f) return;
    if (!/^image\/(png|jpe?g|webp)$/.test(f.type)) {
      flash("Use a PNG, JPG or WebP image");
      return;
    }
    const img = new Image();
    const src = URL.createObjectURL(f);
    img.onload = () => {
      const s = 256,
        c = document.createElement("canvas");
      c.width = s;
      c.height = s;
      const side = Math.min(img.width, img.height);
      c.getContext("2d")!.drawImage(
        img,
        (img.width - side) / 2,
        (img.height - side) / 2,
        side,
        side,
        0,
        0,
        s,
        s,
      );
      upd({ photo: c.toDataURL("image/jpeg", 0.82) });
      URL.revokeObjectURL(src);
    };
    img.onerror = () => flash("Could not read that image");
    img.src = src;
  }
  function setResumeText(t: string) {
    setResume(t);
    localStorage.setItem("tl_resume", t);
    const d = new Date().toISOString();
    localStorage.setItem("tl_resume_updated", d);
    setResumeDate(d);
  }
  async function uploadResume(f?: File) {
    if (!f) return;
    if (!/\.pdf$/i.test(f.name)) {
      flash(
        "Only PDF upload is supported. For Word files, paste the text below.",
      );
      return;
    }
    setBusy("upload");
    try {
      const fd = new FormData();
      fd.append("file", f);
      const r = await fetch("/api/parse-resume", { method: "POST", body: fd });
      const d = await r.json();
      if (!r.ok || d.error) throw new Error(d.error || "Upload failed");
      setResumeText(d.text);
      flash("✅ Resume added");
    } catch (e: any) {
      flash(e.message || "Upload failed");
    }
    setBusy("");
  }
  function downloadResume() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([resume], { type: "text/plain" }));
    a.download = `${(p.name || "my").replace(/\s+/g, "-")}-resume.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  }
  async function askAI(kind: "resume" | "career") {
    setBusy("ai");
    setAiText("");
    const prompt =
      kind === "resume"
        ? `Review this fresher's resume for a ${p.headline || "software"} role. Give: 1) three strengths 2) five specific fixes 3) missing keywords. Be concise, simple English.\n\n${resume.slice(0, 6000)}`
        : `Fresher profile. Target: ${p.headline || p.prefs.roles || "software developer"}. Skills: ${p.skills.map((s) => s.name).join(", ") || "none listed"}. Projects: ${p.projects.map((x) => x.title).join(", ") || "none"}. Missing for the role: ${gap.missing.join(", ") || "unknown"}. Suggest a 3-step career path and a 4-week learning plan. Be concise, simple English.`;
    try {
      const r = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          max_tokens: 700,
          messages: [
            {
              role: "system",
              content:
                "You are a practical career coach for computer science freshers.",
            },
            { role: "user", content: prompt },
          ],
        }),
      });
      const d = await r.json();
      if (d.error)
        throw new Error(
          typeof d.error === "string" ? d.error : "AI unavailable",
        );
      setAiText(d.choices?.[0]?.message?.content || "No answer came back.");
    } catch (e: any) {
      flash(e.message || "AI is unavailable right now");
    }
    setBusy("");
  }
  function copyProfile() {
    const lines = [
      p.name,
      p.headline,
      [p.city, p.state, p.country].filter(Boolean).join(", "),
      "",
      p.bio,
      "",
      "Skills: " + p.skills.map((s) => s.name).join(", "),
      ...LINK_FIELDS.filter(([k]) => p.links[k]).map(
        ([k, l]) => `${l}: ${p.links[k]}`,
      ),
    ].filter((x, i, a) => x || (a[i - 1] && i < a.length - 1));
    navigator.clipboard.writeText(lines.join("\n")).then(
      () => flash("📋 Profile summary copied"),
      () => flash("Could not copy"),
    );
  }
  function exportData() {
    const data: Record<string, string | null> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)!;
      if (k.startsWith("tl_") && k !== "tl_token")
        data[k] = localStorage.getItem(k);
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob(
        [
          JSON.stringify(
            { exportedAt: new Date().toISOString(), email: user.email, data },
            null,
            2,
          ),
        ],
        { type: "application/json" },
      ),
    );
    a.download = "my-talentlaunch-data.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }
  async function signOut(all = false) {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all }),
      });
    } catch {}
    ["tl_token", "tl_user", "tl_role"].forEach((k) =>
      localStorage.removeItem(k),
    );
    router.push("/");
  }
  async function changePassword() {
    setBusy("pw");
    try {
      const r = await fetch("/api/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pw),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Failed");
      setPw({ current: "", next: "" });
      flash("✅ Password changed");
    } catch (e: any) {
      flash(e.message);
    }
    setBusy("");
  }
  async function deleteAccount() {
    if (!confirm("Delete your account permanently? This cannot be undone."))
      return;
    setBusy("del");
    try {
      const r = await fetch("/api/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: delPw }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Failed");
      Object.keys(localStorage)
        .filter((k) => k.startsWith("tl_"))
        .forEach((k) => localStorage.removeItem(k));
      router.push("/");
    } catch (e: any) {
      flash(e.message);
    }
    setBusy("");
  }

  if (loading)
    return (
      <div className="max-w-6xl mx-auto animate-pulse space-y-4">
        <div className="h-52 bg-[var(--el)] rounded-2xl" />
        <div className="h-64 bg-[var(--el)] rounded-2xl" />
      </div>
    );

  const loc = [p.city, p.state, p.country].filter(Boolean).join(", ");
  const covers: Record<string, string> = {
    blue: "linear-gradient(135deg,#1D4ED8,#0F172A)",
    slate: "linear-gradient(135deg,#334155,#0F172A)",
    teal: "linear-gradient(135deg,#0F766E,#0F172A)",
    indigo: "linear-gradient(135deg,#4338CA,#1E1B4B)",
  };
  const cur = ALL_TABS.find((t) => t[0] === tab)!;

  /* ------------------------------------------------------------------ tab bodies */
  const body: Record<string, React.ReactNode> = {
    overview: (
      <div className="space-y-5">
        <section className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl overflow-hidden shadow-sm">
          <div
            className="relative h-32 sm:h-40"
            style={{ background: covers[p.cover] || covers.blue }}
          >
            <div className="absolute left-5 sm:left-7" style={{ bottom: -48 }}>
              {p.photo ? (
                <img
                  src={p.photo}
                  alt=""
                  className="w-24 h-24 rounded-full object-cover border-4 border-[var(--card)] shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#1D4ED8] text-white border-4 border-[var(--card)] shadow-md flex items-center justify-center text-4xl font-extrabold">
                  {(p.name || "U")[0].toUpperCase()}
                </div>
              )}
            </div>
          </div>
          <div className="px-5 sm:px-7 pb-6" style={{ paddingTop: 60 }}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1" style={{ minWidth: 240 }}>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display font-extrabold text-2xl leading-tight break-words">
                    {p.name || "Your name"}
                  </h1>
                  {user.plan === "pro" && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-500">
                      ⭐ Pro
                    </span>
                  )}
                  {p.prefs.openToWork &&
                    p.prefs.availability !== "Not looking now" && (
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-600 border border-green-500/20">
                        ● Open to work
                      </span>
                    )}
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[var(--el)] text-[var(--t2)]">
                    {p.privacy.visibility === "public"
                      ? "🌐 Public"
                      : p.privacy.visibility === "recruiters"
                        ? "👔 Recruiters only"
                        : "🔒 Private"}
                  </span>
                </div>
                <div className="text-base text-[var(--t2)] mt-1">
                  {p.headline || "Add a headline"}
                  {p.designation && p.designation !== p.headline
                    ? ` · ${p.designation}`
                    : ""}
                </div>
                <div className="text-sm text-[var(--t3)] flex flex-wrap gap-x-5 gap-y-1 mt-2">
                  {loc && <span>📍 {loc}</span>}
                  {user.email && p.privacy.showEmail && (
                    <span className="break-all">✉️ {user.email}</span>
                  )}
                  {p.phone && p.privacy.showPhone && <span>📞 {p.phone}</span>}
                </div>
              </div>
              <div
                className="flex flex-wrap gap-2 shrink-0"
                style={{ alignItems: "center" }}
              >
                <button
                  className={btnP}
                  style={{ height: 40 }}
                  onClick={() => go("personal")}
                >
                  ✏️ Edit profile
                </button>
                <button
                  className={btn}
                  style={{ height: 40 }}
                  onClick={downloadResume}
                  disabled={!resume}
                >
                  ⬇️ Resume
                </button>
                <button
                  className={btn}
                  style={{ height: 40 }}
                  onClick={copyProfile}
                >
                  📋 Share summary
                </button>
              </div>
            </div>
            <div className="mt-6 pt-5 border-t border-[var(--bdr)] grid sm:grid-cols-2 gap-6">
              <Meter pct={done.pct} label="Profile completion" />
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold">
                    {level.name} · {xp} XP
                  </span>
                  <span className="text-[var(--t3)]">
                    {level.pct}% to {level.nextName}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[var(--el)] overflow-hidden">
                  <div
                    className="h-full bg-[#1D4ED8]"
                    style={{ width: level.pct + "%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        {done.pct < 100 && (
          <Card
            title="Finish your profile"
            icon="📈"
            note="Click an item to jump to it."
          >
            <div className="grid sm:grid-cols-2 gap-1.5">
              {done.items.map((i) => (
                <button
                  key={i.label}
                  onClick={() => go(i.tab)}
                  className={`text-left text-sm flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[var(--hov)] ${i.ok ? "text-[var(--t3)] line-through" : ""}`}
                >
                  <span>{i.ok ? "✅" : "⬜"}</span>
                  {i.label}
                </button>
              ))}
            </div>
          </Card>
        )}
        <div className="grid sm:grid-cols-2 gap-5">
          <Card title="About" icon="👤">
            {p.bio ? (
              <p className="text-sm whitespace-pre-wrap break-words">{p.bio}</p>
            ) : (
              <Empty>No summary yet.</Empty>
            )}
          </Card>
          <Card title="Top skills" icon="🛠️">
            {p.skills.length ? (
              <div className="flex flex-wrap gap-2">
                {p.skills.slice(0, 14).map((s) => (
                  <span
                    key={s.name}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-cyan-400 border border-cyan-500/20"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            ) : (
              <Empty>No skills yet.</Empty>
            )}
          </Card>
        </div>
        <Card title="At a glance" icon="📊">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              ["Applied", applied],
              ["Interviews", count("interview")],
              ["Offers", count("offer")],
              ["Saved jobs", saved],
            ].map(([l, v]) => (
              <div
                key={String(l)}
                className="bg-[var(--el)] rounded-xl p-3 text-center"
              >
                <div className="text-2xl font-extrabold text-cyan-400">{v}</div>
                <div className="text-[11px] text-[var(--t2)]">{l}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    ),

    personal: (
      <div className="space-y-5">
        <Card title="Photo and cover" icon="🖼️">
          <div className="flex flex-wrap items-center gap-4">
            {p.photo ? (
              <img
                src={p.photo}
                alt="Profile"
                className="w-20 h-20 rounded-2xl object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-[#1D4ED8] text-white flex items-center justify-center text-3xl font-extrabold">
                {(p.name || "U")[0].toUpperCase()}
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <input
                ref={photoRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => onPhoto(e.target.files?.[0])}
              />
              <button className={btn} onClick={() => photoRef.current?.click()}>
                Upload photo
              </button>
              {p.photo && (
                <button className={btn} onClick={() => upd({ photo: "" })}>
                  Remove
                </button>
              )}
            </div>
            <div className="flex gap-2" role="group" aria-label="Cover colour">
              {Object.keys(covers).map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`Cover ${c}`}
                  aria-pressed={p.cover === c}
                  onClick={() => upd({ cover: c })}
                  className={`w-8 h-8 rounded-lg border-2 ${p.cover === c ? "border-cyan-500" : "border-transparent"}`}
                  style={{ background: covers[c] }}
                />
              ))}
            </div>
          </div>
        </Card>
        <Card title="Personal information" icon="👤">
          <div className="grid sm:grid-cols-2 gap-3">
            <F label="Full name *" id="p-name">
              <input
                id="p-name"
                className={inp}
                value={p.name}
                onChange={(e) => upd({ name: e.target.value })}
              />
            </F>
            <F label="Professional headline" id="p-head">
              <input
                id="p-head"
                className={inp}
                placeholder="e.g. Full Stack Developer"
                value={p.headline}
                onChange={(e) => upd({ headline: e.target.value })}
              />
            </F>
            <F label="Current designation" id="p-des">
              <input
                id="p-des"
                className={inp}
                placeholder="e.g. Final-year B.Tech student"
                value={p.designation}
                onChange={(e) => upd({ designation: e.target.value })}
              />
            </F>
            <F label="Email (from your account)" id="p-em">
              <input
                id="p-em"
                className={inp + " opacity-70"}
                value={user.email || ""}
                readOnly
              />
            </F>
            <F label="Phone number" id="p-ph">
              <input
                id="p-ph"
                type="tel"
                className={inp}
                value={p.phone}
                onChange={(e) => upd({ phone: e.target.value })}
              />
            </F>
            <F label="Date of birth (optional)" id="p-dob">
              <input
                id="p-dob"
                type="date"
                className={inp}
                value={p.dob}
                onChange={(e) => upd({ dob: e.target.value })}
              />
            </F>
            <F label="Gender (optional)" id="p-g">
              <select
                id="p-g"
                className={inp}
                value={p.gender}
                onChange={(e) => upd({ gender: e.target.value })}
              >
                <option value="">Prefer not to say</option>
                <option>Female</option>
                <option>Male</option>
                <option>Non-binary</option>
                <option>Other</option>
              </select>
            </F>
            <F label="Current city" id="p-city">
              <input
                id="p-city"
                className={inp}
                value={p.city}
                onChange={(e) => upd({ city: e.target.value })}
              />
            </F>
            <F label="State" id="p-state">
              <input
                id="p-state"
                className={inp}
                value={p.state}
                onChange={(e) => upd({ state: e.target.value })}
              />
            </F>
            <F label="Country" id="p-ctry">
              <input
                id="p-ctry"
                className={inp}
                value={p.country}
                onChange={(e) => upd({ country: e.target.value })}
              />
            </F>
            <F label="Pin code" id="p-pin">
              <input
                id="p-pin"
                inputMode="numeric"
                maxLength={10}
                className={inp}
                value={p.pin}
                onChange={(e) =>
                  upd({ pin: e.target.value.replace(/[^\dA-Za-z -]/g, "") })
                }
              />
            </F>
            <F
              label="Current address (private, never shown to others)"
              id="p-addr"
              span
            >
              <textarea
                id="p-addr"
                rows={2}
                className={inp}
                value={p.address}
                onChange={(e) => upd({ address: e.target.value })}
              />
            </F>
          </div>
        </Card>
      </div>
    ),

    summary: (
      <Card title="Professional summary" icon="📝">
        <div className="grid sm:grid-cols-2 gap-3">
          <F label="About me" id="s-bio" span>
            <textarea
              id="s-bio"
              rows={5}
              maxLength={800}
              className={inp}
              placeholder="Who you are, what you build, what you want next."
              value={p.bio}
              onChange={(e) => upd({ bio: e.target.value })}
            />
            <div className="text-[11px] text-[var(--t3)] text-right">
              {p.bio.length}/800
            </div>
          </F>
          <F label="Career objective" id="s-obj" span>
            <textarea
              id="s-obj"
              rows={2}
              maxLength={300}
              className={inp}
              value={p.objective}
              onChange={(e) => upd({ objective: e.target.value })}
            />
          </F>
          <F label="Current employment status" id="s-emp">
            <select
              id="s-emp"
              className={inp}
              value={p.empStatus}
              onChange={(e) => upd({ empStatus: e.target.value })}
            >
              {[
                "Student",
                "Recent graduate",
                "Employed",
                "Freelancer",
                "Between jobs",
              ].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </F>
          <F label="Total work experience" id="s-exp">
            <select
              id="s-exp"
              className={inp}
              value={p.totalExp}
              onChange={(e) => upd({ totalExp: e.target.value })}
            >
              {[
                "",
                "Fresher",
                "Under 1 year",
                "1-2 years",
                "2-3 years",
                "3-5 years",
                "5+ years",
              ].map((o) => (
                <option key={o} value={o}>
                  {o || "Select"}
                </option>
              ))}
            </select>
          </F>
          <F label="Current company" id="s-co">
            <input
              id="s-co"
              className={inp}
              value={p.company}
              onChange={(e) => upd({ company: e.target.value })}
            />
          </F>
          <F label="Preferred industry" id="s-ind">
            <input
              id="s-ind"
              className={inp}
              placeholder="e.g. Fintech, SaaS"
              value={p.industry}
              onChange={(e) => upd({ industry: e.target.value })}
            />
          </F>
          <F label="Career interests" id="s-int" span>
            <input
              id="s-int"
              className={inp}
              placeholder="e.g. AI, web, open source"
              value={p.interests}
              onChange={(e) => upd({ interests: e.target.value })}
            />
          </F>
        </div>
      </Card>
    ),

    education: (
      <Card
        title="Education"
        icon="🎓"
        action={
          <button
            className={btn}
            onClick={() =>
              addTo("education", {
                college: "",
                degree: "B.Tech",
                specialization: "Computer Science",
                courseType: "Full-time",
                startYear: "",
                endYear: "",
                cgpa: "",
                status: "Pursuing",
                coursework: "",
                achievements: "",
              })
            }
          >
            + Add education
          </button>
        }
      >
        {!p.education.length && <Empty>No education added yet.</Empty>}
        <div className="space-y-4">
          {p.education.map((e, i) => (
            <div key={i} className="border border-[var(--bdr)] rounded-xl p-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <F label="College / University" id={`e-c${i}`} span>
                  <input
                    id={`e-c${i}`}
                    className={inp}
                    value={e.college}
                    onChange={(ev) =>
                      setList("education", i, { college: ev.target.value })
                    }
                  />
                </F>
                <F label="Degree" id={`e-d${i}`}>
                  <input
                    id={`e-d${i}`}
                    className={inp}
                    value={e.degree}
                    onChange={(ev) =>
                      setList("education", i, { degree: ev.target.value })
                    }
                  />
                </F>
                <F label="Specialization" id={`e-s${i}`}>
                  <input
                    id={`e-s${i}`}
                    className={inp}
                    value={e.specialization}
                    onChange={(ev) =>
                      setList("education", i, {
                        specialization: ev.target.value,
                      })
                    }
                  />
                </F>
                <F label="Course type" id={`e-t${i}`}>
                  <select
                    id={`e-t${i}`}
                    className={inp}
                    value={e.courseType}
                    onChange={(ev) =>
                      setList("education", i, { courseType: ev.target.value })
                    }
                  >
                    {["Full-time", "Part-time", "Distance", "Online"].map(
                      (o) => (
                        <option key={o}>{o}</option>
                      ),
                    )}
                  </select>
                </F>
                <F label="Status" id={`e-st${i}`}>
                  <select
                    id={`e-st${i}`}
                    className={inp}
                    value={e.status}
                    onChange={(ev) =>
                      setList("education", i, { status: ev.target.value })
                    }
                  >
                    {["Pursuing", "Completed", "Dropped"].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </F>
                <F label="Start year" id={`e-sy${i}`}>
                  <input
                    id={`e-sy${i}`}
                    inputMode="numeric"
                    maxLength={4}
                    className={inp}
                    value={e.startYear}
                    onChange={(ev) =>
                      setList("education", i, {
                        startYear: ev.target.value.replace(/\D/g, ""),
                      })
                    }
                  />
                </F>
                <F label="Graduation year" id={`e-ey${i}`}>
                  <input
                    id={`e-ey${i}`}
                    inputMode="numeric"
                    maxLength={4}
                    className={inp}
                    value={e.endYear}
                    onChange={(ev) =>
                      setList("education", i, {
                        endYear: ev.target.value.replace(/\D/g, ""),
                      })
                    }
                  />
                </F>
                <F label="CGPA / percentage" id={`e-g${i}`}>
                  <input
                    id={`e-g${i}`}
                    className={inp}
                    value={e.cgpa}
                    onChange={(ev) =>
                      setList("education", i, { cgpa: ev.target.value })
                    }
                  />
                </F>
                <F label="Relevant coursework" id={`e-cw${i}`}>
                  <input
                    id={`e-cw${i}`}
                    className={inp}
                    placeholder="DSA, DBMS, OS, Networks"
                    value={e.coursework}
                    onChange={(ev) =>
                      setList("education", i, { coursework: ev.target.value })
                    }
                  />
                </F>
                <F label="Academic achievements" id={`e-a${i}`} span>
                  <textarea
                    id={`e-a${i}`}
                    rows={2}
                    className={inp}
                    value={e.achievements}
                    onChange={(ev) =>
                      setList("education", i, { achievements: ev.target.value })
                    }
                  />
                </F>
              </div>
              <div className="mt-2 text-right">
                <RemoveBtn
                  what="education"
                  onClick={() => removeFrom("education", i)}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    ),

    experience: (
      <Card
        title="Work experience"
        icon="💼"
        action={
          <button
            className={btn}
            onClick={() =>
              addTo("experience", {
                company: "",
                title: "",
                type: "Internship",
                location: "",
                start: "",
                end: "",
                current: false,
                desc: "",
                achievements: "",
                tech: "",
              })
            }
          >
            + Add experience
          </button>
        }
      >
        <Toggle
          label="I am a fresher with no work experience yet"
          checked={p.isFresher}
          onChange={(v) => upd({ isFresher: v })}
          hint="You can still add internships, freelance work or open-source below."
        />
        {!p.experience.length && <Empty>No experience added.</Empty>}
        <div className="space-y-4 mt-3">
          {p.experience.map((x, i) => (
            <div key={i} className="border border-[var(--bdr)] rounded-xl p-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <F label="Company name" id={`x-c${i}`}>
                  <input
                    id={`x-c${i}`}
                    className={inp}
                    value={x.company}
                    onChange={(ev) =>
                      setList("experience", i, { company: ev.target.value })
                    }
                  />
                </F>
                <F label="Job title" id={`x-t${i}`}>
                  <input
                    id={`x-t${i}`}
                    className={inp}
                    value={x.title}
                    onChange={(ev) =>
                      setList("experience", i, { title: ev.target.value })
                    }
                  />
                </F>
                <F label="Employment type" id={`x-ty${i}`}>
                  <select
                    id={`x-ty${i}`}
                    className={inp}
                    value={x.type}
                    onChange={(ev) =>
                      setList("experience", i, { type: ev.target.value })
                    }
                  >
                    {[
                      "Internship",
                      "Full-time",
                      "Part-time",
                      "Contract",
                      "Freelance",
                      "Volunteer",
                    ].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </F>
                <F label="Job location" id={`x-l${i}`}>
                  <input
                    id={`x-l${i}`}
                    className={inp}
                    value={x.location}
                    onChange={(ev) =>
                      setList("experience", i, { location: ev.target.value })
                    }
                  />
                </F>
                <F label="Start date" id={`x-s${i}`}>
                  <input
                    id={`x-s${i}`}
                    type="month"
                    className={inp}
                    value={x.start}
                    onChange={(ev) =>
                      setList("experience", i, { start: ev.target.value })
                    }
                  />
                </F>
                <F label="End date" id={`x-e${i}`}>
                  <input
                    id={`x-e${i}`}
                    type="month"
                    disabled={x.current}
                    className={inp + " disabled:opacity-50"}
                    value={x.current ? "" : x.end}
                    onChange={(ev) =>
                      setList("experience", i, { end: ev.target.value })
                    }
                  />
                </F>
                <label className="flex items-center gap-2 text-sm sm:col-span-2">
                  <input
                    type="checkbox"
                    className="accent-[#1D4ED8]"
                    checked={x.current}
                    onChange={(ev) =>
                      setList("experience", i, { current: ev.target.checked })
                    }
                  />{" "}
                  I currently work here
                </label>
                <F label="Responsibilities" id={`x-d${i}`} span>
                  <textarea
                    id={`x-d${i}`}
                    rows={3}
                    className={inp}
                    value={x.desc}
                    onChange={(ev) =>
                      setList("experience", i, { desc: ev.target.value })
                    }
                  />
                </F>
                <F label="Achievements" id={`x-a${i}`} span>
                  <textarea
                    id={`x-a${i}`}
                    rows={2}
                    className={inp}
                    placeholder="Use numbers where you can"
                    value={x.achievements}
                    onChange={(ev) =>
                      setList("experience", i, {
                        achievements: ev.target.value,
                      })
                    }
                  />
                </F>
                <F label="Technologies used" id={`x-te${i}`} span>
                  <input
                    id={`x-te${i}`}
                    className={inp}
                    value={x.tech}
                    onChange={(ev) =>
                      setList("experience", i, { tech: ev.target.value })
                    }
                  />
                </F>
              </div>
              <div className="mt-2 text-right">
                <RemoveBtn
                  what="experience"
                  onClick={() => removeFrom("experience", i)}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    ),

    skills: (
      <Card
        title="Skills & expertise"
        icon="🛠️"
        note="Levels are self-reported. They are shown as that, not as verified."
      >
        <div className="flex gap-2 mb-4">
          <input
            className={inp}
            aria-label="Add a skill"
            placeholder="Type a skill and press Enter (commas add several)"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                document.getElementById("add-skill")?.click();
              }
            }}
          />
          <button
            id="add-skill"
            className={btn + " shrink-0"}
            onClick={() => {
              const names = skillName
                .split(",")
                .map((s) => s.trim())
                .filter(
                  (s) =>
                    s &&
                    !p.skills.some(
                      (x) => x.name.toLowerCase() === s.toLowerCase(),
                    ),
                );
              if (names.length)
                upd({
                  skills: [
                    ...p.skills,
                    ...names.map((name) => ({
                      name,
                      cat: "Developer tool",
                      level: "",
                      years: "",
                    })),
                  ],
                });
              setSkillName("");
            }}
          >
            Add
          </button>
        </div>
        {!p.skills.length && (
          <Empty>No skills yet. They power your job match scores.</Empty>
        )}
        {SKILL_CATS.map((cat) => {
          const rows = p.skills
            .map((s, i) => ({ s, i }))
            .filter((r) => r.s.cat === cat);
          if (!rows.length) return null;
          return (
            <div key={cat} className="mb-4">
              <div className={lbl}>{cat}s</div>
              <div className="space-y-2">
                {rows.map(({ s, i }) => (
                  <div
                    key={i}
                    className="grid grid-cols-[1fr_auto] sm:grid-cols-[1.2fr_1fr_1fr_1fr_auto] gap-2 items-center"
                  >
                    <div className="font-semibold text-sm break-words">
                      {s.name}
                    </div>
                    <button
                      className="text-xs text-red-500 font-semibold sm:order-last justify-self-end px-2 py-1"
                      aria-label={`Remove ${s.name}`}
                      onClick={() => removeFrom("skills", i)}
                    >
                      ✕
                    </button>
                    <select
                      aria-label={`${s.name} category`}
                      className={inp + " col-span-2 sm:col-span-1"}
                      value={s.cat}
                      onChange={(e) =>
                        setList("skills", i, { cat: e.target.value })
                      }
                    >
                      {SKILL_CATS.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                    <select
                      aria-label={`${s.name} level`}
                      className={inp}
                      value={s.level}
                      onChange={(e) =>
                        setList("skills", i, { level: e.target.value })
                      }
                    >
                      <option value="">Level</option>
                      {SKILL_LEVELS.map((l) => (
                        <option key={l}>{l}</option>
                      ))}
                    </select>
                    <input
                      aria-label={`${s.name} years`}
                      className={inp}
                      placeholder="Years"
                      inputMode="decimal"
                      maxLength={4}
                      value={s.years}
                      onChange={(e) =>
                        setList("skills", i, {
                          years: e.target.value.replace(/[^\d.]/g, ""),
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </Card>
    ),

    projects: (
      <Card
        title="Projects portfolio"
        icon="🚀"
        action={
          <button
            className={btn}
            onClick={() =>
              addTo("projects", {
                title: "",
                desc: "",
                tech: "",
                repo: "",
                demo: "",
                duration: "",
                team: "Individual",
                role: "",
                achievements: "",
              })
            }
          >
            + Add project
          </button>
        }
      >
        {!p.projects.length && (
          <Empty>
            Projects are the first thing recruiters check for freshers. Add at
            least one.
          </Empty>
        )}
        <div className="space-y-4">
          {p.projects.map((x, i) => (
            <div key={i} className="border border-[var(--bdr)] rounded-xl p-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <F label="Project title" id={`j-t${i}`} span>
                  <input
                    id={`j-t${i}`}
                    className={inp}
                    value={x.title}
                    onChange={(e) =>
                      setList("projects", i, { title: e.target.value })
                    }
                  />
                </F>
                <F label="Description" id={`j-d${i}`} span>
                  <textarea
                    id={`j-d${i}`}
                    rows={3}
                    className={inp}
                    placeholder="What it does and the problem it solves"
                    value={x.desc}
                    onChange={(e) =>
                      setList("projects", i, { desc: e.target.value })
                    }
                  />
                </F>
                <F label="Technologies used" id={`j-te${i}`} span>
                  <input
                    id={`j-te${i}`}
                    className={inp}
                    placeholder="React, Node, MongoDB"
                    value={x.tech}
                    onChange={(e) =>
                      setList("projects", i, { tech: e.target.value })
                    }
                  />
                </F>
                <F label="GitHub repository URL" id={`j-r${i}`}>
                  <input
                    id={`j-r${i}`}
                    className={inp}
                    value={x.repo}
                    onChange={(e) =>
                      setList("projects", i, { repo: e.target.value })
                    }
                  />
                </F>
                <F label="Live demo URL" id={`j-l${i}`}>
                  <input
                    id={`j-l${i}`}
                    className={inp}
                    value={x.demo}
                    onChange={(e) =>
                      setList("projects", i, { demo: e.target.value })
                    }
                  />
                </F>
                <F label="Duration" id={`j-du${i}`}>
                  <input
                    id={`j-du${i}`}
                    className={inp}
                    placeholder="e.g. 3 months"
                    value={x.duration}
                    onChange={(e) =>
                      setList("projects", i, { duration: e.target.value })
                    }
                  />
                </F>
                <F label="Individual or team" id={`j-tm${i}`}>
                  <select
                    id={`j-tm${i}`}
                    className={inp}
                    value={x.team}
                    onChange={(e) =>
                      setList("projects", i, { team: e.target.value })
                    }
                  >
                    <option>Individual</option>
                    <option>Team</option>
                  </select>
                </F>
                <F label="Your role" id={`j-ro${i}`}>
                  <input
                    id={`j-ro${i}`}
                    className={inp}
                    value={x.role}
                    onChange={(e) =>
                      setList("projects", i, { role: e.target.value })
                    }
                  />
                </F>
                <F label="Key achievements" id={`j-a${i}`}>
                  <input
                    id={`j-a${i}`}
                    className={inp}
                    value={x.achievements}
                    onChange={(e) =>
                      setList("projects", i, { achievements: e.target.value })
                    }
                  />
                </F>
              </div>
              <div className="mt-2 text-right">
                <RemoveBtn
                  what="project"
                  onClick={() => removeFrom("projects", i)}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    ),

    achievements: (
      <div className="space-y-5">
        <Card
          title="Certifications"
          icon="📜"
          action={
            <button
              className={btn}
              onClick={() =>
                addTo("certs", {
                  name: "",
                  org: "",
                  issued: "",
                  expires: "",
                  credId: "",
                  url: "",
                })
              }
            >
              + Add certification
            </button>
          }
          note="Paste the credential link so recruiters can check it yourself. Certificate file upload is not built yet."
        >
          {!p.certs.length && <Empty>No certifications yet.</Empty>}
          <div className="space-y-4">
            {p.certs.map((c, i) => (
              <div
                key={i}
                className="border border-[var(--bdr)] rounded-xl p-4"
              >
                <div className="grid sm:grid-cols-2 gap-3">
                  <F label="Certification name" id={`c-n${i}`}>
                    <input
                      id={`c-n${i}`}
                      className={inp}
                      value={c.name}
                      onChange={(e) =>
                        setList("certs", i, { name: e.target.value })
                      }
                    />
                  </F>
                  <F label="Issuing organization" id={`c-o${i}`}>
                    <input
                      id={`c-o${i}`}
                      className={inp}
                      value={c.org}
                      onChange={(e) =>
                        setList("certs", i, { org: e.target.value })
                      }
                    />
                  </F>
                  <F label="Issue date" id={`c-i${i}`}>
                    <input
                      id={`c-i${i}`}
                      type="month"
                      className={inp}
                      value={c.issued}
                      onChange={(e) =>
                        setList("certs", i, { issued: e.target.value })
                      }
                    />
                  </F>
                  <F label="Expiration date (if any)" id={`c-e${i}`}>
                    <input
                      id={`c-e${i}`}
                      type="month"
                      className={inp}
                      value={c.expires}
                      onChange={(e) =>
                        setList("certs", i, { expires: e.target.value })
                      }
                    />
                  </F>
                  <F label="Credential ID" id={`c-c${i}`}>
                    <input
                      id={`c-c${i}`}
                      className={inp}
                      value={c.credId}
                      onChange={(e) =>
                        setList("certs", i, { credId: e.target.value })
                      }
                    />
                  </F>
                  <F label="Credential URL" id={`c-u${i}`}>
                    <input
                      id={`c-u${i}`}
                      className={inp}
                      value={c.url}
                      onChange={(e) =>
                        setList("certs", i, { url: e.target.value })
                      }
                    />
                  </F>
                </div>
                <div className="mt-2 text-right">
                  <RemoveBtn
                    what="certification"
                    onClick={() => removeFrom("certs", i)}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card
          title="Awards and achievements"
          icon="🏆"
          action={
            <button
              className={btn}
              onClick={() =>
                addTo("awards", {
                  title: "",
                  kind: "Hackathon",
                  year: "",
                  desc: "",
                })
              }
            >
              + Add achievement
            </button>
          }
        >
          {!p.awards.length && (
            <Empty>
              Hackathons, competitions, awards. Add anything you are proud of.
            </Empty>
          )}
          <div className="space-y-4">
            {p.awards.map((a, i) => (
              <div
                key={i}
                className="border border-[var(--bdr)] rounded-xl p-4"
              >
                <div className="grid sm:grid-cols-2 gap-3">
                  <F label="Title" id={`a-t${i}`}>
                    <input
                      id={`a-t${i}`}
                      className={inp}
                      value={a.title}
                      onChange={(e) =>
                        setList("awards", i, { title: e.target.value })
                      }
                    />
                  </F>
                  <F label="Type" id={`a-k${i}`}>
                    <select
                      id={`a-k${i}`}
                      className={inp}
                      value={a.kind}
                      onChange={(e) =>
                        setList("awards", i, { kind: e.target.value })
                      }
                    >
                      {[
                        "Hackathon",
                        "Competition",
                        "Award",
                        "Academic",
                        "Professional",
                      ].map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </F>
                  <F label="Year" id={`a-y${i}`}>
                    <input
                      id={`a-y${i}`}
                      inputMode="numeric"
                      maxLength={4}
                      className={inp}
                      value={a.year}
                      onChange={(e) =>
                        setList("awards", i, {
                          year: e.target.value.replace(/\D/g, ""),
                        })
                      }
                    />
                  </F>
                  <F label="Details" id={`a-d${i}`} span>
                    <textarea
                      id={`a-d${i}`}
                      rows={2}
                      className={inp}
                      value={a.desc}
                      onChange={(e) =>
                        setList("awards", i, { desc: e.target.value })
                      }
                    />
                  </F>
                </div>
                <div className="mt-2 text-right">
                  <RemoveBtn
                    what="achievement"
                    onClick={() => removeFrom("awards", i)}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    ),

    languages: (
      <Card
        title="Languages"
        icon="🗣️"
        action={
          <button
            className={btn}
            onClick={() =>
              addTo("languages", {
                name: "",
                read: "Fluent",
                write: "Fluent",
                speak: "Fluent",
                native: false,
              })
            }
          >
            + Add language
          </button>
        }
      >
        {!p.languages.length && <Empty>No languages added.</Empty>}
        <div className="space-y-3">
          {p.languages.map((l, i) => (
            <div
              key={i}
              className="border border-[var(--bdr)] rounded-xl p-4 grid sm:grid-cols-4 gap-3 items-end"
            >
              <F label="Language" id={`l-n${i}`}>
                <input
                  id={`l-n${i}`}
                  className={inp}
                  value={l.name}
                  onChange={(e) =>
                    setList("languages", i, { name: e.target.value })
                  }
                />
              </F>
              {(["read", "write", "speak"] as const).map((k) => (
                <F
                  key={k}
                  label={k[0].toUpperCase() + k.slice(1)}
                  id={`l-${k}${i}`}
                >
                  <select
                    id={`l-${k}${i}`}
                    className={inp}
                    value={l[k]}
                    onChange={(e) =>
                      setList("languages", i, { [k]: e.target.value })
                    }
                  >
                    {["Basic", "Conversational", "Fluent", "Native"].map(
                      (o) => (
                        <option key={o}>{o}</option>
                      ),
                    )}
                  </select>
                </F>
              ))}
              <label className="flex items-center gap-2 text-sm sm:col-span-3">
                <input
                  type="checkbox"
                  className="accent-[#1D4ED8]"
                  checked={l.native}
                  onChange={(e) =>
                    setList("languages", i, { native: e.target.checked })
                  }
                />{" "}
                Native language
              </label>
              <div className="text-right">
                <RemoveBtn
                  what="language"
                  onClick={() => removeFrom("languages", i)}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    ),

    links: (
      <Card title="Social and professional links" icon="🔗">
        <div className="grid sm:grid-cols-2 gap-3">
          {LINK_FIELDS.map(([k, l]) => (
            <F key={k} label={l} id={"k-" + k}>
              <input
                id={"k-" + k}
                className={inp}
                placeholder="https://"
                value={p.links[k] || ""}
                onChange={(e) =>
                  upd({ links: { ...p.links, [k]: e.target.value } })
                }
              />
            </F>
          ))}
        </div>
      </Card>
    ),

    resume: (
      <div className="space-y-5">
        <Card
          title="Your resume"
          icon="📄"
          note={
            resumeDate
              ? `Last updated ${new Date(resumeDate).toLocaleString()}`
              : "No resume added yet."
          }
        >
          <div className="flex flex-wrap gap-2 mb-3">
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(e) => {
                uploadResume(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            <button
              className={btnP}
              disabled={busy === "upload"}
              onClick={() => fileRef.current?.click()}
            >
              {busy === "upload"
                ? "Reading PDF..."
                : resume
                  ? "Replace with PDF"
                  : "Upload PDF"}
            </button>
            <button className={btn} disabled={!resume} onClick={downloadResume}>
              Download (.txt)
            </button>
            <button
              className={btn + " text-red-500"}
              disabled={!resume}
              onClick={() => {
                if (confirm("Delete your saved resume text?")) {
                  setResumeText("");
                  localStorage.removeItem("tl_resume_updated");
                  setResumeDate("");
                }
              }}
            >
              Delete
            </button>
          </div>
          <label className={lbl} htmlFor="r-txt">
            Resume text (preview and edit)
          </label>
          <textarea
            id="r-txt"
            rows={12}
            className={inp + " font-mono text-xs"}
            placeholder="Upload a PDF or paste your resume text. Word files: paste the text here."
            value={resume}
            onChange={(e) => setResumeText(e.target.value)}
          />
          <p className="text-xs text-[var(--t3)] mt-2">
            Uploads are PDF only (max 4 MB). The text is kept in your browser
            and your account sync; the PDF file itself is not stored.
          </p>
        </Card>
        <Card
          title="Resume score"
          icon="📈"
          note="A quick rule-based check of things most applicant systems need. It is not a real ATS and not an AI score."
        >
          {!resume.trim() ? (
            <Empty>Add your resume to see a score.</Empty>
          ) : (
            <>
              <Meter pct={ats.score} label="Resume score" />
              <ul className="mt-3 grid sm:grid-cols-2 gap-1.5">
                {ats.checks.map((c) => (
                  <li key={c.label} className="text-sm flex gap-2">
                    <span>{c.ok ? "✅" : "❌"}</span>
                    {c.label}
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>
        <Card
          title="AI resume analysis"
          icon="🤖"
          action={
            <button
              className={btnP}
              disabled={!resume.trim() || busy === "ai"}
              onClick={() => askAI("resume")}
            >
              {busy === "ai" ? "Analysing..." : "Analyse my resume"}
            </button>
          }
          note="Uses one of your daily AI runs."
        >
          {aiText ? (
            <div className="text-sm whitespace-pre-wrap break-words">
              {aiText}
            </div>
          ) : (
            <Empty>
              Strengths, fixes and missing keywords will appear here.
            </Empty>
          )}
        </Card>
        <Card
          title="Resume versions"
          icon="🗂️"
          action={
            <a className={btn} href="/resume-versions">
              Manage versions
            </a>
          }
        >
          {versions.length ? (
            <ul className="space-y-1.5">
              {versions.slice(0, 6).map((v: any) => (
                <li key={v.id} className="text-sm flex justify-between gap-3">
                  <span className="font-semibold break-words">
                    {v.name}
                    {v.targetRole ? ` · ${v.targetRole}` : ""}
                  </span>
                  <span className="text-xs text-[var(--t3)] shrink-0">
                    {v.updatedAt
                      ? new Date(v.updatedAt).toLocaleDateString()
                      : ""}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>
              No saved versions yet. Create tailored versions per role.
            </Empty>
          )}
        </Card>
      </div>
    ),

    preferences: (
      <Card title="Job preferences" icon="🎯">
        <div className="space-y-4">
          <Toggle
            label="I am open to work"
            checked={p.prefs.openToWork}
            onChange={(v) => updPrefs({ openToWork: v })}
          />
          <div className="grid sm:grid-cols-2 gap-3">
            <F label="Preferred job roles" id="q-r">
              <input
                id="q-r"
                className={inp}
                placeholder="Frontend Developer, SDE Intern"
                value={p.prefs.roles}
                onChange={(e) => updPrefs({ roles: e.target.value })}
              />
            </F>
            <F label="Preferred companies" id="q-c">
              <input
                id="q-c"
                className={inp}
                value={p.prefs.companies}
                onChange={(e) => updPrefs({ companies: e.target.value })}
              />
            </F>
            <F label="Preferred industries" id="q-i">
              <input
                id="q-i"
                className={inp}
                value={p.prefs.industries}
                onChange={(e) => updPrefs({ industries: e.target.value })}
              />
            </F>
            <F label="Preferred locations" id="q-l">
              <input
                id="q-l"
                className={inp}
                placeholder="Bangalore, Pune, Remote"
                value={p.prefs.locations}
                onChange={(e) => updPrefs({ locations: e.target.value })}
              />
            </F>
            <F label="Minimum salary (per year)" id="q-mn">
              <input
                id="q-mn"
                className={inp}
                placeholder="e.g. 4 LPA"
                value={p.prefs.minSalary}
                onChange={(e) => updPrefs({ minSalary: e.target.value })}
              />
            </F>
            <F label="Expected / maximum salary" id="q-mx">
              <input
                id="q-mx"
                className={inp}
                placeholder="e.g. 8 LPA"
                value={p.prefs.maxSalary}
                onChange={(e) => updPrefs({ maxSalary: e.target.value })}
              />
            </F>
            <F label="Notice period" id="q-n">
              <select
                id="q-n"
                className={inp}
                value={p.prefs.notice}
                onChange={(e) => updPrefs({ notice: e.target.value })}
              >
                {["", "None", "15 days", "30 days", "60 days", "90 days"].map(
                  (o) => (
                    <option key={o} value={o}>
                      {o || "Select"}
                    </option>
                  ),
                )}
              </select>
            </F>
            <F label="Joining availability" id="q-a">
              <select
                id="q-a"
                className={inp}
                value={p.prefs.availability}
                onChange={(e) => updPrefs({ availability: e.target.value })}
              >
                {[
                  "Immediately",
                  "Within 1 month",
                  "After graduation",
                  "Not looking now",
                ].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </F>
            <F label="Willing to relocate" id="q-rl">
              <select
                id="q-rl"
                className={inp}
                value={p.prefs.relocate}
                onChange={(e) => updPrefs({ relocate: e.target.value })}
              >
                {["Yes", "No", "Within my state only"].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </F>
            <F label="Preferred work schedule" id="q-s">
              <input
                id="q-s"
                className={inp}
                placeholder="e.g. Day shift, flexible hours"
                value={p.prefs.schedule}
                onChange={(e) => updPrefs({ schedule: e.target.value })}
              />
            </F>
          </div>
          <div>
            <div className={lbl}>Work mode</div>
            <Chips
              options={["Remote", "Hybrid", "On-site"]}
              value={p.prefs.modes}
              onChange={(v) => updPrefs({ modes: v })}
            />
          </div>
          <div>
            <div className={lbl}>Job types</div>
            <Chips
              options={["Full-time", "Internship", "Part-time", "Contract"]}
              value={p.prefs.types}
              onChange={(v) => updPrefs({ types: v })}
            />
          </div>
        </div>
      </Card>
    ),

    activity: (
      <div className="space-y-5">
        <Card title="Career activity" icon="📊">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              ["Jobs applied", applied],
              ["Interviews", count("interview")],
              ["Offers", count("offer")],
              ["Rejected", count("rejected")],
              ["Saved jobs", saved],
              ["Tracker entries", apps.length],
              ["AI runs", aiCount],
              ["Day streak", streak],
            ].map(([l, v]) => (
              <div
                key={String(l)}
                className="bg-[var(--el)] rounded-xl p-3 text-center"
              >
                <div className="text-2xl font-extrabold text-cyan-400">{v}</div>
                <div className="text-[11px] text-[var(--t2)]">{l}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-[var(--t3)] mt-3">
            Shortlists, recruiter messages and recently viewed jobs are not
            tracked yet.
          </p>
        </Card>
        <Card
          title="Application history"
          icon="🗒️"
          action={
            <a className={btn} href="/tracker">
              Open tracker
            </a>
          }
        >
          {!apps.length ? (
            <Empty>No applications yet. Track them in the Tracker.</Empty>
          ) : (
            <ul className="divide-y divide-[var(--bdr)]">
              {[...apps]
                .sort((a, b) => String(b.date).localeCompare(String(a.date)))
                .slice(0, 10)
                .map((a: any) => (
                  <li
                    key={a.id}
                    className="py-2 flex items-center justify-between gap-3"
                  >
                    <span className="text-sm min-w-0">
                      <b className="break-words">{a.company}</b>{" "}
                      <span className="text-[var(--t2)] break-words">
                        {a.role}
                      </span>
                    </span>
                    <span className="text-xs shrink-0">
                      <span className="px-2 py-0.5 rounded-full bg-[var(--el)] font-semibold capitalize">
                        {a.status}
                      </span>{" "}
                      <span className="text-[var(--t3)] ml-1">{a.date}</span>
                    </span>
                  </li>
                ))}
            </ul>
          )}
        </Card>
        <Card title="Badges" icon="🏅">
          <div className="flex flex-wrap gap-2">
            {ALL_BADGES.map((b) => {
              const got = badges.includes(b.id);
              return (
                <span
                  key={b.id}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${got ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-600" : "border-[var(--bdr)] text-[var(--t3)] opacity-60"}`}
                >
                  {b.emoji} {b.name}
                </span>
              );
            })}
          </div>
        </Card>
      </div>
    ),

    insights: (
      <div className="space-y-5">
        <Card
          title="Your scores"
          icon="🤖"
          note="All scores are calculated from your own data with simple, visible rules. They are guides, not predictions."
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <Meter pct={done.pct} label="Profile completion" />
            <Meter pct={qual.pct} label="Profile quality" />
            <Meter pct={resume ? ats.score : 0} label="Resume score" />
            <Meter pct={ready} label="Career readiness" />
          </div>
          <p className="text-xs text-[var(--t3)] mt-3">
            Readiness = 30% completion + 30% quality + 25% resume + 15%
            applications sent.
          </p>
        </Card>
        <Card title="How to improve your profile" icon="💡">
          {qual.tips.length ? (
            <ul className="space-y-2">
              {qual.tips.map((t) => (
                <li key={t} className="text-sm flex gap-2">
                  <span>•</span>
                  {t}
                </li>
              ))}
            </ul>
          ) : (
            <Empty>Nothing to fix. Your profile looks strong.</Empty>
          )}
        </Card>
        <Card
          title={`Skill gap${gap.role ? " for " + gap.role : ""}`}
          icon="🧭"
        >
          {!gap.needed.length ? (
            <Empty>
              Set a headline or preferred role (for example "Full Stack
              Developer") to see the skills usually asked for.
            </Empty>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-2">
                {gap.have.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-700 border border-green-500/20"
                  >
                    ✓ {s}
                  </span>
                ))}
                {gap.missing.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 border border-amber-500/20"
                  >
                    + {s}
                  </span>
                ))}
              </div>
              <p className="text-xs text-[var(--t3)]">
                Green: you have it. Amber: commonly asked for and missing from
                your skills. This is a general guide per role.
              </p>
            </>
          )}
        </Card>
        <Card
          title="AI career path"
          icon="🧠"
          action={
            <button
              className={btnP}
              disabled={busy === "ai"}
              onClick={() => askAI("career")}
            >
              {busy === "ai" ? "Thinking..." : "Suggest a path"}
            </button>
          }
          note="Uses one of your daily AI runs."
        >
          {aiText ? (
            <div className="text-sm whitespace-pre-wrap break-words">
              {aiText}
            </div>
          ) : (
            <Empty>
              A 3-step career path and 4-week learning plan will appear here.
            </Empty>
          )}
        </Card>
        <Card title="More AI tools" icon="✨">
          <div className="flex flex-wrap gap-2">
            {[
              ["/match", "🎯 Job match"],
              ["/ai", "🤖 AI suite"],
              ["/voice-interview", "🎙️ Mock interview"],
              ["/roast", "🔥 Resume roast"],
              ["/fresher", "🌱 Fresher hub"],
            ].map(([h, l]) => (
              <a key={h} href={h} className={btn}>
                {l}
              </a>
            ))}
          </div>
        </Card>
      </div>
    ),

    verification: (
      <Card
        title="Profile verification"
        icon="✅"
        note="Honest status: none of these checks are built yet, so nothing on your profile is shown as verified."
      >
        <ul className="divide-y divide-[var(--bdr)]">
          {[
            [
              "Email",
              user.email
                ? `${user.email} (verification email not set up)`
                : "Not added",
            ],
            ["Phone number", "Not available yet"],
            ["LinkedIn", "Not available yet"],
            ["Education", "Not available yet"],
            ["Work experience", "Not available yet"],
            ["Certifications", "Add a credential URL so others can check it"],
            ["Skills", "Self-reported only"],
            ["Identity", "Not available yet"],
          ].map(([l, v]) => (
            <li key={l} className="py-2.5 flex justify-between gap-3 text-sm">
              <span className="font-semibold">{l}</span>
              <span className="text-[var(--t3)] text-right break-words">
                {v}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    ),

    privacy: (
      <Card
        title="Privacy and visibility"
        icon="🔒"
        note="Saved to your account. They apply once recruiters can view candidate profiles; there is no public profile page yet."
      >
        <div className="mb-4">
          <div className={lbl}>Who can see my profile</div>
          <div className="grid sm:grid-cols-3 gap-2" role="radiogroup">
            {(
              [
                ["public", "🌐 Public", "Anyone"],
                ["recruiters", "👔 Recruiters only", "Verified recruiters"],
                ["private", "🔒 Private", "Only me"],
              ] as const
            ).map(([v, t, d]) => (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={p.privacy.visibility === v}
                onClick={() => updPriv({ visibility: v })}
                className={`text-left p-3 rounded-xl border ${p.privacy.visibility === v ? "border-cyan-500 bg-blue-500/5" : "border-[var(--bdr)]"}`}
              >
                <div className="text-sm font-semibold">{t}</div>
                <div className="text-xs text-[var(--t3)]">{d}</div>
              </button>
            ))}
          </div>
        </div>
        <Toggle
          label="Show my email"
          checked={p.privacy.showEmail}
          onChange={(v) => updPriv({ showEmail: v })}
        />
        <Toggle
          label="Show my phone number"
          checked={p.privacy.showPhone}
          onChange={(v) => updPriv({ showPhone: v })}
        />
        <Toggle
          label="Show my salary expectations"
          checked={p.privacy.showSalary}
          onChange={(v) => updPriv({ showSalary: v })}
        />
        <Toggle
          label="Let recruiters see my resume"
          checked={p.privacy.resumeVisible}
          onChange={(v) => updPriv({ resumeVisible: v })}
        />
        <Toggle
          label="Appear in recruiter searches"
          checked={p.privacy.discoverable}
          onChange={(v) => updPriv({ discoverable: v })}
        />
        <div className="mt-4">
          <F
            label="Blocked recruiters or companies (comma separated)"
            id="pv-b"
          >
            <input
              id="pv-b"
              className={inp}
              value={p.privacy.blocked}
              onChange={(e) => updPriv({ blocked: e.target.value })}
            />
          </F>
        </div>
        <div className="mt-4">
          <button className={btn} onClick={exportData}>
            📦 Download all my data
          </button>
        </div>
      </Card>
    ),

    notifications: (
      <Card
        title="Notifications"
        icon="🔔"
        note="Your choices are saved. Alerts are delivered inside the app for now; email and push delivery are not set up."
      >
        {NOTIFY_FIELDS.map(([k, l]) => (
          <Toggle
            key={k}
            label={l}
            checked={!!p.notify[k]}
            onChange={(v) => upd({ notify: { ...p.notify, [k]: v } })}
          />
        ))}
      </Card>
    ),

    settings: (
      <div className="space-y-5">
        <Card title="Account" icon="⚙️">
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <div className={lbl}>Email</div>
              <b className="break-all">{user.email || "-"}</b>
            </div>
            <div>
              <div className={lbl}>Account type</div>
              <b>
                {user.role === "recruiter"
                  ? "Recruiter"
                  : user.role === "admin"
                    ? "Admin"
                    : "Student"}
              </b>
            </div>
            <div>
              <div className={lbl}>Plan</div>
              <b>
                {user.plan === "pro"
                  ? "⭐ Pro (100 AI runs/day)"
                  : "Free (15 AI runs/day)"}
              </b>{" "}
              {user.plan !== "pro" && (
                <a
                  href="/upgrade"
                  className="text-cyan-400 text-xs ml-2 hover:underline"
                >
                  Upgrade →
                </a>
              )}
            </div>
            <div>
              <div className={lbl}>Theme and language</div>
              <span className="text-[var(--t2)]">
                Use the buttons at the bottom of the left menu.
              </span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              <button className={btn} onClick={() => signOut(false)}>
                🚪 Log out
              </button>
              <button
                className={btn}
                onClick={() => {
                  if (confirm("Sign out on every device, including this one?"))
                    signOut(true);
                }}
              >
                🔒 Log out everywhere
              </button>
            </div>
          </div>
        </Card>
        <Card title="Change password" icon="🔑">
          <div className="grid sm:grid-cols-2 gap-3">
            <F label="Current password" id="pw-c">
              <input
                id="pw-c"
                type="password"
                autoComplete="current-password"
                className={inp}
                value={pw.current}
                onChange={(e) => setPw({ ...pw, current: e.target.value })}
              />
            </F>
            <F label="New password (8+ characters)" id="pw-n">
              <input
                id="pw-n"
                type="password"
                autoComplete="new-password"
                className={inp}
                value={pw.next}
                onChange={(e) => setPw({ ...pw, next: e.target.value })}
              />
            </F>
          </div>
          <div className="mt-3">
            <button
              className={btnP}
              disabled={busy === "pw" || !pw.current || pw.next.length < 8}
              onClick={changePassword}
            >
              {busy === "pw" ? "Saving..." : "Change password"}
            </button>{" "}
            <a
              href="/login"
              className="text-xs text-cyan-400 ml-3 hover:underline"
            >
              Forgot password?
            </a>
          </div>
          <p className="text-xs text-[var(--t3)] mt-2">
            Password reset by email is not set up yet.
          </p>
        </Card>
        <Card title="Not available yet" icon="🚧">
          <ul className="text-sm text-[var(--t2)] space-y-1">
            <li>• Two-factor authentication</li>
            <li>• Login history and active sessions</li>
            <li>• Connected accounts</li>
          </ul>
        </Card>
        <Card title="Danger zone" icon="⚠️">
          <div className="space-y-4">
            <div>
              <div className="text-sm font-semibold">Hide my profile</div>
              <p className="text-xs text-[var(--t3)] mb-2">
                Sets visibility to private and removes you from recruiter
                searches. Your data stays.
              </p>
              <button
                className={btn}
                onClick={() => {
                  updPriv({ visibility: "private", discoverable: false });
                  flash("Profile hidden. Press Save changes.");
                }}
              >
                Hide my profile
              </button>
            </div>
            <div className="border-t border-[var(--bdr)] pt-4">
              <div className="text-sm font-semibold text-red-500">
                Delete account
              </div>
              <p className="text-xs text-[var(--t3)] mb-2">
                Permanently removes your account and synced data. Enter your
                password to confirm.
              </p>
              <div className="flex flex-wrap gap-2">
                <input
                  type="password"
                  aria-label="Password to confirm deletion"
                  autoComplete="current-password"
                  className={inp + " max-w-xs"}
                  placeholder="Your password"
                  value={delPw}
                  onChange={(e) => setDelPw(e.target.value)}
                />
                <button
                  className="px-4 py-2 rounded-xl text-sm font-bold bg-red-600 text-white disabled:opacity-50"
                  disabled={!delPw || busy === "del"}
                  onClick={deleteAccount}
                >
                  Delete account
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    ),
  };

  return (
    <div className="max-w-6xl mx-auto">
      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--card)] border border-[var(--bds)] rounded-xl px-5 py-3 text-sm font-semibold shadow-2xl max-w-[90vw]"
        >
          {toast}
        </div>
      )}
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* Section menu: sticky column on desktop, horizontal chip row on phones */}
        <nav
          aria-label="Profile sections"
          className="w-full lg:w-60 shrink-0 min-w-0 lg:sticky lg:top-4"
        >
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            {ALL_TABS.map(([id, name, ic]) => (
              <button
                key={id}
                onClick={() => go(id)}
                aria-current={tab === id}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold border shrink-0 ${tab === id ? "bg-cyan-500 text-white border-cyan-500" : "border-[var(--bds)]"}`}
              >
                {ic} {name}
              </button>
            ))}
          </div>
          <div className="hidden lg:block bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-3 max-h-[calc(100vh-2rem)] overflow-y-auto">
            {TABS.map((g) => (
              <div key={g.group} className="mb-3 last:mb-0">
                <div className="text-[10px] uppercase tracking-widest text-[var(--t3)] font-bold px-2 mb-1">
                  {g.group}
                </div>
                {g.items.map(([id, name, ic]) => (
                  <button
                    key={id}
                    onClick={() => go(id)}
                    aria-current={tab === id ? "page" : undefined}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-sm flex items-center gap-2 ${tab === id ? "bg-cyan-500/10 text-cyan-500 font-bold" : "text-[var(--t2)] hover:bg-[var(--hov)]"}`}
                  >
                    <span>{ic}</span>
                    <span className="truncate">{name}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </nav>
        <div className="flex-1 min-w-0 w-full space-y-5 pb-24">
          {tab !== "overview" && <h1 className="sr-only">{cur[1]}</h1>}
          {body[tab]}
        </div>
      </div>
      {dirty && (
        <div className="fixed bottom-4 inset-x-4 lg:left-auto lg:right-8 lg:w-auto z-40 flex items-center justify-between gap-3 bg-[var(--card)] border border-[var(--bds)] rounded-2xl px-4 py-3 shadow-2xl">
          <span className="text-sm font-semibold">Unsaved changes</span>
          <div className="flex gap-2">
            <button
              className={btn}
              onClick={() => {
                const u = readJSON("tl_user", "{}");
                setP(migrate(readJSON("tl_profile", "{}"), { name: u.name }));
                setDirty(false);
              }}
            >
              Discard
            </button>
            <button className={btnP} onClick={save}>
              Save changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
