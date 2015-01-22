var util = require('util'),
	AbstractChannelHandler = require('./abstract-channel-handler'),
	logger = require('./util/logger');

/**
 * Constructor for concrete channel handlers.
 * @constructor
 */
function MyChannelHandler() {

	// Authenticate via OAuth
	var tumblr = require('tumblr.js');
	this.client = tumblr.createClient({
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
	logger.info(buildLogMsg("accept", "msg: not supported by this channel handler"));
	return true;
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
	logger.info(buildLogMsg("deliver", "msg: not supported by this channel handler"));
	callback(new HttpCodeError(501, 'deliver not implemented'));
};

/**
 * Get feedback (e.g. replies, comments) from previously delivered content.
 * Result should be an array of objects which use the format provided by
 * translateFeedback().
 *
 * @param {Object} params content parameters
 * @param {Function} callback invoked as callback([error], [result]) when finished
 */
MyChannelHandler.prototype.getFeedback = function(params, callback) {
	logger.info(buildLogMsg("getFeedback", "msg: not supported by this channel handler"));
	callback(new HttpCodeError(501, 'getFeedback not implemented'));
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
	logger.info(buildLogMsg("remove", "msg: not supported by this channel handler"));
	callback(new HttpCodeError(501, 'remove not implemented'));
};



module.exports = MyChannelHandler;