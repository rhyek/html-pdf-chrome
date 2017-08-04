import * as CompletionTrigger from './CompletionTrigger';
import { CreateOptions } from './CreateOptions';
import { CreateResult } from './CreateResult';
export { CompletionTrigger, CreateOptions, CreateResult };
export declare type OutputType = 'pdf' | 'screenshot';
/**
 * Generates a PDF or screenshot from the given HTML string, launching Chrome as necessary.
 *
 * @export
 * @param {string} html The HTML string.
 * @param {Options} [options] The generation options.
 * @param {('pdf'|'screenshot')} [type=pdf] The type of document to generate.
 * @returns {Promise<CreateResult>} The generated data.
 */
export declare function create(html: string, options?: CreateOptions, type?: OutputType): Promise<CreateResult>;
/**
 * Generates a PDF from the given HTML string, launching Chrome as necessary.
 *
 * @export
 * @param {string} html the HTML string.
 * @param {Options} [options] the generation options.
 * @returns {Promise<CreateResult>} the generated PDF data.
 */
export declare function createPDF(html: string, options?: CreateOptions): Promise<CreateResult>;
/**
 * Generates a screenshot from the given HTML string, launching Chrome as necessary.
 *
 * @export
 * @param {string} html the HTML string.
 * @param {Options} [options] the generation options.
 * @returns {Promise<CreateResult>} the generated screenshot data.
 */
export declare function createScreenshot(html: string, options?: CreateOptions): Promise<CreateResult>;
