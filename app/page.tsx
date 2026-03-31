"use client";

import { useState, useRef } from "react";
import Image from "next/image";

type FormState = "idle" | "loading" | "success" | "duplicate" | "error";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorText, setErrorText] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    // Grab Turnstile token
    const form = e.currentTarget;
    const turnstileInput = form.querySelector<HTMLInputElement>(
      'input[name="cf-turnstile-response"]'
    );
    const turnstileToken = turnstileInput?.value || "";

    setFormState("loading");
    setErrorText("");

    try {
      const res = await fetch(
        "https://trailware-api-production-19a4.up.railway.app/early_access",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            source: "website",
            ...(turnstileToken ? { "cf-turnstile-response": turnstileToken } : {}),
          }),
        }
      );

      if (res.status === 201) {
        setFormState("success");
      } else if (res.status === 200) {
        const body = await res.json().catch(() => ({}));
        const text = JSON.stringify(body).toLowerCase();
        if (text.includes("already") || text.includes("list")) {
          setFormState("duplicate");
        } else {
          setFormState("success");
        }
      } else {
        const body = await res.json().catch(() => ({}));
        setErrorText(
          (body as { error?: string }).error ||
            "Something went wrong. Please try again."
        );
        setFormState("error");
      }
    } catch {
      setErrorText("Network error. Please try again.");
      setFormState("error");
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const isSuccess = formState === "success" || formState === "duplicate";

  return (
    <>
      {/* Animated gradient glow */}
      <div className="glow" />

      {/* Floating particles */}
      <div className="particles">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      {/* ── Hero Section ── */}
      <section className="hero-section">
        <div className="container">
          {/* Fix 1: logo + headline centered together */}
          <div className="hero-header">
            <Image
              src="/trailware_logo.png"
              alt="Trailware"
              width={300}
              height={93}
              className="logo"
              priority
            />
            <h1 className="headline">
              Something <span className="highlight">big</span> is coming
              <br />
              for the trail
            </h1>
          </div>

          <p className="subtitle">
            A new way to explore. Stay informed. Stay safe.
            <br />
            Be the first to experience it.
          </p>

          <div className="form-container" ref={formRef}>
            {!isSuccess ? (
              <form id="early-access-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={formState === "loading"}
                />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={formState === "loading"}
                />

                {/* Fix 2: Cloudflare Turnstile widget before submit */}
                <div
                  className="cf-turnstile turnstile-widget"
                  data-sitekey="0x4AAAAAAA"
                  data-theme="dark"
                />

                <button
                  type="submit"
                  id="submit-btn"
                  disabled={formState === "loading"}
                >
                  {formState === "loading" ? "SUBMITTING..." : "GET EARLY ACCESS"}
                </button>

                {formState === "error" && (
                  <p className="error-message" style={{ display: "block" }}>
                    {errorText}
                  </p>
                )}
              </form>
            ) : (
              <div className="success-container" style={{ display: "block" }}>
                <div className="checkmark">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3>
                  {formState === "duplicate"
                    ? "You're already on the list!"
                    : "Check your email for updates! 📬"}
                </h3>
                <p>
                  {formState === "duplicate"
                    ? "We already have your info — we'll be in touch soon."
                    : "We'll reach out when it's time to hit the trail."}
                </p>
              </div>
            )}
          </div>

          <p className="coming-soon">Coming 2026</p>
        </div>
      </section>

      {/* ── What is Trailware? ── */}
      <section className="about-section">
        <div className="about-container">
          <h2 className="about-heading">What is Trailware?</h2>
          <p className="about-intro">
            Trailware is patent-pending behavioral intelligence for outdoor
            adventures. It learns how <em>you</em> move on the trail — your
            pace, your terrain preferences, your risk tolerance — and uses that
            knowledge to keep you safer and guide you smarter.
          </p>

          <div className="feature-cards">
            <div className="feature-card">
              <div className="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={28} height={28}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                </svg>
              </div>
              <h3 className="card-title">Behavioral Intelligence</h3>
              <p className="card-text">
                Patent-pending AI that learns your unique trail patterns and
                adapts in real time.
              </p>
            </div>

            <div className="feature-card">
              <div className="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={28} height={28}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
              </div>
              <h3 className="card-title">Smart Safety</h3>
              <p className="card-text">
                Automated 4-level safety escalation that alerts your emergency
                contacts when something goes wrong.
              </p>
            </div>

            <div className="feature-card">
              <div className="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={28} height={28}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                </svg>
              </div>
              <h3 className="card-title">Trail Familiarity</h3>
              <p className="card-text">
                Know exactly how familiar a trail is before you go, based on your
                own history.
              </p>
            </div>
          </div>

          <button className="cta-secondary" onClick={scrollToForm}>
            Join the Early Access List
          </button>
        </div>
      </section>

      <style>{`
        .glow {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(181, 103, 58, 0.15) 0%, rgba(181, 103, 58, 0.05) 40%, transparent 70%);
          animation: pulse 8s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
        }

        .particles {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(181, 103, 58, 0.4);
          border-radius: 50%;
          animation: float 20s infinite;
        }

        .particle:nth-child(1)  { left: 10%; animation-delay: 0s;  animation-duration: 25s; }
        .particle:nth-child(2)  { left: 20%; animation-delay: 2s;  animation-duration: 20s; }
        .particle:nth-child(3)  { left: 30%; animation-delay: 4s;  animation-duration: 28s; }
        .particle:nth-child(4)  { left: 40%; animation-delay: 1s;  animation-duration: 22s; }
        .particle:nth-child(5)  { left: 50%; animation-delay: 3s;  animation-duration: 24s; }
        .particle:nth-child(6)  { left: 60%; animation-delay: 5s;  animation-duration: 26s; }
        .particle:nth-child(7)  { left: 70%; animation-delay: 2s;  animation-duration: 21s; }
        .particle:nth-child(8)  { left: 80%; animation-delay: 4s;  animation-duration: 23s; }
        .particle:nth-child(9)  { left: 90%; animation-delay: 1s;  animation-duration: 27s; }
        .particle:nth-child(10) { left: 15%; animation-delay: 3s;  animation-duration: 19s; }
        .particle:nth-child(11) { left: 35%; animation-delay: 0s;  animation-duration: 30s; }
        .particle:nth-child(12) { left: 55%; animation-delay: 2s;  animation-duration: 18s; }
        .particle:nth-child(13) { left: 75%; animation-delay: 4s;  animation-duration: 29s; }
        .particle:nth-child(14) { left: 85%; animation-delay: 1s;  animation-duration: 22s; }
        .particle:nth-child(15) { left: 25%; animation-delay: 5s;  animation-duration: 25s; }

        @keyframes float {
          0%   { transform: translateY(100vh) scale(0); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(-100vh) scale(1); opacity: 0; }
        }

        /* ── Hero ── */
        .hero-section {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          position: relative;
          z-index: 1;
        }

        .container {
          text-align: center;
          max-width: 480px;
          width: 100%;
        }

        /* Fix 1: logo + headline as a centered flex column */
        .hero-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 20px;
        }

        .logo {
          height: 50px !important;
          width: auto !important;
          margin-bottom: 32px;
          filter: drop-shadow(0 0 30px rgba(181, 103, 58, 0.3));
          display: block;
        }

        .headline {
          font-size: 2.75rem;
          font-weight: 600;
          line-height: 1.2;
          letter-spacing: -0.02em;
          color: #ffffff;
          text-align: center;
        }

        .headline .highlight {
          color: #B5673A;
        }

        .subtitle {
          font-size: 1.1rem;
          font-weight: 300;
          color: #888888;
          line-height: 1.7;
          margin-bottom: 48px;
        }

        .form-container {
          margin-bottom: 16px;
        }

        #early-access-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        /* Turnstile widget centering */
        .turnstile-widget {
          display: flex;
          justify-content: center;
        }

        input {
          width: 100%;
          padding: 16px 20px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.03);
          color: #ffffff;
          font-family: 'Outfit', sans-serif;
          font-size: 1rem;
          font-weight: 400;
          transition: all 0.3s ease;
        }

        input::placeholder {
          color: #555555;
        }

        input:focus {
          outline: none;
          border-color: #B5673A;
          box-shadow: 0 0 0 3px rgba(181, 103, 58, 0.15), 0 0 20px rgba(181, 103, 58, 0.1);
          background: rgba(255, 255, 255, 0.05);
        }

        button {
          width: 100%;
          padding: 16px 24px;
          background: #B5673A;
          color: #ffffff;
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 6px;
        }

        button:hover:not(:disabled) {
          background: #C97A4A;
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(181, 103, 58, 0.3);
        }

        button:active {
          transform: translateY(0);
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .success-container {
          padding: 24px;
          text-align: center;
        }

        .success-container .checkmark {
          width: 48px;
          height: 48px;
          background: rgba(181, 103, 58, 0.15);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        .success-container .checkmark svg {
          width: 24px;
          height: 24px;
          color: #B5673A;
        }

        .success-container h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 8px;
        }

        .success-container p {
          color: #888888;
          font-size: 0.95rem;
        }

        .error-message {
          color: #E57373;
          margin-top: 12px;
          font-size: 0.9rem;
          text-align: center;
        }

        .coming-soon {
          margin-top: 56px;
          font-size: 0.75rem;
          font-weight: 500;
          color: #333333;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        /* ── What is Trailware? ── */
        .about-section {
          width: 100%;
          background: rgba(255, 255, 255, 0.015);
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          position: relative;
          z-index: 1;
          padding: 96px 20px 112px;
        }

        .about-container {
          max-width: 860px;
          margin: 0 auto;
          text-align: center;
        }

        .about-heading {
          font-size: 2.5rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 20px;
          letter-spacing: -0.03em;
        }

        .about-intro {
          font-size: 1.1rem;
          font-weight: 300;
          color: #999999;
          line-height: 1.8;
          margin-bottom: 56px;
          max-width: 620px;
          margin-left: auto;
          margin-right: auto;
        }

        .about-intro em {
          color: #B5673A;
          font-style: normal;
          font-weight: 500;
        }

        .feature-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 56px;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          padding: 32px 24px 28px;
          text-align: center;
          transition: border-color 0.3s ease, background 0.3s ease;
        }

        .feature-card:hover {
          border-color: rgba(181, 103, 58, 0.3);
          background: rgba(255, 255, 255, 0.035);
        }

        .card-icon {
          width: 52px;
          height: 52px;
          background: rgba(181, 103, 58, 0.1);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: #B5673A;
        }

        .card-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 10px;
          letter-spacing: -0.01em;
        }

        .card-text {
          font-size: 0.92rem;
          font-weight: 300;
          color: #999999;
          line-height: 1.65;
        }

        .cta-secondary {
          display: inline-block;
          width: auto;
          padding: 16px 36px;
          letter-spacing: 0.04em;
          text-transform: none;
          font-size: 1rem;
          font-weight: 500;
        }

        /* ── Responsive ── */
        @media (max-width: 480px) {
          .headline {
            font-size: 2rem;
          }
          .subtitle {
            font-size: 1rem;
            margin-bottom: 36px;
          }
          .logo {
            height: 40px !important;
            margin-bottom: 28px;
          }
          input, button {
            padding: 14px 18px;
          }
          .about-heading {
            font-size: 1.8rem;
          }
          .about-section {
            padding: 64px 20px 80px;
          }
          .feature-cards {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .feature-card {
            padding: 24px 20px 22px;
          }
        }
      `}</style>
    </>
  );
}
