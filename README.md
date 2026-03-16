Bootstrap CSS 負責「外觀」
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6" crossorigin="anonymous">
   
Bootstrap JS 負責「互動行為」 data-bs-* 背後是 Bootstrap JS 在監聽
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/js/bootstrap.bundle.min.js"></script>
  

意思是這個HTML檔的JS程式碼寫在外部檔案(另一個檔案): main.js, 由於該檔案會寫到import/export語法來匯入元件, 要加上type="module"
<script type="module" src="./main.js"></script>


> 元件:
1\ 先建立元件 pagination.js
2\ 匯入元件, 註冊元件
3\ 在template使用


app.component('MyPagination', Pagination);
app.component(註冊名稱, 元件內容)
註冊名稱要使用 PascalCase（大駝峰），在 template 中 Vue 會自動把元件名稱轉成 kebab-case 
所以在 template 使用元件的時候才會用 <my-pagination> 而不是 <MyPagination>


> token-based authentication:
login
↓
API 回傳 token
↓
前端存 cookie
↓
前端把 token 放進 Authorization header
↓
API 驗證 token

login.html 登入成功: 
const {token, expired} = res.data;
document.cookie = `hexToken=${token}; expires=${new Date(expired)}; path=/`

設定一個cookie名稱:hexToken, cookie值是token, cookie過期日期是expired (把 timestamp 轉成日期)
path=/ : 同個網站(domain)的所有路徑都能讀取這個cookie值, 關閉網站再回來也還在(如果沒過期)

index.html 進入網站:
const token = document.cookie.split('; ').find(row => row.startsWith('hexToken='))?.split('=')[1];
axios.defaults.headers.common['Authorization'] = token;

從 cookie 裡取出 hexToken 的 value => 也就是 token
設定 Axios 的「預設 HTTP Header」, 讓之後在"同一個頁面"所有 API request 皆自動帶上 Authorization header
因為之後的API都需要登入驗證才可以呼叫使用
'Authorization' 是 header名稱 , token 是 Authorization header 的值

JavaScript 記憶體設定只存在當前頁面
如果 axios.defaults.headers.common['Authorization'] = token 寫在 login.html
這個設定其實只是存在於 login.html 的 JavaScript runtime memory

window.location.href = 'index.html' 
瀏覽器會：
1. unload login.html 
2. 清掉 JS runtime 記憶體
3. 載入 index.html
4. 重新建立 JS runtime 記憶體

所以 login.html 的 JS 全部消失，包含
axios.defaults
變數
function
Vue instance


Axios header 不會保留自動帶過去 index.html
=> 新的頁面 = 新的 JS runtime
