var script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js';
document.head.appendChild(script);

(function (console) {
    console.save = function (data, filename) {
        if (!data) {
            console.error('Console.save: No data');
            return;
        }

        if (!filename) filename = 'download.json';

        if (typeof data === "object") {
            data = JSON.stringify(data, undefined, 4);
        }

        var blob = new Blob([data], { type: 'text/json' }),
            e = document.createEvent('MouseEvents'),
            a = document.createElement('a');

        a.download = filename;
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
    };
})(console);

var page_urls = {};

function addImageUrl(img) {
    img.addEventListener('load', () => {
        let page_number = img.getAttribute("alt");
        if (page_number && !(page_number in page_urls)) {
            page_urls[page_number] = img;
            console.log(`Page ${page_number} added`);
        }
    });

    if (img.complete) {
        let page_number = img.getAttribute("alt");
        if (page_number && !(page_number in page_urls)) {
            page_urls[page_number] = img;
            console.log(`Page ${page_number} added`);
        }
    }
}

function monitorImages() {
    const observer = new MutationObserver(() => {
        document.querySelectorAll("img.G54Y0W_page").forEach(img => {
            addImageUrl(img);
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

function downloadAllImagesAsZip() {
    const zip = new JSZip();
    const imgFolder = zip.folder("manga_pages");

    const downloadPromises = Object.entries(page_urls).map(([page_number, img], index) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = img.naturalWidth; // Use naturalWidth/naturalHeight
                canvas.height = img.naturalHeight; // These provide the actual dimensions of the image
                context.drawImage(img, 0, 0);
                canvas.toBlob(blob => {
                    if (blob) {
                        imgFolder.file(`${index + 1}.png`, blob);
                        resolve();
                    } else {
                        console.error(`Failed to create blob for page ${page_number}`);
                        resolve();
                    }
                }, 'image/png');
            }, 100); // Small delay to ensure proper rendering
        });
    });

    Promise.all(downloadPromises).then(() => {
        zip.generateAsync({ type: "blob" }).then(content => {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(content);
            a.download = `manga_pages.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    });
}

window.addEventListener("click", event => {
    document.querySelectorAll("img.G54Y0W_page").forEach(img => {
        addImageUrl(img);
    });
});

window.addEventListener("keydown", event => {
    if (event.key == 's') {
        console.save(page_urls, `urls_scrap-${document.title}.json`);
    } else if (event.key == 'd') {
        downloadAllImagesAsZip();
    }
});

// Start monitoring for new images being added to the page
monitorImages();

// Instructions
console.log("Browse to the next page until they are all added");
console.log("Then press 's' to save and download the .json file");
console.log("Press 'd' to download all images as a zip file");
