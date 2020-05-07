import Vue from 'vue'
import moment from './moment'
/*
过滤器（filter）常用于格式化文本，以管道符号（ | ）表示。过滤器可以在双括号差值和 v-bind 表达式中使用，比如：

<abbr :date="date | filterA | moment">{{ date | moment('from', { startOf: 'minute' }) }}</abbr>
*/
Vue.filter('moment', moment)