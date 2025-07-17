const keys = {};
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup',   e => keys[e.code] = false);

export const Input = {
  get frame() {
    return {
      forward:     keys['KeyW'] || false,
      backward:    keys['KeyS'] || false,
      left:        keys['KeyA'] || false,
      right:       keys['KeyD'] || false,
      yaw:         (keys['KeyE'] ? 1 : 0) - (keys['KeyQ'] ? 1 : 0),
      pitchUp:     keys['ArrowUp']   || false,
      pitchDown:   keys['ArrowDown'] || false,
      throttleUp:  keys['Space'],
      throttleDown: keys['ShiftLeft'] || keys['ShiftRight']
    };
  }
};