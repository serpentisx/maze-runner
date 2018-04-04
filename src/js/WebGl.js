// Constants for WebGl and function for initialization

var program;
var proLoc;
var mvLoc;
var vPosition;

const canvas = document.getElementById("gl-canvas");
const gl = WebGLUtils.setupWebGL(canvas);

if (!gl) { alert("WebGL isn't available"); }

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.9, 1.0, 1.0, 1.0);
gl.enable(gl.DEPTH_TEST);

//  Load shaders and initialize attribute buffers
program = initShaders(gl, "vertex-shader", "fragment-shader");
gl.useProgram(program);

proLoc = gl.getUniformLocation(program, "projection");
mvLoc = gl.getUniformLocation(program, "modelview");

var proj = perspective(50.0, 1.0, 0.2, 100.0);
gl.uniformMatrix4fv(proLoc, false, flatten(proj));


function initTextCoord(texCoords) {
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW);

  var vTexCoord = gl.getAttribLocation(program, "vTexCoord");
  gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vTexCoord);
}

function initBuffer(vertices) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  return buffer;
}

function generateTexture(imgName) {
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