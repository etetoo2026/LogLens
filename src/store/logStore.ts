import { create } from "zustand";

export type LogLevel = "error" | "warn" | "info" | "debug" | "trace" | "unknown";

export interface LogEntry {
  id: number;
  level: LogLevel;
  message: string;
  timestamp: string | null;
  raw: unknown;
}

interface LogStore {
  logs: LogEntry[];
  filter: LogLevel | "all";
  search: string;
  setLogs: (raw: string) => void;
  setFilter: (f: LogLevel | "all") => void;
  setSearch: (s: string) => void;
  clear: () => void;
}

let _id = 0;

function detectLevel(entry: Record<string, unknown>): LogLevel {
  const l = String(entry.level ?? entry.severity ?? entry.lvl ?? "").toLowerCase();
  if (l.includes("error") || l === "fatal" || l === "50") return "error";
  if (l.includes("warn") || l === "40") return "warn";
  if (l.includes("info") || l === "30") return "info";
  if (l.includes("debug") || l === "20") return "debug";
  if (l.includes("trace") || l === "10") return "trace";
  return "unknown";
}

function parseRaw(raw: string): LogEntry[] {
  const lines = raw.trim().split("\n").filter(Boolean);
  return lines.map((line) => {
    _id++;
    try {
      const obj = JSON.parse(line) as Record<string, unknown>;
      const level = detectLevel(obj);
      const message = String(obj.message ?? obj.msg ?? obj.text ?? line);
      const timestamp = String(obj.time ?? obj.timestamp ?? obj["@timestamp"] ?? "");
      return { id: _id, level, message, timestamp: timestamp || null, raw: obj };
    } catch {
      return { id: _id, level: "unknown", message: line, timestamp: null, raw: line };
    }
  });
}

export const useLogStore = create<LogStore>((set) => ({
  logs: [],
  filter: "all",
  search: "",
  setLogs: (raw) => set({ logs: parseRaw(raw) }),
  setFilter: (filter) => set({ filter }),
  setSearch: (search) => set({ search }),
  clear: () => set({ logs: [] }),
}));

export function filteredLogs(logs: LogEntry[], filter: LogLevel | "all", search: string) {
  return logs.filter((l) => {
    if (filter !== "all" && l.level !== filter) return false;
    if (search && !l.message.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
}
