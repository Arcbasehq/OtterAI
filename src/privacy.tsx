import './privacy.css';
import { House } from 'lucide-react';

const articleSections = [
  {
    title: 'About OtterAI',
    paragraphs: [
      'OtterAI builds conversational software with privacy in mind.',
      'We keep the experience simple and only use information that is needed to run the product, support users, and improve the service.',
      'If a feature needs data, we try to make that clear and keep the use limited to the feature itself.',
    ],
  },
  {
    title: 'What We Use',
    paragraphs: [
      'We may use basic storage to remember preferences and keep the product working as expected.',
      'We do not aim to build detailed personal profiles from your activity.',
    ],
  },
  {
    title: 'Sharing',
    paragraphs: [
      'Some parts of OtterAI may rely on outside services to function.',
      'When that happens, we keep sharing limited to what the feature needs.',
    ],
  },
  {
    title: 'Updates',
    paragraphs: [
      'If this page changes, we will update it here.',
    ],
  },
];

export default function Privacy({ onBack }: { onBack: () => void }) {
  return (
    <main className="privacy-page">
      <header className="privacy-topbar">
        <button className="privacy-brand" type="button" onClick={onBack}>
          <span className="privacy-brand__mark">
            <img src="/icon.png" alt="OtterAI" className="privacy-brand__logo" />
          </span>
          <span className="privacy-brand__name">OtterAI</span>
        </button>
        <button className="privacy-menu" type="button" onClick={onBack} aria-label="Close privacy page">
          <House size={20} strokeWidth={2.2} />
        </button>
      </header>

      <section className="privacy-hero">
        <p className="privacy-hero__kicker">Privacy Policy</p>
        <h1>We keep it simple.</h1>
        <p className="privacy-hero__lede">Our privacy approach is built around clarity, restraint, and respect for the people who use OtterAI.</p>
      </section>

      <section className="privacy-content">
        {articleSections.map((section) => (
          <article key={section.title} className="privacy-section">
            <h2>{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>
        ))}
      </section>
    </main>
  );
}
