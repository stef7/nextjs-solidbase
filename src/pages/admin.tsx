import type { CMS } from "netlify-cms-core";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useEffect, useState } from "react";
import type { Page } from "~/types/next";

type Win = typeof window & { CMS: CMS; CMS_MANUAL_INIT: boolean };
const win = typeof window !== "object" ? undefined : (window as Win);

type Status = "checkOrigin" | "loading" | "wrongOrigin" | "error" | "timedOut";
const messages: Record<Status, string> = {
  checkOrigin: `Loading...`,
  wrongOrigin: `CMS not usable at this origin.`,
  loading: `Loading CMS...`,
  error: `Error loading CMS.`,
  timedOut: `CMS load timed out.`,
};

const AdminPageForCMS: Page = () => {
  const [status, setStatus] = useState<Status | null>("checkOrigin");
  const [loadNow, setLoadNow] = useState(false);

  useEffect(() => {
    if (!win) return;

    if (["https://allowed-origin.test"].includes(location.origin) || location.hostname === "localhost") {
      win.CMS_MANUAL_INIT = true;

      if (location.pathname === "/admin") history.replaceState(history.state, "", "/admin/");

      setLoadNow(true);
      setStatus("loading");
    } else setStatus("wrongOrigin");
  }, []);

  const LocalCMS = dynamic<{ onReady: () => void | null }>(
    () =>
      Promise.all([import("netlify-cms-app"), import("~/cms/init")]).then(([{ default: cms }, { cmsInit }]) => (p) => {
        cmsInit(cms);
        p.onReady();
        return null;
      }),
    {
      ssr: false,
      loading: ({ error, timedOut }) => (error && setStatus("error")) || (timedOut && setStatus("timedOut")) || null,
    },
  );

  return (
    <>
      <Head>
        <title>CMS</title>
      </Head>

      {status && (
        <p className="flex items-center justify-center fixed w-screen h-screen text-2xl">{messages[status]}</p>
      )}

      {loadNow && <LocalCMS onReady={() => setStatus(null)} />}
    </>
  );
};

AdminPageForCMS.layout = ({ children }) => <>{children}</>;

export default AdminPageForCMS;
