import { useState } from "react";

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
const causes = [
  { name: "Tuition & fees", icon: "▣", description: "Keep a student enrolled and learning." },
  { name: "Medical care", icon: "＋", description: "Help cover treatment and recovery." },
  { name: "Food & essentials", icon: "⌂", description: "Provide meals and everyday necessities." },
  { name: "Housing & safety", icon: "◇", description: "Offer a stable place to focus." }
];
const presets = [500, 1000, 2500, 5000];

function Brand() {
  return <a className="brand" href="#top" aria-label="Meru University student support fund home"><span className="brand-mark">M</span><span>Meru University<span className="brand-dot">.</span></span></a>;
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return <header className="site-header">
    <Brand />
    <button className="menu-toggle" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span></span><span></span><span></span></button>
    <nav className={`main-nav ${menuOpen ? "open" : ""}`} aria-label="Main navigation">
      <a href="#why" onClick={() => setMenuOpen(false)}>Why it matters</a><a href="#causes" onClick={() => setMenuOpen(false)}>Our causes</a><a href="#stories" onClick={() => setMenuOpen(false)}>Impact</a>
    </nav>
    <a className="header-action" href="#donate">Donate now <span>↗</span></a>
  </header>;
}

function Hero() {
  return <section className="hero-shell">
    <div className="hero-copy"><p className="kicker"><span className="kicker-line"></span> Meru University community fund</p><h1>Small help.<br /><em>Big futures.</em></h1><p className="hero-lede">Together, we can keep students at Meru University in class, in good health, and moving toward the life they are building.</p><div className="hero-actions"><a className="button button-primary" href="#donate">Make a difference <span>→</span></a><a className="text-link" href="#why">See where your gift goes <span>↓</span></a></div><div className="trust-row"><span className="avatar-stack"><i>J</i><i>M</i><i>A</i><i>+</i></span><span><strong>240+ people</strong> have already joined in</span></div></div>
    <div className="hero-visual" aria-label="Students studying together"><div className="image-frame"><img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=85" alt="Meru University students studying together outdoors" /></div><div className="floating-note note-top"><span className="note-icon">↗</span><span><strong>KES 386,420</strong><small>raised so far</small></span></div><div className="floating-note note-bottom"><span className="check-icon">✓</span><span><strong>68 students</strong><small>supported this year</small></span></div><span className="sun-disc"></span></div>
  </section>;
}

function CauseCard({ cause, index, selected, onSelect }) {
  return <button className={`cause-card ${selected ? "selected" : ""}`} onClick={() => onSelect(cause)}><span className="cause-number">0{index + 1}</span><span className="cause-icon">{cause.icon}</span><strong>{cause.name}</strong><small>{cause.description}</small><span className="cause-arrow">↗</span></button>;
}

function DonationForm({ cause }) {
  const [amount, setAmount] = useState(1000);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  function submitDonation(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const numericAmount = Number(formData.get("amount"));
    const donorEmail = formData.get("email");
    const donorName = formData.get("name");
    const donorPhone = formData.get("phone");
    const isAnonymous = formData.get("anonymous") === "on";
    if (!Number.isFinite(numericAmount) || numericAmount <= 5) {
      setIsError(true); setMessage("Please enter a donation greater than KES 5."); return;
    }
    if (!PAYSTACK_PUBLIC_KEY || !PAYSTACK_PUBLIC_KEY.startsWith("pk_")) {
      setIsError(true); setMessage("Paystack public key is missing. Add VITE_PAYSTACK_PUBLIC_KEY in Vercel and redeploy."); return;
    }
    if (!window.PaystackPop) {
      setIsError(true); setMessage("Paystack could not load. Check your connection and try again."); return;
    }
    const handler = window.PaystackPop.setup({ key: PAYSTACK_PUBLIC_KEY, email: donorEmail, amount: Math.round(numericAmount * 100), currency: "KES", ref: `MERU-${Date.now()}`, metadata: { custom_fields: [{ display_name: "Cause", variable_name: "cause", value: cause.name }, { display_name: "Donor", variable_name: "donor", value: isAnonymous ? "Anonymous" : donorName }, { display_name: "M-PESA phone", variable_name: "phone", value: donorPhone }] }, callback: (response) => { setIsError(false); setMessage(`Thank you. Your donation was received. Reference: ${response.reference}`); }, onClose: () => { setIsError(false); setMessage("Payment window closed. Your donation has not been charged."); } });
    handler.openIframe();
  }

  return <form className="donation-form" id="donationForm" onSubmit={submitDonation}><div className="selected-cause"><span>{cause.icon}</span><div><small>Donating towards</small><strong>{cause.name}</strong></div><a href="#causes">Change</a></div><label className="amount-label" htmlFor="amount">Amount <span>KES</span></label><div className="amount-input"><span>KES</span><input id="amount" name="amount" type="number" min="6" step="1" value={amount} onChange={(event) => setAmount(event.target.value)} required /></div><div className="amount-presets">{presets.map((preset) => <button type="button" key={preset} className={Number(amount) === preset ? "active" : ""} onClick={() => setAmount(preset)}>{preset.toLocaleString()}</button>)}</div><div className="donor-fields"><label htmlFor="donorName">Your name<input id="donorName" name="name" type="text" placeholder="e.g. Amina Njeri" required /></label><label htmlFor="donorEmail">Email address<input id="donorEmail" name="email" type="email" placeholder="you@example.com" required /></label><label htmlFor="donorPhone">M-PESA phone<input id="donorPhone" name="phone" type="tel" inputMode="tel" placeholder="07XX XXX XXX" required /></label></div><label className="check-label"><input name="anonymous" type="checkbox" /> Give anonymously</label><button className="button button-primary donate-button" type="submit">Continue to payment <span>→</span></button><p className="secure-note">▣ Secure payment powered by Paystack · Card and mobile money supported</p><p className={`form-message ${isError ? "error" : ""}`} role="status">{message}</p></form>;
}

export default function App() {
  const [cause, setCause] = useState(causes[0]);
  return <><Header /><main id="top"><Hero /><section className="impact-strip" id="why"><div><strong>100%</strong><span>of donations go to<br />student support</span></div><div><strong>4</strong><span>ways to make<br />a real difference</span></div><div><strong>24 hrs</strong><span>to review<br />urgent requests</span></div><p>“A little from many people changes everything.”</p></section><section className="content-section" id="causes"><div className="section-heading"><p className="kicker">Choose your cause</p><h2>Give where it<br /><em>matters most.</em></h2><p>Every contribution is matched to a verified student need. Choose one cause, or split your gift across the work.</p></div><div className="cause-grid">{causes.map((item, index) => <CauseCard key={item.name} cause={item} index={index} selected={cause.name === item.name} onSelect={setCause} />)}</div></section><section className="donation-section" id="donate"><div className="donation-intro"><p className="kicker">Your gift, your choice</p><h2>Put kindness<br /><em>in motion.</em></h2><p>There is no “right” amount. Pick what feels meaningful to you today.</p></div><DonationForm cause={cause} /></section><section className="stories-section" id="stories"><div><p className="kicker">The difference is real</p><h2>When a student<br /><em>gets to stay.</em></h2></div><blockquote>“I was one payment away from dropping out. Someone I will never meet gave me another semester, and another chance.”<cite>— Brian, second-year education student</cite></blockquote></section></main><footer className="site-footer"><Brand /><span>Built with care for Meru University students</span><span>© 2026 Meru University Student Support Fund</span></footer></>;
}
