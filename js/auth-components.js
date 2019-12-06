Vue.component(
    'login-form',
    {
        template: 
            `
            <div class="horizontal-centering-container">
                <label class="default-label">Логин</label>
                <input class="input-param" type="text" v-model="login"/>
                <label class="default-label">Пароль</label>
                <input class="input-param" type="password" v-model="password"/>
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
        }
    }
);

Vue.component(
    'registration-form',
    {
        template: 
            `
            <div class="horizontal-centering-container">
                <label class="default-label">Логин</label>
                <input class="input-param" type="text" v-model="login"/>
                <label class="default-label">Пароль</label>
                <input class="input-param" type="password" v-model="password"/>
                <label class="default-label">Подтвердите пароль</label>
                <input class="input-param" type="password" v-model="confirmedPassword"/>
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
        }
    }
);