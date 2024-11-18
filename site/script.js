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
let drawDiv = document.getElementById("drawDiv")
let mouseDown = false
let drawBlock = true
let answerSubmitable = false
let buttonBlock = false
let selectedAlphabet = ""
let currentCharacter = ""

let mousePos = {x: 0, y: 0}
let prevMousePos = {x: 0, y: 0}

function loader(block){
    buttonBlock = block
    let loadingElements = document.querySelectorAll(".loading");
    loadingElements.forEach(element => {
        element.style.display = block ? "" : "none";
    });
}

function check(){
    if (buttonBlock)
        return
    if (!answerSubmitable){
        alert("Please draw something first")
        return
    }
    if (drawDiv.classList.contains("shake") || drawDiv.classList.contains("bad") || drawDiv.classList.contains("good")) {
        alert("You need to modify your drawing before checking again")
        return
    }
    hideCharacter()
    buttonBlock = true

    // Add white background to canvas
    let tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    let tempCtx = tempCanvas.getContext('2d');
    tempCtx.fillStyle = "white";
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(canvas, 0, 0);

    let image = tempCanvas.toDataURL();
    loader(true)
    fetch("/get-image", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({image: image, alphabet: currentCharacter.alphabet})
    }).then(res => res.text()).then(text => {
        loader(false)
        if (text.trim() == hiragana[currentCharacter.key] && currentCharacter.alphabet == "hiragana" || text.trim() == katakana[currentCharacter.key] && currentCharacter.alphabet == "katakana") {
            drawDiv.classList.add("good")
            document.querySelector("#nextButton").innerHTML = "Next"
        } else {
            drawDiv.classList.add("shake", "bad")
            document.querySelector("#detected").innerHTML = "Detected: "+text
        }
    }).catch(err => {
        alert("Something went wrong");
        loader(false);
    })
}

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
function showCharacter(){
    if (buttonBlock)
        return
    correctDiv.style.display = ""
    if (currentCharacter.alphabet)
        correctDiv.innerHTML = hiragana[currentCharacter.key]
    else
        correctDiv.innerHTML = katakana[currentCharacter.key]
    document.querySelector("#showButton").innerHTML = "Hide"
    document.querySelector("#showButton").onclick = hideCharacter
}
function hideCharacter(){
    if (buttonBlock)
        return
    correctDiv.innerHTML = ""
    correctDiv.style.display = "none"
    document.querySelector("#showButton").innerHTML = "Show"
    document.querySelector("#showButton").onclick = showCharacter
}
function nextCharacter(forceallow = false){
    currentCharacter = randomCharacter(selectedAlphabet)
    taskDiv.innerHTML = `
    <div>Alphabet: ${selectedAlphabet}</div>
    <div class="japChar">${currentCharacter.key}</div>
    <div>
        <button id='showButton' class="smallButton" onclick='showCharacter()'>Show</button>
        <button class="smallButton" onclick='check()'>Check</button>
        <button id="nextButton" onclick='nextCharacter()' class="smallButton">Skip</button>
    </div>
    <div id="detected"></div>
    <div class="loading" style="display: none;"><i class="icon-spin5 animate-spin"></i></div>
    `
    hideCharacter()
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
    drawDiv.classList.remove("shake", "bad", "good");
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

        drawDiv.classList.remove("shake", "bad", "good")
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