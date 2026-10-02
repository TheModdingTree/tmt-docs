const badges = {
    required: {
        label: "Required",
        title: "This field must be defined"
    },
    optional: {
        label: "Optional",
        title: "This field may be omitted"
    },
    callback: {
        label: "Callback allowed",
        title: "Accepts a value of the shown type or a callback returning that type"
    },
    "callback-only": {
        label: "Callback only",
        title: "Must be a callback returning the shown type"
    },
    html: {
        label: "Accepts HTML",
        title: "Accepts arbitrary HTML in the string value or callback result"
    }
};

const pattern = /^\{(?:(type|required when):[ \t]*([^{}\r\n]+)|(required|optional|callback-only|callback|html))}/
export default function initBadges(markdown) {
    markdown.inline.ruler.before("text", "badge", (state, silent) => {
        if (state.src[state.pos] !== "{") return false;

        const match = state.src.slice(state.pos, state.posMax).match(pattern);
        if (!match) return false;

        const value = match[2]?.trim();
        if (match[1] && !value) return false;

        if (!silent) {
            const kind = match[1] === "required when" ? "conditional" : match[1] ?? match[3];
            const badge = kind === "type"
                ? { label: value, title: `Type: ${value}` }
                : kind === "conditional"
                    ? { label: `Required when ${value}`, title: `Required only when ${value}` }
                    : badges[kind];

            const token = state.push("badge", "span", 0);
            token.content = badge.label;
            token.meta = { kind, title: badge.title };
        }

        state.pos += match[0].length;
        return true;
    });

    markdown.renderer.rules.badge = (tokens, index) => {
        const token = tokens[index];
        const escape = markdown.utils.escapeHtml;
        return `<span class="badge ${token.meta.kind}-badge" title="${escape(token.meta.title)}">${escape(token.content)}</span>`;
    };
}
