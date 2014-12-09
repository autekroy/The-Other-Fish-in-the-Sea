The Other Fish in the Sea
=====================================================
### Computer Graphics Term Project
* University of California, Los Angeles, CS 174A, 2014 fall
* Author
 * Yao-Jen Chang   (UCLA ID: 704405423) (autekwing@ucla.edu)
 * Sergio Davila   (UCLA ID: 404054006) (SDavila03@g.ucla.edu)
 * Xueyuan Han     (UCLA ID: 904062787) (hanxueyuan@g.ucla.edu)
 * Katie Lu        (UCLA ID: 703861941) (rkrlu@sbcglobal.net)
 * Brandon Ly      (UCLA ID: 304136729) (brandonly101@g.ucla.edu)
* Date: 12/08, 2014

----------------------------------------------------
### Enviornment and tools:
1. OS: Mac OS X 10.9.5
2. Browser: Chrome 37 or Safari 8.0
3. Webgl

----------------------------------------------------
### How to run (Mac OS):
Due to security, some browser like Chrome may stop html file to load files automatically.
* Mac OS (recommend): Use SimpleHTTPserver to solve it.
* Windows: create a simple server to run it.

#### Mac OS SimpleHTTPserver Stpes:

1. open terminal and go to the "CG-project"  folder.
2. type: "python -m SimpleHTTPServer" to create your won simple http server. (The default port is 8000)
3. Then open your browser and use link: http://127.0.0.1:8000/ (cuz the port is 8000)
4. click to open "game.html" file.

----------------------------------------------------
### Game Indroduction:

You want to find your love of your life! But you have been dropped on a wrong island. 
So you have to swim to cross different to find your love! 
Eat the food on the island, avoid underwater monsters and collect swords to kill monsters!

----------------------------------------------------
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

----------------------------------------------------
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

----------------------------------------------------
#### Completed Basic topics:
1. Transformation: rotate, scale and translate.
2. Lighting and Shading
3. Texture
4. Blending: for underwater bubbles and mushroom effect.

#### Completed Advanced topic:
1. Bump Mapping for beach and underwater rocks.
2. Picking: use mouse to click food as life points
3. Collision detection: detect collisio between character and other objects.

----------------------------------------------------
#### Reference:
* monster images are from [Monster Cube](https://www.behance.net/gallery/4531779/Monster-Cube)
* Common folder is from [text book and author's website](http://www.cs.unm.edu/~angel/WebGL/7E/)
* sounds effects are from [FindSound] (http://www.findsounds.com/typesChinese.html)
