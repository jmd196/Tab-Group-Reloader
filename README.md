<div align="center">
  <img src="icons/icon128.png" alt="Tab Group Reloader logo" width="96">

  # Tab Group Reloader
  **Reload all the tabs in one Chrome tab group with a single click.**
</div>

A tiny, privacy-focused Google Chrome extension for people who organize their browsing with tab groups. Select a tab group from the toolbar popup and reload its pages together, including when the group is collapsed.

## Features

- Reload every tab in a **selected group**, without reloading other groups.
- Works with **collapsed** tab groups.
- Shows groups from the **current Chrome window**, with their names, colors, and tab counts.
- **No tracking, analytics, external requests, stored data, or third-party libraries.**
- No account, setup, or Chrome Web Store installation required.

## Installation

1. Download this repository with **Code → Download ZIP**, or clone it.
2. Extract the ZIP somewhere you want to keep the files.
3. In Chrome, open `chrome://extensions`.
4. Turn on **Developer mode** (top right).
5. Select **Load unpacked**.
6. Select the folder that contains `manifest.json`.
7. Optionally pin **Tab Group Reloader** using Chrome's Extensions (puzzle-piece) menu.

Chrome loads unpacked extensions directly from their folders. **Keep the folder** after installation.

## Usage

1. Click the Tab Group Reloader icon in Chrome's toolbar.
2. Find the group you want to refresh.
3. Click **Reload** next to that group.

Only the tabs in that group and Chrome window are targeted. Chrome may refuse to reload special internal pages.

> **Note:** As with Chrome's normal Reload command, refreshing a page may discard unsaved form entries or other unsaved work.

## Permissions & privacy

The extension requests exactly one permission in `manifest.json`:

| Permission | Reason |
| --- | --- |
| `tabGroups` | Read tab group names, colors, IDs, and window associations so the popup can display your groups. |

Chrome's Tabs API is used to find group members and request their reload. The extension **does not** request host access to websites, read the contents of webpages, save browsing history, or make network requests.

You can inspect everything in [`popup.js`](popup.js), [`popup.html`](popup.html), and [`manifest.json`](manifest.json).

## Files

```text
tab-group-reloader/
├── manifest.json      # Chrome Manifest V3 configuration
├── popup.html         # Toolbar popup layout and styling
├── popup.js           # Group discovery and reload handling
├── icons/             # Extension icon sizes
├── README.md          # This file
└── LICENSE            # MIT License
```

## Compatibility

Designed for Google Chrome with support for Manifest V3 and the `chrome.tabGroups` API. Currently shows tab groups in the active browser window, not every open Chrome window.

## Project status

Small personal utility. No automatic background reloading or scheduled refreshes: pages reload only when you click the Reload button.

## License

Copyright © 2026 [jmd196](https://github.com/jmd196).

Licensed under the [MIT License](LICENSE). You may use, modify, and redistribute the extension under the terms of that license.
