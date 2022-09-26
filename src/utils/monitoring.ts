const getStack = () => {
  const { stack } = new Error(" ");
  const slice = stack
    ?.split(/\/monitoring\.ts[^\n]+/)
    .at(-1)
    ?.split(/\n[^\n]+ (?:processTicksAndRejections|Object\.renderToHTML|renderWithHooks) /)
    .at(0)
    ?.replaceAll("webpack-internal:///./", "");
  return [slice].filter(Boolean);
};

const RED = "\u001B[31m";
const YELLOW = "\u001B[33m";
const RESET = "\u001B[0m";

export const logError =
  typeof window === "object"
    ? window.console.error
    : (...a: any[]) => console.error(RED + "error:" + RESET, ...a, ...getStack());

export const logWarn =
  typeof window === "object"
    ? window.console.warn
    : (...a: any[]) => console.warn(YELLOW + "warn:" + RESET, ...a, ...getStack());
