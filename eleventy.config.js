import { RenderPlugin } from "@11ty/eleventy";

export default function (config) {
    config.addPassthroughCopy("./public/res/");
    config.addPassthroughCopy("./public/favicon.ico");
    config.addPassthroughCopy("./public/**/*.css");
    config.addPassthroughCopy("./public/script.js");

    config.addPlugin(RenderPlugin);

    return {
        dir: {
            input: "public",
            includes: "_includes",
            data: "_data",
            output: "_site"
        }
    };
};