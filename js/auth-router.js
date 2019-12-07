const routes = [
    { 
        path: '/', 
        component: 
        { 
            template: 
                `
                <div>
                    <h1>Авторизация</h1>
                    <login-form></login-form>
                </div>
                ` 
        } 
    },
    { 
        path: '/register', 
        component: 
        { 
            template: 
                `
                <div>
                    <h1>Авторизация</h1>
                    <registration-form></registration-form>
                </div>
                ` 
        } 
    }
]
  
const router = new VueRouter({
    routes: routes
})