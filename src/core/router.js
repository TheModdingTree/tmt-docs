export function getCurrentPage() {
    const hash = location.hash.replace("#", "");
    const normalized = !hash || hash === "/" ? "/" : hash.startsWith("/") ? hash : `/${hash}`;

    const [path, query = ""] = normalized.split("?");
    const params = new URLSearchParams(query);
    return { path, section: params.get("s") };
}

export function setCurrentSection(section) {
    location.hash = `${getCurrentPage().path}?s=${section}`;
}