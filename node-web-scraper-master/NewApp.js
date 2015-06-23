var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var jquery = require('jquery');
var app     = express();
var partUrl = "";
var i = 1;
var pageCount = 0 ;


app.get('/scrape', function(req, res){
	// Let's scrape Anchorman 2

	url = CreateUrl("1","delhi","restaurants");

	request(url, function(error, response, html){
	
		if(!error){
			var $ = cheerio.load(html);
			if(partUrl == "")
			{
				partUrl = $('.pagination li.active a').attr("href").split("?")[1]
				partUrl = '?'+partUrl + '&page=';
			}
			pageCount = $('.pagination li').last().find('a').html();
			pageCount = parseInt(pageCount.split(" ")[1]);
			//console.log(pageCount + "testing" + url + partUrl);
			if(pageCount >1 && partUrl != "")
			{
				url = url + partUrl;
				for(i = 1; i<= pageCount;i++)
				{
				GetData(url+i,i);
				}
			}
		}
		else{
			console.log(error);
		}		
	})
})


//Function for retrieving data from the Url
function GetData(url,pageNo)
{
	
// For now this method is customized for yellow pages only 
	
	request(url, function(error, response, html){
	
		if(!error){
			var $ = cheerio.load(html);
			console.log(url,pageNo);
			var title = new Array(), location = new Array(), address = new Array(), phonenumbers = new Array();
			var json = { title : [], location : [], address : [], phonenumbers: []};


			// DOM manipulation for yellow-pages
			if($ != null || $ != "")
			{		
				$('.MT_20').each(function(){
					var data = $(this);
					title.push(data.find('.listingName').html().trim());    
					location.push(data.find('.listingName').siblings('span').html().trim());
					phonenumbers.push(data.find('.phoneDetails').html().trim());
					address.push(data.find('.location').html().trim());
					json.title = title;
					json.location = location;
					json.address = address;
					json.phonenumbers = phonenumbers;
				})
				
				/*
				if(partUrl == "")
				{
				partUrl = $('.pagination li.active a').attr("href").split("?")[1]
				partUrl = '?'+partUrl + '&page=';
				}
				//Get the total page count and regulate the process of retrieving the data
				var pageCount = $('.pagination li').last().find('a').html();
				pageCount = parseInt(pageCount.split(" ")[1]);
				console.log(pageCount + "testing" + url + partUrl);
				if(pageCount >1 && partUrl != "")
				{
					url = url + partUrl;
					for(i =2; i<= pageCount;i++)
					{
					
						//fs.writeFile('output' + i+'.json', JSON.stringify(json, null, 4), function(err){
						
						console.log('output' + i+'.json' + partUrl+ 'url Info'+ url+i);
						//});
						//GetData(url+i);
					}
				}*/
				
				//Writing the JSON to a file , we can change this and add the data to Mongo DB
				fs.writeFile('output'+ pageNo + '.json', JSON.stringify(json, null, 4), function(err){
				console.log('File successfully written! - Check your project directory for the output.json file');});
		}
		}
		else{
		console.log(error);
		}		
       // res.send(json.title);
	})
}

//Function to create Url to retrieve the data
function CreateUrl(requester,city,type)
{
	var url = "";
	if(requester == 1)
	{url = 'http://'+city+'.yellowpages.co.in/'+type;}
	else if(requester == 2)
	{}
	return url;
}

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app; 