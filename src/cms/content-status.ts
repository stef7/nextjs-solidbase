import { ContentAny } from "./content-api";

export const getContentStatuses = <C extends ContentAny>(
  content?: C,
): ("active" | "missing" | "disabled" | "expired" | "future")[] => {
  if (!content) return ["missing"];

  const reasons: ("disabled" | "expired" | "future")[] = [];
  if ("disabled" in content && content.disabled) reasons.push("disabled");

  const now = Date.now();
  if ("expiry" in content && content.expiry?.trim() && new Date(content.expiry).getTime() < now)
    reasons.push("expired");
  if ("date" in content && content.date?.trim() && new Date(content.date).getTime() > now) reasons.push("future");

  return reasons.length > 0 ? reasons : ["active"];
};

export const getContentStatus = <C extends ContentAny>(
  content?: C,
): "active" | "missing" | "disabled" | "expired" | "future" => getContentStatuses(content)[0]!;
