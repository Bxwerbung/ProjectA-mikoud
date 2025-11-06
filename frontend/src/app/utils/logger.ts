export function Logger(type: string, ...messages: any[]): void 
{
  const ERROR = true;
  const INFO = true;
  const DEBUG = true;
  const WARN = true;
  const TRACE = true;
  const LOG = true;

  if (type === "log" && LOG) console.log(...messages);
  if (type === "trace" && TRACE) console.trace(...messages); 
  if (type === "warn" && WARN) console.warn(...messages);
  if (type === "error" && ERROR) console.error(...messages);
  if (type === "error" && ERROR) console.error(...messages);
  if (type === "info" && INFO) console.info(...messages);
  if (type === "debug" && DEBUG) console.debug(...messages);
}
