/*
	Code that implements Environment (Reflection) Mapping!
*/

function initEnvMap() {
	// var envMapTexture = gl.createTexture();
 //    gl.bindTexture(gl.TEXTURE_CUBE_MAP, envMapTexture);
 //    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
 //    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
 //    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
 //    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

 //    var faces = [["posx.png", gl.TEXTURE_CUBE_MAP_POSITIVE_X],
 //                 ["negx.png", gl.TEXTURE_CUBE_MAP_NEGATIVE_X],
 //                 ["posy.png", gl.TEXTURE_CUBE_MAP_POSITIVE_Y],
 //                 ["negy.png", gl.TEXTURE_CUBE_MAP_NEGATIVE_Y],
 //                 ["posz.png", gl.TEXTURE_CUBE_MAP_POSITIVE_Z],
 //                 ["negz.png", gl.TEXTURE_CUBE_MAP_NEGATIVE_Z]];
 //    for (var i = 0; i < faces.length; i++) {
 //        var face = faces[i][1];
 //        var image = new Image();
 //        image.onload = function(texture, face, image) {
 //            return function() {
 //                gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
 //                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
 //                gl.texImage2D(face, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
 //            }
 //        } (texture, face, image);
 //        image.src = faces[i][0];
 //    }
 //    return texture;
}