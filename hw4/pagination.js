export default {
  template: `<nav>
              <ul class="pagination">
                <li class="page-item" :class="{disabled: !pagination.has_pre}">
                  <a class="page-link" @click="changePage(pagination.current_page -1 )">
                    <span aria-hidden="true">&laquo;</span>
                  </a>
                </li>
                <li v-for="page in pagination.total_pages" class="page-item" :class="{active: page === pagination.current_page}">
                  <a class="page-link" @click="changePage(page)">{{page}}</a>
                </li>
                <li class="page-item" :class="{disabled: !pagination.has_next}">
                  <a class="page-link" @click="changePage(pagination.current_page + 1)">
                    <span aria-hidden="true">&raquo;</span>
                  </a>
                </li>
              </ul>
            </nav>
            <!-- debug 技巧!! -->
            <!-- <pre>確認是否有收到父元件透過屬性傳過來的: {{ pagination }}</pre> -->`,
  props:{
    pagination: Object,
  },
  emits:['changePage',],
  data(){
    return{
    }
  },
  methods:{
    changePage(page){
      if(page === this.pagination.current_page) return;

      this.$emit('changePage', page);
    }
  },
  mounted(){
  }
}