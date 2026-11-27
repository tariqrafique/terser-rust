import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./primitiveTreegridCellToggle.html";
import { registerComponent as _registerComponent } from "lwc";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import labelCollapseBranch from '@salesforce/label/LightningPrimitiveCellTree.collapseBranch';
import labelExpandBranch from '@salesforce/label/LightningPrimitiveCellTree.expandBranch';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { classSet, formatLabel } from 'lightning/utils';
import { normalizeString, normalizeBoolean, isRTL } from 'lightning/utilsPrivate';
import { features } from 'lightning/features';
const i18n = {
  collapseBranch: labelCollapseBranch,
  expandBranch: labelExpandBranch
};
const DEFAULT_SIZE = 'small';
const DEFAULT_VARIANT = 'bare';
class PrivateTreeGridCellToggle extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this.rowKeyValue = void 0;
    this.colKeyValue = void 0;
    this.rowToggleIcon = void 0;
    this.value = void 0;
    this._displayValue = void 0;
    this._urlLabel = void 0;
    this._expanded = false;
    this._hasChildren = false;
    this._size = DEFAULT_SIZE;
    this._variant = DEFAULT_VARIANT;
    this._tabindex = 0;
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('size', this._size);
    this.setAttribute('variant', this._variant);
  }
  get computedButtonClass() {
    return classSet('slds-button slds-button_icon slds-m-right_x-small').add({
      'slds-hidden': !this.hasChildren
    }).toString();
  }
  get computedButtonStyle() {
    const {
      _expanded,
      rowToggleIcon
    } = this;
    if (_expanded && rowToggleIcon?.expanded && (rowToggleIcon.expanded.iconName || rowToggleIcon.expanded.iconSrc)) {
      return 'transform: rotate(-90deg);';
    }
    return null;
  }
  get displayValue() {
    return this._displayValue;
  }
  set displayValue(val) {
    this._displayValue = normalizeString(val) ? val : '';
  }
  get urlLabel() {
    return this._urlLabel;
  }
  set urlLabel(val) {
    this._urlLabel = normalizeString(val) ? val : '';
  }
  get tabIndex() {
    return -1;
  }
  set tabIndex(newValue) {
    this.setAttribute('tabindex', newValue);
    this._tabindex = newValue;
  }
  get buttonTabIndex() {
    return this._tabindex;
  }
  get hasChildren() {
    return this._hasChildren;
  }
  set hasChildren(value) {
    this._hasChildren = normalizeBoolean(value);
  }
  get isExpanded() {
    return this._expanded;
  }
  set isExpanded(value) {
    this._expanded = normalizeBoolean(value);
  }
  get buttonTitle() {
    let title = this.displayValue || this.urlLabel || this.value;
    if (this.isExpanded) {
      return formatLabel(i18n.collapseBranch, title);
    }
    return formatLabel(i18n.expandBranch, title);
  }
  get iconName() {
    const {
      _expanded,
      rowToggleIcon
    } = this;
    if (rowToggleIcon?.iconName) {
      return rowToggleIcon.iconName;
    } else if (_expanded && rowToggleIcon?.expanded?.iconName) {
      return rowToggleIcon.expanded.iconName;
    } else if (!_expanded && rowToggleIcon?.collapsed?.iconName) {
      return rowToggleIcon.collapsed.iconName;
    }
    return features.enableTreeGridRTLFix && isRTL() ? 'utility:chevronleft' : 'utility:chevronright';
  }
  get iconSrc() {
    const {
      _expanded,
      rowToggleIcon
    } = this;
    if (rowToggleIcon?.iconSrc) {
      return rowToggleIcon.iconSrc;
    } else if (_expanded && rowToggleIcon?.expanded?.iconSrc) {
      return rowToggleIcon.expanded.iconSrc;
    } else if (!_expanded && rowToggleIcon?.collapsed?.iconSrc) {
      return rowToggleIcon.collapsed.iconSrc;
    }
    return null;
  }
  handleChevronClick() {
    const customEvent = new CustomEvent('privatetogglecell', {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        name: this.rowKeyValue,
        nextState: this.isExpanded ? false : true
      }
    });
    this.dispatchEvent(customEvent);
  }
  focus() {
    this.refs.button.focus();
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(PrivateTreeGridCellToggle, {
  publicProps: {
    rowKeyValue: {
      config: 0
    },
    colKeyValue: {
      config: 0
    },
    rowToggleIcon: {
      config: 0
    },
    value: {
      config: 0
    },
    displayValue: {
      config: 3
    },
    urlLabel: {
      config: 3
    },
    tabIndex: {
      config: 3
    },
    hasChildren: {
      config: 3
    },
    isExpanded: {
      config: 3
    }
  },
  publicMethods: ["focus"],
  track: {
    _displayValue: 1,
    _urlLabel: 1
  },
  fields: ["_expanded", "_hasChildren", "_size", "_variant", "_tabindex"]
});
const __lwc_component_class_internal = _registerComponent(PrivateTreeGridCellToggle, {
  tmpl: _tmpl,
  sel: "lightning-primitive-treegrid-cell-toggle",
  apiVersion: 66
});
export default __lwc_component_class_internal;