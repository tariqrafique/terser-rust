import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./buttonMenu.html";
import { registerComponent as _registerComponent } from "lwc";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import labelLoading from '@salesforce/label/LightningButtonMenu.loading';
import labelShowMenu from '@salesforce/label/LightningButtonMenu.showMenu';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { classSet } from 'lightning/utils';
import { normalizeBoolean, normalizeString, observePosition, animationFrame, timeout, buttonGroupOrderClass, reflectAttribute } from 'lightning/utilsPrivate';
import { privateContext } from 'lightning/utilsInternal';
import { handleKeyDownOnMenuItem, handleKeyDownOnMenuTrigger } from './keyboard';
import { Direction, startPositioning, stopPositioning } from 'lightning/positionLibrary';
import { Tooltip } from 'lightning/tooltipLibrary';
import { features } from 'lightning/features';
const {
  setContext,
  assertContext
} = privateContext;
const i18n = {
  loading: labelLoading,
  showMenu: labelShowMenu
};
const menuItemTagName = 'LIGHTNING-MENU-ITEM';
const menuItemClasSelector = `.slds-dropdown__list .slds-dropdown__item`;
const menuItemSelectors = `${menuItemTagName}, ${menuItemClasSelector}`;
const validMenuAlignments = ['left', 'center', 'right', 'bottom-left', 'bottom-center', 'bottom-right'];
validMenuAlignments.push(...['auto', 'auto-right', 'auto-left']);
const buttonPartsLabel = 'button';
const buttonPartsNoLabel = 'button button-icon';
class LightningButtonMenu extends LightningShadowBaseClass {
  get iconName() {
    return this._iconName;
  }
  set iconName(iconName) {
    this._iconName = iconName;
    reflectAttribute(this, 'icon-name', this._iconName);
  }
  get label() {
    return this._label;
  }
  set label(label) {
    this._label = label;
    this.buttonParts = label ? buttonPartsLabel : buttonPartsNoLabel;
    reflectAttribute(this, 'label', this._label);
  }
  constructor() {
    super();
    this._hasOpenedAndFocused = false;
    this._tooltipCreated = false;
    this.internalDatatableActionsMenu = false;
    this.iconSize = 'medium';
    this.value = '';
    this.alternativeText = i18n.showMenu;
    this.loadingStateAlternativeText = i18n.loading;
    this.draftAlternativeText = void 0;
    this.groupOrder = '';
    this.tabIndex = void 0;
    this._accesskey = null;
    this._disabled = false;
    this._dropdownVisible = false;
    this._dropdownOpened = false;
    this._nubbin = false;
    this._title = null;
    this._isDraft = false;
    this._isLoading = false;
    this._focusOnIndexDuringRenderedCallback = null;
    this._tabindex = 0;
    this._order = null;
    this._variant = 'border';
    this._iconName = 'utility:down';
    this._label = null;
    this.buttonParts = buttonPartsNoLabel;
    this._positioning = false;
    this._menuAlignment = 'left';
    this._boundingRect = {};
    this._tooltip = null;
    this._needsFocusAfterRender = false;
    setContext(this);
  }
  connectedCallback() {
    super.connectedCallback();
    this._connected = true;
    this.keyboardInterface = this.menuKeyboardInterface();
    this.classList.add('slds-dropdown-trigger', 'slds-dropdown-trigger_click');
    if (this.isDraft) {
      this.classList.add('slds-is-unsaved');
    }
  }
  disconnectedCallback() {
    this._connected = false;
    if (this._tooltip) {
      this._tooltip.disconnect();
    }
  }
  renderedCallback() {
    this.initTooltip();
    if (!this._positioning && this._dropdownVisible) {
      this.focusOnMenuItemAfterRender();
    }
  }
  get iconSvgClass() {
    if (this.label) {
      return 'slds-button__icon slds-button__icon_right';
    }
    return 'slds-button__icon';
  }
  get variant() {
    return this._variant;
  }
  set variant(variant) {
    this._variant = normalizeString(variant, {
      fallbackValue: 'border',
      validValues: ['border', 'border-inverse', 'border-filled', 'bare', 'bare-inverse', 'container']
    });
    reflectAttribute(this, 'variant', this._variant);
  }
  get menuAlignment() {
    return this._menuAlignment;
  }
  set menuAlignment(value) {
    this._menuAlignment = normalizeString(value, {
      fallbackValue: 'left',
      validValues: validMenuAlignments
    });
  }
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = normalizeBoolean(value);
  }
  get nubbin() {
    return this._nubbin;
  }
  set nubbin(value) {
    this._nubbin = normalizeBoolean(value);
  }
  get title() {
    return this._title;
  }
  set title(newValue) {
    this._title = newValue;
  }
  get isDraft() {
    return this._isDraft;
  }
  set isDraft(value) {
    this._isDraft = normalizeBoolean(value);
  }
  get isLoading() {
    return this._isLoading;
  }
  set isLoading(value) {
    const normalizedValue = normalizeBoolean(value);
    if (this.isAutoAlignment() && !import.meta.env.SSR) {
      this.stopPositioning();
      if (this._isLoading && !normalizedValue) {
        this.startPositioning();
      }
    }
    this._isLoading = normalizedValue;
  }
  get accessKey() {
    return this._accesskey;
  }
  set accessKey(newValue) {
    this._accesskey = newValue;
  }
  get tooltip() {
    return this._tooltip ? this._tooltip.value : undefined;
  }
  set tooltip(value) {
    assertContext(this);
    if (this._tooltip) {
      this._tooltip.value = value;
    } else if (value && !import.meta.env.SSR) {
      this._tooltip = new Tooltip(value, {
        root: this,
        target: () => this.template.querySelector('button')
      });
      this._tooltip.initialize();
    }
  }
  focus() {
    if (this._connected) {
      this.focusOnButton();
    }
  }
  click() {
    if (this._connected) {
      this.template.querySelector('button').click();
    }
  }
  get computedAriaExpanded() {
    return String(this._dropdownVisible);
  }
  initTooltip() {
    if (this._tooltip && !this._tooltip.initialized) {
      this._tooltip.initialize();
    }
  }
  focusOnMenuItemAfterRender() {
    let focusOnIndex = this._focusOnIndexDuringRenderedCallback || 0;
    const menuItems = this.getMenuItems();
    if (focusOnIndex === 'LAST') {
      focusOnIndex = menuItems.length - 1;
      if (focusOnIndex < 0) {
        focusOnIndex = 'LAST';
      }
    }
    if (focusOnIndex !== 'LAST') {
      if (focusOnIndex > menuItems.length - 1 && menuItems.length > 0) {
        focusOnIndex = menuItems.length - 1;
      }
      this.focusOnMenuItem(focusOnIndex);
      this._focusOnIndexDuringRenderedCallback = null;
    }
  }
  get computedAccessKey() {
    return this._accesskey;
  }
  get computedTitle() {
    return this._title;
  }
  get computedAlternativeText() {
    return this.alternativeText || i18n.showMenu;
  }
  get computedLoadingStateAlternativeText() {
    return this.loadingStateAlternativeText || i18n.loading;
  }
  get computedButtonClass() {
    const isDropdownIcon = !this.computedShowDownIcon;
    const isBare = this.variant === 'bare' || this.variant === 'bare-inverse';
    const classes = classSet('slds-button');
    if (this.label) {
      classes.add({
        'slds-button_neutral': this.variant === 'border',
        'slds-button_inverse': this.variant === 'border-inverse'
      });
    } else {
      const useMoreContainer = this.variant === 'container' || this.variant === 'bare-inverse' || this.variant === 'border-inverse' || this.variant === 'bare';
      classes.add({
        'slds-button_icon': !isDropdownIcon,
        'slds-button_icon-bare': isBare,
        'slds-button_icon-more': !useMoreContainer && !isDropdownIcon,
        'slds-button_icon-container-more': useMoreContainer && !isDropdownIcon,
        'slds-button_icon-container': this.variant === 'container' && isDropdownIcon,
        'slds-button_icon-border': this.variant === 'border' && isDropdownIcon,
        'slds-button_icon-border-filled': this.variant === 'border-filled',
        'fix-slds-button_icon-border-filled': this.variant === 'border-filled' && this.groupOrder !== '',
        'slds-button_icon-border-inverse': this.variant === 'border-inverse',
        'slds-button_icon-inverse': this.variant === 'bare-inverse',
        'slds-button_icon-xx-small': this.iconSize === 'xx-small' && !isBare,
        'slds-button_icon-x-small': this.iconSize === 'x-small' && !isBare,
        'slds-button_icon-small': this.iconSize === 'small' && !isBare,
        'slds-button_icon-large': this.iconSize === 'large' && !isBare
      });
    }
    return classes.add(buttonGroupOrderClass(this.groupOrder)).toString();
  }
  get computedShowDownIcon() {
    return !(this.iconName === 'utility:down' || this.iconName === 'utility:chevrondown' || this.internalDatatableActionsMenu && this.iconName === 'utility:threedots');
  }
  get computedDropdownClass() {
    return classSet('slds-dropdown').add({
      'slds-dropdown_left': this.menuAlignment === 'left' || this.isAutoAlignment(),
      'slds-dropdown_center': this.menuAlignment === 'center',
      'slds-dropdown_right': this.menuAlignment === 'right',
      'slds-dropdown_bottom': this.menuAlignment === 'bottom-center',
      'slds-dropdown_bottom slds-dropdown_right slds-dropdown_bottom-right': this.menuAlignment === 'bottom-right',
      'slds-dropdown_bottom slds-dropdown_left slds-dropdown_bottom-left': this.menuAlignment === 'bottom-left',
      'slds-nubbin_top-left': this.nubbin && this.menuAlignment === 'left',
      'slds-nubbin_top-right': this.nubbin && this.menuAlignment === 'right',
      'slds-nubbin_top': this.nubbin && this.menuAlignment === 'center',
      'slds-nubbin_bottom-left': this.nubbin && this.menuAlignment === 'bottom-left',
      'slds-nubbin_bottom-right': this.nubbin && this.menuAlignment === 'bottom-right',
      'slds-nubbin_bottom': this.nubbin && this.menuAlignment === 'bottom-center',
      'slds-p-vertical_large': this.isLoading
    }).toString();
  }
  handleMenuItemPrivateSelect(event) {
    if (this._dropdownVisible) {
      this.toggleMenuVisibility();
      this.focusOnButton();
    }
    event.stopPropagation();
    const cancelled = !this.dispatchSelect(event);
    if (cancelled) {
      event.preventDefault();
    }
  }
  dispatchSelect(event) {
    return this.dispatchEvent(new CustomEvent('select', {
      cancelable: true,
      detail: {
        value: event.detail.value
      }
    }));
  }
  handleButtonClick() {
    this.allowBlur();
    this.toggleMenuVisibility();
    this.focusOnButton();
  }
  handleButtonKeyDown(event) {
    handleKeyDownOnMenuTrigger(event, this.keyboardInterface);
  }
  handleButtonMouseDown(event) {
    const mainButton = 0;
    if (event.button === mainButton) {
      this.cancelBlur();
    }
  }
  handleDropdownMouseDown(event) {
    const mainButton = 0;
    if (event.button === mainButton) {
      this.cancelBlur();
    }
  }
  handleDropdownMouseUp() {
    this.allowBlur();
  }
  handleDropdownMouseLeave() {
    if (features.enableDropdownCloseDelay) {
      const isOpenAndLoaded = this._hasOpenedAndFocused || !this._isLoading && !this.getMenuItems().length;
      if (!this._menuHasFocus && isOpenAndLoaded) {
        this.close();
      }
    } else if (!this._menuHasFocus) {
      this.close();
    }
  }
  handleDropdownScroll(event) {
    event.stopPropagation();
  }
  focusOnButton() {
    this.template.querySelector('button').focus();
  }
  focusOnMenuItem(itemIndex) {
    if (this._dropdownVisible) {
      const menuItem = this.getMenuItemByIndex(itemIndex);
      this.cancelBlurAndFocusOnMenuItem(menuItem);
    }
  }
  isAutoAlignment() {
    return this.menuAlignment.startsWith('auto');
  }
  startPositioning() {
    if (!this.isAutoAlignment()) {
      return Promise.resolve();
    }
    this._hasOpenedAndFocused = false;
    this._positioning = true;
    const align = {
      horizontal: Direction.Left,
      vertical: Direction.Top
    };
    const targetAlign = {
      horizontal: Direction.Left,
      vertical: Direction.Bottom
    };
    let autoFlip = true;
    let autoFlipVertical;
    if (this.menuAlignment === 'auto-right') {
      align.horizontal = Direction.Right;
      targetAlign.horizontal = Direction.Right;
    }
    if (this.menuAlignment === 'auto-right' || this.menuAlignment === 'auto-left') {
      autoFlip = false;
      autoFlipVertical = true;
    }
    return animationFrame().then(() => {
      this.stopPositioning();
      this._autoPosition = startPositioning(this, {
        target: () => this.template.querySelector('button'),
        element: () => this.template.querySelector('.slds-dropdown'),
        align,
        targetAlign,
        autoFlip,
        autoFlipVertical,
        scrollableParentBound: true,
        keepInViewport: true
      }, true);
      if (this._autoPosition) {
        return this._autoPosition.reposition();
      }
      return Promise.reject();
    }).then(() => {
      this._needsFocusAfterRender = true;
      return timeout(0);
    }).then(() => {
      this._positioning = false;
      if (this._needsFocusAfterRender) {
        this.focusOnMenuItemAfterRender();
        this._needsFocusAfterRender = false;
      }
    });
  }
  stopPositioning() {
    if (this._autoPosition) {
      stopPositioning(this._autoPosition);
      this._autoPosition = null;
    }
    this._positioning = false;
  }
  toggleMenuVisibility() {
    if (!this.disabled) {
      this._dropdownVisible = !this._dropdownVisible;
      if (!this._dropdownOpened && this._dropdownVisible) {
        this._dropdownOpened = true;
      }
      if (this._dropdownVisible) {
        this.startPositioning();
        this.dispatchEvent(new CustomEvent('open'));
        this._boundingRect = this.getBoundingClientRect();
        this.pollBoundingRect();
      } else {
        this.stopPositioning();
        this.dispatchEvent(new CustomEvent('close'));
      }
      this.classList.toggle('slds-is-open');
    }
  }
  getChildNodes(element, selector) {
    if (!element) {
      return [];
    }
    if (element.matches && element.matches(selector)) {
      return [element];
    }
    return Array.from(element.childNodes).reduce((arr, node) => {
      return [...arr, ...this.getChildNodes(node, selector)];
    }, []);
  }
  getMenuItems() {
    return this.getChildNodes(this, menuItemSelectors);
  }
  getMenuItemByIndex(index) {
    assertContext(this);
    return this.getMenuItems()[index];
  }
  findMenuItemIndex(menuItemElement) {
    return this.getMenuItems().indexOf(menuItemElement);
  }
  findMenuItemFromEventTarget(element) {
    let currentNode = element;
    const stopAtElement = this.template.querySelector("[role='menu']");
    while (currentNode !== stopAtElement) {
      if (currentNode.tagName === menuItemTagName) {
        return currentNode;
      }
      if (currentNode.parentNode) {
        currentNode = currentNode.parentNode;
      } else {
        return null;
      }
    }
    return null;
  }
  handleKeyOnMenuItem(event) {
    const menuItem = this.findMenuItemFromEventTarget(event.target);
    if (menuItem) {
      handleKeyDownOnMenuItem(event, this.findMenuItemIndex(menuItem), this.keyboardInterface);
    }
  }
  handleMouseOverOnMenuItem(event) {
    const menuItem = this.findMenuItemFromEventTarget(event.target);
    if (menuItem) {
      const menuItemIndex = this.findMenuItemIndex(menuItem);
      this.focusOnMenuItem(menuItemIndex);
    }
  }
  cancelBlurAndFocusOnMenuItem(menuItem) {
    if (menuItem) {
      this.cancelBlur();
      menuItem.focus();
    }
  }
  handleFocus() {
    this.dispatchEvent(new CustomEvent('focus'));
  }
  handlePrivateBlur(event) {
    if (event.detail.relatedTarget) {
      const menuItem = this.findMenuItemFromEventTarget(event.detail.relatedTarget);
      if (menuItem) {
        this.cancelBlur();
      }
    }
    event.stopPropagation();
    this.handleBlur();
    this._menuHasFocus = false;
  }
  handlePrivateFocus(event) {
    event.stopPropagation();
    this.allowBlur();
    this._menuHasFocus = true;
    this._hasOpenedAndFocused = true;
  }
  handleBlur() {
    if (this._cancelBlur) {
      return;
    }
    if (this._dropdownVisible) {
      this.toggleMenuVisibility();
    }
    this.dispatchEvent(new CustomEvent('blur'));
  }
  allowBlur() {
    this._cancelBlur = false;
  }
  cancelBlur() {
    this._cancelBlur = true;
  }
  menuKeyboardInterface() {
    const that = this;
    return {
      getTotalMenuItems() {
        return that.getMenuItems().length;
      },
      focusOnIndex(index) {
        that.focusOnMenuItem(index);
      },
      setNextFocusIndex(index) {
        that._focusOnIndexDuringRenderedCallback = index;
      },
      returnFocus() {
        that.focusOnButton();
      },
      isMenuVisible() {
        return that._dropdownVisible;
      },
      toggleMenuVisibility() {
        that.toggleMenuVisibility();
      },
      focusMenuItemWithText(text) {
        const match = [...that.getMenuItems()].filter(menuItem => {
          const label = menuItem.label;
          return label && label.toLowerCase().indexOf(text) === 0;
        });
        if (match.length > 0) {
          that.focusOnMenuItem(match[0]);
        }
      }
    };
  }
  close() {
    if (this._dropdownVisible) {
      this.toggleMenuVisibility();
    }
  }
  pollBoundingRect() {
    if (this.isAutoAlignment() && this._dropdownVisible) {
      setTimeout(() => {
        if (this._connected) {
          observePosition(this, 300, this._boundingRect, () => {
            this.close();
          });
          this.pollBoundingRect();
        }
      }, 250);
    }
  }
  /*LWC compiler v9.5.3*/
}
LightningButtonMenu.validationOptOut = ['class'];
LightningButtonMenu.delegatesFocus = true;
_registerDecorators(LightningButtonMenu, {
  publicProps: {
    internalDatatableActionsMenu: {
      config: 0
    },
    iconSize: {
      config: 0
    },
    iconName: {
      config: 3
    },
    value: {
      config: 0
    },
    alternativeText: {
      config: 0
    },
    loadingStateAlternativeText: {
      config: 0
    },
    label: {
      config: 3
    },
    draftAlternativeText: {
      config: 0
    },
    groupOrder: {
      config: 0
    },
    tabIndex: {
      config: 0
    },
    variant: {
      config: 3
    },
    menuAlignment: {
      config: 3
    },
    disabled: {
      config: 3
    },
    nubbin: {
      config: 3
    },
    title: {
      config: 3
    },
    isDraft: {
      config: 3
    },
    isLoading: {
      config: 3
    },
    accessKey: {
      config: 3
    },
    tooltip: {
      config: 3
    }
  },
  publicMethods: ["focus", "click"],
  track: {
    _accesskey: 1,
    _disabled: 1,
    _dropdownVisible: 1,
    _dropdownOpened: 1,
    _nubbin: 1,
    _title: 1,
    _isDraft: 1,
    _isLoading: 1,
    _focusOnIndexDuringRenderedCallback: 1,
    _tabindex: 1,
    _order: 1,
    _variant: 1,
    _iconName: 1,
    _label: 1,
    buttonParts: 1
  },
  fields: ["_hasOpenedAndFocused", "_tooltipCreated", "_positioning", "_menuAlignment", "_boundingRect", "_tooltip", "_needsFocusAfterRender"]
});
const __lwc_component_class_internal = _registerComponent(LightningButtonMenu, {
  tmpl: _tmpl,
  sel: "lightning-button-menu",
  apiVersion: 66
});
export default __lwc_component_class_internal;