function cleanPath(path){
    return path.replace("../pages/", "").replace(".md", "").split("/").map(part => part.replace(/^\d+-/, "")).join("/");
}

function normalizePath(path){
    let normalized = cleanPath(path);

    if(normalized === "_index") return "/";
    if(normalized.endsWith("/_index")) normalized = normalized.slice(0, -"/_index".length);
    if(normalized.includes("!")) normalized = normalized.replace("!", "")

    return `/${normalized}`;
}

function getTitleFromPath(path){
    const splits = cleanPath(path).split("/");
    const end = splits.at(-1) === "_index" ? splits.at(-2) : splits.at(-1);

    if(end === undefined) return "home";
    if(splits.at(-1).startsWith("!")) return end.split("-").map(split => split.charAt(0) + split.slice(1)).join(" ").replace("!", "");
    return end.split("-").map(split => split.charAt(0).toUpperCase() + split.slice(1)).join(" ");
}

const modules = import.meta.glob("../pages/**/*.md", {
    query: "?raw",
    import: "default"
});

export const pages = Object.entries(modules)
    .map(([realPath, loadMarkdown]) => ({
        realPath,
        path: normalizePath(realPath),
        title: getTitleFromPath(realPath),
        load: loadMarkdown
    })).sort((a, b) => a.realPath.localeCompare(b.realPath));

export function getPage(path){
    return pages.find(page => page.path === path) ?? null; // EVIL dynamic typing shenanigans for error checking.
}