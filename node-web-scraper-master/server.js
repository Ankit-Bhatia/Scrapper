var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){
	// Let's scrape Anchorman 2

	url = 'http://mumbai.yellowpages.co.in/doctors?trc=12323&page=2';

	request(url, function(error, response, html){
	
		if(!error){
			var $ = cheerio.load(html);

			var title = new Array(), location = new Array(), address = new Array(), phonenumbers = new Array();
			var json = { title : [], location : [], address : [], phonenumbers: []};
			
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

			/*$('.header').filter(function(){
		        var data = $(this);
		        title = data.children().first().text();
		        release = data.children().last().children().text();

		        json.title = title;
		        json.release = release;
	        })

	        $('.star-box-giga-star').filter(function(){
	        	var data = $(this);
	        	rating = data.text();

	        	json.rating = rating;
	        })*/
					fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
        	console.log('File successfully written! - Check your project directory for the output.json file');});
		}
		else{
		console.log(error);
		}		
	})
})

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app; 	