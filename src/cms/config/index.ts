import { CmsConfig } from "netlify-cms-core";
import { cmsCollections } from "./collections";

export const cmsConfig: CmsConfig = {
  backend: {
    // name: "github",
    // repo: "stef7/nextjs-solidbase",
    // branch: "main",
    // [`preview_context` as string]: "ncms-preview",
    name: "test-repo",
  },
  local_backend: process.env.NODE_ENV === "development",
  load_config_file: false,

  media_folder: "public/cms-uploads",
  public_folder: "/cms-uploads",

  publish_mode: "editorial_workflow",
  show_preview_links: true,

  site_url: process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : `http://localhost:3000`,

  slug: {
    encoding: "ascii",
    clean_accents: true,
  },

  collections: cmsCollections,
};
