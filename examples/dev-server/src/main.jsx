import React from "react";
import { createRoot } from "react-dom/client";
import { Bridge } from "the-bridge";
import config from "../../estate-agent-config.js";

/**
 * Dev server entry point.
 *
 * Mounts The Bridge with the estate-agent config.
 * Edit estate-agent-config.js or create your own config to customise.
 *
 * To use your own config:
 *   1. Copy estate-agent-config.js to my-config.js
 *   2. Edit the entities, objectives, backlog, etc.
 *   3. Change the import above to point at your config
 */

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Bridge config={config} />
  </React.StrictMode>
);
