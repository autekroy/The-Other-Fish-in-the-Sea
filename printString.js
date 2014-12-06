
function printStr(str){
    var len = str.length;

    gl.bindBuffer( gl.ARRAY_BUFFER, cubePositionBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cubePoints), gl.STATIC_DRAW );
    gl.vertexAttribPointer( ATTRIBUTE_position, 3, gl.FLOAT, false, 0, 0 );

    // Bind normal buffer
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeNormalBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cubeNormals), gl.STATIC_DRAW );
    gl.vertexAttribPointer( ATTRIBUTE_normal, 3, gl.FLOAT, false, 0, 0 );

    // Bind UV buffer
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeUVBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cubeUV), gl.STATIC_DRAW );
    gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );

    var uvBuffer2 = gl.createBuffer();

    gl.bindBuffer( gl.ARRAY_BUFFER, uvBuffer2 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(stableUV), gl.STATIC_DRAW );      //uv data
    gl.bindBuffer( gl.ARRAY_BUFFER, uvBuffer2 );
    gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );


    var middle = (len - 1) * 0.2;
    for(var i = 0; i < len; i++){
    	// if(str[i] == " ") 	alphabetTexture.image.src = "/Alphabet/space.png";
    	// else				alphabetTexture.image.src = "/Alphabet/" + str[i] + ".png";

	    gl.activeTexture(gl.TEXTURE0);
	    alphabetTexture.image.src = "/Alphabet/" + str[i] + ".png";
	    gl.bindTexture(gl.TEXTURE_2D, alphabetTexture);

        ctm = mat4();
        ctm = mult(ctm, translate(i * 0.4 - middle, 3.9, 0));
        // ctm = mult(ctm, rotate(270, [1, 0, 0]));
        ctm = mult(ctm, scale(0.2, 0.2, 0.2));

        gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(ctm) );

        gl.drawArrays( gl.TRIANGLES, 30, 6); 
    }	

}