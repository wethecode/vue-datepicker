import Vue from 'vue';

import * as locales from '../locale';
import { DEFAULT_LOCALE_PROPERTIES } from '../constants';

export default Vue.extend({
  name: 'Localable',

  props: {
    locale: { type: Object, default: () => ({ lang: undefined }) },
  },

  computed: {
    currentLocale () {
      const { lang } = this.locale;
      return { ...this.locale, lang: this.getLocale(lang) };
    },
  },
  methods: {
    getDefaultLang () {
      return (
        (this.$vuedatepicker && this.$vuedatepicker.lang) ||
        window.navigator.userLanguage ||
        window.navigator.language ||
        'en'
      ).substr(0, 2);
    },
    isValidLocale (lang = {}) {
      const properties = Object.keys(lang);
      return properties.length > 0 &&
        properties.every(property => DEFAULT_LOCALE_PROPERTIES.includes(property));
    },
    getLocale (lang) {
      /**
       * At some point `lang` parameter becomes undefined (with `locale` prop's default value -- this should be fixed)
       * so it tries to `getDefaultLang`. If navigator's locale is not in `locales` the infinite recursive loop bug happens
       * which causes the 'Maximum call stack size exceeded' error.
       * Also `lang` param can be an object or a string so `isValidLocale` should not be called every time.
       **/
      // return this.isValidLocale(lang) ? lang : locales[lang] || this.getLocale(this.getDefaultLang());

      if (typeof lang === 'object' && this.isValidLocale(lang)) {
        return lang;
      } else if (typeof lang === 'string') {
        if (locales[lang]) {
          return locales[lang];
        } else {
          let defaultLang = this.getDefaultLang();
          if (locales[defaultLang]) {
            return locales[defaultLang];
          }
        }
      }
      // Fallback to 'en' locale
      return locales['en'];
    },
  },
});
