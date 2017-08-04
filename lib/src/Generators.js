'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chrome_launcher_1 = require("chrome-launcher");
const CDP = require("chrome-remote-interface");
const CreateResult_1 = require("./CreateResult");
/**
 * Throws an exception if the operation has been canceled.
 *
 * @param {CreateOptions} options the options which track cancellation.
 * @returns {Promise<void>} reject if canceled, resolve if not.
 */
function throwIfCanceled(options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (options._canceled) {
            throw new Error('HtmlPdf.create() timed out.');
        }
    });
}
/**
 * Launches Chrome with the specified options.
 *
 * @param {CreateOptions} options the options for Chrome.
 * @returns {Promise<LaunchedChrome>} The launched Chrome instance.
 */
function launchChrome(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const chrome = yield chrome_launcher_1.launch({
            port: options.port,
            chromePath: options.chromePath,
            chromeFlags: [
                '--disable-gpu',
                '--headless',
                '--hide-scrollbars',
            ],
        });
        options.port = chrome.port;
        return chrome;
    });
}
/**
 * Base class for all Generators.
 */
class Generator {
    /**
     * Create a Generator.
     * @param {string} html The HTML string.
     * @param {Options} [options] The generation options.
     */
    constructor(html, options) {
        this.html = html;
        this.options = options;
    }
    /**
     * Generates the document for the generator's instance type
     *
     * @returns {Promise<CreateResult>} The generated data.
     */
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            const myOptions = Object.assign({}, this.options);
            let chrome;
            myOptions._canceled = false;
            if (myOptions.timeout >= 0) {
                setTimeout(() => {
                    myOptions._canceled = true;
                }, myOptions.timeout);
            }
            yield throwIfCanceled(myOptions);
            if (!myOptions.host && !myOptions.port) {
                yield throwIfCanceled(myOptions);
                chrome = yield launchChrome(myOptions);
            }
            const tab = yield CDP.New(myOptions);
            const client = yield CDP(Object.assign({}, myOptions, { tab }));
            try {
                return yield this.generate(client, myOptions);
            }
            finally {
                yield client.close();
                yield CDP.Close(Object.assign({}, myOptions, { id: tab.id }));
                if (chrome) {
                    yield chrome.kill();
                }
            }
        });
    }
    get url() {
        return /^(https?|file|data):/i.test(this.html) ? this.html : `data:text/html,${this.html}`;
    }
}
exports.Generator = Generator;
/**
 * Generator for PDFs.
 */
class PDFGenerator extends Generator {
    generate(client, options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield throwIfCanceled(options);
            const { Page } = client;
            yield Page.enable(); // Enable Page events
            yield throwIfCanceled(options);
            yield Page.navigate({ url: this.url });
            yield throwIfCanceled(options);
            yield Page.loadEventFired();
            if (options.completionTrigger) {
                yield throwIfCanceled(options);
                const waitResult = yield options.completionTrigger.wait(client);
                if (waitResult && waitResult.exceptionDetails) {
                    yield throwIfCanceled(options);
                    throw new Error(waitResult.result.value);
                }
            }
            yield throwIfCanceled(options);
            // https://chromedevtools.github.io/debugger-protocol-viewer/tot/Page/#method-printToPDF
            const base64 = yield Page.printToPDF(options.printOptions);
            yield throwIfCanceled(options);
            return new CreateResult_1.CreateResult(base64.data);
        });
    }
}
exports.PDFGenerator = PDFGenerator;
/**
 * Generator for screenshots.
 * Code copied from https://github.com/schnerd/chrome-headless-screenshots/blob/master/index.js
 */
class ScreenshotGenerator extends Generator {
    generate(client, options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield throwIfCanceled(options);
            const { DOM, Emulation, Network, Page } = client;
            yield Page.enable();
            yield DOM.enable();
            yield Network.enable();
            yield throwIfCanceled(options);
            const deviceMetrics = Object.assign({ width: 1920, height: 1080, deviceScaleFactor: 0, mobile: false, fitWindow: false }, (options.screenshotOptions && options.screenshotOptions.deviceMetrics));
            yield Emulation.setDeviceMetricsOverride(deviceMetrics);
            yield Emulation.setVisibleSize({
                width: deviceMetrics.width,
                height: deviceMetrics.height,
            });
            yield throwIfCanceled(options);
            yield Page.navigate({ url: this.url });
            yield throwIfCanceled(options);
            yield Page.loadEventFired();
            if (options.screenshotOptions && options.screenshotOptions.fullPage) {
                const { root: { nodeId: documentNodeId } } = yield DOM.getDocument();
                const { nodeId: bodyNodeId } = yield DOM.querySelector({
                    selector: 'body',
                    nodeId: documentNodeId,
                });
                const { model } = yield DOM.getBoxModel({ nodeId: bodyNodeId });
                deviceMetrics.height = model.height;
                yield Emulation.setVisibleSize({ width: deviceMetrics.width, height: deviceMetrics.height });
                // This forceViewport call ensures that content outside the viewport is
                // rendered, otherwise it shows up as grey. Possibly a bug?
                yield Emulation.forceViewport({ x: 0, y: 0, scale: 1 });
            }
            if (options.completionTrigger) {
                yield throwIfCanceled(options);
                const waitResult = yield options.completionTrigger.wait(client);
                if (waitResult && waitResult.exceptionDetails) {
                    yield throwIfCanceled(options);
                    throw new Error(waitResult.result.value);
                }
            }
            yield throwIfCanceled(options);
            const base64 = yield Page.captureScreenshot(options.screenshotOptions && options.screenshotOptions.captureScreenShotOptions);
            yield throwIfCanceled(options);
            return new CreateResult_1.CreateResult(base64.data);
        });
    }
}
exports.ScreenshotGenerator = ScreenshotGenerator;

//# sourceMappingURL=Generators.js.map
