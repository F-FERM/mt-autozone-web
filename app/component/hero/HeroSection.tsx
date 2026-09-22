import Image from "next/image";
import { Poppins } from "next/font/google";
import styles from "./herosection.module.css";
import bgCarImage from "../../../public/images/bgcar.png"
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-poppins",
});

const SERVICES = [
  {
    id: "detailing",
    label: "Complete Car Detailing & Cleaning",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="#E40000" strokeWidth="1.6" />
        <path
          d="M8 12.5l2.5 2.5L16 9.5"
          stroke="#E40000"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "paint-protection",
    label: "Advanced Paint Protection & Polishing",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 2l2.5 6.5L21 11l-6.5 2.5L12 20l-2.5-6.5L3 11l6.5-2.5L12 2z"
          stroke="#E40000"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "interior-exterior",
    label: "Premium Interior & Exterior Care",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M3 16V9a1 1 0 0 1 1-1h9l4 4h3a1 1 0 0 1 1 1v3"
          stroke="#E40000"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="7.5" cy="16.5" r="1.8" stroke="#E40000" strokeWidth="1.6" />
        <circle cx="17.5" cy="16.5" r="1.8" stroke="#E40000" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    id: "appearance",
    label: "Professional Vehicle Appearance Solutions",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="7" height="7" rx="1.2" stroke="#E40000" strokeWidth="1.6" />
        <rect x="14" y="3" width="7" height="7" rx="1.2" stroke="#E40000" strokeWidth="1.6" />
        <rect x="3" y="14" width="7" height="7" rx="1.2" stroke="#E40000" strokeWidth="1.6" />
        <path d="M17.5 14v7M14 17.5h7" stroke="#E40000" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
];

const STATS = [
  { id: "experience", value: "22", label: "Year Of\nExperience", className: styles.statExperience },
  { id: "satisfaction", value: "4.8", label: "customer\nSatisfaction", className: styles.statSatisfaction },
  { id: "cars", value: "22301", label: "Cars Served", className: styles.statCars },
];

export default function HeroSection() {
  return (
    <section className={`${styles.hero} ${poppins.variable}`}>
      {/* Background photo — replace /public/images/hero-bg.jpg with your own asset */}
      <Image
        src={bgCarImage}
        alt=""
        fill
        priority
        className={styles.bgImage}
       
      />
      <div className={styles.bgWash} aria-hidden="true" />

      {/* Wordmark */}
      <div className={styles.wordmarkLine1} aria-hidden="true">
        MT <span className={styles.wordmarkFaint}>AUTO</span>
      </div>
      <div className={styles.wordmarkLine2} aria-hidden="true">
        ZONE
      </div>

      {/* Stat callouts with connector lines */}
      {STATS.map((stat) => (
        <div key={stat.id} className={`${styles.stat} ${stat.className}`}>
          <div className={styles.statNumber}>{stat.value}</div>
          <div className={styles.statLabel}>
            {stat.label.split("\n").map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
          </div>
          <svg className={styles.connector} viewBox="0 0 40 90" fill="none">
            <path d="M2 2C2 40 38 40 38 80" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
          </svg>
          <span className={styles.dot} />
        </div>
      ))}

      {/* Card 1 — intro */}
      <div className={styles.cardIntro}>
        <Image
          src="/images/hero-card.jpg"
          alt="Detailed BMW M4 close-up"
          fill
          className={styles.cardIntroImage}
          sizes="30vw"
        />
        <div className={styles.cardIntroFade} aria-hidden="true" />
        <div className={styles.cardIntroContent}>
          <h2>Premium Care. Impeccable Finish.</h2>
          <p>
            Professional car detailing to restore, protect, and enhance your
            vehicle&rsquo;s appearance.
          </p>
        </div>
      </div>

      {/* Card 2 — services panel */}
      <div className={styles.cardServices}>
        <h3>Premium Automotive Detailing Solutions</h3>

        <ul className={styles.serviceList}>
          {SERVICES.map((service) => (
            <li key={service.id} className={styles.serviceItem}>
              <span className={styles.serviceIcon}>{service.icon}</span>
              <span>{service.label}</span>
            </li>
          ))}
        </ul>

        <button type="button" className={styles.exploreBtn}>
          Explore
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7 17L17 7M17 7H9M17 7V15"
              stroke="#fff"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Bottom description bar */}
      <div className={styles.bottomBar}>
        <p>
          Elevating every vehicle with professional detailing, body polishing,
          paint protection, window tinting, and complete interior &amp;
          exterior care.
        </p>
      </div>
    </section>
  );
}