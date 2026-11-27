import '@salesforce/i18n/locale';

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

class EventEmitter {
  constructor() {
    this.registry = {};
  }
  on(name, listener) {
    this.registry[name] = this.registry[name] || [];
    this.registry[name].push(listener);
    return this;
  }
  once(name, listener) {
    const doOnce = function () {
      listener.apply(null, arguments);
      this.removeListener(name, doOnce);
    }.bind(this);
    this.on(name, doOnce);
    return this;
  }
  emit(name) {
    const args = Array.prototype.slice.call(arguments, 1);
    const listeners = this.registry[name];
    let count = 0;
    if (listeners) {
      listeners.forEach(listener => {
        count += 1;
        listener.apply(null, args);
      });
    }
    return count > 0;
  }
  removeListener(name, listener) {
    const listeners = this.registry[name];
    if (listeners) {
      for (let i = 0, len = listeners.length; i < len; i += 1) {
        if (listeners[i] === listener) {
          listeners.splice(i, 1);
          return this;
        }
      }
    }
    return this;
  }
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

function normalizeBoolean(value) {
  return typeof value === 'string' || !!value;
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const keyCodes = {
  left: 37,
  up: 38};

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

function getSectionByName(sortedSections, sectionName) {
  let i = 0;
  const n = sortedSections.length;
  while (i < n && sortedSections[i].name !== sectionName) {
    i++;
  }
  return i < n ? sortedSections[i] : null;
}
function getSortedSections(sections) {
  const sortedSections = Object.values(sections);
  sortedSections.sort((a, b) => {
    const position = a.ref.compareDocumentPosition(b.ref);
    if (position & Node.DOCUMENT_POSITION_FOLLOWING || position & Node.DOCUMENT_POSITION_CONTAINED_BY) {
      return -1;
    } else if (position & Node.DOCUMENT_POSITION_PRECEDING || position & Node.DOCUMENT_POSITION_CONTAINS) {
      return 1;
    }
    return 0;
  });
  return sortedSections;
}
function getNextSection(sortedSections, section, isReverseDirection) {
  let idx = sortedSections.indexOf(section);
  if (idx === -1) {
    return null;
  }
  idx += isReverseDirection ? -1 : 1;
  if (idx < 0) {
    idx = sortedSections.length - 1;
  }
  return sortedSections[idx % sortedSections.length];
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

class AccordionSectionList {
  constructor() {
    this.privateSectionBag = {};
    this.privateSortedSections = [];
  }
  add(accordionSectionInterface) {
    this.privateSectionBag[accordionSectionInterface.id] = accordionSectionInterface;
    this.privateSortedSections = getSortedSections(this.privateSectionBag);
  }
  get sections() {
    return this.privateSortedSections;
  }
  remove(sectionId) {
    delete this.privateSectionBag[sectionId];
    this.privateSortedSections = getSortedSections(this.privateSectionBag);
  }
  getSectionById(sectionId) {
    return this.privateSectionBag[sectionId];
  }
  get openSections() {
    return this.privateSortedSections.filter(section => section.isOpen());
  }
  getSectionByName(name) {
    return getSectionByName(this.privateSortedSections, name);
  }
  getNextSectionTo(sectionId) {
    return getNextSection(this.privateSortedSections, this.privateSectionBag[sectionId], false);
  }
  getPrevSectionTo(sectionId) {
    return getNextSection(this.privateSortedSections, this.privateSectionBag[sectionId], true);
  }
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

function openSection(sectionList, sectionToOpen) {
  let sectionChanged = false;
  if (sectionToOpen) {
    const sections = sectionList.sections;
    sections.forEach(section => {
      if (section !== sectionToOpen) {
        sectionChanged = sectionChanged || section.isOpen();
        section.close();
      }
    });
    sectionChanged = sectionChanged || !sectionToOpen.isOpen();
    sectionToOpen.open();
  }
  return sectionChanged;
}
class SingleOpenSectionStrategy {
  constructor(sectionList) {
    this.privateSectionList = sectionList;
  }
  openFirstSection() {
    const sections = this.privateSectionList.sections;
    if (sections.length) {
      return openSection(this.privateSectionList, sections[0]);
    }
    return false;
  }
  openSectionByName(name) {
    const normalizedName = Array.isArray(name) && name.length > 0 ? name[0] : name;
    const sectionToOpen = this.privateSectionList.getSectionByName(normalizedName);
    return openSection(this.privateSectionList, sectionToOpen);
  }
  handleSectionSelect(sectionId) {
    const selectedSection = this.privateSectionList.getSectionById(sectionId);
    return openSection(this.privateSectionList, selectedSection);
  }
  handleSectionWillDeregister(sectionId) {
    const sectionToDelete = this.privateSectionList.getSectionById(sectionId);
    if (sectionToDelete.isOpen()) {
      const sectionToOpen = this.privateSectionList.getNextSectionTo(sectionId);
      if (sectionToOpen && sectionToOpen !== sectionToDelete) {
        sectionToOpen.open();
      }
      return true;
    }
    return false;
  }
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

function normalizeSectionNames(sectionName) {
  let normalizedNames;
  if (Array.isArray(sectionName)) {
    normalizedNames = sectionName;
  } else {
    normalizedNames = [];
    normalizedNames.push(sectionName);
  }
  return normalizedNames;
}
function getSectionsToOpenMap(sectionList, namesToOpen) {
  const idsToOpenMap = {};
  namesToOpen.forEach(sectionName => {
    const section = sectionList.getSectionByName(sectionName);
    if (section) {
      idsToOpenMap[section.id] = true;
    }
  });
  return idsToOpenMap;
}
class MultipleOpenSectionStrategy {
  constructor(sectionList) {
    this.privateSectionList = void 0;
    this.privateSectionList = sectionList;
  }
  openFirstSection() {
    return false;
  }
  openSectionByName(sectionName) {
    const sectionsToOpenMap = getSectionsToOpenMap(this.privateSectionList, normalizeSectionNames(sectionName));
    const sections = this.privateSectionList.sections;
    let sectionsChanged = false;
    sections.forEach(section => {
      if (sectionsToOpenMap[section.id]) {
        sectionsChanged = sectionsChanged || !section.isOpen();
        section.open();
      } else {
        sectionsChanged = sectionsChanged || section.isOpen();
        section.close();
      }
    });
    return sectionsChanged;
  }
  handleSectionSelect(sectionId) {
    const section = this.privateSectionList.getSectionById(sectionId);
    if (section) {
      if (section.isOpen()) {
        section.close();
      } else {
        section.open();
      }
      return true;
    }
    return false;
  }
  handleSectionWillDeregister() {
    return false;
  }
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const ACCORDION_SECTION_DEREGISTER = 'accordion-section-deregister';
const ACCORDION_SECTION_SELECT = 'accordion-section-select';
const ACCORDION_SECTION_KEYNAV = 'accordion-section-keynav';
function createAccordionSectionObserver(sectionId, eventEmitter) {
  return {
    notifySectionDeregister: () => {
      eventEmitter.emit(ACCORDION_SECTION_DEREGISTER, sectionId);
    },
    notifySectionSelect: () => {
      eventEmitter.emit(ACCORDION_SECTION_SELECT, sectionId);
    },
    notifySectionKeyNav: keyCode => {
      eventEmitter.emit(ACCORDION_SECTION_KEYNAV, sectionId, keyCode);
    }
  };
}
class AccordionManager {
  constructor(accordionSectionList, singleOpenSectionStrategy, multipleOpenSectionStrategy) {
    this.privateAccordionSectionList = void 0;
    this.privateOpenSectionObservers = [];
    this.privateEventEmitter = void 0;
    this.privateCollapsible = false;
    this.privateAccordionStrategies = void 0;
    this.privateAccordionSectionList = accordionSectionList;
    this.privateAccordionStrategies = {
      false: singleOpenSectionStrategy,
      true: multipleOpenSectionStrategy
    };
    this._configureSectionsEventEmitter();
  }
  get sectionStrategy() {
    return this.privateAccordionStrategies[this.collapsible];
  }
  get collapsible() {
    return this.privateCollapsible;
  }
  set collapsible(value) {
    this.privateCollapsible = normalizeBoolean(value);
  }
  attachOpenSectionObserver(observerCb) {
    this.privateOpenSectionObservers.push(observerCb);
  }
  get sections() {
    return this.privateAccordionSectionList.sections;
  }
  openFirstSection() {
    const openSectionsChange = this.sectionStrategy.openFirstSection();
    if (openSectionsChange) {
      this._notifyOpenSectionChange();
    }
  }
  get openSectionsNames() {
    const openSections = this.privateAccordionSectionList.openSections;
    const namesMap = openSections.reduce((accumulator, currentValue) => {
      if (currentValue.name) {
        accumulator[currentValue.name] = true;
      }
      return accumulator;
    }, {});
    return Object.keys(namesMap);
  }
  openSectionByName(sectionName) {
    const sectionsChanged = this.sectionStrategy.openSectionByName(sectionName);
    if (sectionsChanged) {
      this._notifyOpenSectionChange();
    }
    return sectionsChanged;
  }
  registerSection(accordionSectionInterface) {
    this.privateAccordionSectionList.add(accordionSectionInterface);
    accordionSectionInterface.ackParentAccordion(createAccordionSectionObserver(accordionSectionInterface.id, this.privateEventEmitter));
  }
  _handleSectionSelect(sectionId) {
    const sectionChanged = this.sectionStrategy.handleSectionSelect(sectionId);
    if (sectionChanged) {
      this._notifyOpenSectionChange();
    }
  }
  _deregisterSection(deletedSectionId) {
    const sectionsChanged = this.sectionStrategy.handleSectionWillDeregister(deletedSectionId);
    this.privateAccordionSectionList.remove(deletedSectionId);
    if (sectionsChanged) {
      this._notifyOpenSectionChange();
    }
  }
  _configureSectionsEventEmitter() {
    this.privateEventEmitter = new EventEmitter();
    this.privateEventEmitter.on(ACCORDION_SECTION_DEREGISTER, sectionId => {
      this._deregisterSection(sectionId);
    }).on(ACCORDION_SECTION_KEYNAV, (sectionId, keyCode) => {
      this._handleSectionKeyNav(sectionId, keyCode);
    }).on(ACCORDION_SECTION_SELECT, sectionId => {
      this._handleSectionSelect(sectionId);
    });
  }
  _notifyOpenSectionChange() {
    this.privateOpenSectionObservers.forEach(observerCallback => observerCallback());
  }
  _handleSectionKeyNav(selectedSectionId, keyCode) {
    const isReverseDirection = keyCode === keyCodes.left || keyCode === keyCodes.up;
    const sectionList = this.privateAccordionSectionList;
    const nextSection = isReverseDirection ? sectionList.getPrevSectionTo(selectedSectionId) : sectionList.getNextSectionTo(selectedSectionId);
    if (nextSection !== null) {
      nextSection.focus();
    }
  }
}
function createAccordionManager() {
  const accordionSectionList = new AccordionSectionList();
  const singleOpenSectionStrategy = new SingleOpenSectionStrategy(accordionSectionList);
  const multipleOpenSectionStrategy = new MultipleOpenSectionStrategy(accordionSectionList);
  return new AccordionManager(accordionSectionList, singleOpenSectionStrategy, multipleOpenSectionStrategy);
}

export { createAccordionManager };