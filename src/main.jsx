import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const PEOPLE = [
  {
    id: 'rendi-panca', name: 'Rendi Panca Wijanarko', role: 'CEO and my brother', accent: '#f6d58c',
    message: `Terima kasih telah memercayakan peran CTO / Tech Lead ke orang sepertiku. Aku akan selalu mengenang kesempatan, pelajaran, dan orang-orang yang aku temui di sini. Aku memohon maaf atas setiap momen di mana aku seharusnya bisa melakukan yang lebih baik.`,
    note: 'A much gratitude for the person who opened the door and my brothers in Christ.',
    labels: ['WHO YOU ARE', 'THE ORIGIN', 'YOUR DAYS AINT IT?', 'WHAT I LEARNED', 'SINCERE GRATITUDE'],
    images: [
      '/images/rendi-7.jpeg',
      '/images/rendi-6.jpeg',
      '/images/rendi-3.jpeg',
      '/images/rendi-5.jpeg',
      '/images/rendi-1.jpeg'
    ]
  },
  {
    id: 'putu-anggi', name: 'Putu Anggi Suryantari', role: 'CMO', accent: '#f5a9c0',
    message: `Terima kasih telah membimbing, menantang, dan membentuk diri aku selama ini. Anda lebih dari sekadar rekan satu tim; Anda sudah seperti kakak yang selalu membuat segalanya terasa lebih ringan.`,
    note: 'For the one who made the hard days a little easier.',
    labels: ['THE PERSONAS', '"OUR HOME"', 'THE HARD DAYS', 'THE BEGINNING', 'A FINAL NOTE'],
    images: [
      '/images/anggi-1.jpeg',
      '/images/anggi-6.jpeg',
      '/images/anggi-4.jpeg',
      '/images/anggi-7.jpeg',
      '/images/anggi-2.jpeg'
    ]
  },
  {
    id: 'rahayu-kartika', name: 'Rahayu Kartika Sari', role: 'Tech Bros/Sis', accent: '#8ec8ff',
    message: `Terima kasih telah menjadi rekan yang baik di Divisi Teknis—atas bantuan, diskusi, proses debugging, serta kehadiran Anda. Aku mohon maaf karena tidak selalu bisa menjadi sosok pemimpin teladan yang layak Anda dapatkan. Long live woman in Tech!`,
    note: 'For the person who was there in the trenches.',
    labels: ['WHO WE WERE', 'HAPPY BIRTHDAY', 'THE HARD DAYS', 'YOUR JOURNEYS END', 'A FINAL NOTE'],
    images: [
      '/images/rahayu-5.jpeg',
      '/images/rahayu-4.jpeg',
      '/images/rahayu-3.jpeg',
      '/images/rahayu-2.jpeg',
      '/images/rahayu-1.jpeg'
    ]
  },
  {
    id: 'adinda-aulia', name: 'Adinda Aulia Rahmawati', role: 'The Money Keeper', accent: '#b7e4c7',
    message: `Terima kasih telah membawa tawa, kehangatan, dan sedikit keriuhan ke dalam ruangan ini. Kehadiranmu memberikan dampak yang lebih besar daripada yang mungkin kamu sadari. Aku minta maaf atas segala hal yang pernah aku lakukan atau katakan yang membuat keadaan menjadi lebih sulit.`,
    note: 'For the person who kept the room alive.',
    labels: ['YOU ARE YOU!', 'WHAT WE BUILT', 'THE HARD DAYS', 'THE KEEPER', 'BIRTHDAY GIRLS'],
    images: [
      '/images/dinda-3.jpeg',
      '/images/dinda-4.jpeg',
      '/images/dinda-6.jpeg',
      '/images/dinda-2.jpeg',
      '/images/dinda-5.jpeg'
    ]
  }
];

const CARDS = [
  { label: 'THE BEGINNING' }, { label: 'THE PEOPLE' }, { label: 'THE JOURNEY' }, { label: 'THE LESSONS' }, { label: 'THE THANK YOU' }
];

const getPersonIndexFromPath = () => {
  const slug = window.location.pathname.replace(/^\//, '').replace(/\/$/, '').toLowerCase();
  const index = PEOPLE.findIndex((person) => person.id === slug);
  return index >= 0 ? index : 0;
};

function App() {
  const [personIndex, setPersonIndex] = useState(getPersonIndexFromPath);
  const [cardIndex, setCardIndex] = useState(2);
  const [selected, setSelected] = useState(null);
  const [playing, setPlaying] = useState(true);
  const [archive, setArchive] = useState(false);
  const [menu, setMenu] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState(null);
  const didDrag = useRef(false);
  const person = PEOPLE[personIndex];
  const labels = person.labels || CARDS.map(card => card.label);

  useEffect(() => {
    const onPopState = () => {
      setPersonIndex(getPersonIndexFromPath());
      setCardIndex(2);
      setSelected(null);
      setArchive(false);
      setMenu(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (!playing || selected !== null || archive) return undefined;
    const timer = window.setInterval(() => setCardIndex((i) => (i + 1) % CARDS.length), 4200);
    return () => window.clearInterval(timer);
  }, [playing, selected, archive]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setSelected(null); setArchive(false); setMenu(false);
      }
      if (event.key === 'ArrowRight') go(1);
      if (event.key === 'ArrowLeft') go(-1);
      if (event.key.toLowerCase() === 'i') openCurrentCard();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const navigateToPerson = (index) => {
    const next = PEOPLE[index];
    if (!next) return;
    window.history.pushState({}, '', `/${next.id}`);
    setPersonIndex(index);
    setCardIndex(2);
    setSelected(null);
    setArchive(false);
    setMenu(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const go = (direction) => setCardIndex((index) => (index + direction + CARDS.length) % CARDS.length);
  const openCurrentCard = () => { setSelected(cardIndex); setPlaying(false); };

  const handlePointerDown = (event) => { didDrag.current = false; setDragStart(event.clientX); };
  const handlePointerMove = (event) => {
    if (dragStart == null) return;
    if (Math.abs(event.clientX - dragStart) > 12) didDrag.current = true;
  };
  const handlePointerUp = (event) => {
    if (dragStart == null) return;
    const distance = event.clientX - dragStart;
    if (Math.abs(distance) > 45) go(distance < 0 ? 1 : -1);
    setDragStart(null);
    window.setTimeout(() => { didDrag.current = false; }, 0);
  };

  const handleCardClick = (index, isFront) => {
    if (didDrag.current) return;
    if (!isFront) setCardIndex(index);
    setSelected(index);
    setPlaying(false);
  };

  const updateMouse = (event) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    setMouse({ x: (event.clientX / window.innerWidth - 0.5) * 2, y: (event.clientY / window.innerHeight - 0.5) * 2 });
  };

  return (
    <main className="app" onMouseMove={updateMouse} style={{ '--mx': mouse.x, '--my': mouse.y, '--accent': person.accent }}>
      <div className="grain" />

      <header className="topbar">
        <img className="stage-logo" src="/icons/logo-flyhigh-outline.png" alt="Paper Stories" />
        <button className="brand" onClick={() => navigateToPerson(0)} aria-label="Go to the first letter"><span className="brand-dot"></span><span>Our Stories</span></button>
        <div className="top-actions">
          {/* <button className="icon-btn" aria-label="Choose a letter" onClick={() => setMenu((value) => !value)}>⊞</button> */}
          <button className="icon-btn info-button" aria-label="Open current note" onClick={openCurrentCard}>i</button>
          <button className="icon-btn" aria-label="Open people menu" onClick={() => setMenu((value) => !value)}>≡</button>
        </div>
      </header>

      <section className="heading">
        <div className="eyebrow">A little something for you</div>
        <h1>{person.name}</h1>
        <div className="subtitle">{person.role}</div>
      </section>

      {menu && <aside className="people-menu">
        <div className="menu-title">Choose a letter</div>
        {PEOPLE.map((p, i) => (
          <button key={p.id} className={i === personIndex ? 'active' : ''} onClick={() => navigateToPerson(i)}>
            <span>{String(i + 1).padStart(2, '0')}</span><strong>{p.name}</strong><small>{p.role}</small>
          </button>
        ))}
      </aside>}

      <section className="stage" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
        <div className="orbit-shadow" />
        <div className="stack" style={{ transform: `rotateX(${mouse.y * -1.2}deg) rotateY(${mouse.x * 2.3}deg)` }}>
          {CARDS.map((card, i) => {
            const offset = (i - cardIndex + CARDS.length) % CARDS.length;
            const normalized = offset <= 2 ? offset : offset - CARDS.length;
            const isFront = i === cardIndex;
            return (
              <article key={card.label} className={`paper-card ${isFront ? 'front' : ''}`}
                style={{ '--i': normalized, backgroundImage: `url(${person.images[i]})`, zIndex: 20 - Math.abs(normalized) }}
                onClick={() => handleCardClick(i, isFront)} role="button" tabIndex="0"
                aria-label={`Open ${card.label} note for ${person.name}`}
                onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') handleCardClick(i, isFront); }}>
                <div className="paper-inner"><div className="tape" />
                  <div className="paper-copy"><span>{labels[i]}</span>{isFront && <><strong>{person.name}</strong><em>for you</em></>}</div>
                  <div className="paper-number">0{i + 1}</div><div className="card-open-hint">tap to open</div>
                </div>
              </article>
            );
          })}
        </div>
        <div className="side-control left"><button aria-label="Previous card" onClick={() => go(-1)}>‹</button></div>
        <div className="side-control right"><button aria-label="Next card" onClick={() => go(1)}>›</button></div>
      </section>

      <nav className="bottom-nav" aria-label="Story controls">
        <button aria-label="Choose person" onClick={() => setMenu((value) => !value)}>•••</button>
        <button aria-label={playing ? 'Pause slideshow' : 'Play slideshow'} onClick={() => setPlaying((value) => !value)}>{playing ? 'Ⅱ' : '▶'}</button>
        <button aria-label="Open note" className="info-button" onClick={openCurrentCard}>i</button>
        <button aria-label="Open archive" onClick={() => setArchive(true)}>⊞</button>
      </nav>
      <div className="hint">drag / use arrows · tap any card to open · scroll to explore</div>

      <section className="story-intro" aria-label="Story introduction">
        <div className="story-rule" />
        <p className="story-kicker">A small archive of memories</p>
        <h2>Before I leave, I wanted to leave something behind.</h2>
        <p>Every card is a little piece of the journey. Tap any photo to open it, or use the <strong>i</strong> button to open the current page.</p>
        <p>I'm Sadrakh and officially signing out, peace ✌️</p>
      </section>

      {archive && <div className="grid-overlay"><div className="grid-head"><div><small>ARCHIVE</small><h2>For you.</h2></div><button aria-label="Close archive" onClick={() => setArchive(false)}>×</button></div><div className="grid-people">{PEOPLE.map((p, i) => <button key={p.id} onClick={() => navigateToPerson(i)} className="person-tile" style={{ backgroundImage: `url(${p.images[2]})` }}><span>{p.name}</span><small>{p.role}</small></button>)}</div></div>}

      {selected !== null && <div className="modal-backdrop" onClick={() => setSelected(null)}><div className="letter-modal" onClick={(event) => event.stopPropagation()}>
        <button className="close" aria-label="Close note" onClick={() => setSelected(null)}>×</button>
        <div className="letter-image" style={{ backgroundImage: `url(${person.images[selected]})` }}><span>{labels[selected]}</span></div>
        <div className="letter-content"><div className="tiny">A NOTE FROM ME</div><h2>{person.name},<br /><i>for you.</i></h2><p>{person.message}</p><div className="signature"><span>♥</span>{person.note}</div></div>
        <button className="next-letter" onClick={() => { const next = (selected + 1) % CARDS.length; setCardIndex(next); setSelected(next); }}>next page ›</button>
      </div></div>}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
