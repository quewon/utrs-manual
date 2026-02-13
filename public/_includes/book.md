---
layout: base.html
---

{%- for bookpage in pages.pages -%}
<div class="hidden page{% if bookpage.headingValue == 1 %} section-title{% endif %}" data-url="/{{ bookpage.url }}" data-page="{% increment counter %}" data-title="{{ bookpage.title }}" data-hv="{{ bookpage.headingValue }}">
    {{ bookpage.content | renderContent: "md" }}
    {%- if counter > 2 -%}
        <footer>{{ counter }}</footer>
    {%- endif -%}
</div>
{%- endfor -%}