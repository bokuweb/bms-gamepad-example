import events from "events";
const eventEmitter = new events.EventEmitter();

let gamepads = {};
const keys = [90, 83, 88, 68, 67, 70, 86, 16];
export function configureKeyEvent(keyConfigs) {
  for (let config of keyConfigs) {
    eventEmitter.on(`key-${config.key}`, d => {
      config.listener(d);
    });
  }

  document.addEventListener("keydown", event => {
    const index = keys.findIndex(k => k === event.keyCode);
    if (index === -1) return;
    eventEmitter.emit(`key-${index}`);
  });

  window.addEventListener(
    "gamepadconnected",
    function(e) {
      gamepadHandler(e, true);
    },
    false
  );

  window.addEventListener(
    "gamepaddisconnected",
    function(e) {
      gamepadHandler(e, false);
    },
    false
  );

  const interval = setInterval(pollGamepads, 10);
}

function gamepadHandler(event, connecting) {
  let gamepad = event.gamepad;
  // Note:
  // gamepad === navigator.getGamepads()[gamepad.index]

  if (connecting) {
    gamepads[gamepad.index] = gamepad;
  } else {
    delete gamepads[gamepad.index];
  }
}

const prev = [];
let prevScratch = null;

function pollGamepads() {
  let gamepads = navigator.getGamepads
    ? navigator.getGamepads()
    : navigator.webkitGetGamepads
    ? navigator.webkitGetGamepads
    : [];
  for (let i = 0; i < gamepads.length; i++) {
    let gp = gamepads[i];
    if (gp) {
      for (let i = 0; i < gp.buttons.length; i++) {
        const p = prev[i];
        prev[i] = gp.buttons[i].value;
        if (p) {
          continue;
        }

        if (gp.buttons[i].value) {
          eventEmitter.emit(`key-${i}`);
        }
      }
      if (prevScratch !== null && prevScratch !== gp.axes[0]) {
        eventEmitter.emit(`key-${7}`);
      }
      prevScratch = gp.axes[0];
    }
  }
}
