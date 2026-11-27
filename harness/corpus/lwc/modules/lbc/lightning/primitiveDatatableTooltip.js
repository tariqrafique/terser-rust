import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./primitiveDatatableTooltip.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { createElement, registerComponent as _registerComponent } from 'lwc';
import { raf, guid } from 'lightning/utilsPrivate';
import LightningPrimitiveDatatableTooltipBubble from 'lightning/primitiveDatatableTooltipBubble';
import { getNubbinShiftAmount, getBubbleAlignAndPosition } from './utils';
import { classSet } from 'lightning/utils';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
const SLDS_ZINDEX = '--slds-c-popover-position-zindex';
const CACHED_BUBBLE_ELEMENT = !import.meta.env.SSR ? createElement('lightning-primitive-datatable-tooltip-bubble', {
  is: LightningPrimitiveDatatableTooltipBubble
}) : null;
if (!import.meta.env.SSR) {
  CACHED_BUBBLE_ELEMENT.style.setProperty(SLDS_ZINDEX, 9500);
  CACHED_BUBBLE_ELEMENT.style.position = 'absolute';
  CACHED_BUBBLE_ELEMENT.style.minWidth = '75px';
}
const DEFAULT_ANCHORING = {
  trigger: {
    horizontal: 'left',
    vertical: 'top'
  },
  bubble: {
    horizontal: 'left',
    vertical: 'bottom'
  }
};
const ZERO_OFFSET = {
  horizontal: 0,
  vertical: 0
};
class LightningPrimitiveDatatableTooltip extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this.header = '';
    this.content = [];
    this.size = 'medium';
    this.trigger = 'click';
    this.hideCloseButton = false;
    this.variant = 'bare';
    this.alternativeText = void 0;
    this.internalTabIndex = void 0;
    this._uniqueId = `primitive-datatable-tooltip_${guid()}`;
    this._showErrorButton = false;
    this._offset = ZERO_OFFSET;
    this.handleBrowserEvent = raf(() => {
      if (this._showErrorBubble && this.isBubbleAttachedToTrigger()) {
        this.setBubblePosition();
      }
    });
    this.handleBubbleClose = event => {
      const bubbleEl = CACHED_BUBBLE_ELEMENT;
      bubbleEl.removeEventListener('close', this.handleBubbleClose);
      if (event.detail.anchor === this._uniqueId) {
        this.hideBubble();
        if (event.detail.reason !== 'bubbleLoseFocus') {
          this.triggerElement.focus();
        }
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    if (!import.meta.env.SSR) {
      window.addEventListener('resize', this.handleBrowserEvent, false);
      window.addEventListener('scroll', this.handleBrowserEvent, true);
    }
  }
  disconnectedCallback() {
    window.removeEventListener('resize', this.handleBrowserEvent, false);
    window.removeEventListener('scroll', this.handleBrowserEvent, true);
    const bubbleEl = CACHED_BUBBLE_ELEMENT;
    bubbleEl.removeEventListener('close', this.handleBubbleClose);
    if (this._showErrorBubble) {
      this._showErrorBubble = false;
      bubbleEl.visible = false;
    }
  }
  get offset() {
    return this._offset;
  }
  set offset(value) {
    this._offset = {
      ...ZERO_OFFSET,
      ...value
    };
  }
  focus() {
    this.triggerElement.focus();
  }
  get computedButtonClass() {
    const classes = classSet('slds-button').add('slds-button_icon');
    classes.add({
      'slds-button_icon-error': this.variant === 'error'
    });
    return classes.toString();
  }
  get computedHeaderIconName() {
    switch (this.variant) {
      case 'error':
        return 'utility:ban';
      case 'warning':
        return 'utility:warning';
      case 'bare':
      default:
        return 'utility:info';
    }
  }
  get triggerElement() {
    return this.refs.trigger;
  }
  handleMouseOver() {
    if (this.trigger === 'hover') {
      this.showBubble();
    }
  }
  handleMouseOut() {
    if (this.trigger === 'hover') {
      this.hideBubble();
      this.triggerElement.focus();
    }
  }
  handleClick(event) {
    event.preventDefault();
    if (this.trigger === 'click') {
      if (this._showErrorBubble && this.isBubbleAttachedToTrigger()) {
        this.hideBubble();
      } else {
        this.showBubble();
      }
    }
  }
  showBubble() {
    this._showErrorBubble = true;
    const bubbleEl = CACHED_BUBBLE_ELEMENT;
    this.initBubble();
    this.setBubblePosition();
    bubbleEl.visible = true;
    setTimeout(() => {
      bubbleEl.focus();
    }, 100);
  }
  hideBubble() {
    this._showErrorBubble = false;
    const bubbleEl = CACHED_BUBBLE_ELEMENT;
    bubbleEl.visible = false;
    setTimeout(() => {
      this.focus();
    }, 25);
  }
  isBubbleAttachedToTrigger() {
    return CACHED_BUBBLE_ELEMENT.anchor === this._uniqueId;
  }
  getTriggerBoundingRect() {
    return this.triggerElement ? this.triggerElement.getBoundingClientRect() : null;
  }
  calculateShiftAmounts() {
    if (typeof this.shiftAmounts === 'undefined') {
      const bubbleEl = CACHED_BUBBLE_ELEMENT;
      bubbleEl.style.top = 0;
      bubbleEl.style.left = 0;
      bubbleEl.style.bottom = null;
      bubbleEl.style.right = null;
      const triggerElRect = this.getTriggerBoundingRect();
      const nubbinComputedStyles = window.getComputedStyle(bubbleEl, ':before') || bubbleEl.style;
      this.shiftAmounts = getNubbinShiftAmount(nubbinComputedStyles, triggerElRect.width);
    }
  }
  initBubble() {
    const bubbleEl = CACHED_BUBBLE_ELEMENT;
    bubbleEl.anchor = this._uniqueId;
    bubbleEl.content = this.content;
    bubbleEl.header = this.header;
    bubbleEl.variant = this.variant;
    bubbleEl.hideCloseButton = this.hideCloseButton;
    bubbleEl.addEventListener('close', this.handleBubbleClose);
    if (bubbleEl.parentNode === null) {
      document.body.appendChild(bubbleEl);
    }
    this.calculateShiftAmounts();
  }
  setBubblePosition() {
    const rootEl = document.documentElement;
    const bubbleEl = CACHED_BUBBLE_ELEMENT;
    const result = getBubbleAlignAndPosition(this.getTriggerBoundingRect(), bubbleEl.getBoundingClientRect(), DEFAULT_ANCHORING.bubble, this.shiftAmounts, rootEl.clientHeight || window.innerHeight, rootEl.clientWidth || window.innerWidth, window.pageXOffset + this.offset.horizontal, window.pageYOffset + this.offset.vertical);
    bubbleEl.align = result.align;
    bubbleEl.style.top = result.top;
    bubbleEl.style.right = result.right;
    bubbleEl.style.bottom = result.bottom;
    bubbleEl.style.left = result.left;
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(LightningPrimitiveDatatableTooltip, {
  publicProps: {
    header: {
      config: 0
    },
    content: {
      config: 0
    },
    size: {
      config: 0
    },
    trigger: {
      config: 0
    },
    hideCloseButton: {
      config: 0
    },
    variant: {
      config: 0
    },
    alternativeText: {
      config: 0
    },
    internalTabIndex: {
      config: 0
    },
    offset: {
      config: 3
    }
  },
  publicMethods: ["focus", "showBubble"],
  track: {
    _offset: 1
  },
  fields: ["_uniqueId", "_showErrorButton", "handleBrowserEvent", "handleBubbleClose"]
});
const __lwc_component_class_internal = _registerComponent(LightningPrimitiveDatatableTooltip, {
  tmpl: _tmpl,
  sel: "lightning-primitive-datatable-tooltip",
  apiVersion: 66
});
export default __lwc_component_class_internal;