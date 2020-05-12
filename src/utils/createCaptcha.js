export default function(num = 4, letters = 'QWERTYUIOPLKJHGFDSAZXCVBNM1234567890') {
    // html 產生似圖片的css效果
    let tpl = ''
    // 產生的字串
    let captcha = []

    try {
        captcha = [...Array(num)].map(() => letters[Math.floor(Math.random() * letters.length)])
    } catch (e) {}

    captcha.forEach(item => {
        tpl += `<span>${item}</span>`
    })

    captcha = captcha.join('')

    return {
        tpl,
        captcha
    }
}