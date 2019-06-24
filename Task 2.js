/*
Задание 2
1. Написать скрипт, который распарсит, заполнит и засабмитит форму
https://abz4.typeform.com/to/mMRFLi
    2. Для каждого шага формы, скрипт должен фиксировать скриншот и складывать
в отдельную директорию. Список шагов, которые должен выполнить скрипт,
    следующие:
a. Загрузить форму по ссылке https://abz4.typeform.com/to/mMRFLi и
    нажать “Start”
b. Заполнить форму
c. Нажать кнопку “Submit” и получить скрин итоговой страницы
*/

"use strict";

const puppeteer = require('puppeteer');
const faker = require('faker');
const fs = require('fs');
const log = require('simple-node-logger').createSimpleLogger('task2.log');

const awaitTimer = 750;
const url = 'https://abz4.typeform.com/to/mMRFLi';

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

    const browser = await puppeteer.launch(puppeteerOptions)
        .catch(function (error) {
            console.log(error);
            log.error(error);
        });

    const page = await browser.newPage();

    await page.setViewport({ width: 1024, height: 768 });

    await page.goto(url, {waitUntil: 'networkidle0'});

    await MakeScreenShot(page, './Task2Screenshots/Start.png');
    await page.keyboard.press('Enter');

    await EnterFood(page);
    await EnterLoveToRain(page);
    await EnterBirthday(page);
    await EnterEmail(page);

    await page.keyboard.press('Enter');
    await page.waitFor(awaitTimer * 2.5);

    await MakeScreenShot(page, './Task2Screenshots/Result.png');

    await browser.close();

    log.info('The script is executed with no errors')
})();

function CreateFolder() {
    let dir = './Task2Screenshots';

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    log.info('/Task2Screenshots' + ' successfully created');
}

async function MakeScreenShot(page, name) {
    await page.screenshot({path: name, fullPage: true})
        .catch(function (error) {
            console.log(error);
            log.error(e);
        }).then(() => log.info(name + ' successfully created'));
}

async function GenerateDateSrt()
{
    let date = faker.date.between('1960-01-01', '2010-12-31');
    return date.toISOString().substring(0, 10).split('-');
}

async function EnterFood(page)
{
    let food = faker.random.arrayElement(
        [
            "Meat",
            "Cake",
            "Fish",
            "Cereals",
            "Dairy products",
            "Eggs"
        ]);
    log.info("Favorite Dish is " + food);
    await page.keyboard.type(food);
    await page.screenshot({path: './Task2Screenshots/FavoriteDish.png', fullPage: false});
    await page.keyboard.press('Enter');
    await page.waitFor(awaitTimer);
}

async function EnterLoveToRain(page)
{
    let boolean = faker.random.boolean();
    log.info("Rain love? " + (boolean ? "Y" : "N"));
    if (boolean) await page.keyboard.press('Y');
    else await page.keyboard.press('N');
    await page.screenshot({path: './Task2Screenshots/LoveRain.png', fullPage: false});
    await page.keyboard.press('Enter');
    await page.waitFor(awaitTimer);
}

async function EnterBirthday(page)
{
    let arrayOfDates = await GenerateDateSrt();
    log.info("Birthday: " + arrayOfDates[1] +"/"+ arrayOfDates[2] +"/"+ arrayOfDates[0]);
    await page.keyboard.type(arrayOfDates[1]); //MM
    await page.keyboard.type(arrayOfDates[2]); //DD
    await page.keyboard.type(arrayOfDates[0]); //YYYY
    await page.screenshot({path: './Task2Screenshots/Birthday.png', fullPage: false});
    await page.keyboard.press('Enter');
    await page.waitFor(awaitTimer);
}

async function EnterEmail(page)
{
    let email = faker.internet.email();
    log.info("Email: " + email);
    await page.keyboard.type(email);
    await page.screenshot({path: './Task2Screenshots/Email.png', fullPage: true});
    await page.keyboard.press('Enter');
    await page.waitFor(awaitTimer);
}

