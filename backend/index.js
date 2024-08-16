const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
 

const connectionString = "mongodb+srv://sarandatabase:saran%40143@mycluster.zm3yrdt.mongodb.net/demo?retryWrites=true&w=majority&appName=MyCluster";
const app = express();

// Enable CORS
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// Models
const Contact = require('./models/Contact.model');
// const CourseList = require('./models/CourseList.model');


// Routers

const contactRouter = require('./routes/Contact.router')

const courseDetailsRouter = require('./routes/CourseDetails.router')
const userRouter = require('./routes/User.router')
const paymentRouter = require('./routes/Payment.router')
const calenderRouter = require('./routes/Calender.router')
const testRouter = require('./routes/Test.router');
const questionRouter = require('./routes/Question.router');
const UploadDriveRouter = require('./routes/UploadToDrive.router')
const UploadVimeoRouter = require('./routes/UploadToVimeo.router')
const CompleteVideo = require('./routes/CompletedVideo.router')

// app.use(bodyParser.json)

app.use('/api/contact', contactRouter)

app.use('/api/courseDetail', courseDetailsRouter)
app.use('/api/user', userRouter)
app.use('/api/payment', paymentRouter)
app.use('/api/calender', calenderRouter)
app.use('/api/tests', testRouter);
app.use('/api/question', questionRouter);
app.use('/api/uploadtodrive', UploadDriveRouter);
app.use('/api/uploadtovimeo', UploadVimeoRouter);
app.use('/api/completevideo', CompleteVideo);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// Db connection
mongoose.connect(connectionString, {})
  .then(() => {
    app.listen(5000, () => {
      console.log("Db connected - Listening port 5000");
    });
  })
  .catch((e) => {
    console.log(e);
  });
