import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./mockTileHolder.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
class MockTileHolder extends LightningElement {
  constructor(...args) {
    super(...args);
    this.mediaSlotText = void 0;
    this.contentSlotText = void 0;
    this.tileType = 'standard';
  }
  get isMedia() {
    return this.tileType !== 'standard';
  }
  get isStandard() {
    return this.tileType === 'standard';
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(MockTileHolder, {
  publicProps: {
    mediaSlotText: {
      config: 0
    },
    contentSlotText: {
      config: 0
    },
    tileType: {
      config: 0
    }
  }
});
const __lwc_component_class_internal = _registerComponent(MockTileHolder, {
  tmpl: _tmpl,
  sel: "lightningtest-mock-tile-holder",
  apiVersion: 66
});
export default __lwc_component_class_internal;