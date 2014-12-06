/*
	Functions and variabes etc for Alpha Blending!

	Main Author: Brandon Ly
*/

var UNIFORM_uAlpha;

function initAlphaBlending()
{
	UNIFORM_uAlpha = gl.getUniformLocation(program, "uAlpha");
	gl.uniform1f(UNIFORM_uAlpha, 1.0);
}

function enableAlphaBlending()
{
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
	gl.enable(gl.BLEND);
	gl.disable(gl.DEPTH_TEST);
	gl.uniform1f(UNIFORM_uAlpha, 0.8);
}

function disableAlphaBlending()
{
	gl.disable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);
	gl.uniform1f(UNIFORM_uAlpha, 1.0);
}