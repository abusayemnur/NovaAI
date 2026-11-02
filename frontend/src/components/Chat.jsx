import Header from "./Header";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import Message from "./Message";
import Loader from "./Loader";
import useChat from "../hooks/useChat";

function Chat() {
  const {
    messages,
    loading,
    sendMessage,
    newChat,
  } = useChat();

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Header */}
        <Header />

        {/* Chat Messages */}
        <ChatWindow>
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">

                <div className="text-6xl mb-4">
                  🤖
                </div>

                <h2 className="text-3xl font-bold mb-2">
                  Welcome to Nova AI
                </h2>

                <p className="text-slate-400">
                  Ask me anything...
                </p>

              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto w-full">

              {messages.map((message, index) => (
                <Message
                  key={index}
                  message={message}
                />
              ))}

              {loading && <Loader />}

            </div>
          )}
        </ChatWindow>

        {/* Input */}
        <ChatInput
          onSend={sendMessage}
          loading={loading}
        />

      </div>
    </div>
  );
}

export default Chat;