import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./mockRecordEditHolder.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
class MockRecordEditHolder extends LightningElement {
  constructor(...args) {
    super(...args);
    this._showChild = false;
    this._showNestedChild = false;
    this._recordId = void 0;
    this._recordTypeId = void 0;
    this._showPicklist = false;
    this._objectApiName = void 0;
    this._density = void 0;
    this._layoutType = void 0;
  }
  set density(val) {
    this._density = val;
  }
  get density() {
    return this._density;
  }
  set recordId(id) {
    this._recordId = id;
  }
  set recordTypeId(id) {
    this._recordTypeId = id;
  }
  get recordTypeId() {
    return this._recordTypeId;
  }
  get recordId() {
    return this._recordId;
  }
  set showChild(val) {
    this._showChild = val;
  }
  get showChild() {
    return this._showChild;
  }
  set showNestedChild(val) {
    this._showNestedChild = val;
  }
  get showNestedChild() {
    return this._showNestedChild;
  }
  set showPicklist(val) {
    this._showPicklist = val;
  }
  get showPicklist() {
    return this._showPicklist;
  }
  set objectApiName(val) {
    this._objectApiName = val;
  }
  get objectApiName() {
    return this._objectApiName;
  }
  set layoutType(val) {
    this._layoutType = val;
  }
  get layoutType() {
    return this._layoutType;
  }
  handleLoad(e) {
    this.dispatchEvent(new CustomEvent('load', {
      detail: e.detail
    }));
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(MockRecordEditHolder, {
  publicProps: {
    density: {
      config: 3
    },
    recordTypeId: {
      config: 3
    },
    recordId: {
      config: 3
    },
    showChild: {
      config: 3
    },
    showNestedChild: {
      config: 3
    },
    showPicklist: {
      config: 3
    },
    objectApiName: {
      config: 3
    },
    layoutType: {
      config: 3
    }
  },
  track: {
    _showChild: 1,
    _showNestedChild: 1,
    _recordId: 1,
    _recordTypeId: 1,
    _showPicklist: 1,
    _objectApiName: 1,
    _density: 1,
    _layoutType: 1
  }
});
const __lwc_component_class_internal = _registerComponent(MockRecordEditHolder, {
  tmpl: _tmpl,
  sel: "lightningtest-mock-record-edit-holder",
  apiVersion: 66
});
export default __lwc_component_class_internal;