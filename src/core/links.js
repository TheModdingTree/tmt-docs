import {pages} from "./pages.js";

function isExternal(link){
    const regex = /^[a-zA-Z][a-zA-Z\d+.-]*:/;
    return regex.test(link);
}

function isShorthand(link) {
    const regex = /^\d+(\/\d+)*$/;
    return regex.test(link);
}

function getPrefix(split) {
    return split.match(/^(\d+)-/)?.[1] ?? null;
}
function getShorthandPath(realPath) {
    const splits = realPath.replace("../pages/", "").replace(".md", "").split("/");

    const prefixes = [];
    for (const split of splits) {
        if (split === "_index") continue;

        const prefix = getPrefix(split);
        if (prefix === null) return null;

        prefixes.push(prefix);
    }
    return prefixes.join("/");
}

function makeShorthandMap(pages) {
    const map = new Map();

    for (const page of pages) {
        const shorthand = getShorthandPath(page.realPath);
        if (!shorthand) continue;

        map.set(shorthand, page.path);
    }

    return map;
}
const shorthands = makeShorthandMap(pages);

function splitLink(link) {
    const [path, query = ""] = link.split("?");
    return { path, query };
}
function appendQuery(path, query) {
    return query ? `${path}?${query}` : `${path}?s=1`;
}

export function initPageLinks(page){
    for(const element of page.querySelectorAll("a[href]")){
        const link = splitLink(element.getAttribute("href"));

        if(isExternal(link.path)){
            element.className = "external-link";
            element.rel = "external";
            element.target = "_blank";
            continue;
        }

        const cleanLink = isShorthand(link.path) ? shorthands.get(link.path) : `/${link.path}`;
        element.className = "page-link";
        element.setAttribute("href", `/#${appendQuery(cleanLink, link.query)}`);
    }
}