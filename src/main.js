import "../styles.css";
import "highlight.js/styles/atom-one-dark.css";

import {getCurrentPath, navigateToPath} from "./core/router.js";
import {getPage, pages} from "./core/pages.js";
import {getMarkdownTitle, renderMarkdown} from "./core/render.js";
import {renderSidebar} from "./core/sidebar.js";

const sidebar = document.getElementById("sidebar");
const htmlPage = document.getElementById("page");

async function render() {
    const path = getCurrentPath();
    const page = getPage(path);

    if (!page) {
        sidebar.innerHTML = renderSidebar(pages, path);
        htmlPage.innerHTML = "<h1>404</h1><p>How did we get here?</p>";
        return;
    }

    const source = await page.load();
    const title = getMarkdownTitle(source, page.title);

    document.title = `${title} | TMT Docs`;
    sidebar.innerHTML = renderSidebar(pages, page.path);
    htmlPage.innerHTML = renderMarkdown(source);
}

window.addEventListener("hashchange", render);
render();

navigateToPath("getting-started/page2")