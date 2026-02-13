import PhotoSwipeLightbox from "/res/photoswipe/photoswipe-lightbox.esm.min.js";
import PhotoSwipe from "/res/photoswipe/photoswipe.esm.min.js";

//

var pages;
var previousState;
var currentPageIndex = -1;
const book = document.querySelector(".book");
const rem = parseFloat(getComputedStyle(book).fontSize);

fetch("/content.json").then(res => res.json()).then(json => {
    pages = document.querySelectorAll(".page");

    for (let page of pages) {
        const toc = page.querySelector(".toc");
        if (toc) {
            const hv = parseInt(page.dataset.hv);
            for (let i=parseInt(page.dataset.page) + 1; i<pages.length; i++) {
                const phv = parseInt(pages[i].dataset.hv);
                if (phv <= hv) {
                    break;
                }
                const li = document.createElement("li");
                li.dataset.page = pages[i].dataset.page;
                const a = document.createElement("a");
                a.href = location.origin + pages[i].dataset.url;
                a.onclick = () => {
                    goto(pages[i].dataset.url);
                    return false;
                }
                a.textContent = pages[i].dataset.title;
                li.style.paddingLeft = (phv - hv - 1) * 1.5 * rem + "px";
                li.appendChild(a);
                toc.appendChild(li);
            }
        }
    }

    for (let a of book.querySelectorAll("a")) {
        if (!a.href || a.dataset["pswp-src"]) continue;
        const url = new URL(a.href);
        if (url.origin === location.origin) {
            a.onclick = () => {
                goto(url.pathname);
                return false;
            }
            for (let i=0; i<pages.length; i++) {
                if (pages[i].dataset.url === url.pathname) {
                    a.dataset.pagenumber = i;
                    break;
                }
            }
        }
    }

    for (let page of book.querySelectorAll(".page")) {
        if (page.querySelector("[data-pswp-src]")) {
            page.id = "gallery" + page.dataset.page;
            const lightbox = new PhotoSwipeLightbox({
                gallery: "#" + page.id,
                children: "a",
                pswpModule: PhotoSwipe
            })
            lightbox.init();
        }
    }

    goto(location.pathname);
    
    window.addEventListener('popstate', function() {
        goto(location.pathname, true);
    });
})

function goto(url, onpop) {
    const previousPageIndex = currentPageIndex;
    const previousPage = document.querySelector(`.page[data-page="${currentPageIndex}"]`);

    let pageElement = document.querySelector(`[data-url="${url}"]`);
    if (!pageElement)
        pageElement = document.querySelector("[data-page='0']");
    currentPageIndex = parseInt(pageElement.dataset.page);

    if (currentPageIndex === previousPageIndex && previousState)
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

    pageElement.classList.remove("enter-from-top");
    pageElement.classList.remove("enter-from-bottom");
    pageElement.classList.remove("exit-to-top");
    pageElement.classList.remove("exit-to-bottom");
    if (previousPage) {
        previousPage.classList.remove("hidden");
        previousPage.classList.remove("enter-from-bottom");
        previousPage.classList.remove("enter-from-top");
        previousPage.classList.remove("exit-to-bottom");
        previousPage.classList.remove("exit-to-top");
    }
    if (previousPageIndex < currentPageIndex) {
        if (previousPage) previousPage.classList.add("exit-to-top");
        pageElement.classList.add("enter-from-bottom");
    } else {
        if (previousPage) previousPage.classList.add("exit-to-bottom");
        pageElement.classList.add("enter-from-top");
    }
    if (currentPageIndex === parseInt(pageElement.dataset.page))
        pageElement.classList.remove("hidden");
    if (previousPage) {
        previousPage.addEventListener("animationend", () => {
            if (currentPageIndex !== parseInt(previousPage.dataset.page))
                previousPage.classList.add("hidden");
        }, { once: true })
    }

    document.querySelector(`nav a.selected`)?.classList.remove("selected");
    document.querySelectorAll("nav a")[currentPageIndex].classList.add("selected");

    document.querySelector("aside").classList.remove("toggled");
}

document.addEventListener("keydown", e => {
    if ((e.code === "ArrowRight" || e.code === "ArrowDown") && currentPageIndex < pages.length - 1) {
        goto(pages[currentPageIndex + 1].dataset.url);
    } else if ((e.code === "ArrowLeft" || e.code === "ArrowUp") && currentPageIndex > 1) {
        goto(pages[currentPageIndex - 1].dataset.url);
    }
})

let scrollAmount = 0;
let wheelTimeout;
let direction = 0;
document.addEventListener("wheel", e => {
    if (e.target.closest("nav"))
        return;

    scrollAmount += e.deltaY;

    if (currentPageIndex <= 0)
        scrollAmount = Math.max(0, scrollAmount);
    if (currentPageIndex >= pages.length - 1)
        scrollAmount = Math.min(0, scrollAmount);

    if (scrollAmount > 50 && direction <= 0) {
        if (currentPageIndex < pages.length - 1) {
            goto(pages[currentPageIndex + 1].dataset.url);
            direction = 1;
        }
    } else if (scrollAmount < -50 && direction >= 0) {
        if (currentPageIndex > 1) {
            goto(pages[currentPageIndex - 1].dataset.url);
            direction = -1;
        }
    }

    if (wheelTimeout) clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
        scrollAmount = 0;
        direction = 0;
    }, 50);
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
    touch = { x: e.screenX, y: e.screenY };
})
document.addEventListener("pointermove", e => {
    if (e.pointerType !== "touch") return;

    if (!touchLocked) {
        let deltaY = e.screenY - touch.y;
        let deltaX = e.screenX - touch.x;

        touch.y = e.screenY;
        touch.x = e.screenX;

        let delta = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX;
        if (delta < -2) {
            if (currentPageIndex < pages.length - 1) {
                goto(pages[currentPageIndex + 1].dataset.url);
                touchLocked = true;
            }
        } else if (delta > 2) {
            if (currentPageIndex > 1) {
                goto(pages[currentPageIndex - 1].dataset.url);
                touchLocked = true;
            }
        }
    }
})

window.goto = goto;