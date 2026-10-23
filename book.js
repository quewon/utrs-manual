import PhotoSwipeLightbox from "/res/photoswipe/photoswipe-lightbox.esm.min.js";
import PhotoSwipe from "/res/photoswipe/photoswipe.esm.min.js";

window.addEventListener("DOMContentLoaded", async () => {
    // pages and the sections inside them, in reading order
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
        lastTime: 0,
        active: false,
        recentDeltaX: 0
    };
    document.addEventListener("touchstart", (e) => {
        if (e.touches[0]) {
            swipe.start = { x: e.touches[0].pageX, y: e.touches[0].pageY };
            swipe.last = { x: e.touches[0].pageX };
            swipe.startTime = swipe.lastTime = Date.now();
            swipe.active = true;
        }
    });
    document.addEventListener("touchmove", (e) => {
        if (e.touches[0]) {
            swipe.recentDeltaX = e.touches[0].pageX - swipe.last.x;
            swipe.last.x = e.touches[0].pageX;
            swipe.lastTime = Date.now();
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

    await initPages();
    initSearch();

    // splitting pages can move a section onto a later page
    for (let li of book.querySelectorAll(".toc li[data-section]")) {
        const section = book.querySelector(`[data-section-url="${li.dataset.section}"]`);
        if (section) li.dataset.page = section.closest(".page").dataset.page;
    }

    for (let page of book.querySelectorAll(".page-content")) {
        page.style.overflow = "hidden";
    }

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
    // pages are measured to split them, so wait for the fonts that change their size
    await document.fonts.ready;
    updatePageAspects();

    // break up pages

    // pages are laid out at a fixed size (see updatePageAspects), so they split the same way on every screen
    const height = pageLayoutWidth() * 4/3;
    console.log(height);

    // scrollHeight is a whole number, so round --page-height up (866.67 measures as 867)
    function overflows(pageContent) {
        const page = pageContent.parentElement;
        if (page.classList.contains("section-title") && !page.classList.contains("glossary")) {
            // a section title page's background turns white below ~79% of its height, which hides white text there
            const last = pageContent.lastElementChild;
            const bottom = last.offsetTop + last.offsetHeight;
            return bottom > height * 0.78;
        }
        return pageContent.scrollHeight > Math.ceil(height);
    }

    // lists and tables can be split between pages, so they're never too tall to move
    function isSplittable(element) {
        return element.tagName === "UL" || element.tagName === "OL" || element.tagName === "TABLE";
    }

    // moves a list's items (or a table's rows) onto a copy until the page fits, and returns the copy.
    // if the page can't be made to fit that way, nothing is moved and null is returned.
    function splitOff(pageContent, element) {
        const copy = element.cloneNode();
        var source = element;
        var target = copy;
        var note = null;
        if (element.tagName === "TABLE") {
            const head = element.querySelector("thead");
            if (head) {
                copy.appendChild(head.cloneNode(true));
                // a table split more than once: its run-in lines and note aren't repeated
                copy.querySelectorAll("tr.table-continued").forEach(row => row.remove());
            }
            source = element.querySelector("tbody");
            target = document.createElement("tbody");
            copy.appendChild(target);
            // column lines running on below the part that stays, with a note, added first so their
            // height is counted
            note = document.createElement("tfoot");
            note.appendChild(continuationRow(element, "table-continues", "Continued on next page"));
            element.appendChild(note);
        }
        while (overflows(pageContent) && source && source.children.length > 1) {
            target.prepend(source.lastElementChild);
        }
        if (overflows(pageContent) || target.children.length === 0) {
            while (target.firstElementChild) source.appendChild(target.firstElementChild);
            note?.remove();
            return null;
        }
        if (element.tagName === "TABLE") {
            // and column lines running in above the part that moves on
            let head = copy.querySelector("thead");
            if (!head) {
                head = document.createElement("thead");
                copy.prepend(head);
            }
            head.prepend(continuationRow(element, "table-continued", "Continued from previous page"));
        }
        return copy;
    }

    // counted from a real row, not one of the rows added at a split
    function columnCount(table) {
        return table.querySelector("tr:not(.table-continued, .table-continues)")?.children.length || 1;
    }

    // an empty row with a cell per column, drawn as column lines fading out (see style.css),
    // with a short note at its right
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

    var pages = book.querySelectorAll(".page");
    for (let i=pages.length-1; i>=2; i--) {
        var originalPage = pages[i];
        var page = pages[i];
        var pageContent = page.querySelector(".page-content");

        while (overflows(pageContent)) {
            const last = pageContent.lastElementChild;
            if (!isSplittable(last) && last.clientHeight >= height * 3/4)
                break;

            const newPage = document.createElement("div");
            newPage.className = originalPage.className + " vis-unlisted hidden vis-contd";
            newPage.dataset.url = originalPage.dataset.url;
            newPage.dataset.title = originalPage.dataset.title;
            newPage.dataset.page = parseInt(page.dataset.page) + 1;
            newPage.dataset.hv = originalPage.dataset.hv;

            const newContent = document.createElement("div");
            newContent.className = "page-content";
            
            while (overflows(pageContent)) {
                const element = pageContent.lastElementChild;

                if (isSplittable(element)) {
                    const copy = splitOff(pageContent, element);
                    if (copy) {
                        newContent.prepend(copy);
                        break;
                    }
                    // it can't be split to fit on this page: move it whole, and split it on the next one
                    newContent.prepend(element);
                    newContent.offsetHeight;
                    continue;
                }

                if (
                    element.classList.contains("breadcrumbs") ||
                    element.clientHeight >= height * 3/4
                )
                    break;

                if (element.innerHTML === "") {
                    element.remove();
                    continue;
                }

                newContent.prepend(element);
                newContent.offsetHeight;
            }
            // keep a heading with what comes after it (ignoring empty elements, like the empty
            // paragraphs the browser leaves around an image)
            while (pageContent.lastElementChild && pageContent.lastElementChild.innerHTML.trim() === "") {
                pageContent.lastElementChild.remove();
            }
            while (/^H[1-6]$/.test(pageContent.lastElementChild?.tagName) && pageContent.children.length > 2) {
                newContent.prepend(pageContent.lastElementChild);
            }

            // nothing could be moved: stop, or this page would be checked forever
            if (newContent.innerHTML === "") break;
            if (originalPage.querySelector(".breadcrumbs"))
                newContent.prepend(originalPage.querySelector(".breadcrumbs").cloneNode(true));

            newPage.appendChild(newContent);
            page.after(newPage);
            page = newPage;
            pageContent = newContent;

            pages = book.querySelectorAll(".page");
            var pageIndex = [...pages].indexOf(newPage);
            for (let j=pages.length-1; j>pageIndex; j--) {
                const pageNumber = parseInt(pages[j].dataset.page);
                const newNumber = pageNumber + 1;
                for (let li of document.querySelectorAll(`li[data-page="${pageNumber}"]`)) {
                    li.dataset.page = newNumber;
                }
                pages[j].dataset.page = newNumber;
            }
            
            page.offsetHeight;
        }
    }

    for (let page of book.querySelectorAll(".page-content:has(a[data-pswp-src])")) {
        page.id = "gallery" + page.parentElement.dataset.page;
        const lightbox = new PhotoSwipeLightbox({
            gallery: "#" + page.id,
            children: "a[data-pswp-src]",
            pswpModule: PhotoSwipe
        })
        lightbox.on('uiRegister', function() {
            lightbox.pswp.ui.registerElement({
                name: 'custom-caption',
                order: 9,
                isButton: false,
                appendTo: 'root',
                html: 'Caption text',
                onInit: (el, pswp) => {
                    lightbox.pswp.on('change', () => {
                        const currSlideElement = lightbox.pswp.currSlide.data.element;
                        let captionHTML = '';
                        if (currSlideElement) {
                            const hiddenCaption = currSlideElement.querySelector('.hidden-caption-content');
                            if (hiddenCaption) {
                                captionHTML = hiddenCaption.innerHTML;
                            } else {
                                captionHTML = currSlideElement.querySelector('img').getAttribute('alt');
                            }
                        }
                        el.innerHTML = captionHTML || '';
                    });
                }
            });
        });
        lightbox.init();
    }

    pageTotal.textContent = book.querySelectorAll(".page").length - 2;
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

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) textNodes.push(node);

        for (let textNode of textNodes) {
            const text = textNode.textContent;
            const lower = text.toLowerCase();
            let pos = 0, lastPos = 0;
            const fragments = [];

            while ((pos = lower.indexOf(query, lastPos)) !== -1) {
                if (pos > lastPos) fragments.push(document.createTextNode(text.slice(lastPos, pos)));
                const mark = document.createElement("mark");
                mark.className = "search-highlight";
                mark.textContent = text.slice(pos, pos + query.length);
                fragments.push(mark);
                searchResults.push({ mark, page });
                lastPos = pos + query.length;
            }

            if (fragments.length > 0) {
                if (lastPos < text.length) fragments.push(document.createTextNode(text.slice(lastPos)));
                const parent = textNode.parentNode;
                for (let frag of fragments) parent.insertBefore(frag, textNode);
                parent.removeChild(textNode);
            }
        }
    }

    function jumpToResult(resultIndex) {
        if (searchResults.length === 0) return;
        resultIndex = ((resultIndex % searchResults.length) + searchResults.length) % searchResults.length;
        index = resultIndex;

        book.querySelector("mark.search-highlight-active")?.classList.remove("search-highlight-active");
        const result = searchResults[index];
        result.mark.classList.add("search-highlight-active");

        navigate(result.page.dataset.page);
        requestAnimationFrame(() => result.mark.scrollIntoView({ block: "nearest" }));

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

async function pageTransition(from, to) {
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

// opens the page with this url, or the page containing the section with this url.
// returns false if there's no such page or section.
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

// section: a heading inside the page, when navigating to a section rather than the page itself
async function navigate(pageNumber, pop, section) {
    pageNumber = parseInt(pageNumber);

    const previousPage = book.querySelector(".page:not(.hidden)");
    const page = book.querySelector(`.page[data-page="${pageNumber}"]`);
    // the address shows what's being read: the section navigated to, or else the page or section
    // this page starts with or continues (the same entry the sidebar marks)
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

    // compare with the address bar rather than the previous page: a continued page shares its
    // url with the page before it, but the address bar may be showing a section on it
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

// the url of the page or section being read on this page: the section heading it starts with,
// or else the last page or section that began before it (the one this page continues)
function currentEntryUrl(page) {
    const first = [...page.querySelector(".page-content").children].find(c => !c.classList.contains("breadcrumbs"));
    if (!first) return page.dataset.url;
    if (first.dataset.sectionUrl) return first.dataset.sectionUrl;
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
    var pageButton = document.querySelector("nav a.selected");
    if (pageButton) {
        // inside a collapsed section: mark the collapsed section instead
        // (unless the whole sidebar is hidden, when nothing in it is visible)
        while (pageButton.getClientRects().length === 0 && pageButton.closest("nav").getClientRects().length > 0) {
            const parentList = pageButton.closest("ol");
            const parentButton = parentList?.parentElement?.querySelector("a");
            if (!parentButton || parentButton === pageButton) break;
            pageButton = parentButton;
        }
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

// the fixed width page contents are laid out at (see .page-content in style.css)
function pageLayoutWidth() {
    return parseFloat(getComputedStyle(book.querySelector(".page-content")).getPropertyValue("--page-layout-width"));
}