const express = require('express');
const path = require('path');
const Tesseract = require('tesseract.js');
const bodyParser = require('body-parser');

const app = express();
const port = 3006;

const hiraganaCharacters = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん";
const katakanaCharacters = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

app.use(express.static(path.join(__dirname, 'site')));
app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

app.post('/get-image', (req, res) => {
    const { image, alphabet } = req.body;

    let whitelist = '';
    if (alphabet === 'hiragana') {
        whitelist = hiraganaCharacters;
    } else if (alphabet === 'katakana') {
        whitelist = katakanaCharacters;
    } else {
        whitelist = hiraganaCharacters + katakanaCharacters;
    }

    Tesseract.recognize(
        image,
        'jpn',
        {
            tessedit_char_whitelist: whitelist
        }
    ).then(({ data: { text } }) => {
        const filteredText = text.split('').filter(char => whitelist.includes(char)).join('');
        res.send(filteredText);
    }).catch(err => {
        res.status(500).send(err.message);
    });
});
