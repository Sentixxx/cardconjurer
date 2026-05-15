var cardMask = new Image();
cardMask.crossOrigin = 'anonymous';
cardMask.src = 'card.png';
var wizards = new Image();
wizards.crossOrigin = 'anonymous';
wizards.src = 'wizards.png';

function prepareImage(source, filename) {
    var cardImage = new Image();
    cardImage.crossOrigin = 'anonymous';
    cardImage.onload = function() {
        cropCard(this, filename);
    }
    cardImage.onerror = errorMessage;
    cardImage.src = source;
}

function errorMessage() {
    notify('An error occured. Please make sure you\'re uploading a valid image, then try again.', 10);
}

async function cropCard(image, filename) {
    // Create canvas/context
    const canvas = document.createElement('canvas');
    // document.body.appendChild(canvas);
    canvas.width = 1500;
    canvas.height = 2100;
    const context = canvas.getContext('2d');
    // Draw card image
    context.drawImage(image, -66, -60, 1632, 2220);
    // Determine version
    var version;
    if (context.getImageData(1342, 2026, 1, 1).data.toString() == '255,255,255,255') {
        context.drawImage(wizards, 895, 1973, 509, 25);
    } else if (context.getImageData(1342, 2020, 1, 1).data.toString() == '255,255,255,255') {
        context.drawImage(wizards, 895, 1967, 509, 25);
    } else if (context.getImageData(1342, 2062, 1, 1).data.toString() == '255,255,255,255') {
        context.drawImage(wizards, 895, 2009, 509, 25);
    } else if (context.getImageData(1342, 2056, 1, 1).data.toString() == '255,255,255,255') {
        context.drawImage(wizards, 895, 2003, 509, 25);
    } else {
        context.drawImage(wizards, 895, 2009, 509, 25);
        notify('Your card type was unrecognized, and as such may have the copyright info incorrectly placed. Please double check your card.', 10);
    }
    // Mask off the corners
    context.globalCompositeOperation = 'destination-atop';
    context.drawImage(cardMask, 0, 0, 1500, 2100);
    // Download the card
    const download = document.createElement('a');
    download.download = filename.replace('filename=', '');
    download.href = canvas.toDataURL();
    document.body.appendChild(download);
    await download.click();
    download.remove();
}