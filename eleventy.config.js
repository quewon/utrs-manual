import { RenderPlugin } from "@11ty/eleventy";

export default function (config) {
    config.addGlobalData("sitename", "Handbook");

    config.addPassthroughCopy("./public/res");
    config.addPassthroughCopy("./public/**/*.js");
    config.addPassthroughCopy("./public/**/*.css");
    config.addPassthroughCopy("./public/**/*.ico");

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