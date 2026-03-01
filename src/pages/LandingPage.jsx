import React, { useState } from 'react';
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
} from 'lucide-react';

/* ───────────────────────────── Navbar ───────────────────────────── */
function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-loop-gray">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="#" className="font-display text-2xl font-bold tracking-tight text-loop-green">
          Inner<span className="text-loop-purple">Loop</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#mission" className="hover:text-loop-purple transition-colors">Mission</a>
          <a href="#how-it-works" className="hover:text-loop-purple transition-colors">How It Works</a>
          <a href="#rewards" className="hover:text-loop-purple transition-colors">Rewards</a>
          <a href="#join" className="btn-primary text-xs">Join the Loop</a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg hover:bg-loop-gray transition-colors"
          aria-label="Toggle menu"
        >
          <span className="block w-5 h-0.5 bg-loop-green mb-1" />
          <span className="block w-5 h-0.5 bg-loop-green mb-1" />
          <span className="block w-3 h-0.5 bg-loop-green" />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-loop-gray px-6 py-4 space-y-3 text-sm font-medium">
          <a href="#mission" onClick={() => setOpen(false)} className="block">Mission</a>
          <a href="#how-it-works" onClick={() => setOpen(false)} className="block">How It Works</a>
          <a href="#rewards" onClick={() => setOpen(false)} className="block">Rewards</a>
          <a href="#join" onClick={() => setOpen(false)} className="btn-primary text-xs w-full text-center">
            Join the Loop
          </a>
        </div>
      )}
    </nav>
  );
}

/* ───────────────────────────── Hero ─────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center section-padding pt-28 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-loop-blue/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-24 w-80 h-80 rounded-full bg-loop-red/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-loop-blue/30 text-sm font-medium">
            <MapPin size={14} />
            Chicago&apos;s Neighborhood Network
          </div>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight">
            Helping the{' '}
            <span className="text-loop-purple">Inner</span>
            <br />
            as a{' '}
            <span className="text-loop-red">Looper</span>
          </h1>

          <p className="text-lg md:text-xl text-loop-green/70 max-w-lg leading-relaxed">
            InnerLoop connects everyday people with trusted local organizations
            so neighborhoods thrive — one task, one hour, one connection at a time.
          </p>

          <div className="flex flex-wrap gap-4">
            <a href="#join" className="btn-primary gap-2">
              Get Started <ArrowRight size={16} />
            </a>
            <a href="#how-it-works" className="btn-secondary gap-2">
              See How It Works
            </a>
          </div>

          {/* Social proof strip */}
          <div className="flex items-center gap-6 pt-4 text-sm text-loop-green/60">
            <span className="flex items-center gap-1"><Users size={14} /> 2,400+ on waitlist</span>
            <span className="flex items-center gap-1"><MapPin size={14} /> 38 neighborhoods</span>
          </div>
        </div>

        {/* Illustrative card cluster */}
        <div className="relative hidden lg:flex justify-center">
          <FeedCardMock />
        </div>
      </div>
    </section>
  );
}

/* Mock feed card for the hero illustration */
function FeedCardMock() {
  return (
    <div className="relative w-80">
      {/* Background card */}
      <div className="absolute -top-4 -left-4 w-full h-full rounded-3xl bg-loop-blue/40 rotate-3" />
      {/* Main card */}
      <div className="relative bg-white rounded-3xl shadow-xl p-6 space-y-4 border border-loop-gray">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-loop-purple/20 flex items-center justify-center">
            <Building2 size={18} className="text-loop-purple" />
          </div>
          <div>
            <p className="font-semibold text-sm">Pilsen Community Center</p>
            <p className="text-xs text-loop-green/50">Inner · Verified</p>
          </div>
          <Shield size={14} className="ml-auto text-loop-purple" />
        </div>
        <p className="text-sm leading-relaxed">
          Looking for 3 volunteers to help sort donated winter coats this Saturday 🧤
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-loop-red/10 text-loop-red font-medium">#volunteer</span>
          <span className="px-2.5 py-1 rounded-full bg-loop-blue/30 font-medium">#pilsen</span>
          <span className="px-2.5 py-1 rounded-full bg-loop-purple/10 text-loop-purple font-medium">+2 hrs</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-loop-gray">
          <span className="text-xs text-loop-green/50">0.3 mi away</span>
          <button className="text-xs font-semibold text-loop-purple hover:underline">
            Join Task →
          </button>
        </div>
      </div>
      {/* Floating badge */}
      <div className="absolute -bottom-3 -right-3 bg-loop-green text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
        <Zap size={12} /> 2× Waitlist Bonus
      </div>
    </div>
  );
}

/* ───────────────────────── Mission Section ───────────────────────── */
function Mission() {
  return (
    <section id="mission" className="section-padding bg-white">
      <div className="max-w-5xl mx-auto text-center space-y-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-loop-purple">Our Mission</p>
        <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight">
          Neighborhoods are strongest when <br className="hidden md:block" />
          <span className="text-loop-red">everyone</span> is in the loop.
        </h2>
        <p className="text-loop-green/70 max-w-2xl mx-auto text-lg leading-relaxed">
          InnerLoop bridges the gap between everyday people and the local organizations
          that serve them. By making help visible, trackable, and rewarding, we turn
          disconnected communities into thriving ecosystems of mutual support.
        </p>
      </div>

      <div className="max-w-6xl mx-auto mt-16 grid md:grid-cols-3 gap-8">
        {[
          {
            icon: <MapPin className="text-loop-red" />,
            title: 'Hyper-Local',
            body: 'Every post is tagged by proximity. You see what matters within blocks, not boroughs.',
          },
          {
            icon: <Shield className="text-loop-purple" />,
            title: 'Trust Built-In',
            body: 'Verified organizations (Inners) ensure tasks are legit, safe, and completed properly.',
          },
          {
            icon: <Coins className="text-loop-blue" />,
            title: 'Real Rewards',
            body: 'Earn verified hours and Loop Credits for every task you complete — doubled if you waited.',
          },
        ].map((card) => (
          <div
            key={card.title}
            className="p-6 rounded-2xl bg-loop-gray/60 border border-loop-gray hover:shadow-md transition-shadow space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
              {card.icon}
            </div>
            <h3 className="font-display text-lg font-bold">{card.title}</h3>
            <p className="text-sm text-loop-green/70 leading-relaxed">{card.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ──────────────────── How It Works (Looper vs Inner) ────────────── */
function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding">
      <div className="max-w-5xl mx-auto text-center space-y-4 mb-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-loop-purple">How It Works</p>
        <h2 className="font-display text-3xl md:text-5xl font-bold">
          Two roles. One <span className="text-loop-purple">Loop</span>.
        </h2>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Looper card */}
        <div className="rounded-3xl bg-white border-2 border-loop-red/30 p-8 space-y-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-loop-red/10 flex items-center justify-center">
              <Heart size={26} className="text-loop-red" />
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold">Looper</h3>
              <p className="text-sm text-loop-green/60">Personal Account</p>
            </div>
          </div>
          <p className="text-loop-green/70 leading-relaxed">
            An everyday person who can both <strong>give help</strong> and <strong>ask for help</strong>.
            Loopers browse the local feed, pick up tasks from verified Inners, and earn
            rewards for every hour they contribute.
          </p>
          <ul className="space-y-3 text-sm">
            {[
              'Browse & claim tasks on the local feed',
              'Earn verified hours + Loop Credits',
              'Build your Star Rating through reviews',
              'Join waitlists for full tasks — get 2× rewards',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-loop-red/10 flex items-center justify-center flex-shrink-0">
                  <ArrowRight size={12} className="text-loop-red" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Inner card */}
        <div className="rounded-3xl bg-white border-2 border-loop-purple/30 p-8 space-y-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-loop-purple/10 flex items-center justify-center">
              <Building2 size={26} className="text-loop-purple" />
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold">Inner</h3>
              <p className="text-sm text-loop-green/60">Business / Org Account</p>
            </div>
          </div>
          <p className="text-loop-green/70 leading-relaxed">
            A <strong>verified organization</strong> — non-profit, local business, or community group —
            that posts structured tasks, manages capacity, and ensures services are
            completed properly even if plans change.
          </p>
          <ul className="space-y-3 text-sm">
            {[
              'Post tasks & manage volunteer capacity',
              'Verify hours and issue Loop Credits',
              'Access the Inner Loop (private B2B feed)',
              'DM other Inners, share space & resources',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-loop-purple/10 flex items-center justify-center flex-shrink-0">
                  <ArrowRight size={12} className="text-loop-purple" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────── Rewards Section ────────────────────────── */
function Rewards() {
  return (
    <section id="rewards" className="section-padding bg-loop-green text-white">
      <div className="max-w-5xl mx-auto text-center space-y-4 mb-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-loop-blue">Rewards System</p>
        <h2 className="font-display text-3xl md:text-5xl font-bold">
          Your time is <span className="text-loop-red">valued</span>.
        </h2>
        <p className="text-white/70 max-w-xl mx-auto leading-relaxed">
          Every task you complete earns you verified hours, a growing Star Rating,
          and Loop Credits you can redeem with participating organizations.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-6">
        {[
          {
            icon: <Star className="text-loop-red" />,
            label: 'Star Rating',
            desc: 'Reviewed after every task. 1–5 stars reflect your reliability and effort.',
          },
          {
            icon: <Clock className="text-loop-blue" />,
            label: 'Verified Hours',
            desc: 'Logged by Inners once a task is done. Proof of real community impact.',
          },
          {
            icon: <Coins className="text-loop-red" />,
            label: 'Loop Credits',
            desc: 'Earned per task. Redeemable at local businesses and partner orgs.',
          },
        ].map((r) => (
          <div
            key={r.label}
            className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4 hover:bg-white/10 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              {r.icon}
            </div>
            <h3 className="font-display text-lg font-bold">{r.label}</h3>
            <p className="text-sm text-white/60 leading-relaxed">{r.desc}</p>
          </div>
        ))}
      </div>

      {/* Waitlist multiplier callout */}
      <div className="max-w-3xl mx-auto mt-14 rounded-2xl bg-loop-red/20 border border-loop-red/30 p-8 text-center space-y-3">
        <div className="inline-flex items-center gap-2 text-loop-red font-bold text-lg">
          <Zap size={20} /> Waitlist Reward Multiplier
        </div>
        <p className="text-white/80 leading-relaxed">
          When a task is full, Loopers can join a <strong>waitlist</strong>. If a spot opens
          and a waitlisted Looper completes the task, their verified hours and Loop Credits
          are <strong className="text-loop-red">doubled (2×)</strong>. Patience pays.
        </p>
      </div>
    </section>
  );
}

/* ──────────────────── Privacy & Fairness ─────────────────────────── */
function Privacy() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-loop-purple">Privacy & Fairness</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight">
            Fair by design.
          </h2>
          <p className="text-loop-green/70 leading-relaxed">
            Loopers can never see the full job details of tasks assigned to other Loopers.
            This prevents bias, mismanagement, and keeps the system balanced for everyone.
          </p>
          <p className="text-loop-green/70 leading-relaxed">
            Verified Inners get an exclusive <strong className="text-loop-purple">"Inner Loop"</strong> —
            a private layer where they can securely DM each other, share event space,
            or swap resources, completely hidden from the public feed.
          </p>
        </div>
        <div className="flex justify-center">
          <div className="w-64 h-64 rounded-full bg-loop-blue/20 flex items-center justify-center relative">
            <div className="w-40 h-40 rounded-full bg-loop-purple/15 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-loop-green flex items-center justify-center">
                <Shield size={28} className="text-white" />
              </div>
            </div>
            <span className="absolute top-4 right-6 text-xs font-bold text-loop-purple bg-loop-purple/10 px-2 py-1 rounded-full">
              Inner Loop
            </span>
            <span className="absolute bottom-8 left-2 text-xs font-bold text-loop-blue bg-loop-blue/20 px-2 py-1 rounded-full">
              Public Feed
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────── FAQ ────────────────────────────────────── */
function FAQ() {
  const faqs = [
    {
      q: 'Is InnerLoop only for Chicago?',
      a: "We're launching in Chicago first — neighborhood by neighborhood. Expansion plans depend on community growth.",
    },
    {
      q: 'How do I become a verified Inner?',
      a: 'Organizations apply through our signup flow. We verify legal status, location, and community presence before granting Inner status.',
    },
    {
      q: 'What can I spend Loop Credits on?',
      a: 'Credits are redeemable at participating local businesses and partner orgs — think discounts, event tickets, and community perks.',
    },
    {
      q: 'How does the waitlist bonus work?',
      a: 'If a task is full and you join the waitlist, then complete the task after a spot opens, your verified hours and Loop Credits are doubled.',
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="section-padding">
      <div className="max-w-3xl mx-auto space-y-4">
        <p className="text-sm font-semibold uppercase tracking-widest text-loop-purple text-center">FAQ</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-10">
          Common questions
        </h2>

        {faqs.map((faq, i) => (
          <button
            key={i}
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full text-left rounded-xl bg-white border border-loop-gray p-5 transition-shadow hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm pr-4">{faq.q}</span>
              {openIndex === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
            {openIndex === i && (
              <p className="mt-3 text-sm text-loop-green/70 leading-relaxed">{faq.a}</p>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}

/* ──────────────────────── CTA / Join ────────────────────────────── */
function JoinCTA() {
  return (
    <section id="join" className="section-padding bg-loop-purple text-white text-center">
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="font-display text-3xl md:text-5xl font-bold">
          Ready to join the Loop?
        </h2>
        <p className="text-white/80 max-w-lg mx-auto leading-relaxed">
          Whether you're an everyday person looking to help, or an organization ready
          to mobilize your community — there's a place for you here.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-loop-purple font-bold text-sm hover:opacity-90 transition-opacity">
            <Heart size={16} /> Sign Up as Looper
          </button>
          <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-white text-white font-bold text-sm hover:bg-white/10 transition-colors">
            <Building2 size={16} /> Register as Inner
          </button>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────── Footer ─────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-loop-green text-white/60 text-xs px-6 py-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-display text-base font-bold text-white">
          Inner<span className="text-loop-purple">Loop</span>
        </p>
        <p>© {new Date().getFullYear()} InnerLoop Chicago. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}

/* ──────────────────────── Page Compose ───────────────────────────── */
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
