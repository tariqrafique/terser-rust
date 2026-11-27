import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./layoutItem.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { normalizeFlexibility, normalizePadding, validateSize, computeLayoutClass, normalizeSize, normalizeDirection } from './styleUtils';
class LightningLayoutItem extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this._flexibility = void 0;
    this._alignmentBump = void 0;
    this._padding = void 0;
    this._size = void 0;
    this._smallDeviceSize = void 0;
    this._mediumDeviceSize = void 0;
    this._largeDeviceSize = void 0;
    this._layoutClass = [];
  }
  get flexibility() {
    return this._flexibility;
  }
  set flexibility(value) {
    this._flexibility = normalizeFlexibility(value);
    this.updateClassList();
  }
  get alignmentBump() {
    return this._alignmentBump;
  }
  set alignmentBump(value) {
    this._alignmentBump = normalizeDirection(value);
    this.updateClassList();
  }
  get padding() {
    return this._padding;
  }
  set padding(value) {
    this._padding = normalizePadding(value);
    this.updateClassList();
  }
  get size() {
    return this._size;
  }
  set size(value) {
    this._size = normalizeSize(value);
    this.validateSize();
    this.updateClassList();
  }
  get smallDeviceSize() {
    return this._smallDeviceSize;
  }
  set smallDeviceSize(value) {
    this._smallDeviceSize = normalizeSize(value);
    this.validateSize();
    this.updateClassList();
  }
  get mediumDeviceSize() {
    return this._mediumDeviceSize;
  }
  set mediumDeviceSize(value) {
    this._mediumDeviceSize = normalizeSize(value);
    this.validateSize();
  }
  get largeDeviceSize() {
    return this._largeDeviceSize;
  }
  set largeDeviceSize(value) {
    this._largeDeviceSize = normalizeSize(value);
    this.validateSize();
    this.updateClassList();
  }
  connectedCallback() {
    super.connectedCallback();
    this.updateClassList();
  }
  updateClassList() {
    this.classList.remove(...this._layoutClass);
    const config = computeLayoutClass({
      default: this.size,
      small: this.smallDeviceSize,
      medium: this.mediumDeviceSize,
      large: this.largeDeviceSize
    }, this.flexibility, this.padding, this.alignmentBump);
    this._layoutClass = Object.keys(config);
    this.classList.add(...this._layoutClass);
  }
  validateSize() {
    validateSize(this.size, this.smallDeviceSize, this.mediumDeviceSize, this.largeDeviceSize);
  }
  /*LWC compiler v9.5.3*/
}
LightningLayoutItem.validationOptOut = ['class'];
_registerDecorators(LightningLayoutItem, {
  publicProps: {
    flexibility: {
      config: 3
    },
    alignmentBump: {
      config: 3
    },
    padding: {
      config: 3
    },
    size: {
      config: 3
    },
    smallDeviceSize: {
      config: 3
    },
    mediumDeviceSize: {
      config: 3
    },
    largeDeviceSize: {
      config: 3
    }
  },
  track: {
    _flexibility: 1,
    _alignmentBump: 1,
    _padding: 1,
    _size: 1,
    _smallDeviceSize: 1,
    _mediumDeviceSize: 1,
    _largeDeviceSize: 1
  },
  fields: ["_layoutClass"]
});
const __lwc_component_class_internal = _registerComponent(LightningLayoutItem, {
  tmpl: _tmpl,
  sel: "lightning-layout-item",
  apiVersion: 66
});
export default __lwc_component_class_internal;