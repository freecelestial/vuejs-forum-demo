import Vue from 'vue'
// 引入 Slider.vue 的默认值
import Slider from './Slider'

const components = {
	Slider
}

for (const [key, value] of Object.entries(components)) {
	Vue.component(key, value)
}