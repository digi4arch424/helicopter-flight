import { Input } from '../systems/Input.js';

export class Helicopter {
  constructor(model, camera, scene) {
    this.scene  = scene;
    this.mesh   = model;
    this.camera = camera;

    // physics state
    this.velocity      = new THREE.Vector3();
    this.angularVel    = new THREE.Euler();
    this.throttle      = 0; // 0–1
    this.maxSpeed      = 12;
    this.accel         = 20;

    // attach to scene
    scene.add(this.mesh);

    // chase-camera pivot
    this.cameraPivot = new THREE.Object3D();
    this.cameraPivot.position.set(0, 1.5, -5); // offset behind heli
    this.mesh.add(this.cameraPivot);
    this.cameraPivot.add(this.camera);
  }

  update(dt) {
    const input = Input.frame;

    // throttle
    if (input.throttleUp)   this.throttle = Math.min(1, this.throttle + dt * 2);
    if (input.throttleDown) this.throttle = Math.max(0, this.throttle - dt * 2);

    // desired direction
    const dir = new THREE.Vector3();
    if (input.forward)  dir.z += 1;
    if (input.backward) dir.z -= 1;
    if (input.left)     dir.x -= 1;
    if (input.right)    dir.x += 1;
    dir.normalize().applyQuaternion(this.mesh.quaternion);

    // lift
    const lift = new THREE.Vector3(0, this.throttle * 9.81 * 2, 0);

    // apply forces
    this.velocity.addScaledVector(dir, this.accel * dt);
    this.velocity.addScaledVector(lift, dt);
    this.velocity.multiplyScalar(0.98); // drag
    this.velocity.clampLength(0, this.maxSpeed);

    // yaw
    this.mesh.rotateY(input.yaw * dt * 2);

    // move
    this.mesh.position.addScaledVector(this.velocity, dt);
  }
}