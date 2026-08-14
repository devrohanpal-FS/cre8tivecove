import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { Mail, Phone, MapPin, Clock, Check, ArrowRight } from "lucide-react";
import { Reveal } from "../../components/public/Reveal.js";
import { api } from "../../api/client.js";

export default function ContactPage() {
  const location = useLocation();
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [contactInfo, setContactInfo] = useState<any>({
    email: "hello@cre8tivecove.com",
    phone: "+1 (310) 555-0192",
    address: "8440 Sunset Blvd\nLos Angeles, CA 90069",
    hours: "Mon–Fri, 9am–7pm PST"
  });

  const [prefilledService, setPrefilledService] = useState("");

  // Check if navigate passed service context
  useEffect(() => {
    document.title = "Contact Us | Cre8tiveCove";
    if (location.state && (location.state as any).service) {
      setPrefilledService((location.state as any).service);
    }
  }, [location.state]);

  // Fetch site contact settings
  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await api.get("/content/settings");
        if (settings.contact_info) {
          setContactInfo(settings.contact_info);
        }
      } catch (err) {
        console.warn("Using default contact information fallbacks:", err);
      }
    }
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      company: formData.get("company"),
      service: formData.get("service"),
      budget: formData.get("budget"),
      message: formData.get("message")
    };

    try {
      await api.post("/inquiries", payload);
      setSent(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-[76px] min-h-screen">
      <section className="py-24 px-6 lg:px-14 max-w-[1440px] mx-auto">
        <Reveal>
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#C8A96B" }}>Get In Touch</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3rem, 6vw, 5.5rem)", fontWeight: 900, color: "#111", lineHeight: 1.04, letterSpacing: "-0.025em" }} className="mb-20">
            Start a<br /><em style={{ fontStyle: "italic" }}>conversation.</em>
          </h1>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left info */}
          <div className="lg:col-span-4">
            <Reveal>
              <div className="flex flex-col gap-8 mb-10">
                {[
                  { Icon: Mail, label: "Email", value: contactInfo.email },
                  { Icon: Phone, label: "Phone", value: contactInfo.phone },
                  { Icon: MapPin, label: "Studio Address", value: contactInfo.address },
                  { Icon: Clock, label: "Studio Hours", value: contactInfo.hours },
                ].map(({ Icon, label, value }) => (
                  <div key={label} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(200,169,107,0.1)", border: "1px solid rgba(200,169,107,0.2)" }}>
                      <Icon size={16} style={{ color: "#C8A96B" }} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#C8A96B" }}>{label}</p>
                      <p className="text-[13px] whitespace-pre-line" style={{ fontFamily: "'Inter', sans-serif", color: "#555", lineHeight: 1.6 }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map placeholder */}
              <div className="relative overflow-hidden rounded-2xl" style={{ height: 220, background: "#F0EEE8" }}>
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=350&fit=crop&auto=format"
                  alt="Our Los Angeles studio"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin size={24} style={{ color: "#C8A96B", margin: "0 auto 6px" }} />
                    <span className="text-[11px] font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#fff" }}>Indirapuram, Ghaziabad, Uttar Pradesh 201014</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right form */}
          <div className="lg:col-span-7 lg:col-start-6">
            <Reveal delay={0.15}>
              {sent ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: "rgba(200,169,107,0.1)" }}>
                    <Check size={24} style={{ color: "#C8A96B" }} />
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 900, color: "#111" }}>Message received.</h3>
                  <p className="mt-3 text-[13px]" style={{ fontFamily: "'Inter', sans-serif", color: "#aaa" }}>We&apos;ll be in touch within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.12em] block mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#bbb" }}>Full Name</label>
                      <input name="name" required placeholder="Full Name" className="w-full px-5 py-4 rounded-xl text-[13px] border border-gray-200 bg-[#FAFAFA] outline-none focus:border-[#C8A96B] transition-colors" style={{ fontFamily: "'Inter', sans-serif", color: "#111" }} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.12em] block mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#bbb" }}>Company</label>
                      <input name="company" placeholder="Company Name" className="w-full px-5 py-4 rounded-xl text-[13px] border border-gray-200 bg-[#FAFAFA] outline-none focus:border-[#C8A96B] transition-colors" style={{ fontFamily: "'Inter', sans-serif", color: "#111" }} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.12em] block mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#bbb" }}>Service</label>
                    <select
                      name="service"
                      required
                      defaultValue={prefilledService}
                      className="w-full px-5 py-4 rounded-xl text-[13px] border border-gray-200 bg-[#FAFAFA] outline-none focus:border-[#C8A96B] transition-colors"
                      style={{ fontFamily: "'Inter', sans-serif", color: "#555" }}
                    >
                      <option value="">Select a service</option>
                      {["Corporate Film", "Commercial Shoot", "Product Video", "Website Development", "UI/UX Design", "Graphic Design", "Brand Identity", "Social Media Content"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  {/* <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.12em] block mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#bbb" }}>Budget Range</label>
                    <select name="budget" className="w-full px-5 py-4 rounded-xl text-[13px] border border-gray-200 bg-[#FAFAFA] outline-none focus:border-[#C8A96B] transition-colors" style={{ fontFamily: "'Inter', sans-serif", color: "#555" }}>
                      <option value="">Select a range</option>
                      {["Under $5,000", "$5,000 – $15,000", "$15,000 – $50,000", "$50,000 – $150,000", "$150,000+"].map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div> */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.12em] block mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#bbb" }}>Project Details</label>
                    <textarea
                      name="message"
                      required
                      rows={6}
                      placeholder="Describe your project, timeline, and any specific requirements or goals..."
                      className="w-full px-5 py-4 rounded-xl text-[13px] border border-gray-200 bg-[#FAFAFA] outline-none focus:border-[#C8A96B] transition-colors resize-none"
                      style={{ fontFamily: "'Inter', sans-serif", color: "#111" }}
                    />
                  </div>
                  {errorMsg && (
                    <p className="text-red-500 text-xs font-semibold">{errorMsg}</p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="group w-full py-4 rounded-full text-[13px] font-semibold transition-all hover:scale-[1.01] hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer bg-[#111] text-white disabled:bg-gray-400"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {submitting ? "Sending..." : "Send Message"}
                    <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                  </button>
                  <p className="text-center text-[11px]" style={{ fontFamily: "'Inter', sans-serif", color: "#ccc" }}>
                    We respond to all enquiries within 24 hours, Mon–Fri.
                  </p>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
