import _tmpl from "./formattedRichText.html";
import { registerDecorators as _registerDecorators, registerDecorators as _registerDecorators2, registerComponent as _registerComponent } from "lwc";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import LightningFormattedRichTextRenderer from 'lightning/formattedRichTextRenderer';
import { privateContext } from 'lightning/utilsInternal';
import { features } from 'lightning/features';
import ssrTemplate from './formattedRichText.ssr.html';
import csrTemplate from './formattedRichText.csr.html';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import nativeStyles from './formattedRichText.css';
import { setHooks } from 'lwc';
import sanitizeHTML from 'lightning/purifyLib';
import { richTextConfig } from './richTextConfig';
import { updateRawLinkInfo } from 'lightning/routingService';
import { normalizeBoolean, hasOnlyAllowedVideoIframes } from 'lightning/utilsPrivate';
import { linkTextNodes } from 'lightning/utils';
import { linkTextNodesSSR } from './linkTextNodesSSR';
import { ensureWcagCompliance } from './colorShiftUtil';
const {
  setContext,
  assertContext
} = privateContext;
try {
  if (features.enableFormattedRichTextNoNestedShadow && import.meta.env.SSR) {
    setHooks({
      sanitizeHtmlContent(rawHTMLString) {
        return rawHTMLString;
      }
    });
  }
} catch (e) {}
function sldsIsV2Enabled() {
  if (!import.meta.env.SSR) {
    return getComputedStyle(document.head).getPropertyValue('--_slds-is-v2-enabled');
  }
  return false;
}
class LightningFormattedRichText extends LightningFormattedRichTextRenderer {
  get enableFormattedRichTextParts() {
    return features.enableFormattedRichTextParts;
  }
  constructor() {
    super();
    this.csrOnly = false;
    if (features.enableAssertContext260) {
      setContext(this);
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.csrOnly = !import.meta.env.SSR && !this.template.querySelector('lightning-formatted-rich-text-renderer');
  }
  renderedCallback() {
    if (this.csrOnly) {
      super.renderedCallback();
    }
  }
  renderRichText() {
    if (features.enableAssertContext260) {
      assertContext(this);
    }
    if (this.csrOnly) {
      super.renderRichText();
      const container = this.container;
      if (this.rawTextIfSanitizerThrewError) {
        const textNode = document.createTextNode(this.rawTextIfSanitizerThrewError);
        while (container.hasChildNodes()) {
          container.removeChild(container.lastChild);
        }
        container.appendChild(textNode);
      } else {
        container.innerHTML = this.richText;
        if (this.linkingRequired) {
          this.linkRichText();
        }
      }
    }
  }
  disconnectedCallback() {
    if (this.csrOnly) {
      super.disconnectedCallback();
    }
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(LightningFormattedRichText, {
  fields: ["csrOnly"]
});
class LightningFormattedRichTextConsolidated extends LightningShadowBaseClass {
  get disableLinkify() {
    return this._disableLinkify;
  }
  set disableLinkify(val) {
    this._disableLinkify = normalizeBoolean(val);
    this.renderRichText();
  }
  get value() {
    return this._value;
  }
  set value(val) {
    this._value = val === undefined || val === null ? '' : String(val);
    this.renderRichText();
  }
  render() {
    return import.meta.env.SSR ? ssrTemplate : csrTemplate;
  }
  constructor() {
    super();
    this.rendered = false;
    this._value = '';
    this._disableLinkify = false;
    this.connected = false;
    this.richText = null;
    this.rawTextIfSanitizerThrewError = null;
    this.serverRenderedContent = null;
    this.linkingRequired = false;
    this._themeKey = 'light';
    this._backgroundColor = null;
    if (features.enableAssertContext260) {
      setContext(this);
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.classList.add('slds-rich-text-editor__output');
    this.connected = true;
    if (!import.meta.env.SSR) {
      this.serverRenderedContent = this.container?.innerHTML;
      if (this.serverRenderedContent) {
        this.richText = this.serverRenderedContent;
      }
    }
  }
  renderedCallback() {
    if (this.linkingRequired) {
      this.linkRichText();
    }
    if (!this.rendered) {
      this.rendered = true;
      if ((features.enableWcagRichTextLight || features.enableWcagRichTextDark) && sldsIsV2Enabled() && !import.meta.env.SSR) {
        const isDark = window.getComputedStyle(this.template.host)?.colorScheme.includes('dark');
        if (isDark) {
          this._themeKey = 'dark';
        }
      }
      this.renderRichText();
    }
  }
  renderRichText() {
    if (features.enableAssertContext260) {
      assertContext(this);
    }
    if (import.meta.env.SSR) {
      this.richText = this.disableLinkify ? this.value : linkTextNodesSSR(this.value);
    }
    if (this.rendered) {
      try {
        this.rawTextIfSanitizerThrewError = null;
        if (this.value) {
          let computedRichTextConfig = richTextConfig;
          if (hasOnlyAllowedVideoIframes(this.value)) {
            computedRichTextConfig = {
              ...richTextConfig,
              ALLOWED_TAGS: richTextConfig.ALLOWED_TAGS.concat(['iframe']),
              ALLOWED_ATTR: richTextConfig.ALLOWED_ATTR.concat(['allowfullscreen'])
            };
          }
          this.richText = sanitizeHTML(this.value, computedRichTextConfig);
          this.linkingRequired = true;
          if (sldsIsV2Enabled()) {
            this.adjustColors();
          }
        } else {
          this.richText = this.value;
        }
      } catch (e) {
        console.warn(e.message);
        this.richText = null;
        this.rawTextIfSanitizerThrewError = this.value;
      }
      if (!import.meta.env.SSR) {
        const container = this.container;
        if (this.rawTextIfSanitizerThrewError) {
          const textNode = document.createTextNode(this.rawTextIfSanitizerThrewError);
          while (container.hasChildNodes()) {
            container.removeChild(container.lastChild);
          }
          container.appendChild(textNode);
        } else {
          container.innerHTML = this.richText;
          if (this.linkingRequired) {
            this.linkRichText();
          }
        }
      }
    }
  }
  disconnectedCallback() {
    this.removeLinkClickListeners();
    this.connected = false;
  }
  handleClick(event) {
    const anchor = event.currentTarget;
    if (anchor === null) {
      return;
    }
    const target = anchor.target;
    const url = anchor.href;
    updateRawLinkInfo(this, {
      url,
      target
    }).then(linkInfo => {
      anchor.href = linkInfo.url;
      linkInfo.dispatcher(event);
    });
  }
  linkRichText() {
    if (!this.disableLinkify) {
      linkTextNodes(this.container);
    }
    this.links.forEach(link => {
      link.addEventListener('click', this.handleClick.bind(this));
    });
    this.linkingRequired = false;
  }
  removeLinkClickListeners() {
    this.links.forEach(link => {
      link.removeEventListener('click', this.handleClick.bind(this));
    });
  }
  get links() {
    return this.container ? [...this.container.querySelectorAll('a')] : [];
  }
  get container() {
    return this.template.querySelector('span');
  }
  get backgroundColor() {
    if (import.meta.env.SSR) {
      this._backgroundColor = 'rgb(255, 255, 255)';
      return this._backgroundColor;
    }
    if (!import.meta.env.SSR) {
      if (this._backgroundColor === null) {
        this._backgroundColor = window.getComputedStyle(this.template.host).backgroundColor;
        if (this._backgroundColor === 'rgba(0, 0, 0, 0)') {
          this.template.host.style.backgroundColor = 'inherit';
          this._backgroundColor = window.getComputedStyle(this.template.host).backgroundColor;
          this.template.host.style.removeProperty('background-color');
        }
      }
    }
    return this._backgroundColor;
  }
  get backgroundColorRgb() {
    const match = this.backgroundColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!match) {
      if (this._themeKey === 'light') {
        return {
          r: 255,
          g: 255,
          b: 255
        };
      }
      return {
        r: 0,
        g: 0,
        b: 0
      };
    }
    return {
      r: parseInt(match[1], 10),
      g: parseInt(match[2], 10),
      b: parseInt(match[3], 10)
    };
  }
  adjustColors() {
    if (this._themeKey === 'light' && !features.enableWcagRichTextLight) {
      return;
    }
    if (this._themeKey === 'dark' && !features.enableWcagRichTextDark) {
      return;
    }
    try {
      const colorRgbRegex = new RegExp('(?<=<[^>]*style="[^"]*)color:\\s*rgb\\((\\d+),\\s*(\\d+),\\s*(\\d+)\\)', 'g');
      this.richText = this.richText.replace(colorRgbRegex, (_, rs, gs, bs) => {
        const r = parseInt(rs, 10),
          g = parseInt(gs, 10),
          b = parseInt(bs, 10);
        const shifted = ensureWcagCompliance(this.backgroundColorRgb, {
          r,
          g,
          b
        });
        if (shifted.r === 255 && shifted.g === 255 && shifted.b === 255) {
          return '';
        }
        if (shifted.r === 0 && shifted.g === 0 && shifted.b === 0) {
          return '';
        }
        return `color:rgb(${shifted.r},${shifted.g},${shifted.b})`;
      });
    } catch (e) {}
  }
  /*LWC compiler v9.5.3*/
}
LightningFormattedRichTextConsolidated.validationOptOut = ['class'];
LightningFormattedRichTextConsolidated.stylesheets = [nativeStyles];
_registerDecorators2(LightningFormattedRichTextConsolidated, {
  publicProps: {
    disableLinkify: {
      config: 3
    },
    value: {
      config: 3
    }
  },
  fields: ["rendered", "_value", "_disableLinkify", "connected", "richText", "rawTextIfSanitizerThrewError", "serverRenderedContent", "linkingRequired", "_themeKey", "_backgroundColor"]
});
let toExport;
if (features.enableFormattedRichTextNoNestedShadow) {
  toExport = LightningFormattedRichTextConsolidated;
} else {
  toExport = LightningFormattedRichText;
}
const __lwc_component_class_internal = _registerComponent(toExport, {
  tmpl: _tmpl,
  sel: "lightning-formatted-rich-text",
  apiVersion: 66
});
export default __lwc_component_class_internal;