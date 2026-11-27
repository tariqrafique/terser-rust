/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
const DELAY_TIMEOUT = 16;
class LightningResizeObserver {
  constructor(resizeCallback) {
    this._resizeObserverAvailable = void 0;
    this._delayedResizeCallback = void 0;
    this._running = void 0;
    this._resizeObserver = void 0;
    this._requestAnimationId = void 0;
    this._hasWindowResizeHandler = void 0;
    this._resizeObserverAvailable = typeof ResizeObserver === 'function';
    this._delayedResizeCallback = () => {
      if (this._running) {
        return;
      }
      this._running = true;
      setTimeout(() => {
        requestAnimationFrame(() => {
          resizeCallback();
          this._running = false;
        });
      }, DELAY_TIMEOUT);
    };
    if (this._resizeObserverAvailable) {
      this._resizeObserver = new ResizeObserver(this._delayedResizeCallback);
    }
  }
  observe(lightningElement) {
    this._requestAnimationId = requestAnimationFrame(() => {
      if (this._resizeObserverAvailable) {
        this._resizeObserver.observe(lightningElement);
      } else if (!this._hasWindowResizeHandler) {
        window.addEventListener('resize', this._delayedResizeCallback);
        this._hasWindowResizeHandler = true;
      }
    });
  }
  disconnect() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
    if (this._requestAnimationId) {
      cancelAnimationFrame(this._requestAnimationId);
    }
    window.removeEventListener('resize', this._delayedResizeCallback);
    this._hasWindowResizeHandler = false;
  }
}

export { LightningResizeObserver };