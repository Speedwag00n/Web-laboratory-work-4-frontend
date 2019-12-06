var authValidationMixin = {
    computed: {
        validLoginLenght: function() {
            if (this.login.length < 6) {
                return false;
            } else {
                return true;
            }
        },
        validPasswordLength: function() {
            if (this.password.length < 6) {
                return false;
            } else {
                return true;
            }
        }
    }
}

Vue.component(
    'login-form',
    {
        template: 
            `
            <div class="horizontal-centering-container">
                <label class="default-label">Логин</label>
                <input class="input-param" type="text" v-model.lazy="login"/>
                <span v-show="login && !validLoginLenght" class="default-warning">Длина логина должна быть не менее 6 символов</span>
                <label class="default-label">Пароль</label>
                <input class="input-param" type="password" v-model.lazy="password"/>
                <span v-show="password && !validPasswordLength" class="default-warning">Длина пароля должна быть не менее 6 символов</span>
                <div>
                    <button class="submit-button">Авторизоваться</button>
                </div>
                <a class="default-link" v-on:click="onTabChange">Создать новый аккаунт</a>
            </div>
            `,

        data: function() {
            return {
                login: '',
                password: ''
            }
        },
        methods: {
            onTabChange: function() {
                this.$emit('tabchange', false);
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
            <div class="horizontal-centering-container">
                <label class="default-label">Логин</label>
                <input class="input-param" type="text" v-model.lazy="login"/>
                <span v-show="login && !validLoginLenght" class="default-warning">Длина логина должна быть не менее 6 символов</span>
                <label class="default-label">Пароль</label>
                <input class="input-param" type="password" v-model.lazy="password"/>
                <span v-show="password && !validPasswordLength" class="default-warning">Длина пароля должна быть не менее 6 символов</span>
                <label class="default-label">Подтвердите пароль</label>
                <input class="input-param" type="password" v-model.lazy="confirmedPassword"/>
                <span v-show="confirmedPassword && !passwordsMatch" class="default-warning">Пароли должны совпадать</span>
                <div>
                    <button class="submit-button">Зарегистрироваться</button>
                </div>
                <a class="default-link" v-on:click="onTabChange">Войти, используя существующий аккаунт</a>
            </div>
            `,

        data: function() {
            return {
                login: '',
                password: '',
                confirmedPassword: ''
            }
        },
        methods: {
            onTabChange: function() {
                this.$emit('tabchange', true);
            }
        },
        mixins: [authValidationMixin],
        computed: {
            passwordsMatch: function() {
                return this.password === this.confirmedPassword
            }
        }
    }
);