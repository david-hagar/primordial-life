class Renderer {
    constructor(primordialWorld) {

        var  mouse_position,
            ground_material, box_material, loader,
            renderer, render_stats, physics_stats, scene, ground, light, camera,  boxes = [];

        renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer = renderer;
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMapSoft = true;
        document.getElementById('viewport').appendChild(renderer.domElement);

        render_stats = new Stats();
        this.render_stats = render_stats;
        render_stats.domElement.style.position = 'absolute';
        render_stats.domElement.style.top = '1px';
        render_stats.domElement.style.zIndex = 100;
        document.getElementById('viewport').appendChild(render_stats.domElement);

        physics_stats = new Stats();
        physics_stats.domElement.style.position = 'absolute';
        physics_stats.domElement.style.top = '50px';
        physics_stats.domElement.style.zIndex = 100;
        document.getElementById('viewport').appendChild(physics_stats.domElement);

        scene = new Physijs.Scene;
        this.scene = scene;
        scene.setGravity(new THREE.Vector3(0, -3, 0));
        scene.addEventListener(
            'update',
            function () {
                //applyForce();
                scene.simulate(undefined, 1);
                physics_stats.update();
            }
        );

        camera = new THREE.PerspectiveCamera(
            35,
            window.innerWidth / window.innerHeight,
            1,
            1000
        );
        this.camera = camera;
        camera.position.set(60, 50, 90);
        camera.lookAt(scene.position);
        this.cammeraRoot = new THREE.Object3D();
        this.cammeraRoot.add(camera);
        scene.add(this.cammeraRoot);

        // Light
        light = new THREE.DirectionalLight(0xFFFFFF);
        light.position.set(20, 40, -15);
        light.target.position.copy(scene.position);
        light.castShadow = true;
        light.shadowCameraLeft = -60;
        light.shadowCameraTop = -60;
        light.shadowCameraRight = 60;
        light.shadowCameraBottom = 60;
        light.shadowCameraNear = 20;
        light.shadowCameraFar = 200;
        light.shadowBias = -.0001;
        light.shadowMapWidth = light.shadowMapHeight = 2048;
        light.shadowDarkness = .7;
        scene.add(light);

        // Loader
        loader = new THREE.TextureLoader();



        box_material = Physijs.createMaterial(
            new THREE.MeshLambertMaterial({map: loader.load('images/plywood.jpg')}),
            .8, // low friction
            .99 // high restitution
        );
        box_material.map.wrapS = THREE.RepeatWrapping;
        box_material.map.repeat.set(.25, .25);

        function randRange(min, max) {
            return Math.random() *(max-min) +min;
        }

        function makeBox() {
            let m = Physijs.createMaterial(
                new THREE.MeshLambertMaterial({map: loader.load('images/plywood.jpg')}),
                .2, //  friction
                .9 //  restitution
            );

            var boxMesh = new Physijs.BoxMesh(
                new THREE.BoxGeometry(randRange(6,2), randRange(6,2), randRange(6,2)),
                m
            );
            boxMesh.castShadow = true;

            boxMesh.rotation.set(
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2
            );     return boxMesh;
        }

        for (var i = 0; i < 10; i++) {
            let box = makeBox();
            box.position.set(
                Math.random() * 50 - 25,
                10 + Math.random() * 5,
                Math.random() * 50 - 25
            );


            let box2 = makeBox();
            box2.position.y = randRange(8,4);
            box.add(box2);

            let box3 = makeBox();
            box3.position.y = -randRange(8,4);
            box.add(box3);



            scene.add(box);
            boxes.push(box);
        }

        new OuterBox(30, scene);

        //renderer.domElement.addEventListener('mousemove', setMousePosition);


        this._requestAnimationFrame();
        scene.simulate();
    }




    _requestAnimationFrame(){
        let _this = this;
        requestAnimationFrame(function(){
            _this.render();
        });
    }



    render () {
        this.cammeraRoot.rotation.y += 0.004;

        this._requestAnimationFrame();
        this.renderer.render(this.scene, this.camera);
        this.render_stats.update();
    };

    /*
    setMousePosition (evt) {
        // Find where mouse cursor intersects the ground plane
        var vector = new THREE.Vector3(
            ( evt.clientX / renderer.domElement.clientWidth ) * 2 - 1,
            -( ( evt.clientY / renderer.domElement.clientHeight ) * 2 - 1 ),
            .5
        );
        vector.unproject(camera);
        vector.sub(camera.position).normalize();

        var coefficient = (box.position.y - camera.position.y) / vector.y;
        mouse_position = camera.position.clone().add(vector.multiplyScalar(coefficient));
    };

    applyForce () {
        if (!mouse_position) return;
        var strength = 35, distance, effect, offset, box;

        for (var i = 0; i < boxes.length; i++) {
            box = boxes[i];
            distance = mouse_position.distanceTo(box.position),
                effect = mouse_position.clone().sub(box.position).normalize().multiplyScalar(strength / distance).negate(),
                offset = mouse_position.clone().sub(box.position);
            box.applyImpulse(effect, offset);
        }
    };
    */

}