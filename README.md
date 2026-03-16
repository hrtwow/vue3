Bootstrap CSS 負責「外觀」
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6" crossorigin="anonymous">
   
Bootstrap JS 負責「互動行為」 data-bs-* 背後是 Bootstrap JS 在監聽
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/js/bootstrap.bundle.min.js"></script>
  
  
HTML 檔:
意思是這個HTML檔的JS程式碼寫在外部檔案(另一個檔案): main.js, 由於該檔案會寫到import/export語法來匯入元件, 要加上type="module"
<script type="module" src="./main.js"></script>


元件:
1\ 先建立元件 pagination.js
2\ 匯入元件, 註冊元件
3\ 在template使用


app.component('MyPagination', Pagination);
app.component(註冊名稱, 元件內容)
註冊名稱要使用 PascalCase（大駝峰），在 template 中 Vue 會自動把元件名稱轉成 kebab-case 
所以在 template 使用元件的時候才會用 <my-pagination> 而不是 <MyPagination>

