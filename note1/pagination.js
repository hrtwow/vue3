//1️⃣ 建立元件 pagination.js
export default {
  data(){
    return {
      pageObj: {
        total_pages: 0,
        current_page: 1,
        has_pre: false,
        has_next: false,
        category: ''
      },
    }
  },
  template:
    `<nav>
      <ul class="pagination">
        <li class="page-item">
          <button class="page-link" type="button">&laquo;</button>
        </li>
        <li class="page-item"><a class="page-link">1</a></li>
        <li class="page-item"><a class="page-link">2</a></li>
        <li class="page-item"><a class="page-link">3</a></li>
        <li class="page-item">
          <button class="page-link" type="button">&raquo;</button>
        </li>
      </ul>
    </nav>`,
  mounted(){
  }
}