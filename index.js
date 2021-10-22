/**
 * Autor Vinicius <dias.viniciuscesar@gmail.com>
 * Desde 29/09/2021
 */
const fs 		 = require('fs');
const http       = require('http');
const express    = require('express');

// inicialização
console.log("Inicializando");

var requestsCounter = 0;
var productid       = "";

const app = express();

app.disable('x-powered-by');
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');

  next();
});

app.get('/', function(req, res){
	requestsCounter++;
	
	var url1 = "http://localhost:81/produto/lento/1";
	var url2 = "http://localhost:81/produto/rapido/2";
	
	var body = "";
	body += "<style>div {padding: 10px}</style>";
	body += "<div>Para testar, chame as URLs na seguinte ordem, aguardar 1 segundo entre as chamadas ";
    body += "Abrir cada url em uma nova janela:</div>";
	body += "<div><a href='"+url1+"'>"+url1+"</a></div>";
	body += "<div><a href='"+url2+"'>"+url2+"</a></div>";
	body += "<br>";
	body += "<div>OK (#"+requestsCounter+")</div>";
	res.status(201).send(body);
});

function carregarProdutoLento(req,res,payload){
	var options = {
	  host: 'deelay.me',
	  path: '/10000/https://picsum.photos/200/300'
	};

	http.request(options, function(response){
		var str = '';

	    //another chunk of data has been received, so append it to `str`
		response.on('data', function (chunk) {
			str += chunk;
		});

		//the whole response has been received, so we just print it out here
		response.on('end', function () {
			console.log("resposta("+response.statusCode+")="+str);

			var body = "";
			body += "valor0 = "+productid+" (productid)<br>";
			body += "valor1 = "+res.productid+" (res.productid)<br>";
			body += "valor2 = "+res.locals.productid+" (res.locals.productid)<br>";
			body += "valor3 = "+payload.productid+" (payload.productid)<br>";
			body += "(#"+requestsCounter+")";
			res.status(201).send(body);
		});
	}).end();
}

function carregarProdutoRapido(req,res,payload){
	var options = {
	  host: 'deelay.me',
	  path: '/1000/https://picsum.photos/200/300'
	};
	
	http.request(options, function(response){
		var str = '';

	    //another chunk of data has been received, so append it to `str`
		response.on('data', function (chunk) {
			str += chunk;
		});

		//the whole response has been received, so we just print it out here
		response.on('end', function () {
			console.log("resposta("+response.statusCode+")="+str);

			var body = "";
			body += "valor0 = "+productid+" (productid)<br>";
			body += "valor1 = "+res.productid+" (res.productid)<br>";
			body += "valor2 = "+res.locals.productid+" (res.locals.productid)<br>";
			body += "valor3 = "+payload.productid+" (payload.productid)<br>";
			body += "(#"+requestsCounter+")";
			res.status(201).send(body);
		});
	}).end();
}

app.get('/produto/lento/:productid', function(req, res){
	requestsCounter++;
	
	var payload = {
		productid: req.params.productid
	};

	productid            = req.params.productid;
	res.productid        = req.params.productid;
	res.locals.productid = req.params.productid;

	carregarProdutoLento(req,res,payload);
});

app.get('/produto/rapido/:productid', function(req, res){
	requestsCounter++;
	
	var payload = {
		productid: req.params.productid
	};

	productid            = req.params.productid;
	res.productid        = req.params.productid;
	res.locals.productid = req.params.productid;

	carregarProdutoRapido(req,res,payload);
});

// manipulador de erros
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Serviço indisponível');
});

var httpServer = http.createServer(app);
httpServer.listen(81,function(){
	console.log(`Rodando na porta 81 (http)`);
});

console.log("Script inicializado");
