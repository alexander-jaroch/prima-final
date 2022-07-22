namespace PrimaFinal {
    import ƒ = FudgeCore;
    import ƒUI = FudgeUserInterface;

    // "Register" interactive UI Elemente
    interface InteractiveUIElements {
        buttonSide: HTMLButtonElement;
        inputColorLight: HTMLInputElement;
        inputColorDark: HTMLInputElement;
        buttonReset: HTMLButtonElement;
    }

    export class UserInterface extends ƒ.Mutable {
        private static _instance: UserInterface;
        private static _controller: ƒUI.Controller;
        private static _element: HTMLDivElement;
        private static _interactives: InteractiveUIElements;
        public time: string;
        public side: Side;
        public tRot: number;

        private static get instance(): UserInterface {
            return this._instance || new UserInterface();
        }

        public static get controller(): ƒUI.Controller {
            return this._controller;
        }

        public static set time(time: number) {
            this.instance.time = this.instance.formatTime(time);
        }

        public static set side(side: Side) {
            this.instance.side = side;
        }

        public constructor() {
            super();
            UserInterface._instance = this;
            UserInterface._controller = new ƒUI.Controller(this, UserInterface._element);
            this.time = this.formatTime(0);
            this.side = Side.Light;
            this.tRot = 0;
        }

        public static load(): void {
            this._element = this.buildUserInterface();
        }

        public static registerEvents(): void {
            this._interactives.buttonSide.addEventListener("click", () => {
                GameLogic.toggleSide();
                this.side = GameLogic.side;
            });

            const coatLight: ƒ.Coat = ResourceManager.getMaterial("PieceLight").coat;
            const coatDark: ƒ.Coat = ResourceManager.getMaterial("PieceDark").coat;
            const mutatorLight: ƒ.Mutator = coatLight.getMutator();
            const mutatorDark: ƒ.Mutator = coatDark.getMutator();

            this._interactives.inputColorLight.value = HTMLBuilder.rgba2hex(mutatorLight.color);
            this._interactives.inputColorDark.value = HTMLBuilder.rgba2hex(mutatorDark.color);

            this._interactives.inputColorLight.addEventListener("keypress", event => {
                this.applyColor(event, coatLight, mutatorLight, this._interactives.inputColorLight.value);
            });
            this._interactives.inputColorDark.addEventListener("keypress", event => {
                this.applyColor(event, coatDark, mutatorDark, this._interactives.inputColorDark.value);
            });

            this._interactives.buttonReset.addEventListener("click", async () => {
                GameLogic.reset();
            });
        }

        private static validateColor(input: string): boolean {
            return /#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?/.test(input);
        }

        private static applyColor(event: KeyboardEvent, coat: ƒ.Coat, mutator: ƒ.Mutator, value: string): void {
            if (event.key === "Enter" && this.validateColor(value)) {
                const color: ƒ.Color = HTMLBuilder.hex2rgba(value);
                mutator.color = color.getMutator();
                coat.mutate(mutator);
                console.log("Applying", color);
            }
        }

        private static buildUserInterface(): HTMLDivElement {
            this._interactives = {
                buttonSide: HTMLBuilder.button({ id: "side" }, [new Text("Change Side")]),
                inputColorLight: HTMLBuilder.input({ type: "text", id: "colLight" }),
                inputColorDark: HTMLBuilder.input({ type: "text", id: "colDark" }),
                buttonReset: HTMLBuilder.button({ id: "reset" }, [new Text("Reset Board")])
            }
            const div: HTMLDivElement = HTMLBuilder.div({ id: "ui" }, [
                new Text("Playing Time:"),
                HTMLBuilder.input({ type: "text", key: "time" }),
                new Text("Side:"),
                HTMLBuilder.input({ type: "text", key: "side" }),
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

        private formatTime(time: number): string {
            const total: number = time / 1000;
            const minutes: string = (Math.floor(total / 60) + "").padStart(2, "0");
            const seconds: string = (Math.floor(total % 60) + "").padStart(2, "0");
            return `${minutes}:${seconds}`;
        }

        protected reduceMutator(_mutator: ƒ.Mutator): void { /* */ }
    }
}