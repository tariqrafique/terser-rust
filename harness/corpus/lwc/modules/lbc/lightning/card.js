import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./card.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { classSet } from 'lightning/utils';
import { isNarrow, isBase } from './utils';
import { isHeadingLevelValid } from 'lightning/utilsPrivate';
import orgHasA11yResizeReflowPhase2 from '@salesforce/accessCheck/A11yResizeReflow.orgHasA11yResizeReflowPhase2';
import resizeReflowStyles from './card.lbc.resizereflow.css';
import emptyStylesheet from './card.lbc.empty.css';
class LightningCard extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this.title = void 0;
    this.iconName = void 0;
    this._privateVariant = 'base';
    this._hasTitle = true;
    this._showFooter = true;
    this._privateHeadingAriaLevel = void 0;
    this.privateHeaderLabel = void 0;
    this.hiddenHeader = false;
  }
  set variant(value) {
    if (isNarrow(value) || isBase(value)) {
      this._privateVariant = value;
    } else {
      this._privateVariant = 'base';
    }
  }
  get variant() {
    return this._privateVariant;
  }
  renderedCallback() {
    if (this.footerSlot) {
      this._showFooter = this.footerSlot.assignedElements().length !== 0;
    }
    if (this.titleSlot) {
      const hasSlotTitle = this.titleSlot.assignedElements().length !== 0;
      this._hasTitle = hasSlotTitle || this.hasStringTitle;
    }
  }
  get headingLevel() {
    return this._privateHeadingAriaLevel;
  }
  set headingLevel(value) {
    if (isHeadingLevelValid(value)) {
      this._privateHeadingAriaLevel = value;
    }
  }
  get titleSlot() {
    return this.template.querySelector('slot[name=title]');
  }
  get footerSlot() {
    return this.template.querySelector('slot[name=footer]');
  }
  get computedWrapperClassNames() {
    return classSet('slds-card').add({
      'slds-card_narrow': isNarrow(this._privateVariant)
    });
  }
  get hasIcon() {
    return !!this.iconName;
  }
  get hasStringTitle() {
    return !!this.title;
  }
  get isResizeReflowEnabled() {
    return orgHasA11yResizeReflowPhase2 ? '' : null;
  }
  get label() {
    if (!this._hasTitle || this.hideHeader) {
      return this.privateHeaderLabel;
    }
    return null;
  }
  set label(value) {
    this.privateHeaderLabel = value;
  }
  get computedHidden() {
    if (!this.label && this.hideHeader) {
      console.warn('A `lightning-card` with `hide-header` requires `label` to be set.');
    }
    return !this.hideHeader;
  }
  get hideHeader() {
    return this.hiddenHeader;
  }
  set hideHeader(value) {
    this.hiddenHeader = value;
  }
  /*LWC compiler v9.5.3*/
}
LightningCard.stylesheets = [orgHasA11yResizeReflowPhase2 && resizeReflowStyles || emptyStylesheet];
_registerDecorators(LightningCard, {
  publicProps: {
    title: {
      config: 0
    },
    iconName: {
      config: 0
    },
    variant: {
      config: 3
    },
    headingLevel: {
      config: 3
    },
    label: {
      config: 3
    },
    hideHeader: {
      config: 3
    }
  },
  track: {
    _privateHeadingAriaLevel: 1,
    privateHeaderLabel: 1
  },
  fields: ["_privateVariant", "_hasTitle", "_showFooter", "hiddenHeader"]
});
const __lwc_component_class_internal = _registerComponent(LightningCard, {
  tmpl: _tmpl,
  sel: "lightning-card",
  apiVersion: 66
});
export default __lwc_component_class_internal;