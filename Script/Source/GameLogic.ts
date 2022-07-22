namespace PrimaFinal {
    import ƒ = FudgeCore;

    export class GameLogic {
        private static _instance: GameLogic;
        private _board: ƒ.Node;
        private _pieces: Piece[];
        private _side: Side;
        private _time: number;

        private static get instance(): GameLogic {
            return this._instance || new GameLogic();
        }

        public static get board(): ƒ.Node {
            return this.instance._board;
        }

        public static get pieces(): Piece[] {
            return this.instance._pieces;
        }

        public static get side(): Side {
            return this.instance._side;
        }

        public static get time(): number {
            return this.instance._time;
        }

        public static set timeDelta(timeDelta: number) {
            this.instance._time += timeDelta;
        }

        private constructor() {
            GameLogic._instance = this;
            this._board = null;
            this._pieces = [];
            this._side = Side.Light;
            this._time = 0;
        }

        public static toggleSide(): void {
            this.instance._side = this.instance._side == Side.Light ? Side.Dark : Side.Light;
        }

        private static addPiece(piece: Piece): void {
            this.instance._pieces.push(piece);
            this.instance._board.addChild(piece);
        }

        public static removePiece(piece: Piece): void {
            if (this.instance._board) {
                this.instance._pieces = this.instance._pieces.filter(x => x != piece);
                this.instance._board.removeChild(piece);
            }
        }

        public static removeAllPieces(): void {
            for (const piece of this.instance._pieces) {
                this.removePiece(piece);
            }
        }

        public static async reset(): Promise<void> {
            this.removeAllPieces();
            await this.initPieces();
            this.instance._side = Side.Light;
            this.instance._time = 0;
        }

        public static async init(board: ƒ.Node): Promise<void> {
            this.instance._board = board;
            /*const rigidbody = this.board.getComponent(ƒ.ComponentRigidbody);
            rigidbody.collisionGroup = ƒ.COLLISION_GROUP.GROUP_1;
            rigidbody.collisionMask = ƒ.COLLISION_GROUP.DEFAULT | ƒ.COLLISION_GROUP.GROUP_1 | ƒ.COLLISION_GROUP.GROUP_2;*/
            await this.initPieces();
        }

        public static async initPieces(): Promise<void> {
            if (this.instance._board) {
                for (let i = 0; i < 8; i++) {
                    this.addPiece(await Piece.createPiece(Type.Pawn, Side.Light, i, 1));
                    this.addPiece(await Piece.createPiece(Type.Pawn, Side.Dark, i, 6));
                    switch (i) {
                        case 0:
                        case 7:
                            this.addPiece(await Piece.createPiece(Type.Rook, Side.Light, i, 0));
                            this.addPiece(await Piece.createPiece(Type.Rook, Side.Dark, i, 7));
                            break;
                        case 1:
                        case 6:
                            this.addPiece(await Piece.createPiece(Type.Knight, Side.Light, i, 0));
                            this.addPiece(await Piece.createPiece(Type.Knight, Side.Dark, i, 7));
                            break;
                        case 2:
                        case 5:
                            this.addPiece(await Piece.createPiece(Type.Bishop, Side.Light, i, 0));
                            this.addPiece(await Piece.createPiece(Type.Bishop, Side.Dark, i, 7));
                            break;
                        case 3:
                            this.addPiece(await Piece.createPiece(Type.King, Side.Light, i, 0));
                            this.addPiece(await Piece.createPiece(Type.Queen, Side.Dark, i, 7));
                            break;
                        case 4:
                            this.addPiece(await Piece.createPiece(Type.Queen, Side.Light, i, 0));
                            this.addPiece(await Piece.createPiece(Type.King, Side.Dark, i, 7));
                            break;
                    }
                }
            }
        }
    }
}