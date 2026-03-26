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

    for (let page of book.querySelectorAll(".page:has(a[data-pswp-src])")) {
        page.id = "gallery" + page.dataset.page;
        const lightbox = new PhotoSwipeLightbox({
            gallery: "#" + page.id,
            children: "a[data-pswp-src]",
            pswpModule: PhotoSwipe
        })
        lightbox.init();
    }

    pageNumberInput.addEventListener("change", () => {
        const page = book.querySelector(`.page[data-page="${pageNumberInput.value}"]`);
        if (page) {
            navigate(page.dataset.url);
        } else {
            navigate("/404");
        }
    })
    pagePrevious.onclick = () => {
        const page = book.querySelector(`.page[data-page="${parseInt(pageNumberInput.value) - 1}"]`);
        if (page) {
            navigate(page.dataset.url);
        }
    }
    pageNext.onclick = () => {
        const page = book.querySelector(`.page[data-page="${parseInt(pageNumberInput.value) + 1}"]`);
        if (page) {
            navigate(page.dataset.url);
        }
    }
    pageTotal.textContent = book.querySelectorAll(".page").length - 2;

    navigate(location.pathname);
    if (location.pathname === "/404") {
        pageNumberInput.value = 404;
    }
})

document.addEventListener("click", e => {
    const a = e.target.closest("a[href]");
    const newTab = e.ctrlKey || e.metaKey || e.button === 1;
    
    if (newTab) return;
    if (!a) return;
    if (a.origin !== location.origin) return;
    if (a.target === "_blank") return;

    e.preventDefault();
    navigate(new URL(a.href).pathname);
})

window.addEventListener("popstate", () => {
    navigate(location.pathname, true);
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

function navigate(url, pop) {
    const page = book.querySelector(`.page[data-url="${url}"]`);

    document.title = page.dataset.title;

    if (!pop) {
        history.pushState(document.title, "", location.origin + url);
    }

    book.querySelector(".page:not(.hidden)")?.classList.add("hidden");
    page.classList.remove("hidden");
    scrollToTop();

    const pageNumber = parseInt(page.dataset.page);

    if (url !== "/404") {
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

    document.querySelector("nav a.selected")?.classList.remove("selected");
    const pageButton = document.querySelector(`nav a[data-page="${page.dataset.page}"]`);
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