export class ProductValidator {
    constructor() {
        this.validator = {
            types: {},
            //сообщения об ошибках
            messages: [],
            // параметры проверки
            config: {},
            validate: function checkData(data) {
                var i,
                    msg,
                    type,
                    checker,
                    resultOk;
                // удалить все сообщения
                this.messages = [];

                for (i in data) {
                    if (data.hasOwnProperty(i)) {
                        type = this.config[i];
                        for (let j = 0; j < type.length; j++) {
                            checker = this.types[type[j]];

                            if (!type[j]) {
                                continue; // проверка не требуется
                            }

                            if (!checker) {
                                throw {
                                    name: 'ValidationError',
                                    message: 'No handler to validate type ' + type
                                };
                            }
                            resultOk = checker.validate(data[i]);
                            if (!resultOk) {
                                msg = '*' + i + '*' + checker.instructions;
                                this.messages.push(msg);
                            }
                        }
                    }
                }
                return this.hasErrors();
            },
            hasErrors: function hasErrors() {
                return this.messages.length !== 0;
            }

        };
        this.validator.types.isNonEmpty = {
            validate: function isEpty(value) {
                return value !== '';
            },
            instructions: 'the value cannot be empty'
        };
        this.validator.types.isNonSpace = {
            validate: function isSpace(value) {
                return !/^\s+$/.test(value);
            },
            instructions: 'the value cannot be only space'
        };
        this.validator.types.maxLength = {
            validate: function maxLength(value) {
                return !(value.length > 15);
            },
            instructions: 'The max length of 15 characters'
        };
        this.validator.types.isEmailType = {
            validate: function isEmail(value) {
                return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/).test(value);
            },
            instructions: 'enter text email format'
        };
        this.validator.types.isNum = {
            validate: function isNum(value) {
                return !/[^0-9]/g.test(value);
            },
            instructions: 'the value can be only num'
        };


    }

}