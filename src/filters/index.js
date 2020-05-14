import Vue from 'vue'
import moment from './moment'
/*
過濾器（filter）常用於格式化文本，以管道符號（ | ）表示。過濾器可以在雙括號差值和 v-bind 表達式中使用，比如：

<abbr :date="date | filterA | moment">{{ date | moment('from', { startOf: 'minute' }) }}</abbr>
*/
Vue.filter('moment', moment)