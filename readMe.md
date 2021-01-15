# readMe

> Summary: My final project is a web tool for audio visualization. It reads audio data through the Web Audio API and converts it into an array. The array is mapped as a variable to the 3D object created by three.js to achieve dynamic effects; Maximilian.js passed Oscwave to the shader as a uniform float, and the noise function is added to create a new visual effect; dat.gui.js is added, allowing users to adjust the parameters in three.js to make it more interesting!

You can also view two versions of my code on jsfiddle: </br>
#### [CCI_ACC_FP_audioVisualiser (withoutNoise&Osc)](https://jsfiddle.net/SQShu/68w9fmhg/12/)

![](https://miro.medium.com/max/2000/1*zyFn9ywwCByy8ncCKXh6HQ.png)

*example: withoutNoise&Osc*


#### [CCI_ACC_FP_audioVisualiser (Noise&Osc)](https://jsfiddle.net/SQShu/n1pd8abk/15/)

![](https://miro.medium.com/max/2000/1*y0XH4zc82Rtc6eIRYoO9LQ.png)

*example: Noise&Osc*

You can also view my demo video:

#### [CCI_ACC_FP_audioVisualiser](https://www.youtube.com/watch?v=2ZJa9D-FDN8)

</br>

### 0. Why did I do this project?

The work of audio visualization can be found in many electronic MVs and interactive art. I am also interested in the direction of visualization. After I saw [a great work in vertexshaderart](https://www.vertexshaderart.com/art/nNYZMHxiLMR2xAncW) (this is really a cool particle sphere), I decided to try to do the challenge of visual audio. Before that, I didn't have much experience, but in the end, I did it. Cheers!

Learn more about visualization:

* [Top music visualization resources for web audio API](https://blog.prototypr.io/get-started-with-the-web-audio-api-for-music-visualization-b6f594416a16)

* [Awesome Audio Visualization](https://github.com/willianjusten/awesome-audio-visualization/blob/master/Readme.md)

</br>

### 1. Use of Web Audio API

Idea Realization: Web receive audio -> decode audio/create array/categorical array -> assign array to variable (did in three.js render() )

Create `input` and `audio` in HTML to allow uploading audio, we can use the AudioContext method to audioNode and decode audio data;

![img](https://www.html5rocks.com/en/tutorials/webaudio/intro/diagrams/gain.png)

*By [Boris Smus](https://www.html5rocks.com/profiles/#smus)*

Divide the audio data into multiple arrays through multiple types of filters, and the array of filters is the available variable.

The following articles are very helpful for learning Web Audio API:

* [Getting Started with Web Audio API](https://www.html5rocks.com/en/tutorials/webaudio/intro/)

* [Mozilla_Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

* [Mozilla_Using Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API)

* [Mozilla_Visualizations with Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API)

</br>

### 2.Three.js creates scenes and objects

Idea Realization: create elements -> use array variables -> create dat.gui.js control panel (optional)

Create 3D scenes, cameras, light sources and objects through three.js, pay attention to selecting the shaderMaterial() type when selecting the material, and then you need to colour the object through GLSL ES; pass the filtered array to the makeRoughBall() function to create the surface undulations; I used dat.gui.js, which can control the rotation speed of the object in three directions in the scene, and adjust it to the suitable angle to better view the model.

Learn more technical details:

* [Music visualization with Web Audio and three.js](https://www.programmersought.com/article/563055099/)

* [Three.js Custom Materials with ShaderMaterial](http://blog.cjgammon.com/threejs-custom-shader-material)

</br>

### 3. Add shaders, noise and external variables

Idea Realization: create vertexShader and fragmentShader -> add noise / introduce external variables

There are a lot of thorny issues in this part, but it is also very exciting. After trying different combinations, I finally chose the style of ripple diffusion; in the part of creating noise, I referred to [ASHIMA's code](https://github.com/ashima/webgl-noise) and used its effect is very good. The noise is passed to fragmentShader through varying float noise, which creates a rugged surface effect when the audio is not loaded; the variable Oscwave of Maximilian.js is passed to the shader, returned to three.js to declare and define myWave, and use external variables to make the shader effect more powerful. Through the following picture, you can understand how noise affects the outer surface of an object.

![Image for post](https://miro.medium.com/max/1360/1*Ygksr_MmvR7jSMuG0zB1Vg.jpeg)

*by [Jaume Sanchez](https://www.clicktorelease.com/)*

I learned a lot from these articles:

* [Vertex displacement with a noise function using GLSL and three.js](https://www.clicktorelease.com/blog/vertex-displacement-noise-3d-webgl-glsl-three-js/)

* [How can I pass the mouse positions from JS to shader through a uniform?](https://stackoverflow.com/questions/55850554/how-can-i-pass-the-mouse-positions-from-js-to-shader-through-a-uniform)

* [How to Use Shaders as Materials in Three.js (with Uniforms)](https://medium.com/@sidiousvic/how-to-use-shaders-as-materials-in-three-js-660d4cc3f12a)

</br>

### 4. Check and djust

Some minor optimizations are made to the Web GUI, the MajorMonoDisplay font is introduced, the click animation of the upload button is adjusted, and the color and spacing of some elements are adjusted to make the Web experience more comfortable and smooth.
</br>

### 5.Can do more

I also want to try to transfer more physical world data to virtual objects, to achieve richer interaction. When preparing this project, I also saw more excellent cases, such as [How to Create a Webcam Audio Visualizer with Three.js](https://tympanus.net/codrops/2019/09/06/how-to-create-a-webcam-audio-visualizer-with-three-js/) and [WebGL Particle Audio In Visualzer](https://experiments.withgoogle.com/webgl-particle-audio-visualizer), the data collected by the camera and the microphone are transferred to the computer to produce interesting interaction. I also consider that in future projects, Learn in these directions.



Thanks!~
