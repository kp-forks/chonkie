import { getProductById } from "./docs-products";

export function getProductFromPath() {
  return getProductById("chonkie");
}

export function switchProductHref(
  _pathname: string,
  targetId: "chonkie" | "chonkiejs",
): string {
  return getProductById(targetId).defaultPage;
}
