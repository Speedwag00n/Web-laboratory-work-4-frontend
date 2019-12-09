var authValidationMixin = {
    data: function() {
        return {
            login: '',
            password: '',
            status: '',

            warningLogin: '',
            warningPassword: ''
        }
    },
    methods: {
        generateLoginWarning: function() {
            if (!this.login) {
                return 'Логин должен быть указан'
            }
            if (this.login.length < 6) {
                return 'Длина логина должна быть не менее 6 символов';
            }
            return ''
        },
        generatePasswordWarning: function() {
            if (!this.password) {
                return 'Пароль должен быть указан'
            }
            if (this.password.length < 6) {
                return 'Длина пароля должна быть не менее 6 символов';
            }
            return ''
        },
        onTabChange: function(newTab) {
            this.$emit('tabchange', newTab);
        }
    },
    computed: {
        isInProgress: function() {
            return this.status === 'InProgress'
        }
    }
}

Vue.component(
    'login-form',
    {
        template: 
            `
            <div>
                <h1>Авторизация</h1>
                <form class="horizontal-centering-container">
                    <label class="default-label">Логин</label>
                    <input class="input-param" type="text" v-model="login" maxlength=16/>
                    <span v-show="warningLogin" class="default-warning">{{ warningLogin }}</span>

                    <label class="default-label">Пароль</label>
                    <input class="input-param" type="password" v-model="password" maxlength=16/>
                    <span v-show="warningPassword" class="default-warning">{{ warningPassword }}</span>

                    <div>
                        <button type="submit" class="submit-button" :disabled="isInProgress" v-on:click="doLogin">Авторизоваться</button>
                    </div>

                    <span v-show="isInProgress" class="default-hint">Подождите, запрос обрабатывается</span>
                    <span v-show="status === 'Unauthorized'" class="default-warning">Пользователь с такими данными не найден</span>
                    <span v-show="status === 'Unknown'" class="default-warning">Произошла неизвестная ошибка, попробуйте отправить запрос позже</span>

                    <a class="default-link" v-on:click="onTabChange('Registration')">Создать новый аккаунт</a>
                </form>
            </div>
            `,

        data: function() {
            return {
                warningRequest: ''
            }
        },
        methods: {
            doLogin: function(e) {
                e.preventDefault()
                this.status = ''

                if (this.validateForm()) {
                    return
                }

                this.status = 'InProgress'
                this.$http.post(
                    'http://localhost:8080/api/login', 
                    {
                        'login': this.login,
                        'password': this.password,
                    }
                ).then(
                    (response) => {
                        this.status = ''
                        localStorage.setItem('token', response.bodyText)
                        window.location.replace('main.html')
                     },
                    (error) => {
                        if (error.status == 403) {
                            this.status = 'Unauthorized';
                        } else {
                            this.status = 'Unknown'
                        }
                    }
                )
            },
            validateForm: function() {
                this.warningLogin = this.generateLoginWarning();
                this.warningPassword = this.generatePasswordWarning();
                return this.warningLogin || this.warningPassword;
            }
        },
        mixins: [authValidationMixin]
    }
);

Vue.component(
    'registration-form',
    {
        template: 
            `
            <div>
                <h1>Регистрация</h1>
                <form class="horizontal-centering-container">
                    <label class="default-label">Логин</label>
                    <input class="input-param" type="text" v-model="login" maxlength=16/>
                    <span v-show="warningLogin" class="default-warning">{{ warningLogin }}</span>

                    <label class="default-label">Пароль</label>
                    <input class="input-param" type="password" v-model="password" maxlength=16/>
                    <span v-show="warningPassword" class="default-warning">{{ warningPassword }}</span>

                    <label class="default-label">Подтвердите пароль</label>
                    <input class="input-param" type="password" v-model="confirmedPassword" maxlength=16/>
                    <span v-show="warningConfirmedPassword" class="default-warning">{{ warningConfirmedPassword }}</span>

                    <div>
                        <button type="submit" class="submit-button" :disabled="isInProgress" v-on:click="doRegistration">Зарегистрироваться</button>
                    </div>

                    <span v-show="isInProgress" class="default-hint">Подождите, запрос обрабатывается</span>
                    <span v-show="status === 'LoginInUse'" class="default-warning">Введенный логин уже используется</span>
                    <span v-show="status === 'Unknown'" class="default-warning">Произошла неизвестная ошибка, попробуйте отправить запрос позже</span>

                    <a class="default-link" v-on:click="onTabChange('Login')">Войти, используя существующий аккаунт</a>
                </form>
            </div>
            `,

        data: function() {
            return {
                confirmedPassword: '',

                warningConfirmedPassword: ''
            }
        },
        methods: {
            doRegistration: function(e) {
                e.preventDefault()
                this.status = ''

                if (this.validateForm()) {
                    return
                }

                this.status = 'InProgress'
                this.$http.post(
                    'http://localhost:8080/api/user', 
                    {
                        "login": this.login,
                        "password": this.password
                    }
                ).then(
                    (response) => {
                        this.status = ''
                        localStorage.setItem('token', response.bodyText)
                        window.location.replace("main.html")
                    },
                    (error) => {
                        if (error.status == 400) {
                            this.status = "LoginInUse";
                        } else {
                            this.status = "Unknown"
                        }
                    }
                )
            },
            validateForm: function() {
                this.warningLogin = this.generateLoginWarning();
                this.warningPassword = this.generatePasswordWarning();
                this.warningConfirmedPassword = this.generateConfirmedPassword();
                return this.warningLogin || this.warningPassword || this.warningConfirmedPassword;
            },
            generateConfirmedPassword: function() {
                if (!this.confirmedPassword) {
                    return 'Необходимо подтвердить пароль'
                }
                if (this.password !== this.confirmedPassword) {
                    return 'Пароли должны совпадать';
                }
                return ''
            }
        },
        mixins: [authValidationMixin]
    }
);