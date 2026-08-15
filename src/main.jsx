import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const PEOPLE = [
  {
    id: 'nama-ceo', name: 'CEO', role: 'for you', accent: '#f6d58c',
    message: `Thank you for trusting me with the CTO / Tech Lead role. I will always remember the opportunity, the lessons, and the people I met here. I'm sorry for every moment when I could have done better.`,
    note: 'A little thank-you for the person who opened the door.',
    images: ['https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85']
  },
  {
    id: 'nama-cmo', name: 'CMO', role: 'for you', accent: '#f5a9c0',
    message: `Thank you for guiding, challenging, and shaping me along the way. You have been more than a teammate — you have felt like an older sibling who always made things lighter.`,
    note: 'For the one who made the hard days a little easier.',
    images: ['https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?auto=format&fit=crop&w=1200&q=85']
  },
  {
    id: 'nama-tech-partner', name: 'Tech Partner', role: 'for you', accent: '#8ec8ff',
    message: `Thank you for being my partner in the Tech Division — for helping, discussing, debugging, and simply being there. I'm sorry I couldn't always be the lead example you deserved.`,
    note: 'For the person who was there in the trenches.',
    images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=85']
  },
  {
    id: 'nama-bendahara-sekretaris', name: 'Bendahara & Sekretaris', role: 'for you', accent: '#b7e4c7',
    message: `Thank you for bringing laughter, warmth, and a little chaos into the room. Your presence had a bigger impact than you probably realize. I'm sorry for anything I ever did or said that made things harder.`,
    note: 'For the person who kept the room alive.',
    images: ['https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=85']
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
        <button className="brand" onClick={() => navigateToPerson(0)} aria-label="Go to the first letter"><span className="brand-dot">◒</span><span>Paper Stories</span></button>
        <div className="top-actions">
          <button className="icon-btn" aria-label="Choose a letter" onClick={() => setMenu((value) => !value)}>⊞</button>
          <button className="icon-btn info-button" aria-label="Open current note" onClick={openCurrentCard}>i</button>
          <button className="icon-btn" aria-label="Open people menu" onClick={() => setMenu((value) => !value)}>≡</button>
        </div>
      </header>

      <section className="heading">
        <div className="eyebrow">A little something for you before I go</div>
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
                  <div className="paper-copy"><span>{card.label}</span>{isFront && <><strong>{person.name}</strong><em>for you</em></>}</div>
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
      </section>

      {archive && <div className="grid-overlay"><div className="grid-head"><div><small>ARCHIVE</small><h2>For you.</h2></div><button aria-label="Close archive" onClick={() => setArchive(false)}>×</button></div><div className="grid-people">{PEOPLE.map((p, i) => <button key={p.id} onClick={() => navigateToPerson(i)} className="person-tile" style={{ backgroundImage: `url(${p.images[2]})` }}><span>{p.name}</span><small>{p.role}</small></button>)}</div></div>}

      {selected !== null && <div className="modal-backdrop" onClick={() => setSelected(null)}><div className="letter-modal" onClick={(event) => event.stopPropagation()}>
        <button className="close" aria-label="Close note" onClick={() => setSelected(null)}>×</button>
        <div className="letter-image" style={{ backgroundImage: `url(${person.images[selected]})` }}><span>{CARDS[selected].label}</span></div>
        <div className="letter-content"><div className="tiny">A NOTE FROM ME</div><h2>{person.name},<br /><i>for you.</i></h2><p>{person.message}</p><div className="signature"><span>♥</span>{person.note}</div></div>
        <button className="next-letter" onClick={() => { const next = (selected + 1) % CARDS.length; setCardIndex(next); setSelected(next); }}>next page ›</button>
      </div></div>}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
