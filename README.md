# ABZ
NodeJS task for Abz.agency

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
<Сделано, тестировал только с mail.ru почтой>

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
<Сделано>

Задание 3
Написать скрипт, который решит капчу
https://www.google.com/recaptcha/api2/demo (например, с использованием
Google speech to text технологии https://cloud.google.com/speech-to-text/)
<Только черновик - нужен платный 2Captcha API Key>
