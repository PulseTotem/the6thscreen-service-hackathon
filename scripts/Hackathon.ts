/** @author Simon Urli <simon@the6thscreen.fr>  */

/// <reference path="../t6s-core/core-backend/scripts/server/SourceServer.ts" />
/// <reference path="../t6s-core/core-backend/scripts/Logger.ts" />

/// <reference path="./HackathonNamespaceManager.ts" />

class Hackathon extends SourceServer {

	/**
	 * Constructor.
	 *
	 * @param {number} listeningPort - Server's listening port..
	 * @param {Array<string>} arguments - Server's command line arguments.
	 */
	constructor(listeningPort : number, arguments : Array<string>) {
		super(listeningPort, arguments);

		this.init();
	}

	/**
	 * Method to init the Flickr server.
	 *
	 * @method init
	 */
	init() {
		var self = this;

		this.addNamespace("Hackathon", HackathonNamespaceManager);
	}
}

/**
 * Server's Flickr listening port.
 *
 * @property _FlickrListeningPort
 * @type number
 * @private
 */
var _HackathonListeningPort : number = process.env.PORT || 6008;

/**
 * Server's Twitter command line arguments.
 *
 * @property _TwitterArguments
 * @type Array<string>
 * @private
 */
var _HackathonArguments : Array<string> = process.argv;

var serverInstance = new Facebook(_HackathonListeningPort, _HackathonArguments);
serverInstance.run();