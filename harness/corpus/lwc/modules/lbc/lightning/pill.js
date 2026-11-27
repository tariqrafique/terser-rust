import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./pill.html";
import { registerComponent as _registerComponent } from "lwc";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import labelPillError from '@salesforce/label/LightningPill.error';
import labelPillRemove from '@salesforce/label/LightningPill.remove';
import labelPillWarning from '@salesforce/label/LightningPill.warning';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { classListMutation, normalizeBoolean, sanitizeURL, FALLBACK_URL, reflectAttribute } from 'lightning/utilsPrivate';
import { formatUrl } from 'lightning/utils';
import { privateContext } from 'lightning/utilsInternal';
import link from './link.html';
import plain from './plain.html';
import plainLink from './plainLink.html';
import { updateRawLinkInfo } from 'lightning/routingService';
import { formatLabel } from 'lightning/utils';
import { relatedTarget as buttonRelatedTarget } from 'lightning/buttonIcon';
import { features } from 'lightning/features';
const {
  setContext,
  assertContext
} = privateContext;
const i18n = {
  pillError: labelPillError,
  pillRemove: labelPillRemove,
  pillWarning: labelPillWarning
};
const VARIANT = {
  PLAIN: 'plain',
  PLAIN_LINK: 'plainLink',
  LINK: 'link'
};
export const relatedTarget = Symbol('relatedTarget');
function modifyAttribute(el, name, value) {
  if (!el.isPlainLink) {
    if (value !== null && value !== undefined && value !== '') {
      el.setAttribute(name, value);
    } else {
      el.removeAttribute(name);
    }
  } else {
    el.removeAttribute(name);
  }
}
class LightningPill extends LightningShadowBaseClass {
  get href() {
    return this._href;
  }
  set href(value) {
    assertContext(this);
    this._href = sanitizeURL(value);
    this._href = this._href === FALLBACK_URL ? this._href : formatUrl(this._href);
    if (this._connected && (this.isPlainLink || this.isLink)) {
      this.updateLinkInfo(this._href);
    }
  }
  get variant() {
    return this._variant || VARIANT.LINK;
  }
  set variant(value) {
    const acceptedValues = [VARIANT.LINK, VARIANT.PLAIN, VARIANT.PLAIN_LINK];
    if (acceptedValues.indexOf(value) !== -1) {
      this._variant = value;
    } else {
      this._variant = VARIANT.LINK;
    }
    reflectAttribute(this, 'variant', this._variant);
  }
  render() {
    if (this.isPlainLink) {
      return plainLink;
    } else if (this.isPlain) {
      return plain;
    }
    return link;
  }
  get hasError() {
    return this._hasError || false;
  }
  set hasError(value) {
    this._hasError = normalizeBoolean(value);
  }
  checkMediaElement() {
    if (!this._mediaElement) {
      this._mediaElement = this.template.querySelector('slot');
    }
    return this._mediaElement && this._mediaElement.assignedNodes().length > 0;
  }
  renderedCallback() {
    Promise.resolve().then(() => {
      this._hasMedia = this.checkMediaElement();
      const wrapper = this.template.querySelector('span');
      classListMutation(wrapper.classList, {
        'slds-pill': true,
        'slds-pill_link': this.isPlainLink || this.isLink,
        'slds-has-error': this.hasError
      });
      modifyAttribute(this, 'tabindex', this.tabIndex);
      modifyAttribute(this, 'role', this.role);
      modifyAttribute(this, 'aria-selected', this.ariaSelected);
    });
  }
  get isPlainLink() {
    return this.variant === VARIANT.PLAIN_LINK;
  }
  get isPlain() {
    return this.variant === VARIANT.PLAIN || !this.href;
  }
  get isLink() {
    return this.variant === VARIANT.LINK && !!this.href;
  }
  get tabIndex() {
    return this._tabIndex;
  }
  set tabIndex(value) {
    this._tabIndex = value;
    modifyAttribute(this, 'tabindex', this._tabIndex);
  }
  get ariaSelected() {
    return this._ariaSelected;
  }
  set ariaSelected(value) {
    this._ariaSelected = normalizeBoolean(value);
    modifyAttribute(this, 'aria-selected', this._ariaSelected);
  }
  get role() {
    return this._role;
  }
  set role(value) {
    this._role = value;
    modifyAttribute(this, 'role', this._role);
  }
  get i18n() {
    return i18n;
  }
  get hasHref() {
    return !!this.href;
  }
  get labelElement() {
    if (!this._labelElement) {
      this._labelElement = this.template.querySelector('.slds-pill__label');
    }
    return this._labelElement;
  }
  get anchorElement() {
    if (!this._anchorElement) {
      this._anchorElement = this.template.querySelector('a');
    }
    return this._anchorElement;
  }
  get removeButtonElement() {
    if (!this._removeButtonElement) {
      this._removeButtonElement = this.template.querySelector('lightning-button-icon');
    }
    return this._removeButtonElement;
  }
  get computedPillRemoveLabel() {
    return formatLabel(this.i18n.pillRemove, this.label);
  }
  constructor() {
    super();
    this._href = void 0;
    this.label = void 0;
    this.name = void 0;
    this._role = void 0;
    this._ariaSelected = void 0;
    this._hasMedia = true;
    this._hasError = void 0;
    this._tabIndex = void 0;
    this._standardContainer = void 0;
    this._variant = void 0;
    this._connected = false;
    this._dispatcher = () => {};
    setContext(this);
  }
  connectedCallback() {
    assertContext(this);
    super.connectedCallback();
    this._connected = true;
    if (this.isPlainLink || this.isLink) {
      this.updateLinkInfo(this.href);
    }
  }
  disconnectedCallback() {
    this._connected = false;
  }
  handleClick(event) {
    if (features.enableAssertContext260Round2) {
      assertContext(this);
    }
    if (event.target === this.removeButtonElement) {
      this.handleRemoveClick(event);
    } else if (this.isPlainLink || this.isLink) {
      this._dispatcher(event);
    }
  }
  handleRemoveClick(event) {
    event.preventDefault();
    this.handleRemove(event);
  }
  handleRemove(event) {
    const removeEvent = new CustomEvent('remove', {
      cancelable: true,
      detail: {
        name: this.name
      }
    });
    this.dispatchEvent(removeEvent);
    if (removeEvent.defaultPrevented) {
      event.stopPropagation();
    }
  }
  focusLink() {
    const el = this.anchorElement;
    if (el) {
      el.focus();
    }
  }
  focusRemove() {
    const el = this.removeButtonElement;
    if (el) {
      el.focus();
    }
  }
  updateLinkInfo(url) {
    updateRawLinkInfo(this, {
      url
    }).then(linkInfo => {
      this._url = linkInfo.url;
      this._dispatcher = linkInfo.dispatcher;
    });
  }
  dispatchBlurEvent(pillRelatedTarget) {
    this._hasFocus = false;
    this.dispatchEvent(new CustomEvent('blur', {
      detail: {
        [relatedTarget]: pillRelatedTarget
      }
    }));
  }
  handleFocus(event) {
    event.stopPropagation();
    if (!this._hasFocus) {
      this._hasFocus = true;
      this.dispatchEvent(new CustomEvent('focus'));
    }
  }
  handleBlur(event) {
    event.stopPropagation();
    const pillRelatedTarget = event.relatedTarget || event.detail?.[buttonRelatedTarget];
    if (!pillRelatedTarget || !this.template.contains(pillRelatedTarget)) {
      this.dispatchBlurEvent(pillRelatedTarget);
    }
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(LightningPill, {
  publicProps: {
    href: {
      config: 3
    },
    label: {
      config: 0
    },
    name: {
      config: 0
    },
    variant: {
      config: 3
    },
    hasError: {
      config: 3
    },
    isPlainLink: {
      config: 1
    },
    tabIndex: {
      config: 3
    },
    ariaSelected: {
      config: 3
    },
    role: {
      config: 3
    }
  },
  publicMethods: ["focusLink", "focusRemove"],
  track: {
    _role: 1,
    _ariaSelected: 1,
    _hasMedia: 1,
    _hasError: 1,
    _tabIndex: 1,
    _standardContainer: 1,
    _variant: 1
  },
  fields: ["_href", "_connected", "_dispatcher"]
});
const __lwc_component_class_internal = _registerComponent(LightningPill, {
  tmpl: _tmpl,
  sel: "lightning-pill",
  apiVersion: 66
});
export default __lwc_component_class_internal;