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

    pageNumberInput.addEventListener("change", () => {
        const page = book.querySelector(`.page[data-page="${pageNumberInput.value}"]`);
        if (page) {
            navigate(page.dataset.url);
        } else {
            navigate("/404");
        }
    })
    pagePrevious.addEventListener("click", () => {
        const page = book.querySelector(`.page[data-page="${parseInt(pageNumberInput.value) - 1}"]`);
        navigate(page.dataset.url);
    })
    pageNext.addEventListener("click", () => {
        const page = book.querySelector(`.page[data-page="${parseInt(pageNumberInput.value) + 1}"]`);
        navigate(page.dataset.url);
    })
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

function navigate(url, pop) {
    const page = book.querySelector(`.page[data-url="${url}"]`);

    document.title = page.dataset.title;

    if (!pop) {
        history.pushState(document.title, "", location.origin + url);
    }

    book.querySelector(".page:not(.hidden)")?.classList.add("hidden");
    page.classList.remove("hidden");

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