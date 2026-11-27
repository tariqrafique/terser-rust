import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./verticalRecipes.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement, registerComponent as _registerComponent } from 'lwc';
const sections = [{
  label: 'Reports',
  items: [{
    label: 'Recent',
    name: 'default_recent',
    icon: 'utility:clock'
  }, {
    label: 'Created by Me',
    name: 'default_created'
  }, {
    label: 'Public Reports',
    name: 'default_public'
  }, {
    label: 'My P1 Bugs',
    name: 'custom_p1bugs'
  }]
}, {
  label: 'Dashboards',
  items: [{
    label: 'Favorites',
    name: 'default_favorites',
    icon: 'utility:favorite'
  }, {
    label: 'Most Popular',
    name: 'custom_mostpopular'
  }, {
    label: 'Summer Release Metrics',
    name: 'custom_newreleaseadoption'
  }]
}];
class VerticalRecipes extends LightningElement {
  constructor(...args) {
    super(...args);
    this.initiallySelected = 'default_recent';
    this.navigationData = sections;
    this.asyncValidation = void 0;
    this.hasBeenEdited = false;
    this.selectedItem = 'report_1';
    this.selectedItem = 'reports_recent';
    this.currentContent = 'reports_recent';
    this.updatedCount = 12;
  }
  handleSelect(event) {
    const selected = event.detail.name;
    if (selected === 'reports_updated') {
      this.updatedCount = 0;
    }
    this.currentContent = selected;
  }
  handleClick() {
    this.hasBeenEdited = true;
  }
  handleBeforeSelect(event) {
    if (this.hasBeenEdited) {
      // Prevent the onselect handler from running
      event.preventDefault();
      this.asyncValidation = true;

      // Simulate an async operation
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      setTimeout(() => {
        this.hasBeenEdited = false;
        this.selectedItem = event.detail.name;
        this.asyncValidation = false;
      }, 2000);
    }
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(VerticalRecipes, {
  track: {
    asyncValidation: 1,
    hasBeenEdited: 1,
    selectedItem: 1,
    currentContent: 1,
    updatedCount: 1
  },
  fields: ["initiallySelected", "navigationData"]
});
const __lwc_component_class_internal = _registerComponent(VerticalRecipes, {
  tmpl: _tmpl,
  sel: "c-vertical-recipes",
  apiVersion: 66
});
export default __lwc_component_class_internal;