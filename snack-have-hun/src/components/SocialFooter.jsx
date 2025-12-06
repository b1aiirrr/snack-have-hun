import React from "react";
import "./social-footer.css";

const socials = [
  { name: "X", href: "#", aria: "X (Twitter/X)",
    svg: (<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden><path d="M23 2.3c-.8.4-1.6.7-2.4.8.9-.5 1.6-1.3 1.9-2.3-.8.5-1.6.8-2.6 1-1.2-1.3-3.1-1.5-4.6-.4C14.7 2.6 14 4 14.6 5.4c-.9 0-1.8-.3-2.5-.8-.6.9-.1 2.1.9 2.6-.6 0-1.2-.2-1.7-.5-.1 1.2.8 2.3 2 2.5-.6.1-1.2.1-1.7 0 .5 1.4 2 2.2 3.6 2.2-1.4 1.1-3.1 1.8-4.9 1.8H6c1.6 1 3.6 1.6 5.7 1.6 6.8 0 10.5-5.6 10.5-10.5v-.5C22.1 3.8 22.6 3 23 2.3z" fill="currentColor"/></svg>)
  },
  { name: "Instagram", href: "#", aria: "Instagram",
    svg: (<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden><path d="M12 7.2A4.8 4.8 0 1 0 12 17.8 4.8 4.8 0 1 0 12 7.2Zm6.3-.9a1.14 1.14 0 1 1 0 2.28 1.14 1.14 0 0 1 0-2.28ZM12 9.5a2.5 2.5 0 1 1 0 5.001A2.5 2.5 0 0 1 12 9.5zM17.8 4H6.2C4 4 2.2 5.8 2.2 8v8c0 2.2 1.8 4 4 4h11.6c2.2 0 4-1.8 4-4V8c0-2.2-1.8-4-4-4z" fill="currentColor"/></svg>)
  },
  { name: "TikTok", href: "#", aria: "TikTok",
    svg: (<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden><path d="M16.5 3.5v5.1a4.9 4.9 0 0 1-4.9-4.9H9.6v9.1A4.9 4.9 0 1 1 8 20.7 4.9 4.9 0 0 1 12.9 15V9.4a7.2 7.2 0 0 0 3.6 1.1V3.5h0z" fill="currentColor"/></svg>)
  },
  { name: "Gmail", href: "#", aria: "Email (Gmail)",
    svg: (<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/></svg>)
  }
];

export default function SocialFooter({ className = "" }) {
  return (
    <footer className={`social-footer ${className}`}>
      <ul className="social-list" aria-label="Social links">
        {socials.map(s => (
          <li key={s.name}>
            <a
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={s.aria}
              className="social-link"
            >
              <span className="icon" aria-hidden>{s.svg}</span>
              <span className="visually-hidden">{s.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
}
