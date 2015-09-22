# NodeBB Odnoklassniki SSO

NodeBB Плагин для авторизации / регистрации за счёт аккаунта интернет сервиса Одноклассники.

## Установка

    npm install nodebb-plugin-sso-ok

## Настройка

1. Получить права разработчика на <a href="http://ok.ru/devaccess">соответствующей странице</a>
2. Добавить приложение с типом external
3. Указать в списке "Redirect URI" ссылку на форум с `/auth/ok/callback`
4. Заполнить остальные поля
