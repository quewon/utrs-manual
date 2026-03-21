import PhotoSwipeLightbox from "/res/photoswipe/photoswipe-lightbox.esm.min.js";
import PhotoSwipe from "/res/photoswipe/photoswipe.esm.min.js";

window.addEventListener("load", () => {
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

    navigate(location.pathname);
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

function navigate(url, pop) {
    const page = book.querySelector(`.page[data-url="${url}"]`);

    document.title = page.dataset.title;

    if (!pop) {
        history.pushState(document.title, "", location.origin + url);
    }

    book.querySelector(".page:not(.hidden)")?.classList.add("hidden");
    page.classList.remove("hidden");

    document.querySelector("nav a.selected")?.classList.remove("selected");
    const pageButton = document.querySelector(`nav a[data-page="${page.dataset.page}"]`);
    const pageCount = book.querySelectorAll(".page:not(.glossary)").length - 1;
    const progress = Math.min((parseInt(page.dataset.page) + 1) / pageCount * 100, 100);
    progressFill.style.width = progress + "%";
    progressPercentage.textContent = Math.floor(progress) + "%";
    if (pageButton) {
        pageButton.classList.add("selected");
    }
    updatePageMarker();
}

function updatePageMarker() {
    var pageButton = document.querySelector("nav a.selected");
    if (pageButton) {
        if (!pageButton.offsetTop) {
            while (!pageButton.offsetTop) {
                pageButton = pageButton.closest("ol").parentElement.querySelector("a");
            }
            navPageMarker.style.opacity = "0";
            navPageMarker.style.top = pageButton.offsetTop + "px";
        } else {
            navPageMarker.style.opacity = "1";
            navPageMarker.style.height = pageButton.offsetHeight + "px";
            navPageMarker.style.top = pageButton.offsetTop + "px";
        }
        navPageMarker.classList.remove("hidden");
    } else {
        navPageMarker.classList.add("hidden");
    }
}