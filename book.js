import PhotoSwipeLightbox from "/res/photoswipe/photoswipe-lightbox.esm.min.js";
import PhotoSwipe from "/res/photoswipe/photoswipe.esm.min.js";

//

var pages;
var previousState;
var currentPageNumber = -1;
const book = document.querySelector(".book");
const rem = parseFloat(getComputedStyle(book).fontSize);

window.onload = () => {
    pages = document.querySelectorAll(".page");

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
                li.style.paddingLeft = (phv - hv - 1) * 1.5 * rem + "px";
                li.appendChild(a);
                toc.appendChild(li);
            }
        }

        const input = page.querySelector("footer input");
        input.onkeydown = e => {
            e.stopPropagation();
        }
        input.onchange = function() {
            let value = input.value;
            if (!document.querySelector(`.page[data-page="${value}"]`)) {
                value = Math.min(parseInt(value), pages.length - 2);
                value = Math.max(0, value);
            }
            goto(document.querySelector(`.page[data-page="${value}"]`).dataset.url);
            this.value = value;
        }
    }

    let i = 1;
    for (let section of book.querySelectorAll(".page.section-title")) {
        let icon = document.createElement("img");
        icon.src = `/media/icons/Roman/${i}.svg#icon`;
        icon.alt = "";
        section.prepend(icon);
        i++;
    }

    for (let a of document.body.querySelectorAll("a")) {
        if (!a.href || a.dataset["pswp-src"]) continue;
        const url = new URL(a.href);
        if (url.origin === location.origin) {
            a.onclick = () => {
                goto(url.pathname);
                return false;
            }
        }
    }

    for (let page of book.querySelectorAll(".page")) {
        if (page.querySelector("a[data-pswp-src]")) {
            page.id = "gallery" + page.dataset.page;
            const lightbox = new PhotoSwipeLightbox({
                gallery: "#" + page.id,
                children: "a[data-pswp-src]",
                pswpModule: PhotoSwipe
            })
            lightbox.init();
        }
    }

    goto(location.pathname);
    
    window.addEventListener('popstate', function() {
        goto(location.pathname, true);
    });
}

function goto(url, onpop) {
    const previousPageNumber = currentPageNumber;
    const previousPage = document.querySelector(`.page[data-page="${currentPageNumber}"]`);

    let pageElement = document.querySelector(`[data-url="${url}"]`);
    if (!pageElement)
        pageElement = document.querySelector("[data-page='404']");
    currentPageNumber = parseInt(pageElement.dataset.page);

    if (currentPageNumber === previousPageNumber && previousState)
        return;

    document.title = pageElement.dataset.title;

    if (!onpop) {
        if (!previousState) {
            history.replaceState(document.title, "", location.origin + url);
        } else if (location.origin + url !== previousState) {
            history.pushState(document.title, "", location.origin + url);
        }
        previousState = location.origin + url;
    }

    pageElement.querySelector("footer input").value = pageElement.dataset.page;

    pageElement.classList.remove("enter-from-left");
    pageElement.classList.remove("enter-from-right");
    pageElement.classList.remove("exit-to-left");
    pageElement.classList.remove("exit-to-right");
    if (previousPage) {
        // previousPage.classList.remove("hidden");
        previousPage.classList.remove("enter-from-right");
        previousPage.classList.remove("enter-from-left");
        previousPage.classList.remove("exit-to-right");
        previousPage.classList.remove("exit-to-left");
    }
    if (previousPageNumber < currentPageNumber) {
        if (previousPage) previousPage.classList.add("exit-to-left");
        pageElement.classList.add("enter-from-right");
    } else {
        if (previousPage) previousPage.classList.add("exit-to-right");
        pageElement.classList.add("enter-from-left");
    }
    if (currentPageNumber === parseInt(pageElement.dataset.page))
        pageElement.classList.remove("hidden");
    if (previousPage) {
        previousPage.addEventListener("animationend", () => {
            if (currentPageNumber !== parseInt(previousPage.dataset.page))
                previousPage.classList.add("hidden");
        }, { once: true })
    }

    document.querySelector(`nav a.selected`)?.classList.remove("selected");
    document.querySelector(`nav a[data-page="${pageElement.dataset.page}"]`).classList.add("selected");

    document.querySelector("aside").classList.remove("toggled");
}

document.addEventListener("keydown", e => {
    let dir = 0;
    let i = null;
    if (e.code === "ArrowRight") {
        if (currentPageNumber < pages.length - 2) {
            i = (currentPageNumber + 1) + 1;
            dir = 1;
        }
    } else if (e.code === "ArrowLeft") {
        if (currentPageNumber > 0) {
            i = (currentPageNumber + 1) - 1;
            dir = -1;
        }
    }
    if (i !== null) {
        while (pages[i].dataset.title === "HIDDEN") {
            i += dir;
        }
        goto(pages[i].dataset.url);
    }
})

document.addEventListener("mousedown", e => {
    if (!e.target.closest("aside")) {
        document.querySelector("aside").classList.remove("toggled");
    }
})

let touchLocked = false;
let touch;
document.addEventListener("pointerdown", e => {
    if (e.pointerType !== "touch") return;
    if (e.target.closest("aside")) {
        return;
    }
    touchLocked = false;
    touch = { x: e.screenX };
})
document.addEventListener("pointermove", e => {
    if (e.pointerType !== "touch") return;

    if (!touchLocked) {
        let delta = e.screenX - touch.x;
        touch.x = e.screenX;

        let dir = 0;
        let i = null;
        if (delta < -2) {
            if (currentPageNumber < pages.length - 2) {
                i = (currentPageNumber + 1) + 1;
                dir = 1;
                touchLocked = true;
            }
        } else if (delta > 2) {
            if (currentPageNumber > 0) {
                i = (currentPageNumber + 1) - 1;
                dir = -1;
                touchLocked = true;
            }
        }
        if (i !== null) {
            while (pages[i].dataset.title === "HIDDEN") {
                i += dir;
            }
            goto(pages[i].dataset.url);
        }
    }
})

window.goto = goto;