import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./primitiveColumnSorter.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import moveUpTooltip from '@salesforce/label/LightningPrimitiveColumnSorter.moveUpTooltip';
import moveDownTooltip from '@salesforce/label/LightningPrimitiveColumnSorter.moveDownTooltip';
import dropdownPlaceholder from '@salesforce/label/LightningPrimitiveColumnSorter.dropdownPlaceholder';
import ascending from '@salesforce/label/LightningPrimitiveColumnSorter.ascending';
import descending from '@salesforce/label/LightningPrimitiveColumnSorter.descending';
import missingValueValidation from '@salesforce/label/LightningPrimitiveColumnSorter.missingValueValidation';
import deleteButtonAltText from '@salesforce/label/LightningPrimitiveColumnSorter.deleteButtonAltText';
import fieldsetLegend from '@salesforce/label/LightningPrimitiveColumnSorter.fieldsetLegend';
import arrowUpAltText from '@salesforce/label/LightningPrimitiveColumnSorter.arrowUpAltText';
import arrowDownAltText from '@salesforce/label/LightningPrimitiveColumnSorter.arrowDownAltText';
import { features } from 'lightning/features';
const i18n = {
  moveUpTooltip,
  moveDownTooltip,
  dropdownPlaceholder,
  ascending,
  descending,
  missingValueValidation,
  deleteButtonAltText,
  fieldsetLegend,
  arrowUpAltText,
  arrowDownAltText
};
class PrimitiveColumnSorter extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this.firstRule = void 0;
    this.lastRule = void 0;
    this.rule = void 0;
    this.columns = void 0;
    this.index = void 0;
    this._combobox = void 0;
  }
  get combobox() {
    if (!this._combobox) {
      this._combobox = this.refs.combobox;
    }
    return this._combobox;
  }
  get i18n() {
    return i18n;
  }
  get groupName() {
    return `radioGroup_${this.index}`;
  }
  get isAscendingChecked() {
    return this.rule.sortOrder === 'asc';
  }
  get isDescendingChecked() {
    return this.rule.sortOrder === 'desc';
  }
  get isUpDisabled() {
    return this.rule.unselectedInitialRules || this.firstRule;
  }
  get isDownDisabled() {
    return this.rule.unselectedInitialRules || this.lastRule;
  }
  handleColumnSelect(event) {
    this.dispatchEvent(new CustomEvent('selection', {
      detail: {
        index: this.index,
        selectedColumn: event.detail.value,
        sortOrder: this.rule.sortOrder
      }
    }));
  }
  handleOrderChange(event) {
    this.dispatchEvent(new CustomEvent('selection', {
      detail: {
        index: this.index,
        selectedColumn: this.rule.selectedColumn,
        sortOrder: event.target.value
      }
    }));
  }
  handleDelete() {
    this.dispatchEvent(new CustomEvent('delete'));
  }
  handleMoveUp() {
    this.dispatchEvent(new CustomEvent('moveup'));
  }
  handleMoveDown() {
    this.dispatchEvent(new CustomEvent('movedown'));
  }
  get computedAriaLabelledby() {
    return features.enableA11yMultiColSortModal ? 'heading' : undefined;
  }
  get computedGroup() {
    return features.enableA11yMultiColSortModal ? 'group' : undefined;
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(PrimitiveColumnSorter, {
  publicProps: {
    firstRule: {
      config: 0
    },
    lastRule: {
      config: 0
    },
    rule: {
      config: 0
    },
    columns: {
      config: 0
    },
    index: {
      config: 0
    },
    combobox: {
      config: 1
    }
  },
  fields: ["_combobox"]
});
const __lwc_component_class_internal = _registerComponent(PrimitiveColumnSorter, {
  tmpl: _tmpl,
  sel: "lightning-primitive-column-sorter",
  apiVersion: 66
});
export default __lwc_component_class_internal;