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

	#define ITERATIONS 100
	#define MIN_DIST .01
	#define MAX_DIST 1000.

	precision mediump float;
	uniform vec2 resolution;
	
	float sphereSDF(vec3 p, float r) {
		return length(p) - r;
	}
	
	float getDist(vec3 p) {
		float sd = sphereSDF(p - vec3(0., 1., 6.), 1.);
		return sd;
	}

	float raymarch(vec3 ro, vec3 rd) {
		float d0 = 0.;
		for(int i=0;i<ITERATIONS;i++) {
			vec3 p = ro + d0 * rd;
			float ds = getDist(p);
			d0 += ds;
			if(d0 > MAX_DIST || ds < MIN_DIST) {
				break;
			}
		}
		return d0;
	}


	void main() {
		vec2 uv = 2. * gl_FragCoord.xy / resolution - 1.;
		vec3 ro = vec3(0.);
		vec3 rd = normalize(vec3(uv, 1.));
		float ds = raymarch(ro, rd);

		vec3 col = vec3(1. - ds/10.);
		gl_FragColor = vec4(col, 1.0);
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

