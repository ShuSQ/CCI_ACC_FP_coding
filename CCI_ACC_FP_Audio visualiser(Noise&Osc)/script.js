/* 1.13 把著色器顏色寫入了three.js中，留存的問題是：改寫的著色器無法正常顯示
    原因1: 著色器中存在沒有uniform的變量
    
   1.14 沒辦法，還是得自己寫新的著色器，尷尬了，明天看看能不能把mimic的Osc引入，把myWave給引入，不行就只能這樣了，唉
*/



function vertexShader() {
  return `


//
// GLSL textureless classic 3D noise "cnoise",
// with an RSL-style periodic variant "pnoise".
// Author:  Stefan Gustavson (stefan.gustavson@liu.se)
// Version: 2011-10-11
//
// Many thanks to Ian McEwan of Ashima Arts for the
// ideas for permutation and gradient selection.
//
// Copyright (c) 2011 Stefan Gustavson. All rights reserved.
// Distributed under the MIT license. See LICENSE file.
// https://github.com/ashima/webgl-noise
//

vec3 mod289(vec3 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

// Classic Perlin noise
float cnoise(vec3 P)
{
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}

// Classic Perlin noise, periodic variant
float pnoise(vec3 P, vec3 rep)
{
  vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period
  vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}

// Include the Ashima code here!

varying vec2 vUv;
varying float noise;
uniform float u_time;
uniform float myWave;


float turbulence( vec3 p ) {
    float w = 100.0;
    float t = -.5;
    for (float f = 1.0 ; f <= 10.0 ; f++ ){
        float power = pow( 2.0, f );
        t += abs( pnoise( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );
    }
    return t;
}

void main() {

    vUv = uv;

    noise = 10.0 *  -0.10 * turbulence( .5 * normal + u_time/3.14 ); //u_time增加自身滾動
    float b = 5.0 * pnoise( 0.05 * position, vec3( 100.0 ) );
    float displacement = - 10. * noise + b;

    vec3 newPosition = position + normal * displacement;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition+sin(myWave/3.0)*15.0, 1.0 );  //sin(u_time/5.0)*5.0提供旋轉

}
    

    `
}

function fragmentShader() {
  return `
 uniform float u_time;
 varying vec2 vUv;
 varying float noise;
 uniform float myWave;

 void main() {

  // compose the colour using the UV coordinate
  // and modulate it with the noise like ambient occlusion
  vec3 color = vec3( abs(sin(vUv.x)*sin(vUv.y)/2.0+0.5) * ( 1. - 2. * noise ), 0.0, 1.0-abs(cos((vUv.x+vUv.y+u_time*0.5))) );
  gl_FragColor = vec4( color.rgb*abs(sin(u_time/10.0) +0.5), 1.0 );

}
`
}





//initialise simplex noise instance 創建一些簡單的噪音實例
var noise = new SimplexNoise();

// the main visualiser function 可視化的主函數
var vizInit = function() {

  var file = document.getElementById("thefile"); // 接收上傳文件
  var audio = document.getElementById("audio"); // 接收音頻
  var fileLabel = document.querySelector("label.file"); // 接收文件標籤

  // 加載&播放音頻
  document.onload = function(e) {
    console.log(e);
    audio.play();
    play();
  } // 文件路徑更改

  file.onchange = function() {
    fileLabel.classList.add('normal');
    audio.classList.add('active');
    var files = this.files;

    audio.src = URL.createObjectURL(files[0]);
    audio.load();
    audio.play();
    play();
  }

  // 播放函數，創建analyser
  function play() {
    var context = new AudioContext(); // 創建新的音頻Context
    var src = context.createMediaElementSource(audio); // 在context裡面創建src
    var analyser = context.createAnalyser(); // 在context中創建anapyser
    src.connect(analyser); // 連結analyser節點到src
    analyser.connect(context.destination); // 連結destination節點到analyser
    analyser.fftSize = 512; // 設置fftSize，我們會根據這個得到監聽的數據，
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);

    /* 從下面開始進入webgl three.js的部分 */
    //here comes the webgl
    var scene = new THREE.Scene(); // 創建場景
    var group = new THREE.Group(); // 創建組
    var clock = new THREE.Clock();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000); // 初始化攝像機
    camera.position.set(0, 0, 100); // 攝像機位置
    camera.lookAt(scene.position); // 攝像機環繞目標
    scene.add(camera); // 添加攝像機到場景中

    var renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    }); // 添加three.js的渲染器
    renderer.setSize(window.innerWidth, window.innerHeight); // 設置渲染器輸出的canvas尺寸




    var icosahedronGeometry = new THREE.IcosahedronGeometry
(10, 4); // 創建icosahedronGeometry對象


    // 數值統一化
    uniforms = {
      u_time: {
        type: "f",
        value: 1.0
      },
      u_resolution: {
        type: "v2",
        value: new THREE.Vector2()
      },
      myWave: {
      	type: 'f', 
        value: 1.0 }

    };


    var testMaterial = new THREE.ShaderMaterial({ // 創建材質
      uniforms: uniforms,
      fragmentShader: fragmentShader(),
      vertexShader: vertexShader(),
    });


    var ball = new THREE.Mesh(icosahedronGeometry, testMaterial); // 為球體添加網格
    ball.position.set(0, 0, 0); // 設置網格座標
    group.add(ball); // 將球體添加到group中

    var ambientLight = new THREE.AmbientLight(0xaaaaaa); // 創建環境光
    scene.add(ambientLight); // 將環境光添加到場景中

    var spotLight = new THREE.SpotLight(0xffffff); // 創建點光源
    spotLight.intensity = 0.9;
    spotLight.position.set(-10, 40, 20);
    spotLight.lookAt(ball);
    spotLight.castShadow = true;
    scene.add(spotLight);

    scene.add(group); //將group添加到場景中

    document.getElementById('container').appendChild(renderer.domElement); // 獲取標籤'container'添加dom子元素

    window.addEventListener('resize', onWindowResize, false); // 添加事件監聽，resize之後重新渲染




/*--------- guiDat -----------*/

    var obj = {

        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,

    };

    var gui = new dat.gui.GUI();

	guiControl = new function() {
  	this.rotationX = 0.0;
    this.rotationY = 0.1;
    this.rotationZ = 0.0;
  }


 var f0 = gui.addFolder('Rotate this ⚽️ created by 🧀️');
 f0.add(guiControl, 'rotationX').min(0.0).max(5).step(0.001);
 f0.add(guiControl, 'rotationY').min(0.0).max(5).step(0.001);
 f0.add(guiControl, 'rotationZ').min(0.0).max(5).step(0.001);
 
 

/*--------- guiDat -----------*/





    render(); // 執行渲染函數

    function render() { // 函數會在每次update之後執行
      analyser.getByteFrequencyData(dataArray);

      // 把array分為lowerHalf和upperHalf兩部分
      var lowerHalfArray = dataArray.slice(0, (dataArray.length / 2) - 1);
      var upperHalfArray = dataArray.slice((dataArray.length / 2) - 1, dataArray.length - 1);
      // 做一些基礎的還原和歸一化 reductions&normalisations
      var overallAvg = avg(dataArray);
      var lowerMax = max(lowerHalfArray);
      var lowerAvg = avg(lowerHalfArray);
      var upperMax = max(upperHalfArray);
      var upperAvg = avg(upperHalfArray);

      var lowerMaxFr = lowerMax / lowerHalfArray.length;
      var lowerAvgFr = lowerAvg / lowerHalfArray.length;
      var upperMaxFr = upperMax / upperHalfArray.length;
      var upperAvgFr = upperAvg / upperHalfArray.length;


      // 在這裡調節球體的形狀
      makeRoughBall(ball, modulate(Math.pow(lowerMaxFr, 0.8), 0, 1, 0, 8), modulate(upperAvgFr, 0, 1, 0, 4)); // 控制圖形變化

      
      group.rotation.x += guiControl.rotationX/10;
      group.rotation.y += guiControl.rotationY/10;
      group.rotation.z += guiControl.rotationZ/10;


      uniforms.u_time.value = clock.getElapsedTime();

      renderer.render(scene, camera);
      requestAnimationFrame(render);
      uniforms.myWave.value = wave;

    }

    // 執行Resize窗口的函數
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.u_resolution.value.x = renderer.domElement.width;
	    uniforms.u_resolution.value.y = renderer.domElement.height;
    }

    // 執行球體調整的函數
    function makeRoughBall(mesh, bassFr, treFr) {
      mesh.geometry.vertices.forEach(function(vertex, i) {
        var offset = mesh.geometry.parameters.radius;
        var amp = 7;
        var time = window.performance.now();
        vertex.normalize();
        var rf = 0.00001;
        var distance = (offset + bassFr) + noise.noise3D(vertex.x + time * rf * 7, vertex.y + time * rf * 8, vertex.z + time * rf * 9) * amp * treFr;
        vertex.multiplyScalar(distance);
      });
      mesh.geometry.verticesNeedUpdate = true;
      mesh.geometry.normalsNeedUpdate = true;
      mesh.geometry.computeVertexNormals();
      mesh.geometry.computeFaceNormals();
    }


    audio.play(); // 播放音頻
  };
}

window.onload = vizInit(); // 窗口加載？

document.body.addEventListener('touchend', function(ev) {
  context.resume();
}); // 添加事件監聽，touched執行函數




//some helper functions here 一些幫助性的函數
function fractionate(val, minVal, maxVal) {
  return (val - minVal) / (maxVal - minVal); // 返回[0,1] 即插值距min值比max值距min值
}

function modulate(val, minVal, maxVal, outMin, outMax) {
  var fr = fractionate(val, minVal, maxVal);
  var delta = outMax - outMin;
  return outMin + (fr * delta);
}

function avg(arr) {
  var total = arr.reduce(function(sum, b) {
    return sum + b;
  });
  return (total / arr.length);
}

function max(arr) {
  return arr.reduce(function(a, b) {
    return Math.max(a, b);
  })
}




/*******  maximilian.js  *********/

  
    
   var maxi = maximilian();

  //create an audio engine
	var maxiEngine = new maxi.maxiAudio();
	
	//create two oscillators
	var kick = new maxi.maxiSample();
	var hihat= new maxi.maxiSample();
	var clock2 = new maxi.maxiClock();
	
  clock2.setTempo(49);
  clock2.setTicksPerBeat(4);
	
	
	let playAudio = () => {

	
    var changeThis = 10;
    var maximJs = maximilian();
    var maxiAudio = new maximJs.maxiAudio();
    
    maxiAudio.init();
     var osc1 = new maximJs.maxiOsc();
    var osc2 = new maximJs.maxiOsc();
    var osc3 = new maximJs.maxiOsc();
    var osc4 = new maximJs.maxiOsc();
    var counter = 0;
      
//     var canvas = document.querySelector("canvas");

  	// This works out a frequency we can use that matches the buffersize
    var bufferFreq=44100/1024;

maxiAudio.play = function() {

		var YD = 0.1;
    var YG = 20;

       // wave = osc1.sinewave(bufferFreq+5*osc2.sinewave(bufferFreq*changeThis)*osc3.coswave(3.1415926*YD)*YG);
       //   wave = osc1.sinewave(bufferFreq*osc2.sinewave(bufferFreq)*10) * 1.15;
       wave = osc1.sinewave(bufferFreq) + osc2.sinewave(bufferFreq / osc3.coswave(bufferFreq*100000000.006)/osc4.sawn(bufferFreq*1023)); 
   //  wave = (osc1.sinewave(bufferFreq) + osc2.sinewave(bufferFreq / osc3.coswave(bufferFreq*0.0000000314)/osc4.sawn(bufferFreq*1024))); 
             
        counter++;
        return wave*0.05; // 控制傳到shader裡面unifrom的myWave，控制著色器座標
      
      
	}

    };

	
   playAudio();



/*******  maximilian.js  *********/







