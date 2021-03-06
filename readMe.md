# readMe

> Summary: My final project is a web tool for audio visualization. It reads audio data through the Web Audio API and converts it into an array. The array is mapped as a variable to the 3D object created by three.js to achieve dynamic effects; Maximilian.js passed Oscwave to the shader as a uniform float, and the noise function is added to create a new visual effect; dat.gui.js is added, allowing users to adjust the parameters in three.js to make it more interesting!

You can find my project on GitHub:

#### [👓 CCI_ACC_FP_audioVisualiser_repository](https://github.com/ShuSQ/CCI_ACC_FP_coding)


You can also view my demo on Youtube:

#### [📹 CCI_ACC_FP_audioVisualiser](https://www.youtube.com/watch?v=2ZJa9D-FDN8)


You can also view two versions of my code on jsfiddle: 

#### [🧩 CCI_ACC_FP_audioVisualiser (withoutNoise&Osc)](https://thx6j.csb.app/)

"withoutNoise&Osc" example:

![](https://miro.medium.com/max/1000/1*LA4ctG8OS3qURz5RVWQurg.gif)


#### [🧩 CCI_ACC_FP_audioVisualiser (Noise&Osc)](https://gzrkq.csb.app/)

"Noise&Osc" example:

![](https://miro.medium.com/max/1000/1*OBz8m0Q7J12iiVvgmohNLg.gif)


</br>

### 0.Why did I do this project? 🧐

The work of audio visualization can be found in many electronic MVs and interactive art. I am also interested in the direction of visualization. After I saw [a great work in vertexshaderart](https://www.vertexshaderart.com/art/nNYZMHxiLMR2xAncW) (this is really a cool particle sphere), I decided to try to do the challenge of visual audio. Before that, I didn't have much experience, but in the end, I did it. Cheers!

Learn more about visualization:

* [Top music visualization resources for web audio API](https://blog.prototypr.io/get-started-with-the-web-audio-api-for-music-visualization-b6f594416a16)

* [Awesome Audio Visualization](https://github.com/willianjusten/awesome-audio-visualization/blob/master/Readme.md)

</br>

### 1.Use of Web Audio API 🎧

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

### 2.Three.js creates scenes and objects 💠

Idea Realization: create elements -> use array variables -> create dat.gui.js control panel (optional)

Create 3D scenes, cameras, light sources and objects through three.js, pay attention to selecting the shaderMaterial() type when selecting the material, and then you need to colour the object through GLSL ES; pass the filtered array to the makeRoughBall() function to create the surface undulations; I used dat.gui.js, which can control the rotation speed of the object in three directions in the scene, and adjust it to the suitable angle to better view the model.

![](https://cdn-images-1.medium.com/max/2400/1*DsxFhGQ5YXRmkOrcheQx5Q.png)
*After rendering the scene, you will see a sphere that can be colored*

![](https://cdn-images-1.medium.com/max/2400/1*U-JUIqQP8w52Hs9hTPhMMw.png)
*The shader can fill the sphere with a variety of custom materials*

Learn more technical details:

* [Music visualization with Web Audio and three.js](https://www.programmersought.com/article/563055099/)

* [Three.js Custom Materials with ShaderMaterial](http://blog.cjgammon.com/threejs-custom-shader-material)

</br>

### 3. Add shaders, noise and external variables 🌈

Idea Realization: create vertexShader and fragmentShader -> add noise / introduce external variables

There are a lot of thorny issues in this part, but it is also very exciting. After trying different combinations, I finally chose the style of ripple diffusion; in the part of creating noise, I referred to [ASHIMA's code](https://github.com/ashima/webgl-noise) and used its effect is very good. The noise is passed to fragmentShader through varying float noise, which creates a rugged surface effect when the audio is not loaded; the variable Oscwave of Maximilian.js is passed to the shader, returned to three.js to declare and define myWave, and use external variables to make the shader effect more powerful. Through the following picture, you can understand how noise affects the outer surface of an object.

![Image for post](https://miro.medium.com/max/1360/1*Ygksr_MmvR7jSMuG0zB1Vg.jpeg)

*by [Jaume Sanchez](https://www.clicktorelease.com/)*

![](https://cdn-images-1.medium.com/max/1600/1*p2xkutGZAnXcbe3OOaSOqQ.gif)
*After adding noise, you will see the surface change*

![](https://cdn-images-1.medium.com/max/1600/1*CLSuBprEObYcdRIOr6GjFw.gif)
*After adding Oscwave*

The sphere will be displaced according to Osc, that is, we do not play audio. If you are in use, you can hear the beat sound provided by Oscwave. You can hear the wave sound in my JSFiddle example and YouTube video, or you can follow any Method to adjust the pitch and amplitude of this sound, but because I will upload audio, I set it very small, more like a beat.

I learned a lot from these articles:

* [Vertex displacement with a noise function using GLSL and three.js](https://www.clicktorelease.com/blog/vertex-displacement-noise-3d-webgl-glsl-three-js/)

* [How can I pass the mouse positions from JS to shader through a uniform?](https://stackoverflow.com/questions/55850554/how-can-i-pass-the-mouse-positions-from-js-to-shader-through-a-uniform)

* [How to Use Shaders as Materials in Three.js (with Uniforms)](https://medium.com/@sidiousvic/how-to-use-shaders-as-materials-in-three-js-660d4cc3f12a)

</br>

### 4.Check and adjust 🩺

Some minor optimizations are made to the Web GUI, the MajorMonoDisplay font is introduced, the click animation of the upload button is adjusted, and the color and spacing of some elements are adjusted to make the Web experience more comfortable and smooth.
</br>

### 5.Can do more 🔋

I also want to try to transfer more physical world data to virtual objects, to achieve richer interaction. When preparing this project, I also saw more excellent cases, such as [How to Create a Webcam Audio Visualizer with Three.js](https://tympanus.net/codrops/2019/09/06/how-to-create-a-webcam-audio-visualizer-with-three-js/) and [WebGL Particle Audio In Visualzer](https://experiments.withgoogle.com/webgl-particle-audio-visualizer), the data collected by the camera and the microphone are transferred to the computer to produce interesting interaction. I also consider that in future projects, Learn in these directions.



Thanks!~
