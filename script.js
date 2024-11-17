let hiragana = {
    "a": "あ", "i": "い", "u": "う", "e": "え", "o": "お",
    "ka": "か", "ki": "き", "ku": "く", "ke": "け", "ko": "こ",
    "sa": "さ", "shi": "し", "su": "す", "se": "せ", "so": "そ",
    "ta": "た", "chi": "ち", "tsu": "つ", "te": "て", "to": "と",
    "na": "な", "ni": "に", "nu": "ぬ", "ne": "ね", "no": "の",
    "ha": "は", "hi": "ひ", "fu": "ふ", "he": "へ", "ho": "ほ",
    "ma": "ま", "mi": "み", "mu": "む", "me": "め", "mo": "も",
    "ya": "や", "yu": "ゆ", "yo": "よ",
    "ra": "ら", "ri": "り", "ru": "る", "re": "れ", "ro": "ろ",
    "wa": "わ", "wo": "を",
    "n": "ん"
};

let katakana = {
    "a": "ア", "i": "イ", "u": "ウ", "e": "エ", "o": "オ",
    "ka": "カ", "ki": "キ", "ku": "ク", "ke": "ケ", "ko": "コ",
    "sa": "サ", "shi": "シ", "su": "ス", "se": "セ", "so": "ソ",
    "ta": "タ", "chi": "チ", "tsu": "ツ", "te": "テ", "to": "ト",
    "na": "ナ", "ni": "ニ", "nu": "ヌ", "ne": "ネ", "no": "ノ",
    "ha": "ハ", "hi": "ヒ", "fu": "フ", "he": "ヘ", "ho": "ホ",
    "ma": "マ", "mi": "ミ", "mu": "ム", "me": "メ", "mo": "モ",
    "ya": "ヤ", "yu": "ユ", "yo": "ヨ",
    "ra": "ラ", "ri": "リ", "ru": "ル", "re": "レ", "ro": "ロ",
    "wa": "ワ", "wo": "ヲ",
    "n": "ン"
};  

let canvas = document.getElementsByTagName("canvas")[0]
let ctx = canvas.getContext("2d");
let body = document.getElementsByTagName("body")[0]
let taskDiv = document.getElementById("taskDiv")
let correctDiv = document.getElementById("correct")
let mouseDown = false
let drawBlock = true
let answerSubmitable = false
let selectedAlphabet = ""
let currentCharacter = ""

let mousePos = {x: 0, y: 0}
let prevMousePos = {x: 0, y: 0}

function randomCharacter(alphabet="both"){
    let keys = Object.keys(hiragana)
    let keys2 = Object.keys(katakana)
    let key = keys[Math.floor(Math.random() * keys.length)]
    let key2 = keys2[Math.floor(Math.random() * keys2.length)]
    if (alphabet === "hiragana" || alphabet === "both" && Math.random() > 0.5)
        return {key: key, alphabet: "hiragana"}
    else
        return {key: key2, alphabet: "katakana"}
}
function checkCharacter(){
    if (!answerSubmitable)
        return
    correctDiv.style.display = "block"
    if (currentCharacter.alphabet)
        correctDiv.innerHTML = hiragana[currentCharacter.key]
    else
        correctDiv.innerHTML = katakana[currentCharacter.key]
    document.querySelector("#checkButton").innerHTML = "Show drawing"
    document.querySelector("#checkButton").onclick = uncheckCharacter
}
function uncheckCharacter(){
    correctDiv.innerHTML = ""
    correctDiv.style.display = "none"
    document.querySelector("#checkButton").innerHTML = "Check"
    document.querySelector("#checkButton").onclick = checkCharacter
}
function nextCharacter(forceallow = false){
    if (!answerSubmitable && !forceallow)
        return
    currentCharacter = randomCharacter(selectedAlphabet)
    taskDiv.innerHTML = `
    Alphabet: ${selectedAlphabet}<br><br>
    Draw the following character:<br><br>
    ${currentCharacter.key}<br><br>
    <button id='checkButton' onclick='checkCharacter()'>Check</button>
    <button onclick='nextCharacter()'>Next</button>
    `
    uncheckCharacter()
    clearCanvas()
}
function selectAlphabet(alphabet){
    selectedAlphabet = alphabet
    drawBlock = false
    taskDiv.classList.add("inGame")
    nextCharacter(true)
}

function clearCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    document.getElementById("clearButton").classList.remove("clearButtonShow")
    answerSubmitable = false
}

function mouseMover(p){
    if (drawBlock)
        return

    let canvPos = canvas.getBoundingClientRect()
    
    prevMousePos.x = mousePos.x
    prevMousePos.y = mousePos.y

    mousePos.x = p.pageX - canvPos.left
    mousePos.y = p.pageY - canvPos.top

    if (mouseDown){
        let size = 10

        ctx.beginPath()
        ctx.strokeStyle = "black";
        ctx.lineWidth = size
        ctx.moveTo(prevMousePos.x, prevMousePos.y)
        ctx.lineTo(mousePos.x, mousePos.y)
        ctx.stroke()

        ctx.beginPath()
        ctx.fillStyle = "black";
        ctx.arc(mousePos.x, p.pageY, size/2, 0, 2 * Math.PI)
        ctx.fill()

        ctx.beginPath()
        ctx.fillStyle = "black";
        ctx.arc(prevMousePos.x, prevMousePos.y, size/2, 0, 2 * Math.PI)
        ctx.fill()

        if (!document.getElementById("clearButton").classList.contains("clearButtonShow"))
            document.getElementById("clearButton").classList.add("clearButtonShow")
        answerSubmitable = true
    }
}
addEventListener('mousemove', mouseMover, false);

canvas.addEventListener('pointerdown', (event) => {
    mouseDown = true
    mouseMover(event)
});
body.addEventListener('pointerup', (event) => {
    mouseDown = false
});
/*body.addEventListener('pointerout', (event) => {
    mouseDown = false
});*/