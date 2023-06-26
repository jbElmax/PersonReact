export const createRandomNumbers = ()=>
 {
    function randomNumber(min, max) {
        return Math.ceil(Math.random() * (max - min)) + min;
    }
    var ranNum = [];
    for (var i = 0; i < 10; i++) {
        var min = i + 5;
        var max = i * 10;
        ranNum.push(randomNumber(min, max));

    }
    return ranNum
}