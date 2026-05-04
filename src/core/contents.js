export function renderTableOfContents(page) {
    const sections = [...page.querySelectorAll("h2, h3")];
    if (sections.length === 0) return "";

    return `
        <p class="contents-title">On This Page</p>
        <div class="contents-container">
            ${sections.map(section => `
                <button
                    class="contents-link contents-${section.tagName.toLowerCase()}"
                    type="button"
                    data-section="${section.id}"
                >
                    ${section.textContent}
                </button>
            `).join("")}
        </div>
    `;
}

export function initTableOfContents() {
    document.getElementById("contents").onclick = (event) => {
        const sectionId = event.target.closest("[data-section]").dataset.section;
        document.getElementById(sectionId).scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    };
}