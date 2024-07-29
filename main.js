import { initShaderProgram, drawScene } from './shader.js';
import { initBuffers } from './buffers.js';

// Init WebGL canvas
const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
  console.error('WebGL not supported');
}


document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

gl.viewport(0, 0, canvas.width, canvas.height);

// Vertex shader program
const vsSource = `
	attribute vec4 aVertexPosition;
	void main() {
		gl_Position = aVertexPosition;
	}
`;

// Fragment shader program
const fsSource = `	
	precision mediump float;
	uniform vec2 resolution;
	
	void main() {
		vec2 uv = gl_FragCoord.xy / resolution;
		gl_FragColor = vec4(uv.x, uv.y, 0.0, 1.0);
	}
`;



// Init shader program
const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
const buffers = initBuffers(gl);

const programInfo = {
  program: shaderProgram,
  attribLocations: {
    vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
  },
  uniformLocations: {
	resolution: gl.getUniformLocation(shaderProgram, "resolution"),
  },
};


// Draw scene
drawScene(gl, programInfo, buffers);

