import * as THREE from 'https://unpkg.com/three@0.119.1/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.119.1/examples/jsm/controls/OrbitControls.js'
import * as dat from 'https://unpkg.com/dat.gui@0.7.6/build/dat.gui.module.js'
import { GLTFLoader } from 'https://unpkg.com/three@0.119.1/examples/jsm/loaders/GLTFLoader.js';


//Loading
var textureLoader = new THREE.TextureLoader()
var gltfLoader = new GLTFLoader()

// Debug
/*var gui = new dat.GUI()*/

// Canvas
var canvas = document.getElementById('birdseye')

// Scene
var scene = new THREE.Scene()
scene.background = textureLoader.load('static/photos/sky.jpg')

//Object
/*var innercirc = new THREE.SphereGeometry(.5,32,32)
var innermat= new THREE.MeshBasicMaterial()
var foreground = new THREE.Mesh(innercirc,innermat)
foreground.position.set(-10,-0.25,-4.1)
scene.add(foreground)

const foreFolder = gui.addFolder('fore')
foreFolder.add(foreground.position, 'x').min(-150).max(150);
foreFolder.add(foreground.position, 'y').min(-50).max(50);
foreFolder.add(foreground.position, 'z').min(-150).max(150);*/

//gltf google earth
gltfLoader.load(`static/model/${basemodel}.glb`, function(glb){
    console.log(glb);
    const earth = glb.scene;

    /*const positionFolder = gui.addFolder('position')
    positionFolder.add(extension.position, 'x').min(-150).max(150);
    positionFolder.add(extension.position, 'y').min(-50).max(50);
    positionFolder.add(extension.position, 'z').min(-150).max(150);

    const rotationFolder = gui.addFolder('rotation')
    rotationFolder.add(extension.rotation, 'y').min(-50).max(50);*/
    
    scene.add(earth)
}, function (xhr){
    console.log((xhr.loaded/xhr.total*100) + '% loaded')
}, function (error){
    console.log('An error occured')
})

//gltf model 

gltfLoader.load(`static/model/${model}.glb`, function(glb){
    console.log(glb);
    const extension = glb.scene;
    extension.position.x= 0;
    extension.position.y= 0; 
    extension.position.z= 0;

    extension.rotation.y= 0;

    /*const positionFolder = gui.addFolder('position')
    positionFolder.add(extension.position, 'x').min(-150).max(150);
    positionFolder.add(extension.position, 'y').min(-50).max(50);
    positionFolder.add(extension.position, 'z').min(-150).max(150);

    const rotationFolder = gui.addFolder('rotation')
    rotationFolder.add(extension.rotation, 'y').min(-50).max(50);*/
    
    scene.add(extension)
}, function (xhr){
    console.log((xhr.loaded/xhr.total*100) + '% loaded')
}, function (error){
    console.log('An error occured')
})

// Lights

var light = new THREE.DirectionalLight(0xffffff,2);

light.position.x = 150
light.position.y = 20
light.position.z = 64

var light2 = new THREE.DirectionalLight(0xffffff,2);

light2.position.x = -66
light2.position.y = 45
light2.position.z = -150

//scene.add(light)
//scene.add(light2)

/*const lightFolder = gui.addFolder('light')
lightFolder.add(light.position, 'x').min(-150).max(150);
lightFolder.add(light.position, 'y').min(-50).max(50);
lightFolder.add(light.position, 'z').min(-150).max(150);
const light2Folder = gui.addFolder('light2')
light2Folder.add(light2.position, 'x').min(-150).max(150);
light2Folder.add(light2.position, 'y').min(-50).max(50);
light2Folder.add(light2.position, 'z').min(-150).max(150);*/

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

    //Update cameraa 
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
var camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
camera.position.x = 1 
camera.position.y = 5
camera.position.z = -5

scene.add(camera)

/**
 * Renderer
 */
 var renderer = new THREE.WebGLRenderer({
     canvas:canvas
    })
 renderer.setSize(sizes.width, sizes.height);
 renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
 
 
 // Controls
 var controls = new OrbitControls(camera,renderer.domElement);
 controls.target = new THREE.Vector3(1,-0.25,5.2);
 controls.enablePan = true;
 controls.minDistance= 7;
 controls.maxDistance= 12;
 controls.maxPolarAngle = Math.PI/2 - 0.05;
 controls.enableDamping = true;


 //Mouse 

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
    
document.getElementById("shot2").addEventListener('click', takeScreenshot);
 
 //Render loop
 
     function render(){
       requestAnimationFrame(render);
 
       controls.update();
     
       renderer.render(scene, camera);
     };
 
 render()