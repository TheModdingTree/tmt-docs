export function toggleMobileMenu(state) {
    document.getElementById("docContainer").style.display = state ? "none" : "";
    document.getElementById("mobileMenu").style.display = state ? "flex" : "none";
}

export function initMobileMenu() {
    document.getElementById("mobileMenuShow").onclick = () => toggleMobileMenu(true);
    document.getElementById("mobileMenuHide").onclick = () => toggleMobileMenu(false);
    window.matchMedia("(max-width: 960px)").addEventListener("change", event => {
        if (!event.matches) toggleMobileMenu(false);
    });
}