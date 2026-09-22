"use client";

// Keep your existing BG_IMAGE constant exactly as it was in your file —
// paste the same base64 string back in here. It's used below as CAR_IMAGE,
// masked so it reads as a "cutout" floating over the dark backdrop.
const BG_IMAGE = "/images/bmw.png";

const CAR_IMAGE = BG_IMAGE;

const services = [
  {
    label: "Complete Car Detailing & Cleaning",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
    ),
  },
  {
    label: "Advanced Paint Protection & Polishing",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2l3 6 6 1-4.5 4.5L18 20l-6-3-6 3 1.5-6.5L3 9l6-1z" />
      </svg>
    ),
  },
  {
    label: "Premium Interior & Exterior Care",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 13l1.5-5A2 2 0 0 1 6.4 7h11.2a2 2 0 0 1 1.9 1.5L21 13" />
        <path d="M3 13h18v4H3z" />
        <circle cx="7" cy="19" r="1.4" />
        <circle cx="17" cy="19" r="1.4" />
      </svg>
    ),
  },
  {
    label: "Professional Vehicle Appearance Solutions",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
];

export default function Hero() {
  return (
    <section className="hero">
      {/* dark backdrop — no photo here, just tone + a little smoke */}
      <div className="heroBackdrop" />

      {/* wordmark sits behind the car, full bleed */}
      <div className="heroWordmark">
        <span className="wordmarkSolid">MT AUTO</span>
        <span className="wordmarkGhost">ZONE</span>
      </div>

      {/* the car — now full width/height (cover), masked only at the very
          edges so it fills the frame instead of sitting in a boxed-in area */}
      <div
        className="heroCar"
        style={{ backgroundImage: `url(${CAR_IMAGE})` }}
      />

      <div className="content">
        {/* top row: intro card + services card (unchanged) */}
        <div className="topRow">
          <div className="introCard">
            <h2>Premium Care. Impeccable Finish.</h2>
            <p>
              Professional car detailing to restore, protect, and enhance your
              vehicle&apos;s appearance.
            </p>
          </div>

          <div className="servicesCard">
            <h3>Premium Automotive Detailing Solutions</h3>
            <ul className="servicesList">
              {services.map((service) => (
                <li key={service.label}>
                  <span className="iconBadge">{service.icon}</span>
                  {service.label}
                </li>
              ))}
            </ul>

            <button type="button" className="exploreBtn">
              Explore
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </button>
          </div>
        </div>

        {/* STAGE: just reserves vertical room + carries the leader-lines and
            stat bubbles that point down onto the full-bleed car behind it */}
        <div className="stage">
          {/* leader-lines + stat bubbles pointing at the car */}
          <svg
            className="stageLines"
            viewBox="0 0 1000 560"
            preserveAspectRatio="none"
          >
            <path
              d="M 860 70 C 760 70, 660 120, 555 235"
              className="leaderPath"
            />
            <circle cx="555" cy="235" r="4" className="leaderDot" />

            <path
              d="M 150 420 C 260 400, 360 380, 435 340"
              className="leaderPath"
            />
            <circle cx="435" cy="340" r="4" className="leaderDot" />

            <path
              d="M 870 500 C 780 470, 700 440, 645 400"
              className="leaderPath"
            />
            <circle cx="645" cy="400" r="4" className="leaderDot" />
          </svg>

          <div className="statFloat statExp">
            <span className="num">22</span>
            <span className="label">
              Year Of
              <br />
              Experience
            </span>
          </div>

          <div className="statFloat statSat">
            <span className="num">4.8</span>
            <span className="label">
              customer
              <br />
              Satisfaction
            </span>
          </div>

          <div className="statFloat statCars">
            <span className="num">22301</span>
            <span className="label">Cars Served</span>
          </div>
        </div>

        {/* bottom row */}
        <div className="bottomRow">
          <p className="bottomCopy">
            Elevating every vehicle with professional detailing, body polishing,
            paint protection, window tinting, and complete interior &amp;
            exterior care.
          </p>
        </div>
      </div>

      <style jsx>{`
        .hero {
          position: relative;
          width: 100%;
          min-height: 100vh;
          overflow: hidden;
          background: #000;
          padding-top: env(safe-area-inset-top, 0px);
          padding-bottom: env(safe-area-inset-bottom, 0px);
          font-family: "Inter", "Helvetica Neue", Arial, sans-serif;
          color: #f2f0ec;
        }

        .heroBackdrop {
          position: absolute;
          inset: 0;
          z-index: 0;
          background:
            radial-gradient(
              ellipse 70% 55% at 50% 35%,
              rgba(255, 255, 255, 0.06),
              transparent 65%
            ),
            radial-gradient(
              ellipse 90% 70% at 15% 90%,
              rgba(255, 255, 255, 0.04),
              transparent 60%
            ),
            linear-gradient(180deg, #050505 0%, #0c0c0c 55%, #030303 100%);
        }

        .content {
          position: relative;
          z-index: 3;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: clamp(28px, 5vw, 64px) clamp(20px, 5vw, 56px);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .topRow {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 24px;
          flex-wrap: wrap;
        }

        .introCard {
          background: linear-gradient(
            135deg,
            rgba(10, 10, 10, 0.72),
            rgba(10, 10, 10, 0.45)
          );
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          padding: 22px 26px;
          max-width: 360px;
        }

        .introCard h2 {
          font-size: clamp(1.15rem, 1.6vw, 1.45rem);
          font-weight: 600;
          line-height: 1.25;
          margin-bottom: 10px;
          letter-spacing: -0.01em;
        }

        .introCard p {
          font-size: 0.92rem;
          line-height: 1.55;
          color: #b9b6b1;
          max-width: 300px;
          margin: 0;
        }

        .servicesCard {
          background: rgba(12, 12, 12, 0.62);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          padding: 30px 32px 26px;
          width: 100%;
          max-width: 400px;
        }

        .servicesCard h3 {
          font-size: clamp(1.3rem, 1.9vw, 1.65rem);
          font-weight: 600;
          line-height: 1.3;
          margin-bottom: 22px;
          letter-spacing: -0.01em;
        }

        .servicesList {
          list-style: none;
          display: flex;
          flex-direction: column;
          margin: 0;
          padding: 0;
        }

        .servicesList li {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 13px 0;
          font-size: 0.95rem;
          color: #e9e7e3;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }

        .servicesList li:last-of-type {
          border-bottom: none;
        }

        .iconBadge {
          flex: 0 0 auto;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(226, 38, 58, 0.14);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #e2263a;
        }

        .iconBadge svg {
          width: 15px;
          height: 15px;
        }

        .exploreBtn {
          margin-top: 22px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.16);
          color: #f2f0ec;
          font-size: 0.95rem;
          font-weight: 500;
          padding: 14px 0;
          border-radius: 999px;
          cursor: pointer;
          transition:
            background 0.25s ease,
            border-color 0.25s ease;
        }

        .exploreBtn:hover {
          background: rgba(255, 255, 255, 0.09);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .exploreBtn svg {
          width: 15px;
          height: 15px;
        }

        /* ---------- full-bleed wordmark + car layers (behind .content) ---------- */

        .heroWordmark {
          position: absolute;
          inset: 0;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(10px, 2vw, 26px);
          font-family: "Arial Black", "Helvetica Neue", sans-serif;
          font-weight: 900;
          letter-spacing: -0.02em;
          line-height: 0.85;
          user-select: none;
          pointer-events: none;
        }

        .wordmarkSolid {
          color: #fdfdfc;
          font-size: clamp(3.4rem, 9vw, 7.6rem);
        }

        .wordmarkGhost {
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.28);
          font-size: clamp(3.4rem, 9vw, 7.6rem);
        }

        .heroCar {
          position: absolute;
          inset: 0;
          z-index: 2;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center 58%;
          background-repeat: no-repeat;
          filter: saturate(1.05) contrast(1.05);
          /* opaque only over roughly where the car itself sits — fades to
             transparent well before the sides, so the wordmark shows
             through on the left and right like the reference shot */
          -webkit-mask-image: radial-gradient(
            ellipse 46% 78% at 50% 58%,
            #000 40%,
            transparent 78%
          );
          mask-image: radial-gradient(
            ellipse 46% 78% at 50% 58%,
            #000 40%,
            transparent 78%
          );
        }

        /* ---------- STAGE: reserves layout room + carries leaders/stats ---------- */

        .stage {
          position: relative;
          flex: 1;
          min-height: 46vh;
          margin: 10px 0;
        }

        .stageLines {
          position: absolute;
          inset: 0;
          z-index: 3;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .leaderPath {
          fill: none;
          stroke: rgba(255, 255, 255, 0.45);
          stroke-width: 1.2;
        }

        .leaderDot {
          fill: rgba(255, 255, 255, 0.85);
        }

        .statFloat {
          position: absolute;
          z-index: 3;
          display: flex;
          flex-direction: column;
          gap: 2px;
          pointer-events: none;
        }

        .statFloat .num {
          font-size: clamp(1.6rem, 3vw, 2.3rem);
          font-weight: 700;
          letter-spacing: -0.01em;
        }

        .statFloat .label {
          font-size: 0.78rem;
          color: #b9b6b1;
          line-height: 1.3;
        }

        .statExp {
          top: 2%;
          right: 8%;
          text-align: left;
        }

        .statSat {
          bottom: 14%;
          left: 3%;
          text-align: left;
        }

        .statCars {
          bottom: 2%;
          right: 4%;
          text-align: right;
        }

        /* ---------- bottom row ---------- */

        .bottomRow {
          display: flex;
          align-items: flex-end;
          justify-content: flex-start;
        }

        .bottomCopy {
          background: rgba(8, 8, 8, 0.4);
          backdrop-filter: blur(3px);
          padding: 14px 18px;
          border-radius: 4px;
          max-width: 620px;
          font-size: clamp(0.9rem, 1.1vw, 1.02rem);
          line-height: 1.55;
          color: #ece9e4;
          margin: 0;
        }

        @media (max-width: 900px) {
          .topRow {
            flex-direction: column;
          }
          .servicesCard,
          .introCard {
            max-width: 100%;
          }
          .stage {
            min-height: 60vh;
          }
          .statExp,
          .statSat,
          .statCars {
            position: static;
            margin: 6px 0;
          }
        }

        @media (max-width: 520px) {
          .wordmarkSolid,
          .wordmarkGhost {
            font-size: 2.6rem;
          }
        }
      `}</style>
    </section>
  );
}
