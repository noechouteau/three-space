import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import TWEEN from '@tweenjs/tween.js'

// Initialisation of the scene / camera / renderer
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
let renderer = new THREE.WebGLRenderer();

let loaded = false;

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

camera.position.set(31.865130389479635, 34.35287069314487, 45.77348779101405)

document.body.appendChild( renderer.domElement );

let controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


// Initialisation of your objects / materials / light
let solarSystem = new THREE.Object3D();
scene.add(solarSystem);

let ball = new THREE.SphereGeometry(1, 32, 32);
let ring = new THREE.RingGeometry( 1.5, 2.5);
let planets =[
    {name: "Soleil", distance: 0, speed: 0.01, rotationSpeed: 0.01, size: 2.5, texture: "textures/sun.jpg"},
    {name: "Mercure", distance: 6, speed: 0.03, rotationSpeed: 0.4, size: 0.5, texture: "textures/mercure.jpg"},
    {name: "Vénus", distance: 10, speed: 0.03, rotationSpeed: 0.8, size: 0.8, texture: "textures/venus.jpg"},
    {name: "Terre", distance: 13.5, speed: 0.03, rotationSpeed: 1, size: 1, texture: "textures/earth.jpg"},
    {name: "clouds", distance: 13.5, speed: 0.035, rotationSpeed: 1, size: 1.02, texture: "textures/clouds.jpg"},
    {name: "Mars", distance: 16, speed: 0.03, rotationSpeed: 0.7, size: 0.8, texture: "textures/mars.jpg"},
    {name: "Jupiter", distance: 32, speed: 0.03, rotationSpeed: 0.5, size: 1.5, texture: "textures/jupiter.jpg"},
    {name: "Saturne", distance: 38, speed: 0.03, rotationSpeed: 0.1, size: 1.2, texture: "textures/saturne.jpg"},
    {name: "Uranus", distance: 42, speed: 0.06, rotationSpeed: 0.2, size: 1, texture: "textures/uranus.jpg"},
    {name: "Neptune", distance: 46, speed: 1, rotationSpeed: 0.6, size: 1, texture: "textures/neptune.jpg"}

];


for (const planet of planets) {
    let texture = new THREE.TextureLoader().load(planet.texture);
    let material = new THREE.MeshStandardMaterial( { map: texture } );
    let mesh = new THREE.Mesh(ball, material);
    mesh.scale.set(planet.size, planet.size, planet.size);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    if(planet.name == "Soleil"){
        material = new THREE.MeshBasicMaterial( { map: texture } );
        mesh = new THREE.Mesh(ball, material);
        mesh.scale.set(planet.size, planet.size, planet.size);
    }
    else if(planet.name == "clouds"){
        material = new THREE.MeshStandardMaterial( { map: texture, transparent: true, opacity: 0.5 } );
        mesh = new THREE.Mesh(ball, material);
        mesh.scale.set(planet.size, planet.size, planet.size);
    }
    mesh.position.y = 0;
    mesh.name = planet.name;
    solarSystem.add(mesh);
}

    let ringMaterial = new THREE.MeshStandardMaterial( { map : new THREE.TextureLoader().load( 'textures/saturn_ring.png' ), side: THREE.DoubleSide } );
    ringMaterial.transparent = true;
    let ringSaturne = new THREE.Mesh(ring, ringMaterial);
    ringSaturne.name = "ringSaturne";
    ringSaturne.rotation.x = -Math.PI/1.5;
    solarSystem.add( ringSaturne);

    let lune = new THREE.Mesh(ball, new THREE.MeshStandardMaterial( { map: new THREE.TextureLoader().load( 'textures/lune.jpg' ) } ));
    lune.scale.set(0.3, 0.3, 0.3);
    lune.castShadow = true;
    lune.receiveShadow = true;
    lune.name = "Lune";
    solarSystem.add(lune);

    // Clock
    const clock = new THREE.Clock();
	 
    // Lights
    let sunlight = new THREE.PointLight(0xffffff, 250, 100);


    sunlight.position.set(0, 0, 0);
    sunlight.castShadow = true;
    scene.add(sunlight);

    let ambientLight = new THREE.AmbientLight(0x404040, 0.25);
    scene.add(ambientLight);

    // Shadows
    sunlight.shadow.mapSize.width = 512;
    sunlight.shadow.mapSize.height = 512;
    sunlight.shadow.camera.near = 0.5;
    sunlight.shadow.camera.far = 500;


    // Stars
    let starsGeometry = new THREE.BufferGeometry();
    let starsVertices = [];
    
    for (let i = 0; i < 11500; i++) {
        let star = new THREE.Vector3();
        star.x = THREE.MathUtils.randFloatSpread(2500); 
        star.y = THREE.MathUtils.randFloatSpread(2500);
        star.z = THREE.MathUtils.randFloatSpread(2500);
        starsVertices.push(star.x, star.y, star.z); 
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    let stars = new THREE.Points(starsGeometry, new THREE.PointsMaterial({ color: 0x888888 }));
    scene.add(stars);
    

    /**
     * Raycaster
     */
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    let clickedObject = null
    let inClick = false

    window.addEventListener('mousedown', (event) =>
    {
        if(loaded && document.getElementById("title").style.display === "none"){
            // Mouse position
            pointer.x = (event.clientX / sizes.width) * 2 - 1
            pointer.y = - (event.clientY / sizes.height) * 2 + 1

            // Raycaster
            raycaster.setFromCamera(pointer, camera)

            const intersects = raycaster.intersectObjects( scene.children );

            for (const element of intersects) {
                if(element.object.type !== "Points" && element.object.name !== "asteroid" && element.object.name !== "ringSaturne"){
                    clickedObject = element.object;
                    inClick = true;
                    console.log(clickedObject.name);
                    document.getElementById("pnameText").style.opacity = 1;
                    document.getElementById("pnameText").innerHTML = clickedObject.name;
                }
            }

            if(inClick && event.button == 2){
                inClick = false;
                document.getElementById("pnameText").style.opacity = 0;
                controls.target = new THREE.Vector3(0,0,0);
            }
        }

    })


    
    /**
     * Resize
     */
    window.addEventListener('resize', () => {
        // Update sizes
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight
    
        // Update camera
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()
    
        // Update renderer
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        // Update body
        document.body.style.width = sizes.width + "px";
        document.body.style.height = sizes.height + "px";

        //Update title div
        document.getElementById("title").style.width = sizes.width + "px";
        document.getElementById("title").style.height = sizes.height + "px";
    
    })


    /**
     * Pause
     */
    let isPaused = false;
    let timePassed = 0;
    window.addEventListener('keydown', (event) =>
    {
        console.log(document.getElementById("title").style.opacity)
        if(event.key == " " && loaded){
            if(document.getElementById("title").style.opacity == ""){
                renderer.domElement.style.visibility = "visible"

                document.getElementById("title").style.opacity = "0";
                setTimeout(() => {
                    document.getElementById("title").style.display = "none";
                }, 4000);

                new TWEEN.Tween(camera.position)
                .to(
                    {
                        z: 45.77348779101405
                    },
                    5000
                )
                .easing(TWEEN.Easing.Circular.Out)
                .start()
                setTimeout(() => {
                    controls.maxDistance = 1200;
                    sizes.width = window.innerWidth
                    sizes.height = window.innerHeight
                
                    camera.aspect = sizes.width / sizes.height
                    camera.updateProjectionMatrix()
                
                    renderer.setSize(sizes.width, sizes.height)
                    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

                    document.body.style.width = sizes.width + "px";
                    document.body.style.height = sizes.height + "px";
                }, 5000);

            }
            else if(isPaused){
                isPaused = false;
                clock.start();
                clock.elapsedTime = timePassed;
                document.getElementById("pause").style.display = "none";
            }
            else{
                isPaused = true;
                timePassed = clock.getElapsedTime();
                clock.stop();
                document.getElementById("pause").style.display = "block";
            }
        }
    })

    
    // Asteroids
    let ceinture = new THREE.Object3D();
    const asteroidsMaterial = new THREE.MeshStandardMaterial({ map : new THREE.TextureLoader().load( 'textures/asteroid.jpg' ) }); 
    let asteroidsGeometry = new THREE.TetrahedronGeometry(1,2);

    fetch('asteroidData.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur de chargement du fichier JSON');
      }
      return response.json();
    })
    .then(data => {
        for (let i = 0; i < 2000; i++) {
            const asteroidMesh = new THREE.Mesh(asteroidsGeometry, asteroidsMaterial);
            asteroidMesh.position.set(data[i].x, data[i].y, data[i].z);

            let size = THREE.MathUtils.randFloat(0.05, 0.08);
            asteroidMesh.scale.set(size, size, size);
            asteroidMesh.name = "asteroid";
            ceinture.add(asteroidMesh);
        }
        render();
        scene.add(ceinture);

    })
    .catch(error => {
      console.error('Une erreur s\'est produite :', error);
    });


    // Rotation Animation
    function rota(object, indice, elapsedTime) {
        
        object.rotation.y += planets[indice].speed;

        object.position.x = planets[indice].distance* Math.sin(elapsedTime * planets[indice].rotationSpeed);
        object.position.z = planets[indice].distance* Math.cos(elapsedTime * planets[indice].rotationSpeed) *0.8;

    }


	 // This is executed for each frames
	 function render() {
	     requestAnimationFrame( render );
         let actualtime = Date.now()

         if(!loaded){
            actualtime = Date.now()
         }

	     // Animation code goes here
         if(!isPaused){
            const elapsedTime = clock.getElapsedTime();

            for (let i = 0; i < solarSystem.children.length-2; i++) {
                rota(solarSystem.children[i],i,elapsedTime)

                if(planets[i].name == "Saturne"){
                    ringSaturne.position.x = solarSystem.children[i].position.x;
                    ringSaturne.position.z = solarSystem.children[i].position.z;
                    ringSaturne.rotation.z += 0.01;
                }
                else if(planets[i].name == "Terre"){
                    lune.position.x = solarSystem.children[i].position.x + 2 * Math.sin(elapsedTime * 7);
                    lune.position.z = solarSystem.children[i].position.z + 2 *Math.cos(elapsedTime * 7);
                    lune.rotation.y += 0.01;
                }
            
            }

            if(inClick){
                controls.target = clickedObject.position;
            }

            ceinture.rotation.y = elapsedTime/20;
         }
        controls.update();

        
        TWEEN.update()
	    renderer.render( scene, camera );

        if(!loaded){
            if(Date.now() - actualtime > 2000 || (clock.getElapsedTime() > 6)){
                loaded = true;
    
                document.getElementById("divCtn").style.opacity = 0;
                setTimeout(() => {
                    document.getElementById("divCtn").style.display = "none";
                    camera.position.z = 3000;
                }, 2000);

                setTimeout(() => {
                start()
                }, 1000);
            }
            console.log(Date.now() - actualtime + "ALORS");

        }
	 }

     function start(){
        document.getElementById("h1-title").style.opacity = 1;
            document.getElementById("h1-title").style.top = 0;
            setTimeout(() => {
                document.getElementById("p1-title").style.opacity = 1;
                document.getElementById("p1-title").style.top = 0;
            }, 1300);
            setTimeout(() => {
                document.getElementById("p2-title").style.opacity = 1;
                document.getElementById("p2-title").style.top = 0;
            }, 2300);
     }

