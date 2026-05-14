var randomCharacters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '%', '&', ','];

function generatePhyrexianText() {
    var inputText = document.getElementById('inputText').value;
    var outputText = '';
    var paragraphs = inputText.split('\n');
    for (var i = 0; i < paragraphs.length; i ++) {
        var sentences = paragraphs[i].split('. ');
        for (var j = 0; j < sentences.length; j ++) {
            outputText += '|';
            for (var k = 0; k < sentences[j].length - 2; k ++) {
                outputText += randomCharacters[Math.floor(Math.random() * randomCharacters.length)];
            }
            outputText += '. ';
        }
        if (i != paragraphs.length - 1) {
            outputText += '\n';
        }
    }
    document.getElementById('outputText').value = outputText;
}