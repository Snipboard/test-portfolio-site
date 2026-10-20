"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownTextProps {
  children: string;
  variant?: "compact" | "lead" | "home" | "body" | "preview" | "focus";
}

export function MarkdownText({ children, variant = "compact" }: MarkdownTextProps) {
  const wrapperClass = variant === "lead"
    ? "space-y-4 text-[19px] leading-8 text-white/75 sm:text-[21px] sm:leading-9"
    : variant === "home"
      ? "space-y-3 text-[15px] leading-[1.6rem] text-white/75"
    : variant === "body"
      ? "space-y-6 text-[19px] leading-8 text-white/70"
      : variant === "focus"
        ? "space-y-4 text-[15px] leading-6 text-white/70"
      : variant === "preview"
        ? "space-y-2 text-[15px] leading-6 text-white/70"
        : "space-y-3 text-[17px] leading-relaxed text-white/75 drop-shadow";

  return (
    <div className={wrapperClass}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children: content }) => <h3 className={`${variant === "preview" || variant === "focus" ? "text-lg" : "text-2xl"} font-bold text-white`}>{content}</h3>,
          h2: ({ children: content }) => <h3 className={`${variant === "preview" || variant === "focus" ? "text-base" : "text-xl"} font-bold text-white`}>{content}</h3>,
          h3: ({ children: content }) => <h4 className={`${variant === "focus" ? "text-base" : "text-lg"} font-semibold text-white`}>{content}</h4>,
          p: ({ children: content }) => <p>{content}</p>,
          ul: ({ children: content }) => <ul className="ml-5 list-disc space-y-1 marker:text-[var(--psp-accent)]">{content}</ul>,
          ol: ({ children: content }) => <ol className="ml-5 list-decimal space-y-1 marker:text-[var(--psp-accent)]">{content}</ol>,
          li: ({ children: content }) => <li className="pl-1">{content}</li>,
          strong: ({ children: content }) => <strong className="font-semibold text-white">{content}</strong>,
          em: ({ children: content }) => <em className="text-white/85">{content}</em>,
          a: ({ children: content, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[var(--psp-accent)] underline decoration-current/40 underline-offset-4 hover:decoration-current"
            >
              {content}
            </a>
          ),
          blockquote: ({ children: content }) => (
            <blockquote className="border-l-2 border-[var(--psp-accent)] pl-4 text-white/60">{content}</blockquote>
          ),
          code: ({ children: content }) => (
            <code className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-[0.9em] text-white/85">{content}</code>
          ),
          pre: ({ children: content }) => (
            <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/35 p-4 text-sm">{content}</pre>
          ),
          table: ({ children: content }) => (
            <table className="block w-full overflow-x-auto border-collapse text-left text-sm">{content}</table>
          ),
          th: ({ children: content }) => <th className="border-b border-white/20 px-3 py-2 font-semibold text-white">{content}</th>,
          td: ({ children: content }) => <td className="border-b border-white/10 px-3 py-2">{content}</td>,
          hr: () => <hr className="border-white/15" />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
