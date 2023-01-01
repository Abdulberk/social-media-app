const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const eventEmitter = require('events').EventEmitter;



const userRoutes = require('./routes/userRoutes');
const notRoutes = require('./routes/postRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const authRoute = require('./routes/authRoute');



const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))





const emitter = new eventEmitter();
emitter.setMaxListeners(0);

console.log(emitter.getMaxListeners())

dotenv.config()
const port = process.env.PORT || 3000

app.use('/', userRoutes)
app.use('/', notRoutes)
app.use('/', categoryRoutes)
app.use('/', authRoute)








mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
})
.catch((error) => {
    console.log(error)
}
)



    
