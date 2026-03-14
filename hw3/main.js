import { createApp} from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
const site = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "vue3-course";

const app = createApp({
  data(){
    return{
      products:[],
      productModal: null,
      delProductModal: null,
      tempProduct: this.initTempProduct(),
    }
  },
  methods:{
    checkIsLogin(){
      axios.post(`${site}/api/user/check`)
          .then(res=>{
            // console.log(res);
            
            //證實有登入, 才可顯示產品列表
            this.getProducts();
          })
          .catch(error =>{
            console.log(error);
            alert('請先登入');
            window.location.href = 'login.html';

          })
    },
    getProducts(){
      axios.get(`${site}/api/${apiPath}/admin/products`)
          .then(res=>{
            const {products} = res.data;
            this.products = products;
          })
          .catch(error=>{

          })
          
    },
    openModal(product){
      if(product.id){ // edit
        this.tempProduct = {... product};
        this.productModal.show();
      }else{  // add
        this.tempProduct = this.initTempProduct(); //每次開 modal 都先reset, 避免殘留上一次輸入的
        this.productModal.show();
      }
    },
    openDelModal(product){
      this.tempProduct = {... product};
      this.delProductModal.show();
    },
    initTempProduct(){
      return {
        title: "",
        price: 0,
        category: "",
        unit: "",
        origin_price: 0,
        description: "",
        content: "",
        isEnabled: 1
      }
    },
    save(){
      const param = {
        data: this.tempProduct
      }

      if(this.tempProduct.id){ // edit
        axios.put(`${site}/api/${apiPath}/admin/product/${this.tempProduct.id}`, param)
          .then(res=>{
            alert(res.data.message);
            this.getProducts();
            this.productModal.hide();
          })
          .catch(error=>{
            console.log(error);
            const {data} = error;
            // console.log(data.message);
            // const message = data.message.join('\n'); //join() 將每個"元素"串接一個字串
            // console.log(message);
            
          });
      }else{ //add
        axios.post(`${site}/api/${apiPath}/admin/product`, param)
          .then(res=>{
            alert(res.data.message);
            this.getProducts();
            this.productModal.hide();
          })
          .catch(error=>{
            console.log(error);
            const {data} = error;
            
          });
      }
      
    },
    deleteProduct(){
      axios.delete(`${site}/api/${apiPath}/admin/product/${this.tempProduct.id}`)
          .then(res=>{
            alert(res.data.message);
            this.getProducts();
            this.delProductModal.hide();
          })
          .catch(error=>{
            console.log(error);
            const {data} = error;
          });
    }
  },
  mounted(){
    //從cookie拿token
    const token = document.cookie.split('; ').find(row => row.startsWith('hexToken='))?.split('=')[1];

    //設定axios header, 讓這個頁面呼叫每一支api都會自動帶header
    axios.defaults.headers.common['Authorization'] = token;

    //確認是否已登入，防止直接進index.html
    this.checkIsLogin();

    //建立modal物件, 初始化modal物件
    this.productModal = new bootstrap.Modal(this.$refs.productModal);
    this.delProductModal = new bootstrap.Modal(this.$refs.delProductModal);

    //! 筆記
    // console.log(this.$refs);
    // const modal = document.getElementById("productModal");
    // console.log(modal);
    // console.log(this.$refs.productModal);
    // console.log(modal === this.$refs.productModal); // true
    
    
    
    
  }
}).mount('#app');