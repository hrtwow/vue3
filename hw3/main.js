import Pagination from './pagination.js';
import ProductModal from './productModal.js';
const site = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "vue3-course";
const Loading = VueLoading.Component;

const {createApp} = Vue;
const app = createApp({
  components:{
    ProductModal,
  },
  data(){
    return{
      products:[],
      // productModal: null,
      delProductModal: null,
      tempProduct: this.initTempProduct(),
      isLoading: true, //一進來就先全部遮住
      pagination: {
        total_pages: 1,
        current_page: 1,
        has_pre: false,
        has_next: false,
        category: "",
      },
    }
  },
  methods:{
    checkIsLogin(){
      axios.post(`${site}/api/user/check`)
          .then(res=>{
            //證實有登入, 才可顯示產品列表
            this.getProducts();
          })
          .catch(error =>{
            console.log(error);
            alert('請先登入');
            window.location.href = 'login.html';

          })
    },
    getProducts(page=1){ //參數預設值
      this.isLoading = true; //換頁直接呼叫getProducts也要loading
      
      axios.get(`${site}/api/${apiPath}/admin/products?page=${page}`)
          .then(res=>{
            const {products, pagination} = res.data;
            this.products = products;
            this.pagination = pagination;
          })
          .catch(error=>{

          })
          .finally(()=>{
            this.isLoading = false; //撈完資料才移除loading
          })
          
    },
    openModal(product){
      if(product.id){ // edit
        this.tempProduct = {... product};
        // this.productModal.show();
        this.$refs.pModal.open();
        // this.$refs.pModal 拿到子元件物件 productModal.js instance => 也就是整個 export default {...}
        // 然後呼叫instance's function
      }else{  // add
        this.tempProduct = this.initTempProduct(); //每次開 modal 都先reset, 避免殘留上一次輸入的
        // this.productModal.show();
        this.$refs.pModal.open();
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
    save(product){
      const param = {
        data: product
      }

      if(this.tempProduct.id){ // edit
        axios.put(`${site}/api/${apiPath}/admin/product/${this.tempProduct.id}`, param)
          .then(res=>{
            alert(res.data.message);
            this.getProducts();
            // this.productModal.hide();
            this.$refs.pModal.close();
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
            // this.productModal.hide();
            this.$refs.pModal.close();
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
    },
    changePage(page){
      this.getProducts(page)
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
    // this.productModal = new bootstrap.Modal(this.$refs.productModal);
    this.delProductModal = new bootstrap.Modal(this.$refs.delProductModal);

    //!ProductModal 被拆成 component, this.$refs.productModal 拿到的不是 DOM element，而是 Vue component instance
    //! new bootstrap.Modal => 要寫在子元件
    //! 筆記
    // console.log(this.$refs);
    // const modal = document.getElementById("productModal");
    // console.log(modal);
    // console.log(this.$refs.productModal);
    // console.log(modal === this.$refs.productModal); // true
    
  },
});
app.component('Loading', Loading);
app.component('Pagination', Pagination);
app.mount('#app');