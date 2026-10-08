import { render } from "solid-js/web";
import { App } from "./app";

function main(): void {
  const root = document.getElementById("app");
  if (!root) throw new Error("Missing application mount point.");
  render(App, root);
}

main();
