import {getCleanURL} from "./router.js";

function escapeHtml(text) {
    return text.replace(/[&<>"]/g, character => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"
    })[character]);
}

export function renderSidebar(pages, currentPath, collapsed = new Set(), prefix = "sidebar") {
    const nodes = new Map(pages.filter(page => page.path !== "/").map(page => [page.path, { page, children: [] }]));
    const roots = [];

    for (const node of nodes.values()) {
        const parent = nodes.get(node.page.path.slice(0, node.page.path.lastIndexOf("/")));
        (parent?.children ?? roots).push(node);
    }

    function link(path, title) {
        const active = currentPath === path;
        return `<a class="sidebar-link ${active ? "active" : ""}" href="${escapeHtml(getCleanURL(path))}">${escapeHtml(title)}</a>`;
    }

    let section = 0;
    function renderNode({ page, children }) {
        if (children.length === 0) return link(page.path, page.title);

        const id = `${prefix}-section-${section++}`;
        const expanded = !collapsed.has(page.path);
        return `
            <div class="sidebar-row">
                ${link(page.path, page.title)}
                <button class="sidebar-toggle" type="button" data-path="${escapeHtml(page.path)}" aria-expanded="${expanded}">
                    <span>›</span>
                </button>
            </div>
            <div class="sidebar-children" id="${id}" ${expanded ? "" : "hidden"}>
                ${children.map(renderNode).join("")}
            </div>`;
    }

    return link("/", "The Modding Tree") + roots.map(renderNode).join("");
}

export function initSidebar(containers, pages) {
    const collapsed = new Set();
    let previousPath;

    for (const container of containers) {
        container.addEventListener("click", event => {
            const button = event.target.closest(".sidebar-toggle");
            if (!button) return;

            const path = button.dataset.path;
            if (collapsed.has(path)) collapsed.delete(path);
            else collapsed.add(path);

            for (const navigation of containers) {
                for (const toggle of navigation.querySelectorAll(".sidebar-toggle")) {
                    if (toggle.dataset.path !== path) continue;
                    const expanded = !collapsed.has(path);
                    toggle.setAttribute("aria-expanded", String(expanded));
                    toggle.parentElement.nextElementSibling.hidden = !expanded;
                }
            }
        });
    }

    return path => {
        if (path !== previousPath) {
            for (const section of collapsed) {
                if (path === section || path.startsWith(`${section}/`)) collapsed.delete(section);
            }
            previousPath = path;
        }

        for (const container of containers) {
            const scrollTop = container.scrollTop;
            container.innerHTML = renderSidebar(pages, path, collapsed, container.id);
            container.scrollTop = scrollTop;
        }
    };
}