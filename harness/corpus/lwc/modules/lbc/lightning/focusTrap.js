import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./focusTrap.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { findAllTabbableElements } from 'lightning/focusUtils';
class FocusTrap extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this._startNode = void 0;
    this._endNode = void 0;
    this._focused = false;
    this._initialized = false;
    this._pendingFocusOut = false;
  }
  renderedCallback() {
    if (!this._initialized) {
      this._initialized = true;
      this._startNode = this.template.querySelector('[data-start]');
      this._endNode = this.template.querySelector('[data-end]');
    }
  }
  focus() {
    if (!this._focused) {
      this._focusFirstElement();
    }
  }
  get _bookendTabIndex() {
    return this._focused ? '0' : '-1';
  }
  _handleFocusIn() {
    if (this._pendingFocusOut) {
      this._pendingFocusOut = false;
    }
    this._focused = true;
  }
  _handleFocusOut() {
    this._pendingFocusOut = true;
    requestAnimationFrame(() => {
      if (this._pendingFocusOut) {
        this._focused = false;
      }
    });
  }
  _moveFocusTo(elementLocation) {
    const focusableElements = this._getFocusableElements();
    if (focusableElements.length > 0) {
      let node;
      if (elementLocation === 'last') {
        node = focusableElements[focusableElements.length - 1];
      } else if (elementLocation === 'first') {
        node = focusableElements[0];
      }
      node.focus();
    }
  }
  _focusFirstElement() {
    this._moveFocusTo('first');
  }
  _focusLastElement() {
    this._moveFocusTo('last');
  }
  _getFocusableElements() {
    return findAllTabbableElements(this.template.querySelector('slot'));
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(FocusTrap, {
  publicMethods: ["focus"],
  fields: ["_startNode", "_endNode", "_focused", "_initialized", "_pendingFocusOut"]
});
const __lwc_component_class_internal = _registerComponent(FocusTrap, {
  tmpl: _tmpl,
  sel: "lightning-focus-trap",
  apiVersion: 66
});
export default __lwc_component_class_internal;