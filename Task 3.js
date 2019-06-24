/*
Задание 3
3. Написать скрипт, который решит капчу
https://www.google.com/recaptcha/api2/demo
*/

"use strict";

const puppeteer = require('puppeteer');
const log = require('simple-node-logger').createSimpleLogger('task1.log');

const url = 'https://www.google.com/recaptcha/api2/demo';

const puppeteerOptions = {
    headless:false,
    slowMo:10,
    defaultViewport: null
};

(async function main() {

    try {
        CreateFolder();
    }
    catch (e) {
        console.log(e);
        log.error(e);
        throw e;
    }
    const browser = await puppeteer.launch(puppeteerOptions).catch(function (error) {
        console.log(error);
        log.error(e);
    });

    const page = await browser.newPage();

    await page.setViewport({ width: 1024, height: 768 });

    await page.goto(url, {waitUntil: 'networkidle0'});

    await MakeScreenShot(page, './Task1Screenshots/Start.png');

    const requestId = await initiateCaptchaRequest(apiKey);

    const response = await pollForRequestResults(apiKey, requestId);

    await page.evaluate(`document.getElementById("g-recaptcha-response").innerHTML="${response}";`);

})();

function CreateFolder() {
    let dir = './Task3Screenshots';

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    log.info('/Task3Screenshots' + ' successfully created');
}

async function MakeScreenShot(page, name) {
    await page.screenshot({path: name, fullPage: true})
        .catch(function (error) {
            console.log(error);
            log.error(e);
        }).then(() => log.info(name + ' successfully created'));
}

async function initiateCaptchaRequest(apiKey) {
    const formData = {
        method: 'userrecaptcha',
        googlekey: siteDetails.sitekey,
        key: apiKey,
        pageurl: siteDetails.pageurl,
        json: 1
    };
    const response = await request.post('http://2captcha.com/in.php', {form: formData});
    return JSON.parse(response).request;
}

async function pollForRequestResults(key, id, retries = 30, interval = 1500, delay = 15000) {
    await timeout(delay);
    return poll({
        taskFn: requestCaptchaResults(key, id),
        interval,
        retries
    });
}

function requestCaptchaResults(apiKey, requestId) {
    const url = `http://2captcha.com/res.php?key=${apiKey}&action=get&id=${requestId}&json=1`;
    return async function() {
        return new Promise(async function(resolve, reject){
            const rawResponse = await request.get(url);
            const resp = JSON.parse(rawResponse);
            if (resp.status === 0) return reject(resp.request);
            resolve(resp.request);
        });
    }
}