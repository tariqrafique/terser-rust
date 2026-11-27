import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./toast.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { normalizeString, isMacOS, isiOS } from 'lightning/utilsPrivate';
import { formatUrl } from 'lightning/utils';
import { instanceName, properties, requiredProperties } from 'lightning/overlayUtils';
import { classSet } from 'lightning/utils';
import { ShowToastEvent } from 'lightning/showToastEvent';
import { LightningResizeObserver } from 'lightning/resizeObserver';
import ToastContainer from 'lightning/toastContainer';
import formFactorPropertyName from '@salesforce/client/formFactor';
import closeButtonTitleText from '@salesforce/label/LightningToast.close';
import iconInfoAltText from '@salesforce/label/LightningToast.infoLabel';
import iconWarningAltText from '@salesforce/label/LightningToast.warningLabel';
import iconSuccessAltText from '@salesforce/label/LightningToast.successLabel';
import iconErrorAltText from '@salesforce/label/LightningToast.errorLabel';
import macNavigationAssistiveText from '@salesforce/label/LightningToast.macNavigationAssistiveText';
import genericNavigationAssistiveText from '@salesforce/label/LightningToast.genericNavigationAssistiveText';
import { getCurrentRegionAttributeName } from 'lightning/f6Controller';
import { privateContext } from 'lightning/utilsInternal';
import { features } from 'lightning/features';
const MODE_DISMISSIBLE = 'dismissible';
const MODE_STICKY = 'sticky';
const VARIANT_INFO = 'info';
const VARIANT_WARNING = 'warning';
const VARIANT_ERROR = 'error';
const VARIANT_SUCCESS = 'success';
export const DEFAULT_TOAST_VARIANT = VARIANT_INFO;
export const DEFAULT_TOAST_MODE = MODE_STICKY;
const DURATION_LINK = 9600;
const DURATION_NO_LINK = 4800;
const MIN_BROWSER_WIDTH = 480;
const {
  setContext,
  assertContext
} = privateContext;
class Toast extends LightningShadowBaseClass {
  get hasLabelLink() {
    return this.hasLinkData(this.labelLinks);
  }
  get hasMessageLink() {
    return this.hasLinkData(this.messageLinks);
  }
  get label() {
    return this.buildLinks(this._label, this.labelLinks) || '';
  }
  set label(value) {
    this._label = value;
  }
  get message() {
    return this.buildLinks(this._message, this.messageLinks) || '';
  }
  set message(value) {
    this._message = value;
  }
  get variant() {
    return this._variant;
  }
  set variant(value) {
    if (features.enableAssertContext260Round2) {
      assertContext(this);
    }
    this._variant = this.normalizeVariant(value);
  }
  get mode() {
    return this._mode;
  }
  set mode(value) {
    this._mode = this.normalizeMode(value);
  }
  get iconName() {
    return `utility:${this._variant}`;
  }
  get toastClass() {
    return classSet(`slds-notify slds-notify_toast fix-notify_toast_animation slds-theme_${this._variant}`).add({
      closing: this.closing,
      'slds-hide': this.hide,
      'fix-slds-notify--mobile': this.isSmallerBrowserWidth
    }).toString();
  }
  get toastElement() {
    return this.template.querySelector('.slds-notify_toast');
  }
  get isSmallerBrowserWidth() {
    return this._isSmallFormFactor || this._isSmallerBrowserWidth;
  }
  get closeIconContainerClass() {
    return classSet('slds-notify__close').add({
      'fix-slds-notify--mobile__close': this._isSmallFormFactor
    });
  }
  get iconAlternativeText() {
    if (this._variant === VARIANT_WARNING) {
      return iconWarningAltText;
    } else if (this._variant === VARIANT_SUCCESS) {
      return iconSuccessAltText;
    } else if (this._variant === VARIANT_ERROR) {
      return iconErrorAltText;
    }
    return iconInfoAltText;
  }
  focus() {
    this._isFocused = true;
    this.template.querySelector('[data-content]').focus();
  }
  normalizeVariant(variant) {
    return normalizeString(variant, {
      fallbackValue: DEFAULT_TOAST_VARIANT,
      validValues: [VARIANT_INFO, VARIANT_SUCCESS, VARIANT_WARNING, VARIANT_ERROR]
    });
  }
  normalizeMode(mode) {
    return normalizeString(mode, {
      validValues: [MODE_DISMISSIBLE, MODE_STICKY]
    });
  }
  calculateDefaultMode(hasLink) {
    return this._variant === VARIANT_SUCCESS && !hasLink ? MODE_DISMISSIBLE : MODE_STICKY;
  }
  buildLinks(template, links) {
    if (!template || !links || typeof links !== 'object') {
      return template;
    }
    if (Array.isArray(links)) {
      return template.replace(/\{(\d+)\}/gm, (match, index) => {
        return this.createAnchorTagString(match, links[index]);
      });
    }
    return template.replace(/\{(\w+)\}/gm, match => {
      const key = match.substring(1, match.length - 1);
      return this.createAnchorTagString(match, links[key]);
    });
  }
  createAnchorTagString(match, link) {
    if (!link) {
      return match;
    }
    const {
      url,
      label
    } = link;
    return `<a href='${formatUrl(url)}' target='_blank' title='${label}'>${label}</a>`;
  }
  hasLinkData(linkData) {
    return linkData && !!(Array.isArray(linkData) && linkData.length || typeof linkData === 'object' && Object.entries(linkData).length);
  }
  hasLink() {
    const slots = Array.from(this.template.querySelectorAll('slot'));
    return slots.some(slot => {
      const elements = slot.assignedElements();
      return elements.some(element => {
        return element.tagName === 'A' || element.querySelector('a') !== null;
      });
    }) || !!this.hasLabelLink || !!this.hasMessageLink;
  }
  handleCloseClick() {
    this.close();
  }
  close() {
    this.closing = true;
  }
  handleAnimationEnd() {
    if (this.closing) {
      this.closing = false;
      this.hide = true;
      const event = new CustomEvent('close', {
        bubbles: true,
        detail: {
          isFocused: this._isFocused
        }
      });
      this.dispatchEvent(event);
    }
  }
  handleFocusIn() {
    this._isFocused = true;
  }
  handleFocusOut() {
    this._isFocused = false;
  }
  registerWithContainer() {
    const event = new CustomEvent('privatetoastregister', {
      bubbles: true,
      cancelable: true,
      detail: {
        unregisterCallback: unregisterCallback => {
          this.unregisterCallback = unregisterCallback;
        }
      }
    });
    this.dispatchEvent(event);
  }
  reset() {
    if (this.unregisterCallback) {
      this.unregisterCallback();
    }
    this._isFocused = false;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
    if (this._portraitMatchMedia) {
      this._portraitMatchMedia.removeEventListener('change', this._screenOrientationChangeHandler);
    }
    if (this._screenOrientationChangeHandler) {
      this._screenOrientationChangeHandler = null;
    }
  }
  setupResizeObserver() {
    if (this._resizeObserver) {
      return;
    }
    const resizeObserver = new LightningResizeObserver(() => {
      if (this.isConnected) {
        this.determineSmallerScreen();
      }
    });
    resizeObserver.observe(this.template.host);
    this._resizeObserver = resizeObserver;
  }
  addOrientationChangeListener() {
    assertContext(this);
    this._portraitMatchMedia = window.matchMedia('(orientation: portrait)');
    this._screenOrientationChangeHandler = this.determineSmallerScreen.bind(this);
    this._portraitMatchMedia.addEventListener('change', this._screenOrientationChangeHandler);
  }
  determineSmallerScreen() {
    const browserWidth = document && document.documentElement && document.documentElement.clientWidth || window.innerWidth;
    const isSmallerBrowserWidth = browserWidth <= MIN_BROWSER_WIDTH;
    if (isSmallerBrowserWidth !== this._isSmallerBrowserWidth) {
      this._isSmallerBrowserWidth = isSmallerBrowserWidth;
    }
  }
  determineSmallFormFactor() {
    if (formFactorPropertyName === 'Small') {
      this._isSmallFormFactor = true;
    }
  }
  constructor() {
    super();
    this._variant = DEFAULT_TOAST_VARIANT;
    this._mode = void 0;
    this.timeoutId = null;
    this.unregisterCallback = null;
    this.firstRender = true;
    this.closing = false;
    this.hide = false;
    this._isFocused = false;
    this.closeButtonTitleText = closeButtonTitleText;
    this.assistiveText = isMacOS || isiOS ? macNavigationAssistiveText : genericNavigationAssistiveText;
    this._label = void 0;
    this._message = void 0;
    this._resizeObserver = void 0;
    this._isSmallFormFactor = void 0;
    this._portraitMatchMedia = void 0;
    this._screenOrientationChangeHandler = void 0;
    this._isSmallerBrowserWidth = void 0;
    this.labelLinks = void 0;
    this.messageLinks = void 0;
    setContext(this);
  }
  connectedCallback() {
    super.connectedCallback();
    this.registerWithContainer();
    this.determineSmallerScreen();
    this.determineSmallFormFactor();
    this.setupResizeObserver();
    this.addOrientationChangeListener();
  }
  renderedCallback() {
    if (this.firstRender) {
      this.firstRender = false;
      const hasLink = this.hasLink();
      const duration = hasLink ? DURATION_LINK : DURATION_NO_LINK;
      if (!this._mode) {
        this._mode = this.calculateDefaultMode(hasLink);
      }
      if (this._mode !== MODE_STICKY) {
        this.timeoutId = setTimeout(() => {
          this.close();
          this.timeoutId = null;
        }, duration);
      }
      const regionAttributeName = getCurrentRegionAttributeName();
      if (regionAttributeName) {
        this.toastElement.setAttribute(regionAttributeName, '');
      }
    }
  }
  disconnectedCallback() {
    this.reset();
  }
  static show(config, source) {
    if (!import.meta.env.SSR) {
      ToastContainer.instance();
      const event = new ShowToastEvent({
        ...config,
        toast: this,
        source
      });
      if (source) {
        source.dispatchEvent(event);
      } else {
        document.body.dispatchEvent(event);
      }
    }
  }
  /*LWC compiler v9.5.3*/
}
Toast[instanceName] = 'lightning-toast';
Toast[properties] = ['variant', 'mode', 'label', 'labelLinks', 'message', 'messageLinks'];
Toast[requiredProperties] = ['label'];
_registerDecorators(Toast, {
  publicProps: {
    labelLinks: {
      config: 0
    },
    messageLinks: {
      config: 0
    },
    label: {
      config: 3
    },
    message: {
      config: 3
    },
    variant: {
      config: 3
    },
    mode: {
      config: 3
    }
  },
  publicMethods: ["focus"],
  track: {
    _mode: 1,
    _label: 1,
    _message: 1,
    _resizeObserver: 1,
    _isSmallFormFactor: 1,
    _portraitMatchMedia: 1,
    _screenOrientationChangeHandler: 1,
    _isSmallerBrowserWidth: 1
  },
  fields: ["_variant", "timeoutId", "unregisterCallback", "firstRender", "closing", "hide", "_isFocused", "closeButtonTitleText", "assistiveText"]
});
const __lwc_component_class_internal = _registerComponent(Toast, {
  tmpl: _tmpl,
  sel: "lightning-toast",
  apiVersion: 66
});
export default __lwc_component_class_internal;