import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./buttonGroupTest.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
class ButtonGroupTest extends LightningElement {
  constructor(...args) {
    super(...args);
    this.buttons = [];
    this.buttonStatefuls = [];
    this.buttonIcons = [];
    this.buttonIconStatefuls = [];
    this.buttonMenus = [];
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(ButtonGroupTest, {
  publicProps: {
    buttons: {
      config: 0
    },
    buttonStatefuls: {
      config: 0
    },
    buttonIcons: {
      config: 0
    },
    buttonIconStatefuls: {
      config: 0
    },
    buttonMenus: {
      config: 0
    }
  }
});
const __lwc_component_class_internal = _registerComponent(ButtonGroupTest, {
  tmpl: _tmpl,
  sel: "lightningtest-button-group-test",
  apiVersion: 66
});
export default __lwc_component_class_internal;