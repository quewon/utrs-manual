import markdownIt from "markdown-it";
import markdownItTaskCheckbox from "markdown-it-task-checkbox";
import { RenderPlugin } from "@11ty/eleventy";
import { readFileSync } from "fs";
import { imageSize } from "image-size";

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
        // notes and preserve-spacing blocks are Markdown in a styled box; anything else
        // (like ```js) is a normal code block
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
            // (sizes come from content/media/video-sizes.json, written by tools/convert-media.sh)
            const [width, height] = videoSizes[src] || [16, 9];
            if (!videoSizes[src]) console.warn("no size recorded for " + src);
            return `<figure style="--ratio: ${width / height}"><div class="video" style="aspect-ratio: ${width}/${height}"><video data-src="${src}" autoplay loop muted playsinline></video></div><figcaption>${content}</figcaption></figure>`;
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
            if (width > height) {
                return `<figure style="--ratio: ${width / height || 1}"><a style="aspect-ratio: ${width}/${height}" target="_blank" data-pswp-src="${src}" data-pswp-width="${width}" data-pswp-height="${height}"><img alt="${content}" data-src="${src}" /></a><figcaption>${content}</figcaption></figure>`;
            } else {
                return `<figure style="--ratio: ${width / height || 1}"><a style="aspect-ratio: ${width}/${height}" target="_blank" data-pswp-src="${src}" data-pswp-width="${width}" data-pswp-height="${height}"><img alt="${content}" data-src="${src}" /></a><figcaption>${content}</figcaption></figure>`;
            }
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