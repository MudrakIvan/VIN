
import { ReflectionRenderer } from "./reflection-renderer.js";
import { ReflectionStateManger } from "./reflection-state-manager.js";

window.addEventListener('load', () => {
    /** @param {import("./lib/types/index.d.ts")} p5Instance */
    let sketch = function(p5Instance) {
        const renderer = new ReflectionRenderer(p5Instance);
        const stateManger = new ReflectionStateManger(p5Instance);

        p5Instance.preload = function() {
            p5Instance.loadImage('images/test.webp', (img) =>
                stateManger.reflectionStateImage = img
            );
        };

        p5Instance.setup = function() {
            initListeners(stateManger);
            p5Instance.createCanvas(...stateManger.getCanvasSize(window.innerWidth), p5Instance.P2D);
        };

        p5Instance.draw = function() {
            renderer.draw(stateManger.reflectionState);
        };

        p5Instance.keyPressed = function() {
            if (p5Instance.key === 's') {
                stateManger.handleSaveImage();
                return;
            }

            if (p5Instance.key === 'p') {
                stateManger.handleMousePressed();
                return;
            }

            if (p5Instance.key === 'g') {
                stateManger.handleGifExport(1.5, 0.5);
            }
        }
    };

    const sketchContainer = document.querySelector('#sketchContainer');
    new p5(sketch, sketchContainer);
    initUI();
});

/**
 * @param {ReflectionStateManger} stateManger
 */
function initListeners(stateManger) {
    const imageUpload = document.querySelector('#imageUpload');
    imageUpload.addEventListener('change', stateManger.handleImageUpload.bind(stateManger));

    const radiusInput = document.querySelector('#radius');
    radiusInput.addEventListener('input', stateManger.handleRadiusChange.bind(stateManger));

    const slicesInput = document.querySelector('#sliceCount');
    slicesInput.addEventListener('input', stateManger.handleSlicesChange.bind(stateManger));

    const coneHeightInput = document.querySelector('#coneHeightMultiplier');
    coneHeightInput.addEventListener('input', stateManger.handleConeHeightChange.bind(stateManger));

    const reflectionTypeInput = document.querySelector('#reflectionType');
    reflectionTypeInput.addEventListener('input', stateManger.handleReflectionTypeChange.bind(stateManger));

    const backgroundInput = document.querySelector('#background');
    backgroundInput.addEventListener('input', stateManger.handleBackgroundChange.bind(stateManger));

    window.addEventListener('resize', stateManger.handleResize.bind(stateManger));

    const canvasEl = document.querySelector('#sketchContainer');
    canvasEl.addEventListener('click', stateManger.handleMousePressed.bind(stateManger));

    const saveButton = document.querySelector('#save');
    saveButton.addEventListener('click', stateManger.handleSaveImage.bind(stateManger));

    const gifForm = document.querySelector('#gifForm');
    gifForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        stateManger.handleGifExport(
            parseFloat(formData.get('gifDuration')),
            parseFloat(formData.get('gifOffset'))
        );

        const dialog = document.querySelector('#gifModal');
        dialog.close();
    });

}

function initUI() {
    const slider = document.querySelectorAll('input[type="range"]');
    slider.forEach(s => s.addEventListener('input', (e) => {
        /** @type {HTMLInputElement} target */
        const target = e.target;
        const value = target.value;
        const label = target.previousElementSibling.querySelector('span');
        label.textContent = value;
    }));

    initDropZone();
    initDialog('#gifModal', '#exportGif', '#cancelGif');
    initDialog('#infoModal', '#showInfo', '#closeInfo');
}

function initDropZone() {
    const dropZone = document.querySelector('#dropZone');
    const input = document.querySelector('#imageUpload');
    const preview = document.querySelector('#imagePreview');
    const text = dropZone.querySelector('.drop-zone-text');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.add('drag-over');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove('drag-over');
        });
    });

    dropZone.addEventListener('drop', (e) => {
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            input.files = e.dataTransfer.files;
            updatePreview(file);
            input.dispatchEvent(new Event('change'));
        }
    });

    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) updatePreview(file);
    });

    const updatePreview = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            preview.style.display = 'block';
            text.style.opacity = '0';
        };
        reader.readAsDataURL(file);
    }
}

/**
 * @param {string} dialogSelector
 * @param {string} showSelector
 * @param {string} closeSelector
 */
function initDialog(dialogSelector, showSelector, closeSelector) {
    const dialog = document.querySelector(dialogSelector);
    const showButton = document.querySelector(showSelector);
    const closeButton = document.querySelector(closeSelector);

    showButton.addEventListener('click', () => {
        dialog.showModal();
    });

    closeButton.addEventListener('click', () => {
        dialog.close();
    });
}
