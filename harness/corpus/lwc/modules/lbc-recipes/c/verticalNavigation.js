import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./verticalNavigation.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
import { classSet } from 'c/utils';
import { assert, normalizeBoolean, normalizeString } from 'c/utilsPrivate';
import subPage from '@salesforce/label/c.lightning_LightningVerticalNavigation_subPage';
const ALLOWED_CHILDREN = ['C-VERTICAL-NAVIGATION-ITEM', 'C-VERTICAL-NAVIGATION-ITEM-BADGE', 'C-VERTICAL-NAVIGATION-ITEM-ICON'];
class cVerticalNavigation extends LightningElement {
  constructor(...args) {
    super(...args);
    this._compact = void 0;
    this._shaded = void 0;
    this._selectedItem = void 0;
    this.verticalNavigationItems = [];
  }
  set compact(compact) {
    this._compact = normalizeBoolean(compact);
  }
  get compact() {
    return this._compact || false;
  }
  set shaded(shaded) {
    this._shaded = normalizeBoolean(shaded);
  }
  get shaded() {
    return this._shaded || false;
  }
  set selectedItem(selectedItem) {
    this.selectNavigationItem(normalizeString(selectedItem, {
      toLowerCase: false
    }));
  }
  get selectedItem() {
    return this._selectedItem || '';
  }
  get ariaLabel() {
    return this.privateAriaLabel || subPage;
  }
  set ariaLabel(ariaLabel) {
    this.privateAriaLabel = ariaLabel;
  }
  get computedClass() {
    const classes = classSet('slds-nav-vertical');
    if (this.shaded) {
      classes.add('slds-nav-vertical_shade');
    }
    if (this.compact) {
      classes.add('slds-nav-vertical_compact');
    }
    return classes.toString();
  }
  handleItemRegister(event) {
    event.stopPropagation();
    const target = event.target,
      callbacks = event.detail.callbacks,
      itemName = event.detail.name,
      isItemSelected = this._selectedItem === itemName;
    assert(target.nodeType in ALLOWED_CHILDREN, 'Attempt was made to register unsupported type.');
    if (target.nodeType in ALLOWED_CHILDREN) {
      const navigationItem = {
        name: itemName,
        callbacks
      };
      this.verticalNavigationItems.push(navigationItem);
    }
    if (isItemSelected) {
      callbacks.select();
    }
  }
  handleItemSelect(event) {
    event.stopPropagation();
    this.selectNavigationItem(event.detail.name);
  }
  selectNavigationItem(itemName) {
    const beforeselectevent = new CustomEvent('beforeselect', {
      cancelable: true,
      detail: {
        name: itemName
      }
    });
    this.dispatchEvent(beforeselectevent);
    if (!beforeselectevent.defaultPrevented) {
      this.verticalNavigationItems.forEach(navigationItem => {
        if (navigationItem.name === itemName) {
          navigationItem.callbacks.select();
        } else {
          navigationItem.callbacks.deselect();
        }
      });
      this._selectedItem = itemName;
      this.dispatchEvent(new CustomEvent('select', {
        detail: {
          name: itemName
        }
      }));
    }
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(cVerticalNavigation, {
  publicProps: {
    compact: {
      config: 3
    },
    shaded: {
      config: 3
    },
    selectedItem: {
      config: 3
    }
  },
  track: {
    _compact: 1,
    _shaded: 1,
    _selectedItem: 1
  },
  fields: ["verticalNavigationItems"]
});
const __lwc_component_class_internal = _registerComponent(cVerticalNavigation, {
  tmpl: _tmpl,
  sel: "c-vertical-navigation",
  apiVersion: 66
});
export default __lwc_component_class_internal;