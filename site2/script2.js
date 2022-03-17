import * as THREE from 'https://unpkg.com/three@0.119.1/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.119.1/examples/jsm/controls/OrbitControls.js'
import * as dat from 'https://unpkg.com/dat.gui@0.7.6/build/dat.gui.module.js'
import { GLTFLoader } from 'https://unpkg.com/three@0.119.1/examples/jsm/loaders/GLTFLoader.js';


//Loading
var textureLoader = new THREE.TextureLoader()
var gltfLoader = new GLTFLoader()


// Debug
var gui = new dat.GUI()

// Canvas
var canvas = document.getElementById('streetview2')

// Scene
var scene = new THREE.Scene()

//Object
//innercirc
var innercirc = new THREE.SphereGeometry(.5,32,32);
var innermat= new THREE.MeshBasicMaterial({
map: textureLoader.load('static/photos/pano2.jpg'),
alphaMap: textureLoader.load('static/photos/pano2alpha.jpg'),
side: THREE.DoubleSide,
transparent: true
})
var foreground = new THREE.Mesh(innercirc,innermat)
scene.add(foreground)

//outercirc
var outercirc = new THREE.SphereGeometry(90,32,32);
var outermat= new THREE.MeshBasicMaterial({
map: textureLoader.load('static/photos/pano2.jpg'),
side: THREE.DoubleSide
})
var background = new THREE.Mesh(outercirc,outermat)
scene.add(background)

//gltf 

gltfLoader.load(`static/model/${model}.glb`, function(glb){
    console.log(glb);
    const extension = glb.scene;
    extension.position.x= -4.7; 
    extension.position.y= 0.29; 
    extension.position.z= -1.15;
    extension.scale.set(0.9,1.8,1); 

    extension.rotation.y= -19.8;

    const positionFolder = gui.addFolder('position')
    positionFolder.add(extension.position, 'x').min(-150).max(150);
    positionFolder.add(extension.position, 'y').min(-50).max(50);
    positionFolder.add(extension.position, 'z').min(-150).max(150);

    const rotationFolder = gui.addFolder('rotation')
    rotationFolder.add(extension.rotation, 'y').min(-50).max(-10);
    
    scene.add(extension)
}, function (xhr){
    console.log((xhr.loaded/xhr.total*100) + '% loaded')
}, function (error){
    console.log('An error occured')
})



// Lights

var light = new THREE.DirectionalLight(0xffffff,1);

light.position.x = -150
light.position.y = 120
light.position.z = -43

const lightFolder = gui.addFolder('light')
lightFolder.add(light.position, 'x').min(-150).max(150);
lightFolder.add(light.position, 'y').min(-50).max(150);
lightFolder.add(light.position, 'z').min(-150).max(150);

scene.add(light)

scene.add(new THREE.AmbientLight(0x333333));
/**
 * Sizes
 */
var sizes = {
    width: window.innerWidth,
    height: window.innerHeight 
}

window.addEventListener('resize', () =>
{
    //Update sizes 
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //Updaate cameraa 
    camera.aspect = sizes.width/sizes.height
    camera.updateProjectionMatrix()

    //Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})



/**
 * Camera
 */
// Base camera
var camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)

camera.position.x = -0.0000001  
camera.position.y = 0
camera.position.z = 0

//camera.target = new THREE.Vector3( 0, 0, 0 )

scene.add(camera)

/**
 * Renderer
 */
var renderer = new THREE.WebGLRenderer({canvas:canvas})
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


// Controls
var controls = new OrbitControls(camera,renderer.domElement);
controls.enablePan = false;
controls.autoRotate = true;
controls.autoRotateSpeed=0.2;

//Mouse
function onMouseWheel(event){ 
    const fov = camera.fov + event.deltaY * 0.03; 
    camera.fov = THREE.MathUtils.clamp(fov,50,90);
    camera.updateProjectionMatrix();
}

canvas.addEventListener('wheel', onMouseWheel,false);
canvas.addEventListener('DOMMouseScroll', onMouseWheel, false);



// button1.onclick = prevModel()
// button2.onclick = nextModel()


// Screenshot button 
function takeScreenshot() {

    // open in new window like this
    //
    var w = window.open('', '');
    w.document.title = "Screenshot";
    //w.document.body.style.backgroundColor = "red";
    var img = new Image();
    // Without 'preserveDrawingBuffer' set to true, we must render now
    renderer.render(scene, camera);
    img.src = renderer.domElement.toDataURL();
    w.document.body.appendChild(img);  
}
    
document.getElementById("shot1.2").addEventListener('click', takeScreenshot);

//Render loop

    function render(){
      requestAnimationFrame(render);

      controls.update();
    
      renderer.render(scene, camera);
    };

render()