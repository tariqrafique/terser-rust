import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./overlay.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningPrimitiveOverlay from 'lightning/primitiveOverlay';
import { parent, instanceName, secure } from 'lightning/overlayUtils';
import LightningOverlayBase from 'lightning/overlayBase';
import { normalizeString, normalizeBoolean } from 'lightning/utilsPrivate';
import { DEFAULT_POPOVER, VALID_POPOVER_VALUES, DEFAULT_POSITION, VALID_POSITION_VALUES } from 'lightning/overlayPositionUtils';
class LightningOverlay extends LightningPrimitiveOverlay {
  constructor(...args) {
    super(...args);
    this.source = null;
    this.minWidth = '1rem';
    this.maxWidth = 'auto';
    this.minHeight = '1rem';
    this.maxHeight = 'auto';
    this.offsetInline = 0;
    this.offsetBlock = 0;
    this._popover = DEFAULT_POPOVER;
    this._position = DEFAULT_POSITION;
    this._enableFocusTrap = false;
  }
  get popover() {
    return this._popover;
  }
  set popover(value) {
    this._popover = normalizeString(value, {
      fallbackValue: DEFAULT_POPOVER,
      validValues: VALID_POPOVER_VALUES
    });
  }
  get position() {
    return this._position;
  }
  set position(value) {
    this._position = normalizeString(value, {
      fallbackValue: DEFAULT_POSITION,
      validValues: VALID_POSITION_VALUES
    });
  }
  get enableFocusTrap() {
    return this._enableFocusTrap;
  }
  set enableFocusTrap(value) {
    this._enableFocusTrap = normalizeBoolean(value);
  }
  close(result, maybeSecure) {
    if (maybeSecure === secure) {
      super.close(result);
    } else {
      const rootNode = this.template.host.getRootNode();
      const base = rootNode.host;
      base.hideSurfacePopover(result);
    }
  }
  connectedCallback() {
    if (this.constructor.name === 'LightningOverlay') {
      throw new Error('Use of <lightning-overlay> as an element is not supported. See developer documentation for extending the LightningOverlay class.');
    }
  }
  /*LWC compiler v9.5.3*/
}
LightningOverlay[parent] = LightningOverlayBase;
LightningOverlay[instanceName] = 'lightning-overlay';
_registerDecorators(LightningOverlay, {
  publicProps: {
    source: {
      config: 0
    },
    minWidth: {
      config: 0
    },
    maxWidth: {
      config: 0
    },
    minHeight: {
      config: 0
    },
    maxHeight: {
      config: 0
    },
    offsetInline: {
      config: 0
    },
    offsetBlock: {
      config: 0
    },
    popover: {
      config: 3
    },
    position: {
      config: 3
    },
    enableFocusTrap: {
      config: 3
    }
  },
  publicMethods: ["close"],
  fields: ["_popover", "_position", "_enableFocusTrap"]
});
const __lwc_component_class_internal = _registerComponent(LightningOverlay, {
  tmpl: _tmpl,
  sel: "lightning-overlay",
  apiVersion: 66
});
export default __lwc_component_class_internal;