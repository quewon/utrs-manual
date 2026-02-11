This is an internal markup guide for the UTRS Level Editor Handbook. (It's a guide for writing a guide...) This guide assumes that you're familiar with Markdown formatting rules.

# Page sectioning

In Markdown, three dashes (---) create a line break. For the handbook, they act as a page break instead.

The first header in a page acts as its title.

Pages with an H1 header act as section titles, which means they're displayed differently on the sidebar, and their pages are styled differently. I recommend using them to write introductions to a section, as opposed to writing anything substantial or important.

If the first header starts with a tilde (~), it won't be visible on the page.

# Components

```
This is a normal Markdown code block. Content within this block ignores all Markdown formatting rules.
```

```note-yellow
Content in here shows up in a yellow sticky note with small text. You can use Markdown formatting here.
```

```note-blue
Content in here shows up in a blue sticky note with small text. You can use Markdown formatting here.
```

```toc
[Section one](/link/to/first-section)
[Section two](/link/to/second-section)
```

The block above is for listing a table of contents. You should only include links, divided up by line breaks. Make sure to ONLY USE ABSOLUTE PATHS as relative paths will break on some pages! This goes for any link you add.