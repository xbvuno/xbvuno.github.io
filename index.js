
const scaleInput = document.getElementById("scale");
const smoothingCheckbox = document.getElementById("smoothing");

const pasteButton = document.getElementById("paste");
const openButton = document.getElementById("open");
const fileInput = document.querySelector('#img-source input')

const settingsDialog = document.querySelector('dialog.settings');


const scaleValueDisplay = document.querySelectorAll('.scale-value');
const smoothingValueDisplay = document.querySelectorAll('.smoothing-value');

const imgSourceHolder = document.querySelector('#img-source .img-holder');

const imgDownScaleHolder = document.querySelector('#img-scaled-down .img-holder');
const imgDownScaleCopyBtn = document.querySelector('#img-scaled-down button:nth-child(1)');
const imgDownScaleSaveBtn = document.querySelector('#img-scaled-down button:nth-child(2)');
const imgDownScaleBtns = [imgDownScaleCopyBtn, imgDownScaleSaveBtn]

const imgUpScaleHolder = document.querySelector('#img-scaled-up .img-holder');
const imgUpScaleCopyBtn = document.querySelector('#img-scaled-up button:nth-child(1)');
const imgUpScaleSaveBtn = document.querySelector('#img-scaled-up button:nth-child(2)');
const imgUpScaleBtns = [imgUpScaleCopyBtn, imgUpScaleSaveBtn]

const themeSwitchBtn = document.querySelector('#theme-switch')

function setTheme(theme) {
    theme = theme == 'light' ? 'light' : 'dark'
    themeSwitchBtn.innerText = theme == 'light' ? 'wb_sunny' : 'dark_mode'
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
}

function switchTheme() {
    const actual_theme =  document.documentElement.getAttribute('data-theme')
    const new_theme = actual_theme == 'light' ? 'dark' : 'light'
    setTheme(new_theme)
}

function openSettings() {
    settingsDialog.showModal()
}

function closeSettings() {
    settingsDialog.close()
}

function updateSettings() {
    scaleInput.value = scale;
    scaleValueDisplay.forEach(el => el.textContent = scale);

    smoothingCheckbox.checked = smooting
    smoothingValueDisplay.forEach(el => el.textContent = smooting)
}

function saveSettings() {
    scale = parseInt(scaleInput.value)
    smooting = smoothingCheckbox.checked
    console.log(smoothingCheckbox.checked)
    localStorage.setItem('scale', scale)
    localStorage.setItem('smoothing', smooting)
    updateSettings()
    closeSettings()
}

window.onload = function () {
    scale = parseInt(localStorage.getItem('scale'));
    if (!scale)
        scale = 10
    
    smooting = localStorage.getItem('smoothing') == 'true';
    if (!smooting)
        smooting = false
    setTheme(localStorage.getItem('theme'))
    updateSettings()
};



