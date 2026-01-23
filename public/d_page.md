---
layout: page_wrapper.html
pagination:
    data: pages.pages
    size: 1
    alias: d_page
permalink: "{{ d_page.url }}.html"
eleventyComputed:
    title: "{{ d_page.title }}"
---

{{ d_page.content }}