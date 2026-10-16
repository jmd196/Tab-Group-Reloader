"use strict";

// No site access, tracking, network requests, or stored data.
const COLORS = {
  grey: "#9aa0a6",
  blue: "#8ab4f8",
  red: "#f28b82",
  yellow: "#fdd663",
  green: "#81c995",
  pink: "#ff8bcb",
  purple: "#c58af9",
  cyan: "#78d9ec",
  orange: "#fbbc70"
};

const groupList = document.getElementById("groups");
const status = document.getElementById("status");

function showStatus(message, isError = false) {
  status.textContent = message;
  status.classList.toggle("error", isError);
}

function makeGroupRow(group, tabsInGroup) {
  const row = document.createElement("div");
  row.className = "group";

  const info = document.createElement("div");
  info.className = "group-info";

  const dot = document.createElement("span");
  dot.className = "dot";
  dot.style.backgroundColor = COLORS[group.color] || COLORS.grey;
  dot.setAttribute("aria-hidden", "true");

  const labels = document.createElement("div");
  labels.className = "group-text";

  const title = document.createElement("div");
  title.className = "group-name";
  title.textContent = group.title || "Untitled group";
  title.title = title.textContent;

  const count = document.createElement("div");
  count.className = "group-count";
  count.textContent = `${tabsInGroup.length} ${tabsInGroup.length === 1 ? "tab" : "tabs"}`;

  labels.append(title, count);
  info.append(dot, labels);

  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Reload";
  button.setAttribute("aria-label", `Reload tabs in ${title.textContent}`);
  button.addEventListener("click", async () => {
    button.disabled = true;
    button.textContent = "Reloading";
    showStatus("");

    try {
      // Query again in case tabs moved in or out of this group since opening.
      const tabs = await chrome.tabs.query({ groupId: group.id, windowId: group.windowId });
      const tabIds = tabs.map(tab => tab.id).filter(Number.isInteger);
      if (tabIds.length === 0) {
        showStatus("This group has no tabs now.", true);
        return;
      }

      const results = await Promise.allSettled(tabIds.map(id => chrome.tabs.reload(id)));
      const successful = results.filter(result => result.status === "fulfilled").length;
      const failed = results.length - successful;
      if (failed > 0) {
        showStatus(`Reload requested for ${successful} tab(s); ${failed} could not be reloaded.`, true);
      } else {
        showStatus(`Reload requested for ${successful} ${successful === 1 ? "tab" : "tabs"} in “${title.textContent}”.`);
      }
    } catch (error) {
      showStatus("Could not reload this group. It may have been closed or moved.", true);
      console.error("Tab Group Reloader:", error);
    } finally {
      button.disabled = false;
      button.textContent = "Reload";
    }
  });

  row.append(info, button);
  return row;
}

async function loadGroups() {
  try {
    const allTabs = await chrome.tabs.query({ currentWindow: true });
    const [activeTab] = allTabs.filter(tab => tab.active);
    if (!activeTab) {
      throw new Error("No active Chrome tab found in the current window.");
    }

    const groups = await chrome.tabGroups.query({ windowId: activeTab.windowId });
    const items = groups.map(group => {
      const tabs = allTabs.filter(tab => tab.groupId === group.id);
      return { group, tabs, firstIndex: Math.min(...tabs.map(tab => tab.index)) };
    }).filter(item => item.tabs.length > 0).sort((a, b) => a.firstIndex - b.firstIndex);

    if (items.length === 0) {
      const empty = document.createElement("p");
      empty.id = "empty";
      empty.textContent = "No tab groups in this window.";
      groupList.append(empty);
      return;
    }

    for (const item of items) {
      groupList.append(makeGroupRow(item.group, item.tabs));
    }
  } catch (error) {
    console.error("Tab Group Reloader:", error);
    showStatus("Unable to find tab groups in this window.", true);
  }
}

loadGroups();
