var camera, renderer, scene;
var meshArray = [];

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

    //set mesh animation
    for (var i = 0; i < meshArray.length; i++) {
        var curMeshGroup = meshArray[i].meshGroup;
        switch (meshArray[i].name) {
            case "helloworld":
                curMeshGroup.rotation.x = 0.8 * Math.sin(5.0 * LEIA.time);
                curMeshGroup.rotation.z = 0.6 * 0.6 * Math.sin(3.0 * LEIA.time);
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
    /*  Leia_LoadSTLModel({
        path: 'resource/LEIA1.stl'
    },function(mesh){
      mesh.material.side = THREE.DoubleSide;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.material.metal = true;
      mesh.scale.set(60, 60, 60);
      mesh.position.set(0, 0, 0);
      var group = new THREE.Object3D();
      group.add(mesh);
      scene.add(group);
      meshArray.push({
        meshGroup: group,
        name: 'LEIA1'
      });
    });*/

    //Add Text
    var helloText = createText({
        text: "Hello",
        size: 15
    });
    helloText.position.set(-20, -5, 3);
    helloText.rotation.set(0, 0, 0);
    helloText.castShadow = true;
    helloText.receiveShadow = true;
    var helloGroup = new THREE.Object3D();
    helloGroup.add(helloText);
    scene.add(helloGroup);
    meshArray.push({
        meshGroup: helloGroup,
        name: "helloworld"
    });

    //add background texture
    var backgroundPlane = Leia_createTexturePlane({
        filename: 'resource/world-map-background2.jpg',
        width: 100,
        height: 75
    });
    backgroundPlane.position.z = -8;
    backgroundPlane.castShadow = false;
    backgroundPlane.receiveShadow = true;
    scene.add(backgroundPlane);
  
  //add center plane
   var centerPlane = Leia_createTexturePlane({
        filename: 'resource/crack001.png',
        width: 100,
        height: 75,
        transparent:true
     
    });
    centerPlane.position.z = 0;
    scene.add(centerPlane);
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