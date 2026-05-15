var randomCharacters = [/*'*',*/ 'N', 'V', 'O', 'A', 'I', 'T', '^', '>', 'M', '<', 'E', 'Q', 'G', 'J', 'L', 'K', 'F', 'H', '"', 'Z', /*'X',*/ '`', 'r', 't', /*'_',*/ 'v', 'x', 'j']

function generatePhyrexianText() {
    var inputText = document.getElementById('inputText').value
    var outputText = ''
    var paragraphs = inputText.split('\n')
    for (var i = 0; i < paragraphs.length; i ++) {
        var sentences = paragraphs[i].split('. ')
        for (var j = 0; j < sentences.length; j ++) {
            outputText += '['
            for (var k = 0; k < sentences[j].length - 2; k ++) {
                outputText += randomCharacters[Math.floor(Math.random() * randomCharacters.length)]
            }
            outputText += '] '
        }
        if (i != paragraphs.length - 1) {
            outputText += '\n'
        }
    }
    document.getElementById('outputText').value = outputText
}
