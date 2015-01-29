var util = require('util'),
	AbstractChannelHandler = require('./abstract-channel-handler'),
	logger = require('./util/logger'), 
	HttpCodeError = require('./util/http-code-error'), 
	ContentFeedback = require('./content-feedback'),
	async = require("async");

/**
 * Constructor for concrete channel handlers.
 * @constructor
 */
function MyChannelHandler() {

	// Authenticate via OAuth
	var tumblr = require('tumblr.js');
	client = tumblr.createClient({
	  consumer_key: 'L7VT9FEtsQuQVPQVN32O79kd8gjJwmOu6Uh8zAxnMC64ZwyfWF',
	  consumer_secret: '4BCnSHCOpIqmBijiYSr163S8YC6OMSEFvczznWcXN3CmYR7SlU',
	  token: 'jqS9AnoQxLSGvNKaxsSfNFgKtHYvJMxKv7SzDH1hYyM8zVPaAJ',
	  token_secret: '2otP5KxNjSNipvomHNcZNvNdQ4gtzy3l9Dz2N3wPNnohOsR4Jh'
	});
}

util.inherits(MyChannelHandler, AbstractChannelHandler);

/**
 * Determine whether a channel instance is compatible with the handler.
 *
 * @param {Object} channel channel instance to test
 * @return {Boolean} true if accepted, false otherwise
 */
MyChannelHandler.prototype.accept = function(channel) {
	console.log(channel)
	if (channel.url.indexOf(".tumblr.com") > -1) {
		return true;
	} else {
		return "not tumblr";
	}	
};

/**
 * Deliver a content playlist to a channel instance.
 * Result should be an array of objects corresponding to the posted SC instances.
 *
 * Result objects must at a minimum consist of { scObjectId: '...' } and should be
 * extended with any other data necessary to uniquely reference the deployed content
 * (e.g. post ID).
 *
 * @param {Object} params delivery parameters
 * @param {Object} playlist content playlist
 * @param {Function} callback invoked as callback([error], [result]) when finished
 */
MyChannelHandler.prototype.deliver = function(params, playlist, callback) {
	console.log("in deliver");

	var error = null;
	var result = [];
	var blogName = "thispageisbestpage";

	async.each(playlist,

		// called on each element
		function(item, callback){
			console.log("in each");
			var options = {
				type: "text",
				body: item.layout
			};

			client.text(blogName, options, function (err, data) {
				console.log(err);
				console.log(data);
				result.push({scObjectId: item.scObj.id, postId: data.id});
				
				callback();
			});
		},

		// called when done 
		function(err){
			console.log("done");
			callback(err, result);
		}
	);


	// var error = null;
	// var result = [];
	// var blogName = "thispageisbestpage";

	// for (var i = 0; i<playlist.length; i++) {
	// 	var options = {
	// 		type: "text",
	// 		body: playlist[i].layout
	// 	};

	// 	this.client.text(blogName, options, function (err, data) {
	// 		console.log(err);
	// 		console.log(data);
	// 		result.push({scObjectId: options.body.scObj.id, postId: data.id});
			
	// 		callback(err, result);
	// 	});
	// }

	// // text post
	// var blogName = "thispageisbestpage";
	// var options = {
	// 	type: "text",
	// 	title: "title",
	// 	body: "this is a test post"
	// };
	// this.client.text(blogName, options, function (err, data) {
	// 	console.log(err);
	// 	console.log(data);
	// });

	// photo post (using URL)
	// var blogName = "thispageisbestpage";
	// var options = {
	// 	type: "photo",
	// 	caption: "dis is er caption",
	// 	source: "http://2.bp.blogspot.com/-rjT8XcaLy30/T11lIorDFWI/AAAAAAAADeM/y1ec9KGGUa0/s640/Comeatme.jpg"
	// };
	// this.client.photo(blogName, options, function (err, data) {
	// 	console.log(err);
	// 	console.log(data);
	// });

	// // video post
	// var blogName = "thispageisbestpage";
	// var options = {
	// 	type: "video",
	// 	caption: "dis is er caption",
	// 	data: "*** video file goes here ***",
	// 	embed: "*** embeded html goes here ***"
	// };
	// this.client.video(blogName, options, function (err, data) {
	// 	console.log(err);
	// 	console.log(data);
	// });

	//callback(new HttpCodeError(501, 'deliver not implemented'));
};

// // Include the async package
// // Make sure you add "async" to your package.json
// async = require("async");
  
// // 1st para in async.each() is the array of items
// async.each(items,
//   // 2nd param is the function that each item is passed to
//   function(item, callback){
//     // Call an asynchronous function, often a save() to DB
//     item.someAsyncCall(function (){
//       // Async call is done, alert via callback
//       callback();
//     });
//   },
//   // 3rd param is the function to call when everything's done
//   function(err){
//     // All tasks are done now
//     doSomethingOnceAllAreDone();
//   }
// );

// [
// 	{
// 		"scObjectId": "ca9e74b6-d275-4472-be9c-e49257eabac5",
// 		"postId": 109437244921
// 	},
// 	{
// 		"scObjectId": "ca9e74b6-d275-4472-be9c-e49257eabac5",
// 		"postId": 109437244926
// 	}
// ]

/**
 * Get feedback (e.g. replies, comments) from previously delivered content.
 * Result should be an array of objects which use the format provided by
 * translateFeedback().
 *
 * @param {Object} params content parameters
 * @param {Function} callback invoked as callback([error], [result]) when finished
 */
MyChannelHandler.prototype.getFeedback = function(params, callback) {
	console.log("in feedback");

	console.log(params);

	var blogName = "thispageisbestpage";
	var error = null;
	var result = [];

	async.each(params,

		// called on each element
		function(item, callback){
			console.log("in each");
			var options = {
				id: item.postId,
				notes_info: "true"
			};

			client.posts(blogName, options, function (err, data) {
				console.log(err);
				console.log(data.posts[0].notes[0]);

				for (var i = 0; i<data.posts[0].notes.length; i++) {
					result.push({
				        id: data.posts[0].id,
				        from: {
				            id: data.posts[0].notes[i].post_id,
				            name: data.posts[0].notes[i].blog_name
				        },
				        message: data.posts[0].notes[i].added_text,
				        time: data.posts[0].notes[i].timestamp
				    });
				}
				
				callback();
			});
		},

		// called when done 
		function(err){
			console.log("done");
			callback(err, result);
		}
	);	

	// // get feedback from tumblr here 
	// var blogName = "thispageisbestpage";
	// var options = {
	// 	id: "109311973651",
	// 	notes_info: "true",
	// };
	// client.posts(blogName, options, function (err, data) {
	// 	console.log(err);
	// 	console.log(data);
	// });
};

/**
 * Remove previously delivered content from the channel instance.
 *
 * The SC instance objects passed in will match those which were provided in the
 * response to the deliver() call.
 *
 * @param {Object[]} scInstances SC instances to be deleted
 * @param {Function} callback invoked as callback([error]) when finished
 */
MyChannelHandler.prototype.remove = function(scInstances, callback) {
	console.log("in remove");

	var error = null;
	var blogName = "thispageisbestpage";

	async.each(scInstances,

		// called on each element
		function(item, callback){
			console.log("in each");
			
			client.deletePost(blogName, item.postId, function (err, data) {
				console.log(err);
				console.log(data);				
				callback();
			});
		},

		// called when done 
		function(err){
			console.log("done");
			callback(err);
		}
	);

	// // delete a post from tumblr here 
	// var blogName = "thispageisbestpage";
	// var postID = "109311973651";
	// client.deletePost(blogName, postID, function (err, data) {
	// 	console.log(err);
	// 	console.log(data);
	// });

	// callback(new HttpCodeError(501, 'remove not implemented'));
};

module.exports = MyChannelHandler;