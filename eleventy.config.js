import markdownIt from "markdown-it";
import { RenderPlugin } from "@11ty/eleventy";
import { readFileSync } from "fs";
import { imageSize } from "image-size";

export default function (config) {
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
        if (info) {
            const content = token.content;
            const renderedContent = md.render(content);
            return `<div class="${info}">${renderedContent}</div>`;
        }
        return defaultFenceRenderer(tokens, idx, options, env, self);
    }

    const defaultImageRenderer = md.renderer.rules.image;
    md.renderer.rules.image = function(tokens, idx, options, env, self) {
        let token = tokens[idx];
        let src = token.attrs[0][1];
        let content = token.content;
        if (src.includes("#icon")) {
            return defaultImageRenderer(tokens, idx, options, env, self);
        } else {
            src = src.split("#")[0];
            let width = 0;
            let height = 0;
            try {
                const buffer = readFileSync("content" + src);
                const dimensions = imageSize(buffer);
                width = dimensions.width;
                height = dimensions.height;
            }
            catch {
                console.warn("could not get dimensions of content" + src);
            }
            return `<a target="_blank" data-pswp-src="${src}" data-pswp-width="${width}" data-pswp-height="${height}"><img alt="${content}" src="${src}" /></a>`;
        }
    }

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