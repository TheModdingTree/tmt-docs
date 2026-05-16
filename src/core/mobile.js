function isMobile() {
    return window.matchMedia("(max-width: 960px)").matches;
}

export function toggleMobileMenu(state) {
    document.getElementById("docContainer").style.display = state ? "none" : isMobile() ? "block" : "grid";
    document.getElementById("mobileMenu").style.display = state ? "flex" : "none";
}

export function initMobileMenu() {
    document.getElementById("mobileMenuShow").onclick = () => toggleMobileMenu(true);
    document.getElementById("mobileMenuHide").onclick = () => toggleMobileMenu(false);
}