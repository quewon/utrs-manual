// config

const PAGE_ENTER_DELAY = 150;

//

var PAGES;
var previousState;
var currentPageIndex = -1;
const bookPage = document.querySelector(".book-page");

fetch("/content.json").then(res => res.json()).then(json => {
    PAGES = json.pages;

    let pagenumber = 0;
    for (let page of PAGES) {
        const div = document.createElement("div");
        div.className = "hidden page";
        div.dataset.page = pagenumber++;
        div.dataset.url = page.url;
        div.innerHTML = page.content;
        if (pagenumber > 2) {
            div.innerHTML += `<footer>Page ${pagenumber - 2} of ${PAGES.length - 2}</footer>`;
        }
        bookPage.appendChild(div);
    }

    goto(location.pathname);
    
    window.addEventListener('popstate', function() {
        goto(location.pathname, true);
    });
})

function goto(url, onpop) {
    let previousPageIndex = currentPageIndex;
    let previousPage = document.querySelector(`.page[data-page="${currentPageIndex}"]`);

    let pageElement = document.querySelector(`[data-url="${url}"]`);
    if (!pageElement)
        pageElement = document.querySelector("[data-page='0']");
    currentPageIndex = parseInt(pageElement.dataset.page);

    if (currentPageIndex === previousPageIndex && previousState)
        return;

    let data = PAGES[currentPageIndex];

    document.title = data.title;

    if (!onpop) {
        if (!previousState) {
            history.replaceState(data, "", location.origin + data.url);
        } else if (location.origin + data.url !== previousState) {
            history.pushState(data, "", location.origin + data.url);
        }
        previousState = location.origin + data.url;
    }

    pageElement.classList.remove("enter-from-top");
    pageElement.classList.remove("enter-from-bottom");
    pageElement.classList.remove("exit-to-top");
    pageElement.classList.remove("exit-to-bottom");
    if (previousPage) {
        previousPage.classList.add("hidden");
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
    setTimeout(() => {
        if (currentPageIndex === parseInt(pageElement.dataset.page))
            pageElement.classList.remove("hidden");
    }, PAGE_ENTER_DELAY);

    document.querySelector(`nav a.selected`)?.classList.remove("selected");
    document.querySelectorAll("nav a")[currentPageIndex].classList.add("selected");

    document.querySelector("aside").classList.remove("toggled");
}

document.addEventListener("keydown", e => {
    if ((e.code === "ArrowRight" || e.code === "ArrowDown") && currentPageIndex < PAGES.length - 1) {
        goto(PAGES[currentPageIndex + 1].url);
    } else if ((e.code === "ArrowLeft" || e.code === "ArrowUp") && currentPageIndex > 1) {
        goto(PAGES[currentPageIndex - 1].url);
    }
})

let scrollAmount = 0;
let wheelTimeout;
let direction = 0;
document.addEventListener("wheel", e => {
    if (e.target.closest("nav"))
        return;

    scrollAmount += e.deltaY;

    if (currentPageIndex <= 1)
        scrollAmount = Math.max(0, scrollAmount);
    if (currentPageIndex >= PAGES.length - 1)
        scrollAmount = Math.min(0, scrollAmount);

    if (scrollAmount > 50 && direction <= 0) {
        if (currentPageIndex < PAGES.length - 1) {
            goto(PAGES[currentPageIndex + 1].url);
            direction = 1;
        }
    } else if (scrollAmount < -50 && direction >= 0) {
        if (currentPageIndex > 1) {
            goto(PAGES[currentPageIndex - 1].url);
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
document.addEventListener("touchstart", e => {
    if (e.touches[0]) {
        if (e.touches[0].target.closest("aside")) {
            return;
        }
        touchLocked = false;
        touch = { x: e.touches[0].screenX, y: e.touches[0].screenY };
    }
})
document.addEventListener("touchmove", e => {
    if (!e.touches[0])
        return;

    if (!touchLocked) {
        let deltaY = e.touches[0].screenY - touch.y;
        let deltaX = e.touches[0].screenX - touch.x;

        touch.y = e.touches[0].pageY;
        touch.x = e.touches[0].pageX;

        let delta = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX;
        if (delta < -2) {
            if (currentPageIndex < PAGES.length - 1) {
                goto(PAGES[currentPageIndex + 1].url);
                touchLocked = true;
            }
        } else if (delta > 2) {
            if (currentPageIndex > 1) {
                goto(PAGES[currentPageIndex - 1].url);
                touchLocked = true;
            }
        }
    }
})