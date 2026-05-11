import PhotoSwipeLightbox from "/res/photoswipe/photoswipe-lightbox.esm.min.js";
import PhotoSwipe from "/res/photoswipe/photoswipe.esm.min.js";

window.addEventListener("DOMContentLoaded", async () => {
    const pages = book.querySelectorAll(".page");
    for (let page of pages) {
        const toc = page.querySelector(".toc");
        if (toc) {
            const hv = parseInt(page.dataset.hv);
            let number = parseInt(page.dataset.page);
            for (let i=number + 2; i<pages.length; i++) {
                if (pages[i].classList.contains("vis-unlisted")) continue;
                const phv = parseInt(pages[i].dataset.hv);
                if (phv <= hv) {
                    break;
                }
                const li = document.createElement("li");
                li.dataset.page = parseInt(pages[i].dataset.page);
                const a = document.createElement("a");
                a.href = pages[i].dataset.url;
                a.textContent = pages[i].dataset.title;
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

    document.ontouchstart = (e) => {
        if (e.touches && e.touches[0]) {
            const startX = e.touches[0].pageX;
            const startY = e.touches[0].pageY;

            document.ontouchmove = (e) => {
                if (e.touches && e.touches[0]) {
                    const deltaX = e.touches[0].pageX - startX;
                    const deltaY = e.touches[0].pageY - startY;
                    if (Math.abs(deltaY) > 2) {
                        document.ontouchmove = null;
                        return;
                    }
                    if (deltaX < 10) {
                        pageNext.click();
                        document.ontouchmove = null;
                    } else if (deltaX > 10) {
                        pagePrevious.click();
                        document.ontouchmove = null;
                    }
                }
            }
        }
    }
    
    sideToggleButton.onclick = () => {
        sidebar.classList.toggle("toggled");
        updatePageMarker();
    }

    await initPages();
    initSearch();

    for (let page of book.querySelectorAll(".page-content")) {
        page.style.overflow = "hidden";
    }

    loadImages();

    const page = book.querySelector(`.page[data-url="${location.pathname}"]`);
    if (page) {
        navigate(page.dataset.page);
    } else {
        navigate(404);
    }
    if (location.pathname === "/404") {
        pageNumberInput.value = 404;
    }
})

function loadImages() {
    for (let img of document.querySelectorAll("[data-src]")) {
        img.src = img.dataset.src;
    }
}

async function initPages() {
    // break up pages

    var pages = book.querySelectorAll(".page");
    for (let i=pages.length-1; i>=2; i--) {
        var originalPage = pages[i];
        var page = pages[i];
        var pageContent = page.querySelector(".page-content");

        while (pageContent.scrollHeight > pageContent.clientHeight) {
            if (pageContent.lastElementChild.clientHeight >= pageContent.clientHeight * 3/4)
                break;

            const newPage = document.createElement("div");
            newPage.className = originalPage.className + " vis-unlisted hidden vis-contd";
            newPage.dataset.url = originalPage.dataset.url;
            newPage.dataset.title = originalPage.dataset.title;
            newPage.dataset.page = parseInt(page.dataset.page) + 1;
            newPage.dataset.hv = originalPage.dataset.hv;

            const newContent = document.createElement("div");
            newContent.className = "page-content";
            
            while (pageContent.scrollHeight > pageContent.clientHeight) {
                if (
                    pageContent.scrollHeight > pageContent.clientHeight &&
                    pageContent.lastElementChild.tagName === "UL"
                ) {
                    const element = pageContent.lastElementChild;
                    var secondList = pageContent.lastElementChild.cloneNode();
                    while (pageContent.scrollHeight > pageContent.clientHeight) {
                        secondList.prepend(element.lastElementChild);
                        pageContent.scrollHeight;
                    }
                    newContent.prepend(secondList);
                    break;
                }

                const element = pageContent.lastElementChild;

                if (
                    element.classList.contains("breadcrumbs") ||
                    element.clientHeight >= pageContent.clientHeight * 3/4
                )
                    break;

                if (element.innerHTML === "") {
                    element.remove();
                    continue;
                }

                newContent.prepend(element);
                newContent.offsetHeight;
            }
            if (newContent.innerHTML === "") continue;
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
            jumpToResult(0);
        } else {
            searchIndex.textContent = 0;
            searchResultCount.textContent = 0;
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

window.addEventListener("resize", updatePageMarker);

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

async function navigateByPathname(url, pop) {
    const page = book.querySelector(`.page[data-url="${url}"]`);
    navigate(page.dataset.page, pop);
}

async function navigate(pageNumber, pop) {
    pageNumber = parseInt(pageNumber);

    const previousPage = book.querySelector(".page:not(.hidden)");
    const page = book.querySelector(`.page[data-page="${pageNumber}"]`);

    if (previousPage === page) return;

    document.title = page.dataset.title;

    if (!pop && previousPage?.dataset.url !== page.dataset.url) {
        history.pushState(document.title, "", location.origin + page.dataset.url);
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
    
    const pageButton = document.querySelector(`nav a[href="${page.dataset.url}"]`);
    if (pageButton || pageNumber <= 0) {
        document.querySelector("nav a.selected")?.classList.remove("selected");
    }
    const pageCount = book.querySelectorAll(".page:not(.glossary)").length - 2;
    const progress = Math.min(pageNumber / pageCount * 100, 100);
    progressFill.style.width = progress + "%";
    progressPercentage.textContent = Math.floor(progress) + "%";
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
        if (!pageButton.offsetTop) {
            while (!pageButton.offsetTop) {
                pageButton = pageButton.closest("ol").parentElement.querySelector("a");
            }
            navPageMarker.classList.add("hidden");
            navPageMarker.style.top = pageButton.offsetTop + "px";
        } else {
            navPageMarker.style.height = pageButton.offsetHeight + "px";
            navPageMarker.style.top = pageButton.offsetTop + "px";
            navPageMarker.classList.remove("hidden");
        }
    } else {
        navPageMarker.style.top = "0";
        navPageMarker.classList.add("hidden");
    }
}