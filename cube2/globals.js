var gl = null;

var cubeVertices = [-1,-1,1,1,-1,1,1,1,1,
                    -1,-1,1,1,1,1,-1,1,1,
                    1,-1,1,1,-1,-1,1,1,-1,
                    1,-1,1,1,1,-1,1,1,1,
                    1,-1,-1,-1,-1,-1,-1,1,-1,
                    1,-1,-1,-1,1,-1,1,1,-1,
                    -1,-1,-1,-1,-1,1,-1,1,1,
                    -1,-1,-1,-1,1,1,-1,1,-1,
                    -1,1,1,1,1,1,1,1,-1,
                    -1,1,1,1,1,-1,-1,1,-1,
                    1,-1,1,-1,-1,-1,1,-1,-1,
                    1,-1,1,-1,-1,1,-1,-1,-1]

var cubeUVs =  [0, 1, 0, 0, 1, 0, 0, 1,
                1, 0, 1, 1, 0, 1, 0, 0,
                1, 0, 0, 1, 1, 0, 1, 1,
                0, 1, 0, 0, 1, 0, 0, 1,
                1, 0, 1, 1, 0, 1, 0, 0,
                1, 0, 0, 1, 1, 0, 1, 1,
                0, 1, 0, 0, 1, 0, 0, 1,
                1, 0, 1, 1, 0, 1, 1, 0,
                0, 0, 0, 1, 1, 1, 1, 0];

var cubeVB;
var cubeUVB;
var srVB;
var srUVB;
var cubeTexture;
var perspMatrix;
var viewMatrix;
var tempMatrix;

var mx = window.innerWidth/2;
var my = window.innerHeight/2;
var mDown = false;

var tex_program;
var flat_program;

var canvas;

var targetTexture;
var targetTexture2;
var tempFb;
var tempFb2;