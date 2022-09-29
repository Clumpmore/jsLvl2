const text = 'AAAABBBBABAAACDDDDE'
let res = text.replace(/(.)\1+/g, (match, p1) => {
    return p1 + match.length;
})
console.log(res)