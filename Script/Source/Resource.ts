namespace PrimaFinal {
    import ƒ = FudgeCore;
    
    interface ResourceEntry {
        type: string,
        name: string,
        resource: string
    }

    export class ResourceNotLoadedError extends Error {
        public constructor() {
            super("Resources not loaded! Check if load() method has been called.");
        }
    }

    export class ResourceNotFoundError extends Error {
        public constructor(resource: string) {
            super(`Resource "${resource}" was not found! Check if it exists in the resource file.`);
        }
    }

    export class ResourceManager {
        private static _instance: ResourceManager;
        private _materials: KeyList<string>;
        private _graphs: KeyList<string>;
        private _audios: KeyList<string>;
        private _loaded: boolean;

        private constructor() {
            ResourceManager._instance = this;
            this._materials = {};
            this._graphs = {};
            this._audios = {};
            this._loaded = false;
        }

        private static get instance(): ResourceManager {
            return this._instance || new ResourceManager();
        }

        public static get loaded(): boolean {
            return this.instance._loaded;
        }

        public static async load(file: string) {
            await ƒ.Project.loadResourcesFromHTML();
            const data: ResourceEntry[] = await (await fetch(file)).json();
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
                };
                this.instance._loaded = true;
            }
        }

        private static getResource<T extends ƒ.SerializableResource>(resources: KeyList<string>, name: string) {
            if (!this.loaded) throw new ResourceNotLoadedError();
            else if (resources[name])
                return <T>ƒ.Project.resources[resources[name]];
            throw new ResourceNotFoundError(name);
        }

        public static getMaterial(name: string): ƒ.Material {
            return this.getResource(this.instance._materials, name);
        }

        public static getGraph(name: string): ƒ.Graph {
            return this.getResource(this.instance._graphs, name);
        }

        public static getAudio(name: string): ƒ.Audio {
            return this.getResource(this.instance._audios, name);
        }
    }
}