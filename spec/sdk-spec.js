var PearsonApis = require("../lib/pearson-sdk.js");
var frisby = require('../node_modules/frisby');


describe("Pearson API object", function() {
	var travel =  PearsonApis.travel("akeyhere");

	it("should throw an error if the api key is not a string", function(){
		expect( function(){ PearsonApis.travel(apikey); }).toThrow();
	});

	it("should have a base URL for the API", function(){
		expect(travel.base).toEqual("http://api.pearson.com/v2/");
	});

});

describe("The proxy object", function(){
	var proxy = PearsonApis.travel("byProxy", "https://localhost:8080");
	console.log(proxy);

	it("should have a custom url base", function(){
		expect(proxy.base).toEqual("https://localhost:8080/v2/");
	});

	// The api key is added by the ppProxy file
});

describe("The Travel API object", function() {
	var travel =  PearsonApis.travel("akeyhere");

	it("should be a travel api object", function(){
		expect(travel.api).toEqual("travel");
	});
  
	it("should take an api key in string format and append it to a query string", function(){
		expect(travel.apikey).toEqual("akeyhere");
	});
// Endpoints
	it("should have an aroundtown object available to it", function(){
		expect(travel.aroundtown).toBeDefined();
	});

	it("should have a topten object available to it", function(){
		expect(travel.topten).toBeDefined();
	});

	it("should have a categories object available to it", function(){
		expect(travel.categories).toBeDefined();
	});

	it("should have a dataset object available to it", function(){
		expect(travel.dataset).toBeDefined();
	});

	it("should have a places object available to it", function(){
		expect(travel.places).toBeDefined();
	});

	it("should have an streetsmart object available to it", function(){
		expect(travel.streetsmart).toBeDefined();
	});

	it("should take the endpoint name as a method and set the path", function(){
		expect(travel.topten.path).toEqual("topten");
		expect(travel.aroundtown.path).toEqual("around_town");
	});
	
	
});

describe("The Endpoint object", function(){
	var travel = PearsonApis.travel("JZNt3YM1veh1d6HDiCpA86vFJvuRefjw");
	var test = travel.topten;

	it("should be be created when the endpoint method is called on the PearsonApis object", function(){
		expect(test.constructor.name).toEqual("Endpoint");
	});

	it("should have a path for the endpoint", function(){
		expect(test.path).toEqual("topten");
	});

	it("should contain a pearson object", function(){
		expect(test.pearson).toBeDefined();
	});

});

describe("The expandUrl function", function() {
	var travel = PearsonApis.travel("JZNt3YM1veh1d6HDiCpA86vFJvuRefjw");
	var test = travel.topten;

	  
  	it("should remove whitespace from the url", function(){
  		expect(test.expandUrl("stuff")).not.toContain(' ');
  	});

  	it("should add a base url to the provided input", function(){
  		expect(test.expandUrl("stuff")).toContain("http:");
  	});

  });

describe("Searching within specific datasets using the setDsets function", function(){
	var travel = PearsonApis.travel("JZNt3YM1veh1d6HDiCpA86vFJvuRefjw");
	var test = travel.topten;

	it("should take either a string of sets, comma separated", function(){
		var sets1 = test.setDatasets("one, two, three");
		expect(sets1.pearson.dsets).toEqual("one,two,three");
	});

	it("or a collection of strings comma separated", function(){
		var sets2 = test.setDatasets("one", "two", "three");
		expect(sets2.pearson.dsets).toEqual("one,two,three");
	});

});



// Test Generic Search

	var travel = PearsonApis.travel("JZNt3YM1veh1d6HDiCpA86vFJvuRefjw");
	var test = travel.topten;
	var URL = test.getSearchUrl();

frisby.create('GET travel results')
  .get(URL)
  .expectStatus(200)
  .expectJSONTypes({
    offset: Number,
    limit: Number,
    count: Number,
    url: String,
    results: Array
  })
  .expectJSON({
  	status: 200,
  	limit: 10, //this is the default

  })
  // 'afterJSON' automatically parses response body as JSON and passes it as an argument
  .afterJSON(function(JSON) {
    // You can use any normal jasmine-style assertions here
    expect(JSON.results[0].url).toBeDefined;
    expect(JSON.results[0].datasets).toBeDefined;
    expect(JSON.results[0].id).toBeDefined;

    // Use data from previous result in next test
    
  })
.toss();

	var travel2 = PearsonApis.travel("JZNt3YM1veh1d6HDiCpA86vFJvuRefjw");
	var test2 = travel.topten;
	var URL2 = test2.getIdUrl("4av3a5NScQdhZ1");

frisby.create('GET travel results using ID')
  .get(URL2)
  .expectStatus(200)
  .expectJSONTypes({
    url: String,
    id: String, //UID
    result: Object
  })
  .expectJSON({
  	status: 200,
  })
  .afterJSON(function(JSON) {
    expect(JSON.result.datasets).toBeDefined;    
  })
.toss();


var travel3 = PearsonApis.travel("JZNt3YM1veh1d6HDiCpA86vFJvuRefjw");
var travel4 = PearsonApis.travel("JZNt3YM1veh1d6HDiCpA86vFJvuRefjw");
var dtest = travel4.topten.setDatasets("tt_newyor");
var test3 = travel3.topten;
var srTrm = { search: "bar", offset: "5" };
var URL3= test3.getSearchUrl(srTrm)
var URL4 = dtest.getSearchUrl(srTrm);

frisby.create('GET travel results using with refinements')
  .get(URL3)
  .expectStatus(200)
  .expectJSONTypes({
    url: String,
    results: Array
  })
  .expectJSON({
  	status: 200,
  })
  .afterJSON(function(JSON) {
  	frisby.create('refine by dataset')
  	.get(URL4)
  	.expectStatus(200)
  	.expectJSONTypes({
  		url: String,
  		results: Array
  	})
  	.afterJSON(function(JSON2) {
  		  	expect(JSON.results.length).toBeGreaterThan(JSON2.results.length)

  	})
  	.toss();
  })

.toss();

// Tests for FT

describe("The FT Articles Api", function(){
	var ft = PearsonApis.ftarticles("JZNt3YM1veh1d6HDiCpA86vFJvuRefjw");
	var art = ft.articles;

	it("should have the same base url", function(){
		expect(ft.base).toEqual("http://api.pearson.com/v2/")
	});

	it("should have the Endpoint of articles available to it", function(){
		expect(ft.articles).toBeDefined();
	});

});

var ft = PearsonApis.ftarticles("JZNt3YM1veh1d6HDiCpA86vFJvuRefjw");
var art = ft.articles;
var ftsrch = { search: "mclaren" };
var ftURL = art.getSearchUrl(ftsrch);
var ftsb = PearsonApis.ftarticles();
var sbArt = ftsb.articles;
var sbURL = sbArt.getSearchUrl();

frisby.create("Get FT articles")
	.get(ftURL)
	.expectStatus(200)
	.expectJSONTypes({
		url: String
	})
	.afterJSON(function(JSON) {
		expect(JSON.results[1].article_url).toBeDefined
	})
.toss();

frisby.create("Get FT sandbox article")
	.get(sbURL)
	.expectStatus(200)
	.expectJSONTypes({
		url: String,
		results: Array
	})
	.afterJSON(function(JSON) {
		expect(JSON.results.length).toBeGreaterThan(0);
	})
.toss();

// Food and drink test
	var food = PearsonApis.foodanddrink("JZNt3YM1veh1d6HDiCpA86vFJvuRefjw");
	var recipes = food.recipes;
	var fdsrch = { search: "chicken" }
	var fdUrl = recipes.getSearchUrl(fdUrl);

describe("The Food Api", function(){

	it("should have the same base url", function(){
		expect(food.base).toEqual("http://api.pearson.com/v2/")
	});

	it("should have the Endpoint of recipes available to it", function(){
		expect(food.recipes).toBeDefined();
	});

frisby.create("Get a recipe from foodanddrink")
	.get(fdUrl)
	.expectStatus(200)
	.expectJSONTypes({
		url: String,
		results: Array
	})
	.afterJSON(function(JSON){
		expect(JSON.results.length).toBeGreaterThan(0)
	})
.toss();


});

describe("The Dictionaries Api", function(){
	var dict = PearsonApis.dictionaries("JZNt3YM1veh1d6HDiCpA86vFJvuRefjw");
	var ent = dict.entries;
	var dtUrl = ent.getSearchUrl();

	it("should have the same base url", function(){
		expect(dict.base).toEqual("http://api.pearson.com/v2/")
	});

	it("should have the Endpoint of entries available to it", function(){
		expect(dict.entries).toBeDefined();
	});

frisby.create("Get an entry from the dictionary")
	.get(dtUrl)
	.expectStatus(200)
	.expectJSONTypes({
		url: String,
		results: Array
	})
	.afterJSON(function(JSON){
		expect(JSON.results.length).toBeGreaterThan(0)
	})
.toss();

});	


