function Loader() {
  return (
    <div className="flex justify-start mb-6">
      <div className="bg-slate-800 rounded-2xl px-5 py-4">

        <div className="flex items-center gap-3">

          {/* AI Icon */}
          <div className="w-8 h-8 rounded-full
                          bg-blue-600
                          flex items-center justify-center
                          text-sm">
            🤖
          </div>

          {/* Typing animation */}
          <div className="flex items-center gap-1">
            <span
              className="w-2 h-2 bg-slate-400
                         rounded-full
                         animate-bounce"
            />

            <span
              className="w-2 h-2 bg-slate-400
                         rounded-full
                         animate-bounce"
              style={{
                animationDelay: "150ms",
              }}
            />

            <span
              className="w-2 h-2 bg-slate-400
                         rounded-full
                         animate-bounce"
              style={{
                animationDelay: "300ms",
              }}
            />
          </div>

          <span className="text-sm text-slate-400">
            Nova AI is thinking...
          </span>

        </div>

      </div>
    </div>
  );
}

export default Loader;