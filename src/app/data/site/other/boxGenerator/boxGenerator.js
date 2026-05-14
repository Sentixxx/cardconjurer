var sides = document.createElement('svg')
var lid = document.createElement('svg')
var bottom = document.createElement('svg')
var front = document.createElement('svg')
var back = document.createElement('svg')

function sizeSVG(svg, width, height) {
    svg.setAttribute('width', width + 'px')
    svg.setAttribute('height', height + 'px')
}

function generateSVGs() {
    //setup variables
    var ppi = parseInt(document.getElementById('inputPPI').value)
    var padding = ppi
    var materialThickness = parseFloat(document.getElementById('inputMaterialThickness').value) * ppi
    var rowCount = 1//parseInt(document.getElementById('inputRowCount').value)
    var rowLength = parseFloat(document.getElementById('inputRowLength').value) * ppi
    var cardWidth = parseFloat(document.getElementById('inputCardWidth').value + document.getElementById('inputWiggleRoom').value) * ppi
    var cardHeight = parseFloat(document.getElementById('inputCardHeight').value + document.getElementById('inputWiggleRoom').value) * ppi
    // var wiggleRoom = parseFloat(document.getElementById('inputWiggleRoom').value) * ppi
    var verticalTabCount = parseInt(document.getElementById('inputVerticalTabCount').value)
    if (verticalTabCount % 2 == 0) {
        verticalTabCount += 1
    }
    var verticalTabLength = cardHeight / verticalTabCount
    var horizontalTabCount1 = parseInt(document.getElementById('inputHorizontalTabCount1').value)
    if (horizontalTabCount1 % 2 == 0) {
        horizontalTabCount1 += 1
    }
    var horizontalTabLength1 = rowLength / horizontalTabCount1
    var horizontalTabCount2 = parseInt(document.getElementById('inputHorizontalTabCount2').value)
    if (horizontalTabCount2 % 2 == 0) {
        horizontalTabCount2 += 1
    }
    var horizontalTabLength2 = (rowCount * (materialThickness + cardWidth) - materialThickness) / horizontalTabCount2
    //side svg
    sizeSVG(sides, rowLength + 2 * materialThickness + 2 * padding, cardHeight + 3 * materialThickness + 2 * padding)
    var sidePath = '<path fill="transparent" stroke="red" d="M' + padding + ' ' + padding + 'h' + (rowLength + 2 * materialThickness) + 'v' + materialThickness + 'h' + (-materialThickness) + 'v' + materialThickness + 'h' + materialThickness
    for (var i = 0; i < verticalTabCount; i ++) {
        sidePath += 'v' + verticalTabLength
        if (i % 2 == 1) {
            sidePath += 'h' + materialThickness
        } else {
            sidePath += 'h' + (-materialThickness)
        }
    }
    for (var i = 0; i < horizontalTabCount1; i ++) {
        if (i % 2 == 0) {
            sidePath += 'v' + materialThickness
        } else {
            sidePath += 'v' + (-materialThickness)
        }
        sidePath += 'h' + (-horizontalTabLength1)
    }
    sidePath += 'v' + (-materialThickness)
    for (var i = 0; i < verticalTabCount; i ++) {
        if (i % 2 == 1) {
            sidePath += 'h' + materialThickness
        } else {
            sidePath += 'h' + (-materialThickness)
        }
        sidePath += 'v' + (-verticalTabLength)
    }
    sidePath += 'h' + materialThickness + 'v' + (-materialThickness) + 'h' + (-materialThickness) + 'Z"></path>'
    sides.innerHTML = sidePath

    //back
    sizeSVG(back, materialThickness + rowCount * (materialThickness + cardWidth) + 2 * padding, 2 * (materialThickness + padding) + cardHeight + materialThickness)
    var backPath = '<path fill="transparent" stroke="red" d="M' + (padding + materialThickness) + ' ' + padding + 'h' + (rowCount * (materialThickness + cardWidth) - materialThickness) + 'v' + materialThickness + 'h' + materialThickness + 'v' + materialThickness + 'h' + (-materialThickness)
    for (var i = 0; i < verticalTabCount; i++) {
        backPath += 'v' + verticalTabLength
        if (i % 2 == 0) {
            backPath += 'h' + materialThickness
        } else {
            backPath += 'h' + (-materialThickness)
        }
    }
    backPath += 'v' + materialThickness + 'h' + (-materialThickness)
    for (var i = 0; i < horizontalTabCount2 - 1; i++) {
        backPath += 'h' + (-horizontalTabLength2)
        if (i % 2 == 1) {
            backPath += 'v' + materialThickness
        } else {
            backPath += 'v' + (-materialThickness)
        }
    }
    backPath += 'h' + (-horizontalTabLength2 - materialThickness) + 'v' + (-materialThickness) + 'h' + materialThickness
    for (var i = 0; i < verticalTabCount; i++) {
        backPath += 'v' + (-verticalTabLength)
        if (i % 2 == 1) {
            backPath += 'h' + materialThickness
        } else {
            backPath += 'h' + (-materialThickness)
        }
    }
    backPath += 'v' + (-materialThickness) + 'h' + materialThickness + 'Z"></path><path fill="transparent" stroke="red" d="M' + ((materialThickness + rowCount * (materialThickness + cardWidth) + 2 * padding) / 2 - cardWidth / 4) + ' ' + (padding + materialThickness) + 'h' + (cardWidth / 2) + 'v' + materialThickness + 'h' + (-cardWidth / 2) + 'Z"></path>'
    back.innerHTML = backPath
    // console.log(back)

    //front
    sizeSVG(front, materialThickness + rowCount * (materialThickness + cardWidth) + 2 * padding, 2 * padding + materialThickness + cardHeight)
    var frontPath = '<path fill="transparent" stroke="red" d="M' + (padding + materialThickness) + ' ' + padding + 'h' + (rowCount * (materialThickness + cardWidth) - materialThickness)
    for (var i = 0; i < verticalTabCount; i++) {
        frontPath += 'v' + verticalTabLength
        if (i % 2 == 0) {
            frontPath += 'h' + materialThickness
        } else {
            frontPath += 'h' + (-materialThickness)
        }
    }
    frontPath += 'v' + materialThickness + 'h' + (-materialThickness)
    for (var i = 0; i < horizontalTabCount2 - 1; i++) {
        frontPath += 'h' + (-horizontalTabLength2)
        if (i % 2 == 1) {
            frontPath += 'v' + materialThickness
        } else {
            frontPath += 'v' + (-materialThickness)
        }
    }
    frontPath += 'h' + (-horizontalTabLength2 - materialThickness) + 'v' + (-materialThickness) + 'h' + materialThickness
    for (var i = 0; i < verticalTabCount - 1; i++) {
        frontPath += 'v' + (-verticalTabLength)
        if (i % 2 == 1) {
            frontPath += 'h' + materialThickness
        } else {
            frontPath += 'h' + (-materialThickness)
        }
    }
    frontPath += 'Z"></path>'
    front.innerHTML = frontPath

    //bottom
    sizeSVG(bottom, materialThickness + rowCount * (materialThickness + cardWidth) + 2 * padding, rowLength + 2 * materialThickness + 2 * padding)
    var bottomPath = '<path fill="transparent" stroke="red" d="M' + (padding + materialThickness) + ' ' + (padding + materialThickness) + 'h' + horizontalTabLength2
    for (var i = 1; i < horizontalTabCount2; i++) {
        if (i % 2 == 0) {
            bottomPath += 'v' + materialThickness
        } else {
            bottomPath += 'v' + (-materialThickness)
        }
        bottomPath += 'h' + horizontalTabLength2
    }
    bottomPath += 'v' + horizontalTabLength1
    for (var i = 1; i < horizontalTabCount1; i++) {
        if (i % 2 == 1) {
            bottomPath += 'h' + materialThickness
        } else {
            bottomPath += 'h' + (-materialThickness)
        }
        bottomPath += 'v' + horizontalTabLength1
    }
    bottomPath += 'h' + (-horizontalTabLength2)
    for (var i = 1; i < horizontalTabCount2; i++) {
        if (i % 2 == 1) {
            bottomPath += 'v' + materialThickness
        } else {
            bottomPath += 'v' + (-materialThickness)
        }
        bottomPath += 'h' + (-horizontalTabLength2)
    }
    for (var i = 1; i < horizontalTabCount1; i++) {
        bottomPath += 'v' + (-horizontalTabLength1)
        if (i % 2 == 0) {
            bottomPath += 'h' + materialThickness
        } else {
            bottomPath += 'h' + (-materialThickness)
        }
    }
    bottomPath += 'Z"></path>'
    bottom.innerHTML = bottomPath

    //lid
    sizeSVG(lid, materialThickness + rowCount * (materialThickness + cardWidth) + 2 * padding, rowLength + 2 * materialThickness + 2 * padding)
    var lidPath = '<path fill="transparent" stroke="red" d="M' + (padding + materialThickness) + ' ' + (padding + materialThickness) + 'H' + ((materialThickness + rowCount * (materialThickness + cardWidth)) / 2 + padding - cardWidth / 4) + 'v' + (-materialThickness) + 'h' + (cardWidth / 2) + 'v' + materialThickness + 'H' + (rowCount * (materialThickness + cardWidth) + padding) + 'V' + (rowLength + materialThickness + padding) + 'h' + materialThickness + 'v' + materialThickness + 'H' + padding + 'v' + (-materialThickness) + 'h' + materialThickness + 'Z"></path>'
    lid.innerHTML = lidPath
    console.log(lid)

    downloadSVG([[sides, "sides.svg"], [lid, "lid.svg"], [bottom, "bottom.svg"], [front, "front.svg"], [back, "back.svg"]])
}

function downloadSVG(svgsToDownload) {
    for (var i = 0; i < svgsToDownload.length; i++) {
        var dataURL = 'data:image/svg+xml,' + encodeURIComponent((new XMLSerializer).serializeToString(svgsToDownload[i][0]))
        var downloadElement = document.createElement('a')
        document.body.appendChild(downloadElement)
        downloadElement.setAttribute('href', dataURL)
        downloadElement.setAttribute('download', svgsToDownload[i][1])
        downloadElement.click()
    }
}