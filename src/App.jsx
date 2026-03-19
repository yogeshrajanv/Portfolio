import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Github, Linkedin, Instagram, Mail, ExternalLink,
  Download, ChevronRight, Code2, Database, Monitor,
  Award, Send, ArrowRight, Menu, X, Terminal
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
            <img src="/assets/Y logo.svg" alt="Yogesh Rajan Logo" />
          </div>
          <span>YOGESH</span>
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
            Yogesh<br />Rajan
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
    title: 'Placement Intelligence Tracker',
    desc: 'A system that evaluates student performance using coding profiles, certificates, and skills, generating structured performance analytics.',
    tech: ['React', 'Firebase', 'Node.js'],
  },
  {
    num: '02',
    title: 'Health Tracking Dashboard',
    desc: 'A data-driven application visualizing health metrics like sleep, stress, and activity using interactive charts.',
    tech: ['React', 'Firebase'],
  },
  {
    num: '03',
    title: 'Personal Portfolio Website',
    desc: 'A responsive and minimal portfolio to showcase projects, skills, and achievements.',
    tech: ['HTML', 'CSS', 'JavaScript'],
  },
]

const Projects = () => (
  <section id="projects">
    {/* faint code decoration */}
    <div className="code-bg-decoration" aria-hidden="true">
      {`function build(app) {\n  return deploy(app);\n}\n\nconst result = build({\n  stack: "MERN",\n  ready: true\n});`}
    </div>
    <SectionTitle title="Featured Projects" />
    <div className="projects-grid">
      {projects.map((p, i) => (
        <FadeUp key={p.title} delay={i * 0.1}>
          <motion.div
            className="project-card"
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <div className="project-num">Project {p.num}</div>
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
            <div className="tech-tags">
              {p.tech.map(t => <span key={t} className="tech-tag">{t}</span>)}
            </div>
            <div className="project-links">
              <a href="#" className="project-link">
                <Github size={18} /> Code
              </a>
              <a href="#" className="project-link">
                <ExternalLink size={18} /> Live Demo
              </a>
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
   SPLASH SCREEN – Premium black, terminal + logo
   ============================================================ */
const SplashParticles = () => {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let id
    const N = 70
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    const dots = Array.from({ length: N }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.5 + 0.5,
    }))
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy
        if (d.x < 0 || d.x > canvas.width) d.vx *= -1
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1
      })
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 130) {
            ctx.beginPath()
            ctx.moveTo(dots[i].x, dots[i].y)
            ctx.lineTo(dots[j].x, dots[j].y)
            ctx.strokeStyle = `rgba(255,255,255,${0.07 * (1 - dist / 130)})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
        ctx.beginPath()
        ctx.arc(dots[i].x, dots[i].y, dots[i].r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,255,255,0.18)'
        ctx.fill()
      }
      id = requestAnimationFrame(tick)
    }
    tick()
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} id="splash-canvas" />
}

const TERMINAL_LINES = [
  { text: 'Initializing Portfolio...', delay: 400 },
  { text: 'Loading Components...', delay: 1050 },
  { text: 'Ready.', delay: 1700, highlight: true },
]

const SplashTerminal = () => {
  const [visibleLines, setVisibleLines] = useState([])

  useEffect(() => {
    TERMINAL_LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setVisibleLines(prev => [...prev, i])
      }, line.delay)
      return () => clearTimeout(t)
    })
  }, [])

  const activeIdx = visibleLines.length - 1

  return (
    <div className="splash-terminal">
      {TERMINAL_LINES.map((line, i) => (
        visibleLines.includes(i) && (
          <motion.div
            key={i}
            className="splash-terminal-line"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <span className="splash-terminal-prompt">{'>'}</span>
            <span className={`splash-terminal-text ${i < activeIdx || (line.highlight && visibleLines.includes(i)) ? 'done' : ''}`}>
              {line.text}
            </span>
            {i === activeIdx && <span className="splash-terminal-cursor" />}
          </motion.div>
        )
      ))}
    </div>
  )
}

const Splash = ({ onDone }) => (
  <motion.div
    className="splash"
    initial={{ opacity: 1 }}
    animate={{ opacity: 0 }}
    transition={{ duration: 0.9, delay: 3.1, ease: 'easeInOut' }}
    onAnimationComplete={onDone}
  >
    <SplashParticles />

    <div className="splash-center">
      {/* Logo */}
      <motion.div
        className="splash-logo-wrap"
        initial={{ scale: 0.75, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.85, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <div className="splash-logo-glow" />
        <motion.img
          src="/assets/Y logo.svg"
          alt="Yogesh Rajan"
          className="splash-logo-img"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Terminal lines */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <SplashTerminal />
      </motion.div>

      {/* Progress bar */}
      <motion.div
        className="splash-bar"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        style={{ transformOrigin: 'left' }}
        transition={{ delay: 0.35, duration: 0.4 }}
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
            <p>© {new Date().getFullYear()} Yogesh Rajan. All rights reserved.</p>
          </footer>
        </motion.div>
      )}
    </>
  )
}
