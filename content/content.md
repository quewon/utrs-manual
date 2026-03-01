~## Introduction

# Introduction

Congratulations on your new role as Builder™. Here at Z-corp™, we are committed to upholding our standards of competency in every position, no matter the level of experience. This Handbook™ will get you started on your journey to becoming a knowledgeable and efficient designer, and will serve as an absolute reference for any question you may have regarding the Level Editor™.

This Handbook may be changed without notice. Make sure to keep the Handbook accessible for future reference in order to stay up-to-date with any changes.
Failure to comply with every rule stated in the Handbook will result in immediate termination of contract.

```note-blue
Employees requiring a physical copy of the Handbook should consult Human Resources.
```

`Last updated XX/XX/20XX`

---

## Navigating this Handbook

If you're using the physical copy, simply turn the pages using either hand and/or fingers.

Otherwise, use the left-hand sidebar or click through the footer of each page. Additionally, you can use the arrow keys ![left](/media/icons/ArrowLeft.svg#icon) ![right](/media/icons/ArrowRight.svg#icon) or swipe side to side on your mobile device to turn the pages.

---

# Getting started

Step-by-step instructions to get a project initialized and set up.

[Table of contents]

---

## Locating the level editor

On the startup menu of your machine, you will find a program simply titled **Level Editor**. Click the program to open it. You will then be greeted by the [Welcome menu]().

```note-yellow
Although there is no clear visible trademark (™) on this occurrence of the Level Editor™, Z-corp emphases that the Level Editor™ is indeed trademarked and any breach of said trademark will result in legal pursuit.
```

---

## Creating a new project

To create a new project, simply click on the **Create New Project** button from the [Welcome menu]().

Alternatively, if you want to start from an existing project...

### Loading an existing project

You can load any local project file by selecting the **Open Project** button.

If you've recently worked on a project, you'll find it listed under **Recent Projects**.

### Opening the example project

If you'd like to check out the example project showcased in the background of the [Welcome menu](), you can open it by clicking on **Open Example Project** on the top left. This action is recommended if this is your first time creating a Trial™.

---

# Designing your Trials™

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

To place an object, first choose a preset from the [Object Preset menu]().

```note-blue
You can access the [Object Preset menu]() by clicking on an empty slot in the [Object tray](), or by hovering over a non-empty slot and clicking on the pencil icon (icon).
```

Once you've loaded your preset of choice into the [Object tray](), **right-click** in the [scene view](/glossary) to instantiate the object. Objects can be placed against other objects or on top of the [grid floor]().

By default, objects will snap to a 64x64x64 grid. You can toggle grid snapping from the [toolbar]() (icon). Snapping behavior can also be further configured in the [Level Settings]().

```note-blue
Use the bottom left slider to change the z-position of the grid floor.
```

---

### Moving, rotating, and scaling objects

When an object is selected, you can alter it using the transform tools in the toolbar or by modifying its values in the [inspector]().

```note-blue
You can press **Tab** to quickly cycle between the different transform tools.
```

#### Move

![A selected object with the move tool active.]()

The move tool (icon) enables axis and face handles that allow you to precisely position the selected object. Simply click and drag a handle to move the object along that axis or face. This will modify the object's **position** variable.

#### Rotate

![A selected object with the rotate tool active.]()

The rotate tool (icon) enables a circular rotation handle. Simply click and drag the handle to turn the selected object. This will modify the object's **angle** variable.

#### Scale

![A selected object with the scale tool active.]()

The scale tool (icon) enables axis and face handles that allow you to resize the selected object. Simply click and drag a handle to scale the object along that axis or face. This will modify the object's **size** variable.

---

### Selecting objects

If you are familiar with similar digital editing programs, you will have noticed that you can **select** an object by left-clicking it.

You can select multiple objects at once by dragging out a selection field or holding shift and clicking. Any transformations (moving, rotating, scaling) done to this selection will be applied to all objects.

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

As a Builder, it is vital to test a project before shipping it. Playing a level will provide you with the data and insights necessary to ensure that the map has been designed to the correct specifications.

Simply select the **Play** button (icon) from the [toolbar]() to test your level. You can return to the level editor at any point from the pause menu.

If your level contains issues, you will not be able to play it. Turn to the next page for more detail on [handling issues]().

---

### Handling issues

The [Issues window]() contains information on any mistakes or potential game-breaking bugs your level may contain.

For example, if your level is missing a Start Zone or End Zone, a Runner will not be able to begin or complete the level. This will be flagged as an error that will prevent you from playing or submitting a level.

![An example of an error and warning in the Issues window.]()

```note-blue
If an issue is related to a specific object type or instance, you will be able to find a reference to it linked under the issue.
```

---

# Publishing your project

[Table of contents]

---

## Finalization checklist

Before you publish your project, consider the following:

- Have you set the correct [difficulty]() for your project?
- Have you set reasonable [star times]()?

---

## Uploading to the Steam Workshop

Navigate to the [Steam Workshop window]() by clicking on the **Steam Workshop** (icon) button from the [toolbar]().

If the project is not linked to a Steam Workshop item, you will be prompted to create one.

![Item creation prompt.]()

Once the item has been created, you will be able to fill out the project's metadata, including its title, preview thumbnail, difficulty level, description, and visibility.

![Steam Workshop metadata menu.]()

Once you've finished filling out the correct information, click the blue **Upload** (icon) button to publish your project. Once published, Runners around the world will immediately be able to play your project via the Workshop.

---

# Going deeper

The more complex capabilities of our level editor.

[Table of contents]

---

## Adding more levels

A single project can contain multiple levels. Runners will move through these levels in sequence.

You can add, manage, and open levels from the [Project window]().

![The Levels section of the Project window.]()

---

## Analyzing your test playthrough

When you've [played through a level](), you will be provided with a visualization of the path you took within the editor. This visual is called a "ghost path." Ghost paths can be played in order to analyze real-time movement. All relevant settings can be found in the [toolbar]() next to the **Toggle Ghost Visibility** (icon) button.

![Real-time movement playback via ghost paths.]()

---

## Assigning level times

In every level, stars can be awarded for efficient traversal. In the [Level Settings window](), you can set the minimum required completion time to earn up to 4 stars. If you assign a time of 0 seconds to a star, that star will not be available.

Make sure to set star times that are achievable and rewarding.

---

## Creating a custom structure

[Structures]() are preset object groups. They can be useful for defining and instantiating custom objects per project.

You can create custom structures by first selecting 1 or more objects and then clicking on the **Create Custom Structure** ![Create Custom Structure icon](/media/icons/CreateCustomStructure.svg#icon) button in the [toolbar]().

You can manage your custom structures by navigating to [Project menu]() > **Resources** > **Structures**.

[Table of contents]

---

### Variable parameters

Several object presets have what we call a *variable parameter*, a value that can be set before object instantiation by right-clicking the preset in the [object tray](). This will allow you to set the parameter of an object before you place it in the scene.

![Variable parameter tooltip.]()

When creating a custom structure, you can choose to add a variable parameter. Value changes on variable parameters will apply to every object within the structure.

```note-blue
**Why can't I find the variable I want?**
Some objects, such as Start Zone or Secret, have limited or no parameterable variables. If you can't find the variable you're looking for, chances are the object(s) you're using doesn't support it.
```

---

~### Custom structure example

### Custom structure example

Picture a scenario in which a Builder must design a level set in a town with many small houses. It would be useful for this Builder to define a custom "house" structure so that they can easily place several of these houses.

First, the Builder begins by creating the structure within the scene. They decide to create a house using the Prism and Cube [shape objects]().

![A house composed of a prism and a cube.](/media/custom-structure-example/1.png#full-image)

Next, the Builder selects all the objects that make up the house before clicking on the **Create Custom Structure** (icon) button.

![Custom structure creation.]()

The Builder fills out the information for this structure and decides that they want to set a [variable **Color** parameter]() so that they can easily create different colored versions of this house.

Once they click **Create**, they are able to find the preset within the [Object Preset menu]() under **Custom Structures**.

![Custom structures section of the Object Preset menu.]()

Now they can place this house structure like any other object preset.

![A little town.]()

---

## Changing the level environment

Every detail, even those that don't directly affect the geography of a level, can have an impact on a Runner's experience. This is why the Z-corp™ proprietary Level Editor™ provides tools to change even the color of the sky if a Builder deems it necessary.

Skybox, sky color, fog color, and fog density are all values that can be set in the [Level Settings menu]().

---

## Changing the level music

You can change the level music in the [Level Settings menu](/glossary/editor-interface/level-settings) under **General Settings > Level Playlist**. Choose from our selection of [Z-corp approved Playlists™](/glossary/editor-interface/toolbar/level-settings/general-settings/level-playlist).

---

# Glossary

[Table of contents]

---

## C

[Table of contents]

---

### Camera

The scene camera is what allows you to view and move around the [scene](). For more detail, read the page on [controlling the camera]().

---

### Color Palette Manager

The Color Palette Manager allows you to set the preset colors used in color pickers.

![The Color Palette Manager.]()

This window can be opened from the [Project Manager]() by clicking on the (icon) **Colors** button.

---

### Custom structure

Custom structures are [structures]() that have been defined by the Builder on a per-project basis. To learn how to define them, read the page on [creating custom structures]().

---

### Custom Structures window

The Custom Structures window allows you to easily add or delete structures. Custom structures can be imported and exported from this menu.

![The Custom Structures window.]()

This window can be opened from the [Project Manager]() by clicking on the (icon) **Structures** button.

---

## G

[Table of contents]

---

### Ghost path

Ghost paths are playtesting data visualized within the scene. They show the path taken from start to end, as well as the time spent to complete a level.

![An example of a ghost path.]()

Ghost paths are automatically recorded and visualized once you [play through a level](). They can be played, stopped, hidden, and managed all through the various (icon) [toolbar]() actions.

---

### Ghost Paths Manager

The Ghost Paths Manager allows you to easily control the playback, visibility, and availability of all of the [ghost paths]() in a level.

This window can opened from the [toolbar]() by clicking on the dropdown next to the (icon) **Toggle Ghost Visibility** button and selecting **Open Ghost Paths Manager**.

![The Ghost Paths manager.]()

---

## I

[Table of contents]

---

### Inspector

The Inspector appears on the right-hand side of the editor when object(s) are selected. It shows all editable object parameters, and can be used to precisely modify an object's properties.

![The Inspector.]()

---

### Issue

An issue is any error or warning present in the level. An **error** is an issue that will prevent the level from playing. A **warning** is an issue that may cause problems, but does not strictly require fixing.

Issues can be tracked in the [Issues window]().

---

### Issues window

The Issues window lists any [issues]() that may be present in the level.

![The Issues window.]()

---

## K

[Table of contents]

---

### Keyboard shortcuts

| Key                            | Action |
| -                              | -      |
| Delete / Backspace             | Delete selected object(s) |
| Ctrl+Z / Command+Z             | Undo |
| Shift+Ctrl+Z / Shift+Command+Z | Redo |
| Ctrl+C / Command+C             | Copy |
| Ctrl+V / Command+V             | Paste |
| Ctrl+X / Command+X             | Cut |
| Ctrl+D / Command+D             | Duplicate |
| Tab                            | Cycle transform tool |

---

## L

[Table of contents]

---

### Level

A level is a single scene in a [project](). For a level to be publishable, it must meet the following requirements:

1. There is a Start Zone.
2. There is an End Zone.
3. There must not be a low star time that is greater than a higher star time. (See: [level times]())

If a level does not meet any of these requirements, an [error]() will be thrown.

---

### Level Settings

Allows configuration of level and editor settings.

[Table of contents]

---

#### General Settings

| Name               | Description |
| -                  | -           |
| Level Name         | Appears upon entering a level and in the pause menu. |
| Level Size         | The level's width and height. Objects outside of these bounds will create a warning in the [Issues window](). Set to 3000x3000 by default. |
| [Level Playlist]() | The level's soundtrack. |

---

##### Level Playlist

| Name    | Description |
| -       | - |
| Auto    | |
| Default | |
| Desert  | |
| Void    | |
| OVO     | |

---

#### Environment

| Name        | Description                                                    |
| -           | -                                                              |
| Skybox Type | The level's skybox texture.                                    |
| Sky Color   | If set to **override**, will override the skybox.              |
| Fog Color   | If set to **override**, will override the default fog color.   |
| Fog Density | If set to **override**, will override the default fog density. |

---

#### Level Times

Setting level times will allow you to award stars to Runners who beat the map within the specified number of seconds. For a detailed guide, read the page on [setting level times]().

| Name        | Description                                             |
| -           | -                                                       |
| 1 Star Time | The minimum required time to achieve 1 star.            |
| 2 Star Time | The minimum required time to achieve 2 stars.           |
| 3 Star Time | The minimum required time to achieve 3 stars.           |
| 4 Star Time | The minimum required time to achieve a secret 4th star. |

If the time requirement for a star is set to 0, the star will not be available to Runners.

---

### Levels menu

The Levels menu allows you to open, add, and reorganize levels.

This is a submenu that can be found within the [Project Manager window]().

---

## O

[Table of contents]

---

### Object

Objects are the basic building block of any level. These are your platforms, bounce pads, traffic cones, et cetera.

For a guide on how to add and manipulate objects, read the Getting Started page on [placing objects]().

---

### Object preset

Object presets are specific predefined object types that can be used to [generate new objects](). A list of object presets can be found from the [Object Preset menu]().

All object presets have a position, size, and rotation/angle parameter.

[Table of contents]

---

#### Shapes

Shapes are basic geometric objects. Don't be fooled by their simplicity, as they have a wide variety of uses ranging from blocking out levels to building [custom structures]().

| Name       | Parameters             | Right-click setter |
| -          | -                      | -                  |
| Cube       | Shape, Material, Color | Material           |
| Wedge      | Shape, Material, Color | Material           |
| Prism      | Shape, Material, Color | Material           |
| Pyramid    | Shape, Material, Color | Material           |
| Corner Out | Shape, Material, Color | Material           |
| Corner In  | Shape, Material, Color | Material           |

---

#### Objects

The most commonly used objects are grouped simply as "Objects." Anything you'll typically find as a platform in a level can be found here.

| Name          | Parameters             | Right-click setter |
| -             | -                      | -                  |
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

#### Special

Special objects provide unique interactions. Some objects here, like Start Zone and End Zone, are necessary to play and complete a level.

| Name        | Parameters                     | Right-click setter |
| -           | -                              | -                  |
| Start Zone  | Color                          | —                  |
| End Zone    | Color                          | —                  |
| Door        | Color, Open, Can Be Interacted | Color              |
| Scatter     | Shape, Material, Color, Collision, Randomize X, Randomize Y, Randomize Z, Randomize Angle, Animate Scale, Randomization Amount | Material |
| Secret      | —                              | —                  |
| Inspectable | Inspect Distance, Inspect Text | Inspect Text       |

---

#### Models

Models are objects with unique geometry, material, and sometimes even animations that can be used to decorate your level.

| Name                   | Parameters       | Right-click setter |
| -                      | -                | -                  |
| Traffic Cone           | Color            | Color              |
| Broken Concrete Pillar | Color, Collision | —                  |
| CCTV Camera            | Color            | —                  |
| Cable                  | Color            | —                  |
| Pipe                   | Color            | —                  |
| Pole                   | Color, Collision | —                  |
| Edge Tarp              | Color            | Color              |
| Corner Tarp            | Color            | Color              |
| Snowman                | Color, Collision | —                  |
| Railing                | Color, Collision | —                  |
| Wire Mesh              | Color, Collision | —                  |
| Character Mannequin    | Color, Skin, Animation, Animation Speed, Behavior | — |

---

#### Tags

Tags are a unique object type that can only be placed on the surfaces of other objects.

| Name    | Parameters          | Right-click setter |
| -       | -                   | -                  |
| Text    | Offset, Text Content, Font Size, Font Color, Font Face, Text Alignment | Text Content |
| Title   | Offset, Text Content, Font Size, Font Color, Font Face, Text Alignment | Text Content |
| Tag     | Tag, Offset, Color  | Tag |
| Stripes | Offset, Color, Image Offset, Image Scale, Tile Randomization, Tile Randomization Amount, Tile Blend | Color |
| Arrows  | Offset, Color, Image Offset, Image Scale, Tile Randomization, Tile Randomization Amount, Tile Blend | Color |
| Crosses | Offset, Color, Image Offset, Image Scale, Tile Randomization, Tile Randomization Amount, Tile Blend | Color |

```note-yellow
Tags should not be used for any personal creative expression. You are obligated to stick to the list of legally acceptable messaging and imagery.
```

---

#### Structures

See the glossary page on [structures]().

| Name         | Objects             | Right-click setter |
| -            | -                   | -                  |
| Cube + Wedge | Cube (1), Wedge (1) | —                  |
| Stairs       | Cube (3)            | —                  |

---

#### Custom

See the glossary page on [custom structures]().

---

### Object Preset menu

The Object Preset menu contains every [object preset]() at your disposal.

This menu can be opened by clicking on an empty slot in the [Object tray](), or by hovering over a non-empty slot and clicking on the pencil icon (icon).

---

### Object tray

The object tray is located at the bottom of your editor, and contains slots for loading [object presets]() 

![The object tray.]()

---

## P

[Table of contents]

---

### Project

A project is a sequence of levels. To work on a level, you must first create a **project**. For a detailed guide on how to do that, read the page on [creating a new project]().

You can manage your projects from the [Welcome menu](), and edit any project information from the [Project Manager]().

---

### Project Manager

The Project Manager window contains information about your current project.

This window can be opened from the [toolbar]() by clicking on the (icon) **Project** button.

---

## S

[Table of contents]

---

### Scene view

The scene view is the area in which you will build the level. It is easily [navigable via the scene camera]().

![The scene view.]()

---

### Steam Workshop

The Workshop is where we store levels generated by you, the Builders. When you upload your finished project, that's where it will go. Other Builders and Runners will be able to find your levels there, if they have access to it (see: [setting your project's visibility]()).

The Workshop is accessible directly from your machine (next to the **Level Editor**) or via an external Steam program.

---

### Structure

Structures are prefabricated [object]() groups that can be instantiated just like any other object. Structures can also be user-defined—see also [the glossary page on custom structures]().

---

## T

[Table of contents]

---

### Toolbar

The toolbar is a strip above the scene view that contains various buttons to open windows and enable editing functions.

| Icon   | Label                   | Description |
| -      | -                       | - |
| (icon) | Project                 | Opens the [Project Manager window](/glossary/toolbar/project-manager). |
| (icon) | Steam Workshop          | Opens the [Steam Workshop window](/glossary/toolbar/steam-workshop). |
| (icon) | Save Project            | Indicates whether there are unsaved changes. Saves project on click. |
| (icon) | Undo                    | Undoes the last change. |
| (icon) | Redo                    | Redoes the last undoed change. |
| (icon) | Move Tool               | If an object is selected, enables the [move tool](). |
| (icon) | Rotate Tool             | If an object is selected, enables the [rotate tool](). |
| (icon) | Scale Tool              | If an object is selected, enables the [scale tool](). |
| (icon) | Copy                    | Copies the selected object(s). |
| (icon) | Paste                   | Pastes the copied object(s). |
| (icon) | Cut                     | Copies and removes the selected object(s). |
| (icon) | Duplicate               | Duplicates the selected object(s). |
| (icon) | Delete                  | Deletes the selected object(s). |
| (icon) | Create Custom Structure | Creates a custom structure composed of the selected object(s). |
| (icon) | Toggle Ghost Visibility | Toggles the visibility of [ghost paths](). |
| (icon) | Toggle Grid Snapping | Toggles whether objects snap to the grid when being moved or placed. |
| (icon) | (Variable)              | Indicates whether the level contains issues. Opens the [Issues window](). |
| (icon) | Play                    | Plays the level. |
| (icon) | Settings                | Opens the [Level Settings window.]() |

---

## W

---

### Welcome menu

This is the menu that greets you when you open the Level Editor™. From here, you can create and open projects.

![The Welcome menu.]
