import markdownIt from "markdown-it";
import markdownItTaskCheckbox from "markdown-it-task-checkbox";
import { RenderPlugin } from "@11ty/eleventy";
import { readFileSync } from "fs";
import { imageSize } from "image-size";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";

hljs.registerLanguage("javascript", javascript);

// wraps each line of highlighted code in a .line span (numbered with a CSS counter). a token that
// runs over several lines, like a block comment, is closed at the end of each line and reopened
// at the start of the next
function numberLines(html) {
    const open = [];
    return html.split("\n").map(line => {
        const reopened = open.join("");
        for (const tag of line.match(/<span[^>]*>|<\/span>/g) || []) {
            if (tag === "</span>") open.pop();
            else open.push(tag);
        }
        return `<span class="line">${reopened}${line}${"</span>".repeat(open.length)}</span>`;
    }).join("\n");
}

function readVideoSizes() {
    try {
        return JSON.parse(readFileSync("content/media/video-sizes.json", "utf8"));
    } catch {
        return {};
    }
}

export default function (config) {
    const videoSizes = readVideoSizes();

    config.addGlobalData("sitename", "Level Editor Handbook");

    config.addWatchTarget("./content");

    config.addPassthroughCopy("./public/res");
    config.addPassthroughCopy("./public/**/*.js");
    config.addPassthroughCopy("./public/**/*.css");
    config.addPassthroughCopy("./public/**/*.ico");
    
    config.addPassthroughCopy({
        "./content/media": "media"
    });

    config.addPlugin(RenderPlugin);

    const md = markdownIt({
        html: true,
        breaks: true,
        linkify: true
    }).use(markdownItTaskCheckbox, {
        disabled: false,
        divWrap: false
    });

    const defaultTextRenderer = md.renderer.rules.text;
    md.renderer.rules.text = function(tokens, idx, options, env, self) {
        const token = tokens[idx];
        if (token.content === "[Table of contents]") {
            return `<ul class="toc"></ul>`;
        }
        return defaultTextRenderer(tokens, idx, options, env, self);
    }

    const defaultFenceRenderer = md.renderer.rules.fence;
    md.renderer.rules.fence = function(tokens, idx, options, env, self) {
        const token = tokens[idx];
        const info = token.info.trim();
        const [language, ...flags] = info.split(/\s+/);
        // level scripts (```c3script, or ```js) are highlighted and numbered by line, and never wrap
        if (language === "c3script" || language === "js") {
            const html = hljs.highlight(token.content.replace(/\n$/, ""), { language: "javascript" }).value;
            return `<pre class="script"><code class="language-c3script">${numberLines(html)}</code></pre>\n`;
        }
        // other code blocks wrap their lines when marked with wrap (```wrap, or ```<language> wrap)
        if (language === "wrap" || flags.includes("wrap")) {
            const languageClass = language === "wrap" ? "" : ` class="language-${md.utils.escapeHtml(language)}"`;
            return `<pre class="wrap"><code${languageClass}>${md.utils.escapeHtml(token.content)}</code></pre>\n`;
        }
        // notes and preserve-spacing blocks are Markdown in a styled box; anything else is a
        // normal code block
        if (info.startsWith("note-") || info === "preserve-spacing") {
            const content = token.content;
            var renderedContent = md.render(content);
            if (info === "preserve-spacing") {
                renderedContent = renderedContent.replaceAll("<br>", "");
                return `<p><pre class="${info}">${renderedContent}</pre></p>`;
            } else {
                return `<p><div class="${info}">${renderedContent}</div></p>`;
            }
        }
        return defaultFenceRenderer(tokens, idx, options, env, self);
    }

    const defaultImageRenderer = md.renderer.rules.image;
    md.renderer.rules.image = function(tokens, idx, options, env, self) {
        let token = tokens[idx];
        let src = token.attrs[0][1];
        let content = token.content;
        if (/\.(webm|mp4)$/.test(src)) {
            // videos play like gifs: looping, muted, and laid out at their size before they load
            // (sizes come from content/media/video-sizes.json, written by tools/convert-media.sh).
            // they open in the lightbox like images (see initGalleries in book.js)
            const [width, height] = videoSizes[src] || [16, 9];
            if (!videoSizes[src]) console.warn("no size recorded for " + src);
            return `<figure style="--ratio: ${width / height}"><a class="video" style="aspect-ratio: ${width}/${height}" target="_blank" data-pswp-src="${src}" data-pswp-width="${width}" data-pswp-height="${height}" data-pswp-type="video"><video data-src="${src}" autoplay loop muted playsinline></video></a><figcaption>${content}</figcaption></figure>`;
        } else if (src.includes("#icon")) {
            return defaultImageRenderer(tokens, idx, options, env, self);
        } else {
            src = src.split("#")[0];
            let width = 0;
            let height = 0;
            try {
                var buffer;
                if (src.indexOf("/res/") === 0) {
                    buffer = readFileSync("public" + src);
                } else {
                    buffer = readFileSync("content" + src);
                }
                const dimensions = imageSize(buffer);
                width = dimensions.width;
                height = dimensions.height;
            }
            catch {
                console.warn("could not get dimensions of " + src);
            }
            return `<figure style="--ratio: ${width / height || 1}"><a style="aspect-ratio: ${width}/${height}" target="_blank" data-pswp-src="${src}" data-pswp-width="${width}" data-pswp-height="${height}"><img alt="${content}" data-src="${src}" /></a><figcaption>${content}</figcaption></figure>`;
        }
    }

    // a paragraph that's only images is rendered as just the figures (no <p> around them), and
    // images that follow one another sit side by side in a .figure-row
    md.core.ruler.push("figure_rows", state => {
        const tokens = state.tokens;
        const figureCount = i => {
            if (tokens[i]?.type !== "paragraph_open" || tokens[i + 2]?.type !== "paragraph_close") return 0;
            const children = tokens[i + 1].children.filter(c =>
                c.type !== "softbreak" && !(c.type === "text" && c.content.trim() === ""));
            const isFigure = c => c.type === "image" && !c.attrGet("src").includes("#icon");
            return children.length > 0 && children.every(isFigure) ? children.length : 0;
        };
        const htmlBlock = html => Object.assign(new state.Token("html_block", "", 0), { content: html });
        const result = [];
        for (let i = 0; i < tokens.length; ) {
            if (!figureCount(i)) {
                result.push(tokens[i++]);
                continue;
            }
            const run = [];
            let images = 0;
            while (figureCount(i)) {
                images += figureCount(i);
                const inline = tokens[i + 1];
                inline.children = inline.children.filter(c => c.type === "image");
                run.push(inline);
                i += 3;
            }
            if (images > 1) result.push(htmlBlock(`<div class="figure-row">\n`));
            result.push(...run);
            if (images > 1) result.push(htmlBlock(`</div>\n`));
        }
        state.tokens = result;
    });

    config.setLibrary("md", md);

    return {
        dir: {
            input: "public",
            includes: "_includes",
            data: "_data",
            output: "_site"
        }
    };
};