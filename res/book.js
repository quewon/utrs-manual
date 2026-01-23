var PAGES;

fetch("/res/content.json").then(res => res.json()).then(json => {
    PAGES = json.pages;

    const bookPage = document.querySelector(".book-page");

    let pagenumber = 0;
    for (let page of json.pages) {
        const div = document.createElement("div");
        div.className = "hidden page";
        div.dataset.page = pagenumber++;
        div.dataset.url = page.url;
        div.innerHTML = page.content;
        bookPage.appendChild(div);
    }

    document.querySelector(".pagination [name='pagecount']").textContent = PAGES.length - 1;

    goto(location.pathname);
})

function goto(url) {
    if (document.querySelector(".page:not(.hidden)")) {
        document.querySelector(".page:not(.hidden)").classList.add("hidden");
    }
    let pageElement = document.querySelector(`[data-url="${url}"]`);
    if (!pageElement)
        pageElement = document.querySelector("[data-page='0']");
    let pageIndex = parseInt(pageElement.dataset.page);
    let data = PAGES[pageIndex];

    document.title = data.title;
    window.history.pushState(data.title, data.title, location.origin + data.url);
    pageElement.classList.remove("hidden");

    const pbuttons = document.querySelectorAll(".pagination button");
    pbuttons[0].disabled = true;
    pbuttons[1].disabled = true;
    pbuttons[2].disabled = true;
    pbuttons[3].disabled = true;
    if (pageIndex > 1) {
        pbuttons[0].disabled = false;
        pbuttons[1].disabled = false;
        pbuttons[0].onclick = () => {
            goto("/");
        }
        pbuttons[1].onclick = () => {
            goto(PAGES[pageIndex - 1].url);
        }
    }
    if (pageIndex < PAGES.length - 1) {
        pbuttons[2].disabled = false;
        pbuttons[3].disabled = false;
        pbuttons[3].onclick = () => {
            goto(PAGES[PAGES.length - 1].url)
        }
        pbuttons[2].onclick = () => {
            goto(PAGES[pageIndex + 1].url);
        }
    }
    document.querySelector(".pagination input").value = pageIndex;
}