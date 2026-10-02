import {setCurrentSection} from "./router.js";

export function numberPageSections(page) {
    let h2Count = 0;
    let h3Count = 0;

    for (const section of page.querySelectorAll("h2, h3")) {
        if (section.tagName === "H2") {
            h2Count++;
            h3Count = 0;
            section.dataset.sectionNumber = String(h2Count);
            continue;
        }

        h3Count++;
        section.dataset.sectionNumber = `${h2Count}.${h3Count}`;
    }
}

export function scrollToSection(section) {
    if (!section) return;

    const element = document.getElementById(section) ?? document.querySelector(`[data-section-number="${section}"]`);
    element?.scrollIntoView({
        //behavior: "smooth",
        block: "start",
    });
}

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
                    data-section-number="${section.dataset.sectionNumber}"
                >
                    ${escapeHtml(getSectionLabel(section))}
                </button>
            `).join("")}
        </div>
    `;
}

function getSectionLabel(section) {
    const label = section.cloneNode(true);
    label.querySelectorAll(".badge").forEach(badge => badge.remove());
    return label.textContent.trim();
}

function escapeHtml(text) {
    return text.replace(/[&<>"]/g, character => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"
    })[character]);
}

export function initTableOfContents() {
    document.getElementById("contents").onclick = event => {
        const section = event.target.closest("[data-section-number]")?.dataset.sectionNumber;
        if(!section) return;
        setCurrentSection(section);
    };
}