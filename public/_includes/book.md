---
layout: base.html
---

{%- for bookpage in pages.pages -%}
<div class="hidden page{% if bookpage.headingValue == 1 %} section-title{% endif %}{% if bookpage.hidden %} vis-hidden{% endif %}{% if bookpage.unlisted %} vis-unlisted{% endif %}{% if bookpage.continued %} vis-contd{% endif %}{% if bookpage.glossary %} glossary{% endif %}" data-url="{{ bookpage.url }}" data-page="{{ bookpage.number }}" data-title="{{ bookpage.title }}" data-hv="{{ bookpage.parents.length }}">
    <div class="page-content">
        {%- if bookpage.parents.length > 1 -%}
            <div class="breadcrumbs">
                {%- assign parent = bookpage.parents[1] -%}
                {{ bookpage.sectionNumber }} / <a href="{{ parent.url }}">{{ parent.title }}</a> 
            </div>
        {%- elsif bookpage.parents.length == 1 -%}
            <div class="breadcrumbs">
                {%- if bookpage.headingValue == 1 -%}
                    {{ bookpage.sectionNumber }} / <a class="self" href="{{ bookpage.url }}">{{ bookpage.title }}</a>
                {%- else %}
                    Z–CORP® / <a class="self" href="{{ bookpage.url }}">{{ bookpage.title }}</a>
                {%- endif -%}
            </div>
        {%- endif -%}
        {{ bookpage.content | renderContent: "md" }}
    </div>
</div>
{%- endfor -%}