var localStorageCardKeyList = new Array()
var selectedCardKey = ''

if (localStorage.getItem('cardKeyList') == null) {
  localStorage.setItem('cardKeyList', '[]')
} else {
  loadSavedCards()
}

function loadSavedCards() {
  localStorageCardKeyList = JSON.parse(localStorage.getItem('cardKeyList'))
  document.getElementById('inputCardToImport').innerHTML = '<option disabled selected="selected">None selected</option>'
  for (var i = 0; i < localStorageCardKeyList.length; i ++) {
    document.getElementById('inputCardToImport').innerHTML += '<option>' + localStorageCardKeyList[i] + '</option>'
  }
}

function saveCard() {
  var savedCardKey = cardTextList[0].text
  if (!savedCardKey) {
    savedCardKey = 'unnamed'
  }
  savedCardKey = prompt('Please enter the name you\'d like to save your card as', savedCardKey)
  if (localStorageCardKeyList.includes(savedCardKey)) {
    if (!confirm('Would you like to overwrite the card you previously saved as ' + savedCardKey + "? (Pressing 'Cancel' will still save the card, but will affix a version number at the end)")) {
      var originalCardKey = savedCardKey
      var duplicateCount = 1
      while (localStorageCardKeyList.includes(savedCardKey)) {
        savedCardKey = originalCardKey + ' (' + duplicateCount + ')'
        duplicateCount ++
      }
    }
  }
  if (!localStorageCardKeyList.includes(savedCardKey)) {
    //If the card is new, add it, updated the select element, and update the localstorage
    localStorageCardKeyList.push(savedCardKey)
    localStorageCardKeyList.sort()
    document.getElementById('inputCardToImport').innerHTML = '<option disabled selected="selected">None selected</option>'
    for (var i = 0; i < localStorageCardKeyList.length; i ++) {
      document.getElementById('inputCardToImport').innerHTML += '<option>' + localStorageCardKeyList[i] + '</option>'
    }
    localStorage.setItem('cardKeyList', JSON.stringify(localStorageCardKeyList))
  }
  var cardToBeSaved = new savedCard(savedCardKey)
  cardToBeSaved.save()
}

function deleteCard() {
  if (confirm('Are you sure you want to delete ' + selectedCardKey + '?')) {
    localStorageCardKeyList.splice(localStorageCardKeyList.indexOf(selectedCardKey), 1)
    document.getElementById('inputCardToImport').innerHTML = '<option disabled selected="selected">None selected</option>'
    for (var i = 0; i < localStorageCardKeyList.length; i ++) {
      document.getElementById('inputCardToImport').innerHTML += '<option>' + localStorageCardKeyList[i] + '</option>'
    }
    localStorage.setItem('cardKeyList', JSON.stringify(localStorageCardKeyList))
    localStorage.removeItem(selectedCardKey)
  }
}

function importSavedCard(localStorageKey = document.getElementById('inputCardToImport').value) {
  if (localStorageKey) {
    selectedCardKey = localStorageKey
    importedCard = JSON.parse(localStorage.getItem(localStorageKey))
    //Skip trackers
    skipLoadTextList = 0
    skipResizeCardArt = 1
    if (importedCard.version != currentVersion) {
      skipLoadTextList += 1
      skipResizeCardArt += 1
      if (importedCard.version.split('/')[1] != 'version' && (currentVersion.split('/')[0] != importedCard.version.split('/')[0] || currentVersion.split('/')[1] != 'version')) {
        skipLoadTextList += 1
        skipResizeCardArt += 1
      }
    }
    //Masks
    loadMaskImages(importedCard.maskList)
    //Version
    document.getElementById('inputFrameVersion').value = importedCard.version.split('/')[0]
    loadVersion(importedCard.version.split('/')[0])
    if (!importedCard.version.includes('version')) {
      loadScript('/data/scripts/versions/' + importedCard.version + '.js')
    }
    //Frame
    document.getElementById('cardMaster').innerHTML = importedCard.cardMaster
    cardMasterList = cardMasterList.slice(0, 2)
    cardMasterList = cardMasterList.concat(importedCard.cardMasterList)
    var tempObject = new cardImage()
    var tempElement = tempObject.cardMasterElement()
    for (var i = 2; i < cardMasterList.length; i ++) {
      cardMasterList[i].image = new Image()
      cardMasterList[i].image.src = cardMasterList[i].imageSource
      cardMasterList[i].draw = tempObject.draw
    }
    for (var i = 0; i < document.getElementById('cardMaster').children.length; i ++) {
      if (parseInt(document.getElementById('cardMaster').children[i].id.replace('uniqueNumber', '')) > 1) {
        document.getElementById('cardMaster').children[i].onclick = tempElement.onclick
      }
    }
    uniqueNumberTracker = importedCard.numberTracker
    //Art
    document.getElementById('inputCardArtX').value = importedCard.artX
    document.getElementById('inputCardArtY').value = importedCard.artY
    document.getElementById('inputCardArtZoom').value = importedCard.artZoom
    cardArt.src = importedCard.cardArt
    //Set Symbol
    setSymbol.src = importedCard.setSymbol
    document.getElementById('inputSetSymbolX').value = importedCard.setSymbolX
    document.getElementById('inputSetSymbolY').value = importedCard.setSymbolY
    document.getElementById('inputSetSymbolZoom').value = importedCard.setSymbolZoom
    //Watermark
    watermark.src = importedCard.watermark
    document.getElementById('inputWatermarkPrimary').value = importedCard.watermarkPrimary
    document.getElementById('inputWatermarkSecondary').value = importedCard.watermarkSecondary
    document.getElementById('inputWatermarkOpacity').value = importedCard.watermarkOpacity
    //Collector
    document.getElementById('inputInfoNumber').value = importedCard.number
    document.getElementById('inputInfoRarity').value = importedCard.rarity
    document.getElementById('inputInfoSet').value = importedCard.set
    document.getElementById('inputInfoLanguage').value = importedCard.language
    document.getElementById('inputInfoArtist').value = importedCard.artist
    document.getElementById('inputInfoArtist2').value = importedCard.artist
    bottomInfoUpdated()
    //Mana Cost
    if (importedCard.manaCostList) {
      for (var i = 0; i < importedCard.manaCostList.length; i ++) {
        if (!manaSymbolCodeList.includes(importedCard.manaCostList[i][0])) {
          manaSymbolCodeList.push(importedCard.manaCostList[i][0])
          manaSymbolImageList.push(new Image())
          manaSymbolImageList[manaSymbolImageList.length - 1].onload = manaCostUpdated
          manaSymbolImageList[manaSymbolImageList.length - 1].src = importedCard.manaCostList[i][1]
        }
      }
    }
    document.getElementById('inputManaCost').value = importedCard.manaCost
    manaCostUpdated()
    //Text
    cardTextList = importedCard.text
    document.getElementById('textPicker').children[0].click()
    drawCardText()
  }
}

class savedCard {
  constructor(keyToUse = 'unnamed') {
    //Masks
    this.maskList = []
    for (var i = 0; i < cardMasterList.length; i ++) {
      if (cardMasterList[i].masks != undefined) {
        this.maskList.push([cardMasterList[i].masks[0], maskImageList[maskNameList.indexOf(cardMasterList[i].masks[0])].src])
      }
    }
    //Frame Version
    this.version = currentVersion
    //Frame
    this.cardMaster = document.getElementById('cardMaster').innerHTML.replace(' selected', '')
    this.cardMasterList = cardMasterList.slice(2)
    this.numberTracker = uniqueNumberTracker
    //Art
    this.cardArt = cardArt.src
    this.artX = document.getElementById('inputCardArtX').value
    this.artY = document.getElementById('inputCardArtY').value
    this.artZoom = document.getElementById('inputCardArtZoom').value
    //Set Symbol
    this.setSymbol = setSymbol.src
    this.setSymbolX = document.getElementById('inputSetSymbolX').value
    this.setSymbolY = document.getElementById('inputSetSymbolY').value
    this.setSymbolZoom = document.getElementById('inputSetSymbolZoom').value
    //Watermark
    this.watermark = watermark.src
    this.watermarkPrimary = document.getElementById('inputWatermarkPrimary').value
    this.watermarkSecondary = document.getElementById('inputWatermarkSecondary').value
    this.watermarkOpacity = document.getElementById('inputWatermarkOpacity').value
    //Collector
    this.number = document.getElementById('inputInfoNumber').value
    this.rarity = document.getElementById('inputInfoRarity').value
    this.set = document.getElementById('inputInfoSet').value
    this.language = document.getElementById('inputInfoLanguage').value
    this.artist = document.getElementById('inputInfoArtist').value
    //Mana Cost
    this.manaCostList = []
    for (var i = 0; i < usedManaSymbols.length; i ++) {
      this.manaCostList.push([usedManaSymbols[i], manaSymbolImageList[manaSymbolCodeList.indexOf(usedManaSymbols[i])].src])
    }
    this.manaCost = document.getElementById('inputManaCost').value
    //Text
    this.text = cardTextList
    //Key
    this.key = keyToUse
    //Version Control
    this.ccVersion = 1
  }
  save() {
    localStorage.setItem(this.key, JSON.stringify(this))
  }
}

function downloadSavedCards() {
  var savedCardsText = ''
  for (var i = 0; i < localStorageCardKeyList.length; i ++) {
    savedCardsText += localStorageCardKeyList[i] + '<<cardData>>' + localStorage.getItem(localStorageCardKeyList[i]) + '<<newCard>>'
  }
  savedCardsText = savedCardsText.slice(0, -11)
  var blob = new Blob([savedCardsText], {type: 'text'})
  var a = document.createElement('a')
  a.download = 'Card_Conjurer_Saved_Cards'
  a.href = URL.createObjectURL(blob)
  a.dataset.downloadurl = ['text', a.download, a.href].join(':')
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500)
}

function uploadSavedCards(event) {
  var reader = new FileReader()
  reader.onload = function() {
    var uploadedCardList = reader.result.split('<<newCard>>')
    for (var j = 0; j < uploadedCardList.length; j ++) {
      var uploadedCard = uploadedCardList[j].split('<<cardData>>')
      var savedCardKey = uploadedCard[0]
      if (localStorageCardKeyList.includes(savedCardKey)) {
        if (!confirm('Would you like to overwrite the card you previously saved as ' + savedCardKey + "? (Pressing 'Cancel' will still save the card, but will affix a version number at the end)")) {
          var originalCardKey = savedCardKey
          var duplicateCount = 1
          while (localStorageCardKeyList.includes(savedCardKey)) {
            savedCardKey = originalCardKey + ' (' + duplicateCount + ')'
            duplicateCount ++
          }
        }
      }
      if (!localStorageCardKeyList.includes(savedCardKey)) {
        //If the card is new, add it, updated the select element, and update the localstorage
        localStorageCardKeyList.push(savedCardKey)
      }
      localStorage.setItem(savedCardKey, uploadedCard[1])
    }
    localStorageCardKeyList.sort()
    document.getElementById('inputCardToImport').innerHTML = '<option disabled selected="selected">None selected</option>'
    for (var i = 0; i < localStorageCardKeyList.length; i ++) {
      document.getElementById('inputCardToImport').innerHTML += '<option>' + localStorageCardKeyList[i] + '</option>'
    }
    localStorage.setItem('cardKeyList', JSON.stringify(localStorageCardKeyList))
  }
  reader.readAsText(event.target.files[0], 'UTF-8')
}