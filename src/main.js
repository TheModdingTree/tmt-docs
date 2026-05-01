import {getCurrentPath, navigateToPath} from "./core/router.js";
import {getPage} from "./core/pages.js";
import {getMarkdownTitle, renderMarkdown} from "./core/render.js";

const htmlPage = document.getElementById("page");

async function render() {
    const path = getCurrentPath();
    const page = getPage(path);

    if (!page) {
        htmlPage.innerHTML = "<h1>404</h1><p>How did we get here?</p>";
        return;
    }

    const source = await page.load();
    const title = getMarkdownTitle(source, page.title);

    document.title = `${title} | TMT Docs`;
    htmlPage.innerHTML = renderMarkdown(source);
}

window.addEventListener("hashchange", render);
render();

navigateToPath("getting-started/page2")