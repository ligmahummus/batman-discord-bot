/**
 * Terinal standardized logger for the server.
 * @param text log string
 */
export function clientLogger(text: string, type?: MessageType): void {
  let time = new Date().toLocaleTimeString("en-US");
  let suffix: string = "";

  switch (type) {
    case "info":
      suffix = "INFO";
      break;
    case "warn":
      suffix = "WARN";
      break;
    case "error":
      suffix = "ERROR";
      break;
    default:
      suffix = "INFO";
      break;
  }

  console.log(
    `[MARIAN-BOT - ${suffix} - ${time}] ${
      type === "warn" ? "!! >> " : ""
    }${text}`
  );
}

type MessageType = "info" | "warn" | "error";
