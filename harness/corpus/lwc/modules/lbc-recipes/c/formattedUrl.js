import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./formattedUrl.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
import { isAbsoluteUrl } from 'c/utilsPrivate';
import { updateRawLinkInfo } from 'c/routingService';
class cFormattedUrl extends LightningElement {
  constructor(...args) {
    super(...args);
    this.target = void 0;
    this.tooltip = void 0;
    this.label = void 0;
    this.tabIndex = void 0;
    this._url = void 0;
    this._value = void 0;
    this._connected = false;
    this._dispatcher = () => {};
  }
  get value() {
    return this._value;
  }
  set value(value) {
    this._value = value;
    if (this._connected) {
      this.updateLinkInfo(value);
    }
  }
  connectedCallback() {
    this._connected = true;
    this.updateLinkInfo(this.value);
  }
  disconnectedCallback() {
    this._connected = false;
  }
  focus() {
    if (this.urlAnchor) {
      this.urlAnchor.focus();
    }
  }
  blur() {
    if (this.urlAnchor) {
      this.urlAnchor.blur();
    }
  }
  click() {
    const anchor = this.urlAnchor;
    if (anchor && anchor.click) {
      anchor.click();
    }
  }
  get urlAnchor() {
    if (this._connected && this.hasValue) {
      return this.template.querySelector('a');
    }
    return undefined;
  }
  handleClick(event) {
    this._dispatcher(event);
  }
  updateLinkInfo(url) {
    updateRawLinkInfo(this, {
      url: this.makeAbsoluteUrl(url),
      target: this.target
    }).then(linkInfo => {
      this._url = linkInfo.url;
      this._dispatcher = linkInfo.dispatcher;
    });
  }
  get computedLabel() {
    const {
      label,
      computedUrl
    } = this;
    return label != null && label !== '' ? label : computedUrl;
  }
  get computedUrl() {
    return this._url || this.makeAbsoluteUrl(this.value);
  }
  get hasValue() {
    const url = this.value;
    return url != null && url !== '';
  }
  makeAbsoluteUrl(url) {
    return isAbsoluteUrl(url) ? url : `http://${url}`;
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(cFormattedUrl, {
  publicProps: {
    target: {
      config: 0
    },
    tooltip: {
      config: 0
    },
    label: {
      config: 0
    },
    tabIndex: {
      config: 0
    },
    value: {
      config: 3
    }
  },
  publicMethods: ["focus", "blur", "click"],
  track: {
    _url: 1,
    _value: 1
  },
  fields: ["_connected", "_dispatcher"]
});
const __lwc_component_class_internal = _registerComponent(cFormattedUrl, {
  tmpl: _tmpl,
  sel: "c-formatted-url",
  apiVersion: 66
});
export default __lwc_component_class_internal;