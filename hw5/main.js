const { createApp } = Vue;
const site = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "vue3-course";
const Loading = VueLoading.Component;

/** modal 元件 */
const userModal = {
  props:{
    tempProduct: Object,
  },
  emits:['addToCart'],
  watch:{
    tempProduct(newVal){
      if(newVal){
        // console.log('tempProduct = ',this.tempProduct);
      }
    },
    num(newVal) {
      if (newVal < 1) this.num = 1;
    },
  },
  data() {
    return {
      modal: null,
      num: 0,          //這邊有沒有寫都沒差，因為 open() 會回到預設值1
    }
  },
  template: '#userProductModal',
  methods:{
    open(){
      this.num = 1;       //由子元件控制自己的data
      this.modal.show();
    },
    close(){
      this.modal.hide();
    },
    add(id, num){
      // console.log(id, num);
      
      this.$emit('addToCart',id, num);
    }
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal);
    // this.modal.show()
    
  }
};


const app = createApp({
  components: {
    userModal,
  },

  data() {
    return {
      products: [],
      p:{},
      isLoading: false,
      cartLoading: false,
      cart:{
        carts: [],
        final_total: 0, //折扣價 final_total 是套完優惠券的價格
        total: 0,       //總價
      },
      btnStatus:{
        addToCartLoading: '', //放該筆id
        updateQtyLoading: '', //放該筆id
      },

    }
  },
  methods: {
    getProducts(page = 1) {
      // this.isLoading = true;

      axios.get(`${site}/api/${apiPath}/products?page=${page}`)
        .then(res => {
          const { products, pagination } = res.data;
          this.products = products;
          this.pagination = pagination;
          // console.log(this.products);

        })
        .catch(error => {

        })
        .finally(() => {
          // this.isLoading = false;
        })

    },
    openModal(product){
      this.p = product;
      // console.log(this.p);
      
      this.$refs.pModal.open();
    },
    addToCart(productId, qty){ //加到購物車會呼叫API
      console.log(productId, qty);
      
      const param = {
        data:{
          product_id: productId,
          qty,
        }
      }

      //局部loading，先做避免重複呼叫API就好
      this.btnStatus.addToCartLoading = productId ; //等於該筆ID, 避免連續按加入購物車, 其實也不會怎樣..
      // this.cartLoading = true;                    //下方table要鎖住

      axios.post(`${site}/api/${apiPath}/cart`, param)
          .then(res =>{
            console.log(res);
            
            this.btnStatus.addToCartLoading = ''; //解除loading
            // this.cartLoading = false;
            this.$refs.pModal.close();

            //顯示購物車，呼叫API
            this.getCart();
          })
    },
    getCart(){
      axios.get(`${site}/api/${apiPath}/cart`)
          .then(res =>{
            this.cart = res.data.data;
            console.log(this.cart);
          })
    },
    /** 調整購物車數量 */
    changeCartQty(item){
      // console.log(item);//item.id是購物車id
      
      const param = {
        data:{
          product_id: item.product_id,
          qty: item.qty
        }
      }

      //局部loading
      this.btnStatus.updateQtyLoading = item.id ; //等於該筆購物車ID, 避免連續按上下btn
      // this.cartLoading = true;                    //下方table也要鎖住

      axios.put(`${site}/api/${apiPath}/cart/${item.id}`, param)
          .then(res =>{
            console.log(res);
            
            alert(res.data.message)
            this.btnStatus.updateQtyLoading = ''; //解除loading
            // this.cartLoading = false;
            //顯示購物車，呼叫API
            this.getCart();
          })
    },
    onQtyInput(e, item){  //其實實務上不建議使用input, 會用下拉選單, 避免檢核太難做
      let val = Number(e.target.value);
      
      // 統一處理所有情況
      if (!val || val < 1) val = 1; //空字串或0 => !val = true

      item.qty = Math.floor(val);  //正小數只取整數 e.g., 2.2 => 2
    },
    remove(id){
      const isConfirm = confirm('確定要刪除嗎？');
      // console.log(isConfirm);
      
      if (!isConfirm) return; // 使用者按取消就直接結束

      axios.delete(`${site}/api/${apiPath}/cart/${id}`)
          .then(res =>{
            console.log(res);
            
            alert(res.data.message)

            //顯示購物車，呼叫API
            this.getCart();
          })
    },
    removeAll(){
      const isConfirm = confirm('確定要全部刪除嗎？');
      // console.log(isConfirm);
      
      if (!isConfirm) return; // 使用者按取消就直接結束

      axios.delete(`${site}/api/${apiPath}/carts`)
          .then(res =>{
            console.log(res);
            
            alert(res.data.message)

            //顯示購物車，呼叫API
            this.getCart();
          })
    }
  },
  mounted() {
    // console.log('aaa');
    // this.pModal = new bootstrap.Modal(this.$refs.userProductModal);
    // console.log(this.pModal);

    //取產品列表
    this.getProducts();

    //取購物車列表
    this.getCart();
  }
});
app.component('Loading', Loading);
app.mount('#app');



// 通常數量重置為 1應該寫在 子元件 modal 裡，而不是父元件。原因很簡單：
// 數量是 modal 的內部狀態，input 綁定的變數應該在 modal 裡管理（例如 qty）。
// 父元件只負責傳產品物件給子元件 (tempProduct)，不應該知道 modal 內部 input 的數值。
// 每次 modal 打開，都由子元件 open() 方法重置 qty，就能保證不殘留上一次輸入。