
var start = new Date().getTime();

var myargs = process.argv.slice(2);


var fs = require('fs'),
    PNG = require('pngjs').PNG,
    pixelmatch = require('pixelmatch');

var img1 = fs.createReadStream(myargs[0]).pipe(new PNG()).on('parsed', doneReading),
    img2 = fs.createReadStream(myargs[1]).pipe(new PNG()).on('parsed', doneReading),
    filesRead = 0;

function doneReading() {
    if (++filesRead < 2) return;
    var diff = new PNG({width: img1.width, height: img1.height});

    var numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, {threshold: 0.1});
    var im1PixelLen = img1.data.length;
    var im2PixelLen = img2.data.length;

    var avg = (im2PixelLen+im1PixelLen)/2;
    var percentDifference = (numDiffPixels/avg)*100;

    diff.pack().pipe(fs.createWriteStream(myargs[0].slice(11) + '_' + myargs[1].slice(11) + 'diff.png'));
    var end = new Date().getTime();
    var time = end - start;
    console.log(percentDifference)
    // console.log(time)
}
