export function getCurrentPath() {
    const hash = location.hash.replace("#", "");

    if (!hash || hash === "/") return "/";
    return hash.startsWith("/") ? hash : `/${hash}`;
}

export function navigateToPath(path){
    location.hash = path;
}