import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./treeItem.html";
import { registerComponent as _registerComponent } from "lwc";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import labelCollapseBranch from '@salesforce/label/LightningTree.collapseBranch';
import labelExpandBranch from '@salesforce/label/LightningTree.expandBranch';
import { classSet } from 'lightning/utils';
import { isRTL, keyCodes, sanitizeURL } from 'lightning/utilsPrivate';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
const i18n = {
  collapseBranch: labelCollapseBranch,
  expandBranch: labelExpandBranch
};
class LightningTreeItem extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this._children = [];
    this._tabindexes = {};
    this._selected = {};
    this._focusedChild = null;
    this._endIconProps = void 0;
    this.isRoot = false;
    this.label = void 0;
    this.metatext = void 0;
    this.nodeRef = void 0;
    this.isExpanded = void 0;
    this.isDisabled = false;
    this.nodename = void 0;
    this.nodeKey = void 0;
    this.isLeaf = void 0;
    this.selected = void 0;
    this._href = void 0;
  }
  get endIcon() {
    return this._endIconProps;
  }
  set endIcon(value) {
    if (!value) {
      this._endIconProps = undefined;
      return;
    }
    const size = value.iconName.includes('utility') ? 'x-small' : 'small';
    this._endIconProps = Object.assign({
      size
    }, value);
  }
  get childItems() {
    return this._children;
  }
  set childItems(value) {
    this._children = value;
    const childLen = this._children.length;
    for (let i = 0; i < childLen; i++) {
      this.setSelectedAttribute(i, 'false');
    }
  }
  get focusedChild() {
    return this._focusedChild;
  }
  set focusedChild(value) {
    this._focusedChild = value;
  }
  get href() {
    return this._href;
  }
  set href(value) {
    this._href = sanitizeURL(value);
  }
  setSelectedAttribute(childNum, value) {
    this._selected[childNum] = value;
  }
  connectedCallback() {
    super.connectedCallback();
    if (!import.meta.env.SSR) {
      this.dispatchEvent(new CustomEvent('privateregisteritem', {
        composed: true,
        bubbles: true,
        detail: {
          focusCallback: this.makeChildFocusable.bind(this),
          unfocusCallback: this.makeChildUnfocusable.bind(this),
          key: this.nodeKey
        }
      }));
    }
    this.addEventListener('keydown', this.handleKeydown.bind(this));
  }
  renderedCallback() {
    if (typeof this.focusedChild === 'number') {
      const child = this.getNthChildItem(this.focusedChild + 1);
      if (child) {
        child.tabIndex = '0';
      }
    }
  }
  get buttonLabel() {
    if (this.nodeRef?.expanded) {
      return i18n.collapseBranch;
    }
    return i18n.expandBranch;
  }
  get showExpanded() {
    if (!this.nodeRef) {
      return false;
    }
    return !this.isDisabled && this.nodeRef.expanded;
  }
  get computedButtonClass() {
    return classSet('slds-button slds-button_icon slds-m-right_x-small ').add({
      'slds-hidden': this.isLeaf || this.isDisabled
    }).toString();
  }
  get computedTreeItemContentClass() {
    return this.endIcon ? 'content-with-end-icon' : 'slds-has-flexi-truncate';
  }
  get computedIconName() {
    return isRTL() ? 'utility:chevronleft' : 'utility:chevronright';
  }
  get children() {
    return this._children.map((child, idx) => {
      return {
        node: child,
        tabindex: this._tabindexes[idx],
        selected: this._selected[idx]
      };
    });
  }
  preventDefaultAndStopPropagation(event) {
    event.preventDefault();
    event.stopPropagation();
  }
  handleClick(event) {
    if (!this.isDisabled) {
      if (this.href === 'javascript:void(0)') {
        event.preventDefault();
      }
      let target = 'anchor';
      if (event.target.tagName === 'BUTTON' || event.target.tagName === 'LIGHTNING-PRIMITIVE-ICON') {
        target = 'chevron';
      }
      const customEvent = new CustomEvent('privateitemclick', {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          name: this.nodename,
          key: this.nodeKey,
          target
        }
      });
      this.dispatchEvent(customEvent);
    }
  }
  handleKeydown(event) {
    switch (event.keyCode) {
      case keyCodes.space:
      case keyCodes.enter:
        this.preventDefaultAndStopPropagation(event);
        this.template.querySelector('.slds-tree__item a').click();
        break;
      case keyCodes.up:
      case keyCodes.down:
      case keyCodes.right:
      case keyCodes.left:
      case keyCodes.home:
      case keyCodes.end:
        this.preventDefaultAndStopPropagation(event);
        this.dispatchEvent(new CustomEvent('privateitemkeydown', {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: {
            key: this.nodeKey,
            keyCode: event.keyCode
          }
        }));
        break;
      default:
        break;
    }
  }
  makeChildFocusable(childKey, shouldFocus, shouldSelect) {
    const child = this.getImmediateChildItem(childKey);
    if (child) {
      if (child.tabIndex !== '0') {
        child.tabIndex = '0';
      }
      if (shouldFocus) {
        child.focus();
      }
      if (shouldSelect) {
        child.ariaSelected = true;
      }
    }
  }
  makeChildUnfocusable() {
    this.ariaSelected = 'false';
    this.removeAttribute('tabindex');
  }
  getImmediateChildItem(key) {
    return this.template.querySelector("lightning-tree-item[data-key='" + key + "']");
  }
  getNthChildItem(n) {
    return this.template.querySelector('lightning-tree-item:nth-of-type(' + n + ')');
  }
  /*LWC compiler v9.5.3*/
}
LightningTreeItem.validationOptOut = ['class'];
_registerDecorators(LightningTreeItem, {
  publicProps: {
    isRoot: {
      config: 0
    },
    label: {
      config: 0
    },
    metatext: {
      config: 0
    },
    nodeRef: {
      config: 0
    },
    isExpanded: {
      config: 0
    },
    isDisabled: {
      config: 0
    },
    nodename: {
      config: 0
    },
    nodeKey: {
      config: 0
    },
    isLeaf: {
      config: 0
    },
    selected: {
      config: 0
    },
    endIcon: {
      config: 3
    },
    childItems: {
      config: 3
    },
    focusedChild: {
      config: 3
    },
    href: {
      config: 3
    }
  },
  track: {
    _children: 1,
    _tabindexes: 1,
    _selected: 1
  },
  fields: ["_focusedChild", "_endIconProps", "_href"]
});
const __lwc_component_class_internal = _registerComponent(LightningTreeItem, {
  tmpl: _tmpl,
  sel: "lightning-tree-item",
  apiVersion: 66
});
export default __lwc_component_class_internal;