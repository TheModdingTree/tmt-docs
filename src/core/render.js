import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import anchor from "markdown-it-anchor";
import container from "markdown-it-container";

function createContainer(markdown, name, defaultTitle){
    markdown.use(container, name, {
        render(tokens, index){
            const token = tokens[index];
            const info = token.info.trim();
            const customTitle = info.slice(name.length).trim();
            const title = customTitle === '' ? defaultTitle : customTitle;

            if (token.nesting === 1) return `<div class="container container-${name}"><p class="container-title">${title}</p><div class="container-body">\n`;
            return "</div></div>\n";
        }
    })
}

export const markdown = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight(code, lang){
        if(hljs.getLanguage(lang)) return hljs.highlight(code, {language: lang}).value;
    }
});

markdown.use(anchor, {
    permalink: false
});

createContainer(markdown, "note", "Note");
createContainer(markdown, "tip", "Tip");
createContainer(markdown, "warning", "Warning");
createContainer(markdown, "danger", "Danger");

export function renderMarkdown(source) {
    return markdown.render(source);
}

export function getMarkdownTitle(source, fallback) {
    const match = source.match(/^#\s+(.+)$/m);
    return match ? match[1].trim() : fallback;
}


