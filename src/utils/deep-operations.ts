export const tinyDeepForEach = <O>(
  obj: O,
  iterator: (value: any, key: string | number, objHere: any[] | Record<string, any>) => void | "continue" | "break",
  seen = new WeakSet(),
): void | null => {
  if (!obj || typeof obj !== "object" || (seen.has(obj) && seen.add(obj))) return;
  let flow: void | null | "continue" | "break";
  for (const key of Array.isArray(obj) ? Object.keys(obj).map(Number) : Object.keys(obj)) {
    flow = iterator(obj[key as keyof typeof obj], key, obj);
    if (flow === "continue") continue;
    if (flow === "break") return null;
    flow = tinyDeepForEach(obj[key as keyof typeof obj], iterator, seen);
    if (flow === null) return null;
  }
};
