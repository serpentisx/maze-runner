// Constants for WebGl and function for initialization
var vPosition;
var vNormal;

const canvas = document.getElementById("gl-canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const canvas_minimap = document.getElementById("gl-canvas-minimap");

const gameGL = initWeblGl(canvas);
const gameGL_mini = initWeblGl(canvas_minimap);

var gl = gameGL.gl;
var proLoc = gameGL.proLoc;
var mvLoc = gameGL.mvLoc;
var program = gameGL.program;

var gl_mini = gameGL_mini.gl;
var proLoc_mini = gameGL_mini.proLoc;
var mvLoc_mini = gameGL_mini.mvLoc;
var program_mini = gameGL_mini.program;

/*--------------------------------------------------*/

function initWeblGl(canvas) {
  const gl = WebGLUtils.setupWebGL(canvas);

  if (!gl) { alert("WebGL isn't available"); }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.8, 0.23, 0.09, .6);
  gl.enable(gl.DEPTH_TEST);

  //  Load shaders and initialize attribute buffers
  const program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  const proLoc = gl.getUniformLocation(program, "projection");
  const mvLoc = gl.getUniformLocation(program, "modelview");

  const proj = perspective(50.0, 1.0, 0.2, 100.0);
  gl.uniformMatrix4fv(proLoc, false, flatten(proj));

  return { mvLoc, proLoc, gl, program };
}

function initTextCoord(gl, program, texCoords) {
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW);

  var vTexCoord = gl.getAttribLocation(program, "vTexCoord");
  gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vTexCoord);

  return vTexCoord;
}

function initBuffer(gl, program, vertices, attribute) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  const aLoc = gl.getAttribLocation(program, attribute);

  attribute === 'vPosition' ? vPosition = aLoc : vNormal = aLoc;

  gl.vertexAttribPointer(aLoc, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aLoc);

  return buffer;
}

function generateTexture(gl, program, imgName) {
  var img = document.getElementById(imgName);
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

  return texture;
}