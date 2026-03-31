"use client";

import { useState } from "react";
import Image from "next/image";

type FormState = "idle" | "loading" | "success" | "duplicate" | "error";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorText, setErrorText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

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

      <div className="container">
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

        <p className="subtitle">
          A new way to explore. Stay informed. Stay safe.
          <br />
          Be the first to experience it.
        </p>

        <div className="form-container">
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

        .container {
          text-align: center;
          max-width: 480px;
          width: 100%;
          position: relative;
          z-index: 1;
        }

        .logo {
          height: 50px !important;
          width: auto !important;
          margin-bottom: 48px;
          filter: drop-shadow(0 0 30px rgba(181, 103, 58, 0.3));
        }

        .headline {
          font-size: 2.75rem;
          font-weight: 600;
          margin-bottom: 20px;
          line-height: 1.2;
          letter-spacing: -0.02em;
          color: #ffffff;
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
            margin-bottom: 36px;
          }
          input, button {
            padding: 14px 18px;
          }
        }
      `}</style>
    </>
  );
}
