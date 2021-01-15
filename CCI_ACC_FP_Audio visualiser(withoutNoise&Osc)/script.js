/* 1.13 把著色器顏色寫入了three.js中，留存的問題是：改寫的著色器無法正常顯示
    原因1: 著色器中存在沒有uniform的變量
    
   1.14 沒辦法，還是得自己寫新的著色器，尷尬了，看看能不能把mimic的Osc引入，把myWave給引入
*/


function vertexShader() {
    return `
        varying vec3 vUv; 
        uniform float u_time;
        uniform vec2 u_mouse;
    
        void main() {
           vUv = position; 
    
          vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0)*abs(sin(u_time));
          gl_Position = projectionMatrix * modelViewPosition * abs(cos(u_time)); 
        }
      `
  }
  
  function fragmentShader() {
    return `
      uniform float u_time;
      uniform vec2 u_resolution;
      varying vec3 vUv;
      #define PI 3.14159265358979323846
  
      void main() {
       // gl_FragColor = vec4(abs(sin(vUv.x+vUv.y) *  cos(u_time * PI) ),abs(abs(cos(vUv.x-vUv.y)) * cos(u_time)),abs(sin(vUv.x+vUv.y) * sin(u_time/20.0)),1.0);
        
       gl_FragColor = vec4(0.75-abs(cos((vUv.x+vUv.y+u_time*2.5))),abs(sin(u_time*10.0)/10.0), 1.0-sin(u_time)/PI/2.0-abs(sin(vUv.z+vUv.x*5.0+u_time*1.0)),1.0);
       
  //   float  p = pow(vUv.x,vUv.y);
  //   float  q = pow(vUv.x,vUv.x);
  
      //  gl_FragColor = vec4(0.7-abs(cos((vUv.x+vUv.y)/sin(vUv.z)/p)),abs(sin(u_time)/10.0), 1.0-abs(sin(vUv.x+vUv.y*5.0)),1.0);
      
     // gl_FragColor = vec4(0.75*abs(sin((sin(vUv.x)+cos(vUv.y)+u_time*2.0))),abs(sin(u_time*10.0)/10.0), 0.75-abs(cos((cos(vUv.x)+sin(vUv.y)+u_time*2.0))),.0);
     
   //  vec3 light = vec3(1.0-tan(sin(vUv.y*0.005+vUv.z*vUv.x)), 0.5+cos(u_time*5.0)*0.5+acos(tan(vUv.x*5.0+vUv.y*vUv.z)), abs(sin(u_time/PI)*vUv.x*vUv.y));
   //   gl_FragColor = vec4(light, 0.75);
  
     
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
        }
  
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
  
  
  
  
  