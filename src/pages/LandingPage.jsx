import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Building2,
  Star,
  Clock,
  Coins,
  ArrowRight,
  MapPin,
  Users,
  Shield,
  ChevronDown,
  ChevronUp,
  Zap,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';

/* ─── Fade-in-on-scroll hook ─────────────────────────────────────── */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return [ref, visible];
}

function Reveal({ children, className = '', delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ─── Floating animated dots background ──────────────────────────── */
function FloatingDots() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-20"
          style={{
            width: `${8 + i * 6}px`,
            height: `${8 + i * 6}px`,
            background: ['#f18989', '#8B6897', '#aFD2E9', '#f18989', '#8B6897', '#aFD2E9'][i],
            left: `${10 + i * 16}%`,
            top: `${20 + (i % 3) * 25}%`,
            animation: `float ${4 + i}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ───────────────────────── Navbar ───────────────────────────────── */
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="#" className="font-display text-2xl font-extrabold tracking-tight text-loop-green">
          Inner<span className="bg-gradient-to-r from-loop-purple to-loop-red bg-clip-text text-transparent">Loop</span>
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#mission" className="text-loop-green/70 hover:text-loop-green transition-colors">Mission</a>
          <a href="#how-it-works" className="text-loop-green/70 hover:text-loop-green transition-colors">How It Works</a>
          <a href="#rewards" className="text-loop-green/70 hover:text-loop-green transition-colors">Rewards</a>
          <Link to="/signup" className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-loop-green text-white text-xs font-semibold hover:shadow-lg hover:shadow-loop-green/20 transition-all duration-300 hover:scale-105">
            Join the Loop <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-xl hover:bg-loop-gray/50 transition-colors"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-loop-gray/50 px-6 py-5 space-y-4">
          {['Mission', 'How It Works', 'Rewards'].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setOpen(false)}
              className="block text-sm font-medium py-2"
            >
              {label}
            </a>
          ))}
          <Link to="/signup" onClick={() => setOpen(false)} className="btn-primary text-xs w-full text-center">
            Join the Loop
          </Link>
        </div>
      )}
    </nav>
  );
}

/* ───────────────────────── Hero ─────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center section-padding pt-28 overflow-hidden">
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-loop-blue/40 to-loop-purple/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-32 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-loop-red/25 to-loop-purple/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-loop-blue/5 blur-3xl pointer-events-none" />
      <FloatingDots />

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <div className="space-y-8">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-loop-green/10 text-sm font-medium shadow-sm">
              <MapPin size={14} className="text-loop-red" />
              Chicago&apos;s Neighborhood Network
              <Sparkles size={14} className="text-loop-purple" />
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight">
              Helping the{' '}
              <span className="bg-gradient-to-r from-loop-purple to-purple-500 bg-clip-text text-transparent">Inner</span>
              <br />
              as a{' '}
              <span className="bg-gradient-to-r from-loop-red to-red-400 bg-clip-text text-transparent">Looper</span>
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-lg md:text-xl text-loop-green/60 max-w-lg leading-relaxed">
              InnerLoop connects everyday people with trusted local organizations
              so neighborhoods thrive — one task, one hour, one connection at a time.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="flex flex-wrap gap-4">
              <Link to="/signup" className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-loop-green text-white font-semibold text-sm shadow-lg shadow-loop-green/20 hover:shadow-xl hover:shadow-loop-green/30 transition-all duration-300 hover:scale-105">
                Get Started <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#how-it-works" className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-loop-green/20 text-loop-green font-semibold text-sm hover:border-loop-green/40 hover:bg-loop-green/5 transition-all duration-300">
                See How It Works
              </a>
            </div>
          </Reveal>

          <Reveal delay={400}>
            <div className="flex items-center gap-8 pt-4 text-sm text-loop-green/50">
              <span className="flex items-center gap-1.5"><Users size={14} /> 2,400+ on waitlist</span>
              <span className="flex items-center gap-1.5"><MapPin size={14} /> 38 neighborhoods</span>
              <span className="flex items-center gap-1.5"><Star size={14} /> 4.9 avg rating</span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={300} className="hidden lg:flex justify-center">
          <FeedCardMock />
        </Reveal>
      </div>
    </section>
  );
}

/* Mock feed card */
function FeedCardMock() {
  return (
    <div className="relative w-[340px]">
      <div className="absolute -top-4 -left-4 w-full h-full rounded-3xl bg-gradient-to-br from-loop-blue/40 to-loop-purple/20 rotate-3 blur-[1px]" />
      <div className="absolute -top-2 -right-3 w-full h-full rounded-3xl bg-gradient-to-br from-loop-red/20 to-loop-blue/10 -rotate-2" />

      <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl shadow-loop-green/10 p-7 space-y-5 border border-white/60">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-loop-purple/30 to-loop-purple/10 flex items-center justify-center">
            <Building2 size={18} className="text-loop-purple" />
          </div>
          <div>
            <p className="font-semibold text-sm">Pilsen Community Center</p>
            <p className="text-xs text-loop-green/40 flex items-center gap-1">
              <Shield size={10} className="text-loop-purple" /> Inner · Verified
            </p>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-loop-green/80">
          Looking for 3 volunteers to help sort donated winter coats this Saturday &#x1F9E4;
        </p>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-full bg-loop-red/10 text-loop-red font-medium border border-loop-red/10">#volunteer</span>
          <span className="px-3 py-1.5 rounded-full bg-loop-blue/20 text-loop-green/70 font-medium border border-loop-blue/20">#pilsen</span>
          <span className="px-3 py-1.5 rounded-full bg-loop-purple/10 text-loop-purple font-medium border border-loop-purple/10">+2 hrs</span>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-loop-green/50">
            <span>2 of 3 spots filled</span>
            <span className="text-loop-red font-medium">1 left!</span>
          </div>
          <div className="h-2 bg-loop-gray rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-gradient-to-r from-loop-purple to-loop-red rounded-full" />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-loop-gray/60">
          <span className="text-xs text-loop-green/40 flex items-center gap-1">
            <MapPin size={10} /> 0.3 mi away
          </span>
          <button className="text-xs font-bold text-loop-purple hover:underline flex items-center gap-1">
            Join Task <ArrowRight size={12} />
          </button>
        </div>
      </div>

      <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-loop-green to-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5">
        <Zap size={12} /> 2x Waitlist Bonus
      </div>
      <div className="absolute -top-3 right-8 bg-white text-loop-purple text-xs font-bold px-3 py-1.5 rounded-full shadow-md border border-loop-purple/10 flex items-center gap-1">
        <Star size={11} fill="currentColor" /> 4.9
      </div>
    </div>
  );
}

/* ─────────────────────── Mission ─────────────────────────────────── */
function Mission() {
  const cards = [
    { icon: <MapPin className="text-loop-red" size={22} />, title: 'Hyper-Local', body: 'Every post is tagged by proximity. You see what matters within blocks, not boroughs.', gradient: 'from-loop-red/10 to-loop-red/5', border: 'border-loop-red/10' },
    { icon: <Shield className="text-loop-purple" size={22} />, title: 'Trust Built-In', body: 'Verified organizations (Inners) ensure tasks are legit, safe, and completed properly.', gradient: 'from-loop-purple/10 to-loop-purple/5', border: 'border-loop-purple/10' },
    { icon: <Coins size={22} className="text-blue-400" />, title: 'Real Rewards', body: 'Earn verified hours and Loop Credits for every task you complete — doubled if you waited.', gradient: 'from-loop-blue/15 to-loop-blue/5', border: 'border-loop-blue/20' },
  ];

  return (
    <section id="mission" className="section-padding bg-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-loop-purple/20 to-transparent" />
      <div className="max-w-5xl mx-auto text-center space-y-6">
        <Reveal><p className="text-sm font-bold uppercase tracking-[0.2em] text-loop-purple">Our Mission</p></Reveal>
        <Reveal delay={100}>
          <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight">
            Neighborhoods are strongest when <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-loop-red to-loop-purple bg-clip-text text-transparent">everyone</span> is in the loop.
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <p className="text-loop-green/60 max-w-2xl mx-auto text-lg leading-relaxed">
            InnerLoop bridges the gap between everyday people and the local organizations
            that serve them. By making help visible, trackable, and rewarding, we turn
            disconnected communities into thriving ecosystems of mutual support.
          </p>
        </Reveal>
      </div>
      <div className="max-w-6xl mx-auto mt-16 grid md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <Reveal key={card.title} delay={i * 120}>
            <div className={`group p-7 rounded-2xl bg-gradient-to-b ${card.gradient} border ${card.border} hover:shadow-lg hover:-translate-y-1 transition-all duration-300 space-y-4 h-full`}>
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">{card.icon}</div>
              <h3 className="font-display text-lg font-bold">{card.title}</h3>
              <p className="text-sm text-loop-green/60 leading-relaxed">{card.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ────────────────── How It Works ─────────────────────────────────── */
function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-loop-gray/0 via-loop-blue/5 to-loop-gray/0 pointer-events-none" />
      <div className="max-w-5xl mx-auto text-center space-y-4 mb-16 relative z-10">
        <Reveal><p className="text-sm font-bold uppercase tracking-[0.2em] text-loop-purple">How It Works</p></Reveal>
        <Reveal delay={100}>
          <h2 className="font-display text-3xl md:text-5xl font-bold">
            Two roles. One <span className="bg-gradient-to-r from-loop-purple to-loop-red bg-clip-text text-transparent">Loop</span>.
          </h2>
        </Reveal>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 relative z-10">
        <Reveal>
          <div className="group rounded-3xl bg-white border border-loop-red/15 p-8 space-y-6 hover:shadow-xl hover:shadow-loop-red/5 hover:border-loop-red/30 transition-all duration-500 h-full">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-loop-red/20 to-loop-red/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Heart size={26} className="text-loop-red" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold">Looper</h3>
                <p className="text-sm text-loop-green/50">Personal Account</p>
              </div>
            </div>
            <p className="text-loop-green/65 leading-relaxed">
              An everyday person who can both <strong className="text-loop-green/90">give help</strong> and <strong className="text-loop-green/90">ask for help</strong>. Loopers browse the local feed, pick up tasks from verified Inners, and earn rewards for every hour they contribute.
            </p>
            <ul className="space-y-3 text-sm">
              {['Browse & claim tasks on the local feed', 'Earn verified hours + Loop Credits', 'Build your Star Rating through reviews', 'Join waitlists for full tasks \u2014 get 2\u00d7 rewards'].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 w-6 h-6 rounded-full bg-loop-red/10 flex items-center justify-center flex-shrink-0">
                    <ArrowRight size={12} className="text-loop-red" />
                  </span>
                  <span className="text-loop-green/70">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="group rounded-3xl bg-white border border-loop-purple/15 p-8 space-y-6 hover:shadow-xl hover:shadow-loop-purple/5 hover:border-loop-purple/30 transition-all duration-500 h-full">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-loop-purple/20 to-loop-purple/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Building2 size={26} className="text-loop-purple" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold">Inner</h3>
                <p className="text-sm text-loop-green/50">Business / Org Account</p>
              </div>
            </div>
            <p className="text-loop-green/65 leading-relaxed">
              A <strong className="text-loop-green/90">verified organization</strong> \u2014 non-profit, local business, or community group \u2014 that posts structured tasks, manages capacity, and ensures services are completed properly even if plans change.
            </p>
            <ul className="space-y-3 text-sm">
              {['Post tasks & manage volunteer capacity', 'Verify hours and issue Loop Credits', 'Access the Inner Loop (private B2B feed)', 'DM other Inners, share space & resources'].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 w-6 h-6 rounded-full bg-loop-purple/10 flex items-center justify-center flex-shrink-0">
                    <ArrowRight size={12} className="text-loop-purple" />
                  </span>
                  <span className="text-loop-green/70">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ────────────────────── Rewards ──────────────────────────────────── */
function Rewards() {
  return (
    <section id="rewards" className="section-padding bg-loop-green text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-loop-purple/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-loop-red/10 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center space-y-4 mb-16 relative z-10">
        <Reveal><p className="text-sm font-bold uppercase tracking-[0.2em] text-loop-blue">Rewards System</p></Reveal>
        <Reveal delay={100}>
          <h2 className="font-display text-3xl md:text-5xl font-bold">
            Your time is <span className="bg-gradient-to-r from-loop-red to-red-300 bg-clip-text text-transparent">valued</span>.
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <p className="text-white/50 max-w-xl mx-auto leading-relaxed">
            Every task you complete earns you verified hours, a growing Star Rating, and Loop Credits you can redeem with participating organizations.
          </p>
        </Reveal>
      </div>

      <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-6 relative z-10">
        {[
          { icon: <Star className="text-loop-red" />, label: 'Star Rating', desc: 'Reviewed after every task. 1\u20135 stars reflect your reliability and effort.' },
          { icon: <Clock className="text-loop-blue" />, label: 'Verified Hours', desc: 'Logged by Inners once a task is done. Proof of real community impact.' },
          { icon: <Coins className="text-loop-red" />, label: 'Loop Credits', desc: 'Earned per task. Redeemable at local businesses and partner orgs.' },
        ].map((r, i) => (
          <Reveal key={r.label} delay={i * 120}>
            <div className="group rounded-2xl bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] p-7 space-y-4 hover:bg-white/[0.1] hover:border-white/[0.15] transition-all duration-300 h-full">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">{r.icon}</div>
              <h3 className="font-display text-lg font-bold">{r.label}</h3>
              <p className="text-sm text-white/45 leading-relaxed">{r.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="max-w-3xl mx-auto mt-14 rounded-2xl bg-gradient-to-r from-loop-red/20 to-loop-purple/20 border border-loop-red/20 p-8 text-center space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 text-loop-red font-bold text-lg">
            <Zap size={20} /> Waitlist Reward Multiplier
          </div>
          <p className="text-white/65 leading-relaxed">
            When a task is full, Loopers can join a <strong className="text-white/90">waitlist</strong>. If a spot opens and a waitlisted Looper completes the task, their verified hours and Loop Credits are <strong className="text-loop-red">doubled (2\u00d7)</strong>. Patience pays.
          </p>
        </div>
      </Reveal>
    </section>
  );
}

/* ────────────────── Privacy & Fairness ───────────────────────────── */
function Privacy() {
  return (
    <section className="section-padding bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <Reveal><p className="text-sm font-bold uppercase tracking-[0.2em] text-loop-purple">Privacy & Fairness</p></Reveal>
          <Reveal delay={100}><h2 className="font-display text-3xl md:text-4xl font-bold leading-tight">Fair by design.</h2></Reveal>
          <Reveal delay={200}>
            <p className="text-loop-green/60 leading-relaxed">
              Loopers can never see the full job details of tasks assigned to other Loopers. This prevents bias, mismanagement, and keeps the system balanced for everyone.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <p className="text-loop-green/60 leading-relaxed">
              Verified Inners get an exclusive <strong className="text-loop-purple">"Inner Loop"</strong> \u2014 a private layer where they can securely DM each other, share event space, or swap resources, completely hidden from the public feed.
            </p>
          </Reveal>
        </div>
        <Reveal delay={200}>
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-72 h-72 rounded-full bg-gradient-to-br from-loop-blue/15 to-loop-blue/5 flex items-center justify-center border border-loop-blue/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-loop-purple/15 to-loop-purple/5 border border-loop-purple/15 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-loop-green to-emerald-900 flex items-center justify-center shadow-xl shadow-loop-green/20">
                    <Shield size={30} className="text-white" />
                  </div>
                </div>
              </div>
              <span className="absolute top-2 right-0 text-xs font-bold text-loop-purple bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-loop-purple/10">Inner Loop</span>
              <span className="absolute bottom-4 left-0 text-xs font-bold text-loop-green/60 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-loop-blue/10">Public Feed</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ────────────────────── FAQ ──────────────────────────────────────── */
function FAQ() {
  const faqs = [
    { q: 'Is InnerLoop only for Chicago?', a: "We're launching in Chicago first \u2014 neighborhood by neighborhood. Expansion plans depend on community growth." },
    { q: 'How do I become a verified Inner?', a: 'Organizations apply through our signup flow. We verify legal status, location, and community presence before granting Inner status.' },
    { q: 'What can I spend Loop Credits on?', a: 'Credits are redeemable at participating local businesses and partner orgs \u2014 think discounts, event tickets, and community perks.' },
    { q: 'How does the waitlist bonus work?', a: 'If a task is full and you join the waitlist, then complete the task after a spot opens, your verified hours and Loop Credits are doubled.' },
  ];
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="section-padding">
      <div className="max-w-3xl mx-auto">
        <Reveal><p className="text-sm font-bold uppercase tracking-[0.2em] text-loop-purple text-center">FAQ</p></Reveal>
        <Reveal delay={100}><h2 className="font-display text-3xl md:text-4xl font-bold text-center mt-4 mb-10">Common questions</h2></Reveal>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <Reveal key={i} delay={i * 80}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className={`w-full text-left rounded-2xl bg-white border p-6 transition-all duration-300 ${openIndex === i ? 'border-loop-purple/20 shadow-md' : 'border-loop-gray hover:border-loop-purple/10 hover:shadow-sm'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm pr-4">{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${openIndex === i ? 'bg-loop-purple/10' : 'bg-loop-gray'}`}>
                    {openIndex === i ? <ChevronUp size={16} className="text-loop-purple" /> : <ChevronDown size={16} />}
                  </div>
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-40 mt-4' : 'max-h-0'}`}>
                  <p className="text-sm text-loop-green/60 leading-relaxed">{faq.a}</p>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────── CTA / Join ──────────────────────────────── */
function JoinCTA() {
  return (
    <section id="join" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-loop-purple via-purple-700 to-loop-purple" />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-loop-red/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-loop-blue/10 blur-3xl pointer-events-none" />
      <div className="max-w-3xl mx-auto space-y-8 text-center relative z-10 text-white">
        <Reveal><h2 className="font-display text-3xl md:text-5xl font-bold">Ready to join the Loop?</h2></Reveal>
        <Reveal delay={100}>
          <p className="text-white/65 max-w-lg mx-auto leading-relaxed">
            Whether you're an everyday person looking to help, or an organization ready to mobilize your community \u2014 there's a place for you here.
          </p>
        </Reveal>
        <Reveal delay={200}>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link to="/signup" className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-loop-purple font-bold text-sm shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <Heart size={16} /> Sign Up as Looper <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link to="/signup" className="group inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-white/40 text-white font-bold text-sm hover:bg-white/10 hover:border-white/60 transition-all duration-300">
              <Building2 size={16} /> Register as Inner
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ────────────────────── Footer ───────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-loop-green text-white/40 text-xs px-6 py-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="font-display text-lg font-extrabold text-white">
          Inner<span className="bg-gradient-to-r from-loop-purple to-loop-red bg-clip-text text-transparent">Loop</span>
        </p>
        <p>&copy; {new Date().getFullYear()} InnerLoop Chicago. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}

/* ────────────────────── Page Compose ─────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Mission />
      <HowItWorks />
      <Rewards />
      <Privacy />
      <FAQ />
      <JoinCTA />
      <Footer />
    </div>
  );
}
