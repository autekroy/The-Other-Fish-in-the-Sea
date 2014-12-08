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
#### Enviornment and tools:
1. OS: Mac OS X 10.9.5
2. Browser: Chrome 37 or Safari 8.0
3. Webgl

----------------------------------------------------
#### How to run (Mac OS):
Due to security, some browser like Chrome may stop html file to load files automatically.
* Mac OS (recommend): Use SimpleHTTPserver to solve it.
* Windows: create a simple server to run it.

Mac OS SimpleHTTPserver Stpes:

1. open terminal and go to the "assignment 4"  folder.
2. type: "python -m SimpleHTTPServer" to create your won simple http server. (The default port is 8000)
3. Then open your browser and use link: http://127.0.0.1:8000/ (cuz the port is 8000)
4. click "demo.html" to open "assignment4.html" file.

----------------------------------------------------
#### Indroduction:

----------------------------------------------------
#### Files:
1. game.html
2. game.js
3. globalVars.js
4. livingThings.js
5. shape.js
6. texture.js
7. alphaBlending.js
8. boundingBox.js

#### Folders:
1. Common: basic webgl utilities and matrix calculation
2. TextureImage: all texture images
3. introModal
4. Bump Mapping images
5. Sound: 
6. Collision Detection test: basic test for collision detection, not use for main game

----------------------------------------------------
#### Key control:
1. 'I' and 'O' move the camera nearer or farer away from cubes.

#### Mouse control:
1. on the beach, use mouse to pick up food by clicking it.

----------------------------------------------------
#### Completed Basic topics:
1. Transformation: rotate, scale and translate.
2. Lighting and Shading
3. Texture
4. Blending

#### Completed Advanced topic:
1. Bump Mapping for beach and rock
2. Picking: use mouse to click food as life points
3. Collision detection: detect collisio between character and other objects.

----------------------------------------------------
#### Reference:
* monster resources is from [Monster Cube](https://www.behance.net/gallery/4531779/Monster-Cube)
* Common folder is from [text book and author's website](http://www.cs.unm.edu/~angel/WebGL/7E/)
