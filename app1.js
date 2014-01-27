var async = require('async'); 
var fs = require('fs'),
    request = require('request'),
    http = require("http"),
    jsdom = require("jsdom");
var xml2js = require('xml2js');
var parser = new xml2js.Parser(); 

var rss_data = 'http://webtoon.daum.net/webtoon/rss/tomorrow';
var comic_title = rss_data.split('/')[rss_data.split('/').length-1]+'.xml';
var pasing_data = [{"title":comic_title,"link": rss_data}];


var download = function(uri, filename){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    //이미지 일때 사이즈 확인용.
    //console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename));
    
  });
};


var pasing = function(){
 fs.readFile( __dirname + '/'+comic_title, function (err, data) {
  if (err) {
    throw err; 
  }
  parser.parseString(data, function(err,result){
      var data = result.rss.channel[0];
      
      for(var i=0;i<data.item.length;i++)
        {
            var temp = {"title":data.item[i].title[0], "link":data.item[i].link[0]};
             pasing_data.push(temp) ;
           // console.log(temp);
        }
    });
})};


async.series([
  function(callback) {
      
    console.log('--- async.series::ste#1 ---');
    console.log(comic_title);
    download(rss_data, comic_title);
    callback(null, 'one');
        
  },
  function(callback) {
      setTimeout(function() {
     console.log('--- async.series::ste#2 ---');
    pasing();
    callback(null, 'two');
    }, 5000);
    
  }
],
function(err, results) {
     setTimeout(function() {
          console.log('--- async.series result ---');
          //console.log(arguments);
         
        fs.writeFile("./test.json", JSON.stringify(pasing_data), function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log("The file was saved!");
                 console.log(pasing_data.length);
            }
        }); 
     },5000);
    
});


