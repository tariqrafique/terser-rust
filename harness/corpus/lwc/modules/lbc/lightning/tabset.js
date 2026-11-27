import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./tabset.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { normalizeString, isHeadingLevelValid, normalizeBoolean, prototypeMatches } from 'lightning/utilsPrivate';
import { privateContext } from 'lightning/utilsInternal';
import { generateUniqueId } from 'lightning/inputUtils';
import AriaObserver from 'lightning/ariaObserver';
import { classSet } from 'lightning/utils';
import labelTabs from '@salesforce/label/LightningTabs.defaultTabBarAriaLabel';
const tabClassPrefixByVariant = {
  scoped: 'slds-tabs_scoped',
  vertical: 'slds-vertical-tabs',
  standard: 'slds-tabs_default'
};
const {
  setContext,
  assertContext
} = privateContext;
class LightningTabset extends LightningShadowBaseClass {
  get headingLabel() {
    return this._headingLabel ?? null;
  }
  set headingLabel(value) {
    const labelIsPopulated = value && value.trim().length > 0;
    const currentValue = this._headingLabel;
    const nextValue = labelIsPopulated ? value : null;
    this._headingLabel = nextValue;
    if (!this._firstRender) {
      this._headingLabelRemove = currentValue && nextValue === null;
      this._headingLabelAdd = currentValue === null && nextValue;
      this._headingLabelRerender = this._headingLabelRemove || this._headingLabelAdd;
    }
  }
  get headingVisible() {
    return this._headingVisible ?? false;
  }
  set headingVisible(value) {
    this._headingVisible = normalizeBoolean(value);
  }
  get headingLevel() {
    return this._headingLevel ?? 2;
  }
  set headingLevel(level) {
    if (isHeadingLevelValid(level)) {
      this._headingLevel = level;
    }
  }
  get variant() {
    return this._variant;
  }
  set variant(value) {
    this._variant = normalizeString(value, {
      fallbackValue: 'standard',
      validValues: ['scoped', 'vertical']
    });
  }
  get activeTabValue() {
    return this._activeTabValue;
  }
  set activeTabValue(tabValue) {
    const newTabValue = tabValue && String(tabValue);
    if (!newTabValue || this._activeTabValue === newTabValue) {
      return;
    }
    if (this._connected) {
      const tab = this._tabByValue[tabValue];
      if (tab) {
        this._selectTab(tabValue);
      }
    } else {
      this._activeTabValue = newTabValue;
    }
  }
  focus() {
    const tabBar = this.tabBarElem;
    if (tabBar) {
      tabBar.focus();
    }
  }
  addTabRegisterEventListeners() {
    assertContext(this);
    if (!import.meta.env.SSR) {
      this.addEventListener('privatetabregister', this.handleTabRegister.bind(this));
      this.addEventListener('privatetabdatachange', this.handleTabDataChange.bind(this));
    }
  }
  removeTabRegisterEventListeners() {
    assertContext(this);
    if (!import.meta.env.SSR) {
      this.removeEventListener('privatetabregister', this.handleTabRegister.bind(this));
      this.removeEventListener('privatetabdatachange', this.handleTabDataChange.bind(this));
      this._tabBarElem = null;
    }
  }
  constructor() {
    super();
    this._tabHeaders = [];
    this._variant = 'standard';
    this._headingLabel = null;
    this._headingVisible = false;
    this._headingLevel = 2;
    this._rendered = false;
    this._headingLabelRerender = false;
    this._headingLabelRemove = false;
    this._headingLabelAdd = false;
    this._firstRender = true;
    this._rerender = false;
    this._tabBarElem = null;
    this.defaultAriaLabel = labelTabs;
    this.title = void 0;
    this._activeTabValue = void 0;
    this._connected = void 0;
    this._tabByValue = void 0;
    this.ariaObserver = void 0;
    setContext(this);
  }
  connectedCallback() {
    super.connectedCallback();
    this._tabByValue = {};
    this._connected = true;
    this.addTabRegisterEventListeners();
    if (!import.meta.env.SSR) {
      this.ariaObserver = new AriaObserver(this);
    }
  }
  renderedCallback() {
    assertContext(this);
    this._rendered = true;
    this._cacheTabBarElem();
    if (this.nativeShadowAndRerender || this._headingLabelRerender) {
      this._rerender = false;
      this._headingLabelRerender = false;
      this._updateTabBarHeaders(this._tabHeaders);
      this._selectTab(this._activeTabValue);
    }
    if (this.isConnected) {
      this.ariaObserver.sync();
    }
    if (this._firstRender) {
      this._firstRender = false;
    }
  }
  disconnectedCallback() {
    this._connected = false;
    this._rendered = false;
    this.removeTabRegisterEventListeners();
    if (this.ariaObserver) {
      this.ariaObserver.disconnect();
      this.ariaObserver = undefined;
    }
  }
  get computedHeadingClass() {
    const classnames = classSet('slds-tabs_default__header');
    return classnames.add({
      'slds-assistive-text': !this._headingVisible
    }).toString();
  }
  handleTabLinkRegister(event) {
    const tabs = this.tabs;
    event.detail.tabLinks.forEach((tabLink, index) => {
      this.ariaObserver.connect({
        attribute: 'aria-labelledby',
        targetNode: tabs[index],
        relatedNodes: tabLink
      });
    });
  }
  get tabs() {
    return this.querySelectorAll(`[role='tabpanel']`);
  }
  handleTabRegister(event) {
    assertContext(this);
    event.stopPropagation();
    this._rerender = true;
    const tab = event.target;
    tab.role = 'tabpanel';
    const generatedUniqueId = generateUniqueId('tab');
    if (!tab.id) {
      tab.id = generatedUniqueId;
    }
    if (!tab.value) {
      tab.value = generatedUniqueId;
    }
    const tabValue = tab.value;
    tab.dataTabValue = tabValue;
    tab.classList.add(`${tabClassPrefixByVariant[this.variant]}__content`);
    tab.classList.add('slds-hide');
    tab.classList.remove('slds-show');
    const tabs = this.tabs;
    let tabIndex;
    for (tabIndex = 0; tabIndex < tabs.length; tabIndex++) {
      if (tabs[tabIndex].dataTabValue === tabValue) {
        break;
      }
    }
    event.detail.setDeRegistrationCallback(() => {
      if (!this._connected) {
        return;
      }
      const index = this._tabHeaders.findIndex(existingTab => existingTab.value === tabValue);
      if (index >= 0) {
        this._tabHeaders.splice(index, 1);
        this._updateTabBarHeaders(this._tabHeaders);
        this._tabByValue[tabValue] = undefined;
        if (this._activeTabValue === tab.value && this._tabHeaders.length > 0) {
          this._showTabContentForTabValue(this._tabHeaders[0].value);
        }
      }
    });
    this._tabHeaders.splice(tabIndex, 0, {
      value: tabValue,
      label: tab.label,
      node: tab,
      domId: tab.id,
      title: tab.title,
      iconName: tab.iconName,
      iconAlternativeText: tab.iconAssistiveText,
      endIconName: tab.endIconName,
      endIconAlternativeText: tab.endIconAlternativeText,
      showErrorIndicator: tab.showErrorIndicator
    });
    this._updateTabBarHeaders(this._tabHeaders);
    this._tabByValue[tabValue] = tab;
    if (!this._activeTabValue) {
      this._activeTabValue = tab.value;
    }
    if (this._activeTabValue === tab.value && (this.template['synthetic'] || this._rendered)) {
      this._selectTab(tabValue);
    }
  }
  _selectTab(value) {
    this._selectTabHeaderByTabValue(value);
    this._showTabContentForTabValue(value);
  }
  _showTabContentForTabValue(value) {
    const tab = this._tabByValue[value];
    if (!tab) {
      return;
    }
    if (this._activeTabValue) {
      const currentTab = this._tabByValue[this._activeTabValue];
      if (currentTab) {
        currentTab.classList.add('slds-hide');
        currentTab.classList.remove('slds-show');
      }
    }
    this._activeTabValue = tab.value;
    tab.classList.add('slds-show');
    tab.classList.remove('slds-hide');
    tab.loadContent();
  }
  handleTabSelected(event) {
    const selectedTabValue = event.detail.value;
    const tab = this._tabByValue[selectedTabValue];
    if (this._activeTabValue !== tab.value) {
      this._showTabContentForTabValue(selectedTabValue);
    }
  }
  handleTabDataChange(event) {
    const changedTab = event.target;
    const newTabValue = changedTab.value;
    const currentTabValue = changedTab.dataTabValue;
    const matchingTabHeader = this._tabHeaders.find(tabHeader => tabHeader.value === currentTabValue);
    if (matchingTabHeader) {
      matchingTabHeader.label = changedTab.label;
      if (prototypeMatches(matchingTabHeader, Object)) {
        matchingTabHeader.value = newTabValue;
      }
      matchingTabHeader.title = changedTab.title;
      matchingTabHeader.iconName = changedTab.iconName;
      matchingTabHeader.iconAlternativeText = changedTab.iconAssistiveText;
      matchingTabHeader.endIconName = changedTab.endIconName;
      matchingTabHeader.endIconAlternativeText = changedTab.endIconAlternativeText;
      matchingTabHeader.showErrorIndicator = changedTab.showErrorIndicator;
    }
    this._updateTabBarHeaders(this._tabHeaders);
    if (currentTabValue !== newTabValue) {
      const tab = this._tabByValue[currentTabValue];
      if (tab) {
        tab.dataTabValue = newTabValue;
        this._tabByValue[newTabValue] = this._tabByValue[currentTabValue];
        this._tabByValue[currentTabValue] = undefined;
      }
      if (this._activeTabValue === currentTabValue) {
        this._activeTabValue = newTabValue;
      }
    }
  }
  get nativeShadowAndRerender() {
    return (this._rerender || this._firstRender) && !this.template['synthetic'];
  }
  get tabBarElem() {
    if (!import.meta.env.SSR) {
      if (this.nativeShadowAndRerender || this._headingLabelRerender || !this._tabBarElem) {
        this._cacheTabBarElem();
      }
      return this._tabBarElem;
    }
    return null;
  }
  _cacheTabBarElem() {
    if (!import.meta.env.SSR) {
      if (this.nativeShadowAndRerender || this._headingLabelRerender || !this._tabBarElem) {
        this._tabBarElem = this.template.querySelector('lightning-tab-bar');
      }
    }
  }
  _updateTabBarHeaders(headers) {
    const tabBar = this.tabBarElem;
    if (tabBar && (this.template['synthetic'] || this._rendered)) {
      tabBar.tabHeaders = headers.slice();
    }
  }
  _selectTabHeaderByTabValue(value) {
    const tabBar = this.tabBarElem;
    if (!this._connected || !tabBar || !tabBar.selectTabByValue) {
      return;
    }
    tabBar.selectTabByValue(value);
  }
  get computedClass() {
    return tabClassPrefixByVariant[this.variant];
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(LightningTabset, {
  publicProps: {
    title: {
      config: 0
    },
    headingLabel: {
      config: 3
    },
    headingVisible: {
      config: 3
    },
    headingLevel: {
      config: 3
    },
    variant: {
      config: 3
    },
    activeTabValue: {
      config: 3
    }
  },
  publicMethods: ["focus"],
  track: {
    _tabHeaders: 1
  },
  fields: ["_variant", "_headingLabel", "_headingVisible", "_headingLevel", "_rendered", "_headingLabelRerender", "_headingLabelRemove", "_headingLabelAdd", "_firstRender", "_rerender", "_tabBarElem", "defaultAriaLabel", "_activeTabValue", "_connected", "_tabByValue", "ariaObserver"]
});
const __lwc_component_class_internal = _registerComponent(LightningTabset, {
  tmpl: _tmpl,
  sel: "lightning-tabset",
  apiVersion: 66
});
export default __lwc_component_class_internal;