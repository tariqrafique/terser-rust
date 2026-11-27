import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./mockRecordViewHolder.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
class MockRecordViewHolder extends LightningElement {
  constructor(...args) {
    super(...args);
    this._recordId = void 0;
    this._showIncludedField = false;
    this._showExcludedField = false;
    this._showNestedChild = false;
    this._apiName = void 0;
    this._density = void 0;
  }
  set recordId(id) {
    this._recordId = id;
  }
  get recordId() {
    return this._recordId;
  }
  set density(val) {
    this._density = val;
  }
  get density() {
    return this._density;
  }
  set objectApiName(value) {
    this._apiName = value;
  }
  get objectApiName() {
    return this._apiName;
  }
  set showIncludedField(value) {
    this._showIncludedField = value;
  }
  get showIncludedField() {
    return this._showIncludedField;
  }
  set showExcludedField(value) {
    this._showExcludedField = value;
  }
  get showExcludedField() {
    return this._showExcludedField;
  }
  set showNestedChild(val) {
    this._showNestedChild = val;
  }
  get showNestedChild() {
    return this._showNestedChild;
  }
  handleLoad(e) {
    this.dispatchEvent(new CustomEvent('load', {
      detail: e.detail
    }));
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(MockRecordViewHolder, {
  publicProps: {
    recordId: {
      config: 3
    },
    density: {
      config: 3
    },
    objectApiName: {
      config: 3
    },
    showIncludedField: {
      config: 3
    },
    showExcludedField: {
      config: 3
    },
    showNestedChild: {
      config: 3
    }
  },
  track: {
    _recordId: 1,
    _showIncludedField: 1,
    _showExcludedField: 1,
    _showNestedChild: 1,
    _apiName: 1,
    _density: 1
  }
});
const __lwc_component_class_internal = _registerComponent(MockRecordViewHolder, {
  tmpl: _tmpl,
  sel: "lightningtest-mock-record-view-holder",
  apiVersion: 66
});
export default __lwc_component_class_internal;