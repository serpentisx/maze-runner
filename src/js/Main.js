// /**
//  * The main method that loads everything
//  * once the document is ready.
//  */
var program;
var numVertices = 6;

var pointsArray = [];
var texCoordsArray = [];

var movement = false;
var spinX = 0;
var spinY = 0;
var origX;
var origY;

var texture;
var texVegg;
var texGolf;
var texLoft;

var proLoc;
var mvLoc;

// Hnútar veggsins
var vertices = [
  vec4(-5.0, 0.0, 0.0, 1.0),
  vec4(5.0, 0.0, 0.0, 1.0),
  vec4(5.0, 1.0, 0.0, 1.0),
  vec4(5.0, 1.0, 0.0, 1.0),
  vec4(-5.0, 1.0, 0.0, 1.0),
  vec4(-5.0, 0.0, 0.0, 1.0),
  // Hnútar gólfsins (strax á eftir)
  vec4(-5.0, 0.0, 10.0, 1.0),
  vec4(5.0, 0.0, 10.0, 1.0),
  vec4(5.0, 0.0, 0.0, 1.0),
  vec4(5.0, 0.0, 0.0, 1.0),
  vec4(-5.0, 0.0, 0.0, 1.0),
  vec4(-5.0, 0.0, 10.0, 1.0)
];

// Mynsturhnit fyrir vegg
var texCoords = [
  vec2(0.0, 0.0),
  vec2(10.0, 0.0),
  vec2(10.0, 1.0),
  vec2(10.0, 1.0),
  vec2(0.0, 1.0),
  vec2(0.0, 0.0),
  // Mynsturhnit fyrir gólf
  vec2(0.0, 0.0),
  vec2(10.0, 0.0),
  vec2(10.0, 10.0),
  vec2(10.0, 10.0),
  vec2(0.0, 10.0),
  vec2(0.0, 0.0)
];


window.onload = function init() {
  if (!gl) { alert("WebGL isn't available"); }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.9, 1.0, 1.0, 1.0);

  gl.enable(gl.DEPTH_TEST);

  //
  //  Load shaders and initialize attribute buffers
  //
  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  var tBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW);

  var vTexCoord = gl.getAttribLocation(program, "vTexCoord");
  gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vTexCoord);

  // Lesa inn og skilgreina mynstur fyrir vegg
  var veggImage = document.getElementById("VeggImage");
  texVegg = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texVegg);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, veggImage);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

  // Lesa inn og skilgreina mynstur fyrir gólf
  var golfImage = document.getElementById("GolfImage");
  texGolf = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texGolf);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, golfImage);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  // Lesa inn og skilgreina mynstur fyrir loft
  var loftImage = document.getElementById("LoftImage");
  texLoft = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texLoft);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, loftImage);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);


  proLoc = gl.getUniformLocation(program, "projection");
  mvLoc = gl.getUniformLocation(program, "modelview");

  var proj = perspective(50.0, 1.0, 0.2, 100.0);
  gl.uniformMatrix4fv(proLoc, false, flatten(proj));


  const mazeRunner = new MazeRunner();
  const gameManager = new GameManager(mazeRunner);

  gameManager.requestNextIteration();
}
