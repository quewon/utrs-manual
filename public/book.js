import PhotoSwipeLightbox from "/res/photoswipe/photoswipe-lightbox.esm.min.js";
import PhotoSwipe from "/res/photoswipe/photoswipe.esm.min.js";

window.addEventListener("DOMContentLoaded", () => {
    const pages = book.querySelectorAll(".page");
    for (let page of pages) {
        const toc = page.querySelector(".toc");
        if (toc) {
            const hv = parseInt(page.dataset.hv);
            let number = parseInt(page.dataset.page);
            for (let i=number + 2; i<pages.length; i++) {
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
})

window.addEventListener("load", async () => {
    await initPages();

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

async function initPages() {
    // break up pages

    var pages = book.querySelectorAll(".page");
    for (let i=pages.length-1; i>=0; i--) {
        var originalPage = pages[i];
        var page = pages[i];
        var pageContent = page.querySelector(".page-content");

        while (pageContent.scrollHeight > pageContent.clientHeight) {
            if (pageContent.lastElementChild.clientHeight >= pageContent.clientHeight * 3/4)
                break;

            const newPage = document.createElement("div");
            newPage.className = originalPage.className + " vis-unlisted hidden";
            newPage.dataset.url = originalPage.dataset.url;
            newPage.dataset.title = originalPage.dataset.title;
            newPage.dataset.page = parseInt(page.dataset.page) + 1;
            newPage.dataset.hv = originalPage.dataset.hv;

            const newContent = document.createElement("div");
            newContent.className = "page-content";
            
            while (pageContent.scrollHeight > pageContent.clientHeight) {
                if (
                    pageContent.lastElementChild.classList.contains("breadcrumbs") ||
                    pageContent.lastElementChild.clientHeight >= pageContent.clientHeight * 3/4
                )
                    break;

                if (pageContent.lastElementChild.innerHTML === "") {
                    pageContent.lastElementChild.remove();
                    continue;
                }

                newContent.prepend(pageContent.lastElementChild);
                newContent.offsetHeight;
            }
            if (newContent.innerHTML === "") continue;
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