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
      delProductModal: null,
      tempProduct: this.initTempProduct(),
      isLoading: true,
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
            this.getProducts();
          })
          .catch(error =>{
            console.log(error);
            alert('請先登入');
            window.location.href = 'login.html';

          })
    },
    getProducts(page=1){
      this.isLoading = true;
      
      axios.get(`${site}/api/${apiPath}/admin/products?page=${page}`)
          .then(res=>{
            const {products, pagination} = res.data;
            this.products = products;
            this.pagination = pagination;
          })
          .catch(error=>{

          })
          .finally(()=>{
            this.isLoading = false;
          })
          
    },
    openModal(product){
      if(product.id){ // edit
        this.tempProduct = {... product};
        this.$refs.pModal.open();
      }else{  // add
        this.tempProduct = this.initTempProduct();
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
            this.$refs.pModal.close();
          })
          .catch(error=>{
            console.log(error);
            const {data} = error;
            
          });
      }else{ //add
        axios.post(`${site}/api/${apiPath}/admin/product`, param)
          .then(res=>{
            alert(res.data.message);
            this.getProducts();
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
    const token = document.cookie.split('; ').find(row => row.startsWith('hexToken='))?.split('=')[1];

    axios.defaults.headers.common['Authorization'] = token;

    this.checkIsLogin();

    this.delProductModal = new bootstrap.Modal(this.$refs.delProductModal);
  },
});
app.component('Loading', Loading);
app.component('Pagination', Pagination);
app.mount('#app');