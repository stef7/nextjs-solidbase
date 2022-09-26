import { write } from "fs-jetpack";
import { generateTypes } from "netlify-ts/lib/generate";
import type { Collection } from "netlify-ts/lib/types";

import { cmsCollections } from "~/cms/config/collections";

const typesPath = "src/cms/types-generated.ts";

let typesString = generateTypes(cmsCollections as Collection[], { label: false });

// collect all files & folder-collections under "ALL":
const titles = cmsCollections.flatMap((c) => c.files?.map((f) => f.name) ?? c.name);
typesString += `\nexport type ALL_NCMS_GENERATED={${titles.map((t) => `${t}:${t}`).join(";")}};`;

// group files into their file collections:
const fileCs = cmsCollections.filter((c) => c.files).map((c) => [c.name, ...c.files!.map((f) => f.name)]);
typesString += `\nexport type ALL_NCMS_FILECOLLS={${fileCs.map(([n, ...f]) => `${n}:"${f.join('"|"')}"`).join(";")}};`;

write(typesPath, typesString);

console.log(`✅ CMS types generated: ${typesPath}`);
