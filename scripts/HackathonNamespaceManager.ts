/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../t6s-core/core-backend/scripts/Logger.ts" />
/// <reference path="../t6s-core/core-backend/scripts/server/SourceNamespaceManager.ts" />

class HackathonNamespaceManager extends SourceNamespaceManager {

	/**
	 * Constructor.
	 *
	 * @constructor
	 * @param {any} socket - The socket.
	 */
	constructor(socket : any) {
		super(socket);
		this.addListenerToSocket('VideoFromJSON', function (params, self) { new VideoFromJSON(params, self); });
		this.addListenerToSocket('PictureAlbumFromJSON', function (params, self) { new PictureAlbumFromJSON(params, self); });
	}
}