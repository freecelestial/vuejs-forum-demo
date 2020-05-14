import moment from 'moment'

moment.locale('zh-tw')

// 此函數會註冊為過濾器
export default function(value, ...rest) {
    const date = value
    // 验证日期是否合法
    if (moment(date).isValid()) {
        // 取 rest 內的第一個值
        const key = rest.shift()

        if (typeof key === 'string') {
            switch (key) {
                case 'from':
                    // 格式化日期为多久之前
                    value = moment(date).from()

                    // 取 rest 內的第二個值，若存在會取代原先的日期
                    const otherOpts = rest.shift()
                    if (otherOpts && typeof otherOpts === 'object') {
                        // 如果参数对象有 startOf 属性，就使用 startOf 的值作为开始时间
                        value = moment(date).startOf(otherOpts.startOf).from()
                    }

                break
                default:
                    // 直接用 rest 內的第一個值格式化
                    value = moment(date).format(key)
            }
        }
    }

    return value
}