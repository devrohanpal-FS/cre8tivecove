import bcrypt from "bcryptjs";
import prisma from "./db.js";

async function main() {
  console.log("Seeding database...");

  // 1. Clean existing database records
  await prisma.jobApplication.deleteMany();
  await prisma.jobPosting.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.media.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.service.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.section.deleteMany();
  await prisma.page.deleteMany();
  await prisma.user.deleteMany();

  console.log("Cleared existing database records.");

  // 2. Seed Super Admin User
  const passwordHash = await bcrypt.hash("AdminPass123!", 10);
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@cre8tivecove.com",
      passwordHash,
      role: "SUPER_ADMIN"
    }
  });
  console.log(`Seeded admin user: ${adminUser.email}`);

  // 3. Seed Site Settings
  const settings = [
    {
      key: "contact_info",
      value: {
        email: "info@cre8tivecove.com",
        phone: "+91 99996 59129",
        address: "New Delhi, India",
        hours: "Mon–Fri, 9am–7pm IST"
      }
    },
    {
      key: "social_links",
      value: [
        { platform: "Instagram", url: "https://www.instagram.com/cre8tivecove.cc/" },
        { platform: "Linkedin", url: "https://www.linkedin.com/company/cre8tivecove" },
        { platform: "Behance", url: "https://www.behance.net/ashishnwh29" }
      ]
    },
    {
      key: "achievements_counters",
      value: [
        { val: "1875+", lbl: "Completed Projects" },
        { val: "351+", lbl: "Satisfied Clients" },
        { val: "21+", lbl: "Years Of Experience" }
      ]
    },
    {
      key: "seo_defaults",
      value: {
        title: "Cre8tivecove | Where Imagination sets sail",
        description: "Cre8tivecove is a premium creative agency specializing in video production, commercial shoots, web development, UI/UX design, branding, and social content.",
        keywords: ["creative agency", "video production", "commercial shoots", "branding", "web design"]
      }
    }
  ];

  for (const s of settings) {
    await prisma.siteSettings.create({ data: s });
  }
  console.log("Seeded global site settings.");

  // 4. Seed Pages and Sections
  // Home Page
  const homePage = await prisma.page.create({
    data: {
      slug: "home",
      title: "Cre8tivecove | Where Imagination sets sail",
      seoMeta: {
        description: "From videos to digital, branding to development, we craft compelling stories that captivate, engage, and elevate your brand.",
        keywords: ["creative agency", "video production", "commercial shoots", "branding", "web design"]
      }
    }
  });

  const homeSections = [
    {
      pageId: homePage.id,
      key: "hero",
      order: 1,
      isVisible: true,
      content: {
        showText: false,
        badge: "Cre8tivecove | Where Imagination sets sail",
        headline: "Crafting Stories. Creating Impact. Elevate Brand.",
        subheading: "From videos to digital, branding to development, we craft compelling stories that captivate, engage, and elevate your brand.",
        ctaPrimaryText: "Let's Connect",
        ctaPrimaryLink: "/contact",
        ctaSecondaryText: "Know More",
        ctaSecondaryLink: "/about",
        videoUrl: "https://cre8tivecove.com/assets/videos/new_intro.mp4",
        stats: [
          { val: "1875+", lbl: "Completed Projects" },
          { val: "351+", lbl: "Satisfied Clients" },
          { val: "21+", lbl: "Years Of Experience" }
        ]
      }
    },
    {
      pageId: homePage.id,
      key: "selected_work",
      order: 2,
      isVisible: true,
      content: {
        badge: "Selected Work",
        title: "Projects that define categoriessgfjsgdjfgsjgjfgsjfgdsj.",
        ctaText: "All Projects"
      }
    },
    {
      pageId: homePage.id,
      key: "services_teaser",
      order: 3,
      isVisible: true,
      content: {
        badge: "What We Do",
        title: "Full-spectrum creative services.",
        description: "From a single hero film to a complete brand ecosystem — every engagement receives the same obsessive level of craft."
      }
    },
    {
      pageId: homePage.id,
      key: "process",
      order: 4,
      isVisible: true,
      content: {
        badge: "How We Work",
        title: "Strategy to screen — every step.",
        steps: [
          { title: "Strategy", desc: "Audience mapping, competitive analysis, and creative brief." },
          { title: "Concept", desc: "Moodboards, storyboards, and creative concept development." },
          { title: "Production", desc: "On-location or studio capture with cinema-grade equipment." },
          { title: "Post Production", desc: "Color grade, sound design, edit, and motion graphics." },
          { title: "Launch", desc: "Delivery across every platform with performance tracking." }
        ],
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&h=600&fit=crop&auto=format",
        imageBadge: "8 Years of Craft"
      }
    },
    {
      pageId: homePage.id,
      key: "testimonials",
      order: 5,
      isVisible: true,
      content: {
        badge: "Client Stories",
        title: "What our clients say."
      }
    },
    {
      pageId: homePage.id,
      key: "behind_scenes",
      order: 6,
      isVisible: true,
      content: {
        badge: "Behind the Lens",
        title: "Where the magic happens.",
        items: [
          { img: "1485846234645-a62644f84728", label: "Camera Ops", h: 300, mt: 0 },
          { img: "1508739773434-c26b3d09e071", label: "Drone Shoots", h: 380, mt: 48 },
          { img: "1574717024653-61fd2cf4d44d", label: "Cinematography", h: 380, mt: 0 },
          { img: "1531403236541-e5f16c22a4c3", label: "Editing Suite", h: 300, mt: 48 }
        ]
      }
    },
    {
      pageId: homePage.id,
      key: "cta",
      order: 7,
      isVisible: true,
      content: {
        badge: "Let's Begin",
        title: "Ready to create something remarkable?",
        ctaText: "Let's Talk",
        ctaLink: "/contact"
      }
    }
  ];

  for (const sec of homeSections) {
    await prisma.section.create({ data: sec });
  }

  // About Page
  const aboutPage = await prisma.page.create({
    data: {
      slug: "about",
      title: "About Cre8tiveCove — Where Imagination sets sail",
      seoMeta: {
        description: "At Cre8tiveCove, our expert team is driven to bring your digital vision to life — from stunning website design and seamless development to impactful branding that speaks your story.",
        keywords: ["about cre8tivecove", "creative agency history", "creative production team", "about us"]
      }
    }
  });

  const aboutSections = [
    {
      pageId: aboutPage.id,
      key: "hero",
      order: 1,
      isVisible: true,
      content: {
        badge: "About Us",
        title: "Fueling brands with daring ideas and next-gen strategies that make a mark.",
        image: "https://cre8tivecove.com/assets/imgs/gallery/About.webp"
      }
    },
    {
      pageId: aboutPage.id,
      key: "story",
      order: 2,
      isVisible: true,
      content: {
        badge: "Our Story",
        title: "Born from a love of storytelling.",
        paragraphs: [
          "At Cre8tiveCove, our expert team is driven to bring your digital vision to life — from stunning website design and seamless development to impactful branding that speaks your story.",
          "We specialize in turning bold ideas into visually striking and unforgettable digital experiences, helping your brand connect with customers at any scale."
        ]
      }
    },
    {
      pageId: aboutPage.id,
      key: "mission_vision",
      order: 3,
      isVisible: true,
      content: {
        items: [
          { label: "Mission", icon: "Target", text: "To translate every brand's truest vision into cinematic, strategic creative work that connects and converts — regardless of scale or industry." },
          { label: "Vision", icon: "Eye", text: "A world where every ambitious brand has access to world-class creative production and storytelling that shifts culture." }
        ]
      }
    },
    {
      pageId: aboutPage.id,
      key: "team",
      order: 4,
      isVisible: true,
      content: {
        badge: "The Team",
        title: "The people behind the work."
      }
    },
    {
      pageId: aboutPage.id,
      key: "recognition",
      order: 5,
      isVisible: true,
      content: {
        badge: "Recognition",
        awards: [
          { award: "Awwwards", detail: "SOTD × 12" },
          { award: "Cannes Lions", detail: "Gold 2023" },
          { award: "Webby Awards", detail: "Best Video" },
          { award: "D&AD", detail: "Wood Pencil" }
        ]
      }
    }
  ];

  for (const sec of aboutSections) {
    await prisma.section.create({ data: sec });
  }

  // Careers Page
  const careersPage = await prisma.page.create({
    data: {
      slug: "careers",
      title: "Careers at Cre8tiveCove — Join Our Creative Team",
      seoMeta: {
        description: "Join Cre8tiveCove. We're a team of storytellers, artists, designers, and developers crafting cinema-grade experiences.",
        keywords: ["careers", "creative agency jobs", "cre8tivecove jobs", "openings"]
      }
    }
  });

  const careersSections = [
    {
      pageId: careersPage.id,
      key: "hero",
      order: 1,
      isVisible: true,
      content: {
        badge: "Careers",
        title: "Join a team that loves creating.",
        description: "We're a studio of makers, thinkers, and storytellers. If you obsess over craft and believe great work changes culture, you'll feel at home.",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=700&fit=crop&auto=format",
        imageBadge: "24 Creatives & Counting"
      }
    },
    {
      pageId: careersPage.id,
      key: "benefits",
      order: 2,
      isVisible: true,
      content: {
        title: "Why Cre8tiveCove",
        items: [
          { icon: "Camera", title: "Cinema-grade tools", body: "Work with ARRI Alexa, Sony VENICE, and state-of-the-art post suites." },
          { icon: "Globe", title: "Remote-friendly", body: "Flexible remote options for most roles, with our beautiful LA studio as home base." },
          { icon: "TrendingUp", title: "Growth-first culture", body: "Dedicated $3K learning budget, mentorship, and transparent paths to leadership." },
          { icon: "Zap", title: "Competitive pay", body: "Market-leading salaries, equity options, and comprehensive health benefits." },
          { icon: "Users", title: "Creative autonomy", body: "We hire experts and trust their judgment. Your ideas shape the final work." },
          { icon: "Star", title: "Meaningful clients", body: "Partner with brands that value excellence and give you space to do great things." }
        ]
      }
    },
    {
      pageId: careersPage.id,
      key: "listings",
      order: 3,
      isVisible: true,
      content: {
        title: "Open Positions"
      }
    }
  ];

  for (const sec of careersSections) {
    await prisma.section.create({ data: sec });
  }

  // Contact Page
  const contactPage = await prisma.page.create({
    data: {
      slug: "contact",
      title: "Contact Cre8tiveCove — Let's Work Together",
      seoMeta: {
        description: "Ready to launch your project? Get in touch with Cre8tiveCove for production, brand identity, or digital development.",
        keywords: ["contact", "hire agency", "film production inquiry", "web design company"]
      }
    }
  });

  const contactSections = [
    {
      pageId: contactPage.id,
      key: "hero",
      order: 1,
      isVisible: true,
      content: {
        badge: "Get In Touch",
        title: "Start a conversation."
      }
    }
  ];

  for (const sec of contactSections) {
    await prisma.section.create({ data: sec });
  }

  console.log("Seeded basic pages and sections.");

  // 5. Seed Services
  const services = [
    {
      title: "Video Production & Commercial Shoots",
      slug: "video-production",
      shortDescription: "Commercial TVCs, brand films, product launches, corporate AVs, and drone cinematography shot with cinema-grade rigs and post-produced to perfection.",
      icon: "Film",
      order: 0,
      isFeatured: true,
      heroVideoUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1800&h=800&fit=crop&auto=format",
      overview: "We craft cinematic video productions that capture brand essence, ignite audience emotion, and drive measurable market response. From high-stakes TV commercials starring celebrity talent to sleek corporate documentaries and 8K event projections, our team handles every aspect from script to master deliverable.",
      process: [
        { title: "Concept & Creative Scripting", desc: "Audience mapping, storyboarding, narrative crafting, and shooting script preparation." },
        { title: "Cinema-Grade Production", desc: "On-location or studio capture utilizing RED/ARRI camera packages, professional lighting setups, and licensed drone cinematography." },
        { title: "Post-Production & Editorial", desc: "Assembly editing, color grading (DaVinci Resolve), sound design, voiceover recording, and motion graphic overlays." },
        { title: "Multi-Platform Mastering", desc: "Broadcast-ready master files, digital web cuts, and vertical 9:16 social assets optimized for Instagram Reels and TikTok." }
      ],
      deliverables: [
        { label: "Master Broadcast Film", desc: "High-definition master file in 4K/8K ProRes & H.264 formats" },
        { label: "Social Media Edits", desc: "Short-form edits optimized for vertical platforms (Instagram Reels, TikTok, YouTube Shorts)" },
        { label: "Behind-The-Scenes Cut", desc: "Authentic production BTS highlights for brand social campaigns" },
        { label: "Raw B-Roll Library", desc: "Archival access to high-bitrate raw footage library" }
      ],
      faqs: [
        { q: "What is the typical timeline for a video production?", a: "Commercial productions typically take 3 to 5 weeks from script approval to final color-graded delivery." },
        { q: "Do you handle location permits and casting?", a: "Yes, our full-service production management handles talent casting, location scouting, city permits, and crew logistics." }
      ]
    },
    {
      title: "Digital Content & Campaign Strategy",
      slug: "digital-content",
      shortDescription: "High-converting digital content, social media campaigns, visual storytelling, and infographics that amplify your brand's voice across all digital channels.",
      icon: "Users",
      order: 1,
      isFeatured: true,
      heroVideoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1800&h=800&fit=crop&auto=format",
      overview: "In today's fast-paced digital ecosystem, static messages get ignored. We create dynamic, multi-format content strategies—from viral social video series and interactive infographics to editorial long-form articles—designed to build deep brand affinity and convert casual viewers into loyal advocates.",
      process: [
        { title: "Content Audit & Strategy", desc: "Analyzing your brand positioning, audience demographics, and competitor content touchpoints." },
        { title: "Creative Asset Production", desc: "Studio photography, motion graphic snippets, copywriting, and custom vector design." },
        { title: "Distribution & Paid Push", desc: "Strategic scheduling across Instagram, LinkedIn, YouTube, and targeted paid campaign setups." },
        { title: "Performance Analytics", desc: "Engagement tracking, conversion funnel optimization, and monthly performance reporting." }
      ],
      deliverables: [
        { label: "Monthly Content Calendar", desc: "Plug-and-play visual assets, motion loops, and copywriting decks" },
        { label: "Motion Graphic Snippets", desc: "Engaging 15s visual loops and animated social ad units" },
        { label: "Brand Asset Toolkit", desc: "Reusable templates for Canva, Figma, and social platforms" },
        { label: "Performance Dashboard", desc: "Monthly breakdown of engagement metrics and ROI benchmarks" }
      ],
      faqs: [
        { q: "Can you manage our ongoing social media publishing?", a: "Yes, we provide full monthly content retainer packages including strategy, asset creation, and publishing management." },
        { q: "How do you measure campaign success?", a: "We track reach, engagement rate, click-through rate (CTR), and lead conversion metrics mapped directly to your business goals." }
      ]
    },
    {
      title: "Web Development & UI/UX Design",
      slug: "web-development",
      shortDescription: "Fast, responsive, Awwwards-grade websites and headless CMS web platforms engineered with Next.js, React, and seamless micro-animations.",
      icon: "Laptop",
      order: 2,
      isFeatured: true,
      heroVideoUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1800&h=800&fit=crop&auto=format",
      overview: "Your website is your brand’s digital flagship. We design and develop bespoke, high-performance web experiences that combine editorial visual design with lightning-fast load speeds, intuitive headless CMS capabilities, and seamless conversion funnels.",
      process: [
        { title: "UI/UX Wireframing & Figma Specs", desc: "User journey mapping, interactive Figma prototypes, and design system token creation." },
        { title: "Frontend Architecture", desc: "Building with React, Next.js, Tailwind CSS, and Framer Motion for buttery-smooth 60fps animations." },
        { title: "Headless CMS & API Integration", desc: "Implementing custom CMS admin portals so non-technical team members can edit content effortlessly." },
        { title: "SEO & Performance QA", desc: "Achieving Lighthouse scores >= 90, structured schema markup, and cross-browser quality assurance." }
      ],
      deliverables: [
        { label: "Responsive Custom Web Application", desc: "Fully functional production web code optimized for speed and conversion" },
        { label: "Figma Design System", desc: "Complete UI kit, component library, and typography scale" },
        { label: "Headless Admin Panel", desc: "User-friendly CMS dashboard for full content management" },
        { label: "SEO & Analytics Setup", desc: "Google Analytics 4, Meta Pixel, Sitemap, and Schema markup setup" }
      ],
      faqs: [
        { q: "Will I be able to edit page content without a developer?", a: "Absolutely! Every website we build includes an intuitive custom CMS dashboard where you can edit text, photos, and videos anytime." },
        { q: "What frameworks do you use?", a: "We specialize in modern React, Next.js, TypeScript, Node.js, and Tailwind CSS for maximum speed and security." }
      ]
    },
    {
      title: "App Development & Mobile Solutions",
      slug: "app-development",
      shortDescription: "Native iOS, Android, and cross-platform mobile applications crafted with intuitive UI/UX, real-time backend synchronization, and rock-solid security.",
      icon: "Smartphone",
      order: 3,
      isFeatured: true,
      heroVideoUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1800&h=800&fit=crop&auto=format",
      overview: "Transform your ideas into sleek, high-performing mobile applications. We craft end-to-end mobile solutions—from consumer lifestyle and e-commerce apps to enterprise field management software—focusing on intuitive gesture controls, offline sync, and instant load times.",
      process: [
        { title: "App Architecture & Spec", desc: "Technical roadmap, database schema design, and API endpoint definition." },
        { title: "Mobile UI/UX Prototyping", desc: "Pixel-perfect mobile screen flows and micro-interaction design." },
        { title: "Full-Stack Mobile Build", desc: "Building cross-platform iOS & Android builds using React Native or Flutter with robust Node.js backends." },
        { title: "App Store Deployment", desc: "Thorough QA testing, security auditing, and Apple App Store / Google Play Store submission management." }
      ],
      deliverables: [
        { label: "iOS & Android App Builds", desc: "App Store & Play Store ready binaries and source code" },
        { label: "Backend REST/GraphQL API", desc: "Secure, scalable cloud API microservices" },
        { label: "Admin Control Portal", desc: "Manage app users, notifications, and transactions" },
        { label: "Technical Documentation", desc: "Architecture overview and deployment guide" }
      ],
      faqs: [
        { q: "Do you develop for both iOS and Android?", a: "Yes! We build cross-platform native-performance applications that launch simultaneously on both iOS App Store and Google Play Store." },
        { q: "Do you offer post-launch maintenance?", a: "Yes, we provide ongoing app maintenance, operating system updates, feature rollouts, and server monitoring." }
      ]
    },
    {
      title: "Brand Identity & Creative Strategy",
      slug: "brand-identity",
      shortDescription: "Comprehensive brand positioning, logo design systems, typography guidelines, visual asset packages, and brand voice definition for market leaders.",
      icon: "Palette",
      order: 4,
      isFeatured: true,
      heroVideoUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1800&h=800&fit=crop&auto=format",
      overview: "Build an unmistakable identity that commands attention. We develop holistic brand systems—defining everything from logo mark geometry and luxury typography to color palettes, packaging design, and brand voice guidelines that scale seamlessly across physical and digital touchpoints.",
      process: [
        { title: "Discovery & Brand Positioning", desc: "Uncovering core brand values, target buyer personas, and market white-space opportunities." },
        { title: "Logo System & Identity Design", desc: "Crafting primary logos, secondary marks, favicons, and custom iconography." },
        { title: "Visual Identity System", desc: "Defining brand colors, typography pairs, layout grids, and photographic art direction." },
        { title: "Brand Guidelines Manual", desc: "Compiling a comprehensive master brand manual for internal team and partner alignment." }
      ],
      deliverables: [
        { label: "Master Logo Suite", desc: "Vector SVG, EPS, PNG formats in all primary and secondary color variants" },
        { label: "Brand Guidelines Manual", desc: "PDF & interactive digital brand book detailing usage rules" },
        { label: "Typography & Color Tokens", desc: "Digital and print color specs (CMYK, RGB, Pantone, Hex)" },
        { label: "Collateral Mockups", desc: "Business cards, packaging, stationery, and presentation decks" }
      ],
      faqs: [
        { q: "How long does a brand identity project take?", a: "A complete brand identity design project typically spans 3 to 6 weeks depending on collateral requirements." },
        { q: "Do we get full ownership of vector source files?", a: "Yes! You receive 100% full commercial copyright ownership and all raw vector source files upon project completion." }
      ]
    },
    {
      title: "CGI & 3D Motion Design",
      slug: "cgi-motion-design",
      shortDescription: "Cutting-edge 3D product visualizations, architectural fly-throughs, photorealistic AI visualizers, and high-octane motion graphics.",
      icon: "Cpu",
      order: 5,
      isFeatured: true,
      heroVideoUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1800&h=800&fit=crop&auto=format",
      overview: "Push visual boundaries with photorealistic 3D renders, generative AI visuals, and atmospheric motion graphics. Whether you need an unreleased luxury product brought to life in 3D or a futuristic architectural fly-through for real estate pitches, our 3D CGI team crafts hyper-detailed visual art.",
      process: [
        { title: "3D Modeling & CAD Import", desc: "Building high-fidelity 3D meshes or importing engineering CAD models." },
        { title: "Texture & Shader Setup", desc: "Applying PBR photorealistic surface materials, metallic sheens, and glass refraction." },
        { title: "Camera & Lighting Setup", desc: "Orchestrating cinematic camera angles, sunset twilight illumination, and particle physics." },
        { title: "Raytrace Render & Compositing", desc: "Rendering multi-pass layers (Octane/Redshift) and post-compositing in After Effects." }
      ],
      deliverables: [
        { label: "High-Resolution 3D Renders", desc: "Ultra HD 8K still renders for print and billboard use" },
        { label: "3D Motion Video Clips", desc: "Cinematic 60fps commercial animations" },
        { label: "Interactive 3D Assets", desc: "GLTF / USDZ files for web 3D viewer integration" },
        { label: "Generative AI Visualizers", desc: "Custom AI style models and conceptual visualizers" }
      ],
      faqs: [
        { q: "Can you create 3D renders before physical manufacturing?", a: "Yes! We work directly from CAD drawings, sketches, or 2D concept art to visualize products before production starts." },
        { q: "What software packages do you use?", a: "We utilize Cinema 4D, Unreal Engine, Blender, Houdini, and Octane Render for high-end CGI output." }
      ]
    }
  ];

  for (const svc of services) {
    await prisma.service.create({ data: svc });
  }
  console.log("Seeded services.");

  // 6. Seed Projects
  const projects = [
    {
      title: "Spice Money: Join India's RedBlue Revolution",
      slug: "spice-money-join-indias-redblue-revolution",
      category: "Brand Campaigns",
      thumbnailUrl: "https://mir-s3-cdn-cf.behance.net/projects/max_808/93e307246265723.Y3JvcCwyMDUwLDE6MDQsMTAwNSww.png",
      previewVideoUrl: null,
      overview: "A high-impact nationwide brand campaign and film starring Sonu Sood, rallying rural India into the RedBlue digital banking revolution.",
      challenge: "Reaching rural micro-entrepreneurs across tier-2 and tier-3 towns with an empowering visual message.",
      solution: "Combined cinematic rural storytelling, dynamic color grading (accentuating signature red and blue tones), and engaging messaging.",
      processSteps: [
        { title: "Concept & Narrative", desc: "Crafted an empowering story centered on financial inclusion." },
        { title: "Celebrity Production", desc: "On-location shoot with Sonu Sood in authentic rural setups." },
        { title: "Pan-India Post", desc: "Multilingual dubbing, color grading, and broadcast delivery." }
      ],
      results: [
        { stat: "50M+", label: "Video Impressions" },
        { stat: "+140%", label: "Agent Onboarding Growth" }
      ],
      gallery: [
        "https://mir-s3-cdn-cf.behance.net/projects/max_808/93e307246265723.Y3JvcCwyMDUwLDE6MDQsMTAwNSww.png"
      ],
      clientFeedback: "Cre8tiveCove captured the heart of our mission effortlessly. The production value and storytelling brought the RedBlue Revolution to life across India.",
      clientName: "Marketing Team",
      clientRole: "Brand Lead",
      clientAvatar: "Spice Money",
      order: 0,
      isFeatured: true
    },
    {
      title: "Fill The Gap: 26 January Special",
      slug: "fill-the-gap-26-january",
      category: "CGI & AI Commercials",
      thumbnailUrl: "https://mir-s3-cdn-cf.behance.net/projects/max_808/f2f933246264651.Y3JvcCwxNjMzLDEyNzgsMzU1LDA.png",
      previewVideoUrl: null,
      overview: "A patriotic Republic Day creative film celebrating unity, bridging national gaps, and honoring India's vibrant constitutional heritage.",
      challenge: "Delivering an emotionally resonant national tribute with seamless visual transitions within a tight production timeline.",
      solution: "Blended archival imagery with high-definition digital motion graphics, CGI elements, and inspiring voiceover narration.",
      processSteps: [
        { title: "Storyboarding", desc: "Frame-by-frame visual flow depicting historical milestones." },
        { title: "CGI & Motion", desc: "3D flag particle physics and custom motion typography." }
      ],
      results: [
        { stat: "2.4M+", label: "Organic Social Views" }
      ],
      gallery: [
        "https://mir-s3-cdn-cf.behance.net/projects/max_808/f2f933246264651.Y3JvcCwxNjMzLDEyNzgsMzU1LDA.png"
      ],
      order: 1,
      isFeatured: true
    },
    {
      title: "BPCL: Bharatgas Mini Commercial",
      slug: "bpcl-bharatgas-mini",
      category: "TVC & Commercials",
      thumbnailUrl: "https://mir-s3-cdn-cf.behance.net/projects/max_808/4029d5246263979.Y3JvcCwyMDk2LDE6NDAsMTE5Myww.png",
      previewVideoUrl: null,
      overview: "A catchy TVC commercial for BPCL Bharatgas Mini (5kg LPG cylinders) highlighting convenience, portability, and urban lifestyle ease.",
      challenge: "Showcasing cylinder portability for bachelors, students, and migratory workers in relatable everyday scenarios.",
      solution: "Crafted a fast-paced humor-infused narrative demonstrating instant booking and effortless delivery.",
      processSteps: [
        { title: "Scripting", desc: "Humorous slice-of-life scenes highlighting quick cooking needs." },
        { title: "Studio Shoot", desc: "High-key lifestyle studio production with crisp product lighting." }
      ],
      results: [
        { stat: "+85%", label: "Mini Cylinder Sales Jump" }
      ],
      gallery: [
        "https://mir-s3-cdn-cf.behance.net/projects/max_808/4029d5246263979.Y3JvcCwyMDk2LDE6NDAsMTE5Myww.png"
      ],
      order: 2,
      isFeatured: true
    },
    {
      title: "TVC: SBI Foreign Travel Card (Student Edition)",
      slug: "tvc-sbi-foreign-travel-card-student",
      category: "TVC & Commercials",
      thumbnailUrl: "https://mir-s3-cdn-cf.behance.net/projects/max_808/9b9707237512531.Y3JvcCwyMzE5LDE4MTMsMCww.png",
      previewVideoUrl: null,
      overview: "Commercial for State Bank of India's Foreign Travel Card targeted at students pursuing international education.",
      challenge: "Addressing student anxiety regarding forex exchange fees, emergency card replacement, and abroad transactions.",
      solution: "Designed a youth-centric storyline emphasizing financial freedom, multi-currency wallet features, and total parent peace of mind.",
      processSteps: [
        { title: "Casting", desc: "Relatable young actors capturing the excitement of studying abroad." },
        { title: "Post-Production", desc: "Vibrant color palette with custom UI overlays of the SBI Forex app." }
      ],
      results: [
        { stat: "3.8M", label: "Targeted Student Views" }
      ],
      gallery: [
        "https://mir-s3-cdn-cf.behance.net/projects/max_808/9b9707237512531.Y3JvcCwyMzE9LDE4MTMsMCww.png"
      ],
      order: 3,
      isFeatured: true
    },
    {
      title: "TVC: SBI Foreign Travel Card (Executive & Leisure)",
      slug: "tvc-sbi-foreign-travel-card",
      category: "TVC & Commercials",
      thumbnailUrl: "https://mir-s3-cdn-cf.behance.net/projects/max_808/b168c6237511533.Y3JvcCwyMzE0LDE4MTAsMTYwLDA.png",
      previewVideoUrl: null,
      overview: "Premium commercial showcasing SBI Foreign Travel Card for globetrotting business executives and luxury holidaymakers.",
      challenge: "Conveying global acceptance, contactless payment convenience, and chip security across airport and hotel scenes.",
      solution: "High-end production value with crisp lighting, sleek travel aesthetics, and sophisticated musical scoring.",
      processSteps: [
        { title: "Location Shoot", desc: "Captured sleek airport lounges and luxury hotel lobbies." },
        { title: "Sound Design", desc: "Custom orchestral score emphasizing premium reliability." }
      ],
      results: [
        { stat: "15M+", label: "Television & Digital Reach" }
      ],
      gallery: [
        "https://mir-s3-cdn-cf.behance.net/projects/max_808/b168c6237511533.Y3JvcCwyMzE0LDE4MTAsMTYwLDA.png"
      ],
      order: 4,
      isFeatured: false
    },
    {
      title: "Customer Testimonial: Xtended Space (Hindustan Times Feature)",
      slug: "customer-testimonial-xtended-space",
      category: "Corporate AV & Testimonials",
      thumbnailUrl: "https://mir-s3-cdn-cf.behance.net/projects/max_808/ba6e46237510279.Y3JvcCwyMzQ5LDE4MzgsNDUzLDA.png",
      previewVideoUrl: null,
      overview: "An authentic customer documentary & testimonial film featured on Hindustan Times for Xtended Space smart storage solutions.",
      challenge: "Capturing genuine user delight while demonstrating home decluttering and door-step warehouse pickup services.",
      solution: "Used natural lighting and conversational docu-style interviews coupled with clean home-transformation b-roll.",
      processSteps: [
        { title: "Docu-Style Capture", desc: "Real customer interview in their renovated living space." },
        { title: "B-Roll Storytelling", desc: "Seamless before/after visual sequence." }
      ],
      results: [
        { stat: "100%", label: "Verified Customer Trust Score" }
      ],
      gallery: [
        "https://mir-s3-cdn-cf.behance.net/projects/max_808/ba6e46237510279.Y3JvcCwyMzQ5LDE4MzgsNDUzLDA.png"
      ],
      order: 5,
      isFeatured: false
    },
    {
      title: "Corporate AV: RBI CBDC Generic Retail (Digital Rupee)",
      slug: "corporate-av-rbi-cbdc-generic-retail",
      category: "Corporate AV & Testimonials",
      thumbnailUrl: "https://mir-s3-cdn-cf.behance.net/projects/max_808/76af6c237509923.Y3JvcCwyMzExLDE4MDgsNDUyLDA.png",
      previewVideoUrl: null,
      overview: "Official explainer film & corporate AV introducing RBI's Central Bank Digital Currency (CBDC) e-Rupee for retail transactions.",
      challenge: "Explaining blockchain-backed digital sovereign currency security to everyday consumers and merchants.",
      solution: "Developed clean UI motion animations and real-world payment simulation scenes showcasing instant QR scan payment.",
      processSteps: [
        { title: "Motion Design", desc: "Designed sleek 2D/3D interface graphics explaining wallet transfers." },
        { title: "VO Recording", desc: "Authoritative yet accessible bilingual voiceover narration." }
      ],
      results: [
        { stat: "National", label: "Bank Pilot Deployment" }
      ],
      gallery: [
        "https://mir-s3-cdn-cf.behance.net/projects/max_808/76af6c237509923.Y3JvcCwyMzExLDE4MDgsNDUyLDA.png"
      ],
      order: 6,
      isFeatured: true
    },
    {
      title: "Event AV: GITEX Dubai 2025",
      slug: "event-av-gitex-dubai-2025",
      category: "Corporate AV & Testimonials",
      thumbnailUrl: "https://mir-s3-cdn-cf.behance.net/projects/max_808/331acb237508583.Y3JvcCwxODc2LDE4NjcsNjU5LDY5.png",
      previewVideoUrl: null,
      overview: "Large-format immersive event AV designed for LED walls and mainstage presentations at GITEX Global Dubai 2025.",
      challenge: "Creating an ultra-wide high-resolution visual masterpiece that commands attention amidst noisy expo floors.",
      solution: "Built 3D motion graphics synchronized with heavy sound design and dramatic lighting transitions.",
      processSteps: [
        { title: "8K Canvas Renders", desc: "Rendered custom ultra-wide aspect ratio graphics." },
        { title: "Spatial Audio", desc: "Dynamic bass drop and sound effect orchestration." }
      ],
      results: [
        { stat: "100k+", label: "Expo Audience Reach" }
      ],
      gallery: [
        "https://mir-s3-cdn-cf.behance.net/projects/max_808/331acb237508583.Y3JvcCwxODc2LDE4NjcsNjU5LDY5.png"
      ],
      order: 7,
      isFeatured: true
    },
    {
      title: "Kay Beauty Launch in London",
      slug: "kay-beauty-launch-in-london",
      category: "Brand Campaigns",
      thumbnailUrl: "https://mir-s3-cdn-cf.behance.net/project_modules/hd/514fa1234104927.68bd194ba5f91.jpg",
      previewVideoUrl: null,
      overview: "High-glamour launch film and event coverage for Katrina Kaif's Kay Beauty brand rollout across London.",
      challenge: "Combining high-fashion aesthetics with fast-paced event coverage across iconic London landmarks.",
      solution: "Shot with anamorphic lenses and dynamic handheld rigs, featuring vibrant color grading matching the Kay Beauty palette.",
      processSteps: [
        { title: "London Production", desc: "Cinematic beauty portraiture and red-carpet event filming." },
        { title: "Fashion Grade", desc: "Warm, radiant skin tones and high-contrast editorial color grade." }
      ],
      results: [
        { stat: "Global", label: "UK Market Launch Success" }
      ],
      gallery: [
        "https://mir-s3-cdn-cf.behance.net/project_modules/hd/514fa1234104927.68bd194ba5f91.jpg"
      ],
      order: 8,
      isFeatured: true
    },
    {
      title: "Teaser Video: SKY PALAZZO",
      slug: "teaser-video-sky-palazzo",
      category: "CGI & AI Commercials",
      thumbnailUrl: "https://mir-s3-cdn-cf.behance.net/projects/max_808/aa851c230889339.Y3JvcCwyMzA2LDE4MDQsNDUxLDA.png",
      previewVideoUrl: null,
      overview: "Cinematic architectural teaser film showcasing ultra-luxury sky villas at SKY PALAZZO residential towers.",
      challenge: "Creating aspiration and mystery before the official property reveal while rendering photorealistic sunset lighting.",
      solution: "Combined slow sweeping camera moves, 3D architectural render passes, and orchestral background scoring.",
      processSteps: [
        { title: "3D Visualization", desc: "Architectural CAD model lighting and camera path animation." },
        { title: "Atmospheric Edit", desc: "Moody twilight color palette and subtle lens flare accents." }
      ],
      results: [
        { stat: "100%", label: "VIP Pre-Launch Registration" }
      ],
      gallery: [
        "https://mir-s3-cdn-cf.behance.net/projects/max_808/aa851c230889339.Y3JvcCwyMzA6LDE4MDQsNDUxLDA.png"
      ],
      order: 9,
      isFeatured: false
    },
    {
      title: "Pitch: Luxury Real Estate Vision",
      slug: "pitch-real-estate-project",
      category: "Brand Campaigns",
      thumbnailUrl: "https://mir-s3-cdn-cf.behance.net/projects/max_808/391d33230889081.Y3JvcCwxMjIyLDk1NiwyMzksMA.png",
      previewVideoUrl: null,
      overview: "Strategic pitch video and visual concept deck for an iconic mixed-use real estate development project.",
      challenge: "Winning investor confidence and conveying masterplan scale before construction breakdown.",
      solution: "Delivered dynamic 3D masterplan fly-throughs, lifestyle motion graphics, and financial ROI visualizers.",
      processSteps: [
        { title: "Investor Deck", desc: "High-resolution masterplan renders and cinematic breakdown." }
      ],
      results: [
        { stat: "Secured", label: "Anchor Project Funding" }
      ],
      gallery: [
        "https://mir-s3-cdn-cf.behance.net/projects/max_808/391d33230889081.Y3JvcCwxMjIyLDk1NiwyMzksMA.png"
      ],
      order: 10,
      isFeatured: false
    },
    {
      title: "Pepsi Ad: Made in AI",
      slug: "pepsi-ad-made-in-ai",
      category: "CGI & AI Commercials",
      thumbnailUrl: "https://mir-s3-cdn-cf.behance.net/projects/max_808/c15b85230888763.Y3JvcCwyMjk2LDE3OTYsNjM2LDA.png",
      previewVideoUrl: null,
      overview: "Cutting-edge experimental Pepsi commercial conceptualized, rendered, and post-produced entirely using generative AI toolchains.",
      challenge: "Achieving high-framerate fluid dynamics, iconic soda fizz effects, and surreal visual pacing using generative AI.",
      solution: "Combined Midjourney visual concepts, Runway Gen-2 video synthesis, and custom audio mixing for a next-gen commercial asset.",
      processSteps: [
        { title: "AI Generation", desc: "Prompt engineering and neural style generation." },
        { title: "Frame Interpolation", desc: "Smooth 60fps upscale and soda splash enhancement." }
      ],
      results: [
        { stat: "Featured", label: "AI Creative Showcase Winner" }
      ],
      gallery: [
        "https://mir-s3-cdn-cf.behance.net/projects/max_808/c15b85230888763.Y3JvcCwyMjk2LDE3OTYsNjM2LDA.png"
      ],
      order: 11,
      isFeatured: true
    },
    {
      title: "Fireside Chat with the Brand Leaders",
      slug: "fireside-chat-with-the-brand-leaders",
      category: "Brand Campaigns",
      thumbnailUrl: "https://cre8tivecove.com/assets/imgs/features/1.png",
      previewVideoUrl: null,
      overview: "An insightful fireside discussion with major corporate brand leaders under Paloalto's leadership platform.",
      challenge: "Capturing a long, engaging narrative with multi-camera setup without disrupting the intimate stage setting.",
      solution: "Employed high-end prime lenses and quiet mirrorless cinema setups, utilizing dynamic multi-angle editing.",
      processSteps: [
        { title: "Multi-Cam Setup", desc: "4K synchronized multi-angle stage recording." }
      ],
      results: [
        { stat: "100k+", label: "Executive Leadership Views" }
      ],
      gallery: ["https://cre8tivecove.com/assets/imgs/features/1.png"],
      order: 12,
      isFeatured: true
    },
    {
      title: "Hero MotoCorp: Unleashing the Power",
      slug: "unleashing-the-power",
      category: "TVC & Commercials",
      thumbnailUrl: "https://cre8tivecove.com/assets/imgs/features/2.png",
      previewVideoUrl: null,
      overview: "High-octane commercial shoot showcasing the raw power, styling, and engineering excellence of Hero MotoCorp's latest motorcycle range.",
      challenge: "High-speed tracking shots on dynamic test tracks while preserving sharp details and crisp colors.",
      solution: "Utilized specialized chase cars, stabilizer gimbals, and ultra-high frame rate cameras to create an immersive visual experience.",
      processSteps: [
        { title: "High-Speed Tracking", desc: "Rigged chase vehicle precision filming at 120fps." }
      ],
      results: [
        { stat: "25M+", label: "Broadcast & Social Views" }
      ],
      gallery: ["https://cre8tivecove.com/assets/imgs/features/2.png"],
      order: 13,
      isFeatured: true
    },
    {
      title: "MaxLife: Promise of Protection",
      slug: "promise-of-protection",
      category: "CGI & AI Commercials",
      thumbnailUrl: "https://cre8tivecove.com/assets/imgs/features/3.png",
      previewVideoUrl: null,
      overview: "A promotional 2D/3D animation film illustrating MaxLife's long-term commitment to security, family, and financial trust.",
      challenge: "Making complex financial and insurance terms visually engaging and easy to understand for the public.",
      solution: "Created custom vector characters and modern, smooth animations with a friendly and reassuring visual palette.",
      processSteps: [
        { title: "Character Design", desc: "Relatable family illustration suite." }
      ],
      results: [
        { stat: "98%", label: "Ad Recall Accuracy" }
      ],
      gallery: ["https://cre8tivecove.com/assets/imgs/features/3.png"],
      order: 14,
      isFeatured: true
    },
    {
      title: "Ozone Safe and Locks: Strength and Security",
      slug: "strength-and-security",
      category: "TVC & Commercials",
      thumbnailUrl: "https://cre8tivecove.com/assets/imgs/features/4.png",
      previewVideoUrl: null,
      overview: "A sleek product showcase highlighting the design elegance, biometric security, and robust construction of Ozone Safes.",
      challenge: "Revealing internal engineering mechanisms and biometric security response times in a commercial timeframe.",
      solution: "Utilized macro photography, studio lighting, and high-fidelity 3D cross-section overlays to illustrate vault strengths.",
      processSteps: [
        { title: "Macro Studio Lighting", desc: "Sub-millimeter detail shots of biometric lock mechanisms." }
      ],
      results: [
        { stat: "+60%", label: "Retail Channel Sales Growth" }
      ],
      gallery: ["https://cre8tivecove.com/assets/imgs/features/4.png"],
      order: 15,
      isFeatured: true
    },
    {
      title: "Silverglades: Luxury Living",
      slug: "luxury-living",
      category: "CGI & AI Commercials",
      thumbnailUrl: "https://cre8tivecove.com/assets/imgs/features/5.png",
      previewVideoUrl: null,
      overview: "A virtual fly-through site experience and architectural showcase of Silverglades premium luxury housing apartments.",
      challenge: "Rendering photorealistic lighting and premium materials across large architectural scenes.",
      solution: "Blended real aerial drone footage with highly polished interior styling and immersive camera path sequences.",
      processSteps: [
        { title: "Drone & 3D Integration", desc: "Matchmoving aerial drone passes with 3D interior renders." }
      ],
      results: [
        { stat: "Sold Out", label: "Phase 1 Luxury Inventory" }
      ],
      gallery: ["https://cre8tivecove.com/assets/imgs/features/5.png"],
      order: 16,
      isFeatured: true
    },
    {
      title: "SalonTym: Your Style, Your Time",
      slug: "your-style-your-time",
      category: "CGI & AI Commercials",
      thumbnailUrl: "https://cre8tivecove.com/assets/imgs/features/6.png",
      previewVideoUrl: null,
      overview: "A vibrant promotional and animated campaign introducing SalonTym's at-home beauty and hair services app.",
      challenge: "Conveying convenience and quality of personalized services in a quick, catchy format.",
      solution: "Designed playful animations tracking the app flow integrated with cinematic shots of styling in action.",
      processSteps: [
        { title: "App Motion Flow", desc: "Interactive UI screen animations with live-action styling cutaways." }
      ],
      results: [
        { stat: "50k+", label: "App Downloads in Month 1" }
      ],
      gallery: ["https://cre8tivecove.com/assets/imgs/features/6.png"],
      order: 17,
      isFeatured: true
    },
    {
      title: "AIPL: Real Stories, Real Trust",
      slug: "real-stories-real-trust",
      category: "Corporate AV & Testimonials",
      thumbnailUrl: "https://cre8tivecove.com/assets/imgs/features/7.png",
      previewVideoUrl: null,
      overview: "A customer testimonial series focusing on real stories, trust, and business growth inside AIPL commercial centers.",
      challenge: "Eliciting candid, unscripted responses from real business owners in high-pressure office environments.",
      solution: "Conducted relaxed, conversational interview shoots with minimalist lighting setups to preserve authenticity.",
      processSteps: [
        { title: "Docu Interviews", desc: "On-site commercial park client shoots." }
      ],
      results: [
        { stat: "100%", label: "Client Satisfaction Benchmark" }
      ],
      gallery: ["https://cre8tivecove.com/assets/imgs/features/7.png"],
      order: 18,
      isFeatured: true
    },
    {
      title: "RPCS: Clean Solutions for Every Space",
      slug: "clean-solutions-for-every-space",
      category: "Web & Digital Solutions",
      thumbnailUrl: "https://cre8tivecove.com/assets/imgs/features/8.png",
      previewVideoUrl: null,
      overview: "A complete website development project for RPCS Pest Control, featuring customized quoting engines and booking flows.",
      challenge: "Presenting a service-oriented business cleanly with high-conversion landing pages.",
      solution: "Designed a clean, responsive layout with intuitive booking interactions and optimized SEO performance.",
      processSteps: [
        { title: "Web Platform Build", desc: "Custom React/Next.js frontend with quote calculation engine." }
      ],
      results: [
        { stat: "+210%", label: "Digital Quote Inquiries" }
      ],
      gallery: ["https://cre8tivecove.com/assets/imgs/features/8.png"],
      order: 19,
      isFeatured: true
    }
  ];

  for (const prj of projects) {
    await prisma.project.create({ data: prj });
  }
  console.log("Seeded projects.");

  // 7. Seed Team Members
  const team = [
    { name: "Ashish Mishra", role: "Founder & CEO", photoUrl: "https://cre8tivecove.com/assets/imgs/team/aashi.png", bio: "Ashish Mishra leads Cre8tiveCove as Founder & CEO, guiding branding and creative directions.", order: 0 },
    { name: "Sudha Mishra", role: "Managing Director", photoUrl: "https://cre8tivecove.com/assets/imgs/team/Sudha.png", bio: "Sudha Mishra coordinates production, logistics, and digital team workflows.", order: 1 }
  ];

  for (const m of team) {
    await prisma.teamMember.create({ data: m });
  }
  console.log("Seeded team members.");

  // 8. Seed Testimonials
  const testimonials = [
    {
      clientName: "Anurag Joshi",
      clientPhoto: "https://cre8tivecove.com/assets/imgs/logos-client/SBI.png",
      companyLogo: null,
      quote: "Cre8tiveCove's dedicated team ensures every project is in expert hands, giving us complete peace of mind.",
      rating: 5,
      order: 0
    },
    {
      clientName: "Akshey Sharma",
      clientPhoto: "https://cre8tivecove.com/assets/imgs/logos-client/Think-Gas.png",
      companyLogo: null,
      quote: "Working with Cre8tiveCove is seamless—their creativity and precision ensure peace of mind.",
      rating: 5,
      order: 1
    },
    {
      clientName: "Khushbu",
      clientPhoto: "https://cre8tivecove.com/assets/imgs/logos-client/Zoya.png",
      companyLogo: null,
      quote: "Exceptional work by Cre8tiveCove! Their expertise, dedication, and incredibly fast turnaround made our website project seamless. A fantastic team delivering top-notch results!",
      rating: 5,
      order: 2
    }
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }
  console.log("Seeded testimonials.");

  // 9. Seed Job Postings
  const jobs = [
    {
      title: "Senior Cinematographer",
      department: "Video Production",
      type: "Full-time",
      location: "New Delhi, India",
      overview: "We are looking for a Senior Cinematographer to lead visual storytelling across our client film productions. You will collaborate directly with our Creative Director from concept through post-production, helping shape the visual language of some of the world's most ambitious brand films.",
      responsibilities: [
        "Lead camera operation and lighting design across all productions",
        "Collaborate with directors and clients to realise the creative vision",
        "Supervise and mentor junior camera operators and focus pullers",
        "Manage equipment selection, rental, and maintenance budgets",
        "Contribute to pre-production creative development and storyboarding"
      ],
      requirements: [
        "5+ years experience in narrative or commercial cinematography",
        "Proficiency with ARRI Alexa, Sony VENICE, and RED cinema cameras",
        "Deep working knowledge of lighting for studio and location",
        "Strong reel demonstrating clear, distinctive visual language",
        "Excellent communication and creative leadership skills"
      ],
      benefits: [
        "Salary range: ₹12,00,000 – ₹18,00,000 depending on experience",
        "Full medical, dental, and vision coverage",
        "Annual learning and equipment budget",
        "Flexible PTO plus 2-week mandatory studio closure",
        "Access to our New Delhi studio, screening room, and full camera house"
      ],
      isOpen: true
    },
    {
      title: "Brand Designer",
      department: "Design",
      type: "Full-time",
      location: "Remote (India)",
      overview: "We are seeking an experienced Brand Designer to craft distinctive visual identity systems, typography blueprints, and layout manuals.",
      responsibilities: [], requirements: [], benefits: [],
      isOpen: true
    },
    {
      title: "Frontend Developer",
      department: "Development",
      type: "Full-time",
      location: "New Delhi, India",
      overview: "Build pixel-perfect digital platforms using React, Tailwind CSS, and Framer Motion.",
      responsibilities: [], requirements: [], benefits: [],
      isOpen: true
    }
  ];

  for (const job of jobs) {
    await prisma.jobPosting.create({ data: job });
  }
  console.log("Seeded job postings.");

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
