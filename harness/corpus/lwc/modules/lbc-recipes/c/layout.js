import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./layout.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
import { normalizeParam, computeLayoutClass, HORIZONTAL_ALIGN, VERTICAL_ALIGN, BOUNDARY } from './styleUtils';
import { normalizeBoolean } from 'c/utilsPrivate';
class cLayout extends LightningElement {
  constructor(...args) {
    super(...args);
    this._horizontalAlign = void 0;
    this._verticalAlign = void 0;
    this._pullToBoundary = void 0;
    this._multipleRows = void 0;
    this._layoutClass = [];
  }
  get horizontalAlign() {
    return this._horizontalAlign;
  }
  set horizontalAlign(value) {
    this._horizontalAlign = normalizeParam(value, HORIZONTAL_ALIGN);
    this.updateClassList();
  }
  get verticalAlign() {
    return this._verticalAlign;
  }
  set verticalAlign(value) {
    this._verticalAlign = normalizeParam(value, VERTICAL_ALIGN);
    this.updateClassList();
  }
  get pullToBoundary() {
    return this._pullToBoundary;
  }
  set pullToBoundary(value) {
    this._pullToBoundary = normalizeParam(value, BOUNDARY);
    this.updateClassList();
  }
  get multipleRows() {
    return this._multipleRows || false;
  }
  set multipleRows(value) {
    this._multipleRows = normalizeBoolean(value);
    this.updateClassList();
  }
  connectedCallback() {
    this.updateClassList();
  }
  updateClassList() {
    this.classList.remove(...this._layoutClass);
    const config = computeLayoutClass(this.horizontalAlign, this.verticalAlign, this.pullToBoundary, this.multipleRows);
    this._layoutClass = Object.keys(config);
    this.classList.add(...this._layoutClass);
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(cLayout, {
  publicProps: {
    horizontalAlign: {
      config: 3
    },
    verticalAlign: {
      config: 3
    },
    pullToBoundary: {
      config: 3
    },
    multipleRows: {
      config: 3
    }
  },
  track: {
    _horizontalAlign: 1,
    _verticalAlign: 1,
    _pullToBoundary: 1,
    _multipleRows: 1
  },
  fields: ["_layoutClass"]
});
const __lwc_component_class_internal = _registerComponent(cLayout, {
  tmpl: _tmpl,
  sel: "c-layout",
  apiVersion: 66
});
export default __lwc_component_class_internal;