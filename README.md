The Other Fish in the Sea
=====================================================
### Computer Graphics Term Project
* University of California, Los Angeles, CS 174A, 2014 fall
* Author
 * Yao-Jen Chang (704-405-423), autekwing@ucla.edu
 *
* Date: 12/08, 2014

---------------------------------------
#### Enviornment:
OS: Mac OS X 10.9.5
Browser: Chrome 37 or Safari 8.0

---------------------------------------
#### How to run:
Due to security, some browser like Chrome may stop html file to load files automatically.
I am using Mac OS so I use SimpleHTTPserver to solve it.

Here are steps.
1. open terminal and go to the "assignment 4"  folder.
2. type: "python -m SimpleHTTPServer" to create your won simple http server. (The default port is 8000)
3. Then open your browser and use link: http://127.0.0.1:8000/ (cuz the port is 8000)
4. click "demo.html" to open "assignment4.html" file.

---------------------------------------
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

---------------------------------------
#### Key control:
1. 'I' and 'O' move the camera nearer or farer away from cubes.
2. 'R' to start/stop the rotation of both cubes.
3. 'T' to start/stop to rotate of the texture maps on all faces of the left cube.
4. 'S' to start/stop to continuous scroll the texture map on the right cube.

---------------------------------------
#### Reference:
* monster resources is from [Monster Cube](https://www.behance.net/gallery/4531779/Monster-Cube)
* Common folder is from [text book and author's website](http://www.cs.unm.edu/~angel/WebGL/7E/)
