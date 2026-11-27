import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./formattedLookup.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import { normalizeBoolean } from 'lightning/utilsPrivate';
import { getLinkInfo } from 'lightning/routingService';
import { PrivateLookupItemPickedEvent } from './events';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { features } from 'lightning/features';
export const EVENTS = {
  PrivateLookupItemPickedEvent
};
class LightningFormattedLookup extends LightningShadowBaseClass {
  get recordId() {
    return this.state.recordId;
  }
  set recordId(value) {
    this.state.recordId = value;
    this.updateLinkData();
  }
  get objectApiName() {
    return this._objectApiName;
  }
  set objectApiName(value) {
    if (features.enableLookupFieldObjApiName) {
      this._objectApiName = value;
      this.updateLinkData();
    }
  }
  get disabled() {
    return this.state.disabled;
  }
  set disabled(value) {
    this.state.disabled = normalizeBoolean(value);
    this.isNavigable = !this.disabled && !!this.dispatcher && !!this.state.url;
  }
  constructor() {
    super();
    this.displayValue = void 0;
    this.tabIndex = void 0;
    this._objectApiName = null;
    this._connected = void 0;
    this._dataNavigation = void 0;
    this.dispatcher = void 0;
    this.state = {
      disabled: false,
      recordId: null,
      url: null,
      isNavigable: false
    };
    this._connected = false;
    this.dispatcher = null;
  }
  connectedCallback() {
    super.connectedCallback();
    this._connected = true;
    this.updateLinkData();
    if (this.getAttribute('data-navigation') === 'enable') {
      this._dataNavigation = true;
      this.removeAttribute('data-navigation');
    }
  }
  disconnectedCallback() {
    this._connected = false;
  }
  focus() {
    if (this.anchor) {
      this.anchor.focus();
    }
  }
  blur() {
    if (this.anchor) {
      this.anchor.blur();
    }
  }
  click() {
    if (this.anchor) {
      this.anchor.click();
    }
  }
  get anchor() {
    if (!import.meta.env.SSR && this._connected && this.isNavigable) {
      return this.template.querySelector('a');
    }
    return undefined;
  }
  get isNavigable() {
    return this.state.isNavigable;
  }
  set isNavigable(value) {
    const normalizedValue = normalizeBoolean(value);
    this.state.isNavigable = normalizedValue;
    if (this._connected && this._dataNavigation) {
      if (normalizedValue) {
        this.setAttribute('data-navigation', 'enable');
      } else {
        this.removeAttribute('data-navigation');
      }
    }
  }
  updateLinkData() {
    const {
      recordId
    } = this.state;
    if (!import.meta.env.SSR && this._connected && recordId) {
      const {
        objectApiName
      } = this;
      getLinkInfo(this, {
        stateType: 'standard__recordPage',
        attributes: {
          recordId,
          actionName: 'view',
          ...(features.enableLookupFieldObjApiName && objectApiName && {
            objectApiName
          })
        }
      }).then(linkInfo => {
        this.state.url = linkInfo.url;
        this.dispatcher = linkInfo.dispatcher;
        this.isNavigable = !this.disabled && !!this.dispatcher && !!this.state.url;
      });
    }
  }
  handleClick(event) {
    this.dispatchEvent(new PrivateLookupItemPickedEvent({
      recordId: this.recordId
    }));
    this.dispatcher(event);
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(LightningFormattedLookup, {
  publicProps: {
    displayValue: {
      config: 0
    },
    tabIndex: {
      config: 0
    },
    recordId: {
      config: 3
    },
    objectApiName: {
      config: 3
    },
    disabled: {
      config: 3
    }
  },
  publicMethods: ["focus", "blur", "click"],
  track: {
    state: 1
  },
  fields: ["_objectApiName", "_connected", "_dataNavigation", "dispatcher"]
});
const __lwc_component_class_internal = _registerComponent(LightningFormattedLookup, {
  tmpl: _tmpl,
  sel: "lightning-formatted-lookup",
  apiVersion: 66
});
export default __lwc_component_class_internal;