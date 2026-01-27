import markdownIt from "markdown-it";
import { RenderPlugin } from "@11ty/eleventy";

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