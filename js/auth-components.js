var authValidationMixin = {
    data: function() {
        return {
            login: '',
            password: '',
            status: '',

            localLogin: true,
            localPassword: true
        }
    },
    computed: {
        validLoginLenght: function() {
            this.localLogin = this.login
            if (this.login.length < 6) {
                return false;
            } else {
                return true;
            }
        },
        validPasswordLength: function() {
            this.localPassword = this.password
            if (this.password.length < 6) {
                return false;
            } else {
                return true;
            }
        },
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
            <form class="horizontal-centering-container">
                <label class="default-label">Логин</label>
                <input class="input-param" type="text" v-model="login" maxlength=16/>
                <span v-show="!localLogin" class="default-warning">Логин должен быть указан</span>
                <span v-show="login && !validLoginLenght" class="default-warning">Длина логина должна быть не менее 6 символов</span>

                <label class="default-label">Пароль</label>
                <input class="input-param" type="password" v-model="password" maxlength=16/>
                <span v-show="!localPassword" class="default-warning">Пароль должен быть указан</span>
                <span v-show="password && !validPasswordLength" class="default-warning">Длина пароля должна быть не менее 6 символов</span>

                <div>
                    <button type="submit" class="submit-button" :disabled="isInProgress" v-on:click="doLogin">Авторизоваться</button>
                </div>

                <span v-show="isInProgress" class="default-hint">Подождите, запрос обрабатывается</span>
                <span v-show="status === 'Unauthorized'" class="default-warning">Пользователь с такими данными не найден</span>
                <span v-show="status === 'Unknown'" class="default-warning">Произошла неизвестная ошибка, попробуйте отправить запрос позже</span>

                <router-link class="default-link" to="/register">Создать новый аккаунт</router-link>
            </form>
            `,

        methods: {
            doLogin: function() {
                if (!this.validForm()) {
                    return
                }

                this.status = 'InProgress'
                this.$http.post(
                    'http://localhost:8080/api/login', 
                    {
                        "login": this.login,
                        "password": this.password,
                    },
                ).then(
                    (response) => {
                        this.status = ''
                        localStorage.setItem('token', response.bodyText)
                        window.location.replace("main.html")
                     },
                    (error) => {
                        if (error.status == 403) {
                            this.status = "Unauthorized";
                        } else {
                            this.status = "Unknown"
                        }
                    }
                )
            },
            validForm: function() {
                if (!this.login) {
                    this.localLogin = false;
                }
                if (!this.password) {
                    this.localPassword = false;
                }
                return this.validLoginLenght && this.validPasswordLength
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
            <form class="horizontal-centering-container">
                <label class="default-label">Логин</label>
                <input class="input-param" type="text" v-model="login" maxlength=16/>
                <span v-show="!localLogin" class="default-warning">Логин должен быть указан</span>
                <span v-show="login && !validLoginLenght" class="default-warning">Длина логина должна быть не менее 6 символов</span>

                <label class="default-label">Пароль</label>
                <input class="input-param" type="password" v-model="password" maxlength=16/>
                <span v-show="!localPassword" class="default-warning">Пароль должен быть указан</span>
                <span v-show="password && !validPasswordLength" class="default-warning">Длина пароля должна быть не менее 6 символов</span>

                <label class="default-label">Подтвердите пароль</label>
                <input class="input-param" type="password" v-model="confirmedPassword" maxlength=16/>
                <span v-show="!localConfirmedPassword" class="default-warning">Необходимо потвердить пароль</span>
                <span v-show="confirmedPassword && !passwordsMatch" class="default-warning">Пароли должны совпадать</span>

                <div>
                    <button type="submit" class="submit-button" :disabled="isInProgress" v-on:click="doRegistration">Зарегистрироваться</button>
                </div>

                <span v-show="isInProgress" class="default-hint">Подождите, запрос обрабатывается</span>
                <span v-show="status === 'LoginInUse'" class="default-warning">Введенный логин уже используется</span>
                <span v-show="status === 'Unknown'" class="default-warning">Произошла неизвестная ошибка, попробуйте отправить запрос позже</span>

                <router-link class="default-link" to="/">Войти, используя существующий аккаунт</router-link>
            </form>
            `,

        data: function() {
            return {
                confirmedPassword: '',

                localConfirmedPassword: true
            }
        },
        methods: {
            doRegistration: function() {
                if (!this.validForm()) {
                    return
                }

                this.status = 'InProgress'
                this.$http.post(
                    'http://localhost:8080/api/user', 
                    {
                        "login": this.login,
                        "password": this.password
                    },
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
            validForm: function() {
                if (!this.login) {
                    this.localLogin = false;
                }
                if (!this.password) {
                    this.localPassword = false;
                }
                if (!this.confirmedPassword) {
                    this.localConfirmedPassword = false;
                }
                return this.validLoginLenght && this.validPasswordLength && this.passwordsMatch
            }
        },
        mixins: [authValidationMixin],
        computed: {
            passwordsMatch: function() {
                this.localConfirmedPassword = this.confirmedPassword
                return this.password === this.confirmedPassword
            }
        }
    }
);