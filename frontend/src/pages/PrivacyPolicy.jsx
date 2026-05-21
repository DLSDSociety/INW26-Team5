import { Link } from "react-router-dom";
import { FiShield, FiCheckCircle } from "react-icons/fi";
import "./StaticPages.css";

const SECTIONS = [
  {
    title: "1. Information We Collect",
    content:
      "We collect various types of information to provide and improve our services, including:",
    items: [
      "Account Profile: Name, email address, password, role type (candidate or recruiter), and contact details.",
      "Job Seeker Data: Resumes, skills, work experience, education, portfolio links, and salary expectations.",
      "Employer Data: Company description, logo, website, physical address, and job requirement details.",
      "Technical Data: IP address, browser type, operating system, and platform usage metrics collected via cookies."
    ]
  },
  {
    title: "2. How We Use Your Information",
    content:
      "Your data is used specifically to ensure a seamless experience on our platform:",
    items: [
      "To connect candidates with relevant job opportunities and employers.",
      "To process applications and send automated email updates/notifications.",
      "To verify user accounts and maintain trust and security across the platform.",
      "To analyze system performance and implement smart, user-friendly improvements."
    ]
  },
  {
    title: "3. Data Sharing & Disclosure",
    content:
      "We respect your privacy. Your information is shared only under specific circumstances:",
    items: [
      "When a candidate explicitly applies to a job, their profile and resume are shared with the respective employer.",
      "When an employer posts a job listing, the company profile and details are displayed publicly to candidates.",
      "To comply with legal obligations, enforce our terms, or protect the safety and rights of our users."
    ]
  },
  {
    title: "4. Data Security",
    content:
      "We implement industry-standard administrative, technical, and physical security measures to safeguard your personal information against unauthorized access, loss, alteration, or disclosure. All sensitive data is encrypted, and we regularly monitor our systems for potential vulnerabilities."
  },
  {
    title: "5. Your Rights and Choices",
    content:
      "You have full control over your personal data on JobPortal:",
    items: [
      "Access & Update: You can review, update, or edit your account information and profile details at any time.",
      "Data Deletion: You can request the deletion of your account and all associated personal data by contacting us.",
      "Communication Preferences: You can opt-out of promotional emails, though critical system notifications will still be sent."
    ]
  },
  {
    title: "6. Cookies and Tracking",
    content:
      "We use cookies and similar tracking technologies to enhance user session persistence, analyze traffic patterns, and customize your experience. You can choose to disable cookies through your browser settings, though some platform features may not function optimally as a result."
  },
  {
    title: "7. Children's Privacy",
    content:
      "JobPortal is intended for individuals who are at least 16 years of age. We do not knowingly collect personal data from anyone under the age of 16. If we become aware that we have collected personal data from a child, we will take immediate steps to delete it."
  },
  {
    title: "8. Changes to this Policy",
    content:
      "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the 'Last updated' date. We encourage you to review this policy periodically for any changes."
  },
  {
    title: "9. Contact Us",
    content:
      "If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact our Privacy Team at support@jobportal.in."
  }
];

export default function PrivacyPolicy() {
  return (
    <div className="static-page">
      <div className="static-hero">
        <div className="breadcrumb">
          <Link to="/">Home</Link> / Privacy Policy
        </div>
        <h1>Privacy Policy</h1>
        <p>
          Learn how we protect, collect, and handle your personal data securely.
        </p>
      </div>

      <div className="static-content">
        <p className="legal-update">Last updated: May 2025</p>

        {SECTIONS.map((s) => (
          <div key={s.title} className="static-section">
            <h2>
              <FiShield size={18} />
              {s.title}
            </h2>
            {s.content && <p>{s.content}</p>}
            {s.items && (
              <ul>
                {s.items.map((item) => (
                  <li key={item}>
                    <span className="li-icon">
                      <FiCheckCircle size={12} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        <div className="static-section">
          <div className="highlight-box">
            <p>
              Your trust is our priority. We are committed to transparency and will never sell your personal data.
              For more information on platform usage, read our{" "}
              <Link to="/terms" style={{ color: "#f97316", fontWeight: 600 }}>
                Terms of Service
              </Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
