namespace PrimaFinal {
    import ƒ = FudgeCore;

    export enum Side {
        Light = "Light",
        Dark = "Dark"
    }

    export enum Type {
        Pawn = "Pawn",
        Knight = "Knight",
        Bishop = "Bishop",
        Rook = "Rook",
        Queen = "Queen",
        King = "King"
    }

    export class Piece extends ƒ.Node {
        private _x: number;
        private _y: number;
        private _side: Side;
        private _type: Type;

        public get x(): number {
            return this._x;
        }

        public get y(): number {
            return this._y;
        }

        public get side(): Side {
            return this._side;
        }

        public get type(): Type {
            return this._type;
        }

        public constructor(type: Type, side: Side, x: number, y: number) {
            super(`${type}${side}(${x}|${y})`);
            this._x = x;
            this._y = y;
            this._side = side;
            this._type = type;
        }

        public static async createPiece(type: Type, side: Side, x: number = 0, y: number = 0): Promise<Piece> {
            const node: Piece = new Piece(type, side, x, y);
            const piece: ƒ.GraphInstance = await ƒ.Project.createGraphInstance(ResourceManager.getGraph(type));
            piece.mtxLocal.translation = ƒ.Vector3.ZERO(); // reset local y
            node.addChild(piece);

            const material: ƒ.Material = ResourceManager.getMaterial("Piece" + side);
            this.traverseChildren(piece, child => {
                child.getComponent(ƒ.ComponentMaterial).material = material;
            });

            // Append audio
            const audio: ƒ.ComponentAudio = new ƒ.ComponentAudio(ResourceManager.getAudio("Drop" + Random.element(["06", "07", "08"])));
            node.addComponent(audio);

            // Play sound on collision 
            const rigidbody: ƒ.ComponentRigidbody = piece.getComponent(ƒ.ComponentRigidbody);
            rigidbody.addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, (event: ƒ.EventPhysics) => {
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
            const matrix: ƒ.Matrix4x4 = ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(x, 0, y));
            const transform: ƒ.ComponentTransform = new ƒ.ComponentTransform(matrix);
            node.addComponent(transform);

            return node;
        }

        private static traverseChildren(node: ƒ.Node, task: (child: ƒ.Node) => void): void {
            if (node) {
                for (const child of node.getChildren()) {
                    task(child);
                    this.traverseChildren(child, task);
                }
            }
        }
    }
}