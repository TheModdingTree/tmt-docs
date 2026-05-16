import {getCurrentPage} from "./core/router.js";
import {getPage, pages} from "./core/pages.js";
import {getMarkdownTitle, renderMarkdown} from "./core/render.js";
import {renderSidebar} from "./core/sidebar.js";
import {initTableOfContents, numberPageSections, renderTableOfContents, scrollToSection} from "./core/contents.js";
import {initPageLinks} from "./core/links.js";
import {initMobileMenu, toggleMobileMenu} from "./core/mobile.js";

const sidebar = document.getElementById("sidebar");
const htmlPage = document.getElementById("page");
const contents = document.getElementById("contents");
const mobileMenuPages = document.getElementById("mobileMenuPages");

function renderNavigation(path){
    sidebar.innerHTML = renderSidebar(pages, path);
    mobileMenuPages.innerHTML = renderSidebar(pages, path);
}

async function render() {
    const path = getCurrentPage().path;
    const page = getPage(path);

    if (!page) {
        htmlPage.innerHTML = "<h1>404</h1><p>How did we get here?</p>";
        contents.innerHTML = "";
        renderNavigation(path);
        return;
    }

    const source = await page.load();
    const title = getMarkdownTitle(source, page.title);

    document.title = `${title} | TMT Docs`;
    htmlPage.innerHTML = renderMarkdown(source);
    contents.innerHTML = renderTableOfContents(htmlPage);

    renderNavigation(page.path);
    numberPageSections(htmlPage)
    initPageLinks(htmlPage);

    requestAnimationFrame(() => {
        scrollToSection(getCurrentPage().section);
    });
}

window.addEventListener("hashchange", () => {
    toggleMobileMenu();
    render()
});

initTableOfContents();
initMobileMenu();

render();