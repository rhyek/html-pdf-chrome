'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const CompletionTrigger = require("./CompletionTrigger");
exports.CompletionTrigger = CompletionTrigger;
const CreateResult_1 = require("./CreateResult");
exports.CreateResult = CreateResult_1.CreateResult;
const Generators_1 = require("./Generators");
/**
 * Internal function used by all exported creator functions.
 *
 * @param {string} html The HTML string.
 * @param {Options} [options] The generation options.
 * @param {('pdf'|'screenshot')} [type=pdf] The type of document to generate.
 * @returns {Promise<CreateResult>} the generated data.
 */
function _create(html, options, what = 'pdf') {
    const generators = {
        pdf: Generators_1.PDFGenerator,
        screenshot: Generators_1.ScreenshotGenerator,
    };
    const generator = new generators[what](html, options);
    return generator.create();
}
/**
 * Generates a PDF or screenshot from the given HTML string, launching Chrome as necessary.
 *
 * @export
 * @param {string} html The HTML string.
 * @param {Options} [options] The generation options.
 * @param {('pdf'|'screenshot')} [type=pdf] The type of document to generate.
 * @returns {Promise<CreateResult>} The generated data.
 */
function create(html, options, type = 'pdf') {
    return _create(html, options, type);
}
exports.create = create;
/**
 * Generates a PDF from the given HTML string, launching Chrome as necessary.
 *
 * @export
 * @param {string} html the HTML string.
 * @param {Options} [options] the generation options.
 * @returns {Promise<CreateResult>} the generated PDF data.
 */
function createPDF(html, options) {
    return _create(html, options, 'pdf');
}
exports.createPDF = createPDF;
/**
 * Generates a screenshot from the given HTML string, launching Chrome as necessary.
 *
 * @export
 * @param {string} html the HTML string.
 * @param {Options} [options] the generation options.
 * @returns {Promise<CreateResult>} the generated screenshot data.
 */
function createScreenshot(html, options) {
    return _create(html, options, 'screenshot');
}
exports.createScreenshot = createScreenshot;

//# sourceMappingURL=index.js.map
