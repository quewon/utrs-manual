import fs from 'fs';

function twoDigit(number) {
    if (number < 10) {
        number = "0" + number;
    }
    return number;
}

function parseSectionCounter(sectionCounter) {
    let s = sectionCounter[1];
    for (let i=2; i<sectionCounter.length; i++) {
        s += "." + sectionCounter[i];
    }
    return s;
}

function pageToNavHTML(page, sectionCounter = [0]) {
    let html = "";
    if (!page.unlisted) {
        html = `<div>
                <a href="${page.url}" class="hv${page.headingValue}">
                    <div class="number">
                        ${page.headingValue === 1
                            ? twoDigit(sectionCounter[1]) 
                            : parseSectionCounter(sectionCounter)
                        }
                    </div>
                    ${page.title}
                </a>
                ${page.headingValue > 0 && page.pages.length > 0
                    ? `<button class="dropdown-button${page.headingValue > 1 || page.title === "Glossary" ? " toggled" : ""}" title="Toggle collapse"></button>`
                    : ""
                }
            </div>`;
    }
    if (page.pages.length > 0) {
        html += "<ol>";
        for (let subpage of page.pages) {
            for (let i=sectionCounter.length; i<=subpage.headingValue; i++) {
                sectionCounter[i] = 0;
            }
            sectionCounter = sectionCounter.slice(0, subpage.headingValue + 1);
            if (!subpage.unlisted)
                sectionCounter[subpage.headingValue]++;
            let subpageHTML = pageToNavHTML(subpage, sectionCounter);
            if (subpageHTML) {
                html += `<li>${subpageHTML}</li>`;
            }
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

function pageData(page, sectionCounter = [0]) {
    let data = [page];

    if (page.pages.length > 0) {
        for (let subpage of page.pages) {
            for (let i=sectionCounter.length; i<=subpage.headingValue; i++) {
                sectionCounter[i] = 0;
            }
            sectionCounter = sectionCounter.slice(0, subpage.headingValue + 1);
            sectionCounter[subpage.headingValue]++;
            if (sectionCounter[1])
                subpage.sectionNumber = sectionCounter[1];
            data = [...data, ...pageData(subpage, sectionCounter)];
        }
    }

    return data;
}

export default function(config) {
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
        number: pagenumber++,
        unlisted: true,
        hidden: false
    }
    var currentPage = structure;
    var lookingForHeader = true;

    for (let line of lines) {
        if (!lookingForHeader && line.trim() !== "---") {
            currentPage.content += "\n" + line;
        }

        if (line.trim() === "") continue;

        if (lookingForHeader) {
            let previousPage = currentPage;

            var unlisted = false;
            var hidden = false;
            var headingValue = line.split(" ")[0].length;
            const header = line.trim().split(" ").slice(1).join(" ");
            if (line.indexOf("UNLISTED") == 0) {
                headingValue -= "UNLISTED".length;
                line = line.slice("UNLISTED".length);
                unlisted = true;
            } else if (line.indexOf("HIDDEN") == 0) {
                headingValue -= "HIDDEN".length;
                line = line.slice("HIDDEN".length);
                unlisted = true;
                hidden = true;
            }
            if (line.includes("~")) {
                headingValue--;
                line = "";
            }
            while (headingValue <= previousPage.headingValue) {
                previousPage = previousPage.parents[previousPage.parents.length - 1];
            }
            const page = {
                title: header,
                content: line,
                pages: [],
                parents: headingValue === previousPage.headingValue ? previousPage.parents : [...previousPage.parents, previousPage],
                headingValue,
                number: pagenumber++,
                unlisted,
                hidden,
                glossary: header === "Glossary"
            }
            for (let parent of page.parents) {
                if (parent.title === "Glossary") {
                    page.glossary = true;
                    break;
                }
            }
            previousPage.pages.push(page);
            currentPage = page;
            lookingForHeader = false;
        } else {
            if (line.trim() === "---") {
                lookingForHeader = true;
            }
        }
    }

    var pages = pageData(structure);
    pages.unshift({
        url: "/404",
        title: "404",
        content: fs.readFileSync("./content/404.md", { encoding: "utf8" }),
        parents: [],
        headingValue: 0,
        number: 404,
        unlisted: true,
        hidden: true
    });

    setURLs(structure);
    pages[1].url = "/";

    var visiblePages = pages.filter(page => {
        return page.title !== "HIDDEN"
    })

    for (let i=1; i<visiblePages.length; i++) {
        let page = pages[pages.indexOf(visiblePages[i])];
        if (page.title === "HIDDEN")
            continue;
        if (i < visiblePages.length - 1) {
            page.next = visiblePages[i + 1];
        }
        if (i > 1) {
            page.previous = visiblePages[i - 1];
        }
    }

    return {
        pages: pages,
        nav: pageToNavHTML(structure)
    };
}