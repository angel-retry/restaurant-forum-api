# 餐廳論壇後端API
這個專案是基於MySQL資料庫、Express框架和Sequelize ORM開發的。它是一個餐廳論壇的API，可以透過查看下方的API文件來了解它的具體功能。

## Features - 產品功能
### Notion API文件
[API文件](https://www.notion.so/Restaurant-Forum-API-7f147e42d7994259a97e3d74416a9253?pvs=4)

## Installing - 專案安裝流程
1. 請git clone專案。
```
git clone https://github.com/angel-retry/restaurant-forum-api.git
```
2. git clone後，cd專案名稱，進入該專案資料夾。
```
cd restaurant-forum-api
```
3. 新增.env檔，輸入SESSION_SECRET，GOOGLE部分請在[https://console.developers.google.com](https://console.developers.google.com)建立專案並建立憑證將資訊存取以下內容，可以參閱此資料[[筆記] 如何建立Google OAuth2 用戶端 ID及使用Passport實作第三方登入驗證By Yi](https://mt5718214.medium.com/%E7%AD%86%E8%A8%98-%E5%A6%82%E4%BD%95%E5%BB%BA%E7%AB%8Bgoogle-oauth2-%E7%94%A8%E6%88%B6%E7%AB%AF-id%E5%8F%8A%E4%BD%BF%E7%94%A8passport%E5%AF%A6%E4%BD%9C%E7%AC%AC%E4%B8%89%E6%96%B9%E7%99%BB%E5%85%A5%E9%A9%97%E8%AD%89-5ec7846dc6ad)。
```
SESSION_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
```
4. 接下來安裝專案套件。
```
npm install
```
5. 修改config裡面config.json，連接自己的MySQL Workbench，並在MySQL建立名為restaurant_forum資料庫(名字可以自己定義)。
```
config/config.json
{
  "development": {
    "username": "root",
    "password": "password",
    "database": "restaurant_forum",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
....
```
6. 資料庫設定完後，請輸入以下指令，建立資料表。
```
npm run migrate
```
7.輸入以下指令，載入種子資料。
```
npm run seed
```
8. 載入種子專案完後，輸入以下指令，可啟動專案
```
npm run dev
```
9. 接下來會在terminal看到以下內容，代表伺服器建立成功。
```
[nodemon] restarting due to changes...
[nodemon] restarting due to changes...
[nodemon] starting `node app.js`
Example app listening on http://localhost:3000
```
10.建議使用postman比較好查看各個API功能。

## Development tool - 開發工具
- **[@faker-js/faker](https://www.npmjs.com/package/@faker-js/faker)** v8.4.1
- **[bcryptjs](https://www.npmjs.com/package/bcryptjs)** v2.4.3
- **[cors](https://www.npmjs.com/package/cors)** v2.8.5
- **[dotenv](https://www.npmjs.com/package/dotenv)** v16.4.5
- **[express](https://www.npmjs.com/package/express)** v4.19.2
- **[express-session](https://www.npmjs.com/package/express-session)** v1.18.0
- **[imgur](https://www.npmjs.com/package/imgur)** v2.4.2
- **[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)** v9.0.2
- **[multer](https://www.npmjs.com/package/multer)** v1.4.5-lts.1
- **[mysql2](https://www.npmjs.com/package/mysql2)** v3.2.0
- **[passport](https://www.npmjs.com/package/passport)** v0.7.0
- **[passport-google-oauth2](https://www.npmjs.com/package/passport-google-oauth2)** v0.2.0
- **[passport-jwt](https://www.npmjs.com/package/passport-jwt)** v4.0.1
- **[passport-local](https://www.npmjs.com/package/passport-local)** v1.0.0
- **[sequelize](https://www.npmjs.com/package/sequelize)** v6.30.0
- **[sequelize-cli](https://www.npmjs.com/package/sequelize-cli)** v6.6.0
- **[tslib](https://www.npmjs.com/package/tslib)** v2.6.3
