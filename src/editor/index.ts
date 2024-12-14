import {createApp} from 'vue';
import Application from './components/application.component.vue';

createApp({})
    .component('application', Application)
    .mount('#app');