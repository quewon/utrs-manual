import fs from 'fs';

function pageToNavHTML(page) {
    let html = `<a href="javascript:goto('/${page.url}')"><h1>${page.title}</h1></a>`;
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
    if (page.headingValue > 0) {
        let url = encodeURI(page.title.toLowerCase().replaceAll(" ", "-"));
        if (page.parent?.parent) {
            url = page.parent.url + "/" + url;
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

export default function() {
    const content = fs.readFileSync("./content/content.md", { encoding: "utf8" });

    const lines = content.split("\n");
    const structure = {
        title: "Index",
        url: "",
        pages: [],
        headingValue: 0
    }
    var currentPage = structure;
    var lookingForSection = true;

    for (let line of lines) {
        if (!lookingForSection && line.trim() !== "---") {
            currentPage.content += "\n" + line;
        }

        if (line.trim() === "") continue;

        if (lookingForSection) {
            const header = line.split(" ").slice(1).join(" ");
            const headingValue = line.split(" ")[0].length;
            while (headingValue <= currentPage.headingValue) {
                currentPage = currentPage.parent;
            }
            const page = {
                title: header,
                content: line,
                pages: [],
                parent: currentPage,
                headingValue: headingValue,
            }
            currentPage.pages.push(page);
            currentPage = page;
            lookingForSection = false;
        } else {
            if (line.trim() === "---") {
                lookingForSection = true;
            }
        }
    }

    setURLs(structure);

    return {
        pages: pageData(structure).slice(1),
        nav: pageToNavHTML(structure)
    };
}