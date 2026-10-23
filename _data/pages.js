import fs from 'fs';

function escapeHTML(text) {
    return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

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

// sections are numbered from 0 (Overview is section 00)
function pageToNavHTML(page, sectionCounter = [0, -1]) {
    let html = "";
    let hasVisibleChildren = false;
    for (let subpage of page.pages) {
        if (!subpage.unlisted && !subpage.hidden) {
            hasVisibleChildren = true;
            break;
        }
    }
    if (!page.unlisted) {
        html = `<div>
                <a href="${page.url}" class="hv${page.headingValue}">
                    ${page.headingValue !== 1 && page.parents.length === 1
                        // pages before the first section (like the introduction) aren't numbered
                        ? `<div class="number placeholder">00</div>`
                        : `<div class="number">
                            ${page.headingValue === 1
                                ? twoDigit(sectionCounter[1])
                                : parseSectionCounter(sectionCounter)
                            }
                        </div>`
                    }
                    ${page.title}
                </a>
                ${page.headingValue > 0 && hasVisibleChildren
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

function pageData(page, sectionCounter = [0, -1]) {
    let data = [page];

    if (page.pages.length > 0) {
        for (let subpage of page.pages) {
            for (let i=sectionCounter.length; i<=subpage.headingValue; i++) {
                sectionCounter[i] = 0;
            }
            sectionCounter = sectionCounter.slice(0, subpage.headingValue + 1);
            sectionCounter[subpage.headingValue]++;
            if (sectionCounter[1] >= 0)
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
    // the last page or section added, which the next one is placed under
    var lastNode = structure;
    var lookingForHeader = true;
    var inCode = false;
    // sections are headings inside a page: listed in the sidebar like pages, but not pages of their own
    const sections = [];

    function addSection(level, title) {
        let parent = lastNode;
        while (level <= parent.headingValue) {
            parent = parent.parents[parent.parents.length - 1];
        }
        const section = {
            title,
            content: "",
            pages: [],
            parents: [...parent.parents, parent],
            headingValue: level,
            unlisted: false,
            hidden: false,
            section: true,
            sectionId: sections.length,
            glossary: currentPage.glossary
        };
        parent.pages.push(section);
        sections.push(section);
        lastNode = section;
        // the url is filled in once every url is known (see below)
        return `<h${level} data-section="${section.sectionId}">${escapeHTML(title)}</h${level}>`;
    }

    for (let line of lines) {
        if (!lookingForHeader && line.trim() !== "---") {
            let startsPage = false;
            if (line.trim().startsWith("```")) {
                inCode = !inCode;
            } else if (!inCode) {
                const heading = line.match(/^(#{1,6}) (.+?)\s*$/);
                // a heading that just repeats the page's own title (like on the Introduction page,
                // whose real title is hidden with ~) is neither a new page nor a section
                const repeatsTitle = heading && heading[1].length === currentPage.headingValue && heading[2].trim() === currentPage.title;
                // pages start by themselves at every # and ## heading, after a section's title page,
                // and at every glossary entry; anywhere else, a page only starts at a --- (and long
                // pages are split when the book loads, see book.js)
                startsPage = heading && !repeatsTitle && (heading[1].length <= 2 || currentPage.headingValue === 1 || currentPage.glossary);
                // every other heading is a section
                if (heading && !startsPage && !repeatsTitle) {
                    line = addSection(heading[1].length, heading[2]);
                }
            }
            if (startsPage) {
                lookingForHeader = true;
            } else {
                currentPage.content += "\n" + line;
            }
        }

        if (line.trim() === "") continue;

        if (lookingForHeader) {
            inCode = false;
            let previousPage = lastNode;

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
            lastNode = page;
            lookingForHeader = false;
        } else {
            if (line.trim() === "---") {
                lookingForHeader = true;
            }
        }
    }

    // sections are listed in the sidebar, but they aren't rendered as pages
    var pages = pageData(structure).filter(page => !page.section);

    // section title pages and glossary letters list what's in them
    for (let page of pages) {
        const listsContents = page.headingValue === 1 || (page.glossary && page.headingValue === 2);
        if (listsContents && !page.content.includes("[Table of contents]")) {
            page.content = page.content.trimEnd() + "\n\n[Table of contents]\n";
        }
    }
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

    for (let page of pages) {
        if (!page.content) continue;
        page.content = page.content.replace(/data-section="(\d+)"/g, (match, id) => {
            const section = sections[id];
            return `data-section-url="${section.url}" data-hv="${section.parents.length}"`;
        });
    }

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