function getPageDepth(path) {
    if (path === "/") return 0;
    return path.split("/").length;
}

export function renderSidebar(pages, currentPath) {
    const realPages = pages.filter(page => page.path !== "/");

    return `
        <a class="sidebar-link ${currentPath === "/" ? "active" : ""}" href="#/">Home</a>
        ${realPages.map(page => {
            const depth = getPageDepth(page.path);
            return `
                <a 
                    class="sidebar-link ${currentPath === page.path ? "active" : ""}"
                    style="--depth: ${Math.max(0, depth - 2)}"
                    href="#${page.path}"
                >
                    ${page.title}
                </a>
            `;
        }).join("")}
    `;
}