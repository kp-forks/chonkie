import { loader } from "fumadocs-core/source";
import { icons } from "lucide-react";
import { createElement } from "react";
import { docs } from "collections/server";

export const source = loader(
  {
    docs: docs.toFumadocsSource(),
  },
  {
    baseUrl: "/",
    icon(icon) {
      if (icon && icon in icons)
        return createElement(icons[icon as keyof typeof icons]);
    },
  },
);
