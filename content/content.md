# Introduction

Congratulations on your new role as Enterprise Level Designer for Z-corp™. Here at Z-corp™, we are committed to upholding our standards of competency in every position, no matter the level of experience. We hope that this Handbook™ can get you started on your journey to becoming a knowledgable and efficient designer.

This Handbook™ may be changed without notice. In order to stay up-to-date with the changes, make sure to keep the Handbook™ accessible for future reference.

```toc
[Navigating this handbook](/introduction/navigating-this-handbook)
[What's in a level?](/introduction/whats-in-a-level)

##### Last updated XX/XX/XXXX

---

~## Navigating this handbook

#### Navigating this handbook

```center
You can navigate to each section and page of this Handbook™ from the left-hand sidebar. Additionally, you can use the arrow keys (←, →, ↑, ↓), scroll wheel, or swipe on mobile to turn the pages.
```

---

# Getting started

If this is your first time using the Level Editor™, here is a step-by-step guide to creating your first project.

```toc
[Opening the level editor]()
[Creating a new project]()
[Next steps]()
```

---

## Opening the level editor

From the title screen of Under The Red Sky (the very first screen you see when you load up the game), find and click on the **Level Editor** button.

This will take you to the **Welcome menu**.

![The welcome menu.](/media/welcome-menu.png)

---

## Creating a new project

```note-blue
A **project** contains a series of levels. If a project has more than one level, runners will be made to complete it in sequence.
```

#  Creating a project from scratch

To begin a project from scratch, simply click on the **Create New Project** button from the [Welcome menu]().

## Loading an existing project

If you have an existing project that you'd like to work on, you can load any local project file by selecting the **Open Project** button instead.

If you've recently worked on a projected, you'll find it listed under **Recent Projects**.

## Opening an example project

If you'd like to check out the example project showcased in the background of the [Welcome menu](), you can open it by clicking on **Open Example Project** on the top left.

---

## Next steps

Now that you've got your project set up, you can begin building out your very first level. Try adding an [object](/objects) from the [Object tray](/editor/scene-view/object-placement), then give it a spin by [playing the level]().

If you want to add another level to your project, ...

Once you're done with your project, [publish it to the Workshop]() it so that our runners can test your levels.

Good luck.

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

### Camera navigation

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

### Object selection

Pick (click)

Multiselect (click drag / shift click)

---

### Object placement

Snapping can be configured in the Level Settings

---

#### Grid snapping

Z grid slider bottom left

Toggle Grid Snapping button in toolbar

Grid color, size, and toggle in level settings

---

### Object transformation

---

### Undo

Undo by Ctrl+Z, Cmd+Z, or clicking on undo button in toolbar

What can and can't you undo?

---

### Changing the scene view background color

"Background color" setting in Level settings

---

## Inspector

---

## Toolbar

---

### Project Manager

---

### Steam Workshop

--- 

### Ghost Paths Manager

---

### Issues

errors and warnings

---

### Settings

---

### Playing your level(s)

To return to the level editor from the level, just hit pause and click on Level Editor

---

#### Changing the level environment

Skybox, sky color, fog color, fog density can be configured in Level settings

---

#### Changing the level music

Level playlist can be set in the Level settings

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
Tags should not be used for any personal creative expression. You are obligated to consult the internal list of legally acceptable messaging and imagery before adding anything potentially incriminating.
```

---

## Structures

Structures are prefabricated object groups that can be instantiated just like any other object.

---

## Custom

Custom structures can be defined on a per-project basis.

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

# Publishing your project

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

#### Object tray

The tray on the bottom of the editor screen
