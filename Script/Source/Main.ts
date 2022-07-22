namespace PrimaFinal {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  ƒ.Debug.info("Main Program Template running!");

  // Constants
  const BOARD_NAME: string = "Board";
  const FLOOR_NAME: string = "Floor";
  const EXCLUDED_NAMES: string[] = [BOARD_NAME, FLOOR_NAME];

  // Graph, viewport and camera component
  let graph: ƒ.Graph;
  let viewport: ƒ.Viewport;
  window.addEventListener("load", init);

  // Parameter of camera rotation (0-1 => 0deg-180deg) 
  let cmpCamera: ƒ.ComponentCamera;
  let cameraRot: Parameter;

  // Grab tool and custom script
  let grabTool: ƒ.Node;
  let grabToolScript: ScriptGrabTool;
  let node: ƒ.Node;

  // Velocity calculation
  let lastPos: ƒ.Vector3;
  let velocity: ƒ.Vector3;

  /** INIT */
  async function init(): Promise<void> {
    // Load resources
    await ResourceManager.load("Resources.json");

    // Save graph, create instance of GameLogic
    graph = <ƒ.Graph>ƒ.Project.resources[document.head.querySelector("meta[autoView]").getAttribute("autoView")];
    await GameLogic.init(graph.getChildrenByName(BOARD_NAME)[0]);

    // Initialize camera
    cmpCamera = new ƒ.ComponentCamera();
    cameraRot = new Parameter();

    // Initialize UI
    UserInterface.load();
    UserInterface.registerEvents();

    // Initialize grab tool script
    grabTool = graph.getChildrenByName(BOARD_NAME)[0].getChildrenByName("Center")[0].getChildrenByName("GrabTool")[0];
    grabToolScript = grabTool.getComponent(ScriptGrabTool);

    // Initialize viewport
    const canvas: HTMLCanvasElement = document.querySelector("canvas");

    viewport = new ƒ.Viewport();
    viewport.initialize("Viewport", graph, cmpCamera, canvas);

    viewport.activatePointerEvent(ƒ.EVENT_POINTER.DOWN, true);
    viewport.addEventListener(ƒ.EVENT_POINTER.DOWN, handleMouseDown);

    viewport.activatePointerEvent(ƒ.EVENT_POINTER.UP, true);
    viewport.addEventListener(ƒ.EVENT_POINTER.UP, handleMouseUp);

    viewport.activatePointerEvent(ƒ.EVENT_POINTER.MOVE, true);
    viewport.addEventListener(ƒ.EVENT_POINTER.MOVE, handleMouseMove);

    // Floor sprite
    const floor: ƒ.Node = graph.getChildrenByName(BOARD_NAME)[0].getChildrenByName("Center")[0].getChildrenByName("Floor")[0];
    createBackground(floor, 100);

    // Start game loop
    start(null);
  }

  /** START */
  function start(_event: CustomEvent): void {
    ƒ.AudioManager.default.listenTo(graph);
    ƒ.AudioManager.default.listenWith(graph.getComponent(ƒ.ComponentAudioListener));

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();
  }

  /** UPDATE */
  function update(_event: Event): void {
    if (GameLogic.side === Side.Light) cameraRot.change(-0.05);
    else cameraRot.change(0.05);
    updateCamera();
    ƒ.Physics.simulate();
    viewport.draw();
    ƒ.AudioManager.default.update();
    updateVelocity();
    GameLogic.timeDelta = ƒ.Loop.timeFrameReal;
    UserInterface.time = GameLogic.time;
  }

  //** Rotate camera between 0deg and 180deg*/
  function updateCamera(): void {
    let rotY: number = cameraRot.value * 180;
    let rMat: ƒ.Matrix4x4 = ƒ.Matrix4x4.ROTATION(new ƒ.Vector3(45, rotY, 0));
    rMat.multiply(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(0, -1, -16)));
    cmpCamera.mtxPivot.set(rMat);
  }

  //** Update velocity */
  function updateVelocity(): void {
    if (grabToolScript.lastNode) {
      const pos: ƒ.Vector3 = grabToolScript.lastNode.mtxWorld.translation;
      if (!lastPos) {
        lastPos = pos.clone;
      }
      velocity = ƒ.Vector3.SCALE(ƒ.Vector3.DIFFERENCE(pos, lastPos), ƒ.Loop.timeFrameReal);
      lastPos = pos.clone;
    }
  }

  //** Handle mouse events */
  function handleMouseUp(event: ƒ.EventPointer): void {
    switch (event.button) {
      case 0:
        handleLeftUp();
        break;
    }
  }
  function handleLeftUp(): void {
    const script: ScriptGrabTool = grabToolScript;
    if (script.lastNode) {
      grabToolScript.disconnect(velocity);
    }
  }
  function handleMouseDown(event: ƒ.EventPointer): void {
    switch (event.button) {
      case 0:
        handleLeftDown(new ƒ.Vector2(event.pointerX, event.pointerY));
        break;
    }
  }
  function handleLeftDown(mouse: ƒ.Vector2): void {
    raycastProjection(mouse, (hitInfo: ƒ.RayHitInfo) => {
      if (hitInfo.hit && !EXCLUDED_NAMES.includes(hitInfo.rigidbodyComponent.node.name)) {
        node = hitInfo.rigidbodyComponent.node;
        grabToolScript.connect(node.getParent() as Piece, node);
      }
    });
  }
  function handleMouseMove(event: ƒ.EventPointer): void {
    raycastProjection(new ƒ.Vector2(event.pointerX, event.pointerY), (hitInfo: ƒ.RayHitInfo) => {
      if (hitInfo.hit && hitInfo.rigidbodyComponent.node !== grabToolScript.lastNode) {
        grabTool.mtxLocal.translation = hitInfo.hitPoint;
      }
    });
  }

  //** Raycast projection: screen to board */
  function raycastProjection(mouse: ƒ.Vector2, callback: (hitInfo: ƒ.RayHitInfo) => void): void {
    const projection: ƒ.Vector2 = viewport.pointClientToProjection(mouse);
    const ray: ƒ.Ray = new ƒ.Ray(new ƒ.Vector3(-projection.x, projection.y, 1));

    ray.origin.transform(cmpCamera.mtxPivot);
    ray.direction.transform(cmpCamera.mtxPivot, false);

    const hitInfo: ƒ.RayHitInfo = ƒ.Physics.raycast(ray.origin, ray.direction, 100 /*, false, ƒ.COLLISION_GROUP.GROUP_1*/);
    callback(hitInfo);
  }

  /** Create background */
  async function createBackground(node: ƒ.Node, count: number): Promise<void> {
    for (let i: number = 0; i < count; i++) {
      const sprite: ƒAid.NodeSprite = await createSprite();
      node.addChild(sprite);
    }
  }

  /** Create sprite */
  async function createSprite(): Promise<ƒAid.NodeSprite> {
    const spriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
    await spriteSheet.load("Assets/star.png");

    const coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, spriteSheet);
    const animation: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation("Star", coat);
    animation.generateByGrid(ƒ.Rectangle.GET(0, 0, 256, 256), 16, 256, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(256));

    const sprite: ƒAid.NodeSprite = new ƒAid.NodeSprite("Sprite");
    sprite.setAnimation(animation);
    sprite.setFrameDirection(1);
    sprite.framerate = 5;

    const cmpTransfrom: ƒ.ComponentTransform = new ƒ.ComponentTransform();
    cmpTransfrom.mtxLocal.rotateX(-90);
    cmpTransfrom.mtxLocal.translateX(Random.number(-32, 32));
    cmpTransfrom.mtxLocal.translateY(Random.number(-32, 32));
    const scale = Random.number(0.6, 1.2);
    cmpTransfrom.mtxLocal.scaleX(scale);
    cmpTransfrom.mtxLocal.scaleY(scale);
    sprite.addComponent(cmpTransfrom);
    return sprite;
  }
}