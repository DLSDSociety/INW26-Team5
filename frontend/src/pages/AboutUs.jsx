import { Link } from "react-router-dom";
import {
  FiTarget, FiUsers, FiShield, FiHeart,
  FiCheckCircle, FiGlobe, FiAward, FiZap
} from "react-icons/fi";
import "./StaticPages.css";

const VALUES = [
  {
    icon: <FiTarget size={22} />,
    title: "Mission-Driven",
    desc: "Bridging the gap between talented professionals and top companies across India.",
  },
  {
    icon: <FiShield size={22} />,
    title: "Trust & Safety",
    desc: "Every listing is verified. We prioritize your data privacy and security.",
  },
  {
    icon: <FiZap size={22} />,
    title: "Innovation",
    desc: "AI-powered job matching, resume analysis, and smart recommendations.",
  },
  {
    icon: <FiHeart size={22} />,
    title: "Community First",
    desc: "Built by interns, for the community. Free forever for job seekers.",
  },
];

const TEAM = [
  { name: "Mustafa Azad Hussain", role: "Full Stack Developer", initials: "MA" },
  { name: "DLSDS Team", role: "Project Mentors", initials: "DL" },
];

export default function AboutUs() {
  return (
    <div className="static-page">
      <div className="static-hero">
        <div className="breadcrumb">
          <Link to="/">Home</Link> / About Us
        </div>
        <h1>About JobPortal</h1>
        <p>
          India's premier tech job platform — connecting talented professionals
          with top companies through AI-powered matching.
        </p>
      </div>

      <div className="static-content">

        {/* Our Story */}
        <div className="static-section">
          <h2>
            <FiGlobe size={20} />
            Our Story
          </h2>
          <p>
            JobPortal was born out of the Digital Literacy and Skill Development
            Society (DLSDS) internship program, with a simple mission: make job
            hunting in India's tech industry less painful and more rewarding.
          </p>
          <p>
            We noticed that talented developers, designers, and data scientists
            were spending weeks scrolling through generic job boards. Meanwhile,
            companies struggled to find the right fit. JobPortal bridges that gap
            with curated listings, intelligent recommendations, and a seamless
            application experience.
          </p>
        </div>

        {/* Our Values */}
        <div className="static-section">
          <h2>
            <FiAward size={20} />
            Our Values
          </h2>
          <div className="static-cards">
            {VALUES.map((v) => (
              <div key={v.title} className="static-card">
                <div className="card-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What We Offer */}
        <div className="static-section">
          <h2>
            <FiCheckCircle size={20} />
            What We Offer
          </h2>
          <ul>
            {[
              "10,000+ curated tech job listings across India",
              "AI-powered resume analysis and job matching",
              "One-click applications with resume upload",
              "Real-time application status tracking",
              "Employer dashboard for posting and managing jobs",
              "Completely free for job seekers — always",
            ].map((item) => (
              <li key={item}>
                <span className="li-icon">
                  <FiCheckCircle size={12} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Our Team */}
        <div className="static-section">
          <h2>
            <FiUsers size={20} />
            Our Team
          </h2>
          <p>
            Built with care during the DLSDS internship program by passionate
            developers who believe technology should make opportunities
            accessible to everyone.
          </p>
          <div className="team-grid">
            {TEAM.map((m) => (
              <div key={m.name} className="team-member">
                <div className="team-avatar">{m.initials}</div>
                <h4>{m.name}</h4>
                <span>{m.role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="static-section">
          <div className="static-cta">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of professionals finding their dream careers.</p>
            <Link to="/register">
              <button className="cta-btn">Create Free Account</button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
