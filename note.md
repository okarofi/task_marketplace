sequelize model:generate --name User --attributes name:string,email:string,password:string,role:string
sequelize model:generate --name Product --attributes name:string,price:integer
sequelize model:generate --name Purchase --attributes userId:integer,productId:integer


express
sequelize
pg
bcrypt
jwt


init -y
touch app.js
initiate express
coba

sequelize init
edit config
sequelize model generate
sequelize seed generate
edit sequelize associate
edit migration fk
sequelize db:migrate
sequelize db:seed:all

membuat folder middleware
- buat file authentication
- buat file authorization


service
- POST register user
- POST login user
- GET all products

- POST purchase (pembelian) | authentication
- GET all users (lihat semua user yang di database) | authentication & authorizatrion | hanya admin saja yang bisa lihat
 ------
- POST add product | hanya admin yang boleh nambah products
- GET purchase (list pembelian) | authentication