---
layout: base.html
---

{%- for bookpage in pages.pages -%}
<div class="hidden page{% if bookpage.headingValue == 1 %} section-title{% endif %}{% if bookpage.headingValue == 0 %} title{% endif %}{% if bookpage.hidden %} vis-hidden{% endif %}{% if bookpage.hidden %} vis-unlisted{% endif %}{% if bookpage.glossary %} glossary{% endif %}" data-url="{{ bookpage.url }}" data-page="{{ bookpage.number }}" data-title="{{ bookpage.title }}" data-hv="{{ bookpage.parents.length }}">
    {%- if bookpage.parents.length > 1 -%}
        <nav>
            {%- assign limit = bookpage.parents.length | minus: 1 -%}
            {%- assign range = (1..limit) -%}
            {% for i in range %}
                {%- assign parent = bookpage.parents[i] -%}
            <a href="{{ parent.url }}">{{ parent.title }}</a> {% if i < limit %}·{% endif %}
            {% endfor %}
        </nav>
    {%- endif -%}
    {{ bookpage.content | renderContent: "md" }}
</div>
{%- endfor -%}