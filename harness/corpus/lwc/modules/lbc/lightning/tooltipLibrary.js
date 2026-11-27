/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { createElement } from 'lwc';
import { AutoPosition, Direction } from 'lightning/positionLibrary';
import { assert, getActiveTooltip, guid, normalizeString, setActiveTooltip } from 'lightning/utilsPrivate';
import LightningPrimitiveBubble from 'lightning/primitiveBubble';
import AriaObserver from 'lightning/ariaObserver';
import { features } from 'lightning/features';
export { Direction } from 'lightning/positionLibrary';
export const BUBBLE_PREFIX = `salesforce-lightning-tooltip-bubble`;
const BUBBLE_MODAL_PREFIX = `salesforce-lightning-tooltip-modal-portal`;
const BUBBLE_GUID = guid();
const BUBBLE_ID = `${BUBBLE_PREFIX}_${BUBBLE_GUID}`;
const BUBBLE_MODAL_ID = `${BUBBLE_MODAL_PREFIX}_${BUBBLE_GUID}`;
function isResizeObserverSupported() {
  return window.ResizeObserver != null;
}
let CACHED_BUBBLE_ELEMENT;
let activeTooltip;
function getCachedBubbleElement() {
  if (!CACHED_BUBBLE_ELEMENT) {
    CACHED_BUBBLE_ELEMENT = createElement('lightning-primitive-bubble', {
      is: LightningPrimitiveBubble
    });
    CACHED_BUBBLE_ELEMENT.contentId = BUBBLE_ID;
    CACHED_BUBBLE_ELEMENT.contentModalPortalId = features.enableHelptextA11yInModal ? BUBBLE_MODAL_ID : undefined;
    CACHED_BUBBLE_ELEMENT.style.position = 'absolute';
    CACHED_BUBBLE_ELEMENT.style.minWidth = '75px';
    CACHED_BUBBLE_ELEMENT.disableVisibilityChangeOnLeave = true;
  }
  return CACHED_BUBBLE_ELEMENT;
}
const ARIA_DESCRIBEDBY = 'aria-describedby';
const MODAL_SELECTOR = '[data-modal][aria-modal="true"]';
const MODAL_TOOLTIP_PORTAL_SELECTOR = '[data-modal-tooltip-portal]';
const BUBBLE_BODY_SELECTOR = '.slds-popover__body';
function findTooltipPortalElement(target) {
  if (import.meta.env.SSR || !target) {
    return null;
  }
  const dialog = target.closest?.(MODAL_SELECTOR);
  const HTMLElementCtor = globalThis?.HTMLElement;
  if (!dialog || !HTMLElementCtor || !(dialog instanceof HTMLElementCtor)) {
    return null;
  }
  return dialog.querySelector?.(MODAL_TOOLTIP_PORTAL_SELECTOR);
}
const NUBBIN_SIZE = 16;
const NUBBIN_OFFSET = 24;
export const TooltipType = {
  Info: 'info',
  Toggle: 'toggle'
};
export class Tooltip {
  constructor(value, config) {
    this._autoPosition = null;
    this._disabled = true;
    this._initialized = false;
    this._visible = false;
    this._isFocusEvent = false;
    this._initialResize = true;
    this._ariaObserver = null;
    this._resizeObserver = void 0;
    this._config = {};
    this._value = '';
    this._root = void 0;
    this._target = void 0;
    this._element = void 0;
    this._type = void 0;
    this.boundHandleTooltipMouseLeave = void 0;
    this._modalPortalElement = null;
    this._isTooltipInModal = false;
    this._handleTooltipMouseLeave = event => {
      if (!this._visible) {
        return;
      }
      if (event instanceof MouseEvent && event.clientX && event.clientY) {
        try {
          const target = this._target();
          if (target) {
            const {
              clientX,
              clientY
            } = event;
            const {
              left,
              right,
              top,
              bottom
            } = target.getBoundingClientRect();
            const tolerance = 1;
            if (clientX >= left - tolerance && clientX <= right + tolerance && clientY >= top - tolerance && clientY <= bottom + tolerance) {
              return;
            }
          }
        } catch (ex) {}
      }
      this.hide();
    };
    assert(!!config.target, 'target for tooltip is undefined or missing');
    this.value = value;
    this._root = config.root;
    this._target = config.target;
    this._config = {
      ...config
    };
    this._config.align = config.align || {};
    this._config.targetAlign = config.targetAlign || {};
    this._config.disableAriaDescribedBy = config.disableAriaDescribedBy || false;
    this._type = normalizeString(config.type, {
      fallbackValue: TooltipType.Info,
      validValues: Object.values(TooltipType)
    });
    this._element = config.element;
    if (!import.meta.env.SSR && !this._element) {
      this._element = getCachedBubbleElement;
      const bubbleElement = getCachedBubbleElement();
      if (bubbleElement.parentNode === null) {
        document.body.appendChild(bubbleElement);
      }
    }
    this.handleDocumentTouch = this.handleDocumentTouch.bind(this);
    this.handleEscape = this.handleEscape.bind(this);
    this.hide = this.hide.bind(this);
    if (features.enableTooltipFlashingFix) {
      this.boundHandleTooltipMouseLeave = this._handleTooltipMouseLeave.bind(this);
    }
  }
  detach() {
    this._disabled = true;
  }
  attach() {
    this._disabled = false;
  }
  initialize() {
    const target = this._target();
    if (!this._initialized && target) {
      switch (this._type) {
        case TooltipType.Toggle:
          this.addToggleListeners();
          break;
        case TooltipType.Info:
        default:
          this.addInfoListeners();
          break;
      }
      if (!this._config.disableAriaDescribedBy) {
        this._ariaObserver = new AriaObserver(this._root);
        this._ariaObserver.connect({
          attribute: ARIA_DESCRIBEDBY,
          targetNode: this._target(),
          relatedNodes: this._element()
        });
      }
      this._initialized = true;
    }
  }
  getDescriptionElement() {
    const {
      _modalPortalElement,
      _isTooltipInModal
    } = this;
    return features.enableHelptextA11yInModal && _isTooltipInModal && _modalPortalElement ? _modalPortalElement : this._element();
  }
  disconnect() {
    if (this._ariaObserver) {
      this._ariaObserver.disconnect();
    }
    this._modalPortalElement = null;
    this._isTooltipInModal = false;
    if (this._visible) {
      this.hide();
    }
  }
  addInfoListeners() {
    const target = this._target();
    if (!this._initialized && target) {
      ['mouseenter', 'focus'].forEach(name => target.addEventListener(name, () => this.show()));
      ['mouseleave', 'blur', 'click', 'keydown'].forEach(name => target.addEventListener(name, event => {
        if (!this._visible) {
          return;
        }
        this.hideIfNotSelfCover(event);
        if (event.key === 'Escape') {
          event.stopPropagation();
        }
      }));
    }
  }
  hideIfNotSelfCover(event) {
    if (!this._visible) {
      return;
    }
    const tooltip = this._element();
    if (event.type === 'mouseleave' && event instanceof MouseEvent && event.clientX && event.clientY) {
      try {
        const yOffset = tooltip.align.vertical === 'top' ? 1 : 0;
        const elementMouseIsOver = document.elementFromPoint ? document.elementFromPoint(event.clientX, event.clientY + yOffset) : null;
        if (elementMouseIsOver === this._element()) {
          if (!isResizeObserverSupported()) {
            this.startPositioning();
          }
          return;
        }
      } catch (ex) {}
    }
    this.hide();
  }
  handleDocumentTouch() {
    if (this._visible) {
      this.hide();
    }
  }
  addToggleListeners() {
    const target = this._target();
    if (!this._initialized && target) {
      target.addEventListener('touchstart', e => {
        e.stopPropagation();
        this.toggle();
      });
      ['mouseenter', 'focus'].forEach(eventName => target.addEventListener(eventName, event => this.show(event)));
      ['mouseleave', 'blur'].forEach(eventName => target.addEventListener(eventName, event => this.hideIfNotSelfCover(event)));
      target.addEventListener('keydown', event => {
        if (event.key === 'Escape' && this._visible) {
          this.hideIfNotSelfCover(event);
          event.stopPropagation();
        }
      });
    }
  }
  handleEscape(e) {
    if (features.enableTooltipHoverDismiss && e.key === 'Escape') {
      e.stopPropagation();
      this.hideIfNotSelfCover(e);
    } else if (e.key === 'Escape' && this._isFocusEvent) {
      e.stopPropagation();
      this.hideIfNotSelfCover(e);
    }
  }
  get resizeObserver() {
    if (!this._resizeObserver) {
      this._resizeObserver = this._buildResizeObserver(() => {
        if (this._visible && this._autoPosition) {
          const tooltip = this._element();
          if (!features.enableTooltipHoverDismiss && activeTooltip !== this || features.enableTooltipHoverDismiss && getActiveTooltip() !== this) {
            this.hide(false);
            return;
          }
          this.startPositioning().then(() => {
            if (this._initialResize) {
              if (features.enableTooltipFlashingFix) {
                tooltip.addEventListener('mouseleave', this.boundHandleTooltipMouseLeave);
              } else {
                tooltip.addEventListener('mouseleave', this.hide);
              }
              this._initialResize = false;
            }
          }).catch(() => {});
        }
      });
    }
    return this._resizeObserver;
  }
  show(ev) {
    if (this._disabled || this._visible) {
      return;
    }
    const currentActiveTooltip = features.enableTooltipHoverDismiss ? getActiveTooltip() : activeTooltip;
    if (currentActiveTooltip && currentActiveTooltip !== this && currentActiveTooltip._visible) {
      currentActiveTooltip.hide(false);
    }
    if (features.enableTooltipHoverDismiss) {
      setActiveTooltip(this);
    } else {
      const that = this;
      activeTooltip = that;
    }
    this._isFocusEvent = ev && (ev.type === 'focus' ? true : false);
    this._visible = true;
    this._initialResize = true;
    const tooltip = this._element();
    const target = this._target();
    tooltip.visible = this._visible;
    const {
      _value
    } = this;
    tooltip.content = _value;
    if (!import.meta.env.SSR && target && features.enableHelptextA11yInModal) {
      this._modalPortalElement = null;
      const portal = findTooltipPortalElement(target);
      if (portal?.isConnected) {
        this._modalPortalElement = portal;
        this._isTooltipInModal = true;
        portal.textContent = '';
        portal.setAttribute('id', tooltip.contentModalPortalId);
        portal.removeAttribute('aria-hidden');
        const bubbleBody = tooltip.shadowRoot?.querySelector(BUBBLE_BODY_SELECTOR);
        if (bubbleBody) {
          bubbleBody.setAttribute('aria-hidden', 'true');
        }
        portal.textContent = _value;
      }
    }
    if (this._ariaObserver && this._root && this._root.isConnected) {
      if (features.enableHelptextA11yInModal) {
        this._ariaObserver.connect({
          attribute: ARIA_DESCRIBEDBY,
          targetNode: this._target(),
          relatedNodes: this.getDescriptionElement()
        });
      }
      this._ariaObserver.sync();
    }
    this.startPositioning();
    document.addEventListener('keydown', this.handleEscape);
    document.addEventListener('touchstart', this.handleDocumentTouch);
    this.resizeObserver.observe(tooltip);
  }
  hide(hideBubble = true) {
    this._visible = false;
    const tooltip = this._element();
    const {
      _isTooltipInModal,
      _modalPortalElement
    } = this;
    if (features.enableHelptextA11yInModal && _isTooltipInModal && _modalPortalElement) {
      const portal = _modalPortalElement;
      portal.setAttribute('aria-hidden', 'true');
      portal.removeAttribute('id');
      portal.textContent = '';
      const bubbleBody = tooltip.shadowRoot ? tooltip.shadowRoot.querySelector(BUBBLE_BODY_SELECTOR) : null;
      if (bubbleBody) {
        bubbleBody.removeAttribute('aria-hidden');
      }
      this._isTooltipInModal = false;
      this._modalPortalElement = null;
    }
    if (hideBubble) {
      tooltip.visible = this._visible;
    }
    this.stopPositioning();
    document.removeEventListener('touchstart', this.handleDocumentTouch);
    document.removeEventListener('keydown', this.handleEscape);
    if (features.enableTooltipFlashingFix) {
      tooltip.removeEventListener('mouseleave', this.boundHandleTooltipMouseLeave);
    } else {
      tooltip.removeEventListener('mouseleave', this.hide);
    }
    this.resizeObserver.unobserve(tooltip);
    if (features.enableTooltipHoverDismiss) {
      setActiveTooltip(null);
    } else {
      activeTooltip = null;
    }
  }
  toggle() {
    if (this._visible) {
      this.hide();
    } else {
      this.show();
    }
  }
  get value() {
    return this._value;
  }
  set value(value) {
    this._value = value;
    this._disabled = !value;
  }
  get initialized() {
    return this._initialized;
  }
  get visible() {
    return this._visible;
  }
  startPositioning() {
    if (!this._autoPosition) {
      this._autoPosition = new AutoPosition(this._root);
    }
    const align = {
      horizontal: this._config.align.horizontal || Direction.Left,
      vertical: this._config.align.vertical || Direction.Bottom
    };
    const targetAlign = {
      horizontal: this._config.targetAlign.horizontal || Direction.Left,
      vertical: this._config.targetAlign.vertical || Direction.Top
    };
    const targetBox = this._target().getBoundingClientRect();
    const padLeft = targetBox.width * 0.5 - NUBBIN_OFFSET;
    return this._autoPosition.start({
      target: this._target,
      element: this._element,
      align,
      targetAlign,
      autoFlip: true,
      padTop: NUBBIN_SIZE,
      padLeft
    }).then(autoPositionUpdater => {
      if (autoPositionUpdater) {
        const tooltip = this._element();
        tooltip.align = autoPositionUpdater.config.align;
        tooltip.visible = this._visible;
      }
    });
  }
  stopPositioning() {
    if (this._autoPosition) {
      this._autoPosition.stop();
    }
  }
  _buildResizeObserver(callback) {
    if (isResizeObserverSupported()) {
      return new ResizeObserver(callback);
    }
    return {
      observe() {},
      disconnect() {},
      unobserve() {}
    };
  }
}