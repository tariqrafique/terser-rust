import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./overlayBase.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { instanceName, secure } from 'lightning/overlayUtils';
import { AnchorPositioningAdapter, DEFAULT_POPOVER } from 'lightning/overlayPositionUtils';
import { normalizeBoolean } from 'lightning/utilsPrivate';
class LightningOverlayBase extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this._focusTrapEnabled = false;
    this._popover = DEFAULT_POPOVER;
    this._initialized = false;
    this._anchorAdapter = null;
    this._focusTrapChanged = false;
    this.isPanelOpen = false;
    this._closeResult = void 0;
  }
  disconnectedCallback() {
    if (this._anchorAdapter) {
      this._anchorAdapter.destroy();
      this._anchorAdapter = null;
    }
  }
  get focusTrapEnabled() {
    return this._focusTrapEnabled;
  }
  set focusTrapEnabled(value) {
    this._focusTrapEnabled = normalizeBoolean(value);
  }
  get popover() {
    return this._popover;
  }
  renderedCallback() {
    this._focusTrapChanged = false;
    if (!this.isPanelOpen) {
      this.openPanel();
    } else {
      this.applyDynamicUpdates();
    }
  }
  openPanel() {
    if (!this.isPanelOpen) {
      this.isPanelOpen = true;
    }
  }
  applyDynamicUpdates() {
    if (!this._initialized) {
      this.initialize();
      this._initialized = true;
    }
    if (!this._focusTrapChanged) {
      const overlay = this.overlay;
      const surface = this.refs && this.refs.surface;
      if (!overlay || !surface) {
        return;
      }
      if (surface.popover === this._popover) {
        const source = overlay.source;
        if (source) {
          surface.showPopover({
            source
          });
        } else {
          surface.showPopover();
        }
      }
    }
  }
  initialize() {
    if (this._popover !== this.overlay.popover) {
      this._popover = this.overlay.popover;
    }
    if (this._focusTrapEnabled !== this.overlay.enableFocusTrap) {
      this._focusTrapEnabled = this.overlay.enableFocusTrap;
      this._focusTrapChanged = true;
    }
    this.setupAnchorPositioning();
  }
  setupAnchorPositioning() {
    if (!this.overlay || !this.overlay.source || !this.refs.surface || this._anchorAdapter) {
      return;
    }
    const {
      source,
      position,
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
      offsetInline,
      offsetBlock
    } = this.overlay;
    this._anchorAdapter = new AnchorPositioningAdapter(this.refs?.surface, {
      source,
      position,
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
      offsetInline,
      offsetBlock
    });
    this._anchorAdapter.apply();
  }
  handleToggle(event) {
    if (event.newState === 'closed') {
      this.overlay.close(this._closeResult, secure);
    }
  }
  get overlay() {
    return !import.meta.env.SSR && this.defaultSlot && this.defaultSlot.childNodes[0] || null;
  }
  get defaultSlot() {
    return this.template.querySelector('[data-slot]');
  }
  hideSurfacePopover(result) {
    this._closeResult = result;
    const surface = this.refs?.surface;
    if (surface) {
      surface?.hidePopover();
    }
  }
  /*LWC compiler v9.5.3*/
}
LightningOverlayBase[instanceName] = 'lightning-overlay-base';
_registerDecorators(LightningOverlayBase, {
  publicProps: {
    focusTrapEnabled: {
      config: 3
    },
    defaultSlot: {
      config: 1
    }
  },
  publicMethods: ["hideSurfacePopover"],
  fields: ["_focusTrapEnabled", "_popover", "_initialized", "_anchorAdapter", "_focusTrapChanged", "isPanelOpen", "_closeResult"]
});
const __lwc_component_class_internal = _registerComponent(LightningOverlayBase, {
  tmpl: _tmpl,
  sel: "lightning-overlay-base",
  apiVersion: 66
});
export default __lwc_component_class_internal;