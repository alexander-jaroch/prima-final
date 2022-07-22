declare namespace PrimaFinal {
    import ƒ = FudgeCore;
    class GameLogic {
        private static _instance;
        private _board;
        private _pieces;
        private _side;
        private _time;
        private static get instance();
        static get board(): ƒ.Node;
        static get pieces(): Piece[];
        static get side(): Side;
        static get time(): number;
        static set timeDelta(timeDelta: number);
        private constructor();
        static toggleSide(): void;
        private static addPiece;
        static removePiece(piece: Piece): void;
        static removeAllPieces(): void;
        static reset(): Promise<void>;
        static init(board: ƒ.Node): Promise<void>;
        static initPieces(): Promise<void>;
    }
}
declare namespace PrimaFinal {
}
declare namespace PrimaFinal {
    import ƒ = FudgeCore;
    enum Side {
        Light = "Light",
        Dark = "Dark"
    }
    enum Type {
        Pawn = "Pawn",
        Knight = "Knight",
        Bishop = "Bishop",
        Rook = "Rook",
        Queen = "Queen",
        King = "King"
    }
    class Piece extends ƒ.Node {
        private _x;
        private _y;
        private _side;
        private _type;
        get x(): number;
        get y(): number;
        get side(): Side;
        get type(): Type;
        constructor(type: Type, side: Side, x: number, y: number);
        static createPiece(type: Type, side: Side, x?: number, y?: number): Promise<Piece>;
        private static traverseChildren;
    }
}
declare namespace PrimaFinal {
    import ƒ = FudgeCore;
    class ResourceNotLoadedError extends Error {
        constructor();
    }
    class ResourceNotFoundError extends Error {
        constructor(resource: string);
    }
    class ResourceManager {
        private static _instance;
        private _materials;
        private _graphs;
        private _audios;
        private _loaded;
        private constructor();
        private static get instance();
        static get loaded(): boolean;
        static load(file: string): Promise<void>;
        private static getResource;
        static getMaterial(name: string): ƒ.Material;
        static getGraph(name: string): ƒ.Graph;
        static getAudio(name: string): ƒ.Audio;
    }
}
declare namespace PrimaFinal {
    import ƒ = FudgeCore;
    class ScriptGrabTool extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        private _lastPiece;
        private _lastNode;
        grabHeight: number;
        transitionTime: number;
        get lastNode(): ƒ.Node;
        constructor();
        connect(piece: Piece, node: ƒ.Node): void;
        disconnect(velocity: ƒ.Vector3): void;
        hndEvent: (_event: Event) => void;
    }
}
declare namespace PrimaFinal {
    import ƒ = FudgeCore;
    import ƒUI = FudgeUserInterface;
    class UserInterface extends ƒ.Mutable {
        private static _instance;
        private static _controller;
        private static _element;
        private static _interactives;
        time: string;
        side: Side;
        tRot: number;
        private static get instance();
        static get controller(): ƒUI.Controller;
        static set time(time: number);
        static set side(side: Side);
        constructor();
        static load(): void;
        static registerEvents(): void;
        private static validateColor;
        private static applyColor;
        private static buildUserInterface;
        private formatTime;
        protected reduceMutator(_mutator: ƒ.Mutator): void;
    }
}
declare namespace PrimaFinal {
    import ƒ = FudgeCore;
    type VoidFunction = () => void;
    interface KeyList<T> {
        [index: string]: T;
    }
    class HTMLBuilder {
        static element<T extends HTMLElement>(tag: keyof HTMLElementTagNameMap, attributes: KeyList<string>, children?: Node[]): T;
        static div(attributes: KeyList<string>, children?: Node[]): HTMLDivElement;
        static input(attributes: KeyList<string>): HTMLInputElement;
        static button(attributes: KeyList<string>, children?: Node[]): HTMLButtonElement;
        static rgba2hex(color: ƒ.Color): string;
        static hex2rgba(hex: string): ƒ.Color;
    }
    class Random {
        static element<T>(array: T[]): T;
        static number(min: number, max: number): number;
    }
    class Limit {
        private _lower;
        private _upper;
        get lower(): number;
        get upper(): number;
        get range(): number;
        constructor(lower?: number, upper?: number);
    }
    class Parameter {
        private _value;
        private _limit;
        get value(): number;
        constructor(value?: number, limit?: Limit);
        change(by: number): void;
        changeCyclic(by: number): void;
        private reduce;
    }
}
