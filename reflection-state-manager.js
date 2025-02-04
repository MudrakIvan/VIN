/**
 * @typedef {Object} ReflectionState
 * @property {number} radius
 * @property {number} slicesCount
 * @property {number} coneHeightMultiplier
 * @property {boolean} move
 * @property {ReflectionType} reflectionType
 * @property {string} background
 * @property {[number, number]} offset
 * @property {import("./lib/types/index.d.ts").Image} img
 */

/**
 * @typedef {"none" | "vertical" | "horizontal" | "both"} ReflectionType
 */

export class ReflectionStateManger {
    /**
     * @return {ReflectionState}
     */
    get reflectionState() {
        return this.state;
    }

    /**
     * @param {import("./lib/types/index.d.ts").Image} img
     */
    set reflectionStateImage(img) {
        this.state.img = img;
        this.handleResize();
    }

    /**
     * @param {import("./lib/types/index.d.ts")} p5Instance
     */
    constructor(p5Instance) {
        /**
         * @type {ReflectionState}
         * @private
         */
        this.state = {
            radius: 100,
            slicesCount: 6,
            coneHeightMultiplier: 1,
            reflectionType: 'horizontal',
            background: '#ffffff',
            move: true,
            img: null,
        };

        /**
         * @type {import("./lib/types/index.d.ts")}
         * @private
         * @readonly
         */
        this.p5 = p5Instance;
    }

    /**
     * @param {Event} event
     */
    handleImageUpload(event) {
        /** @type {HTMLInputElement} */
        const input = event.target;
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.p5.loadImage(e.target.result, (img) => {
                    this.reflectionStateImage = img;
                });
            };
            reader.readAsDataURL(file);
        }
    }

    /**
     * @param {Event} event
     */
    handleRadiusChange(event) {
        /** @type {HTMLInputElement} */
        const input = event.target;
        this.state.radius = input.value;
        this.p5.redraw();
    }

    /**
     * @param {Event} event
     */
    handleSlicesChange(event) {
        /** @type {HTMLInputElement} */
        const input = event.target;
        this.state.slicesCount = input.value;
        this.p5.redraw();
    }

    /**
     * @param {Event} event
     */
    handleConeHeightChange(event) {
        /** @type {HTMLInputElement} */
        const input = event.target;
        this.state.coneHeightMultiplier = input.value;
        this.p5.redraw();
    }

    /**
     * @param {Event} event
     */
    handleReflectionTypeChange(event) {
        /** @type {HTMLSelectElement} */
        const select = event.target;
        this.state.reflectionType = select.value;
        this.p5.redraw();
    }

    /**
     * @param {Event} event
     */
    handleBackgroundChange(event) {
        /** @type {HTMLInputElement} */
        const input = event.target;
        this.state.background = input.value;
        this.p5.redraw();
    }

    handleResize() {
        const canvasSize = this.getCanvasSize(window.innerWidth);
        this.p5.resizeCanvas(...canvasSize);

        this.state.offset = [
            this.p5.max((canvasSize[0] - this.state.img.width) / 2, 0),
            this.p5.max((canvasSize[1] - this.state.img.height) / 2, 0)
        ];

        this.p5.redraw();
    }

    handleMousePressed() {
        this.state.move = !this.state.move;
    }

    handleSaveImage() {
        this.p5.saveCanvas('reflection', 'png');
    }

    /**
     * @param {number} duration
     * @param {number} delay
     */
    handleGifExport(duration, delay) {
        // saveGif delay does not work currently -> timeout is used to simulate it
        setTimeout(() => {
            this.p5.saveGif('reflection', duration, {
                units: 'seconds',
                notificationDuration: 2
            });
        }, delay * 1000);
    }

    /**
     * @param {number} windowWidth
     * @return {[number, number]}
     */
    getCanvasSize(windowWidth) {
        const ratio = this.state.img ? this.state.img.width / this.state.img.height : 16 / 9;
        return [windowWidth - 100, (windowWidth - 100) / ratio];
    }
}
