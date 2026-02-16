import fs from 'fs';

var sectionCounter;

function pageToNavHTML(page) {
    if (page.title === "HIDDEN")
        return "";
    let html = `<a data-page="${page.number}" href="${page.url}"><h1>${page.headingValue === 1 ? `<img src="/media/icons/Roman/og/${sectionCounter++}.svg#icon" /> ` : ""}${page.title}</h1></a>`;
    if (page.pages.length > 0) {
        html += "<ol>";
        for (let subpage of page.pages) {
            html += `<li>${pageToNavHTML(subpage)}</li>`;
        }
        html += "</ol>";
    }
    return html;
}

function setURLs(page) {
    if (page.parents.length > 0) {
        let url = encodeURI(
            page.title.toLowerCase()
            .replaceAll(" ", "-")
            .replaceAll(/[!?./'":;]/g, "")
        );
        if (page.parents.length > 0) {
            url = page.parents[page.parents.length - 1].url + "/" + url;
        }
        page.url = url;
    }

    for (let subpage of page.pages) {
        setURLs(subpage);
    }

    // check for duplicate urls
    for (let i=0; i<page.pages.length; i++) {
        for (let j=i+1; j<page.pages.length; j++) {
            if (page.pages[j].url === page.pages[i].url) {
                page.pages[j].url += "-1";
            }
        }
    }
}

function pageData(page) {
    let data = [page];

    for (let subpage of page.pages) {
        data = [...data, ...pageData(subpage)];
    }

    return data;
}

export default function(config) {
    sectionCounter = 1;
    
    const content = fs.readFileSync("./content/content.md", { encoding: "utf8" });

    let pagenumber = 0;
    const lines = content.split("\n");
    const structure = {
        title: config.sitename,
        url: "",
        content: fs.readFileSync("./content/title.md", { encoding: "utf8" }),
        pages: [],
        parents: [],
        headingValue: 0,
        number: pagenumber++
    }
    var currentPage = structure;
    var lookingForSection = true;

    for (let line of lines) {
        if (!lookingForSection && line.trim() !== "---") {
            currentPage.content += "\n" + line;
        }

        if (line.trim() === "") continue;

        if (lookingForSection) {
            let previousPage = currentPage;

            const header = line.split(" ").slice(1).join(" ");
            var headingValue = line.split(" ")[0].length;
            if (line.includes("~")) {
                line = "";
                headingValue--;
            }
            while (headingValue <= previousPage.parents.length) {
                previousPage = previousPage.parents[previousPage.parents.length - 1];
            }
            const page = {
                title: header,
                content: line,
                pages: [],
                parents: [...previousPage.parents, previousPage],
                headingValue,
                number: pagenumber++
            }
            previousPage.pages.push(page);
            currentPage = page;
            lookingForSection = false;
        } else {
            if (line.trim() === "---") {
                lookingForSection = true;
            }
        }
    }

    setURLs(structure);

    var pages = pageData(structure);
    pages.unshift({
        url: "/404",
        title: "404",
        content: fs.readFileSync("./content/404.md", { encoding: "utf8" }),
        parents: [],
        headingValue: 0,
        number: 404
    });
    pages[1].url = "/";

    for (let i=1; i<pages.length; i++) {
        if (i < pages.length - 1)
            pages[i].next = pages[i + 1];
        if (i > 1)
            pages[i].previous = pages[i - 1];
    }

    return {
        pages: pages,
        nav: pageToNavHTML(structure)
    };
}