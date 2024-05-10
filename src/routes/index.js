
import {
    LogIn,
    Register,
    Home,
} from '../pages/index';


import  {LayoutHome} from "../layouts/index";

const router = [
    { path: '/', component: LogIn },
    { path: '/register', component: Register },

    { path: '/home',layout: LayoutHome ,component:Home },

];


export {router}
