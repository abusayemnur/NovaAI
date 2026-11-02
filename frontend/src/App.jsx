import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function App() {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [copiedCodeId, setCopiedCodeId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('nova_user');
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch (e) { console.error(e); }
    }

    const savedTheme = localStorage.getItem('nova_theme');
    if (savedTheme !== null) {
      setIsDarkMode(savedTheme === 'true');
    }

    const savedChats = localStorage.getItem('nova_all_chats');
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats);
        if (parsedChats.length > 0) {
          setChats(parsedChats);
          setCurrentChatId(parsedChats[0].id);
          setMessages(parsedChats[0].messages);
        } else {
          createNewChat(parsedChats);
        }
      } catch (e) { console.error(e); }
    } else {
      createNewChat([]);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('nova_theme', newTheme);
  };

  const createNewChat = (existingChats = chats) => {
    const newChatId = Date.now().toString();
    const newChat = {
      id: newChatId,
      title: `Chat ${existingChats.length + 1}`,
      messages: [{ sender: 'ai', text: 'Hello! How can I assist you today?' }]
    };
    const updatedChats = [newChat, ...existingChats];
    setChats(updatedChats);
    setCurrentChatId(newChatId);
    setMessages(newChat.messages);
    localStorage.setItem('nova_all_chats', JSON.stringify(updatedChats));
    if (window.innerWidth <= 768) setIsSidebarOpen(false);
  };

  const switchChat = (chatId) => {
    const selectedChat = chats.find(c => c.id === chatId);
    if (selectedChat) {
      setCurrentChatId(chatId);
      setMessages(selectedChat.messages);
      if (window.innerWidth <= 768) setIsSidebarOpen(false);
    }
  };

  const deleteChat = (e, chatId) => {
    e.stopPropagation();
    const updatedChats = chats.filter(c => c.id !== chatId);

    if (updatedChats.length === 0) {
      createNewChat([]);
    } else {
      setChats(updatedChats);
      localStorage.setItem('nova_all_chats', JSON.stringify(updatedChats));
      if (chatId === currentChatId) {
        setCurrentChatId(updatedChats[0].id);
        setMessages(updatedChats[0].messages);
      }
    }
  };

  const renameChat = (e, chatId, currentTitle) => {
    e.stopPropagation();
    const newTitle = prompt("Enter new chat name:", currentTitle);
    if (newTitle && newTitle.trim() !== "") {
      const updatedChats = chats.map(c => {
        if (c.id === chatId) {
          return { ...c, title: newTitle.trim() };
        }
        return c;
      });
      setChats(updatedChats);
      localStorage.setItem('nova_all_chats', JSON.stringify(updatedChats));
    }
  };

  const clearAllChats = () => {
    if (window.confirm("Are you sure you want to delete all chat history?")) {
      localStorage.removeItem('nova_all_chats');
      createNewChat([]);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Sorry, your browser does not support voice recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      setInputMessage(prev => prev + " " + speechText);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, your browser does not support text-to-speech.");
    }
  };

  useEffect(() => {
    if (currentChatId && chats.length > 0) {
      const updatedChats = chats.map(chat => {
        if (chat.id === currentChatId) {
          return { ...chat, messages: messages };
        }
        return chat;
      });
      setChats(updatedChats);
      localStorage.setItem('nova_all_chats', JSON.stringify(updatedChats));
    }
  }, [messages]);

  const handleLogout = () => {
    localStorage.removeItem('nova_user');
    localStorage.removeItem('nova_all_chats');
    setUser(null);
    setChats([]);
    setMessages([]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

    if (!apiKey) {
      alert("VITE_OPENROUTER_API_KEY is missing in .env file!");
      return;
    }

    const userMsg = inputMessage;
    const newMessages = [...messages, { sender: 'user', text: userMsg }];
    setMessages(newMessages);
    setInputMessage('');
    setLoading(true);

    try {
      const apiMessages = newMessages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey.trim()}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Nova AI",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: apiMessages,
          stream: false,
          max_tokens: 1000
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `API Error: ${response.status}`);
      }

      const currentAiReply = data.choices?.[0]?.message?.content || "No response received.";
      const finalMessagesWithAI = [...newMessages, { sender: 'ai', text: currentAiReply }];
      setMessages(finalMessagesWithAI);

      const currentChat = chats.find(c => c.id === currentChatId);
      if (currentChat && currentChat.title.startsWith("Chat ")) {
        const autoTitle = userMsg.length > 25 ? userMsg.substring(0, 25) + '...' : userMsg;
        
        const updatedChats = chats.map(c => {
          if (c.id === currentChatId) {
            return { ...c, title: autoTitle, messages: finalMessagesWithAI };
          }
          return c;
        });
        setChats(updatedChats);
        localStorage.setItem('nova_all_chats', JSON.stringify(updatedChats));
      }

    } catch (error) {
      console.error("OpenRouter Error:", error);
      setMessages(prev => [...prev, { sender: 'ai', text: `Error: ${error.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const theme = {
    bgMain: isDarkMode ? '#0f172a' : '#ffffff',
    bgSidebar: isDarkMode ? '#1e293b' : '#f8fafc',
    bgChatHover: isDarkMode ? '#334155' : '#f1f5f9',
    bgActiveChat: isDarkMode ? '#334155' : '#e2e8f0',
    textMain: isDarkMode ? '#ffffff' : '#0f172a',
    textMuted: isDarkMode ? '#94a3b8' : '#64748b',
    borderCol: isDarkMode ? '#334155' : '#e2e8f0',
    bubbleUser: '#0ea5e9',
    bubbleAi: isDarkMode ? '#334155' : '#f1f5f9',
    inputBg: isDarkMode ? '#1e293b' : '#f1f5f9',
    inputBorder: isDarkMode ? '#334155' : '#cbd5e1',
    inputText: isDarkMode ? '#ffffff' : '#0f172a'
  };

  const NovaLogo = ({ width = 28, height = 28 }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="url(#ai-gradient)" />
      <defs>
        <linearGradient id="ai-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0ea5e9" />
          <stop offset="1" stopColor="#2563eb" />
        </linearGradient>
      </defs>
    </svg>
  );

  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0f172a', color: '#ffffff', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '20px' }}>
        <div style={{ background: '#1e293b', padding: '40px 30px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.4)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', border: '1px solid #334155', maxWidth: '400px', width: '100%' }}>
          
          <NovaLogo width={56} height={56} />

          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#ffffff', letterSpacing: '-0.5px' }}>Welcome to Nova AI</h1>
            <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>Sign in with your Google account to access your personal AI assistant</p>
          </div>

          <div style={{ marginTop: '10px', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
              onSuccess={credentialResponse => {
                try {
                  const decoded = jwtDecode(credentialResponse.credential);
                  localStorage.setItem('nova_user', JSON.stringify(decoded));
                  setUser(decoded);
                } catch (error) { console.error(error); }
              }}
              onError={() => console.log('Login Failed')}
              theme="filled_black"
              shape="pill"
              size="large"
            />
          </div>

        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: theme.bgMain, color: theme.textMain, fontFamily: 'sans-serif', overflow: 'hidden', position: 'relative' }}>
      
      {/* Sidebar */}
      <div style={{ 
        width: '280px', 
        background: theme.bgSidebar, 
        borderRight: `1px solid ${theme.borderCol}`, 
        display: 'flex', 
        flexDirection: 'column', 
        padding: '15px', 
        gap: '15px',
        position: window.innerWidth <= 768 ? 'absolute' : 'relative',
        height: '100%',
        zIndex: 100,
        transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease-in-out'
      }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: `1px solid ${theme.borderCol}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <NovaLogo width={28} height={28} />
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: theme.textMain, margin: 0 }}>Nova AI</h2>
          </div>
          
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button 
              onClick={toggleTheme} 
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"} 
              style={{ background: theme.bgChatHover, border: `1px solid ${theme.borderCol}`, color: theme.textMain, padding: '6px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {isDarkMode ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>

            <button 
              onClick={() => setIsSidebarOpen(false)}
              title="Close Sidebar"
              style={{ background: theme.bgChatHover, border: `1px solid ${theme.borderCol}`, color: theme.textMain, width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
                <path d="M14 10l-3 3 3 3"></path>
              </svg>
            </button>
          </div>
        </div>

        <button onClick={() => createNewChat()} style={{ padding: '10px', background: '#0ea5e9', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', transition: 'background 0.2s' }}>
          + New Chat
        </button>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '5px 0' }}>
            <p style={{ fontSize: '12px', color: theme.textMuted, margin: 0 }}>Recent Chats</p>
            {chats.length > 0 && (
              <button 
                onClick={clearAllChats} 
                style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '11px', cursor: 'pointer', padding: 0 }}
              >
                Clear All
              </button>
            )}
          </div>
          {chats.map(chat => (
            <div 
              key={chat.id} 
              onClick={() => switchChat(chat.id)} 
              style={{ 
                padding: '10px', 
                background: chat.id === currentChatId ? theme.bgActiveChat : 'transparent', 
                borderRadius: '6px', 
                cursor: 'pointer', 
                fontSize: '14px', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                transition: 'background 0.2s'
              }}
            >
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
                {chat.title}
              </span>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <button 
                  onClick={(e) => renameChat(e, chat.id, chat.title)}
                  title="Rename"
                  style={{ background: 'none', border: 'none', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button 
                  onClick={(e) => deleteChat(e, chat.id)}
                  title="Delete"
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: `1px solid ${theme.borderCol}`, paddingTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
            {user?.picture && <img src={user.picture} alt={user.name} style={{ width: '28px', height: '28px', borderRadius: '50%' }} />}
            <span style={{ fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</span>
          </div>
          <button onClick={handleLogout} style={{ padding: '4px 8px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </div>

      {/* Main Chat Window */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', background: 'transparent', gap: '10px' }}>
          {!isSidebarOpen && (
            <button 
              onClick={() => setIsSidebarOpen(true)}
              title="Open Sidebar"
              style={{ background: theme.bgChatHover, border: `1px solid ${theme.borderCol}`, color: theme.textMain, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', borderRadius: '8px' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
                <path d="M11 10l3 3-3 3"></path>
              </svg>
            </button>
          )}
        </div>

        <div style={{ flex: 1, padding: '10px 20px 20px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {messages.map((msg, index) => (
            <div key={index} style={{ position: 'relative', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', background: msg.sender === 'user' ? theme.bubbleUser : theme.bubbleAi, color: msg.sender === 'user' ? '#ffffff' : theme.textMain, padding: '12px 18px', borderRadius: '12px', maxWidth: '80%', fontSize: '14px', wordBreak: 'break-word', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
              {msg.sender === 'ai' ? (
                <>
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({node, inline, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '');
                        const codeString = String(children).replace(/\n$/, '');
                        const codeId = Math.random().toString();

                        return !inline && match ? (
                          <div style={{ position: 'relative', margin: '10px 0', borderRadius: '6px', overflow: 'hidden', background: '#1e1e1e' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#2d2d2d', padding: '6px 12px', fontSize: '12px', color: '#ccc' }}>
                              <span>{match[1]}</span>
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(codeString);
                                  setCopiedCodeId(codeId);
                                  setTimeout(() => setCopiedCodeId(null), 2000);
                                }}
                                style={{ background: '#333', border: 'none', color: '#fff', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
                              >
                                {copiedCodeId === codeId ? 'Copied!' : 'Copy'}
                              </button>
                            </div>
                            <SyntaxHighlighter
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              customStyle={{ margin: 0, padding: '15px', background: 'transparent', fontSize: '13px' }}
                              {...props}
                            >
                              {codeString}
                            </SyntaxHighlighter>
                          </div>
                        ) : (
                          <code style={{ background: 'rgba(0,0,0,0.2)', padding: '2px 4px', borderRadius: '4px', fontSize: '13px' }} {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                  
                  {msg.text && (
                    <button 
                      onClick={() => speakText(msg.text)}
                      title="Listen to response"
                      style={{ background: 'none', border: 'none', color: theme.textMuted, cursor: 'pointer', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', padding: 0 }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                      </svg>
                      Listen
                    </button>
                  )}
                </>
              ) : (
                msg.text
              )}
            </div>
          ))}
          {loading && (
            <div style={{ alignSelf: 'flex-start', background: theme.bubbleAi, color: theme.textMuted, padding: '12px 18px', borderRadius: '12px', fontSize: '14px' }}>
              Thinking...
            </div>
          )}
        </div>

        {/* Input Box */}
        <div style={{ padding: '15px 25px 25px 25px', background: theme.bgMain }}>
          <form 
            onSubmit={handleSendMessage} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              background: theme.inputBg, 
              border: `1px solid ${theme.inputBorder}`, 
              borderRadius: '28px', 
              padding: '8px 12px 8px 20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              gap: '12px',
              maxWidth: '800px',
              margin: '0 auto',
              width: '100%'
            }}
          >
            <input 
              type="text"
              value={inputMessage}
              onChange={(e) =>setInputMessage(e.target.value)}
              placeholder={isListening ? "Listening..." : "Enter a prompt here..."}
              style={{ flex: 1, border: 'none', background: 'transparent', color: theme.inputText, outline: 'none', fontSize: '15px' }}
            />

            <button 
              type="button" 
              onClick={handleVoiceInput}
              title={isListening ? "Listening..." : "Voice Input"}
              style={{ 
                background: isListening ? '#ef4444' : 'transparent', 
                border: 'none', 
                color: isListening ? '#ffffff' : theme.textMuted, 
                width: '38px', 
                height: '38px', 
                borderRadius: '50%', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s, color 0.2s'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v1a7 7 0 0 1-14 0v-1"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            </button>

            <button 
              type="submit" 
              disabled={loading || !inputMessage.trim()} 
              title="Send Message"
              style={{ 
                width: '38px', 
                height: '38px', 
                background: inputMessage.trim() ? '#0ea5e9' : theme.bgChatHover, 
                color: inputMessage.trim() ? '#ffffff' : theme.textMuted, 
                border: 'none', 
                borderRadius: '50%', 
                cursor: inputMessage.trim() ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s, color 0.2s'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}