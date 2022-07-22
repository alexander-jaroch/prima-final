namespace PrimaFinal {
  import ƒ = FudgeCore;

  ƒ.Project.registerScriptNamespace(PrimaFinal);  // Register the namespace to FUDGE for serialization

  export class ScriptGrabTool extends ƒ.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(ScriptGrabTool);
    // Properties may be mutated by users in the editor via the automatically created user interface
    public message: string = "ScriptGrabTool added to ";

    private _lastPiece: Piece;
    private _lastNode: ƒ.Node;
    //private _animator: ƒ.ComponentAnimator;
    //private _time: number; // workaround

    public grabHeight: number = 2.0;
    public transitionTime: number = 1000;

    public get lastNode(): ƒ.Node {
      return this._lastNode;
    }

    constructor() {
      super();

      // Don't start when running in editor
      if (ƒ.Project.mode == ƒ.MODE.EDITOR)
        return;

      // Listen to this component being added to or removed from a node
      this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
      this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.hndEvent);
    }

    public connect(piece: Piece, node: ƒ.Node): void {
      /*const grabber = this.node.getChild(0);
      const joint = grabber.getChild(0).getComponent(ƒ.JointSpherical);
      joint.bodyAnchor = grabber.getComponent(ƒ.ComponentRigidbody);
      joint.bodyTied = piece.getComponent(ƒ.ComponentRigidbody);
      joint.connectNode(piece);*/

      const rigidbody: ƒ.ComponentRigidbody = node.getComponent(ƒ.ComponentRigidbody);
      rigidbody.typeBody = ƒ.BODY_TYPE.KINEMATIC;
      /*rigidbody.collisionGroup = ƒ.COLLISION_GROUP.GROUP_2;
      rigidbody.collisionMask = ƒ.COLLISION_GROUP.DEFAULT | ƒ.COLLISION_GROUP.GROUP_1 | ƒ.COLLISION_GROUP.GROUP_2;*/
      this.node.appendChild(node);

      // Add animation
      const translationX: ƒ.AnimationSequence = new ƒ.AnimationSequence();
      const translationY: ƒ.AnimationSequence = new ƒ.AnimationSequence();
      const translationZ: ƒ.AnimationSequence = new ƒ.AnimationSequence();
      const rotationX: ƒ.AnimationSequence = new ƒ.AnimationSequence();
      const rotationY: ƒ.AnimationSequence = new ƒ.AnimationSequence();
      const rotationZ: ƒ.AnimationSequence = new ƒ.AnimationSequence();
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
      const mutatorTransform: ƒ.Mutator = [
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

      const structure: ƒ.AnimationStructure = {
        components: {
          ComponentTransform: [
            mutatorTransform
          ]
        }
      };

      const animation: ƒ.Animation = new ƒ.Animation("Transition", structure);
      let oldAnimator = node.getComponent(ƒ.ComponentAnimator);
      if (oldAnimator) {
        node.removeComponent(oldAnimator);
      }
      const animator: ƒ.ComponentAnimator = new ƒ.ComponentAnimator(animation, ƒ.ANIMATION_PLAYMODE.PLAYONCE, ƒ.ANIMATION_PLAYBACK.TIMEBASED_RASTERED_TO_FPS);
      node.addComponent(animator);

      this._lastPiece = piece;
      this._lastNode = node;
    }

    public disconnect(velocity: ƒ.Vector3): void {
      /*const joint = this.node.getChild(0).getComponent(ƒ.JointSpherical)
      joint.disconnect();*/

      this._lastPiece.appendChild(this._lastNode);
      let coord: ƒ.Vector3 = this.node.mtxLocal.translation.clone;
      coord.add(this.node.getParent().mtxLocal.translation);
      this._lastPiece.mtxLocal.translation = coord;
      const rigidbody: ƒ.ComponentRigidbody = this._lastNode.getComponent(ƒ.ComponentRigidbody);
      rigidbody.typeBody = ƒ.BODY_TYPE.DYNAMIC;
      rigidbody.applyForce(ƒ.Vector3.SCALE(velocity, 50));
      //rigidbody.collisionGroup = ƒ.COLLISION_GROUP.GROUP_1;
      this._lastNode = null;
    }

    // Activate the functions of this component as response to events
    public hndEvent = (_event: Event): void => {
      switch (_event.type) {
        case ƒ.EVENT.COMPONENT_ADD:
          ƒ.Debug.log(this.message, this.node);
          break;
        case ƒ.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
        case ƒ.EVENT.NODE_DESERIALIZED:
          // if deserialized the node is now fully reconstructed and access to all its components and children is possible
          break;
      }
    }
    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}