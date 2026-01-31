## Introduction

This is a manual created just for you guys my hard working employees!!!

```note-yellow
**Important:** Please read this handbook carefully and keep it accessible for future reference. If you have any questions, please contact Human Resources and not me.
```

<!--
For anyone writing or editing this manual, here is how page sectioning works!

In Markdown, three dashes (---) create a line break. In this document, they will act as a page break instead.

The first header in a page acts as its title.

If the first header starts with a tilde (~), it won't be visible on the page.

Pages with an H1 header act as section titles, which means they're displayed differently on the sidebar, and their pages are styled differently. I recommend using them to write introductions to a section, as opposed to writing anything substantial or important.

Oh, and these comments don't get filtered out of the website's code, so don't write any of your personal information here.
-->

---

# Getting started

We're so excited to get you started on your journey to designing levels.

```toc
[Creating a new project](/getting-started/creating-a-new-project)
[Loading an existing project](/getting-started/loading-an-existing-project)
```

<!--
Note on links:
Relative links won't work! Make sure to use absolute links.
-->

---

## Creating a new project

```note-blue
### Levels
Levels are employee-designed stages for runners to run around on. In case you were wondering
```

Create your first level using the Level editor™!

---

## Loading an existing project

In the [Welcome menu](/glossary/welcome-menu), you can load any existing project file by selecting the **Open Project** button.

---

# Editor

Layout:

- Scene view
- Inspector
- Toolbar
- Object tray

---

## Scene view

---

### Camera controls

| Key                  | Action        |
|-                     |-              |
| W / Z / Up arrow     | Move forward  |
| A / Q / Left arrow   | Move left     |
| S / Down arrow       | Move backward |
| D / Right arrow      | Move right    |
| Space                | Move up       |
| Shift + Space        | Move down     |
| Middle click + Mouse | Look          |

**Camera movement speed** and **camera rotation speed** can be configured in the [Level Settings menu]().

---

### Z grid slider

---

### Object controls

---

## Inspector

---

## Toolbar

---

## Object tray

Left click action / number keys / scroll

Right click action

---

# Objects

Objects are the basic building block of any level.

```toc
[Shapes](/objects/shapes)
[Objects](/objects/objects)
[Special](/objects/special)
[Models](/objects/models)
[Tags](/objects/tags)
[Structures](/objects/structures)
[Custom](/objects/custom)
```

---

## Shapes

Shapes are basic geometric objects. Don't be fooled by their simplicity, as they have a wide variety of uses ranging from blocking out levels to building [custom structures]().

| Name | Variable parameters | Right-click setter |
|-     |-                    |-                     |
| Cube | Shape, Material, Color | Material |
| Wedge | Shape, Material, Color | Material |
| Prism | Shape, Material, Color | Material |
| Pyramid | Shape, Material, Color | Material |
| Corner Out | Shape, Material, Color | Material |
| Corner In | Shape, Material, Color | Material |

---

## Objects

The most commonly used objects are grouped simply as "Objects." Anything you'll typically find as a platform in a level can be found here.

| Name | Variable parameters | Right-click setter |
|-     |-                    |-                     |
| Wall | Shape, Material, Color | — |
| Yellow Wall | Shape, Material, Color | — |
| Tiled Floor | Shape, Material, Color | — |
| Bounce Pad | Shape, Material, Color | — |
| Speed Floor | Shape, Material, Color | — |
| Plank | Shape, Material, Color | Color |
| Metal Grate | Shape, Material, Color | — |
| Container | Shape, Material, Color | Color |
| Vent Pipe | Shape, Material, Color | — |
| Power Box | Shape, Material, Color | — |
| Cardboard Box | Shape, Material, Color | Color |

---

## Special

Special objects provide unique interactions. Some objects here, like Start Zone and End Zone, are necessary to play and complete a level.

| Name | Variable parameters | Right-click setter |
| - | - | - |
| WIP | | |
| . | | |
| . | | |
| . | | |
| . | | |
| . | | |
| . | | |

---

## Models

Models are objects with unique geometry, material, and sometimes even animations that can be used to decorate your level.

| Name | Variable parameters | Right-click setter |
| - | - | - |
| WIP | | |
| . | | |
| . | | |
| . | | |
| . | | |
| . | | |
| . | | |

---

## Tags

Tags are a unique object type that can only be placed on the surfaces of other objects.

| Name | Variable parameters | Right-click setter |
| - | - | - |
| WIP | | |
| . | | |
| . | | |
| . | | |
| . | | |
| . | | |
| . | | |

```note-yellow
Tags should not be used for any personal creative expression. Make sure to consult the internal list of legally acceptable messaging and imagery before adding anything potentially incriminating!
```

---

## Structures

```censor
I think `our lead developer` has more to do here so I'm just going to leave this page as WIP for now.

Also `OJ` if you're reading this then maybe consider combining the Custom and Structures category. I think that would make a lot of sense.

`Love,`
`Guy that is taking way too long to write this manual`
```

---

## Custom

Structures are prefabricated object groups that can be instantiated just like any other object. Custom structures can be defined on a per-project basis.

```toc
[Creating a custom structure](/objects/custom/creating-a-custom-structure)
[Variable parameters](/objects/custom/variable-parameters)
[Custom structure example](/objects/custom/custom-structure-example)
```

---

### Creating a custom structure

You can create custom structures by first selecting 1 or more objects and then clicking on the **Create Custom Structure** ![Create Custom Structure icon](/media/icons/CreateCustomStructure.svg#icon) button in the [toolbar]().

You can manage your custom structures by navigating to [Project menu]() > **Resources** > **Structures**.

---

### Variable parameters

When creating a custom structure, you can choose to add a variable parameter. This will enable a right-click action when clicking on your structure from the [object tray](), which will allow you to set the value of the designated variable for every object within the structure.

```note-blue
**Why can't I find the variable I want?**
Some objects, such as Start Zone or Secret, have limited or no parameterable variables. If you can't find the variable you're looking for, chances are the object(s) you're using doesn't support it.
```

---

~### Custom structure example

<!-- The tilde (~) above prevents this header from being visible on the page. I did this here because I want to use an H4 header, but I don't want it to be a subsection of "Variable parameters". -->

#### Custom structure example

![](/media/custom-structure-example/1.png#full-image)

---

# Publishing your level

---
    
## Uploading to Steam Workshop

---

# Glossary

---

#### Welcome menu

The first menu you see when you enter the level editor.

<!--- adding "#full-image" to the end of the image url like this makes it ignore the page's default padding. -->

![Welcome menu](/media/glossary/welcome.png#full-image)

---

#### Project menu

Toolbar > Project ![Project button icon](/media/icons/ProjectManager.svg#icon)

![Project menu](/media/glossary/project.png#full-image)

---

# WIP section

```censor
This page `is a` work `in progress oh` no!`!! Don't look!!!!`

`Blackout poetry, or erasure poetry,` is a `form of found poetry or found` object `art` created `by erasing words from an existing text in prose or verse and framing the result` on the page `as a poem.[1] The results can be allowed to stand in situ` or `they can be arranged into lines or stanzas.`

`Writers and visual artists have adopted this form both to achieve a ra`n`ge of c`o`gnitive or symbolic effects and to focus on the social or political meanings of erasure. Blackout poetry is a way to give an existing piece of writing a new set of meanings, questions, or suggestions. It lessens the trace of authorship but also draws attention to the original text`.
```