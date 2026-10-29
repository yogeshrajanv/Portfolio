import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Github, Linkedin, Instagram, Mail, ExternalLink,
  Download, ChevronRight, ChevronLeft, Code2, Database, Monitor,
  Award, Send, ArrowRight, Menu, X, Terminal, FileText,
  Utensils, BusFront, Droplets, GitPullRequest, Cpu, HardHat
} from 'lucide-react'



/* ============================================================
   PARTICLE CANVAS – floating dots + connecting lines
   ============================================================ */
const ParticleCanvas = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    const DOTS = 60
    const MAX_DIST = 160

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const dots = Array.from({ length: DOTS }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.8 + 0.6,
    }))

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy
        if (d.x < 0 || d.x > canvas.width)  d.vx *= -1
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1
      })

      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x
          const dy = dots[i].y - dots[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MAX_DIST) {
            ctx.beginPath()
            ctx.moveTo(dots[i].x, dots[i].y)
            ctx.lineTo(dots[j].x, dots[j].y)
            ctx.strokeStyle = `rgba(0,0,0,${0.08 * (1 - dist / MAX_DIST)})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
        ctx.beginPath()
        ctx.arc(dots[i].x, dots[i].y, dots[i].r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0,0,0,0.12)'
        ctx.fill()
      }
      animId = requestAnimationFrame(tick)
    }
    tick()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} id="particle-canvas" />
}

/* ============================================================
   TYPING ANIMATION
   ============================================================ */
const useTyping = (phrases, speed = 55, pause = 2200) => {
  const [displayed, setDisplayed] = useState('')
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = phrases[phraseIdx]
    if (!deleting && charIdx <= current.length) {
      const t = setTimeout(() => setCharIdx(c => c + 1), speed)
      setDisplayed(current.slice(0, charIdx))
      return () => clearTimeout(t)
    }
    if (!deleting && charIdx > current.length) {
      const t = setTimeout(() => setDeleting(true), pause)
      return () => clearTimeout(t)
    }
    if (deleting && charIdx >= 0) {
      const t = setTimeout(() => { setCharIdx(c => c - 1); setDisplayed(current.slice(0, charIdx - 1)) }, speed / 2)
      return () => clearTimeout(t)
    }
    if (deleting && charIdx < 0) {
      setDeleting(false)
      setPhraseIdx(i => (i + 1) % phrases.length)
      setCharIdx(0)
    }
  }, [charIdx, deleting, phraseIdx, phrases, speed, pause])

  return displayed
}

/* ============================================================
   SCROLL REVEAL HOOK
   ============================================================ */
const FadeUp = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 36 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1], delay }}
    className={className}
  >
    {children}
  </motion.div>
)

const FadeLeft = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, x: -36 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1], delay }}
    className={className}
  >
    {children}
  </motion.div>
)

/* ============================================================
   SECTION TITLE
   ============================================================ */
const SectionTitle = ({ title, subtitle }) => (
  <FadeUp className="section-title-wrap">
    <h2>{title}</h2>
    {subtitle && <p>{subtitle}</p>}
    <div className="section-accent-line" />
  </FadeUp>
)

/* ============================================================
   NAVBAR
   ============================================================ */
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Certificates', href: '#certificates' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <a href="#home" className="nav-logo">
          <span>YOGESH RAJAN V</span>
        </a>

        <ul className="nav-links">
          {links.map(l => (
            <li key={l.name}>
              <a href={l.href}>{l.name}</a>
            </li>
          ))}
        </ul>

        <button className="nav-mobile-btn" onClick={() => setOpen(o => !o)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ul>
              {links.map(l => (
                <li key={l.name}>
                  <a href={l.href} onClick={() => setOpen(false)}>{l.name}</a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

/* ============================================================
   HERO
   ============================================================ */
const Hero = () => {
  const role = useTyping([
    'Web Developer',
    'Data Analyst',
    'Web Development + Data Analysis',
    'Problem Solver',
  ])

  const stagger = {
    container: { animate: { transition: { staggerChildren: 0.12 } } },
    item: {
      initial: { opacity: 0, y: 28 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } }
    }
  }

  return (
    <section id="home" className="hero">
      <div className="hero-inner">
        {/* Content */}
        <motion.div
          className="hero-content"
          variants={stagger.container}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={stagger.item} className="hero-label">
            <span className="hero-label-line" />
            Portfolio
          </motion.div>

          <motion.h1 variants={stagger.item} className="hero-name" style={{ whiteSpace: 'nowrap' }}>
            Yogesh Rajan V
          </motion.h1>

          <motion.div variants={stagger.item} className="hero-role">
            {role}
            <span className="typing-cursor" aria-hidden="true" />
          </motion.div>

          <motion.p variants={stagger.item} className="hero-summary">
            "I design and build scalable, efficient, and user-focused web applications using modern technologies."
          </motion.p>

          <motion.p variants={stagger.item} className="hero-intro">
            A passionate CS Engineering student specialising in web development and data analysis. I build clean, maintainable apps and turn data into useful insights.
          </motion.p>

          <motion.div variants={stagger.item} className="hero-skills-line">
            {['Frontend', 'Backend', 'Databases', 'Problem Solving'].map(t => (
              <span key={t} className="skill-pill">{t}</span>
            ))}
          </motion.div>

          <motion.div variants={stagger.item} className="hero-actions">
            <motion.a
              href="#projects"
              className="btn btn-primary"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              View Projects <ArrowRight size={18} />
            </motion.a>
            <motion.button
              className="btn btn-secondary"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <Download size={18} /> Resume
            </motion.button>
            <motion.a
              href="#contact"
              className="btn btn-secondary"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <Mail size={18} /> Contact
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

/* ============================================================
   ABOUT
   ============================================================ */
const About = () => (
  <section id="about">
    <SectionTitle title="About Me" />
    <div className="about-grid">
      <FadeLeft className="about-text">
        <p>
          I am a Computer Science Engineering student with a strong foundation in software development and problem-solving. I enjoy working across the full stack — from designing intuitive user interfaces to developing efficient backend systems.
        </p>
        <p style={{ marginTop: '20px' }}>
          I am constantly improving my skills by building projects, exploring new technologies, and solving real-world problems. My goal is to become a highly skilled software engineer capable of developing scalable and impactful applications.
        </p>
      </FadeLeft>
    </div>
  </section>
)

/* ============================================================
   SKILLS
   ============================================================ */
const Skills = () => {
  const data = [
    {
      cat: 'Frontend',
      icon: <Monitor size={22} color="#555" />,
      items: ['HTML', 'CSS', 'JavaScript', 'React'],
    },
    {
      cat: 'Backend',
      icon: <Terminal size={22} color="#555" />,
      items: ['Node.js', 'Python'],
    },
    {
      cat: 'Database',
      icon: <Database size={22} color="#555" />,
      items: ['MySQL', 'Firebase'],
    },
    {
      cat: 'Tools',
      icon: <Code2 size={22} color="#555" />,
      items: ['VS Code', 'Git', 'Power BI'],
    },
  ]

  return (
    <div className="alt-bg section-full" id="skills">
      <div className="section-inner" style={{ padding: '130px 24px' }}>
        <SectionTitle title="Technical Skills" />
        <div className="skills-grid">
          {data.map((s, i) => {
            const symbols = {
              'Frontend': '</>',
              'Backend': '>_',
              'Database': '{}',
              'Tools': '⚡'
            }
            return (
              <FadeUp key={s.cat} delay={i * 0.1}>
                <motion.div
                  className={`skill-card ${s.cat.toLowerCase()}`}
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className="skill-card-bg-symbol">{symbols[s.cat]}</div>
                  <div className="skill-icon-wrap">{s.icon}</div>
                  <h3>{s.cat}</h3>
                  <ul className="skill-list">
                    {s.items.map(item => (
                      <li key={item}>
                        <span className="skill-dot" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </FadeUp>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   PROJECTS
   ============================================================ */
const projects = [
  {
    num: '01',
    title: 'Smart Canteen Management System',
    tagline: 'Digital-first solution to eliminate queues and manual billing errors',
    desc: 'A mobile-based canteen system enabling users to browse menus, place orders, and pay digitally. A Raspberry Pi verifies the digital bill at the counter and triggers automatic receipt printing.',
    folder: 'rit canteen',
    images: [
      'WhatsApp Image 2026-03-20 at 11.38.26 AM.jpeg',
      'rit.jpeg',
      'WhatsApp Image 2026-03-20 at 11.38.27 AM.jpeg',
      'WhatsApp Image 2026-03-20 at 11.38.28 .jpeg',
      'rit canteen.jpeg',
    ],
    tech: ['Flutter', 'SQL Server', 'Twilio', 'Raspberry Pi', 'Thermal Printer'],
    features: [
      'Digital ordering & payment flow',
      'QR/visual bill verification via Raspberry Pi',
      'Automated thermal receipt printing',
      'SMS order notifications via Twilio',
    ],
    role: ' Frontend Developer & DB Management',
    badge: null,
    icon: <Utensils size={40} className="project-corner-icon" />
  },
  {
    num: '02',
    title: 'Real-Time Bus Tracking System',
    tagline: 'Track buses live — no expensive GPS hardware needed',
    desc: 'Web app that lets students track college buses in real-time. Drivers share live location via mobile; students see bus positions and ETAs on an interactive map.',
    folder: 'bus tracker',
    images: [
      'WhatsApp Image 2026-03-20 at 1.28.36 PM.jpeg',
      'WhatsApp Image 2026-03-20 at 1.28.36 P.jpeg',
      'WhatsApp Image 2026-03-20 at 1.28.36 .jpeg',
      'WhatsApp Image 2026-03-20 at 1.28.37 PM.jpeg',
    ],
    tech: ['Firebase', 'Google Maps API', 'Leaflet', 'HTML', 'CSS'],
    features: [
      'Live bus tracking via mobile location sharing',
      'Real-time sync with Firebase Realtime Database',
      'Interactive map with ETA display',
      'Lightweight, cost-effective architecture',
    ],
    role: ' Frontend Developer — Maps & UI/UX',
    badge: '🏆 Freshathon Hackathon',
    icon: <BusFront size={40} className="project-corner-icon" />
  },
  {
    num: '03',
    title: 'Elementrixx — IoT Water Quality Monitor',
    tagline: 'Prevent water contamination at the source using real-time IoT monitoring',
    desc: 'IoT system that monitors contamination levels in water bodies via ESP32 sensors. Data is transmitted through MQTT, analyzed in real-time, and alerts locals automatically in native languages.',
    folder: 'elementrixx',
    images: [
      
      'WhatsApp Image 2026-03-20 at 11.38..jpeg',
      'WhatsApp Image 2026-03-20 at 11.38.30 AM.jpeg',
      'WhatsApp Image 2026-03-20 at 11.38.31 AM.jpeg',
      'WhatsApp Image 2026-03-20 at 11.38.32 A.jpeg',
      'WhatsApp Image 2026-03-20 at 11..jpeg',
      'WhatsApp Image 2026-03-20 at 2.56.18 PM.jpeg',
    ],
    tech: ['ESP32', 'MQTT', 'Firebase', 'SMS Alert System'],
    features: [
      'Real-time sensor data via MQTT protocol',
      'Multilingual automated SMS alerts for locals',
      'Smart auto-deletion for data management',
      'Live contamination monitoring dashboard',
    ],
    role: ' Backend Developer & IoT Engineer',
    badge: null,
    icon: <Droplets size={40} className="project-corner-icon" />,
  },
  {
    num: '04',
    title: 'Quantum AI Predictive Maintenance System',
    tagline: 'Forecasting equipment failure using quantum machine learning on sensor data',
    desc: 'A predictive maintenance system that forecasts hardware failure and Remaining Useful Life (RUL) for laptops and smartphones using a Quantum Support Vector Machine (QSVM) trained on the AI4I 2020 industrial dataset. Real sensor readings are mapped onto the dataset\'s feature schema to detect anomalies, classify device health as Good/Warning/Critical, and estimate RUL. Results are displayed on a live Streamlit dashboard.',
    folder: 'Predictive maintenance',
    images: [
      '1785766823532.jpg',
      '1785766824992.jpg',
      '1785766889648.jpg',
      '1785766891278.jpg',
      '1785766891830.jpg',
      '1785766921628.jpg',
      '1785766921727.jpg',
      '1785766922084.jpg',
      '1785766924551.jpg',
      '1785766926098.jpg',
    ],
    tech: ['Qiskit (QSVM)', 'Python', 'scikit-learn', 'Streamlit', 'psutil', 'phyphox', 'AI4I 2020 Dataset'],
    features: [
      'Sensor-to-feature mapping for laptop & phone telemetry',
      'Classical SVM vs quantum kernel (QSVM) comparison',
      'Device health classification: Good / Warning / Critical',
      'Live Streamlit dashboard with RUL estimates',
    ],
    role: ' Data & ML Engineer',
    badge: null,
    icon: <Cpu size={40} className="project-corner-icon" />,
  },
  {
    num: '05',
    title: 'AI-Driven Construction Safety & BOCW Compliance',
    tagline: 'Real-time Vision Intelligence for Site Safety',
    desc: 'A real-time safety monitoring system addressing manual PPE inspection gaps and enforcing the Building and Other Construction Workers (BOCW) Act 1996. Uses YOLO object detection on live IP camera feeds to identify PPE violations and flag workers entering danger zones. Violations are analyzed by the Groq API for natural-language incident reporting and pushed to supervisors via Telegram alerts.',
    folder: 'Construction Compliance',
    images: [
      'WhatsApp Image 2026-10-29 at 6.46.03 PM.jpeg',
      'WhatsApp Image 2026-10-29 at 6.46.03 PM (1).jpeg',
      'WhatsApp Image 2026-10-29 at 6.46.04 PM.jpeg',
      'WhatsApp Image 2026-10-29 at 6.46.04 PM (1).jpeg',
      'WhatsApp Image 2026-10-29 at 6.46.04 PM (2).jpeg',
      'WhatsApp Image 2026-10-29 at 6.46.04 PM (3).jpeg',
      'WhatsApp Image 2026-10-29 at 6.46.05 PM.jpeg',
      'WhatsApp Image 2026-10-29 at 6.46.05 PM (1).jpeg',
      'WhatsApp Image 2026-10-29 at 6.46.05 PM (2).jpeg',
    ],
    tech: ['YOLO', 'OpenCV', 'Groq API', 'Streamlit', 'Telegram Bot API', 'Pandas', 'IP Cameras'],
    features: [
      'PPE detection pipeline on live IP camera streams',
      'Danger-zone allocation logic for restricted-area entry',
      'Groq API integration for real-time violation reporting',
      'Instant Telegram alerts to site supervisors',
    ],
    role: ' Computer Vision & Backend Developer',
    badge: '🏆 2nd Place Hackathon',
    icon: <HardHat size={40} className="project-corner-icon" />,
  },
]

const Projects = () => (
  <section id="projects">
    <div className="code-bg-decoration" aria-hidden="true">
      {`function build(app) {\n  return deploy(app);\n}\n\nconst result = build({\n  stack: "MERN",\n  ready: true\n});`}
    </div>
    <SectionTitle title="Featured Projects" subtitle="Real-world solutions built with purpose" />
    <div className="projects-grid">
      {projects.map((p, i) => (
        <FadeUp key={p.title} delay={i * 0.12}>
          <a
            href={`#/projects/${encodeURIComponent(p.folder)}`}
            className="project-card-link"
            aria-label={`Open ${p.title} details`}
          >
            <motion.div
              className="project-card"
              whileHover={{ y: -7, boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}
              transition={{ type: 'spring', stiffness: 240, damping: 22 }}
            >
              <div className="pc-header">
                <span className="project-num">Project {p.num}</span>
                {p.badge && <span className="pc-badge">{p.badge}</span>}
                {p.icon}
              </div>

              <h3 className="pc-title">{p.title}</h3>
              <p className="pc-tagline">"{p.tagline}"</p>
              <p className="pc-desc">{p.desc}</p>

              {/* Tech stack */}
              <div className="tech-tags" style={{ marginTop: '16px' }}>
                {p.tech.map(t => <span key={t} className="tech-tag">{t}</span>)}
              </div>

              {/* Key features */}
              <ul className="pc-features">
                {p.features.map(f => (
                  <li key={f}>
                    <ChevronRight size={13} className="pc-feat-icon" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Footer row */}
              <div className="pc-footer">
                <span className="pc-role">
                  <span className="pc-role-label">Role</span>
                  {p.role}
                </span>
              </div>
            </motion.div>
          </a>
        </FadeUp>
      ))}
    </div>
  </section>
)


/* ============================================================
   PROJECT DETAIL (hash-based, no React Router dependency)
   ============================================================ */
const ProjectDetail = ({ project, onBack }) => {
  if (!project) {
    return (
      <section className="project-detail">
        <div className="project-detail-inner">
          <div className="hero-content">
            <h1 className="project-detail-title">Project not found</h1>
            <p className="project-detail-subtitle">Select a project from “Featured Projects”.</p>
            <button className="btn btn-secondary" onClick={onBack}>
              Back to Projects
            </button>
          </div>
        </div>
      </section>
    )
  }

  const folderEncoded = encodeURIComponent(project.folder)
  const imgUrls = project.images.map((fn) => `/projects/${folderEncoded}/${encodeURIComponent(fn)}`)
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    setActiveImg(0)
  }, [project.folder])

  const hasMultiple = imgUrls.length > 1
  const goPrev = () => {
    setActiveImg((i) => (i - 1 + imgUrls.length) % imgUrls.length)
  }
  const goNext = () => {
    setActiveImg((i) => (i + 1) % imgUrls.length)
  }

  return (
    <section className="project-detail" aria-label={`${project.title} details`}>
      <div className="project-detail-inner">
        {/* LEFT: text content */}
        <motion.div
          className="project-detail-left"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero-label" style={{ marginBottom: 18 }}>
            <span className="hero-label-line" />
            Project {project.num}
          </div>

          <h1 className="project-detail-title">{project.title}</h1>
          <p className="project-detail-tagline">"{project.tagline}"</p>

          <div className="project-detail-block">
            <h3>Overview</h3>
            <p>{project.desc}</p>
          </div>

          <div className="project-detail-block">
            <h3>Tech Stack</h3>
            <div className="tech-tags project-detail-tech">
              {project.tech.map((t) => (
                <span key={t} className="tech-tag">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="project-detail-block">
            <h3>My Role</h3>
            <p className="project-detail-role">{project.role}</p>
            <ul className="project-detail-features">
              {project.features.map((f) => (
                <li key={f}>
                  <ChevronRight size={13} className="pc-feat-icon" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="project-detail-actions">
            <button className="btn btn-secondary" onClick={onBack}>
              Back to Featured Projects
            </button>
          </div>
        </motion.div>

        <div className="project-detail-visual">
          <div className="project-carousel" aria-label="Project images carousel">
            {hasMultiple && (
              <button
                type="button"
                className="project-carousel-btn project-carousel-btn-left"
                onClick={goPrev}
                aria-label="Previous image"
              >
                <ChevronLeft size={18} />
              </button>
            )}

            <motion.div
              className={`project-carousel-frame${
                project.folder === 'rit canteen' ? ' project-carousel-frame-canteen' : ''
              }`}
              key={imgUrls[activeImg]}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <img
                src={imgUrls[activeImg]}
                alt={`${project.title} image ${activeImg + 1}`}
                loading="lazy"
              />
            </motion.div>

            {hasMultiple && (
              <button
                type="button"
                className="project-carousel-btn project-carousel-btn-right"
                onClick={goNext}
                aria-label="Next image"
              >
                <ChevronRight size={18} />
              </button>
            )}
          </div>

          {imgUrls.length > 1 && (
            <div className="project-carousel-dots" aria-label="Image navigation">
              {imgUrls.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`project-carousel-dot${idx === activeImg ? ' active' : ''}`}
                  onClick={() => setActiveImg(idx)}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   CERTIFICATES
   ============================================================ */
const certs = [
  { 
    name: 'AgRITech Pongal Hackathon (2nd Place)', 
    issuer: 'Hackathon Certificate',
    desc: 'Created a cashew disease detection app using an ML model within the given time limit.',
    file: '/certificates/pongal certificate .pdf'
  },
  { 
    name: 'Data Analytics', 
    issuer: 'Maiyyam',
    desc: 'Learned basics of Data Analysis, Power BI, DAX, Power Query and visualization tools.',
    file: '/certificates/Data Analytics_Maiyyam.pdf'
  },
  { 
    name: 'Web Development', 
    issuer: 'Maiyyam',
    desc: 'Covered fundamentals of Web Development using HTML, CSS, JS, and basics of React.',
    file: '/certificates/Web Development_Maiyyam.pdf'
  },
  { 
    name: 'IIRS Workshop', 
    issuer: 'IIRS',
    desc: 'Attended a comprehensive workshop on advanced image analysis for geospatial professionals.',
    file: '/certificates/iirs workshop.pdf'
  },
  { 
    name: 'Freshathon Hackathon', 
    issuer: 'Hackathon Certificate',
    desc: 'Developed an app for real-time bus tracking without trackers using live location sharing to calculate ETAs.',
    file: '/certificates/freshathon certificate .pdf'
  },
]

const Certificates = () => (
  <div className="alt-bg section-full" id="certificates">
    <div className="section-inner" style={{ padding: '130px 24px' }}>
      <SectionTitle title="Certificates & Courses" subtitle="My academic and extracurricular learnings" />
      <div className="cert-grid">
        {certs.map((c, i) => (
          <FadeUp key={c.name} delay={i * 0.1}>
            <a href={c.file} target="_blank" rel="noopener noreferrer" className="cert-link-wrap">
              <motion.div
                className="cert-card"
                whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="cert-thumb" style={{ padding: 0 }}>
                  <iframe
                    src={`${c.file}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                    className="cert-pdf-frame"
                    title={c.name}
                    tabIndex={-1}
                  />
                  <div className="cert-thumb-overlay" />
                  <span className="cert-thumb-badge">PDF</span>
                </div>
                <div className="cert-content">
                  <div className="cert-header">
                    <Award className="cert-icon" size={16} strokeWidth={2.5} />
                    <span className="cert-issuer">{c.issuer}</span>
                  </div>
                  <h3>{c.name}</h3>
                  <p className="cert-desc">{c.desc}</p>
                </div>
              </motion.div>
            </a>
          </FadeUp>
        ))}
      </div>
    </div>
  </div>
)

/* ============================================================
   EXPERIENCE
   ============================================================ */
const internships = [
  {
    company: 'Spinacle',
    role: 'Mobile Application Developer',
    duration: 'Jul 2025 - Aug 2025 • 2 mos (Remote)',
    desc: 'Worked on a gut health tracker application used to accurately analyze and monitor patient health data.',
    file: '/internship/spinacle certificate .pdf'
  },
  {
    company: 'ShiningBot',
    role: 'Web Developer',
    duration: 'Jul 2025 • 1 mo (On-site)',
    desc: 'Developed a smart attendance system utilizing advanced face recognition algorithms.',
    file: '/internship/shining bot certificate .pdf'
  }
]

const Experience = () => (
  <section id="experience">
    <SectionTitle title="Experience" />
    
    {/* ===== INTERNSHIPS SUB-SECTION ===== */}
    <div style={{ marginBottom: '30px' }}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Internships</h3>
    </div>
    
    <div className="internship-grid" style={{ marginBottom: '60px' }}>
      {internships.map((int, i) => (
        <FadeUp key={int.company} delay={i * 0.15}>
          <a href={int.file} target="_blank" rel="noopener noreferrer" className="cert-link-wrap">
            <motion.div
              className="internship-card"
              whileHover={{ y: -8, boxShadow: '0 24px 48px rgba(0,0,0,0.08)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="internship-thumb" style={{ padding: 0 }}>
                <iframe
                  src={`${int.file}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                  className="cert-pdf-frame"
                  title={int.company}
                  tabIndex={-1}
                />
                <div className="cert-thumb-overlay" />
                <span className="cert-thumb-badge" style={{ background: '#222' }}>PDF</span>
              </div>
              <div className="internship-content">
                <div className="internship-header">
                  <span className="internship-company">{int.company}</span>
                  <span className="internship-duration">{int.duration}</span>
                </div>
                <h3>{int.role}</h3>
                <p className="internship-desc">{int.desc}</p>
              </div>
            </motion.div>
          </a>
        </FadeUp>
      ))}
    </div>

    {/* ===== PROJECTS & ACHIEVEMENTS SUB-SECTION ===== */}
    <div style={{ marginBottom: '30px' }}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Academic & Self Projects</h3>
    </div>
    <div className="exp-timeline">
      <div className="exp-dot" />
      <FadeUp>
        <div className="exp-label">Present</div>
        <h3>Software Development</h3>
        <p className="exp-sub">Continuous Learning</p>
        <p className="exp-desc">
          Worked on full-stack applications focusing on performance, clean architecture, and user experience. Gained experience in API integration, database handling, and responsive UI design.
        </p>
      </FadeUp>
      <FadeUp delay={0.15}>
        <div className="achievements-box">
          <h4>Achievements</h4>
          <ul className="achievements-list">
            {[
              'Solved coding challenges on LeetCode & SkillRack',
              'Built production-ready full-stack projects',
              'Continuously learning and applying modern technologies',
            ].map((a, i) => (
              <li key={i}>
                <ChevronRight className="ach-icon" size={18} />
                {a}
              </li>
            ))}
          </ul>
        </div>
      </FadeUp>
    </div>
  </section>
)

/* ============================================================
   CONTACT
   ============================================================ */
const Contact = () => {
  const socials = [
    { icon: <Linkedin size={20} />, href: '#', label: 'LinkedIn' },
    { icon: <Github size={20} />, href: '#', label: 'GitHub' },
    { icon: <Instagram size={20} />, href: '#', label: 'Instagram' },
  ]

  return (
    <div className="alt-bg section-full" id="contact">
      <div className="section-inner" style={{ padding: '130px 24px' }}>
        <SectionTitle title="Get In Touch" subtitle="Have a project in mind? Let's talk." />
        <div className="contact-grid">
          <FadeLeft>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', marginBottom: '12px' }}>Email</p>
              <a href="mailto:yogeshrajanv@email.com" className="contact-email">
                yogeshrajanv@email.com
              </a>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', marginBottom: '16px' }}>Socials</p>
              <div className="social-row">
                {socials.map(s => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    className="social-btn"
                    aria-label={s.label}
                    whileHover={{ scale: 1.1, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  >
                    {s.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </FadeLeft>

          <FadeUp delay={0.15}>
            <form>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cf-name">Name</label>
                  <input id="cf-name" type="text" placeholder="Your Name" />
                </div>
                <div className="form-group">
                  <label htmlFor="cf-email">Email</label>
                  <input id="cf-email" type="email" placeholder="Email Address" />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="cf-msg">Message</label>
                <textarea id="cf-msg" placeholder="Your message…" />
              </div>
              <div className="form-footer">
                <motion.button
                  type="submit"
                  className="btn btn-primary"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  Send Message <Send size={18} />
                </motion.button>
              </div>
            </form>
          </FadeUp>
        </div>
      </div>
    </div>
  )
}



/* ============================================================
   APP ROOT
   ============================================================ */
export default function App() {
  const [route, setRoute] = useState(() => {
    const h = window.location.hash || ''
    const m = h.match(/^#\/projects\/(.+)$/)
    if (!m) return { type: 'home' }
    return { type: 'project', folder: decodeURIComponent(m[1]) }
  })

  useEffect(() => {
    const onHashChange = () => {
      const h = window.location.hash || ''
      const m = h.match(/^#\/projects\/(.+)$/)
      if (!m) return setRoute({ type: 'home' })
      setRoute({ type: 'project', folder: decodeURIComponent(m[1]) })
    }

    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const activeProject = route.type === 'project'
    ? projects.find((p) => p.folder === route.folder)
    : null

  const onBackToProjects = () => {
    window.location.hash = '#projects'
    let tries = 0
    const attemptScroll = () => {
      tries += 1
      const el = document.getElementById('projects')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
      if (tries < 20) setTimeout(attemptScroll, 30)
    }
    attemptScroll()
  }

  return (
    <div className="app-wrapper">
      {/* Fixed decorative layers */}
      <div className="grid-bg" aria-hidden="true" />
      <ParticleCanvas />

      {/* Site */}
      <Navbar />
      {route.type === 'project' ? (
        <ProjectDetail project={activeProject} onBack={onBackToProjects} />
      ) : (
        <>
          <Hero />
          <div className="divider" />
          <About />
          <div className="divider" />
          <Skills />
          <div className="divider" />
          <Projects />
          <div className="divider" />
          <Certificates />
          <div className="divider" />
          <Experience />
          <div className="divider" />
          <Contact />
        </>
      )}

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Yogesh Rajan V. All rights reserved.</p>
      </footer>
    </div>
  )
}
