import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import { PanelLeft, Shield, X, NotebookPen, ArrowUp, Settings, MessageSquarePlus, ChevronDown, ShieldCheck, MessageCircleMore, PenLine } from 'lucide-react';

type Message = {
  id: string;
  role: 'user';
  content: string;
  createdAt: number;
};

type Thread = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
};

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildThreadTitle(content: string) {
  const compact = content.replace(/\s+/g, ' ').trim();
  if (compact.length <= 28) return compact;
  return `${compact.slice(0, 27).trimEnd()}…`;
}

function Tooltip({
  text,
  children,
}: {
  text: string;
  children: React.ReactElement;
}) {
  return (
    <span className="tooltip" data-tooltip={text} aria-label={text}>
      {children}
    </span>
  );
}

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [draft, setDraft] = useState('');
  const [privatePopupOpen, setPrivatePopupOpen] = useState(false);
  const [settingsPopupOpen, setSettingsPopupOpen] = useState(false);
  const [appearanceTheme, setAppearanceTheme] = useState<'light' | 'dark'>('light');
  const [approximateLocation, setApproximateLocation] = useState(true);
  const [chatHistory, setChatHistory] = useState(true);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setHydrated(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const activeThread = useMemo(
    () => threads.find((thread) => thread.id === activeThreadId) ?? null,
    [activeThreadId, threads],
  );

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [activeThread?.messages.length, activeThreadId]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.repeat) return;

      const isMod = event.ctrlKey || event.metaKey;
      const key = event.key.toLowerCase();

      if (key === 'escape') {
        if (privatePopupOpen) {
          setPrivatePopupOpen(false);
        }
        return;
      }

      if (isMod && event.shiftKey && key === 'o') {
        event.preventDefault();
        newChat();
        return;
      }

      if (isMod && event.shiftKey && key === 's') {
        event.preventDefault();
        setSidebarCollapsed((value) => !value);
        return;
      }

      if (isMod && key === 'enter') {
        const target = event.target as HTMLElement | null;
        if (target?.tagName === 'TEXTAREA' || target?.tagName === 'INPUT') {
          event.preventDefault();
          const textarea = target as HTMLTextAreaElement;
          sendMessage(textarea.value);
        }
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [privatePopupOpen, sendMessage, newChat]);

  function newChat() {
    const thread: Thread = {
      id: createId(),
      title: 'New chat',
      messages: [],
      createdAt: Date.now(),
    };

    setThreads((current) => [thread, ...current]);
    setActiveThreadId(thread.id);
    setDraft('');
  }

  function sendMessage(text: string) {
    const content = text.trim();
    if (!content) return;

    const message: Message = {
      id: createId(),
      role: 'user',
      content,
      createdAt: Date.now(),
    };

    let threadId: string = activeThreadId ?? '';

    if (!threadId) {
      threadId = createId();
      setThreads((current) => [
        {
          id: threadId,
          title: buildThreadTitle(content),
          messages: [message],
          createdAt: message.createdAt,
        },
        ...current,
      ]);
      setActiveThreadId(threadId);
      setDraft('');
      return;
    }

    setThreads((current) =>
      current.map((thread) => {
        if (thread.id !== threadId) return thread;
        return {
          ...thread,
          title:
            thread.messages.length === 0
              ? buildThreadTitle(content)
              : thread.title,
          messages: [...thread.messages, message],
          createdAt: message.createdAt,
        };
      }),
    );
    setDraft('');
  }

  return (
    <div className={`app ${appearanceTheme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
      <Sidebar
        threads={threads}
        activeThreadId={activeThreadId}
        collapsed={sidebarCollapsed}
        onNewChat={newChat}
        onSelectThread={setActiveThreadId}
        onToggleCollapse={() => setSidebarCollapsed((value) => !value)}
        onOpenPrivatePopup={() => setPrivatePopupOpen(true)}
        onOpenSettingsPopup={() => setSettingsPopupOpen(true)}
      />

      <ChatArea
        thread={activeThread}
        draft={draft}
        hydrated={hydrated}
        onDraftChange={setDraft}
        onSend={sendMessage}
        listRef={listRef}
        onOpenPrivatePopup={() => setPrivatePopupOpen(true)}
      />

      <SkeletonLoader visible={!hydrated} />

      {privatePopupOpen && (
        <div
          className="modal-overlay"
          onClick={() => setPrivatePopupOpen(false)}
        >
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="private-popup-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              type="button"
              onClick={() => setPrivatePopupOpen(false)}
              aria-label="Close popup"
            >
              <X />
            </button>
            <h2 id="private-popup-title" className="modal-title">
              <Shield /> Private by design
            </h2>
            <hr></hr>
            <p className="modal-copy">Zero data retention for this chat.</p>
            <p className="modal-copy">
              This model provider does not store any data associated with this
              chat. Other model providers follow a limited data retention model.
            </p>
            
            <hr></hr>
            <p className="modal-copy">No AI training.</p>
            <p className="modal-copy">
              All model providers are prevented from training their AI on your conversations.
            </p>
            <hr></hr>
            <img src="/Otter.gif" alt="Otter animation" className='gif'/>
          </div>
        </div>
      )}

      {settingsPopupOpen && (
        <div className="modal-overlay" onClick={() => setSettingsPopupOpen(false)}>
          <div
            className="modal-card settings-modal settings-dock"
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-popup-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              type="button"
              onClick={() => setSettingsPopupOpen(false)}
              aria-label="Close settings"
            >
              <X />
            </button>
            <h2 id="settings-popup-title" className="modal-title settings-dock__title">
              Otter AI Settings
            </h2>

            <div className="settings-dock__row">
              <div className="settings-dock__label">Appearance</div>
              <div className="settings-dock__segmented">
                <button
                  className={`settings-dock__segment ${appearanceTheme === 'light' ? 'is-active' : ''}`}
                  type="button"
                  onClick={() => {
                    setAppearanceTheme('light');
                  }}
                >
                  Light
                </button>
                <button
                  className={`settings-dock__segment ${appearanceTheme === 'dark' ? 'is-active' : ''}`}
                  type="button"
                  onClick={() => {
                    setAppearanceTheme('dark');
                  }}
                >
                  Dark
                </button>
              </div>
            </div>

            <div className="settings-dock__row settings-dock__row--stacked">
              <div className="settings-dock__row-head">
                <div className="settings-dock__label">Chat History</div>
                <button
                  className={`settings-dock__switch ${chatHistory ? 'is-on' : ''}`}
                  type="button"
                  aria-pressed={chatHistory}
                  onClick={() => setChatHistory((value) => !value)}
                >
                  <span className="settings-dock__knob" />
                </button>
              </div>
              <p className="settings-dock__copy">
                Chats are stored locally on your device. New prompts and responses are encrypted and temporarily stored on a DuckDuckGo server after being sent, to help recover a chat if you lose your internet connection. Disabling chat history will delete pinned chats and disable the temporary storage of new prompts and responses.
              </p>
            </div>

            <div className="settings-dock__row settings-dock__row--stacked">
              <div className="settings-dock__row-head">
                <div className="settings-dock__label">Use Approximate Location</div>
                <button
                  className={`settings-dock__switch ${approximateLocation ? 'is-on' : ''}`}
                  type="button"
                  aria-pressed={approximateLocation}
                  onClick={() => setApproximateLocation((value) => !value)}
                >
                  <span className="settings-dock__knob" />
                </button>
              </div>
              <p className="settings-dock__copy">
                Share a city-level location with AI models to improve relevancy. Otter AI never reveals your precise location to us or AI models. Learn more
              </p>
            </div>



                        {/* 
            <div className="settings-dock__row">
              <div className="settings-dock__label">Display Language</div>
              <select className="settings-dock__select" defaultValue="Browser Preferred Language">
                <option>Browser Preferred Language</option>
              </select>
            </div>
*/}

            <div className="settings-dock__row settings-dock__footer-row">
              <div className="settings-dock__label">Enjoying Otter AI?</div>
              <div className="settings-dock__votes">
                <button type="button" className="settings-dock__vote">👍</button>
                <button type="button" className="settings-dock__vote">👎</button>
              </div>
            </div>

            {/* 
<div className="settings-dock__links">
  <button type="button" className="settings-dock__link-button">
    Help Pages
  </button>
  <button type="button" className="settings-dock__link-button">
    Privacy Policy &amp; Terms of Service
  </button>
</div> 
*/}
          </div>
        </div>
      )}
    </div>
  );
}

type SidebarProps = {
  threads: Thread[];
  activeThreadId: string | null;
  collapsed: boolean;
  onNewChat: () => void;
  onSelectThread: (id: string) => void;
  onToggleCollapse: () => void;
  onOpenPrivatePopup: () => void;
  onOpenSettingsPopup: () => void;
};

function Sidebar({
  threads,
  activeThreadId,
  collapsed,
  onNewChat,
  onSelectThread,
  onToggleCollapse,
  onOpenPrivatePopup,
  onOpenSettingsPopup,
}: SidebarProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <aside className={`sidebar ${collapsed ? 'is-collapsed' : ''}`}>
      <div className="sidebar__top">
        {collapsed ? (
          <Tooltip text="Open sidebar">
            <button
              className="sidebar__toggle-button"
              type="button"
              onClick={onToggleCollapse}
              aria-label="Open sidebar"
              title="Open sidebar"
            >
              <PanelLeft size={22} />
            </button>
          </Tooltip>
        ) : (
          <>
            <div className="sidebar__brand">
              <span className="sidebar__brand-mark">
                <img src="/icon.png" alt="Otter AI" className="sidebar__logo-image" />
              </span>
              <span className="sidebar__brand-text">Otter AI</span>
            </div>
            <Tooltip text="Close sidebar">
              <button
                className="sidebar__close-button"
                type="button"
                onClick={onToggleCollapse}
                aria-label="Close sidebar"
                title="Close sidebar"
              >
                <PanelLeft size={18} />
              </button>
            </Tooltip>
          </>
        )}
      </div>

      {collapsed ? (
        <div className="sidebar-rail">
          <Tooltip text="Start a new chat">
            <button
              className="sidebar-rail__button"
              onClick={onNewChat}
              type="button"
              aria-label="Start a new chat"
              title="Start a new chat"
            >
              <MessageSquarePlus size={22} />
            </button>
          </Tooltip>
          <Tooltip text="Notes">
            <button className="sidebar-rail__button" type="button" aria-label="Notes" title="Notes">
              <NotebookPen size={22} />
            </button>
          </Tooltip>
          <div className="sidebar-rail__spacer" />
          <Tooltip text="Settings">
            <button className="sidebar-rail__button sidebar-rail__button--bottom" type="button" aria-label="Settings" title="Settings">
              <Settings size={22} />
            </button>
          </Tooltip>
          <Tooltip text="Security">
            <button className="sidebar-rail__button sidebar-rail__button--bottom sidebar-rail__button--accent" type="button" aria-label="Security" title="Security" onClick={onOpenPrivatePopup}>
              <Shield size={22} />
            </button>
          </Tooltip>
        </div>
      ) : (
        <button
          className="new-chat-button"
          onClick={onNewChat}
          title="Start a new chat"
          type="button"
        >
          <PenLine size={18} />
          <span>New Chat</span>
          <span className="new-chat-button__shortcut">CTRL + ⇧ + O</span>
        </button>
      )}

      {!collapsed && (
        <>
          <div className="sidebar__section-label">Chats</div>
          <div className="chat-list">
            {threads.length === 0 ? null : threads.map((thread) => (
              <button
                key={thread.id}
                className={`chat-list__item ${thread.id === activeThreadId ? 'is-active' : ''}`}
                onClick={() => onSelectThread(thread.id)}
                title={thread.title}
                type="button"
              >
                <span className="chat-list__badge">
                  {thread.title.slice(0, 1).toUpperCase()}
                </span>
                <span className="chat-list__meta">
                  <span className="chat-list__title">{thread.title}</span>
                  <span className="chat-list__subtle">
                    {thread.messages.length
                      ? `${thread.messages.length} message${thread.messages.length === 1 ? '' : 's'}`
                      : 'Empty'}
                  </span>
                </span>
              </button>
            ))}
          </div>

          <div className="sidebar__footer">
            {settingsOpen && (
          <div className="sidebar__menu">
                <button className="sidebar__menu-item" type="button" onClick={onOpenSettingsPopup}>
                  <Settings size={18} />
                  <span>Settings</span>
                </button>
                <button className="sidebar__menu-item" type="button" onClick={onOpenPrivatePopup}>
                  <ShieldCheck size={18} />
                  <span>Chat Protection</span>
                </button>
                {/* 
                <button className="sidebar__menu-item" type="button">
                  <MessageCircleMore size={18} />
                  <span>Share Feedback</span>
                </button>
*/}
              </div>
            )}

            <button
              className="sidebar__settings-toggle"
              type="button"
              onClick={() => setSettingsOpen((value) => !value)}
            >
              <span className="sidebar__settings-left">
                <ChevronDown className={`sidebar__settings-chevron ${settingsOpen ? 'is-open' : ''}`} size={18} />
                <span>Settings & More</span>
              </span>
              <span className="sidebar__settings-right">
                <span>Free</span>
                <Shield className="sidebar__free-shield" size={18} />
              </span>
            </button>

            <div className="sidebar__links">
              <p>
                by <a href="https://arcbase.one" target="_blank" rel="noopener noreferrer">Arcbase</a>
              </p>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}

type ChatAreaProps = {
  thread: Thread | null;
  draft: string;
  hydrated: boolean;
  onDraftChange: (value: string) => void;
  onSend: (value: string) => void;
  listRef: React.RefObject<HTMLDivElement | null>;
  onOpenPrivatePopup: () => void;
};

function ChatArea({
  thread,
  draft,
  hydrated,
  onDraftChange,
  onSend,
  listRef,
  onOpenPrivatePopup,
}: ChatAreaProps) {
  return (
    <main
      className="chat-area"
    >
      { /*
      <header className="toolbar">
        <div className="toolbar__left">
          <Tooltip text="Hide sidebar (CTRL + ⇧ + S)">
            <button className="icon-button toolbar__button" aria-label="Toggle sidebar">
              <span className="icon"><PanelLeft /></span>
            </button>
          </Tooltip>
          <div className="toolbar__title-wrap">
            <div className="toolbar__title">{thread?.title ?? 'Start a new chat'}</div>
          </div>
        </div>

        <div className="toolbar__right">
          <Tooltip text="Switch theme">
            <button className="icon-button toolbar__button" aria-label="Toggle theme" title="Switch theme">
              <span className="icon"><Sun size={18} /></span>
            </button>
          </Tooltip>
        </div>
      </header>
      */ }

      <section className="chat-stage">
        <div
          ref={listRef}
          className={`chat-stage__scroll ${thread?.messages.length ? 'has-messages' : 'is-empty'}`}
        >
          {thread?.messages.length ? (
            <MessageList messages={thread.messages} />
          ) : (
            <EmptyState hydrated={hydrated} onOpenPrivatePopup={onOpenPrivatePopup}>
              <Composer value={draft} onChange={onDraftChange} onSend={onSend} />
            </EmptyState>
          )}
        </div>

        {thread?.messages.length ? (
          <div className="composer-shell">
            <Composer value={draft} onChange={onDraftChange} onSend={onSend} />
          </div>
        ) : null}
      </section>
    </main>
  );
}

function EmptyState({
  hydrated,
  onOpenPrivatePopup,
  children,
}: {
  hydrated: boolean;
  onOpenPrivatePopup: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className={`empty-state ${hydrated ? 'is-ready' : ''}`}>
      <h1 className="empty-state__title">
        All chats are <Shield className='shield' size={37} />{' '}
        <button
          type="button"
          className="private-word"
          onClick={onOpenPrivatePopup}
        >
          private
        </button>
      </h1>
      {children}
    </div>
  );
}

function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div className="message-list">
      {messages.map((message) => (
        <article key={message.id} className="message message--user">
          <div className="message__label">You</div>
          <div className="message__bubble">{message.content}</div>
        </article>
      ))}
    </div>
  );
}

function Composer({
  value,
  onChange,
  onSend,
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: (value: string) => void;
}) {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.style.height = 'auto';
    inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 124)}px`;
  }, [value]);

  return (
    <div className="composer" aria-label="Message composer">
      <textarea
        ref={inputRef}
        className="composer__input"
        value={value}
        placeholder="Ask anything privately..."
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            onSend(value);
          }
        }}
        rows={2}
      />

      <div className="composer__footer">
        <div className="composer__hint">Press Enter to send</div>
        <button
          className="send-button"
          onClick={() => onSend(value)}
          title="Send message"
        >
          <ArrowUp />
        </button>
      </div>
    </div>
  );
}

function SkeletonLoader({ visible }: { visible: boolean }) {
  return (
    <div
      className={`skeleton ${visible ? 'is-visible' : 'is-hidden'}`}
      aria-hidden="true"
    >
      <aside className="skeleton__sidebar">
        <div className="skeleton__bar skeleton__bar--brand" />
        <div className="skeleton__bar skeleton__bar--button" />
        <div className="skeleton__label" />
        <div className="skeleton__card" />
        <div className="skeleton__card" />
        <div className="skeleton__card" />
      </aside>
      <div className="skeleton__main">
        <div className="skeleton__toolbar">
          <div className="skeleton__bar skeleton__bar--title" />
          <div className="skeleton__bar skeleton__bar--pill" />
        </div>
        <div className="skeleton__center">
          <div className="skeleton__headline" />
          <div className="skeleton__subline" />
          <div className="skeleton__composer" />
        </div>
      </div>
    </div>
  );
}

export default App;
