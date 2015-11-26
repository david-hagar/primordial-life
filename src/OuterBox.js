class OuterBox {
    constructor(size, scene) {


        let loader = new THREE.TextureLoader();

        let geometry = new THREE.BoxGeometry(size*2, size*2, 1);

        function makeWall() {
            var meshLambertMaterial = new THREE.MeshLambertMaterial({
                transparent: true,
                opacity: 0.1,
                color: new THREE.Color(0xFFFFFF)
            });
            let wallMaterial = Physijs.createMaterial(
                meshLambertMaterial,
                .1, //  friction
                .99 //  restitution
            );
            return new Physijs.BoxMesh(geometry, wallMaterial, 0);
        }

        let left = makeWall();
        left.rotation.y = Math.PI / 2;
        left.position.x = -size;
        //left.visible = false;
        scene.add(left);

        let right = makeWall();
        right.rotation.y = -Math.PI / 2;
        right.position.x = size;
        //right.visible = false;
        scene.add(right);


        let front = makeWall();
        front.position.z = size;
        //front.visible = false;
        scene.add(front);

        let back = makeWall();
        back.position.z = -size;
        //back.visible = false;
        scene.add(back);


        let top = makeWall();
        top.rotation.x = Math.PI / 2;
        top.position.y = size;
        //top.visible = false;
        scene.add(top);

/*
        let bottom = makeWall();
        bottom.rotation.x = Math.PI / 2;
        bottom.position.y = size;
        //bottom.visible = false;
        scene.add(bottom);
*/


        // Materials
        let ground_material = Physijs.createMaterial(
            new THREE.MeshLambertMaterial({map: loader.load('images/rocks.jpg')}),
            .8, // high friction
            .99 // low restitution
        );
        ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
        ground_material.map.repeat.set( 3, 3 );

        // Ground
        let ground = new Physijs.BoxMesh(
            new THREE.BoxGeometry(size *2.5, 1, size*2.5),
            ground_material,
            0 // mass
        );
        ground.receiveShadow = true;
        ground.position.y = -size;
        scene.add(ground);
    }

}


/*

 class Wall extends THREE.Mesh {
 constructor(size) {
 super( );
 //let a=1;
 //super(geometry, materials);


 }

 }

 */