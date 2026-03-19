import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Github, Linkedin, Instagram, Mail, ExternalLink,
  Download, ChevronRight, Code2, Database, Monitor,
  Award, Send, ArrowRight, Menu, X, Terminal
} from 'lucide-react'

/* ============================================================
   Y LOGO — inline white SVG (actual letterform paths, no background box)
   ============================================================ */
const YLogoWhite = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Left arm + stem */}
    <path fill="white" d="M188.592957,167.174133 C179.844940,167.130692 171.096786,167.050507 162.349121,167.088135 C161.195602,167.093094 160.044678,167.699631 158.326981,168.366837 C158.160690,169.514786 157.419662,171.147629 157.916306,171.736252 C163.349976,178.176239 168.806595,184.614456 174.597900,190.730347 C180.740921,197.217682 187.404968,203.210770 193.567719,209.680481 C204.185654,220.827240 214.770233,232.017014 225.000961,243.516006 C229.263062,248.306458 235.122971,252.414139 235.032471,260.923279 C235.021027,284.304565 234.988068,307.685883 235.042740,331.067017 C235.046738,332.771057 235.686249,334.473633 236.515686,336.524811 C246.824585,330.950256 257.183624,325.464630 267.390228,319.708618 C268.983826,318.809906 269.883057,316.679932 271.497162,314.822906 C271.749725,314.581665 271.874023,314.286438 271.943329,313.303162 C271.965027,312.878265 271.986725,312.453339 272.010956,311.085114 C272.008911,293.039856 272.006897,274.994568 271.974518,256.208405 C268.216919,250.857651 264.972778,245.040604 260.611298,240.238297 C243.354813,221.237503 225.896210,202.413620 208.186356,183.835068 C202.472107,177.840515 197.916168,170.163467 188.592957,167.174133 z" />
    {/* Right arm */}
    <path fill="white" d="M312.359406,168.002945 C309.467560,169.758316 306.086487,171.027496 303.771820,173.356476 C295.480682,181.698959 287.568817,190.417526 279.478668,198.960861 C272.244568,206.600159 264.977997,214.208847 257.696289,221.802795 C255.573990,224.016113 255.536560,226.018951 257.708618,228.287888 C262.067749,232.841370 266.265289,237.549194 270.594025,242.132385 C271.910034,243.525772 273.437500,244.719482 276.013794,247.033829 C280.189728,242.313370 283.959595,237.909821 287.882141,233.646744 C296.708801,224.053833 305.590027,214.510773 314.488281,204.984116 C324.442047,194.327438 334.500702,183.767212 344.306152,172.976410 C345.132446,172.067108 344.387421,169.729965 343.885162,167.274796 C335.133820,167.185318 326.382477,167.049133 317.631134,167.051178 C316.128815,167.051529 314.626617,167.640762 312.359406,168.002945 z" />
    {/* Junction connector */}
    <path fill="white" d="M246.435791,217.007721 C247.639404,218.009857 248.843018,219.011978 250.248123,220.181870 C251.729065,218.207977 252.631699,216.564438 253.937653,215.357208 C256.544159,212.947800 255.979416,210.677933 253.918030,208.482620 C242.323044,196.134308 230.800797,183.713837 218.997742,171.566711 C214.357758,166.791473 208.345490,167.479950 201.587204,168.698654 C216.768005,185.052231 231.362793,200.774506 246.435791,217.007721 z" />
  </svg>
)

/* ============================================================
   PARTICLE CANVAS – floating dots + connecting lines
   ============================================================ */
const ParticleCanvas = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    const DOTS = 48
    const MAX_DIST = 140

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
            ctx.strokeStyle = `rgba(0,0,0,${0.06 * (1 - dist / MAX_DIST)})`
            ctx.lineWidth = 0.7
            ctx.stroke()
          }
        }
        ctx.beginPath()
        ctx.arc(dots[i].x, dots[i].y, dots[i].r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0,0,0,0.1)'
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
          <div className="nav-logo-mark">
            <YLogoWhite size={26} />
          </div>
          <span>V YOGESH RAJN</span>
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
    'Software Engineer',
    'Full Stack Developer',
    'React Developer',
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
      {/* Watermark */}
      <div className="hero-watermark" aria-hidden="true">Y</div>

      <div className="hero-inner">
        {/* Left: Content */}
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

          <motion.h1 variants={stagger.item} className="hero-name">
            V Yogesh<br />Rajn
          </motion.h1>

          <motion.div variants={stagger.item} className="hero-role">
            {role}
            <span className="typing-cursor" aria-hidden="true" />
          </motion.div>

          <motion.p variants={stagger.item} className="hero-summary">
            "I design and build scalable, efficient, and user-focused web applications using modern technologies."
          </motion.p>

          <motion.p variants={stagger.item} className="hero-intro">
            A passionate CS Engineering student specialising in full-stack development. I write clean, maintainable code and build apps that solve real-world problems.
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

        {/* Right: Code Card */}
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, x: 50, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero-code-card">
            <div className="code-dots">
              <span className="code-dot" />
              <span className="code-dot" />
              <span className="code-dot" />
            </div>
            <code>
              <span className="code-line"><span className="code-comment">// portfolio.js</span></span>
              <span className="code-line">&nbsp;</span>
              <span className="code-line"><span className="code-keyword">const</span> <span className="code-fn">developer</span> = {'{'}</span>
              <span className="code-line">&nbsp;&nbsp;name: <span className="code-str">"Yogesh Rajan"</span>,</span>
              <span className="code-line">&nbsp;&nbsp;role: <span className="code-str">"Full Stack Dev"</span>,</span>
              <span className="code-line">&nbsp;&nbsp;skills: [</span>
              <span className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-str">"React"</span>, <span className="code-str">"Node.js"</span>,</span>
              <span className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-str">"Firebase"</span>, <span className="code-str">"Python"</span></span>
              <span className="code-line">&nbsp;&nbsp;],</span>
              <span className="code-line">&nbsp;&nbsp;available: <span className="code-keyword">true</span></span>
              <span className="code-line">{'}'}</span>
              <span className="code-line">&nbsp;</span>
              <span className="code-line"><span className="code-fn">build</span>(developer) <span className="code-comment">// 🚀</span></span>
            </code>
          </div>
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
      <FadeUp delay={0.15} className="stats-grid">
        {[
          { num: '3+', label: 'Projects Completed' },
          { num: '100+', label: 'Coding Problems' },
          { num: '4+', label: 'Certifications' },
          { num: '2+', label: 'Years Learning' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            className="stat-box"
            initial={{ opacity: 0, scale: 0.88 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3>{s.num}</h3>
            <p>{s.label}</p>
          </motion.div>
        ))}
      </FadeUp>
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
  ]

  return (
    <div className="alt-bg section-full">
      <div className="section-inner" style={{ padding: '130px 24px' }}>
        <SectionTitle title="Technical Skills" />
        <div className="skills-grid">
          {data.map((s, i) => (
            <FadeUp key={s.cat} delay={i * 0.1}>
              <motion.div
                className="skill-card"
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
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
          ))}
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
    tech: ['Flutter', 'SQL Server', 'Twilio', 'Raspberry Pi', 'Thermal Printer'],
    features: [
      'Digital ordering & payment flow',
      'QR/visual bill verification via Raspberry Pi',
      'Automated thermal receipt printing',
      'SMS order notifications via Twilio',
    ],
    role: 'Frontend Developer & DB Management',
    badge: null,
  },
  {
    num: '02',
    title: 'Real-Time Bus Tracking System',
    tagline: 'Track buses live — no expensive GPS hardware needed',
    desc: 'Web app that lets students track college buses in real-time. Drivers share live location via mobile; students see bus positions and ETAs on an interactive map.',
    tech: ['Firebase', 'Google Maps API', 'Leaflet', 'HTML', 'CSS'],
    features: [
      'Live bus tracking via mobile location sharing',
      'Real-time sync with Firebase Realtime Database',
      'Interactive map with ETA display',
      'Lightweight, cost-effective architecture',
    ],
    role: 'Frontend Developer — Maps & UI/UX',
    badge: '🏆 Freshathon Hackathon',
  },
  {
    num: '03',
    title: 'Elementrixx — IoT Water Quality Monitor',
    tagline: 'Prevent water contamination at the source using real-time IoT monitoring',
    desc: 'IoT system that monitors contamination levels in water bodies via ESP32 sensors. Data is transmitted through MQTT, analyzed in real-time, and alerts locals automatically in native languages.',
    tech: ['ESP32', 'MQTT', 'Firebase', 'SMS Alert System'],
    features: [
      'Real-time sensor data via MQTT protocol',
      'Multilingual automated SMS alerts for locals',
      'Smart auto-deletion for data management',
      'Live contamination monitoring dashboard',
    ],
    role: 'Backend Developer & IoT Engineer',
    badge: null,
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
          <motion.div
            className="project-card"
            whileHover={{ y: -7, boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}
            transition={{ type: 'spring', stiffness: 240, damping: 22 }}
          >
            {/* Header row */}
            <div className="pc-header">
              <span className="project-num">Project {p.num}</span>
              {p.badge && <span className="pc-badge">{p.badge}</span>}
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
        </FadeUp>
      ))}
    </div>
  </section>
)


/* ============================================================
   CERTIFICATES
   ============================================================ */
const certs = [
  { name: 'Full Stack Web Development', issuer: 'Coursera' },
  { name: 'Data Structures & Algorithms', issuer: 'Udemy' },
  { name: 'Python Programming', issuer: 'HackerRank' },
  { name: 'React Development', issuer: 'freeCodeCamp' },
]

const Certificates = () => (
  <div className="alt-bg section-full" id="certificates">
    <div className="section-inner" style={{ padding: '130px 24px' }}>
      <SectionTitle title="Certificates & Courses" />
      <div className="cert-grid">
        {certs.map((c, i) => (
          <FadeUp key={c.name} delay={i * 0.1}>
            <motion.div
              className="cert-card"
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Award className="cert-icon" size={30} />
              <h3>{c.name}</h3>
              <p>{c.issuer}</p>
            </motion.div>
          </FadeUp>
        ))}
      </div>
    </div>
  </div>
)

/* ============================================================
   EXPERIENCE
   ============================================================ */
const Experience = () => (
  <section id="experience">
    <SectionTitle title="Experience" />
    <div className="exp-timeline">
      <div className="exp-dot" />
      <FadeUp>
        <div className="exp-label">Present</div>
        <h3>Software Development</h3>
        <p className="exp-sub">Academic / Self Projects</p>
        <p className="exp-desc">
          Worked on full-stack applications focusing on performance, clean architecture, and user experience. Gained experience in API integration, database handling, and responsive UI design.
        </p>
      </FadeUp>
      <FadeUp delay={0.15}>
        <div className="achievements-box">
          <h4>Achievements</h4>
          <ul className="achievements-list">
            {[
              'Solved coding challenges on LeetCode & HackerRank',
              'Built multiple production-ready full-stack projects',
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
              <a href="mailto:yogeshrajan@email.com" className="contact-email">
                yogeshrajan@email.com
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
   SPLASH: Code-Rain Canvas (matrix falling characters)
   ============================================================ */
const SplashCodeRain = () => {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let id, frame = 0
    const CHARS = '01{}[]<>/=;.|*+~&$@#!'
    const FS = 13, CW = 26
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    let cols = Math.floor(canvas.width / CW)
    let heads = Array.from({ length: cols }, () => -Math.floor(Math.random() * 40))
    const tick = () => {
      frame++
      if (frame % 2 === 0) {
        ctx.fillStyle = 'rgba(0,0,0,0.07)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.font = `${FS}px "JetBrains Mono", monospace`
        cols = Math.floor(canvas.width / CW)
        if (heads.length !== cols) heads = Array.from({ length: cols }, () => -Math.floor(Math.random() * 40))
        heads.forEach((y, i) => {
          if (y < 0) { heads[i]++; return }
          const char = CHARS[Math.floor(Math.random() * CHARS.length)]
          const x = i * CW
          ctx.fillStyle = 'rgba(255,255,255,0.75)'
          ctx.fillText(char, x, y * FS)
          if (y * FS > canvas.height && Math.random() > 0.978) heads[i] = -Math.floor(Math.random() * 30)
          else heads[i]++
        })
      }
      id = requestAnimationFrame(tick)
    }
    tick()
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} id="splash-canvas" style={{ opacity: 0.18 }} />
}

/* ============================================================
   SPLASH: Terminal text sequence
   ============================================================ */
const TERMINAL_LINES = [
  { text: 'Initializing Portfolio...', delay: 500 },
  { text: 'Loading Components...', delay: 1150 },
  { text: 'Compiling assets...', delay: 1800 },
  { text: 'Ready.', delay: 2300, highlight: true },
]

const SplashTerminal = () => {
  const [visibleLines, setVisibleLines] = useState([])
  useEffect(() => {
    const timers = TERMINAL_LINES.map((line, i) =>
      setTimeout(() => setVisibleLines(prev => [...prev, i]), line.delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [])
  const activeIdx = visibleLines.length - 1
  return (
    <div className="splash-terminal">
      {TERMINAL_LINES.map((line, i) =>
        visibleLines.includes(i) && (
          <motion.div
            key={i} className="splash-terminal-line"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <span className="splash-terminal-prompt">{'>'}</span>
            <span className={`splash-terminal-text${i < activeIdx || line.highlight ? ' done' : ''}`}>
              {line.text}
            </span>
            {i === activeIdx && <span className="splash-terminal-cursor" />}
          </motion.div>
        )
      )}
    </div>
  )
}

/* ============================================================
   SPLASH SCREEN – Black + code rain + white Y logo + brackets
   ============================================================ */
const Splash = ({ onDone }) => (
  <motion.div
    className="splash"
    initial={{ opacity: 1 }}
    animate={{ opacity: 0 }}
    transition={{ duration: 1.0, delay: 4.0, ease: 'easeInOut' }}
    onAnimationComplete={onDone}
  >
    {/* Code-rain background */}
    <SplashCodeRain />

    <div className="splash-center">
      {/* Coding-bracket row: <  [LOGO]  /> */}
      <div className="splash-bracket-row">
        <motion.span
          className="splash-bracket"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {'<'}
        </motion.span>

        {/* Logo with scan line */}
        <motion.div
          className="splash-logo-wrap"
          initial={{ scale: 0.72, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div className="splash-logo-glow" />
          <div className="splash-scan-line" />
          <motion.div
            animate={{ scale: [1, 1.045, 1] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <YLogoWhite size={110} />
          </motion.div>
        </motion.div>

        <motion.span
          className="splash-bracket"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {'/>'}
        </motion.span>
      </div>

      {/* Terminal */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <SplashTerminal />
      </motion.div>

      {/* Progress bar */}
      <motion.div
        className="splash-bar"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        style={{ transformOrigin: 'left' }}
        transition={{ delay: 0.45, duration: 0.5 }}
      >
        <div className="splash-progress" />
      </motion.div>
    </div>
  </motion.div>
)

/* ============================================================
   APP ROOT
   ============================================================ */
export default function App() {
  const [ready, setReady] = useState(false)

  return (
    <>
      <AnimatePresence>
        {!ready && <Splash onDone={() => setReady(true)} />}
      </AnimatePresence>

      {ready && (
        <motion.div
          className="app-wrapper"
          initial={{ opacity: 0, filter: 'blur(12px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Fixed decorative layers */}
          <div className="grid-bg" aria-hidden="true" />
          <ParticleCanvas />

          {/* Site */}
          <Navbar />
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

          <footer className="site-footer">
            <p>© {new Date().getFullYear()} V Yogesh Rajn. All rights reserved.</p>
          </footer>
        </motion.div>
      )}
    </>
  )
}
