document.addEventListener("DOMContentLoaded", function () {
  (function () {
    /**
     * @class LangSwitcher
     * create tabs with buttons to switching
     * between languages variants,
     * works with .code-tab__content class elements
     */
    class LangSwitcher {
      constructor(tabs, index) {
        this.tabs = tabs || [];
        this.index = index || 0;
        this.langButtons = null;
      }

      initContainer() {
        if (this.tabs.length < 2) {
          return null;
        }
        // create a container for the tabs
        const container = document.createElement("div");
        container.classList.add("code-tab");
        this.tabs[0].before(container);
        this.tabs.forEach((tab, i) => {
          if (i !== 0) {
            tab.classList.add("d-none");
          }

          container.appendChild(tab);
        });
      }

      initLangButtons() {
        if (this.tabs.length < 2) {
          return null;
        }
        // create a wrapper for the buttons
        const buttonWrapper = document.createElement("div");
        const tabButtons = document.createElement("div");
        tabButtons.classList.add("code-tab__tabs-wrap");
        buttonWrapper.classList.add("code-tab__tabs");

        tabButtons.appendChild(buttonWrapper);
        this.tabs.forEach((tab, i) => {
          const langButton = tab.querySelector(".code-tab__tab");
          const langButtonCopy = langButton.cloneNode(true);
          langButtonCopy.classList.remove("d-none");

          buttonWrapper.append(langButtonCopy);
        });

        const langButtonsEl = buttonWrapper.querySelectorAll(".code-tab__tab");
        this.langButtons = langButtonsEl;

        this.tabs[0].before(buttonWrapper);
      }

      switchLanguage(lang) {
        const activeTab = this.tabs.find((t) => {
          return this.getLang(t) === lang;
        });

        this.tabs.forEach((t) => t.classList.add("d-none"));
        activeTab.classList.remove("d-none");
        this.#setActiveButton(lang);
      }

      getLang(tab) {
        return tab.getElementsByTagName("code")[0].dataset.lang;
      }

      getLangButtons() {
        return this.langButtons;
      }

      // should be used together with changing of the active tab visibility
      #setActiveButton(lang) {
        this.langButtons.forEach((btn) => {
          if (btn.dataset.langSwitch === lang) {
            btn.classList.add("active");
          } else {
            btn.classList.remove("active");
          }
        });
      }
    }

    const allTabs = document.querySelectorAll(".code-tab__content");
    let tabsGroups = [];
    let groupArr = [];

    /**
     * go through all tabs (elements with class .highlight)
     */
    for (let hl of allTabs) {
      groupArr.push(hl);

      let isLastInGroup =
        !hl.nextElementSibling?.classList?.contains("code-tab__content");

      if (isLastInGroup) {
        tabsGroups.push(groupArr);
        groupArr = [];
      }
    }

    /**
     * init switcher for each group of tabs
     */
    tabsGroups.forEach((g, i) => {
      const langSwitcher = new LangSwitcher(g);
      langSwitcher.initContainer();
      langSwitcher.initLangButtons();
      const tabBtns = langSwitcher.getLangButtons();
      if (tabBtns) {
        tabBtns[0].classList.add("active");
        tabBtns.forEach((btn) => {
          const lang = btn.dataset.langSwitch;
          btn.addEventListener("click", () => {
            if (lang) {
              langSwitcher.switchLanguage(lang);
            }
          });
        });
      }
    });
  }).call(this);
});
