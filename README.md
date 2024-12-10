# this is a api for db_teb. db_teb is a shop for diabetes.


# postman curl 

## baseurl = http://localhost:5000/ 

### Vendor Route
GET : vendor/all \
POST : vendor/create => fields: { website, name } \
POST : vendor/update/:vId  => fields: { website, name } \
DELETE : vendor/delete/:vId \

### Category Route
GET : category/all \
POST : category/create  => fields: { catName } \
POST : category/update/:catId  => fields: { catName } \
DELETE : category/delete/:catId \

### Product Route
GET : product/all \
GET : product//:productId \
POST : product/create  => fields: { name, description, price, productUrl, categories, vendor } \
POST : product/update/:productId  => fields: 
                                    { name, description, price, productUrl, categories, vendor } \
DELETE : product/delete/:productId \

### Exercise Route
GET : exercise/all \
POST : exercise/create  => fields: { name, duration, intensity:  enum: ['آسان', 'متوسط', 'دشوار'] } \
POST : exercise/update/:excId  => fields: 
                            { name, duration, intensity:  enum: ['آسان', 'متوسط', 'دشوار']} \
DELETE : exercise/delete/:excId \

### Diet Route
GET : diet/all \
POST : diet/create  => fields: { title, breakfast, lunch, dinner, snacks(optional) } \
POST : diet/update/:dietId  => fields: { title, breakfast, lunch, dinner, snacks(optional) } \
DELETE : diet/delete/:dietId \

### Auth Route
SignUp => POST: auth/signup { email, password, role = 'user or admin' } \
SignIn => POST: auth/signin { email, password } \