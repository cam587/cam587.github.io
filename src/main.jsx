import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { profile, projects, experiences } from './content';
import './styles.css';

const sections = ['home', 'about', 'projects', 'experience', 'contact'];

function Arrow({ diagonal = false, ...props }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" {...props}><path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h15m-6-6 6 6-6 6'} /></svg>;
}

function WaveMark() {
  return <svg viewBox="0 0 38 28" fill="none" aria-hidden="true"><path d="M2 10c6-9 11 9 17 0s11 9 17 0M2 19c6-9 11 9 17 0s11 9 17 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
}

const shorelinePaths = [
  'M1250-80C1320 18 1455 9 1435 105S1288 188 1355 273 1514 310 1425 390 1290 470 1368 548 1487 625 1426 700 1250 787 1302 863 1345 926 1220 1040',
  'M1292-90C1365 12 1500 25 1474 117S1335 207 1396 282 1540 318 1450 407 1322 478 1395 557 1506 636 1441 714 1285 800 1337 878 1380 944 1252 1050',
  'M1208-82C1275 18 1410 0 1390 100S1245 176 1312 265 1465 300 1378 381 1248 452 1320 540 1443 613 1386 686 1210 771 1264 847 1305 910 1184 1030',
];

function WaveScene() {
  const waves = shorelinePaths.map((path, index) => <path key={index} className={`breaker breaker-${['one', 'two', 'three'][index]}`} d={path}/>);
  return <div className="wave-scene" aria-hidden="true">
    <svg className="shore-breakers shore-breakers-wide" viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid slice">{waves}</svg>
    <svg className="shore-breakers shore-breakers-mobile" viewBox="939 0 435 941" preserveAspectRatio="xMidYMid slice">{waves}</svg>
    <span className="sea-glimmer glimmer-one"/><span className="sea-glimmer glimmer-two"/><span className="sea-glimmer glimmer-three"/>
  </div>;
}

function App() {
  const [active, setActive] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const busy = useRef(false);
  const timers = useRef([]);
  const menuButton = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: '-20% 0px -55% 0px', threshold: 0 });
    sections.forEach(id => observer.observe(document.getElementById(id)));
    return () => { observer.disconnect(); timers.current.forEach(clearTimeout); };
  }, []);

  useEffect(() => {
    function escape(event) {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    }
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, [menuOpen]);

  function navigate(event, id) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button > 0) return;
    event.preventDefault();
    if (busy.current) return;
    setMenuOpen(false);
    const move = () => {
      const target = document.getElementById(id);
      target.scrollIntoView({ behavior: 'instant', block: 'start' });
      target.focus({ preventScroll: true });
      setActive(id);
      if (location.hash !== `#${id}`) history.pushState(null, '', `#${id}`);
    };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { move(); return; }
    busy.current = true;
    setTransitioning(true);
    timers.current = [setTimeout(move, 460), setTimeout(() => { setTransitioning(false); busy.current = false; }, 1050)];
  }

  const sectionLink = (id) => ({ href: `#${id}`, onClick: event => navigate(event, id) });

  return <>
    <a className="skip-link" href="#about">Skip to content</a>
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" aria-label="Colin Mendoza, home" {...sectionLink('home')}><WaveMark/><span>colin<span className="gold">.</span></span></a>
        <button ref={menuButton} className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Close' : 'Menu'}<span aria-hidden="true">{menuOpen ? '−' : '+'}</span></button>
        <nav id="main-navigation" aria-label="Main navigation" className={menuOpen ? 'navigation is-open' : 'navigation'}>
          {['about', 'projects', 'experience'].map(id => <a key={id} className={active === id ? 'nav-link active' : 'nav-link'} aria-current={active === id ? 'location' : undefined} {...sectionLink(id)}>{id[0].toUpperCase() + id.slice(1)}</a>)}
          <a className="nav-contact" {...sectionLink('contact')}>Let’s connect <Arrow diagonal/></a>
        </nav>
      </div>
    </header>

    <main>
      <section id="home" className="hero section-target" tabIndex="-1" aria-labelledby="hero-heading">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span className="little-line"/> A WORK IN PROGRESS. JUST LIKE ME.</div>
            <h1 id="hero-heading">Hi, I’m Colin<span className="gold">.</span><br/><span className="soft-heading">Exploring what’s</span><br/><em>on the horizon.</em></h1>
            <p className="hero-description">An Information Science sophomore at Cornell University. Welcome to my little corner of the internet.</p>
            <div className="hero-actions"><a className="button button-gold" {...sectionLink('projects')}>Explore my work <Arrow/></a><a className="text-link" {...sectionLink('about')}>A little about me <Arrow diagonal/></a></div>
            <div className="hero-location"><span className="location-dot"/>{profile.university}<span className="location-divider">/</span>{profile.location}</div>
          </div>
        <WaveScene />
        </div>
        <div className="container hero-bottom"><span>INFORMATION SCIENCE · CORNELL UNIVERSITY</span><a {...sectionLink('about')}>Scroll to explore <span aria-hidden="true">↓</span></a><span className="edition">PORTFOLIO / 01</span></div>
      </section>

      <section id="about" className="about section-target" tabIndex="-1" aria-labelledby="about-heading">
        <div className="container section-grid">
          <div><div className="eyebrow dark-eyebrow">01 / THE PERSON BEHIND THE SCREEN</div><h2 id="about-heading">A little<br/>about <em>me.</em></h2><div className="mini-sea" aria-hidden="true"><span/><WaveMark/></div></div>
          <div className="about-copy"><h3>Colin Mendoza.<br/><span>A new chapter at Cornell.</span></h3><p>I’m a sophomore studying Information Science at Cornell University in Ithaca, New York.</p><p className={profile.bio ? '' : 'placeholder-copy'}>{profile.bio || 'More of my story is coming soon. This space will hold the things I’m curious about, what motivates me, and what I enjoy beyond the classroom.'}</p>
            <div className="about-facts"><div><span className="detail-label">CURRENTLY</span><strong>{profile.year}</strong></div><div><span className="detail-label">STUDYING</span><strong>{profile.field}</strong></div></div>
            <div className="interests"><span className="detail-label">A FEW THINGS I’M INTO</span><div className="tags">{profile.interests.length ? profile.interests.map(item => <span key={item}>{item}</span>) : <span className="empty-tag">Interests coming soon</span>}</div></div>
          </div>
        </div>
      </section>

      <section id="projects" className="projects section-target" tabIndex="-1" aria-labelledby="projects-heading">
        <div className="container">
          <div className="section-top"><div><div className="eyebrow dark-eyebrow">02 / IDEAS TAKING SHAPE</div><h2 id="projects-heading">The next <em>wave.</em></h2></div><p>A home for the things I build,<br/>explore, and bring to life.</p></div>
          <div className="project-grid">{(projects.length ? projects : [{ placeholder: true }, { placeholder: true }, { placeholder: true }]).map((project, index) => <article className={`project-card project-${index % 3}`} key={project.title || index}>
            <div className="project-art">{project.image ? <img src={project.image} alt={project.title} loading="lazy"/> : <div className="project-shape" aria-hidden="true"><span/><span/><span/></div>}<span className="project-number">0{index + 1}</span>{project.placeholder && <span className="coming-badge">ON THE HORIZON</span>}</div>
            <div className="project-info"><div className="detail-label">{project.category || 'PROJECT SPACE'}</div><h3>{project.title || 'Something good is coming.'}</h3><p>{project.description || 'A future project will live here. Check back for the story, the process, and the details.'}</p>{project.tags?.length > 0 && <div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>}{project.url ? <a className="project-link" href={project.url} target="_blank" rel="noreferrer">View project <Arrow diagonal/></a> : <span className="project-status">{project.placeholder ? 'Stay tuned' : 'Project details coming soon'} <span aria-hidden="true">↗</span></span>}</div>
          </article>)}</div>
        </div>
      </section>

      <section id="experience" className="experience section-target" tabIndex="-1" aria-labelledby="experience-heading"><div className="container section-grid"><div><div className="eyebrow dark-eyebrow">03 / LEARNING ALONG THE WAY</div><h2 id="experience-heading">Every tide.<br/>A new <em>chapter.</em></h2><p className="section-intro">My education, experiences, and the skills I pick up along the way.</p>{profile.resume && <a className="text-link dark-link" href={profile.resume} target="_blank" rel="noreferrer">View my résumé <Arrow diagonal/></a>}</div><div className="journey"><article className="journey-entry"><span className="timeline-dot"/><div className="detail-label">EDUCATION · CURRENT</div><h3>{profile.university}</h3><p>{profile.field}</p><span className="journey-meta">{profile.year} · {profile.location}</span></article>{experiences.map((item, index) => <article className="journey-entry" key={index}><span className="timeline-dot"/><div className="detail-label">{item.period}</div><h3>{item.role}</h3><p>{item.organization}</p><p className="journey-meta">{item.description}</p></article>)}{!experiences.length && <article className="journey-entry muted-entry"><span className="timeline-dot"/><div className="detail-label">EXPERIENCE</div><h3>More chapters to come.</h3><p>Future roles, collaborations, and milestones will appear here.</p></article>}<div className="skills-block"><span className="detail-label">MY TOOLKIT</span><div className="tags">{profile.skills.length ? profile.skills.map(skill => <span key={skill}>{skill}</span>) : <span className="empty-tag">Skills coming soon</span>}</div></div></div></div></section>

      <section id="contact" className="contact section-target" tabIndex="-1" aria-labelledby="contact-heading"><svg className="contact-wave" viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 45Q360 120 720 45T1440 45V100H0Z" fill="#111c35"/></svg><div className="container contact-inner"><div className="eyebrow">04 / GOOD THINGS START WITH A HELLO</div><h2 id="contact-heading">Let’s make<br/><em>some waves.</em><span className="gold"> ✳</span></h2><p>Have an idea, a question, or just want to say hi?<br/>I’d love to hear from you.</p>{profile.email ? <a className="button button-gold" href={`mailto:${profile.email}`}>Say hello <Arrow diagonal/></a> : <div className="contact-placeholder"><span className="location-dot"/>Contact details coming soon</div>}<div className="social-links">{profile.github && <a href={profile.github} target="_blank" rel="noreferrer">GitHub <Arrow diagonal/></a>}{profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <Arrow diagonal/></a>}{profile.email && <a href={`mailto:${profile.email}`}>Email <Arrow diagonal/></a>}</div></div><footer className="container footer"><a className="brand" {...sectionLink('home')}><WaveMark/><span>colin<span className="gold">.</span></span></a><span>© {new Date().getFullYear()} Colin Mendoza</span><a className="back-top" {...sectionLink('home')}>Back to the surface <span aria-hidden="true">↑</span></a></footer></section>
    </main>
    <div className={`wave-transition${transitioning ? ' is-running' : ''}`} aria-hidden="true"><div className="transition-water"><svg viewBox="0 0 1440 220" preserveAspectRatio="none"><path d="M0 100Q360-60 720 100T1440 100V220H0Z" fill="currentColor"/></svg><WaveMark/></div></div>
  </>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
