import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./layout.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { normalizeParam, computeLayoutClass, HORIZONTAL_ALIGN, VERTICAL_ALIGN, BOUNDARY } from './styleUtils';
import { normalizeBoolean } from 'lightning/utilsPrivate';
class LightningLayout extends LightningShadowBaseClass {
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
    super.connectedCallback();
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
LightningLayout.validationOptOut = ['class'];
_registerDecorators(LightningLayout, {
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
const __lwc_component_class_internal = _registerComponent(LightningLayout, {
  tmpl: _tmpl,
  sel: "lightning-layout",
  apiVersion: 66
});
export default __lwc_component_class_internal;