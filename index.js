const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require("./starter/modules/replaceTemplate");
const slugify = require("slugify");

////////////////////////////////
/////// FILES

//Blocking, Synchronous way
/* const textIn = fs.readFileSync('./starter/txt/input.txt', 'utf8');
console.log(textIn);
const textOut = `This is what we know about avocado: ${textIn}.\nCreated on ${Date.now()}`;
fs.writeFileSync('./starter/txt/output.txt', textOut);
console.log('file written!'); */

// Non-blocking, asynchronous way
/* fs.readFile('./starter/txt/start.txt', 'utf-8', (err, data1) => {
    if(err) return console.log('ai calica!');
    fs.readFile(`./starter/txt/${data1}.txt`, 'utf-8', (err, data2) => {
        console.log(data2);
        fs.readFile(`./starter/txt/append.txt`, 'utf-8', (err, data3) => {
            console.log(data3);

            fs.writeFile('./starter/txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
                console.log("Your file has been written!");
            })
        });
    });
});
console.log('Will read the file!'); */

////////////////////////////////
/////// SERVER

const tempOverview = fs.readFileSync(`${__dirname}/starter/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/starter/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/starter/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

//console.log(dataObj);
const slugs = dataObj.map(elem => slugify(elem.productName, {lower: true}));
//console.log(slugs);

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);
    //const pathName = req.url;

    //OVERVIEW PAGE
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200, {'Content-Type': 'text/html'});

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join("");

        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

        //console.log(output);

        res.end(output);
    } 
    
    //PRODUCT PAGE
    else if (pathname === '/product') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    } 
    
    //API PAGE
    else if (pathname ==='/api'){
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(tempCard);
    } 
    
    //NOT FOUND PAGE
    else {
        res.writeHead(404,{
            'Content-Type': 'text/html',
            'my-own-header': 'hello world'
        });
        res.end('<h1>Page not found!</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
});