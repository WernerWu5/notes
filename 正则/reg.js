
// 获取url每一部分
let str = 'http://www.runoob.com:80/html/html-tutorial.html?name=w'

// /s 表示字符 . 也包括了 \n （回车）
let pattern = /(\w+):\/\/([^/:]+):(\d*)?([^#?]*)\?(.*)/s

let result = str.match(pattern)

// result http://www.runoob.com:80/html/html-tutorial.html?name=w
// result http
// result www.runoob.com
// result 80
// result /html/html-tutorial.html
// result name=w
result && result.forEach(item => {
  console.log('result', item)
})

console.log('\r')

// ---------------------------------数字------------------------------------------------

// 检验是否在 0-100 之间（包括0，100）
let strNum = '1000'

let patternNum = /^[0-9]{1,2}$|^100$/g

let resultNum = patternNum.test(strNum)
console.log('resultNum是否在0-100之间：', resultNum)

console.log('\r')

// ----------------------------------去重复字符---------------------------------------------


// 例如  aaaaabbbbbbbccccc 变成 abc
let strW = 'aaaaabbbbbbbccccc'

let patternW = /(\w)\1*/g

let resultW = strW.replace(patternW, '$1')
console.log('去重复字符resultW：', resultW)

console.log('\r')

