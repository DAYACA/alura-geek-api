const d = document,
    $formInputs = d.querySelectorAll('input')

function priceLength (price){
    let isMayor = ''

    if(price.length < $formInputs[2].minLength){
        isMayor = false
    }else{
        isMayor = true
        console.log(moneyFormat(price))
    }

    return isMayor
}

const moneyFormat = (num) => `${num.slice(0, 1)}.${num.slice(-3)}`

function testUrl(url){

    let regExp = new RegExp(`^(https:)\/\/[a-zA-Z0-9\.\/\-]+[a-zA-Z0-9]+[a-zA-Z\.]+`),
        validUrl = ''

    validUrl = regExp.test(url)
    return validUrl
}

export {priceLength, moneyFormat, testUrl}

