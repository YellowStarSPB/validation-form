class ValidateForm {
    constructor(formSelector = '', config) {
        //находим форму
        this.form = document.querySelector(formSelector);
        //конфиг для валидации
        this.config = config;
        //стейт ошибок
        this.errors = {};
        //собираем стейт ошибок исходя из конфига
        for (let prop in config) {
            if (!this.errors[prop]) {
                this.errors[prop] = true;
            }
        }
        //вешаем обработчик на форму
        this.form.addEventListener('input', (e) => {
            if (e.target.name in this.errors) {
                this.#validateField(e.target);
            }
        });
        this.moveCursorTelInput = false;
    }

    get getErrors() {
        return this.errors;
    }

    #validateField(input) {
        if (input.tagName === 'SELECT') {
            this.validateSelect(input);
            return;
        }
        switch (input.type) {
            case 'checkbox':
            case 'radio':
                this.validateChecked(input);
                break;
            case 'text':
            case 'textarea':
            case 'number':
                this.validateSimpleInput(input);
                break;
            case 'email':
                this.validateEmail(input);
                break;
            case 'tel':
                this.validatePhone(input);
                break;
            case 'date':
                this.validateDate(input);
                break;
            case 'password':
                this.validatePassword(input);
                break;
            default:
                break;
        }
    }
    validateDate(input) {
        const validateError = this.config[input.name]?.validateError || '';

        if (input.value) {
            this.hideError(input);
            this.errors[input.name] = false;
        } else {
            this.setError(input, validateError);
            this.errors[input.name] = true;
        }
    }
    validateSelect(input) {
        const validateError = this.config[input.name]?.validateError || '';

        if (input.selectedIndex === 0) {
            this.setError(input, validateError);
            this.errors[input.name] = true;
        } else {
            this.hideError(input);
            this.errors[input.name] = false;
        }
    }
    validateEmail(input) {
        const emptyError = this.config[input.name]?.emptyError || '';
        const validateError = this.config[input.name]?.validateError || '';
        const pattern = this.config[input.name]?.pattern || '';
        if (!input.value.trim().length) {
            this.setError(input, emptyError);
            this.errors[input.name] = true;
        } else if (pattern.test(input.value)) {
            this.hideError(input);
            this.errors[input.name] = false;
        } else {
            this.setError(input, validateError);
            this.errors[input.name] = true;
        }
    }
    validateSimpleInput(input) {
        const emptyError = this.config[input.name]?.emptyError || '';
        const pattern = this.config[input.name]?.pattern || '';
        if (pattern) {
            input.value = input.value.replace(pattern, '');
        } else {
            throw new Error('Вы забыли указать паттерн для валидации поля');
        }

        if (!input.value.trim().length) {
            this.setError(input, emptyError);
            this.errors[input.name] = true;
        } else {
            this.hideError(input);
            this.errors[input.name] = false;
        }
    }
    validatePassword(input) {
        const emptyError = this.config[input.name]?.emptyError || '';
        const validateError = this.config[input.name]?.validateError || '';
        const pattern = this.config[input.name]?.pattern || '';

        const reqValue = this.config[input.name].reqValue;
        const inputLength = input.value.trim().length;
        const parentEl = input.parentElement;

        if (pattern) {
            input.value = input.value.replace(pattern, '');
        } else {
            throw new Error(`Вы забыли указать паттерн для валидации поля ${input.name}`);
        }

        if (inputLength <= 0) {
            this.setError(input, emptyError);
            this.errors[input.name] = true;
            return;
        } else if (reqValue) {
            if (reqValue.test(input.value)) {
                parentEl.classList.remove('show-required-value');
                this.hideError(input);
                this.errors[input.name] = false;
            } else {
                parentEl.classList.add('show-required-value');
                this.setError(input, validateError);
                this.errors[input.name] = true;
            }
        } else {
            this.hideError(input);
            this.errors[input.name] = false;
        }
    }
    validateChecked(input) {
        const validateError = this.config[input.name]?.validateError || '';
        const allItems = this.form.querySelectorAll(`[name=${input.name}]`);
        let isOneChecked = false;
        //если хотя бы один инпут находится в состоянии checked, ошибки нет, поле валидно
        for (let i = 0; i < allItems.length; i++) {
            if (allItems[i].checked) {
                isOneChecked = true;
                break;
            }
        }

        //если нет инпутов в состоянии checked присваиваем ключу инпута статус ошибки
        if (!isOneChecked) {
            this.errors[input.name] = true;
            this.setError(input, validateError);
        } else {
            this.errors[input.name] = false;
            this.hideError(input);
        }
    }
    validatePhone(input) {
        const emptyError = this.config[input.name]?.emptyError || '';
        const validateError = this.config[input.name]?.validateError || '';

        //маска для инпута
        let mask = this.config[input.name]?.mask || null;

        //дефолтное значение для маски
        let startMaskValue = mask.replace(/\D/g, '');
        //чистое значение инпута(только числа)
        let clearValue = input.value.replace(/\D/g, '');

        if (startMaskValue.length >= clearValue.length) {
            clearValue = startMaskValue;
        }

        if (!startMaskValue && (clearValue[0] === '8' || clearValue[0] === '7')) {
            clearValue = clearValue.slice(1);
        } else if (clearValue[0] === '8') {
            clearValue = clearValue.replace('8', '7');
        }

        //логика передвижения курсора в инпуте
        if (!this.moveCursorTelInput) {
            input.addEventListener('mouseup', () => {
                //находим индекс скобки для перемещения
                const startChar = input.value.indexOf('(') + 1;
                if (input.selectionStart <= startMaskValue.length) {
                    input.selectionStart = input.value.length;
                } /* else if (
                    input.selectionStart >= startMaskValue.length &&
                    input.selectionStart <= startChar
                ) {
                    input.selectionStart = startChar;
                } */ 
            });
            this.moveCursorTelInput = true;
        }

        let index = 0;

        input.value = mask.replace(/./g, function (char) {
            if (/[_\d]/.test(char) && index < clearValue.length) {
                return clearValue.charAt(index++);
            } else if (index >= clearValue.length) {
                return '';
            } else {
                return char;
            }
        });

        if (mask.length !== input.value.length) {
            this.setError(input, validateError);
            this.errors[input.name] = true;
        } else if (input.value.length === 0) {
            this.setError(input, emptyError);
            this.errors[input.name] = true;
        } else {
            this.hideError(input);
            this.errors[input.name] = false;
        }
    }
    setError(input, message) {
        let parentEl = null;
        if (input.type === 'checkbox' || input.type === 'radio') {
            parentEl = this.form.querySelector(this.config[input.name].parent);
        } else {
            parentEl = input.parentElement;
        }

        if (parentEl === this.form) {
            throw new Error(`Добавьте "${input.name}" родительский элемент`);
        }

        const errorNode = parentEl.querySelector('.error-message');

        if (parentEl) {
            parentEl.classList.add('error');
            if (errorNode) {
                errorNode.textContent = message;
                return;
            }
            if (parentEl.classList.contains('error')) {
                parentEl.insertAdjacentHTML(
                    'beforeend',
                    `<span id="${input.name}" class="error-message">${message}</span>`,
                );
            }
        }
    }
    hideError(input) {
        let parentEl = null;
        if (input.type === 'checkbox' || input.type === 'radio') {
            parentEl = this.form.querySelector(this.config[input.name].parent);
        } else {
            parentEl = input.parentElement;
        }

        const errorNode = parentEl.querySelector('.error-message');

        if (errorNode) {
            parentEl.classList.remove('error');
            errorNode.parentElement.removeChild(errorNode);
        }
    }
    checkValidate() {
        this.form.classList.add('invalid');

        for (let name in this.errors) {
            if (this.errors[name] === true) {
                const element = this.form.querySelector(`[name=${name}]`);
                this.#validateField(element);
            }
        }

        const errors = this.form.querySelectorAll('.error');

        if (errors.length === 0) {
            this.form.classList.add('valid');
            this.form.classList.remove('invalid');
            return true;
        } else {
            return false;
        }
    }
}
