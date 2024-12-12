const VALID_TYPES = ['image/png', 'image/jpeg', 'image/webp']

let source_blob;
let up_scale_blob;
let down_scale_blob;
let square_size = 1;
let file_name = ''

function enableButtons(buttons) {
    buttons.forEach(element => {
        element.disabled = false;
    });
}

async function scaleUp(imgElement) {
    const holder = imgUpScaleHolder
    holder.ariaBusy = true
    const scaleFactor = parseFloat(scaleInput.value) || 10;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const newWidth = imgElement.width * scaleFactor;
    const newHeight = imgElement.height * scaleFactor;
    canvas.width = newWidth;
    canvas.height = newHeight;
    context.imageSmoothingEnabled = smoothingCheckbox.checked;
    context.drawImage(imgElement, 0, 0, newWidth, newHeight);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"))
    const scaledImg = new Image();
    scaledImg.src = URL.createObjectURL(blob);
    holder.innerHTML = "";
    holder.appendChild(scaledImg);
    holder.ariaBusy = false

    up_scale_blob = blob
    enableButtons(imgUpScaleBtns)
}

async function scaleDown(imgElement) {
    const holder = imgDownScaleHolder
    holder.ariaBusy = true
    const scaleFactor = parseFloat(square_size);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const newWidth = imgElement.width / scaleFactor;
    const newHeight = imgElement.height / scaleFactor;
    canvas.width = newWidth;
    canvas.height = newHeight;
    context.imageSmoothingEnabled = smoothingCheckbox.checked;
    context.drawImage(imgElement, 0, 0, newWidth, newHeight);

    const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"))
    const scaledImg = new Image();
        scaledImg.src = URL.createObjectURL(blob);
        holder.innerHTML = "";
        holder.appendChild(scaledImg);
        holder.ariaBusy = false
        down_scale_blob = blob
        enableButtons(imgDownScaleBtns)
}

async function copyImageToClipboard(blob) {
    try {
        const item = new ClipboardItem({
            "image/png": blob
        });
        await navigator.clipboard.write([item]);
        alert("Image copied to clipboard!");
    } catch (err) {
        console.error("Failed to copy image to clipboard: ", err);
        alert("Failed to copy image to clipboard.");
    }
}


async function pasteImg(imgBlob) {
    file_name = imgBlob.name.substr(0, imgBlob.name.indexOf('.'))
    source_blob = imgBlob
    const img = URL.createObjectURL(imgBlob);
    const imgElement = new Image();
    imgElement.src = img;

    imgSourceHolder.innerHTML = '';
    imgSourceHolder.ariaBusy = true;
    imgUpScaleHolder.ariaBusy = true;
    imgDownScaleHolder.ariaBusy = true;
    imgElement.onload = function() {
        square_size = getSquareSize(imgElement)
        document.querySelector('.square-value').innerText = '(x' + (1 / square_size) + ')'
        imgSourceHolder.appendChild(imgElement);
        imgSourceHolder.ariaBusy = false;
        scaleDown(imgElement.cloneNode())
        scaleUp(imgElement.cloneNode())
    };
} 

function noImgFound() {
    alert('Not an image or a valid type (PNG, JPEG or WEBP).');
}

document.addEventListener('paste', (event) => {
    const imageItem = imgFromEventItems(event.clipboardData.items)
    if (imageItem) {
        pasteImg(imageItem.getAsFile());
        return
    }
    noImgFound()
});

document.addEventListener('dragover', e =>  e.preventDefault());
document.addEventListener('drop', (event) => {
    event.preventDefault();
    const imageBlob = imgFromEventItems(event.dataTransfer.files)
    if (imageBlob) {
        pasteImg(imageBlob);
        return
    }
    noImgFound()
});

pasteButton.addEventListener('click', imgFromClick);

function imgFromEventItems(items) {
    return Array.from(items).find(item => {
        if (isGoodType(item)) {
            return true
        }
    });
    
}

function imgFromClick() {
    imgSourceHolder.ariaBusy = true;

    navigator.clipboard.read()
    .then(items => {
        let imgType = ''
        let imgItem = items.find(item => {
            for (const type of VALID_TYPES)
                if (item.types.includes(type)) {
                    imgType = type
                    return true
                }
        })
        if (imgType == '') {
            noImgFound()
            imgSourceHolder.ariaBusy = false;
        }
        else
            imgItem.getType(imgType).then(img => pasteImg(img))
    })
    .catch(err => {
        if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
            alert('Permission to read from clipboard was denied.');
        } else {
            alert('Failed to read clipboard');
        }
        console.error('Failed to read clipboard:', err);
        imgSourceHolder.ariaBusy = false;
    });
}

openButton.addEventListener('click', () => {
    fileInput.click(); // Simula il click sull'input invisibile
});

function isGoodType(item) {
    for (const type of VALID_TYPES) {
        if (item.type == type) {
            return true
        }
    }
    return false
}

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        if (isGoodType(file)) 
            pasteImg(file); 
        else
            noImgFound()
    }
})

imgUpScaleCopyBtn.addEventListener('click', () => {
    copyImageToClipboard(up_scale_blob)
})

imgDownScaleCopyBtn.addEventListener('click', () => {
    copyImageToClipboard(down_scale_blob)
})

imgUpScaleSaveBtn.addEventListener('click', () => {
    downloadBlobAsImage(up_scale_blob, file_name + '_scaled.png')
})

imgDownScaleSaveBtn.addEventListener('click', () => {
    downloadBlobAsImage(down_scale_blob, file_name + '_original.png')
})

function downloadBlobAsImage(blob, filename) {
    const url = URL.createObjectURL(blob); // Create a URL for the blob
    const link = document.createElement('a'); // Create an <a> element
    link.href = url; // Set the href to the blob URL
    link.download = filename; // Set the download filename
    document.body.appendChild(link); // Append the link to the document
    link.click(); // Trigger the download
    document.body.removeChild(link); // Remove the link
    URL.revokeObjectURL(url); // Revoke the object URL to free memory
}

  
