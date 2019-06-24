/*
Задание 1
1. Написать скрипт, который заполнит форму и выполнит регистрацию на сайте
https://www.tmforum.org/user-registration/
2. После каждого успешного шага, скрипт должен фиксировать скриншот и
складывать в отдельную директорию. Список шагов, которые должен
выполнить скрипт, следующие:
a. Загрузить форму по ссылке https://www.tmforum.org/user-registration/
b. Заполнить форму используя faker (сервис на ваш выбор)
c. Отправить заполненную форму
d. Получить по IMAP ссылку для подтверждения аккаунта
e. Перейти по ссылке из письма и подтвердить аккаунт
3. Также использовать логирование, чтобы можно было просмотреть пошаговую
работу скрипта, а также использованные данные при регистрации
4. Входные параметры для выполнения скрипта - это реальный email и пароль от
email. Определение задаваемых параметров можно реализовать удобным для
вас способом (загрузка из файла, доп параметры при запуске скрипта, env
переменные), но обязательно описать это в редми и указать, для каких
почтовых сервисов была внедрена поддержка IMAP (желательно yahoo или aol)
5. Результатом выполнения скрипта должен быть зарегистрированный и
подтвержденный аккаунт, а также json файл с данными для входа в
зарегистрированный аккаунт:
a. Email
b. Пароль
*/

"use strict";

const puppeteer = require('puppeteer');
const faker = require('faker');
const fs = require('fs');
const Imap = require('imap');
const MailParser = require("mailparser").MailParser;
const log = require('simple-node-logger').createSimpleLogger('task1.log');

let config = require('./config.json');

const awaitTimer = 750;
const url = 'https://www.tmforum.org/user-registration/';
const RegExp = /(https?:\/\/[^\s]+)/g;

const puppeteerOptions = {
    headless:false,
    slowMo:10,
    defaultViewport: null
};

let imapConfig = {
    user: config.Email,
    password: config.Password,
    host: 'imap.mail.ru',
    port: 993,
    tls: true
};

(async function main() {
    try {
        CheckConfigFile();
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
    await page.goto(url, {waitUntil: 'networkidle0'}).catch(function (error) {
        console.log(error);
        log.error(e);
    });

    await MakeScreenShot(page, './Task1Screenshots/Start.png');

    let firstName = faker.name.firstName();
    let lastName = faker.name.lastName();
    let company = firstName + ' ' + lastName;
    let password = faker.internet.password();
    let phone = faker.phone.phoneNumberFormat(2);
    let jobTitle = faker.name.jobTitle();
    let countryCode = faker.address.countryCode().toString().toLowerCase();

    log.info('faker firstName: ' + firstName);
    log.info('faker lastName: ' + lastName);
    log.info('faker company: ' + company);
    log.info('faker password: ' + password);
    log.info('faker phone: ' + phone);
    log.info('faker jobTitle: ' + jobTitle);
    log.info('faker countryCode: ' + countryCode);

    await page.type('#input_6_1', firstName);
    await page.type('#input_6_2', lastName);
    await page.type('#input_6_49', password);
    await page.type('#input_6_49_2', password);
    await page.type('#input_6_6', config.Email);
    await page.type('#input_6_7', phone);
    await page.type('#input_6_11', jobTitle);
    await page.select('#input_6_23', countryCode);
    await page.click('#choice_6_51_1');

    await MakeScreenShot(page, './Task1Screenshots/FullyFilled.png');

    await page.click('#gform_next_button_6_55');

    await page.waitFor(awaitTimer * 2);

    await MakeScreenShot(page, './Task1Screenshots/Next1Click.png');

    await page.type('#input_6_56', company);
    await page.click('#gform_next_button_6_31');
    await page.waitFor(awaitTimer * 2);

    await MakeScreenShot(page, './Task1Screenshots/Next2Click.png');

    await page.click('#gform_submit_button_6');
    await page.waitFor(awaitTimer * 2);

    await MakeScreenShot(page, './Task1Screenshots/Result.png');

    await browser.close();

    let imap = new Imap(imapConfig);
    imap.once("ready", execute);
    imap.once("error", function(err) {
        log.error("Connection error: " + err);
    });

    imap.connect();

    function processMessage(msg, seqno) {
        //console.log("Processing msg #" + seqno);
        //console.log(msg);

        let parser = new MailParser();
        parser.on("headers", function(headers) {
            //console.log("Header: " + JSON.stringify(headers));
        });

        parser.on('data', mail_object => {

            let matches =  mail_object.html.match(RegExp);

            matches.forEach(async function (element) {
                if(element.includes("FINISH"))
                {
                    let urlFromMail = element.substring(0, element.indexOf('"'));
                    log.info("Registration URL: " + urlFromMail);

                    const browser = await puppeteer.launch(puppeteerOptions).catch(function (error) {
                        log.error(error);
                    });
                    let page = await browser.newPage();
                    await page.goto(urlFromMail, {waitUntil: 'networkidle0'}).catch(function (error) {
                        log.error(error);
                    });
                    await MakeScreenShot(page, './Task1Screenshots/Final.png');
                    //await browser.close();
                }
            });

        });

        msg.on("body", function(stream) {
            stream.on("data", function(chunk) {
                parser.write(chunk.toString("utf8"));
            });
        });
        msg.once("end", function() {
            //console.log("Finished msg #" + seqno);
            parser.end();
        });
    }

    function execute() {
        imap.openBox("INBOX", false, function(err, mailBox) {
            if (err) {
                log.error(err);
                return;
            }
            imap.search(["UNSEEN"], function(err, results) {
                if(!results || !results.length){
                    log.info("No unread emails");
                    imap.end();
                    return;
                }
                /* mark as seen
                imap.setFlags(results, ['\\Seen'], function(err) {
                    if (!err) {
                        console.log("marked as read");
                    } else {
                        console.log(JSON.stringify(err, null, 2));
                    }
                });*/

                let f = imap.fetch(results, { bodies: "" });
                f.on("message", processMessage);
                f.once("error", function(err) {
                    return Promise.reject(err);
                });
                f.once("end", function() {
                    //console.log("Done fetching all unseen messages.");
                    imap.end();
                });
            });
        });
    }

    SaveDataToJson();

    log.info('The script is executed with no errors');
})();

function CheckConfigFile() {
    if (config.Email === "") throw new Error("Email doesn't set!");
    else log.info("config.Email: " + config.Email);

    if (config.Password === "") throw new Error("Password to email doesn't set!");
    else
        log.info("config.Password: " + config.Password);
}

function CreateFolder() {
    let dir = './Task1Screenshots';

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    log.info('/Task1Screenshots' + ' successfully created');
}

async function MakeScreenShot(page, name) {
    await page.screenshot({path: name, fullPage: true})
        .catch(function (error) {
            console.log(error);
            log.error(e);
        }).then(() => log.info(name + ' successfully created'));
}

function SaveDataToJson() {
    let obj = {
        Email: config.Email,
        password
    };
    fs.writeFileSync('./registrationData.json', JSON.stringify(obj, null, 2), 'utf-8');
    log.info('registrationData.json' + ' successfully created');
}