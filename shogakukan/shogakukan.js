(function (console) {

	console.save = function (data, filename) {

		if (!data) {
			console.error('Console.save: No data')
			return;
		}

		if (!filename) filename = 'download.json'

		if (typeof data === "object") {
			data = JSON.stringify(data, undefined, 4)
		}

		var blob = new Blob([data], { type: 'text/json' }),
			e = document.createEvent('MouseEvents'),
			a = document.createElement('a')

		a.download = filename
		a.href = window.URL.createObjectURL(blob)
		a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
		e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
		a.dispatchEvent(e)
	}
})(console)

var page_urls = {}

function addCanvasUrl(canvas) {
	let page_number = canvas.getAttribute("debug-page-id");
	if (!(page_number in page_urls) && page_number != null) {
		page_urls[page_number] = canvas.toDataURL();
		console.log(`Page ${page_number} added`)
	}
}

window.addEventListener("click", event => {
	document.querySelectorAll("canvas.page").forEach(canvas => {
		addCanvasUrl(canvas);
	});
});

window.addEventListener("keydown", event => {
	if (event.key == 's') {
		console.save(page_urls, `urls scrap-${document.title}.json`);
	}
	// else {
	// 	document.querySelectorAll("canvas.page").forEach(canvas => {
	// 		addCanvasUrl(canvas);
	// 	});
	// }
});


// Instructions
console.log("Browse to the next page until they are all added")
console.log("Then press 's' to save and download the .json file")
