import React from "react";
import { render } from "react-dom";

import request from "browser-request";
import Bms2js from "@bokuweb/bms2js";
import Bms from "./bms";

request("./bms/AVALON/01_avalon[light7].bme", (err, res) => {
  if (!err) {
    const config = {
      highSpeed: 1,
      timingAdjustment: -8,
      isAutoPlay: false,
      key: [0, 1, 2, 3, 4, 5, 6, 7]
    };
    const bms2js = new Bms2js(config);
    const bms_json = bms2js.parse(res.body);
    render(
      <Bms config={config} score={bms_json} />,
      document.getElementById("main")
    );

    //m.mount(document.getElementById("main"), bms);
  } else {
    throw err;
  }
});
