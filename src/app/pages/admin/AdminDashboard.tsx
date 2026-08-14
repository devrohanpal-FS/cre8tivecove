import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import {
  LayoutDashboard, Home, Info, Film, Briefcase, Users, MessageSquare,
  FileText, Mail, Image, Settings, LogOut, Plus, Trash2, Check,
  ExternalLink, Upload, Copy, Eye, Clock, DollarSign, Archive, Star
} from "lucide-react";
import { getToken, logout, api } from "../../api/client.js";

type ActiveTab =
  | "dashboard"
  | "home_editor"
  | "about_editor"
  | "services"
  | "projects"
  | "team"
  | "testimonials"
  | "jobs"
  | "applications"
  | "inquiries"
  | "media"
  | "settings";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);

  // Global State Stores
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [media, setMedia] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});

  // Check auth on mount
  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/admin/login");
      return;
    }

    async function initAdmin() {
      try {
        const data = await api.get("/auth/me");
        setAdminUser(data.user);
        setLoading(false);

        // Pre-load dashboard data
        loadDashboardData();
      } catch (err) {
        console.error("Auth check failed:", err);
        logout();
      }
    }
    initAdmin();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      const [inqs, apps, svcs, prjs, tm, test, jbs, med, sett] = await Promise.all([
        api.get("/inquiries"),
        api.get("/applications"),
        api.get("/services"),
        api.get("/projects"),
        api.get("/team"),
        api.get("/testimonials"),
        api.get("/postings"),
        api.get("/media"),
        api.get("/content/settings")
      ]);

      setInquiries(inqs);
      setApplications(apps);
      setServices(svcs);
      setProjects(prjs);
      setTeam(tm);
      setTestimonials(test);
      setJobs(jbs);
      setMedia(med);
      setSettings(sett);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090909] flex items-center justify-center text-white">
        <p className="text-sm text-white/50">Loading admin session...</p>
      </div>
    );
  }

  // Handle logout
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen flex bg-[#0d0d0d] text-white/90">
      {/* ── SIDEBAR ── */}
      <aside className="w-[260px] bg-[#111] border-r border-white/5 flex flex-col p-6 flex-shrink-0">
        <div className="flex items-center gap-3 mb-8 px-2">
          <img
            src="/logo.png"
            alt="Cre8tiveCove Logo"
            className="h-10 w-auto object-contain brightness-0 invert"
          />
          <div>
            <span className="text-[9px] uppercase tracking-widest text-[#C8A96B] font-bold block">CMS Admin Panel</span>
          </div>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {[
            { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
            { id: "home_editor", label: "Home Page Editor", Icon: Home },
            { id: "about_editor", label: "About Page Editor", Icon: Info },
            { id: "services", label: "Services Manager", Icon: Film },
            { id: "projects", label: "Portfolio Projects", Icon: Briefcase },
            { id: "team", label: "Team Manager", Icon: Users },
            { id: "testimonials", label: "Testimonials", Icon: MessageSquare },
            { id: "jobs", label: "Job Postings", Icon: Archive },
            { id: "applications", label: "Applications", Icon: FileText },
            { id: "inquiries", label: "Inquiries", Icon: Mail },
            { id: "media", label: "Media Library", Icon: Image },
            { id: "settings", label: "Site Settings", Icon: Settings },
          ].map(({ id, label, Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id as ActiveTab)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all duration-200 cursor-pointer"
                style={{
                  background: active ? "rgba(200,169,107,0.12)" : "transparent",
                  color: active ? "#C8A96B" : "rgba(255,255,255,0.6)"
                }}
              >
                <Icon size={16} />
                {label}
              </button>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-white/5 flex flex-col gap-2">
          <div className="px-2 text-xs text-white/30 truncate">Logged in as:<br /><b className="text-white/60">{adminUser?.email}</b></div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all hover:bg-white/[0.03] text-red-400 mt-2 cursor-pointer"
          >
            <LogOut size={16} />
            Logout Session
          </button>
        </div>
      </aside>

      {/* ── WORKSPACE ── */}
      <main className="flex-1 p-10 overflow-y-auto max-h-screen">
        {activeTab === "dashboard" && (
          <DashboardTab
            inquiries={inquiries}
            applications={applications}
            projects={projects}
            services={services}
            refreshData={loadDashboardData}
          />
        )}
        {activeTab === "home_editor" && <HomeEditorTab refreshData={loadDashboardData} />}
        {activeTab === "about_editor" && <AboutEditorTab refreshData={loadDashboardData} />}
        {activeTab === "services" && <ServicesTab services={services} refreshData={loadDashboardData} />}
        {activeTab === "projects" && <ProjectsTab projects={projects} refreshData={loadDashboardData} />}
        {activeTab === "team" && <TeamTab team={team} refreshData={loadDashboardData} />}
        {activeTab === "testimonials" && <TestimonialsTab testimonials={testimonials} refreshData={loadDashboardData} />}
        {activeTab === "jobs" && <JobsTab jobs={jobs} refreshData={loadDashboardData} />}
        {activeTab === "applications" && <ApplicationsTab applications={applications} refreshData={loadDashboardData} />}
        {activeTab === "inquiries" && <InquiriesTab inquiries={inquiries} refreshData={loadDashboardData} />}
        {activeTab === "media" && <MediaTab media={media} refreshData={loadDashboardData} />}
        {activeTab === "settings" && <SettingsTab settings={settings} refreshData={loadDashboardData} />}
      </main>
    </div>
  );
}

/* ==============================================================================
   1. DASHBOARD VIEW
   ============================================================================== */
function DashboardTab({ inquiries, applications, projects, services, refreshData }: any) {
  const newInqs = inquiries.filter((i: any) => i.status === "NEW").length;
  const newApps = applications.length; // applications list

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Admin Dashboard</h1>
        <p className="text-xs text-white/40 mt-1">Quick stats and recent submissions overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { label: "New Inquiries", value: newInqs, icon: Mail, color: "#C8A96B" },
          { label: "Job Applications", value: newApps, icon: FileText, color: "#3B82F6" },
          { label: "Active Services", value: services.length, icon: Film, color: "#10B981" },
          { label: "Portfolio Case Studies", value: projects.length, icon: Briefcase, color: "#8B5CF6" }
        ].map((stat) => (
          <div key={stat.label} className="bg-[#111] rounded-2xl p-6 border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-xs text-white/40 font-semibold uppercase tracking-wider">{stat.label}</p>
              <h2 className="text-3xl font-extrabold mt-2" style={{ color: stat.color }}>{stat.value}</h2>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/[0.02] border border-white/5">
              <stat.icon size={20} className="text-white/60" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Inquiries List */}
        <div className="bg-[#111] rounded-2xl p-6 border border-white/5">
          <h3 className="font-bold text-base mb-5 flex items-center gap-2">
            <Mail size={16} className="text-[#C8A96B]" /> Recent Inquiries
          </h3>
          <div className="flex flex-col gap-3">
            {inquiries.slice(0, 5).map((inq: any) => (
              <div key={inq.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{inq.name}</h4>
                  <p className="text-xs text-white/50 mt-0.5">{inq.company || "Personal"} · Requested: <span className="text-[#C8A96B] font-semibold">{inq.service}</span></p>
                  <p className="text-xs text-white/30 mt-2 truncate max-w-sm">&ldquo;{inq.message}&rdquo;</p>
                </div>
                <span
                  className="px-2.5 py-1 rounded-full text-[9px] font-bold"
                  style={{
                    background: inq.status === "NEW" ? "rgba(200,169,107,0.15)" : inq.status === "CONTACTED" ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.05)",
                    color: inq.status === "NEW" ? "#C8A96B" : inq.status === "CONTACTED" ? "#3B82F6" : "#666"
                  }}
                >
                  {inq.status}
                </span>
              </div>
            ))}
            {inquiries.length === 0 && (
              <p className="text-xs text-white/30 text-center py-6">No contact inquiries received yet</p>
            )}
          </div>
        </div>

        {/* Recent Applications List */}
        <div className="bg-[#111] rounded-2xl p-6 border border-white/5">
          <h3 className="font-bold text-base mb-5 flex items-center gap-2">
            <FileText size={16} className="text-[#3B82F6]" /> Recent Applications
          </h3>
          <div className="flex flex-col gap-3">
            {applications.slice(0, 5).map((app: any) => (
              <div key={app.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{app.name}</h4>
                  <p className="text-xs text-white/50 mt-0.5">Applied: <span className="text-[#3B82F6] font-semibold">{app.jobPosting?.title || "Seeded Role"}</span></p>
                  <p className="text-[10px] text-white/30 mt-1.5">Submitted: {new Date(app.submittedAt).toLocaleDateString()}</p>
                </div>
                <a
                  href={`http://localhost:5001${app.resumeUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-white flex items-center gap-1.5 border border-white/5"
                >
                  Resume <ExternalLink size={11} />
                </a>
              </div>
            ))}
            {applications.length === 0 && (
              <p className="text-xs text-white/30 text-center py-6">No job applications submitted yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==============================================================================
   2. HOME PAGE EDITOR
   ============================================================================== */
function HomeEditorTab({ refreshData }: any) {
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [hero, setHero] = useState<any>({
    badge: "Award-Winning Creative Studio",
    headline: "We Create Stories That Move Brands.",
    subheading: "Corporate Films, Commercial Videos, Websites & Creative Experiences — crafted for brands that demand excellence.",
    ctaPrimaryText: "View Our Work",
    ctaPrimaryLink: "/work",
    ctaSecondaryText: "Book a Discovery Call",
    ctaSecondaryLink: "/contact",
    videoUrl: "",
    stats: [
      { val: "500+", lbl: "Projects Delivered" },
      { val: "3M+", lbl: "Total Views" },
      { val: "100+", lbl: "Happy Clients" }
    ]
  });

  const [processSec, setProcessSec] = useState<any>({
    badge: "How We Work",
    title: "Strategy to screen — every step.",
    image: "",
    imageBadge: "8 Years of Craft"
  });

  useEffect(() => {
    async function loadHome() {
      try {
        const pageData = await api.get("/content/pages/home");
        const mappedHero = pageData.sections.find((s: any) => s.key === "hero");
        const mappedProcess = pageData.sections.find((s: any) => s.key === "process");
        if (mappedHero) setHero(mappedHero.content);
        if (mappedProcess) setProcessSec(mappedProcess.content);
      } catch (err) {
        console.error("Failed to load page config:", err);
      }
    }
    loadHome();
  }, []);

  const handleHeroStatChange = (idx: number, field: string, val: string) => {
    const updatedStats = [...hero.stats];
    updatedStats[idx][field] = val;
    setHero({ ...hero, stats: updatedStats });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");

    try {
      const payload = {
        title: "Cre8tiveCove — We Create Stories That Move Brands.",
        sections: [
          { key: "hero", content: hero, order: 1, isVisible: true },
          { key: "process", content: processSec, order: 4, isVisible: true }
        ]
      };

      await api.put("/content/pages/home", payload);
      setMsg("Home page layouts saved successfully!");
      refreshData();
    } catch (err: any) {
      setMsg(err.message || "Failed to update Home page content");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="max-w-[760px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Home Page Editor</h1>
          <p className="text-xs text-white/40 mt-1">Configure layout, hero text, and statistics</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl text-xs font-semibold cursor-pointer bg-[#C8A96B] text-white disabled:bg-gray-700 hover:shadow-lg transition-all"
        >
          {saving ? "Saving Changes..." : "Save Layout"}
        </button>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-[#C8A96B] text-xs font-bold mb-6">{msg}</div>
      )}

      {/* Hero configuration */}
      <div className="bg-[#111] rounded-2xl p-6 border border-white/5 mb-8">
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
          <h3 className="font-bold text-base flex items-center gap-2">
            <Home size={16} className="text-[#C8A96B]" /> Hero Section
          </h3>
          <label className="flex items-center gap-3 cursor-pointer select-none px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-[#C8A96B]/50 transition-colors">
            <input
              type="checkbox"
              checked={!!hero.showText}
              onChange={(e) => setHero({ ...hero, showText: e.target.checked })}
              className="w-4 h-4 accent-[#C8A96B] cursor-pointer"
            />
            <span className="text-xs font-semibold text-white/80">Show Text Overlay on Banner</span>
          </label>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Section Badge</label>
            <input
              type="text"
              value={hero.badge}
              onChange={(e) => setHero({ ...hero, badge: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B]"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Headline Headline</label>
            <input
              type="text"
              value={hero.headline}
              onChange={(e) => setHero({ ...hero, headline: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B]"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Subheading Description</label>
            <textarea
              rows={3}
              value={hero.subheading}
              onChange={(e) => setHero({ ...hero, subheading: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Primary Button Text</label>
              <input
                type="text"
                value={hero.ctaPrimaryText}
                onChange={(e) => setHero({ ...hero, ctaPrimaryText: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B]"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Secondary Button Text</label>
              <input
                type="text"
                value={hero.ctaSecondaryText}
                onChange={(e) => setHero({ ...hero, ctaSecondaryText: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B]"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Showreel Media Image/Video URL</label>
            <input
              type="text"
              value={hero.videoUrl}
              onChange={(e) => setHero({ ...hero, videoUrl: e.target.value })}
              placeholder="Paste URL from Media Library"
              className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B]"
            />
          </div>
        </div>

        {/* Stats edit */}
        <h4 className="text-xs font-bold text-white/60 mt-8 mb-4">Floating Counters / Stats (3 max)</h4>
        <div className="grid grid-cols-3 gap-4">
          {(hero.stats || []).map((stat: any, i: number) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-2">
              <input
                type="text"
                value={stat.val}
                placeholder="Value (e.g. 500+)"
                onChange={(e) => handleHeroStatChange(i, "val", e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs border border-white/10 bg-white/[0.02] text-[#C8A96B] font-bold text-center outline-none"
              />
              <input
                type="text"
                value={stat.lbl}
                placeholder="Label"
                onChange={(e) => handleHeroStatChange(i, "lbl", e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-[10px] border border-white/10 bg-white/[0.02] text-white/50 text-center outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Process section configuration */}
      <div className="bg-[#111] rounded-2xl p-6 border border-white/5">
        <h3 className="font-bold text-base border-b border-white/5 pb-3 mb-5 flex items-center gap-2">
          <Clock size={16} className="text-[#C8A96B]" /> Process & Timeline Info
        </h3>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Section Badge</label>
            <input
              type="text"
              value={processSec.badge}
              onChange={(e) => setProcessSec({ ...processSec, badge: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B]"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Section Title</label>
            <input
              type="text"
              value={processSec.title}
              onChange={(e) => setProcessSec({ ...processSec, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Illustration Image URL</label>
              <input
                type="text"
                value={processSec.image}
                onChange={(e) => setProcessSec({ ...processSec, image: e.target.value })}
                placeholder="Paste URL from Media Library"
                className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B]"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Image Label Badge</label>
              <input
                type="text"
                value={processSec.imageBadge}
                onChange={(e) => setProcessSec({ ...processSec, imageBadge: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B]"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

/* ==============================================================================
   3. ABOUT PAGE EDITOR
   ============================================================================== */
function AboutEditorTab({ refreshData }: any) {
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const [hero, setHero] = useState<any>({
    badge: "About Us",
    title: "Filmmakers, Designers & Digital Creators.",
    image: ""
  });

  const [story, setStory] = useState<any>({
    badge: "Our Story",
    title: "Born from a love of storytelling.",
    p1: "",
    p2: ""
  });

  useEffect(() => {
    async function loadAbout() {
      try {
        const pageData = await api.get("/content/pages/about");
        const mappedHero = pageData.sections.find((s: any) => s.key === "hero");
        const mappedStory = pageData.sections.find((s: any) => s.key === "story");

        if (mappedHero) setHero(mappedHero.content);
        if (mappedStory) {
          setStory({
            badge: mappedStory.content.badge,
            title: mappedStory.content.title,
            p1: mappedStory.content.paragraphs?.[0] || "",
            p2: mappedStory.content.paragraphs?.[1] || ""
          });
        }
      } catch (err) {
        console.error("Failed to load about page:", err);
      }
    }
    loadAbout();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");

    try {
      const payload = {
        title: "About Cre8tiveCove — Filmmakers, Designers & Digital Creators",
        sections: [
          { key: "hero", content: hero, order: 1, isVisible: true },
          {
            key: "story",
            content: {
              badge: story.badge,
              title: story.title,
              paragraphs: [story.p1, story.p2].filter(Boolean)
            },
            order: 2,
            isVisible: true
          }
        ]
      };

      await api.put("/content/pages/about", payload);
      setMsg("About page layouts saved successfully!");
      refreshData();
    } catch (err: any) {
      setMsg(err.message || "Failed to update About page content");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="max-w-[760px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>About Page Editor</h1>
          <p className="text-xs text-white/40 mt-1">Configure About header layouts and story descriptions</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl text-xs font-semibold cursor-pointer bg-[#C8A96B] text-white disabled:bg-gray-700 hover:shadow-lg transition-all"
        >
          {saving ? "Saving Changes..." : "Save Layout"}
        </button>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-[#C8A96B] text-xs font-bold mb-6">{msg}</div>
      )}

      {/* Hero section */}
      <div className="bg-[#111] rounded-2xl p-6 border border-white/5 mb-8">
        <h3 className="font-bold text-base border-b border-white/5 pb-3 mb-5 flex items-center gap-2">
          <Info size={16} className="text-[#C8A96B]" /> Hero Header
        </h3>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Section Badge</label>
            <input
              type="text"
              value={hero.badge}
              onChange={(e) => setHero({ ...hero, badge: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B]"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Hero Title Headline</label>
            <input
              type="text"
              value={hero.title}
              onChange={(e) => setHero({ ...hero, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B]"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Cover Banner Image URL</label>
            <input
              type="text"
              value={hero.image}
              onChange={(e) => setHero({ ...hero, image: e.target.value })}
              placeholder="Paste URL from Media Library"
              className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B]"
            />
          </div>
        </div>
      </div>

      {/* Story Narrative configuration */}
      <div className="bg-[#111] rounded-2xl p-6 border border-white/5">
        <h3 className="font-bold text-base border-b border-white/5 pb-3 mb-5 flex items-center gap-2">
          <Users size={16} className="text-[#C8A96B]" /> Our Story Narrative
        </h3>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Section Badge</label>
            <input
              type="text"
              value={story.badge}
              onChange={(e) => setStory({ ...story, badge: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B]"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Story Title</label>
            <input
              type="text"
              value={story.title}
              onChange={(e) => setStory({ ...story, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B]"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Paragraph 1</label>
            <textarea
              rows={4}
              value={story.p1}
              onChange={(e) => setStory({ ...story, p1: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B] resize-none"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Paragraph 2</label>
            <textarea
              rows={4}
              value={story.p2}
              onChange={(e) => setStory({ ...story, p2: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B] resize-none"
            />
          </div>
        </div>
      </div>
    </form>
  );
}

/* ==============================================================================
   4. SERVICES CRUD MANAGER
   ============================================================================== */
function ServicesTab({ services, refreshData }: any) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form States
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [icon, setIcon] = useState("Film");
  const [order, setOrder] = useState("0");
  const [isFeatured, setIsFeatured] = useState(false);
  const [heroVideoUrl, setHeroVideoUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [overview, setOverview] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const formatText = (tagOpen: string, tagClose: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    const replacement = tagOpen + selectedText + tagClose;

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    setShortDescription(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tagOpen.length, start + tagOpen.length + selectedText.length);
    }, 0);
  };

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setShortDescription("");
    setIcon("Film");
    setOrder("0");
    setIsFeatured(false);
    setHeroVideoUrl("");
    setOverview("");
    setErrorMsg("");
    setEditingId(null);
  };

  const handleEditClick = (svc: any) => {
    setEditingId(svc.id);
    setTitle(svc.title);
    setSlug(svc.slug);
    setShortDescription(svc.shortDescription);
    setIcon(svc.icon);
    setOrder(String(svc.order));
    setIsFeatured(!!svc.isFeatured);
    setHeroVideoUrl(svc.heroVideoUrl || "");
    setOverview(svc.overview || "");
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await api.delete(`/services/${id}`);
      refreshData();
    } catch (err: any) {
      alert(err.message || "Failed to delete service");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const payload = {
      title, slug, shortDescription, icon,
      order: parseInt(order) || 0,
      isFeatured, heroVideoUrl, overview
    };

    try {
      if (editingId) {
        await api.put(`/services/${editingId}`, payload);
      } else {
        await api.post("/services", payload);
      }
      resetForm();
      setShowAddForm(false);
      refreshData();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save service");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Services Manager</h1>
          <p className="text-xs text-white/40 mt-1">Add, update, or remove agency services</p>
        </div>
        {!showAddForm && (
          <button
            onClick={() => { resetForm(); setShowAddForm(true); }}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold cursor-pointer bg-[#C8A96B] text-white"
          >
            <Plus size={14} /> Add Service
          </button>
        )}
      </div>

      {showAddForm ? (
        <form onSubmit={handleSubmit} className="bg-[#111] rounded-2xl p-8 border border-white/5 max-w-[640px]">
          <h3 className="font-bold text-base border-b border-white/5 pb-3 mb-6">
            {editingId ? "Edit Service" : "Add New Service"}
          </h3>

          {errorMsg && (
            <p className="text-red-400 text-xs font-semibold mb-4">{errorMsg}</p>
          )}

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Service Title</label>
                <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B]" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">URL Slug</label>
                <input required type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. corporate-films" className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/50">Short Teaser Description</label>
                <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/5 px-2 py-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => formatText("<strong>", "</strong>")}
                    className="px-2 py-0.5 rounded text-[10px] font-bold hover:bg-white/10 text-white/80 cursor-pointer"
                    title="Bold"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={() => formatText("<em>", "</em>")}
                    className="px-2 py-0.5 rounded text-[10px] italic hover:bg-white/10 text-white/80 cursor-pointer"
                    title="Italic"
                  >
                    I
                  </button>
                  <button
                    type="button"
                    onClick={() => formatText("<u>", "</u>")}
                    className="px-2 py-0.5 rounded text-[10px] underline hover:bg-white/10 text-white/80 cursor-pointer"
                    title="Underline"
                  >
                    U
                  </button>
                  <button
                    type="button"
                    onClick={() => formatText("<br />\n", "")}
                    className="px-2 py-0.5 rounded text-[9px] hover:bg-white/10 text-white/80 cursor-pointer"
                    title="Line Break"
                  >
                    ↵ Break
                  </button>
                  <button
                    type="button"
                    onClick={() => setShortDescription("")}
                    className="px-2 py-0.5 rounded text-[9px] hover:bg-red-500/20 text-red-400 cursor-pointer"
                    title="Clear All"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <textarea
                ref={textareaRef}
                required
                rows={3}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Write description. Use formatting tools above to apply styles."
                className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B]"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Lucide Icon String</label>
                <select value={icon} onChange={(e) => setIcon(e.target.value)} className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-[#111] text-white outline-none focus:border-[#C8A96B]">
                  {["Film", "Camera", "Globe", "Monitor", "Palette", "Layers", "Users", "Award", "Clock", "Zap"].map((ic) => (
                    <option key={ic} value={ic}>{ic}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Sort Order</label>
                <input type="number" value={order} onChange={(e) => setOrder(e.target.value)} className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B]" />
              </div>
              <div className="flex items-center pt-8 pl-4">
                <input type="checkbox" id="isFeatured" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="rounded border-white/10 accent-[#C8A96B]" />
                <label htmlFor="isFeatured" className="text-xs text-white/70 ml-2 font-bold cursor-pointer">Featured Service</label>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Hero Cover Image/Video</label>
              {heroVideoUrl && (
                <div className="mb-2 relative group w-32 h-18 rounded-lg overflow-hidden border border-white/10">
                  {heroVideoUrl.match(/\.(mp4|mov|webm)/i) || heroVideoUrl.includes("video") ? (
                    <video src={heroVideoUrl} className="w-full h-full object-cover" muted playsInline />
                  ) : (
                    <img src={heroVideoUrl} alt="Hero Preview" className="w-full h-full object-cover" />
                  )}
                  <button
                    type="button"
                    onClick={() => setHeroVideoUrl("")}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-400 font-semibold text-[9px] transition-opacity"
                  >
                    Remove
                  </button>
                </div>
              )}
              <div className="relative">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={async (e) => {
                    if (!e.target.files || e.target.files.length === 0) return;
                    const file = e.target.files[0];
                    const formData = new FormData();
                    formData.append("file", file);
                    setUploadingImage(true);
                    try {
                      const res = await api.post("/media", formData);
                      setHeroVideoUrl(`http://localhost:5001${res.url}`);
                    } catch (err: any) {
                      alert(err.message || "Failed to upload file");
                    } finally {
                      setUploadingImage(false);
                    }
                  }}
                  className="hidden"
                  id="heroCoverUploadInput"
                />
                <label
                  htmlFor="heroCoverUploadInput"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/10 bg-white/[0.02] text-[13px] font-semibold text-white/80 cursor-pointer hover:bg-white/[0.05] transition-colors"
                >
                  <Upload size={14} />
                  {uploadingImage ? "Uploading..." : heroVideoUrl ? "Change File" : "Upload File"}
                </label>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Service Deep-Dive Overview</label>
              <textarea rows={4} value={overview} onChange={(e) => setOverview(e.target.value)} className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B] resize-none" />
            </div>

            <div className="flex items-center gap-3 mt-4">
              <button type="submit" className="px-6 py-3 rounded-xl text-xs font-semibold bg-[#C8A96B] text-white cursor-pointer hover:shadow-lg transition-all">
                Save Service Details
              </button>
              <button type="button" onClick={() => { resetForm(); setShowAddForm(false); }} className="px-6 py-3 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-white cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] uppercase font-bold tracking-wider text-white/40">
                <th className="p-4 pl-6">Service Name</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Icon</th>
                <th className="p-4">Sort</th>
                <th className="p-4">Featured</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {services.map((svc: any) => (
                <tr key={svc.id} className="border-b border-white/5 hover:bg-white/[0.01]">
                  <td className="p-4 pl-6 font-bold">{svc.title}</td>
                  <td className="p-4 text-white/50">{svc.slug}</td>
                  <td className="p-4 text-[#C8A96B] font-semibold">{svc.icon}</td>
                  <td className="p-4">{svc.order}</td>
                  <td className="p-4">{svc.isFeatured ? "Yes" : "No"}</td>
                  <td className="p-4 pr-6 text-right flex items-center justify-end gap-2">
                    <button onClick={() => handleEditClick(svc)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white cursor-pointer transition-colors">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(svc.id)} className="p-2 rounded-lg bg-red-950/30 hover:bg-red-950/60 text-red-400 cursor-pointer transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-white/30">No services created yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ==============================================================================
   5. PORTFOLIO CRUD MANAGER
   ============================================================================== */
function ProjectsTab({ projects, refreshData }: any) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form States
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("TVC & Commercials");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewVideoUrl, setPreviewVideoUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [overview, setOverview] = useState("");
  const [challenge, setChallenge] = useState("");
  const [solution, setSolution] = useState("");
  const [clientFeedback, setClientFeedback] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientRole, setClientRole] = useState("");
  const [clientAvatar, setClientAvatar] = useState("");
  const [order, setOrder] = useState("0");
  const [isFeatured, setIsFeatured] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setCategory("TVC & Commercials");
    setThumbnailUrl("");
    setPreviewVideoUrl("");
    setYoutubeUrl("");
    setOverview("");
    setChallenge("");
    setSolution("");
    setClientFeedback("");
    setClientName("");
    setClientRole("");
    setClientAvatar("");
    setOrder("0");
    setIsFeatured(false);
    setErrorMsg("");
    setEditingId(null);
  };

  const handleEditClick = (prj: any) => {
    setEditingId(prj.id);
    setTitle(prj.title);
    setSlug(prj.slug);
    setCategory(prj.category);
    setThumbnailUrl(prj.thumbnailUrl);
    setPreviewVideoUrl(prj.previewVideoUrl || "");
    setYoutubeUrl(prj.youtubeUrl || "");
    setOverview(prj.overview);
    setChallenge(prj.challenge || "");
    setSolution(prj.solution || "");
    setClientFeedback(prj.clientFeedback || "");
    setClientName(prj.clientName || "");
    setClientRole(prj.clientRole || "");
    setClientAvatar(prj.clientAvatar || "");
    setOrder(String(prj.order));
    setIsFeatured(!!prj.isFeatured);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this case study?")) return;
    try {
      await api.delete(`/projects/${id}`);
      refreshData();
    } catch (err: any) {
      alert(err.message || "Failed to delete project");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!thumbnailUrl) {
      setErrorMsg("Thumbnail image is required. Please upload an image file.");
      return;
    }

    const payload = {
      title, slug, category, thumbnailUrl, previewVideoUrl, youtubeUrl,
      overview, challenge, solution, clientFeedback,
      clientName, clientRole, clientAvatar,
      order: parseInt(order) || 0,
      isFeatured
    };

    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, payload);
      } else {
        await api.post("/projects", payload);
      }
      resetForm();
      setShowAddForm(false);
      refreshData();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save project");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Portfolio Manager</h1>
          <p className="text-xs text-white/40 mt-1">Manage case studies, preview media, and category filtering</p>
        </div>
        {!showAddForm && (
          <button
            onClick={() => { resetForm(); setShowAddForm(true); }}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold cursor-pointer bg-[#C8A96B] text-white"
          >
            <Plus size={14} /> Add Case Study
          </button>
        )}
      </div>

      {showAddForm ? (
        <form onSubmit={handleSubmit} className="bg-[#111] rounded-2xl p-8 border border-white/5 max-w-[760px] max-h-[80vh] overflow-y-auto">
          <h3 className="font-bold text-base border-b border-white/5 pb-3 mb-6">
            {editingId ? "Edit Case Study" : "Add New Case Study"}
          </h3>

          {errorMsg && (
            <p className="text-red-400 text-xs font-semibold mb-4">{errorMsg}</p>
          )}

          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Project Title</label>
                <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B]" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">URL Slug</label>
                <input required type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. horizon-annual-report" className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B]" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-[#111] text-white outline-none focus:border-[#C8A96B]">
                  {["Photoshoot", "TVC & Commercials", "Brand Campaigns", "CGI & AI Commercials", "Corporate AV & Testimonials", "Web Development", "App Development", "Branding"].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Sort Order</label>
                <input type="number" value={order} onChange={(e) => setOrder(e.target.value)} className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B]" />
              </div>
              <div className="flex items-center pt-8 pl-4">
                <input type="checkbox" id="isFeaturedPrj" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="rounded border-white/10 accent-[#C8A96B]" />
                <label htmlFor="isFeaturedPrj" className="text-xs text-white/70 ml-2 font-bold cursor-pointer">Featured Project</label>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col justify-end">
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Thumbnail Image</label>
                {thumbnailUrl && (
                  <div className="mb-2 relative group w-24 h-14 rounded-lg overflow-hidden border border-white/10">
                    <img src={thumbnailUrl} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setThumbnailUrl("")}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-400 font-semibold text-[9px] transition-opacity"
                    >
                      Remove
                    </button>
                  </div>
                )}
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      if (!e.target.files || e.target.files.length === 0) return;
                      const file = e.target.files[0];
                      const formData = new FormData();
                      formData.append("file", file);
                      setUploadingImage(true);
                      try {
                        const res = await api.post("/media", formData);
                        setThumbnailUrl(`http://localhost:5001${res.url}`);
                      } catch (err: any) {
                        alert(err.message || "Failed to upload image");
                      } finally {
                        setUploadingImage(false);
                      }
                    }}
                    className="hidden"
                    id="thumbnailUploadInput"
                  />
                  <label
                    htmlFor="thumbnailUploadInput"
                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-white/10 bg-white/[0.02] text-[13px] font-semibold text-white/80 cursor-pointer hover:bg-white/[0.05] transition-colors"
                  >
                    <Upload size={14} />
                    {uploadingImage ? "Uploading..." : thumbnailUrl ? "Change Image" : "Upload File"}
                  </label>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Hover Preview Video URL</label>
                <input type="text" value={previewVideoUrl} onChange={(e) => setPreviewVideoUrl(e.target.value)} placeholder="e.g. /uploads/media/video.mp4" className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B]" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">YouTube Video URL</label>
                <input type="text" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder="e.g. https://www.youtube.com/..." className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B]" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">The Brief / Overview</label>
              <textarea required rows={3} value={overview} onChange={(e) => setOverview(e.target.value)} className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B] resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">The Challenge</label>
                <textarea rows={3} value={challenge} onChange={(e) => setChallenge(e.target.value)} className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B] resize-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Our Solution</label>
                <textarea rows={3} value={solution} onChange={(e) => setSolution(e.target.value)} className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B] resize-none" />
              </div>
            </div>

            {/* Client review block */}
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
              <h4 className="text-xs font-bold text-[#C8A96B] mb-3">Client Feedback Overlay</h4>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider block mb-1 text-white/40">Review Quote</label>
                  <textarea rows={2} value={clientFeedback} onChange={(e) => setClientFeedback(e.target.value)} className="w-full px-3 py-2 rounded-lg text-xs border border-white/10 bg-white/[0.02] text-white outline-none" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-wider block mb-1 text-white/40">Client Name</label>
                    <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full px-3 py-2 rounded-lg text-xs border border-white/10 bg-[#111] text-white outline-none" />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-wider block mb-1 text-white/40">Client Role/Company</label>
                    <input type="text" value={clientRole} onChange={(e) => setClientRole(e.target.value)} className="w-full px-3 py-2 rounded-lg text-xs border border-white/10 bg-[#111] text-white outline-none" />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-wider block mb-1 text-white/40">Client Avatar Image URL</label>
                    <input type="text" value={clientAvatar} onChange={(e) => setClientAvatar(e.target.value)} className="w-full px-3 py-2 rounded-lg text-xs border border-white/10 bg-[#111] text-white outline-none" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <button type="submit" className="px-6 py-3 rounded-xl text-xs font-semibold bg-[#C8A96B] text-white cursor-pointer hover:shadow-lg transition-all">
                Save Case Study
              </button>
              <button type="button" onClick={() => { resetForm(); setShowAddForm(false); }} className="px-6 py-3 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-white cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] uppercase font-bold tracking-wider text-white/40">
                <th className="p-4 pl-6">Project Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Featured</th>
                <th className="p-4">Sort Order</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {projects.map((prj: any) => (
                <tr key={prj.id} className="border-b border-white/5 hover:bg-white/[0.01]">
                  <td className="p-4 pl-6 font-bold">{prj.title}</td>
                  <td className="p-4 text-white/50">{prj.category}</td>
                  <td className="p-4">{prj.isFeatured ? "Yes" : "No"}</td>
                  <td className="p-4">{prj.order}</td>
                  <td className="p-4 pr-6 text-right flex items-center justify-end gap-2">
                    <button onClick={() => handleEditClick(prj)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white cursor-pointer transition-colors">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(prj.id)} className="p-2 rounded-lg bg-red-950/30 hover:bg-red-950/60 text-red-400 cursor-pointer transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-xs text-white/30">No projects listed yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ==============================================================================
   6. TEAM MEMBER CRUD
   ============================================================================== */
function TeamTab({ team, refreshData }: any) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [bio, setBio] = useState("");
  const [order, setOrder] = useState("0");
  const [errorMsg, setErrorMsg] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const reset = () => {
    setName("");
    setRole("");
    setPhotoUrl("");
    setBio("");
    setOrder("0");
    setErrorMsg("");
    setEditingId(null);
  };

  const handleEdit = (m: any) => {
    setEditingId(m.id);
    setName(m.name);
    setRole(m.role);
    setPhotoUrl(m.photoUrl);
    setBio(m.bio || "");
    setOrder(String(m.order));
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this team member?")) return;
    try {
      await api.delete(`/team/${id}`);
      refreshData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!photoUrl) {
      setErrorMsg("Photo image is required. Please upload an image file.");
      return;
    }

    const payload = { name, role, photoUrl, bio, order: parseInt(order) || 0 };
    try {
      if (editingId) {
        await api.put(`/team/${editingId}`, payload);
      } else {
        await api.post("/team", payload);
      }
      reset();
      setShowForm(false);
      refreshData();
    } catch (err: any) {
      setErrorMsg(err.message || "Error saving team member");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Team Manager</h1>
          <p className="text-xs text-white/40 mt-1">Manage core studio team members (About page)</p>
        </div>
        {!showForm && (
          <button onClick={() => { reset(); setShowForm(true); }} className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold cursor-pointer bg-[#C8A96B] text-white">
            <Plus size={14} /> Add Member
          </button>
        )}
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} className="bg-[#111] rounded-2xl p-8 border border-white/5 max-w-[540px]">
          <h3 className="font-bold text-base border-b border-white/5 pb-3 mb-5">
            {editingId ? "Edit Member" : "Add Team Member"}
          </h3>
          {errorMsg && <p className="text-red-400 text-xs font-semibold mb-4">{errorMsg}</p>}
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Full Name</label>
              <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B]" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Role / Position</label>
              <input required type="text" value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col justify-end">
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Photo Image</label>
                {photoUrl && (
                  <div className="mb-2 relative group w-20 h-20 rounded-xl overflow-hidden border border-white/10">
                    <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhotoUrl("")}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-400 font-semibold text-[9px] transition-opacity"
                    >
                      Remove
                    </button>
                  </div>
                )}
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      if (!e.target.files || e.target.files.length === 0) return;
                      const file = e.target.files[0];
                      const formData = new FormData();
                      formData.append("file", file);
                      setUploadingImage(true);
                      try {
                        const res = await api.post("/media", formData);
                        setPhotoUrl(`http://localhost:5001${res.url}`);
                      } catch (err: any) {
                        alert(err.message || "Failed to upload photo");
                      } finally {
                        setUploadingImage(false);
                      }
                    }}
                    className="hidden"
                    id="teamPhotoUploadInput"
                  />
                  <label
                    htmlFor="teamPhotoUploadInput"
                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-white/10 bg-white/[0.02] text-[13px] font-semibold text-white/80 cursor-pointer hover:bg-white/[0.05] transition-colors"
                  >
                    <Upload size={14} />
                    {uploadingImage ? "Uploading..." : photoUrl ? "Change Photo" : "Upload Photo"}
                  </label>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Sort Order</label>
                <input type="number" value={order} onChange={(e) => setOrder(e.target.value)} className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B]" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Short Bio</label>
              <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B] resize-none" />
            </div>
            <div className="flex gap-3 mt-4">
              <button type="submit" className="px-6 py-3 rounded-xl text-xs font-semibold bg-[#C8A96B] text-white cursor-pointer">Save Member</button>
              <button type="button" onClick={() => { reset(); setShowForm(false); }} className="px-6 py-3 rounded-xl text-xs font-semibold bg-white/5 text-white cursor-pointer">Cancel</button>
            </div>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {team.map((m: any) => {
            const photoUrl = m.photoUrl.startsWith("http")
              ? m.photoUrl
              : `https://images.unsplash.com/photo-${m.photoUrl}?w=300&h=400&fit=crop&auto=format`;

            return (
              <div key={m.id} className="bg-[#111] rounded-2xl border border-white/5 p-5 relative group">
                <img src={photoUrl} alt={m.name} className="w-full h-44 object-cover rounded-xl bg-white/5 mb-4" />
                <h4 className="font-bold text-sm text-white">{m.name}</h4>
                <p className="text-xs text-white/40 mt-0.5">{m.role}</p>
                <div className="absolute top-7 right-7 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(m)} className="p-1.5 rounded-lg bg-black/60 border border-white/10 text-white cursor-pointer hover:bg-black">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(m.id)} className="p-1.5 rounded-lg bg-red-950/80 border border-red-900/10 text-red-400 cursor-pointer hover:bg-red-950">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ==============================================================================
   7. TESTIMONIALS CRUD
   ============================================================================== */
function TestimonialsTab({ testimonials, refreshData }: any) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [clientName, setClientName] = useState("");
  const [clientPhoto, setClientPhoto] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState("5");
  const [order, setOrder] = useState("0");
  const [errorMsg, setErrorMsg] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const reset = () => {
    setClientName("");
    setClientPhoto("");
    setQuote("");
    setRating("5");
    setOrder("0");
    setErrorMsg("");
    setEditingId(null);
  };

  const handleEdit = (t: any) => {
    setEditingId(t.id);
    setClientName(t.clientName);
    setClientPhoto(t.clientPhoto || "");
    setQuote(t.quote);
    setRating(String(t.rating));
    setOrder(String(t.order));
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete testimonial?")) return;
    try {
      await api.delete(`/testimonials/${id}`);
      refreshData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { clientName, clientPhoto, quote, rating: parseInt(rating) || 5, order: parseInt(order) || 0 };
    try {
      if (editingId) {
        await api.put(`/testimonials/${editingId}`, payload);
      } else {
        await api.post("/testimonials", payload);
      }
      reset();
      setShowForm(false);
      refreshData();
    } catch (err: any) {
      setErrorMsg(err.message || "Error saving testimonial");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Testimonials Manager</h1>
          <p className="text-xs text-white/40 mt-1">Manage client review quotes and ratings (Home & Work detail)</p>
        </div>
        {!showForm && (
          <button onClick={() => { reset(); setShowForm(true); }} className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold cursor-pointer bg-[#C8A96B] text-white">
            <Plus size={14} /> Add Quote
          </button>
        )}
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} className="bg-[#111] rounded-2xl p-8 border border-white/5 max-w-[540px]">
          <h3 className="font-bold text-base border-b border-white/5 pb-3 mb-5">
            {editingId ? "Edit Quote" : "Add Testimonial Quote"}
          </h3>
          {errorMsg && <p className="text-red-400 text-xs font-semibold mb-4">{errorMsg}</p>}
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Client Name / Position</label>
              <input required type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="e.g. Marcus Chen, CMO Horizon Group" className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col justify-end">
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Client Avatar Image</label>
                {clientPhoto && (
                  <div className="mb-2 relative group w-14 h-14 rounded-full overflow-hidden border border-white/10">
                    <img src={clientPhoto} alt="Avatar Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setClientPhoto("")}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-400 font-semibold text-[9px] transition-opacity"
                    >
                      Remove
                    </button>
                  </div>
                )}
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      if (!e.target.files || e.target.files.length === 0) return;
                      const file = e.target.files[0];
                      const formData = new FormData();
                      formData.append("file", file);
                      setUploadingImage(true);
                      try {
                        const res = await api.post("/media", formData);
                        setClientPhoto(`http://localhost:5001${res.url}`);
                      } catch (err: any) {
                        alert(err.message || "Failed to upload avatar");
                      } finally {
                        setUploadingImage(false);
                      }
                    }}
                    className="hidden"
                    id="clientAvatarUploadInput"
                  />
                  <label
                    htmlFor="clientAvatarUploadInput"
                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-white/10 bg-white/[0.02] text-[13px] font-semibold text-white/80 cursor-pointer hover:bg-white/[0.05] transition-colors"
                  >
                    <Upload size={14} />
                    {uploadingImage ? "Uploading..." : clientPhoto ? "Change Avatar" : "Upload Avatar"}
                  </label>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Rating (1 to 5 Stars)</label>
                <select value={rating} onChange={(e) => setRating(e.target.value)} className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-[#111] text-white outline-none focus:border-[#C8A96B]">
                  {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Sort Order</label>
              <input type="number" value={order} onChange={(e) => setOrder(e.target.value)} className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B]" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Quote Narrative</label>
              <textarea required rows={4} value={quote} onChange={(e) => setQuote(e.target.value)} className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B] resize-none" />
            </div>
            <div className="flex gap-3 mt-4">
              <button type="submit" className="px-6 py-3 rounded-xl text-xs font-semibold bg-[#C8A96B] text-white cursor-pointer">Save Quote</button>
              <button type="button" onClick={() => { reset(); setShowForm(false); }} className="px-6 py-3 rounded-xl text-xs font-semibold bg-white/5 text-white cursor-pointer">Cancel</button>
            </div>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t: any) => (
            <div key={t.id} className="bg-[#111] rounded-2xl border border-white/5 p-6 flex flex-col justify-between group">
              <div>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(Number(t.rating) || 5)].map((_, j) => <Star key={j} size={11} fill="#C8A96B" style={{ color: "#C8A96B" }} />)}
                </div>
                <blockquote className="text-xs text-white/70 italic leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
              </div>
              <div className="flex items-center justify-between border-t border-white/5 mt-5 pt-4">
                <span className="text-xs font-bold text-white">{t.clientName}</span>
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(t)} className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-white cursor-pointer text-xs">Edit</button>
                  <button onClick={() => handleDelete(t.id)} className="p-1 rounded-lg bg-red-950/50 hover:bg-red-950/80 text-red-400 cursor-pointer text-xs"><Trash2 size={12} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ==============================================================================
   8. JOB POSTINGS CRUD
   ============================================================================== */
function JobsTab({ jobs, refreshData }: any) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("Design");
  const [location, setLocation] = useState("Los Angeles, CA");
  const [type, setType] = useState("Full-time");
  const [overview, setOverview] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const reset = () => {
    setTitle("");
    setDepartment("Design");
    setLocation("Los Angeles, CA");
    setType("Full-time");
    setOverview("");
    setIsOpen(true);
    setErrorMsg("");
    setEditingId(null);
  };

  const handleEdit = (job: any) => {
    setEditingId(job.id);
    setTitle(job.title);
    setDepartment(job.department);
    setLocation(job.location);
    setType(job.type);
    setOverview(job.overview);
    setIsOpen(!!job.isOpen);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete job posting? All applicants metadata will be deleted.")) return;
    try {
      await api.delete(`/jobs/${id}`);
      refreshData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { title, department, location, type, overview, isOpen };
    try {
      if (editingId) {
        await api.put(`/jobs/${editingId}`, payload);
      } else {
        await api.post("/jobs", payload);
      }
      reset();
      setShowForm(false);
      refreshData();
    } catch (err: any) {
      setErrorMsg(err.message || "Error saving job");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Job Postings</h1>
          <p className="text-xs text-white/40 mt-1">Manage studio career openings and applicant lists</p>
        </div>
        {!showForm && (
          <button onClick={() => { reset(); setShowForm(true); }} className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold cursor-pointer bg-[#C8A96B] text-white">
            <Plus size={14} /> Add Job Open
          </button>
        )}
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} className="bg-[#111] rounded-2xl p-8 border border-white/5 max-w-[600px]">
          <h3 className="font-bold text-base border-b border-white/5 pb-3 mb-5">
            {editingId ? "Edit Posting" : "Create Job Opening"}
          </h3>
          {errorMsg && <p className="text-red-400 text-xs font-semibold mb-4">{errorMsg}</p>}
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Job Title</label>
              <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Cinematographer" className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B]" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Department</label>
                <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-[#111] text-white outline-none focus:border-[#C8A96B]">
                  {["Design", "Video Production", "Development", "Marketing"].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Location</label>
                <input required type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B]" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Job Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-[#111] text-white outline-none focus:border-[#C8A96B]">
                  {["Full-time", "Part-time", "Contract", "Remote"].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center py-2">
              <input type="checkbox" id="isOpenPosting" checked={isOpen} onChange={(e) => setIsOpen(e.target.checked)} className="rounded border-white/10 accent-[#C8A96B]" />
              <label htmlFor="isOpenPosting" className="text-xs text-white/70 ml-2 font-bold cursor-pointer">Posting is Active / Open</label>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Overview Brief</label>
              <textarea required rows={4} value={overview} onChange={(e) => setOverview(e.target.value)} className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B] resize-none" />
            </div>

            <div className="flex gap-3 mt-4">
              <button type="submit" className="px-6 py-3 rounded-xl text-xs font-semibold bg-[#C8A96B] text-white cursor-pointer">Save Job Opening</button>
              <button type="button" onClick={() => { reset(); setShowForm(false); }} className="px-6 py-3 rounded-xl text-xs font-semibold bg-white/5 text-white cursor-pointer">Cancel</button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] uppercase font-bold tracking-wider text-white/40">
                <th className="p-4 pl-6">Job Title</th>
                <th className="p-4">Department</th>
                <th className="p-4">Type</th>
                <th className="p-4">Applicants</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {jobs.map((job: any) => (
                <tr key={job.id} className="border-b border-white/5 hover:bg-white/[0.01]">
                  <td className="p-4 pl-6 font-bold">{job.title}</td>
                  <td className="p-4 text-white/50">{job.department}</td>
                  <td className="p-4">{job.type}</td>
                  <td className="p-4 text-[#C8A96B] font-bold">{job._count?.applications || 0}</td>
                  <td className="p-4">{job.isOpen ? <span className="text-green-400 font-bold">Open</span> : <span className="text-white/30">Closed</span>}</td>
                  <td className="p-4 pr-6 text-right flex items-center justify-end gap-2">
                    <button onClick={() => handleEdit(job)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white cursor-pointer">Edit</button>
                    <button onClick={() => handleDelete(job.id)} className="p-2 rounded-lg bg-red-950/30 hover:bg-red-950/60 text-red-400 cursor-pointer"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-white/30">No job openings created yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ==============================================================================
   9. JOB APPLICATIONS SUBMISSIONS LIST
   ============================================================================== */
function ApplicationsTab({ applications, refreshData }: any) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Job Applications</h1>
        <p className="text-xs text-white/40 mt-1">Review candidates and download PDF resumes</p>
      </div>

      <div className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] uppercase font-bold tracking-wider text-white/40">
              <th className="p-4 pl-6">Candidate Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Applied Role</th>
              <th className="p-4">Cover Note</th>
              <th className="p-4 pr-6 text-right">Resume</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {applications.map((app: any) => (
              <tr key={app.id} className="border-b border-white/5 hover:bg-white/[0.01] items-start">
                <td className="p-4 pl-6 font-bold">{app.name}</td>
                <td className="p-4 text-white/50">{app.email}</td>
                <td className="p-4 text-white/50">{app.phone || "Not provided"}</td>
                <td className="p-4 font-semibold text-[#3B82F6]">{app.jobPosting?.title || "Seeded Opening"}</td>
                <td className="p-4 text-xs text-white/40 max-w-xs truncate" title={app.coverNote}>{app.coverNote || "None"}</td>
                <td className="p-4 pr-6 text-right">
                  <a
                    href={`http://localhost:5001${app.resumeUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#3B82F6]/15 hover:bg-[#3B82F6]/30 text-[#3B82F6] border border-[#3B82F6]/10"
                  >
                    Open PDF <ExternalLink size={12} />
                  </a>
                </td>
              </tr>
            ))}
            {applications.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-xs text-white/30">No applications received yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ==============================================================================
   10. CONTACT INQUIRIES SUBMISSIONS LIST
   ============================================================================== */
function InquiriesTab({ inquiries, refreshData }: any) {
  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/inquiries/${id}/status`, { status });
      refreshData();
    } catch (err: any) {
      alert(err.message || "Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this inquiry record?")) return;
    try {
      await api.delete(`/inquiries/${id}`);
      refreshData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Inquiries Manager</h1>
        <p className="text-xs text-white/40 mt-1">Review contact form submissions and client leads</p>
      </div>

      <div className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] uppercase font-bold tracking-wider text-white/40">
              <th className="p-4 pl-6">Client Info</th>
              <th className="p-4">Service & Budget</th>
              <th className="p-4">Message / Brief</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {inquiries.map((inq: any) => (
              <tr key={inq.id} className="border-b border-white/5 hover:bg-white/[0.01] items-start">
                <td className="p-4 pl-6">
                  <div className="font-bold">{inq.name}</div>
                  <div className="text-xs text-white/40 mt-0.5">{inq.company || "Personal Client"}</div>
                </td>
                <td className="p-4">
                  <span className="text-[#C8A96B] font-semibold text-xs block">{inq.service}</span>
                  <span className="text-[10px] text-white/40 font-semibold">{inq.budget || "Budget Unspecified"}</span>
                </td>
                <td className="p-4 text-xs text-white/60 max-w-xs whitespace-normal break-words leading-relaxed">
                  {inq.message}
                </td>
                <td className="p-4 text-[11px] text-white/30">
                  {new Date(inq.submittedAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <span
                    className="px-2.5 py-1 rounded-full text-[9px] font-bold block w-fit"
                    style={{
                      background: inq.status === "NEW" ? "rgba(200,169,107,0.15)" : inq.status === "CONTACTED" ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.05)",
                      color: inq.status === "NEW" ? "#C8A96B" : inq.status === "CONTACTED" ? "#3B82F6" : "#666"
                    }}
                  >
                    {inq.status}
                  </span>
                </td>
                <td className="p-4 pr-6 text-right flex flex-col md:flex-row items-center justify-end gap-1.5">
                  {inq.status === "NEW" && (
                    <button
                      onClick={() => handleUpdateStatus(inq.id, "CONTACTED")}
                      className="px-2.5 py-1.5 rounded bg-[#3B82F6]/10 text-[#3B82F6] hover:bg-[#3B82F6]/20 transition-all font-semibold text-[11px] cursor-pointer"
                    >
                      Contacted
                    </button>
                  )}
                  {inq.status !== "CLOSED" && (
                    <button
                      onClick={() => handleUpdateStatus(inq.id, "CLOSED")}
                      className="px-2.5 py-1.5 rounded bg-white/5 text-white/60 hover:bg-white/10 transition-all font-semibold text-[11px] cursor-pointer"
                    >
                      Close
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(inq.id)}
                    className="p-1.5 rounded bg-red-950/20 text-red-400 hover:bg-red-950/50 transition-all cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
            {inquiries.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-xs text-white/30">No inquiry messages received yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ==============================================================================
   11. MEDIA LIBRARY
   ============================================================================== */
function MediaTab({ media, refreshData }: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [copySuccessId, setCopySuccessId] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/media", formData);
      refreshData();
    } catch (err: any) {
      alert(err.message || "Failed to upload asset");
    } finally {
      setUploading(false);
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    const fullUrl = `http://localhost:5001${url}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopySuccessId(id);
      setTimeout(() => setCopySuccessId(null), 1500);
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this media asset?")) return;
    try {
      await api.delete(`/media/${id}`);
      refreshData();
    } catch (err: any) {
      alert(err.message || "Failed to delete asset");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Media Library</h1>
          <p className="text-xs text-white/40 mt-1">Upload files and copy static URLs to use in page content</p>
        </div>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,video/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold cursor-pointer bg-[#C8A96B] text-white disabled:bg-gray-700 hover:shadow-lg transition-all"
          >
            <Upload size={14} /> {uploading ? "Uploading..." : "Upload Asset"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {media.map((item: any) => {
          const isVideo = item.type === "video";
          const fullAssetUrl = `http://localhost:5001${item.url}`;

          return (
            <div key={item.id} className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden relative group aspect-square flex flex-col justify-end">
              {isVideo ? (
                <div className="absolute inset-0 bg-[#070707] flex items-center justify-center">
                  <Film size={32} className="text-white/20" />
                  <span className="absolute bottom-2 left-2 text-[9px] uppercase font-bold text-white/40 tracking-wider bg-black/50 px-2 py-0.5 rounded">Video</span>
                </div>
              ) : (
                <img src={fullAssetUrl} alt={item.filename} className="absolute inset-0 w-full h-full object-cover bg-white/5" />
              )}

              {/* Hover Overlay Actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 z-10">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-lg bg-red-950/60 border border-red-900/10 text-red-400 self-end cursor-pointer hover:bg-red-950"
                >
                  <Trash2 size={13} />
                </button>

                <div className="flex flex-col gap-2">
                  <p className="text-[10px] text-white/50 truncate w-full" title={item.filename}>{item.filename}</p>
                  <button
                    onClick={() => handleCopyUrl(item.url, item.id)}
                    className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/5 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copySuccessId === item.id ? (
                      <>
                        <Check size={12} className="text-green-400" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={12} /> Copy URL
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {media.length === 0 && (
          <div className="col-span-full py-16 text-center text-xs text-white/30">No assets uploaded yet</div>
        )}
      </div>
    </div>
  );
}

/* ==============================================================================
   12. GLOBAL SITE SETTINGS
   ============================================================================== */
function SettingsTab({ settings, refreshData }: any) {
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [hours, setHours] = useState("");

  useEffect(() => {
    document.title = "CMS Admin Dashboard | Cre8tiveCove";
    if (settings.contact_info) {
      setEmail(settings.contact_info.email || "");
      setPhone(settings.contact_info.phone || "");
      setAddress(settings.contact_info.address || "");
      setHours(settings.contact_info.hours || "");
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");

    const payload = {
      contact_info: { email, phone, address, hours }
    };

    try {
      await api.put("/content/settings", payload);
      setMsg("Settings successfully updated!");
      refreshData();
    } catch (err: any) {
      setMsg(err.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-[540px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Site Settings</h1>
          <p className="text-xs text-white/40 mt-1">Configure global office addresses, emails, and phone metadata</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl text-xs font-semibold cursor-pointer bg-[#C8A96B] text-white disabled:bg-gray-700 hover:shadow-lg transition-all"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-[#C8A96B] text-xs font-bold mb-6">{msg}</div>
      )}

      <div className="bg-[#111] rounded-2xl p-6 border border-white/5 flex flex-col gap-4">
        <h3 className="font-bold text-base border-b border-white/5 pb-3 mb-2 flex items-center gap-2">
          <Settings size={16} className="text-[#C8A96B]" /> Contact Info Configuration
        </h3>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Office Email Address</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B]" />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Office Phone Line</label>
          <input required type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B]" />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Studio Hours Description</label>
          <input required type="text" value={hours} onChange={(e) => setHours(e.target.value)} className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B]" />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-white/50">Physical Address (multiline)</label>
          <textarea required rows={3} value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-4 py-3 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B] resize-none" />
        </div>
      </div>
    </form>
  );
}
