import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Github, Linkedin, Instagram, Mail, ExternalLink,
  Download, ChevronRight, ChevronLeft, Code2, Database, Monitor,
  Award, Send, ArrowRight, Menu, X, Terminal, FileText,
  Utensils, BusFront, Droplets, GitPullRequest
} from 'lucide-react'

/* ============================================================
   Y LOGO — inline white SVG
   ============================================================ */
const paths = [
  "M188.592957,167.174133 C179.844940,167.130692 171.096786,167.050507 162.349121,167.088135 C161.195602,167.093094 160.044678,167.699631 158.326981,168.366837 C158.160690,169.514786 157.419662,171.147629 157.916306,171.736252 C163.349976,178.176239 168.806595,184.614456 174.597900,190.730347 C180.740921,197.217682 187.404968,203.210770 193.567719,209.680481 C204.185654,220.827240 214.770233,232.017014 225.000961,243.516006 C229.263062,248.306458 235.122971,252.414139 235.032471,260.923279 C235.021027,284.304565 234.988068,307.685883 235.042740,331.067017 C235.046738,332.771057 235.686249,334.473633 236.515686,336.524811 C246.824585,330.950256 257.183624,325.464630 267.390228,319.708618 C268.983826,318.809906 269.883057,316.679932 271.497162,314.822906 C271.749725,314.581665 271.874023,314.286438 271.943329,313.303162 C271.965027,312.878265 271.986725,312.453339 272.010956,311.085114 C272.008911,293.039856 272.006897,274.994568 271.974518,256.208405 C268.216919,250.857651 264.972778,245.040604 260.611298,240.238297 C243.354813,221.237503 225.896210,202.413620 208.186356,183.835068 C202.472107,177.840515 197.916168,170.163467 188.592957,167.174133 z",
  "M312.359406,168.002945 C309.467560,169.758316 306.086487,171.027496 303.771820,173.356476 C295.480682,181.698959 287.568817,190.417526 279.478668,198.960861 C272.244568,206.600159 264.977997,214.208847 257.696289,221.802795 C255.573990,224.016113 255.536560,226.018951 257.708618,228.287888 C262.067749,232.841370 266.265289,237.549194 270.594025,242.132385 C271.910034,243.525772 273.437500,244.719482 276.013794,247.033829 C280.189728,242.313370 283.959595,237.909821 287.882141,233.646744 C296.708801,224.053833 305.590027,214.510773 314.488281,204.984116 C324.442047,194.327438 334.500702,183.767212 344.306152,172.976410 C345.132446,172.067108 344.387421,169.729965 343.885162,167.274796 C335.133820,167.185318 326.382477,167.049133 317.631134,167.051178 C316.128815,167.051529 314.626617,167.640762 312.359406,168.002945 z",
  "M246.435791,217.007721 C247.639404,218.009857 248.843018,219.011978 250.248123,220.181870 C251.729065,218.207977 252.631699,216.564438 253.937653,215.357208 C256.544159,212.947800 255.979416,210.677933 253.918030,208.482620 C242.323044,196.134308 230.800797,183.713837 218.997742,171.566711 C214.357758,166.791473 208.345490,167.479950 201.587204,168.698654 C216.768005,185.052231 231.362793,200.774506 246.435791,217.007721 z"
]

const YLogoWhite = ({ size = 120, animateDraw = false }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      {paths.map((d, i) => (
        <path 
          key={i} 
          d={d} 
          className={animateDraw ? "splash-draw-path" : ""}
          fill={animateDraw ? "transparent" : "white"}
        />
      ))}
    </svg>
  )
}

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
          <div className="nav-logo-mark">
            <YLogoWhite size={26} />
          </div>
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
              <span className="code-line"><span className="code-comment">// App.jsx</span></span>
              <span className="code-line">&nbsp;</span>
              <span className="code-line"><span className="code-keyword">export default function</span> <span className="code-fn">Portfolio</span>() {'{'}</span>
              <span className="code-line">&nbsp;&nbsp;<span className="code-keyword">return</span> (</span>
              <span className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="code-fn">Developer</span></span>
              <span className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name=<span className="code-str">"Yogesh Rajan V"</span></span>
              <span className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;role=<span className="code-str">"Full Stack Engineer"</span></span>
              <span className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;skills={`{['React', 'Node', 'IoT']}`}</span>
              <span className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;/&gt;</span>
              <span className="code-line">&nbsp;&nbsp;)</span>
              <span className="code-line">{'}'}</span>
              <span className="code-line">&nbsp;</span>
              <span className="code-line"><span className="code-comment">/* Code beautifully to build beautifully. */</span></span>
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

      {/* Right side: Math-Code Hybrid Card */}
      <FadeUp delay={0.15} className="about-visual-container">
        <motion.div 
          className="math-code-card"
          whileHover={{ rotateY: 5, rotateX: -5, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <div className="card-symbols" aria-hidden="true">
            <span className="symbol symb-1">∑</span>
            <span className="symbol symb-2">∫</span>
            <span className="symbol symb-3">λ</span>
            <span className="symbol symb-4">π</span>
            <span className="symbol symb-5">δ</span>
            <span className="symbol symb-6">√</span>
          </div>
          <div className="card-content">
            <div className="card-header">
              <span className="dot dot-red" />
              <span className="dot dot-yellow" />
              <span className="dot dot-green" />
              <span className="header-filename">algorithm_logic.py</span>
            </div>
            <div className="card-body">
              <pre>
                <code>
                  <span className="keyword">def</span> <span className="function">analyze_impact</span>(code, passion):<br/>
                  &nbsp;&nbsp;<span className="comment"># Calculus of Innovation</span><br/>
                  &nbsp;&nbsp;result = ∫(passion * ∂(code)/∂t) dt<br/>
                  &nbsp;&nbsp;<span className="keyword">return</span> <span className="string">"Impactful Software"</span><br/>
                  <br/>
                  <span className="comment"># Summing up years of growth</span><br/>
                  growth = ∑(learning_day <span className="keyword">for</span> day <span className="keyword">in</span> years)
                </code>
              </pre>
            </div>
          </div>
          <div className="card-shimmer" />
        </motion.div>
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
    <div className="alt-bg section-full" id="skills">
      <div className="section-inner" style={{ padding: '130px 24px' }}>
        <SectionTitle title="Technical Skills" />
        <div className="skills-grid">
          {data.map((s, i) => {
            const symbols = {
              'Frontend': '</>',
              'Backend': '>_',
              'Database': '{}'
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

        {/* Database Schema Hybrid Card at the bottom */}
        <div className="skills-bottom-grid">
          <FadeUp delay={0.3} className="about-visual-container skills-mongo-left">
            <motion.div
              className="math-code-card mongo-card"
              whileHover={{ rotateY: -3, rotateX: 3, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <div className="card-symbols" aria-hidden="true">
                <span className="symbol database-symb symb-1">FILTER</span>
                <span className="symbol database-symb symb-2">MAP</span>
                <span className="symbol database-symb symb-3">REDUCE</span>
              </div>
              <div className="card-content">
                <div className="card-header">
                  <span className="dot dot-red" />
                  <span className="dot dot-yellow" />
                  <span className="dot dot-green" />
                  <span className="header-filename">mongo_db_init.js</span>
                </div>
                <div className="card-body">
                  <pre>
                    <code>
                      <span className="keyword">db</span>.<span className="function">collection</span>(<span className="string">'impact'</span>).<span className="function">aggregate</span>([<br />
                      &nbsp;&nbsp;{'{'} <span className="keyword">$match</span>: {'{'} status: <span className="string">'scalable'</span> {'}'} {'}'},<br />
                      &nbsp;&nbsp;{'{'} <span className="keyword">$group</span>: {'{'} _id: <span className="string">'$passion'</span>, total: {'{'} <span className="keyword">$sum</span>: <span className="string">1</span> {'}'} {'}'} {'}'}<br />
                      ]);
                    </code>
                  </pre>
                </div>
              </div>
              <div className="card-shimmer" />
            </motion.div>
          </FadeUp>

          <FadeUp delay={0.45} className="skills-tools-card-wrap">
            <motion.div
              className="skill-card tools-card"
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="skill-icon-wrap" style={{ color: 'var(--text-1)' }}>
                <Code2 size={22} />
              </div>
              <h3>Tools</h3>

              <div className="tool-logos" aria-label="Tools used in projects">
                <div className="tool-logo-item">
                  <div className="tool-logo-icon">
                    <img src="/assets/vs-code_thumb.webp" alt="VS Code" loading="lazy" />
                  </div>
                  <div className="tool-logo-name">VS Code</div>
                </div>
                <div className="tool-logo-item">
                  <div className="tool-logo-icon">
                    <img src="/assets/github_PNG47.webp" alt="Git" loading="lazy" />
                  </div>
                  <div className="tool-logo-name">Git</div>
                </div>
                <div className="tool-logo-item">
                  <div className="tool-logo-icon">
                    <img src="/assets/microsoft-power-bi-logo.webp" alt="PowerBI" loading="lazy" />
                  </div>
                  <div className="tool-logo-name">Power BI</div>
                </div>
              </div>
            </motion.div>
          </FadeUp>
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
      'rit canteen.jpeg',
      'rit.jpeg',
      'WhatsApp Image 2026-03-20 at 11.38.26 AM.jpeg',
      'WhatsApp Image 2026-03-20 at 11.38.27 AM.jpeg',
      'WhatsApp Image 2026-03-20 at 11.38.28 .jpeg',
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
      'WhatsApp Image 2026-03-20 at 1.28.36 .jpeg',
      'WhatsApp Image 2026-03-20 at 1.28.36 P.jpeg',
      'WhatsApp Image 2026-03-20 at 1.28.36 PM.jpeg',
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
      'WhatsApp Image 2026-03-20 at 11..jpeg',
      'WhatsApp Image 2026-03-20 at 11.38..jpeg',
      'WhatsApp Image 2026-03-20 at 11.38.30 AM.jpeg',
      'WhatsApp Image 2026-03-20 at 11.38.31 AM.jpeg',
      'WhatsApp Image 2026-03-20 at 11.38.32 A.jpeg',
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
    icon: <Droplets size={40} className="project-corner-icon" />
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
    <section className="project-detail hero" aria-label={`${project.title} details`}>
      <div className="project-detail-inner hero-inner">
        <motion.div
          className="project-detail-left hero-content"
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

            {/* Terminal Creative Design Window Move */}
            <div className="about-terminal" style={{ marginTop: '48px' }}>
              <div className="term-header">
                <span className="term-dot get-red" />
                <span className="term-dot get-yellow" />
                <span className="term-dot get-green" />
              </div>
              <div className="term-body">
                <p className="term-cmd"><span>$</span> ./contact --target "Yogesh"</p>
                <p className="term-out">Resolving connection... [OK]</p>
                <p className="term-cmd"><span>$</span> status</p>
                <p className="term-out">" Available for new opportunities!"</p>
                <span className="term-cursor">_</span>
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
  { text: 'bootstrapping portfolio...', delay: 450 },
  { text: 'loading components...', delay: 1050 },
  { text: 'warming animations...', delay: 1650 },
  { text: 'ready.', delay: 2200, highlight: true },
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
   SPLASH SCREEN – Minimal coding SVG logo splash
   ============================================================ */
const SPLASH_CODE_BG = [
  { t: 'const', x: 10, y: 22, d: 0 },
  { t: '{', x: 22, y: 14, d: 120 },
  { t: '}', x: 78, y: 18, d: 220 },
  { t: 'useEffect', x: 68, y: 30, d: 320 },
  { t: 'return', x: 16, y: 44, d: 420 },
  { t: '=>', x: 84, y: 40, d: 520 },
  { t: '<div/>', x: 34, y: 24, d: 620 },
  { t: 'import', x: 56, y: 52, d: 720 },
  { t: 'export', x: 40, y: 64, d: 820 },
  { t: '$', x: 86, y: 64, d: 920 },
  { t: 'console.log', x: 14, y: 62, d: 1020 },
  { t: '[]', x: 60, y: 74, d: 1120 },
]

const Splash = ({ onDone }) => (
  <motion.div
    className="splash splash-minimal"
    initial={{ opacity: 1 }}
    animate={{ opacity: 0 }}
    transition={{ duration: 0.7, delay: 3.0, ease: 'easeInOut' }}
    onAnimationComplete={onDone}
  >
    <div className="splash-code-bg" aria-hidden="true">
      {SPLASH_CODE_BG.map((c, idx) => (
        <span
          // eslint-disable-next-line react/no-array-index-key
          key={idx}
          className="splash-code-char"
          style={{ left: `${c.x}%`, top: `${c.y}%`, animationDelay: `${c.d}ms` }}
        >
          {c.t}
        </span>
      ))}
    </div>

    <div className="splash-minimal-content">
      <motion.div
        className="splash-minimal-logo"
        initial={{ scale: 0.84, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <YLogoWhite size={175} animateDraw />
      </motion.div>

      <motion.div
        className="splash-minimal-progress"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.9, duration: 1.8, ease: 'easeOut' }}
      />
    </div>
  </motion.div>
)

/* ============================================================
   APP ROOT
   ============================================================ */
export default function App() {
  const [ready, setReady] = useState(false)
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
    // When switching pages we conditionally render sections; scroll needs to happen
    // after the `#projects` element is mounted.
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
        </motion.div>
      )}
    </>
  )
}
