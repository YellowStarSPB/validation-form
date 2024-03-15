# Валидация формы заточенная под русский регион

Скрипт валидации формы с гибкой настройкой каждого инпута

## Содержание

-   [Использование](#Использование)
-   [Методы и переменные](#Методы-и-переменные)
-   [Начало работы](#Начало-работы)
-   [Config](#Config)
-   [Классы](#Классы)

## Использование

Для использования нужно скачать ZIP и поместить файл к себе в проект, подключив его к проекту

## Начало работы

После того, как вы подключили файл создайте экземпляр класса **ValidateForm**

Класс принимает 2 параметра:

1. Селектор формы - ('.class') | ('#id')
2. [Config](#Config) с настройками полей

**Пример**

```sh
const myForm = new ValidateForm('.my-form', config)
```

### Методы и переменные

```javascript
myForm.checkValidate();
```

основной метод, для проверки валидации формы
возвращает **true** или **false** в зависимости от валидности формы

```javascript
const errors = myForm.getErrors;
```

get-ер, возвращающий объект со всеми полями и статусами ошибок

**true** - ошибка валидации

**false** - поле валидно, ошибок нет

Остальные методы так же доступны, интуитивно понятно за что они отвечают:)

### Использование для пошаговых форм
Так же валидацию можно использовать для пошаговых форм.
Для этого создайте экземпляр класса **ValidateForm** для каждого шага

**Пример**

```HTML
<form class="my-form">
    <div class="firstStep">
        <input type="text" />
    </div>

    <div class="secondStep">
        <input type="text" />
    </div>

    <div class="thirdStep">
        <input type="text" />
    </div>
</form>
```

```javascript
const firstStep = new ValidateForm('.firstStep', configFirst);
const secondStep = new ValidateForm('.secondStep', configSecond);
const thirdStep = new ValidateForm('.thirdStep', configThird);
```


## Config

Config - является объектом, где ключ - это имя input-а, значение - объект настроек данного input-а

**Пример**

```javascript
const config = {
    name: {
        pattern: /[<>!@#$%^&*()_]/g,
        emptyError: 'Поле не может быть пустым',
        validateError: 'Введите корректные данные',
    },
};
```

Каждое поле input конфигурируется отдельно.
Примеры для каждого поля [ниже](#Примеры-настроек-каждого-input-a)

## Примеры настроек каждого input-a

В config вы пробрасываете объект, с настройками для каждого input-a отдельно, где ключ - это атрибут **"name"**

#### ВАЖНО

1. Указывайте **type** валидный к этому input, то есть, **если input используется для номера телефона**, укажите **type="tel"**, если для **email - type="email"**

```html
<input name="phone" type="tel" placeholder="phone" />
```

2. input должен быть обернут в родительский элемент, div, label и т.д (исключением являются radio для них достаточно указать одного родителя)

```html
<label>
    <input name="phone" type="tel" placeholder="phone" />
</label>
```

```html
<div class="test-radio">
    <p>Возраст</p>
    <label>
        18
        <input name="age" type="radio" />
    </label>
    <label>
        20
        <input name="age" type="radio" />
    </label>
    <label>
        30
        <input name="age" type="radio" />
    </label>
</div>
```

##### Пример настройки простых input-ов ('text', 'textarea', 'number')

-   userName - атрибут **"name"**;
-   pattern - символы будут удаляться, исходя из паттерна, который вы укажите в этом параметре;
-   emptyError - сообщение об ошибке, так как паттерн удаляет не нужные символы, нам не нужна ошибка валидации

```javascript
const config = {
    userName: {
        pattern: /[<>!@#$%^&*()_]/g,
        emptyError: 'Поле не может быть пустым',
    },
};
```

##### Пример настройки input **type="tel"**

-   phone - атрибут **"name"**;
-   mask - маска для номера телефона может быть разной, например `(___) ___-__-__`;
-   emptyError и validateError - сообщения об ошибках

```javascript
const config = {
    phone: {
        mask: '+7 (___) ___-__-__',
        emptyError: 'Поле не может быть пустым',
        validateError: 'Введите корректные данные',
    },
};
```

##### Пример настройки input **type="email"**

-   email - атрибут **"name"**;
-   pattern - патерн, по которому будет проверяться валидность введнных в поле символов;
-   emptyError и validateError - сообщения об ошибках

```javascript
const config = {
    email: {
        pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]{2,6}$/,
        emptyError: 'Поле не может быть пустым',
        validateError: 'Введите корректные данные',
    },
};
```

##### Пример настройки input **type="checkbox" | type="radio"**

-   age - атрибут **"name"**;
-   validateError - сообщение об ошибке, так как проверка на статус checked, проверка пустоты не нужна
-   parent - главный родитель, для всех **"checkbox" | "radio"**

```javascript
const config = {
    age: {
        validateError: 'Нужно что-то выбрать',
        parent: '.test-radio',
    },
};
```
```html
<div class="test-radio">
    <p>Возраст</p>
    <label>
        18
        <input name="age" type="radio" />
    </label>
    <label>
        20
        <input name="age" type="radio" />
    </label>
    <label>
        30
        <input name="age" type="radio" />
    </label>
</div>
```

##### Пример настройки input **type="password"**

-   password_req - атрибут **"name"**;
-   pattern - укажите те символы, которые не нужны, они будут нативно удалятся из input.value
-   reqValue - символы, которые обязательно должны быть в поле
-   validateError, emptyError - сообщения об ошибках

```javascript
const config = {
    password_req: {
        pattern: /[\!\?\.\,\;\:\"\'\`\~\|\/\/\{\}\^\*\_\=\+\-\)\[\](<>]/g,
        reqValue: /[@#$%&][A-Z]/,
        emptyError: 'Поле не может быть пустым',
        validateError: 'Введите корректные данные',
    },
};
```

##### Пример настройки input **type="date" || select**

-   my-select, date - атрибут **"name"**;
-   validateError - сообщение об ошибке

```javascript
const config = {
    "my-select": {
        validateError: 'Нужно что-то выбрать',
    },
    date: {
        validateError: 'Нужно что-то выбрать',
    },
};
```

**ВАЖНО**

Для select нужна зашлушка в видел дэфолтного значения, так как проверка идет по индексу.
```html
<label>
    <select name="my-select">
        <option value="" selected disabled hidden></option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
    </select>
</label>
```

## Классы
1. **"error"** - класс ошибки вешается на родительский элемент для удобной стилизации.
2. **"invalid"** - вешается на форму, если есть хотя бы один инпут с ошибкой
3. **"valid"** - вешается на форму, если все поля, указанные в конфиге прошли валидацию
4. **"show-required-value"** - специальный класс для инпута пароля, используется для логкии подсказки
5. **"error-message"** - класс тега ошибки, тег встраивается в конец родительского элемента
