---
layout: base.html
---

{%- for bookpage in pages.pages -%}
<div class="hidden page{% if bookpage.headingValue == 1 %} section-title{% endif %}{% if bookpage.headingValue == 0 %} title{% endif %}{% if bookpage.title == "HIDDEN" %} removed{% endif %}" data-url="{{ bookpage.url }}" data-page="{{ bookpage.number }}" data-title="{{ bookpage.title }}" data-hv="{{ bookpage.parents.length }}">
    {%- if bookpage.parents.length > 1 -%}
        <header>
            {%- assign limit = bookpage.parents.length | minus: 1 -%}
            {%- assign range = (1..limit) -%}
            {% for i in range %}
                {%- assign parent = bookpage.parents[i] -%}
            <a href="{{ parent.url }}">{{ parent.title }}</a> {% if i < limit %}·{% endif %}
            {% endfor %}
        </header>
    {%- endif -%}
    {{ bookpage.content | renderContent: "md" }}
    <footer>
        {%- if bookpage.previous -%}
            <a class="pagination" href="{{ bookpage.previous.url }}"><img src="/media/icons/ChevronBlue/ChevronLeft.svg#icon" /></a>
        {%- else -%}
            <span class="pagination"></span>
        {%- endif -%}
        <input type="number" value="{{ bookpage.number }}" min="1" max="404">
        {%- if bookpage.next -%}
            <a class="pagination" href="{{ bookpage.next.url }}"><img src="/media/icons/ChevronBlue/ChevronRight.svg#icon" /></a>
        {%- else -%}
            <span class="pagination"></span>
        {%- endif -%}
    </footer>
</div>
{%- endfor -%}