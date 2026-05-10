import "../styles.css";
import "highlight.js/styles/atom-one-dark.css";

import {getCurrentPage} from "./core/router.js";
import {getPage, pages} from "./core/pages.js";
import {getMarkdownTitle, renderMarkdown} from "./core/render.js";
import {renderSidebar} from "./core/sidebar.js";
import {initTableOfContents, numberPageSections, renderTableOfContents, scrollToSection} from "./core/contents.js";
import {initPageLinks} from "./core/links.js";

const sidebar = document.getElementById("sidebar");
const htmlPage = document.getElementById("page");
const contents = document.getElementById("contents");

async function render() {
    const path = getCurrentPage().path;
    const page = getPage(path);

    if (!page) {
        sidebar.innerHTML = renderSidebar(pages, path);
        htmlPage.innerHTML = "<h1>404</h1><p>How did we get here?</p>";
        contents.innerHTML = "";
        return;
    }

    const source = await page.load();
    const title = getMarkdownTitle(source, page.title);

    document.title = `${title} | TMT Docs`;
    sidebar.innerHTML = renderSidebar(pages, page.path);
    htmlPage.innerHTML = renderMarkdown(source);
    numberPageSections(htmlPage)
    contents.innerHTML = renderTableOfContents(htmlPage);
    initPageLinks(htmlPage);

    requestAnimationFrame(() => {
        scrollToSection(getCurrentPage().section);
    });
}

window.addEventListener("hashchange", render);
render();

initTableOfContents();