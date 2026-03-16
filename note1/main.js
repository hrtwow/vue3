import { createApp} from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
import Pagination from './pagination.js'; //2️⃣匯入元件到主js檔


const app = createApp({

});
app.component('MyPagination', Pagination); //3️⃣註冊元件
app.mount('#app');