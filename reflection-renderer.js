export class ReflectionRenderer {
    /**
     * @param {import("./lib/types/index.d.ts")} p5Instance
     */
    constructor(p5Instance) {
        /**
         * @type {import("./lib/types/index.d.ts")}
         * @private
         * @readonly
         */
        this.p5 = p5Instance;
        /**
         * @type {[number, number]}
         * @private
         */
        this.center = [0, 0];
    }

    /**
     * @param {import("./reflection-state-manager").ReflectionState} state
     * @return {void}
     */
    draw(state) {
        if (state.move) {
            this.center = [this.p5.mouseX, this.p5.mouseY];
        }

        this.p5.background(state.background);
        this.drawBase(state);
        this.drawSlices(state);
    }

    /**
     * @param {import("./reflection-state-manager").ReflectionState} state
     * @return {void}
     */
    drawBase(state) {
        this.p5.drawingContext.save();
        this.drawNAngle(state.slicesCount, ...this.center, state.radius);
        this.p5.drawingContext.clip();
        this.p5.background(state.background);
        this.p5.image(state.img, ...state.offset, ...this.getImageSize(state));
        this.p5.drawingContext.restore();
    }

    /**
     * @param {import("./reflection-state-manager").ReflectionState} state
     * @return {void}
     */
    drawSlices(state) {
        for (let i = 0; i < state.slicesCount; i++) {
            this.drawSlice(i, ...this.center, state);
        }
    }

    /**
     * @param {number} vertexNum
     * @param {number} x
     * @param {number} y
     * @param {import("./reflection-state-manager").ReflectionState} state
     * @return {void}
     */
    drawSlice(vertexNum, x, y, state) {
        const { img, slicesCount, coneHeightMultiplier, radius } = state;
        // Get edge vertices
        const start = this.getVertex(vertexNum, slicesCount, x, y, radius);
        const end = this.getVertex((vertexNum + 1) % slicesCount, slicesCount, x, y, radius);

        this.p5.push();
        this.p5.drawingContext.save();

        const edgeLength = this.p5.dist(start[0], start[1], end[0], end[1]);
        const angle = this.p5.atan2(end[1] - start[1], end[0] - start[0]);

        // Move to first vertex
        this.p5.translate(start[0], start[1]);
        this.p5.rotate(angle);

        this.drawEdgeRect(edgeLength, coneHeightMultiplier, slicesCount);
        this.p5.drawingContext.clip();

        this.p5.rotate(-angle);
        this.p5.translate(-start[0], -start[1]);

        const mid = [start[0] + (end[0] - start[0]) / 2, start[1] + (end[1] - start[1]) / 2];

        this.p5.translate(mid[0], mid[1]);

        const scale =
            state.reflectionType === 'none' ? [1, 1] :
            state.reflectionType === 'vertical' ? [-1, 1] :
            state.reflectionType === 'horizontal' ? [1, -1] :
            [-1, -1];

        const mirrorAngle = (angle + this.p5.PI);
        this.p5.rotate(mirrorAngle);
        this.p5.scale(scale[0], scale[1] * coneHeightMultiplier);
        this.p5.rotate(-mirrorAngle);

        this.p5.translate(-mid[0], -mid[1]);


        this.p5.background(state.background);
        this.p5.image(img, ...state.offset, ...this.getImageSize(state));

        this.p5.drawingContext.restore();
        this.p5.pop();
    }

    /**
     * @param {number} vertexNum
     * @param {number} x
     * @param {number} y
     * @param {number} radius
     * @return {void}
     */
    drawNAngle(vertexNum, x, y, radius) {
        this.p5.beginShape();
        for (let i = 0; i < vertexNum; i++) {
            this.p5.vertex(...this.getVertex(i, vertexNum, x, y, radius));
        }
        this.p5.endShape(this.p5.CLOSE);
    }

    /**
     * @param {number} edgeLength
     * @param {number} coneHeightMultiplier
     * @param {number} slicesCount
     * @return {void}
     */
    drawEdgeRect(edgeLength, coneHeightMultiplier, slicesCount) {
        const newEdgeLength = this.p5.tan(this.p5.PI / slicesCount) *  (coneHeightMultiplier * edgeLength);

        this.p5.beginShape();
        this.p5.vertex(0, 0);
        this.p5.vertex(edgeLength, 0);
        this.p5.vertex(edgeLength + newEdgeLength, -coneHeightMultiplier* edgeLength);
        this.p5.vertex(-newEdgeLength, -coneHeightMultiplier * edgeLength);
        this.p5.endShape(this.p5.CLOSE);
    }

    /**
     * @param {number} vertexNum
     * @param {number} totalVertexNum
     * @param {number} x
     * @param {number} y
     * @param {number} radius
     * @return {[number, number]}
     */
    getVertex(vertexNum, totalVertexNum, x, y, radius) {
        const angle = this.p5.TWO_PI / totalVertexNum * vertexNum;
        const vx = x + this.p5.cos(angle) * radius;
        const vy = y + this.p5.sin(angle) * radius;
        return [vx, vy];
    }

    /**
     * @param {import("./reflection-state-manager").ReflectionState} state
     * @return {[number, number]}
     */
    getImageSize(state) {
        if (state.img.width > this.p5.width) {
            return [this.p5.width, this.p5.width * state.img.height / state.img.width];
        }

        return [state.img.width, state.img.height];
    }
}
