import { useEffect } from 'react';
import './privacy.css';
import { House } from 'lucide-react';

export default function Privacy({ onBack }: { onBack: () => void }) {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const prevRootOverflow = root.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    root.style.overflow = 'auto';
    body.style.overflow = 'auto';
    return () => {
      root.style.overflow = prevRootOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, []);
  return (
    <main className="privacy-page">
      <header className="privacy-topbar">
        <button className="privacy-brand" type="button" onClick={onBack}>
          <span className="privacy-brand__mark">
            <img
              src="/icon.svg"
              alt="Quokka AI"
              className="privacy-brand__logo"
            />
          </span>
          <span className="privacy-brand__name">Quokka AI</span>
        </button>
        <button
          className="privacy-menu"
          type="button"
          onClick={onBack}
          aria-label="Return home"
        >
          <House size={20} strokeWidth={2.2} />
        </button>
      </header>

      <section className="privacy-hero">
        <p className="privacy-hero__kicker">Privacy Policy</p>
        <h1>Private by design.</h1>
        <p className="privacy-hero__lede">
          Quokka AI is built on the principle that your conversations should
          stay yours. This policy explains what we collect, why, and how you
          stay in control.
        </p>
      </section>

      <section className="privacy-content">
        <article className="privacy-section">
          <h2>1. What Quokka AI Is</h2>
          <p>
            Quokka AI is a private AI chat application that connects you to
            large language models. You ask questions, the model responds. We
            focus on keeping that interaction as private and lightweight as
            possible.
          </p>
        </article>

        <article className="privacy-section">
          <h2>2. Information You Provide</h2>
          <p>
            When you type a message and send it, we transmit that message and
            the conversation context to our AI model provider so it can
            generate a response. We do not permanently store your messages or
            the model's replies on our servers.
          </p>
          <p>
            If you enable Chat History, your conversations are saved locally
            on your device in browser storage so you can return to previous
            chats. We never sync or upload your chat history to our servers
            unless you are actively sending a message and it is temporarily
            in transit.
          </p>
        </article>

        <article className="privacy-section">
          <h2>3. Approximate Location</h2>
          <p>
            Quokka AI can include your browser language and timezone with
            requests to improve time-aware and locale-aware answers. This is
            optional and controlled by the Use Approximate Location setting.
            Quokka AI never sends your precise location, IP-derived location,
            city, or address.
          </p>
        </article>

        <article className="privacy-section">
          <h2>4. Information Stored Locally</h2>
          <p>
            When Chat History is enabled, we store the following on your
            device using your browser's local storage:
          </p>
          <ul>
            <li>Your conversation threads and messages</li>
            <li>Your appearance theme preference (light or dark)</li>
            <li>Your reasoning mode preference (normal or fast)</li>
            <li>Your Chat History and Approximate Location settings</li>
            <li>Your sidebar collapsed state</li>
            <li>Draft messages you haven't sent yet</li>
          </ul>
          <p>
            None of this local data is accessible to us. It lives entirely on
            your device and can be cleared at any time by disabling Chat
            History or clearing your browser data.
          </p>
        </article>

        <article className="privacy-section">
          <h2>5. Temporary Network Storage</h2>
          <p>
            When Chat History is enabled, new prompts and responses are
            encrypted and temporarily stored on a server after being sent.
            This helps recover a chat if you lose your internet connection
            mid-conversation. These temporary copies are automatically
            deleted and are not retained after delivery.
          </p>
        </article>

        <article className="privacy-section">
          <h2>6. AI Model Providers</h2>
          <p>
            Quokka AI sends your messages to third-party AI model providers to
            generate responses. The specific provider depends on the model
            you are using. Our primary provider operates under a zero data
            retention policy for API requests, meaning they do not store the
            content of your conversations on their systems after the response
            is delivered.
          </p>
          <p>
            All model providers used by Quokka AI are contractually prevented
            from using your conversations to train their AI models.
          </p>
        </article>

        <article className="privacy-section">
          <h2>7. Analytics and Performance</h2>
          <p>
            We use Umami Analytics to understand application usage and
            performance. This collects anonymized technical data such as page
            views and session durations. Umami does not use cookies and does
            not collect personal data or the content of your conversations.
          </p>
        </article>

        <article className="privacy-section">
          <h2>8. Cookies</h2>
          <p>
            Quokka AI does not use advertising cookies, tracking cookies, or
            third-party marketing cookies. The only data we store in your
            browser is through local storage for the preferences and features
            described above. You can disable local storage through your
            browser settings, though this will prevent Chat History and
            preferences from working.
          </p>
        </article>

        <article className="privacy-section">
          <h2>9. How We Share Information</h2>
          <p>
            We share your messages with AI model providers solely to generate
            responses. We share anonymized usage data with Umami for
            application analytics. Beyond these service providers, we do not
            sell, rent, or share your information with third parties.
          </p>
        </article>

        <article className="privacy-section">
          <h2>10. Your Choices and Control</h2>
          <p>You have full control over your data through in-app settings:</p>
          <ul>
            <li>
              <strong>Chat History</strong> &mdash; Disable to prevent any
              local storage of conversations and stop temporary server-side
              storage of new messages.
            </li>
            <li>
              <strong>Clear All Chats</strong> &mdash; Permanently delete
              every conversation thread stored on your device.
            </li>
            <li>
              <strong>Delete Individual Chats</strong> &mdash; Remove
              specific conversation threads from your local storage.
            </li>
            <li>
              <strong>Use Approximate Location</strong> &mdash; Toggle
              whether your language and timezone are included in API
              requests.
            </li>
          </ul>
          <p>
            Because your data is stored locally, you can also clear it at any
            time by clearing your browser's site data for Quokka AI.
          </p>
        </article>

        <article className="privacy-section">
          <h2>11. Data Security</h2>
          <p>
            Conversations sent to model providers are transmitted over
            encrypted HTTPS connections. Locally stored data is protected by
            your browser's security model. Quokka AI does not require account
            creation, so there is no password or credential database to
            protect.
          </p>
        </article>

        <article className="privacy-section">
          <h2>12. Children's Privacy</h2>
          <p>
            Quokka AI is not directed at children under the age of 13, and we
            do not knowingly collect personal information from children. If
            you believe a child has provided personal information through
            Quokka AI, please contact us so we can delete it.
          </p>
        </article>

        <article className="privacy-section">
          <h2>13. International Users</h2>
          <p>
            Quokka AI and its model providers operate servers in various
            jurisdictions, potentially including the United States, Europe,
            and other regions. By using Quokka AI, you understand that your
            messages may be transmitted to and processed in countries outside
            your own. We take steps to ensure that adequate data protection
            safeguards apply regardless of where processing occurs.
          </p>
        </article>

        <article className="privacy-section">
          <h2>14. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. When we do,
            we will revise the updated date at the bottom of this page. We
            encourage you to review this policy periodically. Continued use
            of Quokka AI after changes are posted constitutes acceptance of
            the updated policy.
          </p>
        </article>

        <article className="privacy-section">
          <h2>15. Contact</h2>
          <p>
            Quokka AI is built and maintained by{' '}
            <a href="https://libreapps.xyz" rel="noopener noreferrer">
              Libre
            </a>
            . If you have questions about this privacy policy, your data, or
            our privacy practices, you can reach us through the Libre
            website.
          </p>
        </article>
      </section>

      <footer className="privacy-footer">
        <p>Last updated: June 2025</p>
      </footer>
    </main>
  );
}
