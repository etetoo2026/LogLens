import { useState } from "react";
import { useLogStore, filteredLogs, LogLevel } from "./store/logStore";

const LEVELS: (LogLevel | "all")[] = ["all", "error", "warn", "info", "debug", "trace"];
const LEVEL_COLOR: Record<string, string> = {
  error: "text-red-400", warn: "text-yellow-400",
  info: "text-blue-400", debug: "text-gray-400",
  trace: "text-purple-400", unknown: "text-gray-500",
};

export default function App() {
  const { logs, filter, search, setLogs, setFilter, setSearch, clear } = useLogStore();
  const [input, setInput] = useState("");
  const visible = filteredLogs(logs, filter, search);

  const handlePaste = () => {
    setLogs(input);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono flex flex-col">
      <header className="border-b border-gray-800 px-4 py-3 flex items-center gap-3">
        <span className="text-lg font-bold text-white">LogLens</span>
        <span className="text-xs text-gray-500">JSON Log Viewer</span>
        <div className="ml-auto flex gap-2">
          {LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => setFilter(l)}
              className={`px-2 py-0.5 rounded text-xs border ${
                filter === l ? "bg-gray-700 border-gray-500" : "border-gray-700 hover:bg-gray-800"
              } ${l !== "all" ? LEVEL_COLOR[l] : ""}`}
            >
              {l.toUpperCase()}
            </button>
          ))}
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded px-2 py-0.5 text-xs w-40"
          />
          <button onClick={clear} className="text-xs text-gray-500 hover:text-gray-300">Clear</button>
        </div>
      </header>

      {logs.length === 0 && (
        <div className="p-4 flex flex-col gap-2 max-w-2xl mx-auto w-full mt-8">
          <label className="text-sm text-gray-400">Paste JSON logs (one per line):</label>
          <textarea
            className="bg-gray-900 border border-gray-700 rounded p-2 text-xs h-40 resize-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"level":"info","message":"Server started","time":"2026-06-08T10:00:00Z"}'
          />
          <button
            onClick={handlePaste}
            className="self-start bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-1.5 rounded"
          >
            Analyze Logs
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-2 py-1 text-xs">
        {visible.map((log) => (
          <div key={log.id} className="flex gap-3 py-0.5 hover:bg-gray-900 px-1 rounded">
            <span className="text-gray-600 w-8 text-right shrink-0">{log.id}</span>
            <span className={`w-14 shrink-0 ${LEVEL_COLOR[log.level] ?? ""}`}>
              {log.level.toUpperCase()}
            </span>
            {log.timestamp && (
              <span className="text-gray-600 shrink-0 w-28 truncate">{log.timestamp}</span>
            )}
            <span className="text-gray-200 truncate">{log.message}</span>
          </div>
        ))}
      </div>

      <footer className="border-t border-gray-800 px-4 py-1 text-xs text-gray-600">
        {visible.length} / {logs.length} entries
      </footer>
    </div>
  );
}
