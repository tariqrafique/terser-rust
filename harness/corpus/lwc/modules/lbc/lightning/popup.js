import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./popup.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { AutoPosition } from 'lightning/positionLibrary';
import { createAlignmentConfiguration, DEFAULT_POPUP_ALIGNMENT } from './alignment';
import { getElementWithFocus } from 'lightning/focusUtils';
import { isUndefinedOrNull, normalizeBoolean } from 'lightning/utilsPrivate';
import AriaObserver from 'lightning/ariaObserver';
class LightningPopup extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this._visible = void 0;
    this._queueShow = void 0;
    this._ariaLabelledBy = void 0;
    this._ariaDescribedBy = void 0;
    this._ariaLabel = void 0;
    this._referenceElement = void 0;
    this._alignmentOptions = void 0;
    this._alignment = void 0;
    this._hasFocus = void 0;
    this.ariaObserver = void 0;
    this._rootAriaNode = void 0;
    this._rendered = void 0;
  }
  connectedCallback() {
    super.connectedCallback();
    this.setupAriaObserverIfAbsent();
  }
  renderedCallback() {
    if (this._queueShow) {
      this._queueShow = false;
      if (this._referenceElement) {
        this._startPositioning();
      }
      const autoFocus = this._patchedDispatchEvent(new CustomEvent('autofocus', {
        cancelable: true
      }));
      if (autoFocus) {
        this.focus();
      }
    }
    if (!this._rendered) {
      this.connectAriaAttributes();
      this._rendered = true;
    }
    if (this.isConnected) {
      this.ariaObserver.sync();
    }
  }
  disconnectedCallback() {
    this._close();
    this.removeAriaObserverIfPresent();
  }
  setupAriaObserverIfAbsent() {
    if (!this.ariaObserver) {
      this.ariaObserver = new AriaObserver(this);
      this.ariaObserver.root = this._rootAriaNode;
      this.connectAriaAttributes();
    }
  }
  removeAriaObserverIfPresent() {
    if (this.ariaObserver) {
      this.ariaObserver.disconnect();
      this.ariaObserver = undefined;
    }
  }
  get rootAriaNode() {
    return this._rootAriaNode;
  }
  set rootAriaNode(root) {
    this._rootAriaNode = root;
    if (this.ariaObserver) {
      this.ariaObserver.root = root;
      this.ariaObserver.sync();
    }
  }
  connectAriaAttributes() {
    this.connectAriaLabelledBy();
    this.connectAriaDescribedBy();
  }
  get ariaLabelledBy() {
    return this._ariaLabelledBy || null;
  }
  set ariaLabelledBy(value) {
    this._ariaLabelledBy = value;
    if (this.ariaObserver) {
      this.connectAriaLabelledBy();
    }
  }
  connectAriaLabelledBy() {
    if (!import.meta.env.SSR) {
      this.ariaObserver.connect({
        targetSelector: 'section',
        attribute: 'aria-labelledby',
        relatedNodeIds: this._ariaLabelledBy
      });
    }
  }
  get ariaDescribedBy() {
    return this._ariaDescribedBy || null;
  }
  set ariaDescribedBy(value) {
    this._ariaDescribedBy = value;
    if (this.ariaObserver) {
      this.connectAriaDescribedBy();
    }
  }
  connectAriaDescribedBy() {
    if (!import.meta.env.SSR) {
      this.ariaObserver.connect({
        targetSelector: 'section',
        attribute: 'aria-describedby',
        relatedNodeIds: this._ariaDescribedBy
      });
    }
  }
  get ariaLabel() {
    return this._ariaLabel;
  }
  set ariaLabel(value) {
    this._ariaLabel = value;
  }
  get alignment() {
    if (!this._referenceElement) {
      return undefined;
    }
    return this._alignment ? this._alignment : DEFAULT_POPUP_ALIGNMENT;
  }
  show(referenceElement, alignmentOptions) {
    if (this._visible) {
      return;
    }
    this._referenceElement = referenceElement;
    this._alignmentOptions = alignmentOptions || {};
    this._alignmentOptions.autoFlip = isUndefinedOrNull(this._alignmentOptions.autoFlip) ? true : normalizeBoolean(this._alignmentOptions.autoFlip);
    this._saveActiveElement();
    this._queueShow = true;
    this._visible = true;
  }
  close() {
    this._close();
    if (this._hasFocus) {
      this._returnFocus();
    }
  }
  focus() {
    if (this._visible) {
      this.template.querySelector('[data-focus-trap]').focus();
      this._hasFocus = true;
    }
  }
  _saveActiveElement() {
    this._savedActiveElement = getElementWithFocus();
  }
  _startPositioning() {
    if (!this._autoPosition) {
      this._autoPosition = new AutoPosition(this);
    }
    const configuration = Object.assign({
      target: () => this._referenceElement,
      element: () => this._getSectionElement()
    }, createAlignmentConfiguration(this._alignmentOptions));
    this._autoPosition.start(configuration).then(autoPositionUpdater => {
      if (autoPositionUpdater && this._visible) {
        const newAlignment = autoPositionUpdater.config.align;
        this._alignment = {
          horizontal: newAlignment.horizontal,
          vertical: newAlignment.vertical
        };
        this.dispatchEvent(new CustomEvent('alignmentupdate'));
      }
    });
  }
  _close() {
    this._alignment = undefined;
    this._stopPositioning();
    this._visible = false;
  }
  _stopPositioning() {
    if (this._autoPosition) {
      this._autoPosition.stop();
    }
  }
  _closeAndDispatchCloseEvent() {
    this._close();
    this.dispatchEvent(new CustomEvent('close'));
  }
  _returnFocus() {
    const returnFocus = this._patchedDispatchEvent(new CustomEvent('returnfocus', {
      cancelable: true
    }));
    if (returnFocus && this._savedActiveElement) {
      this._savedActiveElement.focus();
    }
  }
  _handleFocusIn() {
    this._hasFocus = true;
  }
  _handleFocusOut() {
    this._hasFocus = false;
    requestAnimationFrame(() => {
      if (!this._hasFocus) {
        const closeOnClickOut = this._patchedDispatchEvent(new CustomEvent('clickout', {
          cancelable: true
        }));
        if (closeOnClickOut) {
          this._closeAndDispatchCloseEvent();
        }
      }
    });
  }
  _handlePopoverKeydown(event) {
    const hasModifier = event.ctrlKey || event.metaKey || event.shiftKey;
    if (!hasModifier && event.key && event.key === 'Escape') {
      this._returnFocus();
      this._closeAndDispatchCloseEvent();
      event.stopPropagation();
    }
  }
  _getSectionElement() {
    return this.template.querySelector('section');
  }
  _patchedDispatchEvent(event) {
    this.dispatchEvent(event);
    return !event.defaultPrevented;
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(LightningPopup, {
  publicProps: {
    rootAriaNode: {
      config: 3
    },
    ariaLabelledBy: {
      config: 3
    },
    ariaDescribedBy: {
      config: 3
    },
    ariaLabel: {
      config: 3
    },
    alignment: {
      config: 1
    }
  },
  publicMethods: ["show", "close", "focus"],
  track: {
    _visible: 1,
    _queueShow: 1,
    _ariaLabelledBy: 1,
    _ariaDescribedBy: 1,
    _ariaLabel: 1
  },
  fields: ["_referenceElement", "_alignmentOptions", "_alignment", "_hasFocus", "ariaObserver", "_rootAriaNode", "_rendered"]
});
const __lwc_component_class_internal = _registerComponent(LightningPopup, {
  tmpl: _tmpl,
  sel: "lightning-popup",
  apiVersion: 66
});
export default __lwc_component_class_internal;