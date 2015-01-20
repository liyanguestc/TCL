var camera, renderer, scene;
var meshArray = [];
var world;
var sizeM = 14;
var depthCompress = 0.5;
var radius = 25;
var z0 = -5;
var textradius = 1.2*radius;
head.ready(function() {
    Init();
    animate();
});

function Init() {
    scene = new THREE.Scene();

    //setup camera
    camera = new LeiaCamera({
        cameraPosition: new THREE.Vector3(_camPosition.x, _camPosition.y, _camPosition.z),
        targetPosition: new THREE.Vector3(_tarPosition.x, _tarPosition.y, _tarPosition.z)
    });
    scene.add(camera);

    //setup rendering parameter
    renderer = new LeiaWebGLRenderer({
        antialias: true,
        renderMode: _renderMode,
        shaderMode: _nShaderMode,
        colorMode: _colorMode,
        compFac: _depthCompressionFactor,
        devicePixelRatio: 1
    });
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    Leia_addRender(renderer);

    //add object to Scene
    addObjectsToScene();

    //add Light
    addLights();

    //add Gyro Monitor
    //addGyroMonitor();
}

function animate() {
    requestAnimationFrame(animate);
    var time = LEIA.time;
    var dangle = 0.5;
    //set mesh animation
    for (var i = 0; i < meshArray.length; i++) {
        var curMeshGroup = meshArray[i].meshGroup;
        switch (meshArray[i].name) {
            case "tcl_t":
                curMeshGroup.position.set(textradius*Math.cos(time+dangle), 0, depthCompress*textradius*Math.sin(time+dangle)+z0);
                curMeshGroup.rotation.y = -time-dangle+Math.PI/2;
                break;
              case "tcl_c":
                curMeshGroup.position.set(textradius*Math.cos(time), 0, depthCompress*textradius*Math.sin(time)+z0);
                curMeshGroup.rotation.y = -time+Math.PI/2;
                break;
              case "tcl_l":
                curMeshGroup.position.set(textradius*Math.cos(time-dangle), 0, depthCompress*textradius*Math.sin(time-dangle)+z0);
                curMeshGroup.rotation.y = -time+dangle+Math.PI/2;
                break;
            default:
                break;
        }
    }
    renderer.Leia_render({
        scene: scene,
        camera: camera,
        holoScreenSize: _holoScreenSize,
        holoCamFov: _camFov,
        upclip: _up,
        downclip: _down,
        filterA: _filterA,
        filterB: _filterB,
        filterC: _filterC,
        messageFlag: _messageFlag
    });
}

function addObjectsToScene() {
    //Add your objects here
    //API to add STL Object
      Leia_LoadSTLModel({
        path: 'resource/tcl_t.stl',
        color:0xff0000
    },function(mesh){
      mesh.scale.set(14, 14, 14);
      var group = new THREE.Object3D();
      group.add(mesh);
      scene.add(group);
      meshArray.push({
        meshGroup: group,
        name: 'tcl_t'
      });
    });
  
   Leia_LoadSTLModel({
        path: 'resource/tcl_c.stl',
        color:0xff0000
    },function(mesh){
      mesh.scale.set(sizeM, sizeM, sizeM*0.4);
      var group = new THREE.Object3D();
      group.add(mesh);
      scene.add(group);
      meshArray.push({
        meshGroup: group,
        name: 'tcl_c'
      });
    });
  
   Leia_LoadSTLModel({
        path: 'resource/tcl_l.stl',
        color:0xff0000
    },function(mesh){
      mesh.scale.set(sizeM, sizeM, sizeM*0.4);
      var group = new THREE.Object3D();
      group.add(mesh);
      scene.add(group);
      meshArray.push({
        meshGroup: group,
        name: 'tcl_l'
      });
    });

    var worldTexture = new THREE.ImageUtils.loadTexture('resource/world_texture.jpg');
    worldTexture.wrapS = worldTexture.wrapT = THREE.RepeatWrapping;
    worldTexture.repeat.set(1, 1);
    var worldMaterial = new THREE.MeshPhongMaterial({
        map: worldTexture,
        bumpMap   : THREE.ImageUtils.loadTexture('resource/world_elevation.jpg'),
        bumpScale : 1.00,
        specularMap: THREE.ImageUtils.loadTexture('resource/world_water.png'),
        specular: new THREE.Color('grey'),
        color: 0xffdd99
    });
    var worldGeometry = new THREE.SphereGeometry(25, 30, 30);
    world = new THREE.Mesh(worldGeometry, worldMaterial);
    world.position.z = -5;
    world.castShadow = true;
    scene.add(world);
    world.matrixWorld.elements[10] = 0.1;
    world.matrixWorldNeedsUpdate = true;
    for (var q = 1; q<worldGeometry.vertices.length; q++) {
        worldGeometry.vertices[q].z *= 0.5;
    }

}

function createText(parameters) {
    parameters = parameters || {};
    var strText = parameters.text;
    var size = parameters.size;
    var menuGeometry = new THREE.TextGeometry(
        strText, {
            size: size,
            height: 2,
            curveSegments: 4,
            font: "helvetiker",
            weight: "normal",
            style: "normal",
            bevelThickness: 0.6,
            bevelSize: 0.25,
            bevelEnabled: true,
            material: 0,
            extrudeMaterial: 1
        }
    );
    var menuMaterial = new THREE.MeshFaceMaterial(
        [
            new THREE.MeshPhongMaterial({
                color: 0xffffff,
                shading: THREE.FlatShading
            }), // front
            new THREE.MeshPhongMaterial({
                color: 0xffffff,
                shading: THREE.SmoothShading
            }) // side
        ]
    );
    var menuMesh = new THREE.Mesh(menuGeometry, menuMaterial);
    return menuMesh;
}

function addLights() {
    //Add Lights Here
    var light = new THREE.SpotLight(0xffffff);
    light.position.set(0, 60, 60);
    light.shadowCameraVisible = false;
    light.castShadow = true;
    light.shadowMapWidth = light.shadowMapHeight = 256;
    light.shadowDarkness = 0.7;
    scene.add(light);

    var ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);
}