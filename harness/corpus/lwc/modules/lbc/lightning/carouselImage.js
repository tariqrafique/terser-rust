import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./carouselImage.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { assert, guid, sanitizeURL } from 'lightning/utilsPrivate';
import { TouchScroller } from 'lightning/touchScrollLibrary';
import { privateContext } from 'lightning/utilsInternal';
const {
  setContext,
  assertContext
} = privateContext;
class LightningCarouselImage extends LightningShadowBaseClass {
  get src() {
    return this._src;
  }
  set src(value) {
    this._src = sanitizeURL(value);
    this.validateSrc();
  }
  get alternativeText() {
    return this._alternativeText;
  }
  set alternativeText(value) {
    this._alternativeText = value;
    this.validateAlternativeText();
  }
  get href() {
    return this._href;
  }
  set href(value) {
    this._href = sanitizeURL(value);
  }
  constructor() {
    super();
    this.panelElement = void 0;
    this.touchScroller = void 0;
    this._src = void 0;
    this.header = void 0;
    this.description = void 0;
    this._alternativeText = void 0;
    this._href = void 0;
    this.ariaHidden = 'true';
    this.ariaLabelledby = void 0;
    this.computedId = void 0;
    this.tabIndex = '-1';
    this._selected = false;
    this.initialRender = true;
    setContext(this);
    this.selected = false;
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('data-handles-touch', true);
  }
  set selected(value) {
    this._selected = value;
    if (value === true) {
      this.ariaHidden = 'false';
      this.setTabIndex('0');
    } else {
      this.ariaHidden = 'true';
      this.setTabIndex('-1');
    }
  }
  get selected() {
    return this._selected;
  }
  setLabelledBy(value) {
    this.panelElement.setAttribute('aria-labelledby', value);
  }
  setTabIndex(value) {
    this.tabIndex = value;
  }
  select() {
    const privateimageselect = new CustomEvent('privateimageselect', {
      bubbles: true,
      composed: true
    });
    this.selected = true;
    this.dispatchEvent(privateimageselect);
  }
  unselect() {
    this.selected = false;
  }
  isSelected() {
    return this.selected;
  }
  validateAll() {
    this.validateAlternativeText();
    this.validateSrc();
  }
  validateAlternativeText() {
    assert(typeof this._alternativeText === 'string' && this._alternativeText.length, `<lightning-carousel-image> The "alternative-text" attribute value is required.`);
  }
  validateSrc() {
    assert(typeof this._src === 'string' && this._src.length, `<lightning-carousel-image> The "src" attribute value is required.`);
  }
  renderedCallback() {
    assertContext(this);
    if (this.initialRender) {
      this.validateAll();
      this.panelElement = this.template.querySelector('div');
      const privateimageregister = new CustomEvent('privateimageregister', {
        bubbles: true,
        detail: {
          callbacks: {
            select: this.select.bind(this),
            unselect: this.unselect.bind(this),
            isSelected: this.isSelected.bind(this),
            setTabIndex: this.setTabIndex.bind(this),
            setLabelledBy: this.setLabelledBy.bind(this)
          },
          contentId: this.panelElement.getAttribute('id'),
          guid: guid()
        }
      });
      this.classList.add('slds-carousel__panel');
      this.dispatchEvent(privateimageregister);
      const scrollTarget = this.template.querySelector('.content-container');
      this.touchScroller = new TouchScroller(scrollTarget);
      this.initialRender = false;
    }
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(LightningCarouselImage, {
  publicProps: {
    src: {
      config: 3
    },
    header: {
      config: 0
    },
    description: {
      config: 0
    },
    alternativeText: {
      config: 3
    },
    href: {
      config: 3
    }
  },
  track: {
    _src: 1,
    _alternativeText: 1,
    _href: 1,
    ariaHidden: 1,
    ariaLabelledby: 1,
    computedId: 1,
    tabIndex: 1
  },
  fields: ["panelElement", "touchScroller", "_selected", "initialRender"]
});
const __lwc_component_class_internal = _registerComponent(LightningCarouselImage, {
  tmpl: _tmpl,
  sel: "lightning-carousel-image",
  apiVersion: 66
});
export default __lwc_component_class_internal;