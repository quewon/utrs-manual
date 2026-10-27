import PhotoSwipeLightbox from "/res/photoswipe/photoswipe-lightbox.esm.min.js";
import PhotoSwipe from "/res/photoswipe/photoswipe.esm.min.js";

window.addEventListener("DOMContentLoaded", async () => {
    await initPages();
    initGalleries();
    pageTotal.textContent = book.querySelectorAll(".page").length - 2;

    for (let button of document.querySelectorAll(".dropdown-button")) {
        button.onclick = () => {
            button.classList.toggle("toggled");
            updatePageMarker();
        }
    }

    pageNumberInput.addEventListener("change", () => {
        if (pageNumberInput.value == 404) {
            navigate(404);
        } else {
            var page = book.querySelector(`.page[data-page="${pageNumberInput.value}"]`);
            if (!page) {
                var pages = book.querySelectorAll(".page");
                page = pages[pages.length - 1];
            }
            navigate(page.dataset.page);
        }
    })
    pagePrevious.onclick = () => {
        const page = book.querySelector(`.page[data-page="${parseInt(pageNumberInput.value) - 1}"]`);
        if (page) {
            navigate(page.dataset.page);
        }
    }
    pageNext.onclick = () => {
        const page = book.querySelector(`.page[data-page="${parseInt(pageNumberInput.value) + 1}"]`);
        if (page) {
            navigate(page.dataset.page);
        }
    }

    const swipe = {
        start: { x: 0, y: 0 },
        last: { x: 0 },
        startTime: 0,
        active: false,
        recentDeltaX: 0
    };
    document.addEventListener("touchstart", (e) => {
        if (e.touches[0]) {
            swipe.start = { x: e.touches[0].pageX, y: e.touches[0].pageY };
            swipe.last = { x: e.touches[0].pageX };
            swipe.startTime = Date.now();
            swipe.active = true;
        }
    });
    document.addEventListener("touchmove", (e) => {
        if (e.touches[0]) {
            swipe.recentDeltaX = e.touches[0].pageX - swipe.last.x;
            swipe.last.x = e.touches[0].pageX;
        }
    });
    document.addEventListener("touchend", (e) => {
        if (!swipe.active) return;
        swipe.active = false;
        const end = { x: e.changedTouches[0].pageX, y: e.changedTouches[0].pageY };
        const delta = { x: end.x - swipe.start.x, y: end.y - swipe.start.y };

        if (Math.abs(delta.x) <= Math.abs(delta.y)) return;
        if (
            delta.x !== 0 && swipe.recentDeltaX !== 0 && 
            Math.sign(delta.x) !== Math.sign(swipe.recentDeltaX)
        ) return;

        const elapsed = Date.now() - swipe.startTime;
        const velocity = Math.abs(delta.x) / elapsed;
        const distanceSwipe = Math.abs(delta.x) > 30;
        const flickSwipe = Math.abs(delta.x) > 10 && velocity > 0.3;
        if (!distanceSwipe && !flickSwipe) return;

        if (delta.x < 0) {
            pageNext.click();
        } else {
            pagePrevious.click();
        }
    });
    
    sideToggleButton.onclick = () => {
        sidebar.classList.toggle("toggled");
        updatePageMarker();
    }

    initSearch();

    loadImages();

    if (!navigateByPathname(location.pathname, true)) {
        navigate(404);
    }
    if (location.pathname === "/404") {
        pageNumberInput.value = 404;
    }

    window.addEventListener("resize", updatePageMarker);
    window.addEventListener("resize", updatePageAspects);
})

function loadImages() {
    for (let img of document.querySelectorAll("[data-src]")) {
        img.src = img.dataset.src;
    }
}

async function initPages() {
    const entries = [...book.querySelectorAll(".page, [data-section-url]")];
    for (let page of book.querySelectorAll(".page")) {
        const toc = page.querySelector(".toc");
        if (toc) {
            const hv = parseInt(page.dataset.hv);
            for (let i=entries.indexOf(page) + 1; i<entries.length; i++) {
                const entry = entries[i];
                const isSection = "sectionUrl" in entry.dataset;
                if (!isSection && entry.classList.contains("vis-unlisted")) continue;
                const phv = parseInt(entry.dataset.hv);
                if (phv <= hv) {
                    break;
                }
                if (page.classList.contains("glossary") && phv > hv + 1) continue;
                const li = document.createElement("li");
                const a = document.createElement("a");
                if (isSection) {
                    li.dataset.page = parseInt(entry.closest(".page").dataset.page);
                    li.dataset.section = entry.dataset.sectionUrl;
                    a.href = entry.dataset.sectionUrl;
                    a.textContent = entry.textContent;
                } else {
                    li.dataset.page = parseInt(entry.dataset.page);
                    a.href = entry.dataset.url;
                    a.textContent = entry.dataset.title;
                }
                li.style.paddingLeft = (phv - hv - 1) * 0.5 + "em";
                li.appendChild(a);
                toc.appendChild(li);
            }
        }
    }

    await document.fonts.ready;
    updatePageAspects();

    const height = pageLayoutWidth() * 4/3;

    function bottomOf(element, pageContent) {
        const content = pageContent.getBoundingClientRect();
        const scale = content.width / pageContent.offsetWidth;
        return (element.getBoundingClientRect().bottom - content.top) / scale;
    }

    function topOf(element, pageContent) {
        const content = pageContent.getBoundingClientRect();
        const scale = content.width / pageContent.offsetWidth;
        return (element.getBoundingClientRect().top - content.top) / scale;
    }

    // where a section carries on to the next page, its heading goes with it if only a little of
    // the section would be left under the heading on this page (like the sentence introducing a
    // code example or a table), unless that would leave this page mostly empty. returns how many
    // children to keep, or -1 to keep the page as it is
    function keepHeadingWithSection(children, kept, keptBottom, pageContent, limit) {
        let heading = kept - 1;
        while (heading > 1 && !/^H[1-6]$/.test(children[heading].tagName)) heading--;
        if (heading <= 1) return -1;
        if (keptBottom - bottomOf(children[heading], pageContent) >= height * 0.15) return -1;
        if (topOf(children[heading], pageContent) < limit * 0.5) return -1;
        return heading;
    }

    function pageLimit(pageContent) {
        const page = pageContent.parentElement;
        if (page.classList.contains("section-title") && !page.classList.contains("glossary")) {
            return height * 0.78;
        }
        return Math.ceil(height) - parseFloat(getComputedStyle(pageContent).paddingBottom);
    }

    function isSplittable(element) {
        return element.tagName === "UL" || element.tagName === "OL" || element.tagName === "TABLE";
    }

    function rowsOf(element) {
        if (element.tagName === "TABLE") {
            return element.tBodies[0] ? [...element.tBodies[0].children] : [];
        }
        return [...element.children];
    }

    function splitRow(element, end, pageContent, limit) {
        const rows = rowsOf(element);
        if (rows.length < 2) return -1;
        const below = end - bottomOf(rows[rows.length - 1], pageContent);
        for (let i = rows.length - 2; i >= 0; i--) {
            if (bottomOf(rows[i], pageContent) + below <= limit) return i;
        }
        return -1;
    }

    function columnWidths(table) {
        const width = table.getBoundingClientRect().width;
        const row = table.querySelector("tr:not(.table-continued, .table-continues)");
        return [...row.children].map(cell => cell.getBoundingClientRect().width / width);
    }

    function fixColumns(table, widths) {
        table.querySelector("colgroup")?.remove();
        const columns = document.createElement("colgroup");
        for (let width of widths) {
            const column = document.createElement("col");
            column.style.width = width * 100 + "%";
            columns.appendChild(column);
        }
        table.prepend(columns);
        table.style.tableLayout = "fixed";
    }

    function splitOff(element, row, widths) {
        const copy = element.cloneNode();
        const rows = rowsOf(element).slice(row + 1);
        if (element.tagName === "TABLE") {
            fixColumns(element, widths);
            fixColumns(copy, widths);
            const head = element.querySelector("thead");
            if (head) {
                copy.appendChild(head.cloneNode(true));
                copy.querySelectorAll("tr.table-continued").forEach(row => row.remove());
            }
            const body = document.createElement("tbody");
            body.append(...rows);
            copy.appendChild(body);
            const note = document.createElement("tfoot");
            note.appendChild(continuationRow(element, "table-continues", "Continued on next page"));
            element.appendChild(note);
            let copyHead = copy.querySelector("thead");
            if (!copyHead) {
                copyHead = document.createElement("thead");
                copy.querySelector("colgroup").after(copyHead);
            }
            copyHead.prepend(continuationRow(element, "table-continued", "Continued from previous page"));
        } else {
            copy.append(...rows);
        }
        return copy;
    }

    function columnCount(table) {
        return table.querySelector("tr:not(.table-continued, .table-continues)")?.children.length || 1;
    }

    function continuationRow(table, className, text) {
        const row = document.createElement("tr");
        row.className = className;
        const columns = columnCount(table);
        for (let i = 0; i < columns; i++) row.appendChild(document.createElement("td"));
        const note = document.createElement("span");
        note.className = "table-note";
        note.textContent = text;
        row.lastElementChild.appendChild(note);
        return row;
    }

    function splitPage(page, originalPage) {
        const pageContent = page.querySelector(".page-content");
        const limit = pageLimit(pageContent);
        const children = [...pageContent.children];
        const ends = children.map(child => bottomOf(child, pageContent));
        const fits = count => count === 0 || ends[count - 1] <= limit;

        if (fits(children.length)) return null;
        const last = children[children.length - 1];
        if (!isSplittable(last) && last.clientHeight >= height * 3/4) return null;

        let kept = children.length;
        let split = null;
        const dropped = [];
        while (!fits(kept)) {
            const element = children[kept - 1];

            // short lists and tables move to the next page whole rather than being split
            if (isSplittable(element) && element.offsetHeight >= height * 0.3) {
                const row = splitRow(element, ends[kept - 1], pageContent, limit);
                if (row >= 0) {
                    split = { element, row };
                    if (element.tagName === "TABLE") split.widths = columnWidths(element);
                    break;
                }
                kept--;
                continue;
            }

            if (
                element.classList.contains("breadcrumbs") ||
                element.clientHeight >= height * 3/4
            )
                break;

            if (element.innerHTML === "") dropped.push(element);
            kept--;
        }
        function trimEnd() {
            while (kept > 0 && children[kept - 1].innerHTML.trim() === "") {
                dropped.push(children[--kept]);
            }
            while (kept > 2 && /^H[1-6]$/.test(children[kept - 1].tagName)) {
                kept--;
            }
        }
        if (!split) trimEnd();

        const firstMoved = children.slice(kept).find(element => !dropped.includes(element));
        if (split || (firstMoved && !/^H[1-6]$/.test(firstMoved.tagName))) {
            const keptBottom = split ? bottomOf(rowsOf(split.element)[split.row], pageContent) : ends[kept - 1];
            const heading = keepHeadingWithSection(children, kept, keptBottom, pageContent, limit);
            if (heading >= 0) {
                kept = heading;
                split = null;
                trimEnd();
            }
        }

        for (let element of dropped) element.remove();
        const moved = children.slice(kept).filter(element => !dropped.includes(element));
        if (split) moved.unshift(splitOff(split.element, split.row, split.widths));
        if (moved.length === 0) return null;

        const newPage = document.createElement("div");
        newPage.className = originalPage.className + " vis-unlisted hidden vis-contd";
        newPage.dataset.url = originalPage.dataset.url;
        newPage.dataset.title = originalPage.dataset.title;
        newPage.dataset.hv = originalPage.dataset.hv;

        const newContent = document.createElement("div");
        newContent.className = "page-content";
        if (originalPage.querySelector(".breadcrumbs"))
            newContent.appendChild(originalPage.querySelector(".breadcrumbs").cloneNode(true));
        newContent.append(...moved);

        newPage.appendChild(newContent);
        page.after(newPage);
        return newPage;
    }

    const pages = [...book.querySelectorAll(".page")];
    for (let i=2; i<pages.length; i++) {
        let page = pages[i];
        while (page) {
            page = splitPage(page, pages[i]);
        }
    }

    // number the pages in order (the 404 page keeps its number), and point what linked to a page at its new number
    const numbers = {};
    let number = 0;
    for (let page of book.querySelectorAll(".page")) {
        if (page.dataset.page === "404") continue;
        if (!page.classList.contains("vis-contd")) numbers[page.dataset.page] = number;
        page.dataset.page = number++;
    }
    for (let li of document.querySelectorAll("li[data-page]")) {
        li.dataset.page = numbers[li.dataset.page];
    }

    for (let li of book.querySelectorAll(".toc li[data-section]")) {
        const section = book.querySelector(`[data-section-url="${li.dataset.section}"]`);
        if (section) li.dataset.page = section.closest(".page").dataset.page;
    }
}

function initGalleries() {
    for (let page of book.querySelectorAll(".page-content:has(a[data-pswp-src])")) {
        page.id = "gallery" + page.parentElement.dataset.page;
        const lightbox = new PhotoSwipeLightbox({
            gallery: "#" + page.id,
            children: "a[data-pswp-src]",
            thumbSelector: "img, video",
            pswpModule: PhotoSwipe
        })
        lightbox.on("contentLoad", e => {
            const { content } = e;
            if (content.type !== "video") return;
            e.preventDefault();
            content.element = document.createElement("video");
            content.element.className = "pswp__img";
            content.element.onloadeddata = () => content.onLoaded();
            content.element.src = content.data.src;
            content.element.autoplay = content.element.loop = content.element.muted = content.element.playsInline = true;
            content.element.currentTime = content.data.element.querySelector("video").currentTime;
        });
        lightbox.addFilter("useContentPlaceholder", (usePlaceholder, content) => usePlaceholder || content.type === "video");
        lightbox.addFilter("placeholderSrc", (src, content) => {
            if (content.type !== "video") return src;
            return videoFrame(content.data.element.querySelector("video")) || src;
        });
        lightbox.init();
    }
}

function videoFrame(video) {
    if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return null;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    return canvas.toDataURL("image/jpeg");
}

function initSearch() {
    var searchResults = [];
    var index = 0;

    function clearHighlights() {
        for (let mark of book.querySelectorAll("mark.search-highlight")) {
            const parent = mark.parentNode;
            parent.replaceChild(document.createTextNode(mark.textContent), mark);
            parent.normalize();
        }
        searchResults = [];
        index = 0;
    }

    function highlightPage(page, query) {
        const walker = document.createTreeWalker(
            page.firstElementChild,
            NodeFilter.SHOW_TEXT,
            { acceptNode: (node) => {
                const tag = node.parentElement?.tagName;
                return (tag === "SCRIPT" || tag === "STYLE")
                    ? NodeFilter.FILTER_REJECT
                    : NodeFilter.FILTER_ACCEPT;
            }}
        );

        // a match can run across the text nodes of one block (like bold text inside a paragraph,
        // or the highlighted tokens of a code block), but not from one block into the next
        const blocks = [];
        let node;
        while (node = walker.nextNode()) {
            const block = node.parentElement.closest("p, li, th, td, pre, h1, h2, h3, h4, h5, h6, figcaption, div");
            if (blocks.at(-1)?.element !== block) blocks.push({ element: block, nodes: [] });
            blocks.at(-1).nodes.push(node);
        }

        for (let { nodes } of blocks) {
            const lower = nodes.map(node => node.textContent).join("").toLowerCase();
            const matches = [];
            let pos = 0;
            while ((pos = lower.indexOf(query, pos)) !== -1) {
                matches.push({ start: pos, end: pos + query.length, marks: [] });
                pos += query.length;
            }
            if (matches.length === 0) continue;

            // mark the part of each match that falls in each text node
            let nodeStart = 0;
            for (let textNode of nodes) {
                const text = textNode.textContent;
                const nodeEnd = nodeStart + text.length;
                const fragments = [];
                let lastPos = 0;
                for (let match of matches) {
                    const from = Math.max(match.start, nodeStart) - nodeStart;
                    const to = Math.min(match.end, nodeEnd) - nodeStart;
                    if (from >= to) continue;
                    if (from > lastPos) fragments.push(document.createTextNode(text.slice(lastPos, from)));
                    const mark = document.createElement("mark");
                    mark.className = "search-highlight";
                    mark.textContent = text.slice(from, to);
                    fragments.push(mark);
                    match.marks.push(mark);
                    lastPos = to;
                }
                if (fragments.length > 0) {
                    if (lastPos < text.length) fragments.push(document.createTextNode(text.slice(lastPos)));
                    textNode.replaceWith(...fragments);
                }
                nodeStart = nodeEnd;
            }

            for (let match of matches) searchResults.push({ marks: match.marks, page });
        }
    }

    function jumpToResult(resultIndex) {
        if (searchResults.length === 0) return;
        resultIndex = ((resultIndex % searchResults.length) + searchResults.length) % searchResults.length;
        index = resultIndex;

        for (let mark of book.querySelectorAll("mark.search-highlight-active")) {
            mark.classList.remove("search-highlight-active");
        }
        const result = searchResults[index];
        for (let mark of result.marks) mark.classList.add("search-highlight-active");

        navigate(result.page.dataset.page);
        requestAnimationFrame(() => result.marks[0].scrollIntoView({ block: "nearest" }));

        searchIndex.textContent = index + 1;
        searchResultCount.textContent = searchResults.length;
    }

    searchInput.oninput = function() {
        const query = this.value.trim().toLowerCase();
        clearHighlights();

        if (query !== "") {
            for (let page of book.querySelectorAll(".page")) {
                if (parseInt(page.dataset.page) <= 0 || page.classList.contains("vis-hidden")) continue;
                highlightPage(page, query);
            }
        }
        
        if (searchResults.length > 0) {
            jumpToResult(0);
        } else {
            searchIndex.textContent = "0";
            searchResultCount.textContent = "0";
        }
    }

    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            jumpToResult(e.shiftKey ? index - 1 : index + 1);
        }
    });

    searchPrev.onclick = () => jumpToResult(index - 1);
    searchNext.onclick = () => jumpToResult(index + 1);

    // the magnifying glass clears the search when there's something in it
    searchClear.onclick = () => {
        if (searchInput.value !== "") {
            searchInput.value = "";
            searchInput.oninput();
        }
        searchInput.focus();
    };
}

document.addEventListener("click", e => {
    const a = e.target.closest("a[href]");
    const newTab = e.ctrlKey || e.metaKey || e.button === 1;
    
    if (newTab) return;
    if (!a) return;
    if (a.origin !== location.origin) return;
    if (a.target === "_blank") return;

    e.preventDefault();

    navigateByPathname(new URL(a.href).pathname);
})

window.addEventListener("popstate", () => {
    navigateByPathname(location.pathname, true);
});

document.addEventListener("keydown", e => {
    if (document.activeElement === searchInput) return;
    switch (e.key) {
        case "ArrowLeft":
            pagePrevious.click();
            book.focus();
            break;
        case "ArrowUp":
        case "ArrowDown":
            autoScroll = false;
            book.focus();
            break;
        case "ArrowRight":
            pageNext.click();
            book.focus();
            break;
    }
})

function pageTransition(from, to) {
    to.classList.remove("hidden");
    to.classList.remove("exit-to-right");
    to.classList.remove("exit-to-left");
    to.classList.remove("enter-from-right");
    to.classList.remove("enter-from-left");
    to.onanimationend = null;

    if (from) {
        from.classList.add("hidden");
        from.classList.remove("enter-from-left");
        from.classList.remove("enter-from-right");
        from.classList.remove("exit-to-left");
        from.classList.remove("exit-to-right");
        from.onanimationend = null;

        const fromPageNumber = parseInt(from.dataset.page);
        const toPageNumber = parseInt(to.dataset.page);

        if (toPageNumber > fromPageNumber) {
            from.classList.add("exit-to-left");
            to.classList.add("enter-from-right");
        } else {
            from.classList.add("exit-to-right");
            to.classList.add("enter-from-left");
        }
        from.onanimationend = () => {
            from.classList.remove("exit-to-left");
            from.classList.remove("exit-to-right");
        }
        to.onanimationend = () => {
            to.classList.remove("enter-from-right");
            to.classList.remove("enter-from-left");
        }
    }
}

function navigateByPathname(url, pop) {
    const page = book.querySelector(`.page[data-url="${url}"]`);
    if (page) {
        navigate(page.dataset.page, pop);
        return true;
    }
    const section = book.querySelector(`[data-section-url="${url}"]`);
    if (section) {
        navigate(section.closest(".page").dataset.page, pop, section);
        return true;
    }
    return false;
}

function navigate(pageNumber, pop, section) {
    pageNumber = parseInt(pageNumber);

    const previousPage = book.querySelector(".page:not(.hidden)");
    const page = book.querySelector(`.page[data-page="${pageNumber}"]`);
    const url = section ? section.dataset.sectionUrl : currentEntryUrl(page);

    if (section) {
        section.classList.remove("section-target");
        section.offsetWidth;
        section.classList.add("section-target");
    }

    if (previousPage === page) {
        if (section) {
            if (!pop && location.pathname !== url) {
                history.pushState(section.textContent, "", location.origin + url);
            }
            selectNavLink(url, pageNumber);
        }
        return;
    }

    document.title = section ? section.textContent : page.dataset.title;

    if (!pop && location.pathname !== url) {
        history.pushState(document.title, "", location.origin + url);
    }

    pageTransition(
        previousPage,
        page
    );

    scrollToTop();
    if (pageNumber != 404) {
        pageNumberInput.value = pageNumber;
    }
    pagePrevious.setAttribute("disabled", true);
    pageNext.setAttribute("disabled", true);
    if (book.querySelector(`.page[data-page="${pageNumber - 1}"]`)) {
        pagePrevious.removeAttribute("disabled");
    }
    if (book.querySelector(`.page[data-page="${pageNumber + 1}"]`)) {
        pageNext.removeAttribute("disabled");
    }

    const pageCount = book.querySelectorAll(".page:not(.glossary)").length - 2;
    const progress = Math.min(pageNumber / pageCount * 100, 100);
    progressFill.style.width = progress + "%";
    progressPercentage.textContent = Math.floor(progress) + "%";
    selectNavLink(url, pageNumber);
}

function currentEntryUrl(page) {
    const first = [...page.querySelector(".page-content").children].find(c => !c.classList.contains("breadcrumbs"));
    if (!first) return page.dataset.url;
    if (first.dataset.sectionUrl) return first.dataset.sectionUrl;
    // a page that continues a section, but starts another one partway down, is marked with the new one
    const section = page.classList.contains("vis-contd") && page.querySelector("[data-section-url]");
    if (section) return section.dataset.sectionUrl;
    let url = page.dataset.url;
    for (const entry of book.querySelectorAll(".page:not(.vis-contd), [data-section-url]")) {
        if (first.compareDocumentPosition(entry) & Node.DOCUMENT_POSITION_FOLLOWING) break;
        url = entry.dataset.sectionUrl ?? entry.dataset.url;
    }
    return url;
}

function selectNavLink(url, pageNumber) {
    const pageButton = document.querySelector(`nav a[href="${url}"]`);
    if (pageButton || pageNumber <= 0) {
        document.querySelector("nav a.selected")?.classList.remove("selected");
    }
    if (pageButton) {
        pageButton.classList.add("selected");
    }
    sidebar.classList.remove("toggled");
    updatePageMarker();
}

function lerp(a, b, t) {
    return (1 - t) * a + t * b;
}

var autoScroll = false;
async function scrollToTop() {
    autoScroll = true;
    while (book.scrollTop > 0) {
        if (!autoScroll) return;
        book.scrollTop = lerp(book.scrollTop, 0, 0.2);
        await new Promise(resolve => {
            requestAnimationFrame(() => {
                resolve();
            })
        })
    }
    autoScroll = false;
    book.scrollTop = 0;
}

book.addEventListener("wheel", () => {
    autoScroll = false;
})

function updatePageMarker() {
    const pageButton = document.querySelector("nav a.selected");
    if (pageButton) {
        navPageMarker.style.height = pageButton.offsetHeight + "px";
        navPageMarker.style.top = pageButton.offsetTop + "px";
        navPageMarker.classList.remove("hidden");
    } else {
        navPageMarker.style.top = "0";
        navPageMarker.classList.add("hidden");
    }
}

function updatePageAspects() {
    const page = document.querySelector(".page");
    const height = page.clientWidth * 4/3;
    book.style.setProperty("--page-height", height + "px");
    book.style.setProperty("--page-scale", page.clientWidth / pageLayoutWidth());
}

function pageLayoutWidth() {
    return parseFloat(getComputedStyle(book.querySelector(".page-content")).getPropertyValue("--page-layout-width"));
}