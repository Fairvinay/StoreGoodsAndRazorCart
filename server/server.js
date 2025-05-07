import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import path from "path";
import connectDB from "./config/db.js";
import productRouter from "./routes/productRoutes.js";
import { errorHandler, notFound } from "./middlewares/error.js";
import userRouter from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";
import morgan from "morgan";
import cors from 'cors'; 

const app = express();
dotenv.config();

const originsWhitelist = ['https://localhost:4200','https://localhost:8000','https://storenotify.com',"storenotiftycom.netlify.app",'https://storenotify.com/',
  'https://192.168.1.4:8000','https://192.168.1.4:8080','http://192.168.1.4:3000','http://127.0.0.1:3000','http://localhost:3000/','http://localhost:3000',
   'https://192.168.1.7','https://192.168.1.2','https://192.168.1.3','https://192.168.1.5','https://192.168.1.6',
   'https://budget-client-407513.el.r.appspot.com', 'https://glaubhanta.site','https://www.glaubhanta.site'
];
const options= {  /* : cors.CorsOptions   */
   origin:  originsWhitelist ,
  credentials:true,
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH','OPTIONS']
}



if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5000', 'http://localhost:8080'];

app.use(cors({

  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
/*
app.use( "/", (req ,  res , next )  => {
  const origin  = req.headers.origin !=undefined ? req.headers.origin :( req.headers.host !=undefined ? req.headers.host  :"") ;
   let  originHost =   origin.substring(0,origin.indexOf(":"));
   originHost = originHost ==="" ? origin : req.headers.referer?req.headers.referer:"";
   console.log("req.headers "+JSON.stringify(req.headers));
    let validReqOrigin = false;
     originsWhitelist.forEach((validHost, index) => {
         if(validHost.indexOf(originHost) > -1){
             validReqOrigin = true;
             }
        });
          console.log(validHost+ " < validhost " + "originHost "+originHost);
     if(validReqOrigin && originHost!=="") {
           res.header("Access-Control-Allow-Origin",originHost);
              console.log("CORS allowed "+originHost);
              // console.log("CORS request body "+JSON.stringify(req['body']));
      }
       else { console.log("CORS not allowed "+origin);
       }
         res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
       next();
 },   cors(options));*/
app.use("/api/products", productRouter);
app.use("/api/user", userRouter);
app.use("/api/orders", orderRoutes);

app.use("/api/upload", uploadRouter);

app.get("/api/config/razorpay", (req, res) => {
  res.status(200).send(process.env.RAZORPAY_CLIENT_ID);
});

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB();
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on PORT ${PORT}`.green.bold
  )
);
