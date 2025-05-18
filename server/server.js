import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import path from "path";
import { JSDOM } from 'jsdom';
import connectDB from "./config/dbworker.js";
import productRouter from "./routes/productRoutes.js";
import { errorHandler, notFound } from "./middlewares/error.js";
import userRouter from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";
import morgan from "morgan";
import cors from 'cors'; 
import { tidy } from 'htmltidy2';
import pLimit from 'p-limit';
import axios from 'axios';
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
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5000', 'http://localhost:8080',
    'https://bb6f6125-db9c-4152-b500-ee566806723b.e1-us-east-azure.choreoapps.dev',
    'https://23f24711-ee18-4810-935b-61f010c33bec.e1-us-east-azure.choreoapps.dev',
    'https://5f6de4a7-67ca-41e3-8e73-63d1fd322c3e.e1-us-east-azure.choreoapps.dev',
    'https://storegoods-storenotify.netlify.app'
];

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
app.get('/gadgets360/:query', async (req, res) => {
  const results = await fetchGadgets360(req.params.query);
 

  res.json(results);
});

async function fetchGadgets360(query) {
  const starttime = Date.now();
  let text = '';
  let dom = new JSDOM(text);
  let document = dom.window.document;
  let results = [];
 await fetch(`https://gadgets360.com/search?searchtext=${query}`)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
     let fetHTML =   (async () => {
        const t = await response.text();
         let text =t
        dom = new JSDOM(text);
        document = dom.window.document;


          await Promise.all(Array.from(document.querySelectorAll('div.rvw-imgbox'))
          .map(item => extractResults(item))).then(data => { console.log(data); 
               return data;
    
              }).catch(error => {
                console.error('Fetch error:', error);
                return { error: true, error_message: error.message };
              });

          
      });
      return fetHTML();
      // fetHTML().then(data => { console.log(data); 
      //   return data;

      // });
      


  })
  .then(data => { console.log(data); 



   } )
  .catch(error => {
    console.error('Fetch error:', error);
  });
 
async function extractResults(item) {
  const title = await item.querySelector('img').title;
  const imgsrc  = await item.querySelector('img').src;
  let jsun = ''; let  prodDesc ='' , prodImg='';
  jsun  = { title , imgsrc };
  let prodDescArr =[]; let prodImgHref ='';
  let reqProduct = {}
  // read https://www.gadgets360.com/vivo-t4-5g-price-in-india-131722#pfrom=search
  try { //const contResponse = await fetch(item.querySelector('a').href);
     const url = item.querySelector('a').href
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' // Some sites block non-browser agents
        }
      });
    
      const rawHtml = await response.text();
    
      tidy(rawHtml, { doctype: 'html5', indent: true }, (err, cleanedHtml) => {
        if (err) {
          console.error('HTML Tidy Error:', err);
          return;
        }
    
        const dom = new JSDOM(cleanedHtml);
        const documentD = dom.window.document;
       // const contDocument = contDom.window.document;
          prodDesc = documentD.querySelectorAll('._pdsd'); //documentD.querySelectorAll('div._pdsd');
         if(prodDesc.length  > 0){
            // req = req[0].nextElementSibling.textContene  
               prodDesc.forEach(element => {
                  console.log('element:', element.textContent);
                  let descSplit = element.textContent.split('\n');
                  if( descSplit.length >1){
                      console.log('key :', descSplit[0]);
                      console.log('value :', descSplit[1]);
                      jsun[descSplit[0]] = descSplit[1];
                  }
                  prodDescArr.push(element.textContent.trim());   
               });
         }
         prodImg =  documentD.querySelectorAll('._pdmimg'); // .__arModalBtn ._flx
         if(prodImg !==null && prodImg !== undefined  ){
             // fetch the image url
             if(prodImg.childNodes  !== null && prodImg.childNodes !== undefined  && prodImg.childNodes.length > 0) {
               if(prodImg.childNodes [0] !==null && prodImg.childNodes[0] !== undefined  ){
                 prodImgHref = prodImg.childNodes[0];
                if(prodImgHref.src !==null && prodImgHref.src !== undefined  ){
                   console.log('image href:', prodImgHref.src);
                   jsun.image = prodImgHref.src;
                }
             }
           }
            
         }
        // request prodect with image and detais descrip attributes
        let t =jsun?.title;
        let img = jsun?.imgsrc;
        reqProduct = { t , img, prodDescArr};

        console.log('reqProduct:', reqProduct);
        // Example: Extract product title
        const title = documentD.querySelector('h1')?.textContent.trim();
        console.log('📱 Title:', title);
       // console.log(' req :',  req );
        // Example: Extract price
        const price = documentD.querySelector('.shop_now_section .price')?.textContent.trim();
        console.log('💰 Price:', price || 'Not found');
      });
    
    } catch (error) {
      console.error('❌ Fetch error:', error.message);
 }
 // const contText = await contResponse.text();
 // const contDom = new JSDOM(contText);
 

  async function fpInReq(fp) {
      const ty = fp.nextElementSibling;
      if (!ty) return;
      jsun[ty.textContent] = ty.nextElementSibling.textContent;
  }
  const limit = pLimit(10); // Set concurrency limit to 10
  const tasks =   Array.from(reqProduct).map(item => 
    limit(() => fpInReq(item))
  );
  await Promise.all(tasks);
  results.push(jsun);
  return results;
}


return results;
}

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
