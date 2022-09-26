import type { CMS } from "netlify-cms-core";
import { cmsConfig } from "~/cms/config";
import { registerPreviewTemplates } from "~/cms/preview/templates";
import { logWarn } from "~/utils/monitoring";

let initialised = false;

export const cmsInit = (cms: CMS): void | null => {
  if (initialised) return logWarn("CMS already initialised.");
  else initialised = true;

  registerPreviewTemplates(cms);

  cms.init({ config: cmsConfig });
};
