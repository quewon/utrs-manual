function goto(url) {
    if (document.querySelector(".page:not(.hidden)")) {
        document.querySelector(".page:not(.hidden)").classList.add("hidden");
    }
    let page = document.querySelector(`[data-url="${url}"]`);
    if (!page)
        page = document.querySelector("[data-url='/404']");
    document.title = page.dataset.title;
    window.history.pushState(page.dataset.title, page.dataset.title, location.origin + page.dataset.url);
    page.classList.remove("hidden");
}

fetch("/res/content.json").then(res => res.json()).then(json => {
    const bookPage = document.querySelector(".book-page");

    let pagenumber = 0;
    for (let page of json.pages) {
        const div = document.createElement("div");
        div.className = "hidden page";
        div.dataset.page = ++pagenumber;
        div.dataset.url = page.url;
        div.dataset.title = page.title;
        div.innerHTML = page.content;
        bookPage.appendChild(div);
    }

    goto(location.pathname);
})