import { useState } from "react";
import {
  Copy,
  Check,
  User,
  Bot,
} from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function Message({ message }) {
  const isUser = message.role === "user";

  const [copied, setCopied] = useState(false);

  const text =
    message.content ||
    message.text ||
    "";

  // Copy normal message
  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(text);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <div
      className={`flex mb-8 ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`flex gap-3 max-w-4xl ${
          isUser
            ? "flex-row-reverse"
            : "flex-row"
        }`}
      >

        {/* Avatar */}
        <div
          className={`flex-shrink-0
                      w-9 h-9
                      rounded-full
                      flex items-center
                      justify-center
                      ${
                        isUser
                          ? "bg-blue-600"
                          : "bg-slate-700"
                      }`}
        >
          {isUser ? (
            <User size={18} />
          ) : (
            <Bot size={18} />
          )}
        </div>

        {/* Message box */}
        <div
          className={`relative rounded-2xl
                      px-4 py-3
                      min-w-0
                      ${
                        isUser
                          ? "bg-blue-600 text-white"
                          : "bg-slate-800 text-slate-100"
                      }`}
        >

          {/* Markdown */}
          <div
            className="
              prose
              prose-invert
              max-w-none
              text-sm
              md:text-base
              leading-7

              [&_p]:mb-3
              [&_p:last-child]:mb-0

              [&_ul]:list-disc
              [&_ul]:pl-5
              [&_ol]:list-decimal
              [&_ol]:pl-5

              [&_li]:mb-1

              [&_strong]:font-bold

              [&_a]:text-blue-400
              [&_a]:underline

              [&_blockquote]:border-l-4
              [&_blockquote]:border-slate-500
              [&_blockquote]:pl-4
              [&_blockquote]:text-slate-400
            "
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{

                // Code
                code({
                  inline,
                  className,
                  children,
                  ...props
                }) {
                  const match =
                    /language-(\w+)/.exec(
                      className || ""
                    );

                  const codeText =
                    String(children).replace(
                      /\n$/,
                      ""
                    );

                  // Inline code
                  if (inline) {
                    return (
                      <code
                        className="
                          bg-slate-900
                          text-blue-300
                          px-1.5
                          py-0.5
                          rounded
                          text-sm
                        "
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }

                  // Code block
                  return (
                    <div className="relative my-4">

                      {/* Language */}
                      {match && (
                        <div
                          className="
                            absolute
                            top-0
                            left-0
                            right-0
                            z-10
                            px-4
                            py-2
                            bg-slate-950
                            border-b
                            border-slate-700
                            rounded-t-xl
                            text-xs
                            text-slate-400
                            uppercase
                          "
                        >
                          {match[1]}
                        </div>
                      )}

                      {/* Copy code */}
                      <button
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(
                              codeText
                            );
                          } catch (error) {
                            console.error(
                              "Code copy failed:",
                              error
                            );
                          }
                        }}
                        className="
                          absolute
                          top-2
                          right-2
                          z-20
                          flex
                          items-center
                          gap-1
                          px-2
                          py-1
                          rounded
                          bg-slate-700
                          hover:bg-slate-600
                          text-xs
                          text-slate-200
                          transition
                        "
                      >
                        <Copy size={13} />
                        Copy
                      </button>

                      <SyntaxHighlighter
                        style={oneDark}
                        language={
                          match
                            ? match[1]
                            : "text"
                        }
                        PreTag="div"
                        className="
                          !rounded-xl
                          !m-0
                          !pt-12
                          !text-sm
                        "
                        {...props}
                      >
                        {codeText}
                      </SyntaxHighlighter>

                    </div>
                  );
                },

                // Paragraph
                p({ children }) {
                  return (
                    <p className="mb-3 last:mb-0">
                      {children}
                    </p>
                  );
                },

                // Heading
                h1({ children }) {
                  return (
                    <h1 className="text-2xl font-bold mb-3">
                      {children}
                    </h1>
                  );
                },

                h2({ children }) {
                  return (
                    <h2 className="text-xl font-bold mb-3">
                      {children}
                    </h2>
                  );
                },

                h3({ children }) {
                  return (
                    <h3 className="text-lg font-bold mb-2">
                      {children}
                    </h3>
                  );
                },

              }}
            >
              {text}
            </ReactMarkdown>
          </div>

          {/* Copy message */}
          {!isUser && text && (
            <button
              onClick={copyMessage}
              className="
                mt-3
                flex
                items-center
                gap-1.5
                px-2
                py-1
                rounded-md
                text-xs
                text-slate-400
                hover:text-white
                hover:bg-slate-700
                transition
              "
            >
              {copied ? (
                <>
                  <Check size={14} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copy
                </>
              )}
            </button>
          )}

        </div>
      </div>
    </div>
  );
}

export default Message;