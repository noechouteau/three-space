import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import TWEEN from '@tweenjs/tween.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
     
     // Initialisation of the scene / camera / renderer
	 let scene = new THREE.Scene();
	 let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

	 let renderer = new THREE.WebGLRenderer();

	 renderer.setSize( window.innerWidth, window.innerHeight );

	 renderer.shadowMap.enabled = true;
     renderer.shadowMap.type = THREE.PCFSoftShadowMap;

     camera.position.set(31.865130389479635, 34.35287069314487, 45.77348779101405)

	 document.body.appendChild( renderer.domElement );
     setTimeout(() => {
        camera.position.z = 2000;
        renderer.domElement.style.visibility = "visible"
     },2000)

     let controls = new OrbitControls( camera, renderer.domElement );
     controls.enableDamping = true;
	 
	 // Initialisation of your objects / materials / light
	 let solarSystem = new THREE.Object3D();
	 scene.add(solarSystem);

	 let ball = new THREE.SphereGeometry(1, 32, 32);
     let ring = new THREE.RingGeometry( 1.5, 2.5);
     let planets =[
            {name: "sun", distance: 0, speed: 0.01, rotationSpeed: 0.01, size: 2.5, texture: "textures/sun.jpg"},
            {name: "mercure", distance: 6, speed: 0.03, rotationSpeed: 0.4, size: 0.5, texture: "textures/mercure.jpg"},
            {name: "venus", distance: 10, speed: 0.03, rotationSpeed: 0.8, size: 0.8, texture: "textures/venus.jpg"},
            {name: "earth", distance: 13.5, speed: 0.03, rotationSpeed: 1, size: 1, texture: "textures/earth.jpg"},
            {name: "mars", distance: 16, speed: 0.03, rotationSpeed: 0.7, size: 0.8, texture: "textures/mars.jpg"},
            {name: "jupiter", distance: 32, speed: 0.03, rotationSpeed: 0.5, size: 1.5, texture: "textures/jupiter.jpg"},
            {name: "saturne", distance: 38, speed: 0.03, rotationSpeed: 0.1, size: 1.2, texture: "textures/saturne.jpg"},
            {name: "uranus", distance: 42, speed: 0.06, rotationSpeed: 0.2, size: 1, texture: "textures/uranus.jpg"},
            {name: "neptune", distance: 46, speed: 1, rotationSpeed: 0.6, size: 1, texture: "textures/neptune.jpg"}

     ];

	 for (const planet of planets) {
        let texture = new THREE.TextureLoader().load(planet.texture);
        let material = new THREE.MeshPhongMaterial( { map: texture } );
        let mesh = new THREE.Mesh(ball, material);
        mesh.scale.set(planet.size, planet.size, planet.size);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if(planet.name == "sun"){
            material = new THREE.MeshBasicMaterial( { map: texture } );
            mesh = new THREE.Mesh(ball, material);
            mesh.scale.set(planet.size, planet.size, planet.size);
        }
        solarSystem.add(mesh);
     }

    let ringMaterial = new THREE.MeshPhongMaterial( { map : new THREE.TextureLoader().load( 'textures/saturne.jpg' ), side: THREE.DoubleSide } );
    let ringSaturne = new THREE.Mesh(ring, ringMaterial);
    ringSaturne.rotation.x = -Math.PI/1.5;
    solarSystem.add( ringSaturne);

    let lune = new THREE.Mesh(ball, new THREE.MeshPhongMaterial( { map: new THREE.TextureLoader().load( 'textures/lune.jpg' ) } ));
    lune.scale.set(0.3, 0.3, 0.3);
    lune.castShadow = true;
    lune.receiveShadow = true;
    solarSystem.add(lune);

    // Clock
    const clock = new THREE.Clock();
	 
    // Lights
    let sunlight = new THREE.PointLight(0xffffff, 250, 100);
    sunlight.position.set(0, 0, 0);
    sunlight.castShadow = true;
    scene.add(sunlight);

    let ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // Shadows
    sunlight.shadow.mapSize.width = 512;
    sunlight.shadow.mapSize.height = 512;
    sunlight.shadow.camera.near = 0.5;
    sunlight.shadow.camera.far = 500;


    // Stars
    let starsGeometry = new THREE.BufferGeometry();
    let starsVertices = [];
    
    for (let i = 0; i < 10000; i++) {
        let star = new THREE.Vector3();
        star.x = THREE.MathUtils.randFloatSpread(2000); 
        star.y = THREE.MathUtils.randFloatSpread(2000);
        star.z = THREE.MathUtils.randFloatSpread(2000);
        starsVertices.push(star.x, star.y, star.z); 
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    let stars = new THREE.Points(starsGeometry, new THREE.PointsMaterial({ color: 0x888888 }));
    scene.add(stars);

    // Asteroids
    let ceinture = new THREE.Object3D();
    const asteroidsMaterial = new THREE.MeshPhongMaterial({ map : new THREE.TextureLoader().load( 'textures/asteroid.jpg' ) }); 
    const circularRadius = 24;
    
    for (let i = 0; i < 2000; i++) {
        let asteroidsGeometry = new THREE.TetrahedronGeometry(1,THREE.MathUtils.randInt(1,4));
        const asteroid = new THREE.Vector3();
        
        const angle = Math.random() * Math.PI * 2;
        const randomRadius = Math.sqrt(Math.random()) * circularRadius;
            
            asteroid.x = randomRadius * Math.cos(angle);
            asteroid.z = randomRadius * Math.sin(angle);
            asteroid.y = THREE.MathUtils.randFloatSpread(2);

            if (Math.sqrt(asteroid.x * asteroid.x + asteroid.z * asteroid.z) < 17) {
                const minRadius = 20;
                
                const newRandomRadius = THREE.MathUtils.randFloat(minRadius, circularRadius);
                const newRandomAngle = Math.random() * Math.PI * 2;
                
                asteroid.x = newRandomRadius * Math.cos(newRandomAngle);
                asteroid.z = newRandomRadius * Math.sin(newRandomAngle);
            }
    
        const asteroidMesh = new THREE.Mesh(asteroidsGeometry, asteroidsMaterial);
        asteroidMesh.position.set(asteroid.x, asteroid.y, asteroid.z);
        console.log(asteroidMesh.position)
        let size = THREE.MathUtils.randFloat(0.05, 0.08);
        asteroidMesh.scale.set(size, size, size);
        asteroidMesh.name = "asteroid";
        ceinture.add(asteroidMesh);
    }
    scene.add(ceinture);
    

    /**
     * Raycaster
     */
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    let clickedObject = null
    let inClick = false

    window.addEventListener('mousedown', (event) =>
    {
        // Mouse position
        pointer.x = (event.clientX / sizes.width) * 2 - 1
        pointer.y = - (event.clientY / sizes.height) * 2 + 1

        // Raycaster
        raycaster.setFromCamera(pointer, camera)

        const intersects = raycaster.intersectObjects( scene.children );

        for (const element of intersects) {
            if(element.object.type !== "Points" && element.object.name !== "asteroid"){
                clickedObject = element.object;
                inClick = true;
            }
        }


        if(inClick && event.button == 2){
            inClick = false;
            controls.target = new THREE.Vector3(0,0,0);
        }

    })

    
    solarSystem.children[0].addEventListener('mouseover', (event) =>
    {
        console.log("test");

        // Mouse position
        pointer.x = (event.clientX / sizes.width) * 2 - 1
        pointer.y = - (event.clientY / sizes.height) * 2 + 1

        // Raycaster
        raycaster.setFromCamera(pointer, camera)

        const intersects = raycaster.intersectObjects( scene.children );

        for (const element of intersects) {
            if(element.object.type !== "Points"){
                element.object.material.color.set(0xff0000);
            }
        }
    })
    
    /**
     * Resize
     */
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeigh
    }
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

        if(event.key == " "){
            if(isPaused){
                isPaused = false;
                clock.start();
                clock.elapsedTime = timePassed;
                document.getElementById("pause").style.display = "none";
                new TWEEN.Tween(camera.position)
                .to(
                    {
                        z: 45.77348779101405
                    },
                    4000
                )
                .easing(TWEEN.Easing.Circular.Out)
                .start()
            }
            else{
                isPaused = true;
                timePassed = clock.getElapsedTime();
                clock.stop();
                console.log(camera.position);
                camera.position.z = 2000
                document.getElementById("pause").style.display = "block";
            }
        }
    })

    // Load 


    // Rotation Animation
    function rota(object, indice, elapsedTime) {
        
        object.rotation.y += planets[indice].speed;

        object.position.x = planets[indice].distance* Math.sin(elapsedTime * planets[indice].rotationSpeed);
        object.position.z = planets[indice].distance* Math.cos(elapsedTime * planets[indice].rotationSpeed) *0.8;

    }

	 // This is executed for each frames
	 function render() {
	     requestAnimationFrame( render );

	     // Animation code goes here
         if(!isPaused){
            const elapsedTime = clock.getElapsedTime();

            for (let i = 0; i < solarSystem.children.length-2; i++) {
                rota(solarSystem.children[i],i,elapsedTime)

                if(planets[i].name == "saturne"){
                    ringSaturne.position.x = solarSystem.children[i].position.x;
                    ringSaturne.position.z = solarSystem.children[i].position.z;
                    ringSaturne.rotation.z += 0.01;
                }
                else if(planets[i].name == "earth"){
                    lune.position.x = solarSystem.children[i].position.x + 2 * Math.sin(elapsedTime * 7);
                    lune.position.z = solarSystem.children[i].position.z + 2 *Math.cos(elapsedTime * 7);
                    lune.rotation.y += 0.01;
                }
            
            }

            if(inClick){
                controls.target = clickedObject.position;
                camera.position.x = clickedObject.position.x+5;
                camera.position.z = clickedObject.position.z + 5;
            }

            ceinture.rotation.y = elapsedTime/20;
         }
        controls.update();

        
        TWEEN.update()
	     renderer.render( scene, camera );
	 }
	 render();