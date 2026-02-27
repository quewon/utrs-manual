~## Introduction

# Introduction

Congratulations on your new role as Builder™. Here at Z-corp™, we are committed to upholding our standards of competency in every position, no matter the level of experience. We hope that this Handbook™ can get you started on your journey to becoming a knowledgable and efficient designer.

This Handbook may be changed without notice. Make sure to keep the Handbook accessible for future reference in order to stay up-to-date with any changes.

```note-blue
Employees requiring a physical copy of the Handbook should consult Human Resources.
```

`Last updated XX/XX/20XX`

---

## Navigating this Handbook

If you're using the physical copy, simply turn the pages.

Otherwise, use the left-hand sidebar or click through the footer of each page. Additionally, you can use the arrow keys ![left](/media/icons/ArrowLeft.svg#icon) ![right](/media/icons/ArrowRight.svg#icon) or swipe side to side on your mobile device to turn the pages.

---

# Getting started

Step-by-step instructions to getting a project up and running.

[Table of contents]

---

## Locating the level editor

On the startup menu of your machine, you will find a program simply titled *Level Editor*. Click the program to open it. You will then be greeted by the [Welcome menu]().

---

## Creating a new project

To begin a project from scratch, simply click on the **Create New Project** button from the [Welcome menu]().

Alternatively, if you want to start from an existing project...

### Loading an existing project

You can load any local project file by selecting the **Open Project** button.

If you've recently worked on a project, you'll find it listed under **Recent Projects**.

### Opening the example project

If you'd like to check out the example project showcased in the background of the [Welcome menu](), you can open it by clicking on **Open Example Project** on the top left.

---

# Designing your level

The meat of your work.

[Table of contents]

---

## Controlling the camera

Use your keyboard and mouse to move around the scene or change your viewing angle.

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

## Placing objects

First, choose an object from the [Object Preset menu]().

```note-blue
You can access the [Object Preset menu]() by clicking on an empty slot in the [Object tray](), or by hovering over a non-empty slot and clicking on the pencil icon ![](/media/icons/pencil.svg#icon).
```

Once you've loaded your object of choice into the [Object tray](), **right-click** on the level to instantiate the object. You can place the object against other objects or on top of the [grid floor]().

Objects will snap to a 64x64x64 grid by default. You can toggle grid snapping from the [toolbar]() (icon). Snapping behavior can also be further configured in the [Level Settings]().

```note-blue
The z-position of the grid floor can be changed using the bottom left slider.
```

---

### Moving, rotating, and scaling objects

When an object is selected, you can alter it using the transform tools in the toolbar or by modifying its values in the [inspector]().

```note-blue
You can use **Tab** to quickly cycle between the different transform tools.
```

## Move

![A selected object with the move tool active.]()

The move tool (icon) enables axis and face handles that allow you to precisely position the selected object. Simply click and drag a handle to move the object along that axis or face. This will modify the object's **position** variable.

## Rotate

![A selected object with the rotate tool active.]()

The rotate tool (icon) enables a circular rotation handle. Simply click and drag the handle to turn the selected object. This will modify the object's **angle** variable.

## Scale

![A selected object with the scale tool active.]()

The scale tool (icon) enables axis and face handles that allow you to resize the selected object. Simply click and drag a handle to scale the object along that axis or face. This will modify the object's **size** variable.

---

### Selecting objects

If you are familiar with similar digital editing programs, you will have noticed that you can **select** an object by left-clicking on it.

You can select multiple objects at once by dragging out a selection field or shift-clicking. Any transformations (moving, rotating, scaling) done to this selection will be applied to all objects.

![Clicking and dragging a selection field.]()
![Shift-clicking multiple objects.]()

---

### Deleting objects

Press **Delete** or **Backspace**, or select the **Delete Instance** action from the [inspector]() to delete selected objects.

```note-yellow
**Deleted the wrong thing?**
You can undo your changes by pressing Ctrl+Z (or Command+Z on Mac).
```

---

## Playing your project

```note-blue
Projects can contain a series of levels. If a project has more than one level, runners will be made to complete it in sequence.
```

It is vital to test a project before shipping it. Playing a level will provide you with the data and insights necessary to ensuring that the map has been designed to the correct specifications.

Simply select the **Play** button from the [toolbar]() to test your level. You can return to the level editor at any point from the pause menu.

If your level contains issues, you will not be able to play it. Turn to the next page for more detail on [handling issues]().

---

### Handling issues

The [Issues window]() contains information on any mistakes or potential game-breaking bugs your level may contain.

---

# Publishing your project

[Table of contents]

---

## Uploading to the Steam Workshop

Navigate to the [Steam Workshop window]() by clicking on the **Steam Workshop button** (icon) from the [toolbar]().

If the project is not linked to a Steam Workshop item, you will be prompted to create one.

When you have an item, 

Once the item has been created, you will be able to upload the item

---

# Going deeper

[Table of contents]

---

## Adding more levels

---

## Analyzing your test playthrough

Ghost paths

---

## Creating a custom structure

You can create custom structures by first selecting 1 or more objects and then clicking on the **Create Custom Structure** ![Create Custom Structure icon](/media/icons/CreateCustomStructure.svg#icon) button in the [toolbar]().

You can manage your custom structures by navigating to [Project menu]() > **Resources** > **Structures**.

[Table of contents]

---

### Variable parameters

When creating a custom structure, you can choose to add a variable parameter. This will enable a right-click action when clicking on your structure from the [object tray](), which will allow you to set the value of the designated variable for every object within the structure.

```note-blue
**Why can't I find the variable I want?**
Some objects, such as Start Zone or Secret, have limited or no parameterable variables. If you can't find the variable you're looking for, chances are the object(s) you're using doesn't support it.
```

---

~### Custom structure example

### Custom structure example

![](/media/custom-structure-example/1.png#full-image)

---

## Changing the level environment

Skybox, sky color, fog color, fog density can be configured in Level settings

---

## Changing the level music

Level playlist can be set in the Level settings

---

# Glossary

[Table of contents]

---

## Editor Interface

[Table of contents]

---

### Keyboard shortcuts

---

### Scene view

---

### Toolbar

---

#### Project Manager

---

#### Steam Workshop

---

#### Ghost Paths Manager

---

#### Issues

---

#### Settings

---

### Inspector

---

## Objects

Objects are the basic building block of any level.

[Table of contents]

---

### Shapes

Shapes are basic geometric objects. Don't be fooled by their simplicity, as they have a wide variety of uses ranging from blocking out levels to building [custom structures]().

| Name       | Variable parameters    | Right-click setter |
|-           |-                       |-                   |
| Cube       | Shape, Material, Color | Material           |
| Wedge      | Shape, Material, Color | Material           |
| Prism      | Shape, Material, Color | Material           |
| Pyramid    | Shape, Material, Color | Material           |
| Corner Out | Shape, Material, Color | Material           |
| Corner In  | Shape, Material, Color | Material           |

---

### Objects

The most commonly used objects are grouped simply as "Objects." Anything you'll typically find as a platform in a level can be found here.

| Name          | Variable parameters    | Right-click setter |
|-              |-                       |-                   |
| Wall          | Shape, Material, Color | —                  |
| Yellow Wall   | Shape, Material, Color | —                  |
| Tiled Floor   | Shape, Material, Color | —                  |
| Bounce Pad    | Shape, Material, Color | —                  |
| Speed Floor   | Shape, Material, Color | —                  |
| Plank         | Shape, Material, Color | Color              |
| Metal Grate   | Shape, Material, Color | —                  |
| Container     | Shape, Material, Color | Color              |
| Vent Pipe     | Shape, Material, Color | —                  |
| Power Box     | Shape, Material, Color | —                  |
| Cardboard Box | Shape, Material, Color | Color              |

---

### Special

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

### Models

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

### Tags

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

### Structures

Structures are prefabricated object groups that can be instantiated just like any other object.

---

### Custom

Custom structures can be defined on a per-project basis.

[Table of contents]