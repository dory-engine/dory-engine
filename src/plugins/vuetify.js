import Vue from 'vue'
import Vuetify, {
  VForm, VTextField, VCol, VRow, VCardTitle, VSimpleTable, VDivider,
  VListItemContent, VListGroup, VBtnToggle, VStepperItems, VTextarea,
  VContainer, VTabs, VTab, VTabsItems, VTabItem, VPagination,
  VStepper, VStepperHeader, VStepperStep, VListItemGroup, VStepperContent,
  VCard, VCardText, VList, VListItem, VBtn, VAppBar, VToolbarTitle,
  VChip, VDataTable, VListItemTitle, VListItemIcon, VListItemAvatar,
  VApp, VSpacer, VMain, VNavigationDrawer, VDataIterator, VSelect,
  VDialog, VCardActions, VMenu, VIcon, VToolbarItems, VImg, VTooltip,
  VAlert, VToolbar, VSnackbar, VExpansionPanels, VExpansionPanel,
  VExpansionPanelContent, VExpansionPanelHeader, VSlideXReverseTransition,
  VAvatar, VDatePicker, VSwitch, VFileInput, ClickOutside, VAutocomplete, VTreeview, VCombobox, VSimpleCheckbox, VCheckbox, VProgressLinear, VBreadcrumbs, VBreadcrumbsItem,VSubheader
} from 'vuetify/lib'
import '@mdi/font/css/materialdesignicons.min.css'
import 'typeface-roboto/index.css'
import zhHans from 'vuetify/lib/locale/zh-Hans'
import en from 'vuetify/lib/locale/en'
import VueI18n from 'vue-i18n'
import { lang_en } from './lang-en.js'
import { lang_zh } from './lang-zh.js'
Vue.use(VueI18n)

const messages = {
  en: {
    $vuetify: {
      ...en,
      ...lang_en,
    }
  },
  zh: {
    $vuetify: {
      ...zhHans,
      ...lang_zh,
    }
  },
}

const savedLanguage = window.sessionStorage.getItem('lang')
const language = navigator.languages? navigator.languages[0] : (navigator.language || navigator.userLanguage)
// Vue.config.lang = savedLanguage || language
let i18nLocale = savedLanguage || language
if (i18nLocale.split('-')[0] === 'zh') {
  i18nLocale = 'zh'
} else {
  i18nLocale = 'en'
}
if (!savedLanguage) {
  window.sessionStorage.setItem('lang', i18nLocale)
}
// 实例化 vuei18n
const i18n = new VueI18n({
  locale: i18nLocale,
  messages
})

Vue.use(Vuetify, {
  components: {
    VForm,
    VTextField,
    VCol,
    VRow,
    VCardTitle,
    VSimpleTable,
    VDivider,
    VListItemContent,
    VContainer,
    VTabs,
    VTab,
    VTabsItems,
    VTabItem,
    VPagination,
    VStepper,
    VStepperHeader,
    VStepperStep,
    VCard,
    VCardText,
    VList,
    VListItem,
    VBtn,
    VAppBar,
    VToolbarTitle,
    VChip,
    VDataTable,
    VApp,
    VSpacer,
    VMain,
    VNavigationDrawer,
    VDataIterator,
    VMenu,
    VSelect,
    VDialog,
    VCardActions,
    VListItemTitle,
    VIcon,
    VListGroup,
    VAlert,
    VToolbar,
    VSnackbar,
    VExpansionPanels,
    VExpansionPanel,
    VExpansionPanelContent,
    VExpansionPanelHeader,
    VBtnToggle,
    VListItemGroup,
    VListItemIcon,
    VToolbarItems,
    VSlideXReverseTransition,
    VStepperItems,
    VStepperContent,
    VAvatar,
    VDatePicker,
    VListItemAvatar,
    VImg,
    VTooltip,
    VSwitch,
    VFileInput,
    VAutocomplete,
    VTreeview,
    VTextarea,
    VCombobox,
    VSimpleCheckbox,
    VCheckbox,
    VProgressLinear,
    VBreadcrumbs,
    VBreadcrumbsItem,
    VSubheader
  },
  directives: {
    ClickOutside
  }
})
const vuetify = new Vuetify({
  lang: {
    t: (key, ...params) => i18n.t(key, params),
  },
  icons: {
    iconfont: 'mdiSvg'
  }
})
export {vuetify, i18n}
