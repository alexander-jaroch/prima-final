"use strict";
var PrimaFinal;
(function (PrimaFinal) {
    class GameLogic {
        static _instance;
        _board;
        _pieces;
        _side;
        _time;
        static get instance() {
            return this._instance || new GameLogic();
        }
        static get board() {
            return this.instance._board;
        }
        static get pieces() {
            return this.instance._pieces;
        }
        static get side() {
            return this.instance._side;
        }
        static get time() {
            return this.instance._time;
        }
        static set timeDelta(timeDelta) {
            this.instance._time += timeDelta;
        }
        constructor() {
            GameLogic._instance = this;
            this._board = null;
            this._pieces = [];
            this._side = PrimaFinal.Side.Light;
            this._time = 0;
        }
        static toggleSide() {
            this.instance._side = this.instance._side == PrimaFinal.Side.Light ? PrimaFinal.Side.Dark : PrimaFinal.Side.Light;
        }
        static addPiece(piece) {
            this.instance._pieces.push(piece);
            this.instance._board.addChild(piece);
        }
        static removePiece(piece) {
            if (this.instance._board) {
                this.instance._pieces = this.instance._pieces.filter(x => x != piece);
                this.instance._board.removeChild(piece);
            }
        }
        static removeAllPieces() {
            for (const piece of this.instance._pieces) {
                this.removePiece(piece);
            }
        }
        static async reset() {
            this.removeAllPieces();
            await this.initPieces();
            this.instance._side = PrimaFinal.Side.Light;
            this.instance._time = 0;
        }
        static async init(board) {
            this.instance._board = board;
            /*const rigidbody = this.board.getComponent(ƒ.ComponentRigidbody);
            rigidbody.collisionGroup = ƒ.COLLISION_GROUP.GROUP_1;
            rigidbody.collisionMask = ƒ.COLLISION_GROUP.DEFAULT | ƒ.COLLISION_GROUP.GROUP_1 | ƒ.COLLISION_GROUP.GROUP_2;*/
            await this.initPieces();
        }
        static async initPieces() {
            if (this.instance._board) {
                for (let i = 0; i < 8; i++) {
                    this.addPiece(await PrimaFinal.Piece.createPiece(PrimaFinal.Type.Pawn, PrimaFinal.Side.Light, i, 1));
                    this.addPiece(await PrimaFinal.Piece.createPiece(PrimaFinal.Type.Pawn, PrimaFinal.Side.Dark, i, 6));
                    switch (i) {
                        case 0:
                        case 7:
                            this.addPiece(await PrimaFinal.Piece.createPiece(PrimaFinal.Type.Rook, PrimaFinal.Side.Light, i, 0));
                            this.addPiece(await PrimaFinal.Piece.createPiece(PrimaFinal.Type.Rook, PrimaFinal.Side.Dark, i, 7));
                            break;
                        case 1:
                        case 6:
                            this.addPiece(await PrimaFinal.Piece.createPiece(PrimaFinal.Type.Knight, PrimaFinal.Side.Light, i, 0));
                            this.addPiece(await PrimaFinal.Piece.createPiece(PrimaFinal.Type.Knight, PrimaFinal.Side.Dark, i, 7));
                            break;
                        case 2:
                        case 5:
                            this.addPiece(await PrimaFinal.Piece.createPiece(PrimaFinal.Type.Bishop, PrimaFinal.Side.Light, i, 0));
                            this.addPiece(await PrimaFinal.Piece.createPiece(PrimaFinal.Type.Bishop, PrimaFinal.Side.Dark, i, 7));
                            break;
                        case 3:
                            this.addPiece(await PrimaFinal.Piece.createPiece(PrimaFinal.Type.King, PrimaFinal.Side.Light, i, 0));
                            this.addPiece(await PrimaFinal.Piece.createPiece(PrimaFinal.Type.Queen, PrimaFinal.Side.Dark, i, 7));
                            break;
                        case 4:
                            this.addPiece(await PrimaFinal.Piece.createPiece(PrimaFinal.Type.Queen, PrimaFinal.Side.Light, i, 0));
                            this.addPiece(await PrimaFinal.Piece.createPiece(PrimaFinal.Type.King, PrimaFinal.Side.Dark, i, 7));
                            break;
                    }
                }
            }
        }
    }
    PrimaFinal.GameLogic = GameLogic;
})(PrimaFinal || (PrimaFinal = {}));
var PrimaFinal;
(function (PrimaFinal) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    ƒ.Debug.info("Main Program Template running!");
    // Constants
    const BOARD_NAME = "Board";
    const FLOOR_NAME = "Floor";
    const EXCLUDED_NAMES = [BOARD_NAME, FLOOR_NAME];
    // Graph, viewport and camera component
    let graph;
    let viewport;
    window.addEventListener("load", init);
    // Parameter of camera rotation (0-1 => 0deg-180deg) 
    let cmpCamera;
    let cameraRot;
    // Grab tool and custom script
    let grabTool;
    let grabToolScript;
    let node;
    // Velocity calculation
    let lastPos;
    let velocity;
    /** INIT */
    async function init() {
        // Load resources
        await PrimaFinal.ResourceManager.load("Resources.json");
        // Save graph, create instance of GameLogic
        graph = ƒ.Project.resources[document.head.querySelector("meta[autoView]").getAttribute("autoView")];
        await PrimaFinal.GameLogic.init(graph.getChildrenByName(BOARD_NAME)[0]);
        // Initialize camera
        cmpCamera = new ƒ.ComponentCamera();
        cameraRot = new PrimaFinal.Parameter();
        // Initialize UI
        PrimaFinal.UserInterface.load();
        PrimaFinal.UserInterface.registerEvents();
        // Initialize grab tool script
        grabTool = graph.getChildrenByName(BOARD_NAME)[0].getChildrenByName("Center")[0].getChildrenByName("GrabTool")[0];
        grabToolScript = grabTool.getComponent(PrimaFinal.ScriptGrabTool);
        // Initialize viewport
        const canvas = document.querySelector("canvas");
        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", graph, cmpCamera, canvas);
        viewport.activatePointerEvent("\u0192pointerdown" /* DOWN */, true);
        viewport.addEventListener("\u0192pointerdown" /* DOWN */, handleMouseDown);
        viewport.activatePointerEvent("\u0192pointerup" /* UP */, true);
        viewport.addEventListener("\u0192pointerup" /* UP */, handleMouseUp);
        viewport.activatePointerEvent("\u0192pointermove" /* MOVE */, true);
        viewport.addEventListener("\u0192pointermove" /* MOVE */, handleMouseMove);
        // Floor sprite
        const floor = graph.getChildrenByName(BOARD_NAME)[0].getChildrenByName("Center")[0].getChildrenByName("Floor")[0];
        createBackground(floor, 100);
        // Start game loop
        start(null);
    }
    /** START */
    function start(_event) {
        ƒ.AudioManager.default.listenTo(graph);
        ƒ.AudioManager.default.listenWith(graph.getComponent(ƒ.ComponentAudioListener));
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start();
    }
    /** UPDATE */
    function update(_event) {
        if (PrimaFinal.GameLogic.side === PrimaFinal.Side.Light)
            cameraRot.change(-0.05);
        else
            cameraRot.change(0.05);
        updateCamera();
        ƒ.Physics.simulate();
        viewport.draw();
        ƒ.AudioManager.default.update();
        updateVelocity();
        PrimaFinal.GameLogic.timeDelta = ƒ.Loop.timeFrameReal;
        PrimaFinal.UserInterface.time = PrimaFinal.GameLogic.time;
    }
    //** Rotate camera between 0deg and 180deg*/
    function updateCamera() {
        let rotY = cameraRot.value * 180;
        let rMat = ƒ.Matrix4x4.ROTATION(new ƒ.Vector3(45, rotY, 0));
        rMat.multiply(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(0, -1, -16)));
        cmpCamera.mtxPivot.set(rMat);
    }
    //** Update velocity */
    function updateVelocity() {
        if (grabToolScript.lastNode) {
            const pos = grabToolScript.lastNode.mtxWorld.translation;
            if (!lastPos) {
                lastPos = pos.clone;
            }
            velocity = ƒ.Vector3.SCALE(ƒ.Vector3.DIFFERENCE(pos, lastPos), ƒ.Loop.timeFrameReal);
            lastPos = pos.clone;
        }
    }
    //** Handle mouse events */
    function handleMouseUp(event) {
        switch (event.button) {
            case 0:
                handleLeftUp();
                break;
        }
    }
    function handleLeftUp() {
        const script = grabToolScript;
        if (script.lastNode) {
            grabToolScript.disconnect(velocity);
        }
    }
    function handleMouseDown(event) {
        switch (event.button) {
            case 0:
                handleLeftDown(new ƒ.Vector2(event.pointerX, event.pointerY));
                break;
        }
    }
    function handleLeftDown(mouse) {
        raycastProjection(mouse, (hitInfo) => {
            if (hitInfo.hit && !EXCLUDED_NAMES.includes(hitInfo.rigidbodyComponent.node.name)) {
                node = hitInfo.rigidbodyComponent.node;
                grabToolScript.connect(node.getParent(), node);
            }
        });
    }
    function handleMouseMove(event) {
        raycastProjection(new ƒ.Vector2(event.pointerX, event.pointerY), (hitInfo) => {
            if (hitInfo.hit && hitInfo.rigidbodyComponent.node !== grabToolScript.lastNode) {
                grabTool.mtxLocal.translation = hitInfo.hitPoint;
            }
        });
    }
    //** Raycast projection: screen to board */
    function raycastProjection(mouse, callback) {
        const projection = viewport.pointClientToProjection(mouse);
        const ray = new ƒ.Ray(new ƒ.Vector3(-projection.x, projection.y, 1));
        ray.origin.transform(cmpCamera.mtxPivot);
        ray.direction.transform(cmpCamera.mtxPivot, false);
        const hitInfo = ƒ.Physics.raycast(ray.origin, ray.direction, 100 /*, false, ƒ.COLLISION_GROUP.GROUP_1*/);
        callback(hitInfo);
    }
    /** Create background */
    async function createBackground(node, count) {
        for (let i = 0; i < count; i++) {
            const sprite = await createSprite();
            node.addChild(sprite);
        }
    }
    /** Create sprite */
    async function createSprite() {
        const spriteSheet = new ƒ.TextureImage();
        await spriteSheet.load("Assets/star.png");
        const coat = new ƒ.CoatTextured(undefined, spriteSheet);
        const animation = new ƒAid.SpriteSheetAnimation("Star", coat);
        animation.generateByGrid(ƒ.Rectangle.GET(0, 0, 256, 256), 16, 256, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(256));
        const sprite = new ƒAid.NodeSprite("Sprite");
        sprite.setAnimation(animation);
        sprite.setFrameDirection(1);
        sprite.framerate = 5;
        const cmpTransfrom = new ƒ.ComponentTransform();
        cmpTransfrom.mtxLocal.rotateX(-90);
        cmpTransfrom.mtxLocal.translateX(PrimaFinal.Random.number(-32, 32));
        cmpTransfrom.mtxLocal.translateY(PrimaFinal.Random.number(-32, 32));
        const scale = PrimaFinal.Random.number(0.6, 1.2);
        cmpTransfrom.mtxLocal.scaleX(scale);
        cmpTransfrom.mtxLocal.scaleY(scale);
        sprite.addComponent(cmpTransfrom);
        return sprite;
    }
})(PrimaFinal || (PrimaFinal = {}));
var PrimaFinal;
(function (PrimaFinal) {
    var ƒ = FudgeCore;
    let Side;
    (function (Side) {
        Side["Light"] = "Light";
        Side["Dark"] = "Dark";
    })(Side = PrimaFinal.Side || (PrimaFinal.Side = {}));
    let Type;
    (function (Type) {
        Type["Pawn"] = "Pawn";
        Type["Knight"] = "Knight";
        Type["Bishop"] = "Bishop";
        Type["Rook"] = "Rook";
        Type["Queen"] = "Queen";
        Type["King"] = "King";
    })(Type = PrimaFinal.Type || (PrimaFinal.Type = {}));
    class Piece extends ƒ.Node {
        _x;
        _y;
        _side;
        _type;
        get x() {
            return this._x;
        }
        get y() {
            return this._y;
        }
        get side() {
            return this._side;
        }
        get type() {
            return this._type;
        }
        constructor(type, side, x, y) {
            super(`${type}${side}(${x}|${y})`);
            this._x = x;
            this._y = y;
            this._side = side;
            this._type = type;
        }
        static async createPiece(type, side, x = 0, y = 0) {
            const node = new Piece(type, side, x, y);
            const piece = await ƒ.Project.createGraphInstance(PrimaFinal.ResourceManager.getGraph(type));
            piece.mtxLocal.translation = ƒ.Vector3.ZERO(); // reset local y
            node.addChild(piece);
            const material = PrimaFinal.ResourceManager.getMaterial("Piece" + side);
            this.traverseChildren(piece, child => {
                child.getComponent(ƒ.ComponentMaterial).material = material;
            });
            // Append audio
            const audio = new ƒ.ComponentAudio(PrimaFinal.ResourceManager.getAudio("Drop" + PrimaFinal.Random.element(["06", "07", "08"])));
            node.addComponent(audio);
            // Play sound on collision 
            const rigidbody = piece.getComponent(ƒ.ComponentRigidbody);
            rigidbody.addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, (event) => {
                // Set volume depending on impulse (y=-2^-x+1; x impulse; y between 0 and 1 since x >= 0)
                const volume = -Math.pow(2, -event.normalImpulse) + 1;
                audio.mutate({ ...audio.getMutator(), volume: volume });
                audio.play(true);
                //ƒ.Debug.log(volume);
            });
            // Collison group and mask
            /*rigidbody.collisionGroup = ƒ.COLLISION_GROUP.GROUP_1;
            rigidbody.collisionMask = ƒ.COLLISION_GROUP.DEFAULT | ƒ.COLLISION_GROUP.GROUP_1 | ƒ.COLLISION_GROUP.GROUP_2;*/
            // Set piece position
            const matrix = ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(x, 0, y));
            const transform = new ƒ.ComponentTransform(matrix);
            node.addComponent(transform);
            return node;
        }
        static traverseChildren(node, task) {
            if (node) {
                for (const child of node.getChildren()) {
                    task(child);
                    this.traverseChildren(child, task);
                }
            }
        }
    }
    PrimaFinal.Piece = Piece;
})(PrimaFinal || (PrimaFinal = {}));
var PrimaFinal;
(function (PrimaFinal) {
    var ƒ = FudgeCore;
    class ResourceNotLoadedError extends Error {
        constructor() {
            super("Resources not loaded! Check if load() method has been called.");
        }
    }
    PrimaFinal.ResourceNotLoadedError = ResourceNotLoadedError;
    class ResourceNotFoundError extends Error {
        constructor(resource) {
            super(`Resource "${resource}" was not found! Check if it exists in the resource file.`);
        }
    }
    PrimaFinal.ResourceNotFoundError = ResourceNotFoundError;
    class ResourceManager {
        static _instance;
        _materials;
        _graphs;
        _audios;
        _loaded;
        constructor() {
            ResourceManager._instance = this;
            this._materials = {};
            this._graphs = {};
            this._audios = {};
            this._loaded = false;
        }
        static get instance() {
            return this._instance || new ResourceManager();
        }
        static get loaded() {
            return this.instance._loaded;
        }
        static async load(file) {
            await ƒ.Project.loadResourcesFromHTML();
            const data = await (await fetch(file)).json();
            if (data) {
                for (const entry of data) {
                    switch (entry.type) {
                        case "material":
                            this.instance._materials[entry.name] = entry.resource;
                            break;
                        case "graph":
                            this.instance._graphs[entry.name] = entry.resource;
                            break;
                        case "audio":
                            this.instance._audios[entry.name] = entry.resource;
                    }
                }
                ;
                this.instance._loaded = true;
            }
        }
        static getResource(resources, name) {
            if (!this.loaded)
                throw new ResourceNotLoadedError();
            else if (resources[name])
                return ƒ.Project.resources[resources[name]];
            throw new ResourceNotFoundError(name);
        }
        static getMaterial(name) {
            return this.getResource(this.instance._materials, name);
        }
        static getGraph(name) {
            return this.getResource(this.instance._graphs, name);
        }
        static getAudio(name) {
            return this.getResource(this.instance._audios, name);
        }
    }
    PrimaFinal.ResourceManager = ResourceManager;
})(PrimaFinal || (PrimaFinal = {}));
var PrimaFinal;
(function (PrimaFinal) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(PrimaFinal); // Register the namespace to FUDGE for serialization
    class ScriptGrabTool extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(ScriptGrabTool);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "ScriptGrabTool added to ";
        _lastPiece;
        _lastNode;
        //private _animator: ƒ.ComponentAnimator;
        //private _time: number; // workaround
        grabHeight = 2.0;
        transitionTime = 1000;
        get lastNode() {
            return this._lastNode;
        }
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
        connect(piece, node) {
            /*const grabber = this.node.getChild(0);
            const joint = grabber.getChild(0).getComponent(ƒ.JointSpherical);
            joint.bodyAnchor = grabber.getComponent(ƒ.ComponentRigidbody);
            joint.bodyTied = piece.getComponent(ƒ.ComponentRigidbody);
            joint.connectNode(piece);*/
            const rigidbody = node.getComponent(ƒ.ComponentRigidbody);
            rigidbody.typeBody = ƒ.BODY_TYPE.KINEMATIC;
            /*rigidbody.collisionGroup = ƒ.COLLISION_GROUP.GROUP_2;
            rigidbody.collisionMask = ƒ.COLLISION_GROUP.DEFAULT | ƒ.COLLISION_GROUP.GROUP_1 | ƒ.COLLISION_GROUP.GROUP_2;*/
            this.node.appendChild(node);
            // Add animation
            const translationX = new ƒ.AnimationSequence();
            const translationY = new ƒ.AnimationSequence();
            const translationZ = new ƒ.AnimationSequence();
            const rotationX = new ƒ.AnimationSequence();
            const rotationY = new ƒ.AnimationSequence();
            const rotationZ = new ƒ.AnimationSequence();
            translationX.addKey(new ƒ.AnimationKey(0, node.mtxLocal.translation.x));
            translationX.addKey(new ƒ.AnimationKey(this.transitionTime, 0));
            translationY.addKey(new ƒ.AnimationKey(0, node.mtxLocal.translation.y));
            translationY.addKey(new ƒ.AnimationKey(this.transitionTime, this.grabHeight));
            translationZ.addKey(new ƒ.AnimationKey(0, node.mtxLocal.translation.z));
            translationZ.addKey(new ƒ.AnimationKey(this.transitionTime, 0));
            rotationX.addKey(new ƒ.AnimationKey(0, node.mtxLocal.rotation.x));
            rotationX.addKey(new ƒ.AnimationKey(this.transitionTime, 0));
            rotationY.addKey(new ƒ.AnimationKey(0, node.mtxLocal.rotation.y));
            rotationY.addKey(new ƒ.AnimationKey(this.transitionTime, 0));
            rotationZ.addKey(new ƒ.AnimationKey(0, node.mtxLocal.rotation.z));
            rotationZ.addKey(new ƒ.AnimationKey(this.transitionTime, 0));
            // Workaround created by trying to understand Node.applyAnimation(). 
            // I don't seem to find the true step between creating Animation Sequences and mapping them to a mutator 
            const mutatorTransform = [
                {
                    mtxLocal: {
                        translation: {
                            x: translationX,
                            y: translationY,
                            z: translationZ
                        },
                        rotation: {
                            x: rotationX,
                            y: rotationY,
                            z: rotationZ
                        }
                    }
                }
            ];
            const structure = {
                components: {
                    ComponentTransform: [
                        mutatorTransform
                    ]
                }
            };
            const animation = new ƒ.Animation("Transition", structure);
            let oldAnimator = node.getComponent(ƒ.ComponentAnimator);
            if (oldAnimator) {
                node.removeComponent(oldAnimator);
            }
            const animator = new ƒ.ComponentAnimator(animation, ƒ.ANIMATION_PLAYMODE.PLAYONCE, ƒ.ANIMATION_PLAYBACK.TIMEBASED_RASTERED_TO_FPS);
            node.addComponent(animator);
            this._lastPiece = piece;
            this._lastNode = node;
        }
        disconnect(velocity) {
            /*const joint = this.node.getChild(0).getComponent(ƒ.JointSpherical)
            joint.disconnect();*/
            this._lastPiece.appendChild(this._lastNode);
            let coord = this.node.mtxLocal.translation.clone;
            coord.add(this.node.getParent().mtxLocal.translation);
            this._lastPiece.mtxLocal.translation = coord;
            const rigidbody = this._lastNode.getComponent(ƒ.ComponentRigidbody);
            rigidbody.typeBody = ƒ.BODY_TYPE.DYNAMIC;
            rigidbody.applyForce(ƒ.Vector3.SCALE(velocity, 50));
            //rigidbody.collisionGroup = ƒ.COLLISION_GROUP.GROUP_1;
            this._lastNode = null;
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
    }
    PrimaFinal.ScriptGrabTool = ScriptGrabTool;
})(PrimaFinal || (PrimaFinal = {}));
var PrimaFinal;
(function (PrimaFinal) {
    var ƒ = FudgeCore;
    var ƒUI = FudgeUserInterface;
    class UserInterface extends ƒ.Mutable {
        static _instance;
        static _controller;
        static _element;
        static _interactives;
        time;
        side;
        tRot;
        static get instance() {
            return this._instance || new UserInterface();
        }
        static get controller() {
            return this._controller;
        }
        static set time(time) {
            this.instance.time = this.instance.formatTime(time);
        }
        static set side(side) {
            this.instance.side = side;
        }
        constructor() {
            super();
            UserInterface._instance = this;
            UserInterface._controller = new ƒUI.Controller(this, UserInterface._element);
            this.time = this.formatTime(0);
            this.side = PrimaFinal.Side.Light;
            this.tRot = 0;
        }
        static load() {
            this._element = this.buildUserInterface();
        }
        static registerEvents() {
            this._interactives.buttonSide.addEventListener("click", () => {
                PrimaFinal.GameLogic.toggleSide();
                this.side = PrimaFinal.GameLogic.side;
            });
            const coatLight = PrimaFinal.ResourceManager.getMaterial("PieceLight").coat;
            const coatDark = PrimaFinal.ResourceManager.getMaterial("PieceDark").coat;
            const mutatorLight = coatLight.getMutator();
            const mutatorDark = coatDark.getMutator();
            this._interactives.inputColorLight.value = PrimaFinal.HTMLBuilder.rgba2hex(mutatorLight.color);
            this._interactives.inputColorDark.value = PrimaFinal.HTMLBuilder.rgba2hex(mutatorDark.color);
            this._interactives.inputColorLight.addEventListener("keypress", event => {
                this.applyColor(event, coatLight, mutatorLight, this._interactives.inputColorLight.value);
            });
            this._interactives.inputColorDark.addEventListener("keypress", event => {
                this.applyColor(event, coatDark, mutatorDark, this._interactives.inputColorDark.value);
            });
            this._interactives.buttonReset.addEventListener("click", async () => {
                PrimaFinal.GameLogic.reset();
            });
        }
        static validateColor(input) {
            return /#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?/.test(input);
        }
        static applyColor(event, coat, mutator, value) {
            if (event.key === "Enter" && this.validateColor(value)) {
                const color = PrimaFinal.HTMLBuilder.hex2rgba(value);
                mutator.color = color.getMutator();
                coat.mutate(mutator);
                console.log("Applying", color);
            }
        }
        static buildUserInterface() {
            this._interactives = {
                buttonSide: PrimaFinal.HTMLBuilder.button({ id: "side" }, [new Text("Change Side")]),
                inputColorLight: PrimaFinal.HTMLBuilder.input({ type: "text", id: "colLight" }),
                inputColorDark: PrimaFinal.HTMLBuilder.input({ type: "text", id: "colDark" }),
                buttonReset: PrimaFinal.HTMLBuilder.button({ id: "reset" }, [new Text("Reset Board")])
            };
            const div = PrimaFinal.HTMLBuilder.div({ id: "ui" }, [
                new Text("Playing Time:"),
                PrimaFinal.HTMLBuilder.input({ type: "text", key: "time" }),
                new Text("Side:"),
                PrimaFinal.HTMLBuilder.input({ type: "text", key: "side" }),
                this._interactives.buttonSide,
                new Text("Color Light Pieces:"),
                this._interactives.inputColorLight,
                new Text("Color Dark Pieces:"),
                this._interactives.inputColorDark,
                this._interactives.buttonReset,
                new Text("Mit Linksklick Figur anheben und bewegen. Zum Loslassen der Figur, die Maustaste wieder loslassen.")
            ]);
            document.body.appendChild(div);
            return div;
        }
        formatTime(time) {
            const total = time / 1000;
            const minutes = (Math.floor(total / 60) + "").padStart(2, "0");
            const seconds = (Math.floor(total % 60) + "").padStart(2, "0");
            return `${minutes}:${seconds}`;
        }
        reduceMutator(_mutator) { }
    }
    PrimaFinal.UserInterface = UserInterface;
})(PrimaFinal || (PrimaFinal = {}));
var PrimaFinal;
(function (PrimaFinal) {
    var ƒ = FudgeCore;
    class HTMLBuilder {
        static element(tag, attributes, children = []) {
            const element = document.createElement(tag);
            for (const attribute in attributes) {
                element.setAttribute(attribute, attributes[attribute]);
            }
            for (const child of children) {
                element.appendChild(child);
            }
            return element;
        }
        static div(attributes, children = []) {
            return this.element("div", attributes, children);
        }
        static input(attributes) {
            return this.element("input", attributes);
        }
        static button(attributes, children = []) {
            return this.element("button", attributes, children);
        }
        static rgba2hex(color) {
            const components = [Math.round(color.r * 255), Math.round(color.g * 255), Math.round(color.b * 255), Math.round(color.a * 255)];
            let hex = "#";
            for (const component of components) {
                hex += component.toString(16).padStart(2, "0");
            }
            return hex;
        }
        static hex2rgba(hex) {
            if (hex.length == 7) {
                hex += "FF";
            }
            const components = [];
            for (let i = 1; i < hex.length; i += 2) {
                components.push(parseInt(hex.substring(i, i + 2), 16) / 255.0);
            }
            return new ƒ.Color(components[0], components[1], components[2], components[3]);
        }
    }
    PrimaFinal.HTMLBuilder = HTMLBuilder;
    class Random {
        static element(array) {
            return array[Math.floor(Math.random() * array.length)];
        }
        static number(min, max) {
            return (max - min) * Math.random() + min;
        }
    }
    PrimaFinal.Random = Random;
    class Limit {
        _lower;
        _upper;
        get lower() {
            return this._lower;
        }
        get upper() {
            return this._upper;
        }
        get range() {
            return Math.abs(this._upper - this._lower);
        }
        constructor(lower = 0, upper = 1) {
            this._lower = lower;
            this._upper = upper;
        }
    }
    PrimaFinal.Limit = Limit;
    class Parameter {
        _value;
        _limit;
        get value() {
            return this._value;
        }
        constructor(value = 0, limit = new Limit()) {
            this._value = value;
            this._limit = limit;
        }
        change(by) {
            if (this._value + by < this._limit.lower) {
                this._value = this._limit.lower;
            }
            else if (this._value + by > this._limit.upper) {
                this._value = this._limit.upper;
            }
            else {
                this._value += by;
            }
        }
        changeCyclic(by) {
            this._value = this.reduce(this._value + by);
        }
        reduce(x) {
            if (x > this._limit.upper) {
                while (x > this._limit.upper) {
                    x -= this._limit.range;
                }
            }
            else if (x < this._limit.lower) {
                while (x < this._limit.lower) {
                    x += this._limit.range;
                }
            }
            return x;
        }
    }
    PrimaFinal.Parameter = Parameter;
})(PrimaFinal || (PrimaFinal = {}));
//# sourceMappingURL=Script.js.map