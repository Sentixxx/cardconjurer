//Configure sizes
var ppi = 600;
var page = [8.5, 11];
//Constants
const aidWidth = 2;
const aidOffset = aidWidth / 2;
//card size
var cardWidth = parseInt(document.querySelector("#cardWidth").value);
var cardHeight = parseInt(document.querySelector("#cardHeight").value);
//bleed edge
var cardPaddingX = parseInt(document.querySelector("#cardPadding").value);
var cardPaddingY = cardPaddingX;
//whitespace
var cardMarginX =  parseInt(document.querySelector("#cardMargin").value);
var cardMarginY = cardMarginX;
//booleans
var imgIncludesBleedEdge = true;
var bleedEdgeColor = "black";
var useCuttingAids = false;
//Prepare variables/canvas/context
var imageList = [];
var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');
drawSheet();
//svgs
var cuttingGuides = new Image();
cuttingGuides.src = 'cuttingGuides.svg';
var blackPixel = new Image();
blackPixel.src = 'black.png';

function uploadCard(card, filename) {
    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function() {imageList.push(this); drawSheet();}
    img.filename = filename.replace('filename=', '');
    img.src = card;
}
//buffer to avoid drawing the sheet *too* many times when uploading multiple images at the same time
const drawSheetDebounceMs = 120;
var drawingSheet;
var hasDrawnSheet = false;
function drawSheet() {
    clearTimeout(drawingSheet);
    if (!hasDrawnSheet) {
        hasDrawnSheet = true;
        requestAnimationFrame(drawSheetReal);
        return;
    }
    drawingSheet = setTimeout(function() {
        requestAnimationFrame(drawSheetReal);
    }, drawSheetDebounceMs);
}
function getPrintSheetLayout() {
    //Calc actual card size
    const cw =  cardWidth + 2 * cardPaddingX + cardMarginX;
    const ch = cardHeight + 2 * cardPaddingY + cardMarginY;
    //Calc number of cards that fit on the sheet
    const cardsX = Math.floor(page[0] / (cw / ppi));
    const cardsY = Math.floor(page[1] / (ch / ppi));
    //Calc page margins
    const pageMarginX = Math.floor((page[0] * ppi - cardsX * cw) / 2);
    const pageMarginY = Math.floor((page[1] * ppi - cardsY * ch) / 2);
    return {cw, ch, cardsX, cardsY, pageMarginX, pageMarginY};
}
function drawCuttingAidLines(layout, drawVerticalLine, drawHorizontalLine) {
    if (!useCuttingAids) {
        return;
    }
    for (var i = 0; i < layout.cardsX; i++) {
        var x = layout.pageMarginX + i * layout.cw + Math.floor(cardMarginX / 2) + cardPaddingX - aidOffset;
        drawVerticalLine(x);
        drawVerticalLine(x + cardWidth);
    }
    for (var j = 0; j < layout.cardsY; j++) {
        var y = layout.pageMarginY + j * layout.ch + Math.floor(cardMarginY / 2) + cardPaddingY - aidOffset;
        drawHorizontalLine(y);
        drawHorizontalLine(y + cardHeight);
    }
}
function drawEachPrintableCard(layout, drawCard) {
    var count = 0;
    for (var i = imageList.length - 1; i >= 0 && count < layout.cardsX * layout.cardsY; i--) {
        if (imageList[i].width > 1) {
            try {
                //Calc upper-left corner of card *image* (accounts for bleed edge and margins)
                var x = layout.pageMarginX + (count % layout.cardsX)                      * (layout.cw) + Math.floor(cardMarginX / 2) + cardPaddingX;
                var y = layout.pageMarginY + (Math.floor(count / layout.cardsX) % layout.cardsY) * (layout.ch) + Math.floor(cardMarginY / 2) + cardPaddingY;
                drawCard(imageList[i], x, y, cardWidth, cardHeight);
                count ++;
            } catch {
                console.log('image failed.');
            }
        }
    }
}
function drawSheetReal() {
    //Prepare canvases
    canvas.width = page[0] * ppi;
    canvas.height = page[1] * ppi;
    context.clearRect(0, 0, page[0] * ppi, page[1] * ppi);
    const layout = getPrintSheetLayout();
    //Draw cutting guides that cover the page
    drawCuttingAidLines(
        layout,
        function(x) { context.fillRect(x, 0, aidWidth, page[1] * ppi); },
        function(y) { context.fillRect(0, y, page[0] * ppi, aidWidth); }
    );
    //Iterate through every viable space and draw the card there
    drawEachPrintableCard(layout, function(image, x, y, w, h) {
        if (imgIncludesBleedEdge) {
            context.drawImage(image, x - cardPaddingX, y - cardPaddingY, w + 2 * cardPaddingX, h + 2 * cardPaddingY);
        } else {
            context.fillStyle = bleedEdgeColor;
            context.fillRect(x - cardPaddingX, y - cardPaddingY, w + 2 * cardPaddingX, h + 2 * cardPaddingY);
            context.drawImage(image, x, y, w, h);
        }
        if (useCuttingAids) {
            context.drawImage(cuttingGuides, x, y, w, h);
        }
    });
}

function downloadCanvas() {
    var download = document.createElement('a');
    download.download = 'print.png';
    download.href = canvas.toDataURL();
    document.body.appendChild(download);
    download.click();
    download.remove();
}

function downloadPDF() {
    var pageOrientation = 'portrait';
    if (page[0] > page[1]) {
        pageOrientation = 'landscape';
    }
    var doc = new jsPDF({
        orientation: pageOrientation,
        unit: 'in',
        format: [page[0], page[1]]
    });
    //create a single black pixel for default padding
    var defaultPadding = document.createElement("canvas");
    defaultPadding.width = 1;
    defaultPadding.height = 1;
    var defaultPaddingContext = defaultPadding.getContext("2d");
    defaultPaddingContext.fillStyle = bleedEdgeColor;
    defaultPaddingContext.fillRect(0, 0, 1, 1);
    const layout = getPrintSheetLayout();
    //Draw cutting guides that cover the page
    drawCuttingAidLines(
        layout,
        function(x) { doc.addImage(blackPixel, "PNG", x / ppi, 0, aidWidth / ppi, page[1]); },
        function(y) { doc.addImage(blackPixel, "PNG", 0, y / ppi, page[0], aidWidth / ppi); }
    );
    //Iterate through every viable space and draw the card there
    drawEachPrintableCard(layout, function(image, x, y, w, h) {
        if (imgIncludesBleedEdge) {
            doc.addImage(image, "PNG", (x - cardPaddingX) / ppi, (y - cardPaddingY) / ppi, (w + 2 * cardPaddingX) / ppi, (h + 2 * cardPaddingY) / ppi);
        } else {
            doc.addImage(defaultPadding, "PNG", (x - cardPaddingX) / ppi, (y - cardPaddingY) / ppi, (w + 2 * cardPaddingX) / ppi, (h + 2 * cardPaddingY) / ppi);
            doc.addImage(image, "PNG", x / ppi, y / ppi, w / ppi, h / ppi);
        }
        if (useCuttingAids) {
            doc.addImage(cuttingGuides, "PNG", x / ppi, y / ppi, w / ppi, h / ppi);
        }
    });
    doc.save('print.pdf');
}
//Manages page
function setPageSize(size = [8.5, 11]) {
    page[0] = parseFloat(size[0]);
    page[1] = parseFloat(size[1]);
    drawSheet();
}
function changeOrientation() {
    setPageSize([page[1], page[0]]);
}
//Sets PPI, recalculates card measurements
function setPPI(inputPPI) {
    var oldPPI = ppi;
    ppi = parseInt(inputPPI);
    var scale = ppi / oldPPI;
    cardWidth *= scale;
    cardHeight *= scale;
    drawSheet();
}
//Sets specific card dimensions
function setCardSize(size) {
    if (size) {
        document.querySelector("#cardWidth").value = Math.round(size[0] * ppi);
        document.querySelector("#cardHeight").value = Math.round(size[1] * ppi);
    }
    cardWidth = parseInt(document.querySelector("#cardWidth").value);
    cardHeight = parseInt(document.querySelector("#cardHeight").value);
    drawSheet();
}
function setPaddingSize(size) {
    cardPaddingX = parseInt(size);
    cardPaddingY = cardPaddingX;
    drawSheet();
}
function setMarginSize(size) {
    cardMarginX = parseInt(size);
    cardMarginY = cardMarginX;
    drawSheet();
}
//Sets booleans
function setBleedEdge(bool) {
    imgIncludesBleedEdge = bool;
    drawSheet();
}
function setBleedEdgeColor(color) {
    bleedEdgeColor = color;
    drawSheet();
}
function setCuttingAids(bool) {
    useCuttingAids = bool;
    drawSheet();
}
//Default print configurations
function saveDefaults() {
    var cardObject = {
        ppi:ppi,
        page:page,
        cardWidth:cardWidth,
        cardHeight:cardHeight,
        cardMarginX:cardMarginX,
        cardMarginY:cardMarginY,
        cardPaddingX:cardPaddingX,
        cardPaddingY:cardPaddingY,
        bleedEdge:imgIncludesBleedEdge,
        bleedEdgeColor:bleedEdgeColor,
        cuttingAids:useCuttingAids
    }
    localStorage.setItem("cardPrintConfig", JSON.stringify(cardObject));
}
function loadDefaults() {
    var cardObject = JSON.parse(localStorage.getItem("cardPrintConfig"))
    if (cardObject && cardObject != {}) {
        ppi = cardObject.ppi;
        document.querySelector("#cardPPI").value = ppi;
        page = cardObject.page;
        cardWidth = cardObject.cardWidth;
        document.querySelector("#cardWidth").value = cardWidth;
        cardHeight = cardObject.cardHeight;
        document.querySelector("#cardHeight").value = cardHeight;
        cardMarginX = cardObject.cardMarginX;
        cardMarginY = cardObject.cardMarginY;
        document.querySelector("#cardMargin").value = cardMarginX;
        cardPaddingX = cardObject.cardPaddingX;
        cardPaddingY = cardObject.cardPaddingY;
        document.querySelector("#cardPadding").value = cardPaddingX;
        imgIncludesBleedEdge = cardObject.bleedEdge;
        document.querySelector("#bleedEdgeCheckbox").checked = imgIncludesBleedEdge;
        bleedEdgeColor = cardObject.bleedEdgeColor || bleedEdgeColor;
        document.querySelector("#bleedEdgeColor").value = bleedEdgeColor;
        useCuttingAids = cardObject.cuttingAids;
        document.querySelector("#cuttingAidsCheckbox").checked = useCuttingAids;
    }
}

loadDefaults();
