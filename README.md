The Other Fish in the Sea
===========================================================================
### Computer Graphics Term Project
* University of California, Los Angeles, CS 174A, 2014 fall
* Authors:
 * Yao-Jen Chang   (UCLA ID: 704405423) (autekwing@ucla.edu)
 * Sergio Davila   (UCLA ID: 404054006) (SDavila03@g.ucla.edu)
 * Xueyuan Han     (UCLA ID: 904062787) (hanxueyuan@g.ucla.edu)
 * Katie Lu        (UCLA ID: 703861941) (rkrlu@sbcglobal.net)
 * Brandon Ly      (UCLA ID: 304136729) (brandonly101@g.ucla.edu)
* Date: 12/08, 2014

---------------------------------------------------------------------------
### Enviornment and tools:
1. OS: Mac OS X 10.9.5
2. Browser: Chrome 37 or Safari 8.0
3. Webgl

---------------------------------------------------------------------------
### How to run (Mac OS):
Due to security, some browser like Chrome may stop html file to load files automatically.
* Mac OS (recommend): Use SimpleHTTPserver to solve it.
* Windows: create a simple server to run it.

#### Mac OS SimpleHTTPserver Stpes:

1. open terminal and go to the "CG-project"  folder.
2. type: "python -m SimpleHTTPServer" to create your won simple http server. (The default port is 8000)
3. Then open your browser and use link: http://127.0.0.1:8000/ (cuz the port is 8000)
4. click to open "game.html" file.

---------------------------------------------------------------------------
### Game Indroduction:

#### Background Story:
You want to find your love of your life! But you have been dropped on a wrong island. 
So you have to swim to cross different to find your love! 
Eat the food on the island, avoid underwater monsters and collect swords to kill monsters!

#### Game Play:
Read the instruction and story before playing the game! 
There're instruction about key controls below the screen.

##### Standing on the beach
* Use mouse to pick food.
* Use key to move forward to ocean.

##### Swimming underwater
* There're 3 underwater levels from 0 to 2
 1. level 0: the shallow water. You can not swimming up or down, and won't be affect by waves
 2. level 1: the deeper water with rock. You can swim up or down, and won't be affect by waves due to rocks.
 3. level 2: the deepest water without rock. You can swim up or down, and would be affect by waves.
* Use key to move left, right, forward and backward to avoid monsters.
* In underwater level 1 and level 2, you can swimming up and down.

---------------------------------------------------------------------------
### How to play:

#### Mouse control:
1. on the beach, use mouse to pick up food by clicking it.

#### Normal Key control:
1. Use 'W' and 'S' to move character forward or backward.
2. Use 'A' and 'D' to move character left or right.
3. Use 'I' and 'K' to swim up or down when character is underwater.

#### Cheat Key control:
1. Use 'O' and 'L' to increase or decrease the number of monsters.
2. Use 'U' and 'J' to increase or decrease the number of life points.

---------------------------------------------------------------------------
#### Files:
1. game.html:        main game html file
2. game.js:          main javascript file to run webgl
3. globalVars.js:    has most the global variables in this project.
4. livingThings.js:  functions that create various shapes which are moving (living underwater!)
5. shape.js:         functions that create shapes which are not living
6. texture.js:       contain functions to create different textures.
7. alphaBlending.js: function about blending
8. boundingBox.js:   function about collision detection

#### Folders:
1. Common:              basic webgl utilities and matrix calculation
2. TextureImage:        all texture images
3. introModal:          library about modal including angular.js and bootstrap
4. Bump Mapping images: contain all bump mapping images for bump mapping texture
5. Sound:               all the sounds effect files
6. Collision Detection test: basic test for collision detection, not use for main game

---------------------------------------------------------------------------
#### Completed Basic topics:
1. Transformation:       rotate, scale and translate.
2. Camera viewpoint:     change the view when walking on the beach.
3. Lighting and Shading: objects and character
4. Texture Mapping:      for every objects
5. Blending:             for underwater bubbles and mushroom effect.

#### Completed Advanced topic:
1. Bump Mapping for beach and underwater rocks.
2. Picking: use mouse to click food as life points
3. Collision detection: detect collisio between character and other objects.

---------------------------------------------------------------------------
### Authors' responsibility
 * Yao-Jen Chang: Main game (game.html, game.js, livingThings.js, shape.js, texture.js), sound effect and documents.
 * Sergio Davila: Advanced topic of Collision detection (boundingBox.js) and website modals (introModal folder)
 * Xueyuan Han  : Advanced topic of Picking (game.html, game.js)
 * Katie Lu     : Advanced topic of Bump Mapping (game.html, game.js)
 * Brandon Ly   : Blending for bubble and mushroom effect (alphaBlending.js)

---------------------------------------------------------------------------
#### Reference:
* monster images are from [Monster Cube](https://www.behance.net/gallery/4531779/Monster-Cube)
* Common folder is from [text book and author's website](http://www.cs.unm.edu/~angel/WebGL/7E/)
* sounds effects are from [FindSound] (http://www.findsounds.com/typesChinese.html)
