lazyLoad([
	['/data/site/images/samples/fullRes/sample1.png', 'sample1'],
	['/data/site/images/samples/fullRes/sample2.png', 'sample2'],
	['/data/site/images/samples/fullRes/sample3.png', 'sample3'],
	['/data/site/images/samples/fullRes/sample4.png', 'sample4'],
	['/data/site/images/samples/fullRes/sample5.png', 'sample5'],
	['/data/site/images/samples/fullRes/sampleBling.png', 'sampleBling'],
	['/data/site/images/samples/fullRes/sampleCustomize.png', 'sampleCustomize'],
	['/data/site/images/samples/fullRes/sampleVariety.png', 'sampleVariety']
])

function lazyLoad(imageList = []) {
	for (var i = 0; i < imageList.length; i++) {
		var tempSampleImage = new Image()
		tempSampleImage.customVarId = imageList[i][1]
		tempSampleImage.onload = function() {
			document.getElementById(this.customVarId).src = this.src
		}
		tempSampleImage.src = imageList[i][0]
	}
}
