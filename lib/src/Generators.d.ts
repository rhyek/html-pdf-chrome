import { CreateOptions } from './CreateOptions';
import { CreateResult } from './CreateResult';
/**
 * Base class for all Generators.
 */
export declare abstract class Generator {
    html: string;
    options: CreateOptions;
    /**
     * Create a Generator.
     * @param {string} html The HTML string.
     * @param {Options} [options] The generation options.
     */
    constructor(html: string, options?: CreateOptions);
    /**
     * Generates the document for the generator's instance type
     *
     * @returns {Promise<CreateResult>} The generated data.
     */
    create(): Promise<CreateResult>;
    protected abstract generate(client: any, options: CreateOptions): Promise<CreateResult>;
    protected readonly url: string;
}
/**
 * Generator for PDFs.
 */
export declare class PDFGenerator extends Generator {
    protected generate(client: any, options: CreateOptions): Promise<CreateResult>;
}
/**
 * Generator for screenshots.
 * Code copied from https://github.com/schnerd/chrome-headless-screenshots/blob/master/index.js
 */
export declare class ScreenshotGenerator extends Generator {
    protected generate(client: any, options: CreateOptions): Promise<CreateResult>;
}
