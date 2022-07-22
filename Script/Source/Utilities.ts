namespace PrimaFinal {
    import ƒ = FudgeCore;

    export type VoidFunction = () => void;

    export interface KeyList<T> {
        [index: string]: T;
    }

    export class HTMLBuilder {
        public static element<T extends HTMLElement>(tag: keyof HTMLElementTagNameMap, attributes: KeyList<string>, children: Node[] = []): T {
            const element = document.createElement(tag) as T;
            for (const attribute in attributes) {
                element.setAttribute(attribute, attributes[attribute]);
            }
            for (const child of children) {
                element.appendChild(child);
            }
            return element;
        }

        public static div(attributes: KeyList<string>, children: Node[] = []): HTMLDivElement {
            return this.element("div", attributes, children);
        }

        public static input(attributes: KeyList<string>): HTMLInputElement {
            return this.element("input", attributes);
        }

        public static button(attributes: KeyList<string>, children: Node[] = []): HTMLButtonElement {
            return this.element("button", attributes, children);
        }

        public static rgba2hex(color: ƒ.Color): string {
            const components = [Math.round(color.r * 255), Math.round(color.g * 255), Math.round(color.b * 255), Math.round(color.a * 255)];
            let hex = "#";
            for (const component of components) {
                hex += component.toString(16).padStart(2, "0");
            }
            return hex;
        }

        public static hex2rgba(hex: string): ƒ.Color {
            if (hex.length == 7) {
                hex += "FF";
            }
            const components = [];
            for (let i: number = 1; i < hex.length; i += 2) {
                components.push(parseInt(hex.substring(i, i + 2), 16) / 255.0);
            }
            return new ƒ.Color(components[0], components[1], components[2], components[3]);
        }
    }

    export class Random {
        public static element<T>(array: T[]): T {
            return array[Math.floor(Math.random() * array.length)];
        }

        public static number(min: number, max: number): number {
            return (max - min) * Math.random() + min;
        }
    }

    export class Limit {
        private _lower: number;
        private _upper: number;

        public get lower(): number {
            return this._lower;
        }

        public get upper(): number {
            return this._upper;
        }

        public get range(): number {
            return Math.abs(this._upper - this._lower);
        }

        public constructor(lower: number = 0, upper: number = 1) {
            this._lower = lower;
            this._upper = upper;
        }
    }

    export class Parameter {
        private _value: number;
        private _limit: Limit;

        public get value(): number {
            return this._value;
        }

        public constructor(value: number = 0, limit: Limit = new Limit()) {
            this._value = value;
            this._limit = limit;
        }

        public change(by: number): void {
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

        public changeCyclic(by: number): void {
            this._value = this.reduce(this._value + by);
        }

        private reduce(x: number) {
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
}