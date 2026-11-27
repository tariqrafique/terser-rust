/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
function classNamesHash(hash, classes) {
  if (typeof classes === 'string') {
    const array = classes.trim().split(/\s+/);
    for (let i = 0, {
        length
      } = array; i < length; i += 1) {
      hash[array[i]] = true;
    }
    return hash;
  }
  return Object.assign(hash, classes);
}
const proto = Object.defineProperties(Object.create(null), {
  add: {
    value(className) {
      return classNamesHash(this, className);
    }
  },
  invert: {
    value() {
      const keys = Object.keys(this);
      for (let i = 0, {
          length
        } = keys; i < length; i += 1) {
        const key = keys[i];
        this[key] = !this[key];
      }
      return this;
    }
  },
  toString: {
    value() {
      let string = '';
      const keys = Object.keys(this);
      for (let i = 0, {
          length
        } = keys; i < length; i += 1) {
        const key = keys[i];
        if (this[key]) {
          string += (string.length ? ' ' : '') + key;
        }
      }
      return string;
    }
  }
});
function classSet(config) {
  return classNamesHash(Object.create(proto), config);
}

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
const inputableNode = /input|select|textarea|button|object/;
function visible(element) {
  if (window.getComputedStyle(element).visibility === 'hidden') {
    return false;
  }
  const {
    width,
    height
  } = element.getBoundingClientRect();
  return width > 0 || height > 0;
}
function focusable(element) {
  const tagName = element.tagName.toLowerCase();
  if (tagName === 'a' && element.href || !element.disabled && inputableNode.test(tagName)) {
    return visible(element);
  }
  return false;
}
function tabbable(element) {
  return element.dataset.navigation === 'enable' || element.tabIndex >= 0 && focusable(element);
}
function queryFocusable(element) {
  const childElements = element.querySelectorAll('*');
  const focusables = [];
  for (let i = 0, {
      length
    } = childElements; i < length; i += 1) {
    const child = childElements[i];
    if (tabbable(child)) {
      focusables.push(child);
    }
  }
  return focusables;
}

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
function formatLabel(str, ...args) {
  let replacements = [];
  if (Array.isArray(args[0])) {
    replacements = args[0];
  } else {
    replacements = args;
  }
  return str.replace(/{(\d+)}/g, (match, i) => {
    const replacement = replacements[i];
    return replacement !== null && replacement !== undefined ? replacement : '';
  });
}

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
const URL_CHECK_REGEX = /^(\/+|\.+|ftp|http(s?):\/\/)/i;
const SSR_PROTOCOL = 'https:';
function isValidUrl(url) {
  return URL_CHECK_REGEX.test(url);
}
function formatUrl(url) {
  const protocol = !import.meta.env.SSR ? window.location.protocol : SSR_PROTOCOL;
  return isValidUrl(url) ? url : `${protocol}//${url}`;
}
const urlRegexString = "((?:(?:https?|ftp):\\/\\/(?:[\\w\\-\\|=%~#\\/+*@\\.,;:\\?!']|&){0,2047}(?:[\\(\\)\\.\\w=\\/+#-]*)[^\\s()\\.<>,;\\[\\]`'\"])|(?:\\b(?:[a-z0-9](?:[-a-z0-9]{0,62}[a-z0-9])?\\.)+(?:AC|AD|AE|AERO|AF|AG|AI|AL|AM|AN|AO|AQ|AR|ARPA|AS|ASIA|AT|AU|AW|AX|AZ|BA|BB|BD|BE|BF|BG|BH|BI|BIZ|BJ|BM|BN|BO|BR|BS|BT|BV|BW|BY|BZ|CA|CAT|CC|CD|CF|CG|CH|CI|CK|CL|CM|CN|CO|COM|COOP|CR|CU|CV|CX|CY|CZ|DE|DJ|DK|DM|DO|DZ|EC|EDU|EE|EG|ER|ES|ET|EU|FI|FJ|FK|FM|FO|FR|GA|GB|GD|GE|GF|GG|GH|GI|GL|GM|GN|GOV|GP|GQ|GR|GS|GT|GU|GW|GY|HK|HM|HN|HR|HT|HU|ID|IE|IL|IM|IN|INFO|INT|IO|IQ|IR|IS|IT|JE|JM|JO|JOBS|JP|KE|KG|KH|KI|KM|KN|KP|KR|KW|KY|KZ|LA|LB|LC|LI|LK|LR|LS|LT|LU|LV|LY|MA|MC|MD|ME|MG|MH|MIL|MK|ML|MM|MN|MO|MOBI|MP|MQ|MR|MS|MT|MU|MUSEUM|MV|MW|MX|MY|MZ|NA|NAME|NC|NE|NET|NF|NG|NI|NL|NO|NP|NR|NU|NZ|OM|ORG|PA|PE|PF|PG|PH|PK|PL|PM|PN|PR|PRO|PS|PT|PW|PY|QA|RE|RO|RS|RU|RW|SA|SB|SC|SD|SE|SG|SH|SI|SJ|SK|SL|SM|SN|SO|SR|ST|SU|SV|SY|SZ|TC|TD|TEL|TF|TG|TH|TJ|TK|TL|TM|TN|TO|TP|TR|TRAVEL|TT|TV|TW|TZ|UA|UG|UK|US|UY|UZ|VA|VC|VE|VG|VI|VN|VU|WF|WS|XN--0ZWM56D|XN--11B5BS3A9AJ6G|XN--80AKHBYKNJ4F|XN--9T4B11YI5A|XN--DEBA0AD|XN--FIQS8S|XN--FIQZ9S|XN--G6W251D|XN--HGBK6AJ7F53BBA|XN--HLCJ6AYA9ESC7A|XN--J6W193G|XN--JXALPDLP|XN--KGBECHTV|XN--KPRW13D|XN--KPRY57D|XN--MGBAAM7A8H|XN--MGBERP4A5D4AR|XN--P1AI|XN--WGBH1C|XN--ZCKZAH|YE|YT|ZA|ZM|ZW)(?!@(?:[a-z0-9](?:[-a-z0-9]{0,62}[a-z0-9])?\\.)+(?:AC|AD|AE|AERO|AF|AG|AI|AL|AM|AN|AO|AQ|AR|ARPA|AS|ASIA|AT|AU|AW|AX|AZ|BA|BB|BD|BE|BF|BG|BH|BI|BIZ|BJ|BM|BN|BO|BR|BS|BT|BV|BW|BY|BZ|CA|CAT|CC|CD|CF|CG|CH|CI|CK|CL|CM|CN|CO|COM|COOP|CR|CU|CV|CX|CY|CZ|DE|DJ|DK|DM|DO|DZ|EC|EDU|EE|EG|ER|ES|ET|EU|FI|FJ|FK|FM|FO|FR|GA|GB|GD|GE|GF|GG|GH|GI|GL|GM|GN|GOV|GP|GQ|GR|GS|GT|GU|GW|GY|HK|HM|HN|HR|HT|HU|ID|IE|IL|IM|IN|INFO|INT|IO|IQ|IR|IS|IT|JE|JM|JO|JOBS|JP|KE|KG|KH|KI|KM|KN|KP|KR|KW|KY|KZ|LA|LB|LC|LI|LK|LR|LS|LT|LU|LV|LY|MA|MC|MD|ME|MG|MH|MIL|MK|ML|MM|MN|MO|MOBI|MP|MQ|MR|MS|MT|MU|MUSEUM|MV|MW|MX|MY|MZ|NA|NAME|NC|NE|NET|NF|NG|NI|NL|NO|NP|NR|NU|NZ|OM|ORG|PA|PE|PF|PG|PH|PK|PL|PM|PN|PR|PRO|PS|PT|PW|PY|QA|RE|RO|RS|RU|RW|SA|SB|SC|SD|SE|SG|SH|SI|SJ|SK|SL|SM|SN|SO|SR|ST|SU|SV|SY|SZ|TC|TD|TEL|TF|TG|TH|TJ|TK|TL|TM|TN|TO|TP|TR|TRAVEL|TT|TV|TW|TZ|UA|UG|UK|US|UY|UZ|VA|VC|VE|VG|VI|VN|VU|WF|WS|XN--0ZWM56D|XN--11B5BS3A9AJ6G|XN--80AKHBYKNJ4F|XN--9T4B11YI5A|XN--DEBA0AD|XN--FIQS8S|XN--FIQZ9S|XN--G6W251D|XN--HGBK6AJ7F53BBA|XN--HLCJ6AYA9ESC7A|XN--J6W193G|XN--JXALPDLP|XN--KGBECHTV|XN--KPRW13D|XN--KPRY57D|XN--MGBAAM7A8H|XN--MGBERP4A5D4AR|XN--P1AI|XN--WGBH1C|XN--ZCKZAH|YE|YT|ZA|ZM|ZW))(?:/[\\w\\-=?/.&;:%~,+@#*]{0,2048}(?:[\\w=/+#-]|\\([^\\s()]*\\)))?(?:$|(?=\\.$)|(?=\\.\\s)|(?=[^\\w\\.]))))";
const emailRegexString = "([\\w-\\.\\+_']{1,64}@(?:[\\w-]){1,255}(?:\\.[\\w-]{1,255}){1,10})";
const newLineRegexString = '(\r\n|\r|\n)';
const tagRegexString = '(<a[\\s]+[^>]+[^/]>[\\s\\S]*?</a>|<a[\\s]+[^>]+/>|' + '<i?frame[\\s]+[^>]+[^/]>[\\s\\S]*?</i?frame>|<i?frame[\\s]+[^>]+/>|' + '<area[\\s]+[^>]+[^/]>[\\s\\S]*?</area>|<area[\\s]+[^>]+/>|' + '<link[\\s]+[^>]+[^/]>[\\s\\S]*?</link>|<link[\\s]+[^>]+/>|' + '<img[\\s]+[^>]+[^/]>[\\s\\S]*?</img>|<img[\\s]+[^>]+>|' + '<form[\\s]+[^>]+[^/]>[\\s\\S]*?</form>|<form[\\s]+[^>]+/>|' + '<body[\\s]+[^>]+[^/]>[\\s\\S]*?</body>|<body[\\s]+[^>]+/>|' + '<head[\\s]+[^>]+[^/]>[\\s\\S]*?</head>|<head[\\s]+[^>]+/>|' + '<input[\\s]+[^>]+[^/]>[\\s\\S]*?</input>|<input[\\s]+[^>]+/>|' + '<button[\\s]+[^>]+[^/]>[\\s\\S]*?</button>|<button[\\s]+[^>]+/>|' + '<blockquote[\\s]+[^>]+[^/]>[\\s\\S]*?</blockquote>|<blockquote[\\s]+[^>]+/>|' + '<q[\\s]+[^>]+[^/]>[\\s\\S]*?</q>|<q[\\s]+[^>]+/>|' + '<del[\\s]+[^>]+[^/]>[\\s\\S]*?</del>|<del[\\s]+[^>]+/>|' + '<ins[\\s]+[^>]+[^/]>[\\s\\S]*?</ins>|<ins[\\s]+[^>]+/>)';
const createHttpHref = function (url) {
  return formatUrl(url);
};
const createEmailHref = function (email) {
  return `mailto:${email}`;
};

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
function linkTextNodes(container) {
  const urlRegex = new RegExp(`^${urlRegexString}/?$`, 'i');
  const emailRegex = new RegExp(`^${emailRegexString}$`, 'i');
  const toReplace = [];
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const currentNode = walker.currentNode;
    const parent = walker.currentNode.parentNode;
    if (parent.nodeName !== 'A') {
      const items = walker.currentNode.nodeValue.split(/(&quot;|;|["']?\s+["']?|["]|[.,!?]+(?=\s|$))/g);
      const fragment = document.createDocumentFragment();
      let hasLink = false;
      items.forEach((text, i) => {
        if (i % 2 === 0) {
          if (text.match(urlRegex)) {
            const a = document.createElement('a');
            a.href = createHttpHref(text);
            a.target = '_blank';
            a.rel = 'noopener';
            a.appendChild(document.createTextNode(text));
            fragment.appendChild(a);
            hasLink = true;
          } else if (text.match(emailRegex)) {
            const a = document.createElement('a');
            a.href = createEmailHref(text);
            a.appendChild(document.createTextNode(text));
            fragment.appendChild(a);
            hasLink = true;
          } else if (text) {
            fragment.appendChild(document.createTextNode(text));
          }
        } else if (text) {
          fragment.appendChild(document.createTextNode(text));
        }
      });
      if (hasLink) {
        toReplace.push({
          parent,
          fragment,
          currentNode
        });
      }
    }
  }
  toReplace.forEach(({
    parent,
    fragment,
    currentNode
  }) => {
    parent.replaceChild(fragment, currentNode);
  });
}

export { classSet, createEmailHref, createHttpHref, emailRegexString, formatLabel, formatUrl, isValidUrl, linkTextNodes, newLineRegexString, queryFocusable, tagRegexString, urlRegexString };