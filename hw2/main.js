import { createApp} from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
const baseUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "vue3-course";

createApp({
  data(){
    return{
      isLoggedIn: false, //預設沒登入
      showModal: false,
      tempProduct: {},
      errorMsg: '',
      products:[],
    }
  },
  methods:{
    checkIsLogin(){
      //手動加Authorization header
      // axios.post(`${baseUrl}/api/user/check`, null, {
      //   headers:{
      //     Authorization: token
      //   }
      // })
    
      // data null 可以省略不寫, 前提是header也沒有要寫
      axios.post(`${baseUrl}/api/user/check`)
          .then(res =>{
            this.isLoggedIn = true;
            // console.log('Has logined ^_^', res.data);
            //撈產品資料
            this.getProducts();
          })
          .catch(error =>{
            const message = '請先登入'
            this.showModal = true;
            this.errorMsg = message;
          })
    },
    login(){
      window.location.href = 'login.html';
    },
    getProducts(){
      axios.get(`${baseUrl}/api/${apiPath}/products`)
      .then(res=>{
        // console.log(res.data);
        this.products = res.data.products;
      })
    },
  },
  mounted(){
    const token = document.cookie.split('; ').find(row => row.startsWith('hexToken='))?.split('=')[1];

    // axios的全域設定： 之後所有 API request 皆自動加上 Authorization: token 這個 header
    //'Authorization' 是 header名稱 , token 是 header的值
    axios.defaults.headers.common['Authorization'] = token;
    this.checkIsLogin();
  }
}).mount('#app');