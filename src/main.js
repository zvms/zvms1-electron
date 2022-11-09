import Vue from 'vue'
import App from './App.vue'
import router from './utils/router.js'
import store from './utils/store.js'
import vuetify from './plugins/vuetify'
import NProgress from 'nprogress'
import './plugins/nprogress.css'

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
	NProgress.start();
	if (to.path == '/report' || to.path == '/about') next();
	else if (to.path != '/login') {
		// console.log(233);
		// console.log(to,from,next);
        // console.log(store.state.token);
		// console.log(233);
		if (store.state.token) {
			next();
		} else {
			next('login');
		}
	} else if(store.state.token){
		next('me');
		// next()
	} else {
		next();
	}
})

router.afterEach(() => {
    NProgress.done()
})


NProgress.configure({     
    easing: 'ease',
    speed: 500,  
    showSpinner: false,    
    trickleSpeed: 200, 
    minimum: 0.3,
	color: 'F48FB1'
})

new Vue({
	router,
	vuetify,
	store,
	render: h => h(App)
}).$mount('#app')
