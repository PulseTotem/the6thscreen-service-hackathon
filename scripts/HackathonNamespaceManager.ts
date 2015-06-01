/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../t6s-core/core-backend/libsdef/node-uuid.d.ts" />

/// <reference path="../t6s-core/core-backend/scripts/Logger.ts" />

/// <reference path="../t6s-core/core-backend/scripts/server/SourceNamespaceManager.ts" />

/// <reference path="../t6s-core/core-backend/t6s-core/core/scripts/infotype/VideoType.ts" />
/// <reference path="../t6s-core/core-backend/t6s-core/core/scripts/infotype/VideoURL.ts" />
/// <reference path="../t6s-core/core-backend/t6s-core/core/scripts/infotype/VideoPlaylist.ts" />
/// <reference path="../t6s-core/core-backend/t6s-core/core/scripts/infotype/CityEvent.ts" />
/// <reference path="../t6s-core/core-backend/t6s-core/core/scripts/infotype/EventList.ts" />
/// <reference path="../t6s-core/core-backend/t6s-core/core/scripts/infotype/PictureAlbum.ts" />
/// <reference path="../t6s-core/core-backend/t6s-core/core/scripts/infotype/Picture.ts" />
/// <reference path="../t6s-core/core-backend/t6s-core/core/scripts/infotype/PictureURL.ts" />

var datejs : any = require('datejs');

var DateJS : any = <any>Date;
var uuid : any = require('node-uuid');
//var fs : any = require('fs');
//var xml2js : any = require('xml2js');
var request : any = require("request");
var util = require('util');

class HackathonNamespaceManager extends SourceNamespaceManager {

	/**
	 * Constructor.
	 *
	 * @constructor
	 * @param {any} socket - The socket.
	 */
	constructor(socket : any) {
		super(socket);
		//this.addListenerToSocket('PublicEvents', this.retrievePublicEvents);
		this.addListenerToSocket('VideoFromJSON', this.retrieveVideoFromJSON);
		this.addListenerToSocket('PictureAlbumFromJSON', this.retrievePictureAlbumFromJSON);
	}

	/*retrievePublicEvents(params : any, self : HackathonNamespaceManager = null) {
		if (self == null) {
			self = this;
		}

		Logger.debug("retrievePublicEvents Action with params :");
		Logger.debug(params);

		var fail = function(error) {
			if(error) {
				Logger.error(error);
			}
		};

		request('http://www.the6thscreen.fr/events_public.xml', function (error, response, body) {
			if (!error && response.statusCode == 200) {
				xml2js.parseString(body, function (err, xmlDoc) {
					var eventList : EventList = new EventList(uuid.v1());

					var children = xmlDoc.events.event;

					for (var i = 0; i < children.length; i++) {
						var child = children[i];
						var event : CityEvent = new CityEvent(child.id);
						event.setName(child.name_fr);
						event.setStart(new Date(child.start));
						event.setEnd(new Date(child.end));

						eventList.addEvent(event);
					}
					Logger.debug("Send EventList to client : ");
					Logger.debug(eventList);

					self.sendNewInfoToClient(eventList);
				});
			}
		});
	}*/

	retrieveVideoFromJSON(params : any, self : HackathonNamespaceManager = null) {
		if (self == null) {
			self = this;
		}

		Logger.debug("retrieveVideoFromJSON Action with params :");
		Logger.debug(params);

		var fail = function(error) {
			if(error) {
				Logger.error(error);
			}
		};

		request(params.URL, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var bodyJSON = JSON.parse(body);
				var playlist = new VideoPlaylist(uuid.v1());

				var limit = parseInt(params.Limit);

				if (bodyJSON.length < limit) {
					limit = bodyJSON.length;
				}

				var totalDuration = 0;
				for (var i = 0; i < limit; i++) {
					var info = bodyJSON[i];
				   var video = new VideoURL(uuid.v1());
					video.setURL(info.url);
					video.setDurationToDisplay(info.duration);

					totalDuration += info.duration;

					if (info.type == "dailymotion") {
						video.setType(VideoType.DAILYMOTION);
					} else {
						video.setType(VideoType.HTML5)
					}
					playlist.addVideo(video);
				}

				playlist.setDurationToDisplay(totalDuration);
				self.sendNewInfoToClient(playlist);
			}
		});
	}

	retrievePictureAlbumFromJSON(params : any, self : HackathonNamespaceManager = null) {
		if (self == null) {
			self = this;
		}

		Logger.debug("retrievePictureAlbumFromJSON Action with params :");
		Logger.debug(params);

		var fail = function(error) {
			if(error) {
				Logger.error(error);
			}
		};

		request(params.URL, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var bodyJSON = JSON.parse(body);
				var album = new PictureAlbum(uuid.v1());

				var limit = parseInt(params.Limit);

				if (bodyJSON.length < limit) {
					limit = bodyJSON.length;
				}

				var infoDuration = parseInt(params.InfoDuration);

				var totalDuration = limit*infoDuration;
				album.setDurationToDisplay(totalDuration);

				for (var i = 0; i < limit; i++) {
					var info = bodyJSON[i];
					var picture = new Picture(uuid.v1());
					var picMedium = new PictureURL(uuid.v1());

					picMedium.setURL(info.url);
					picMedium.setHeight(info.height);
					picMedium.setWidth(info.width);

					picture.setTitle(info.name);
					picture.setMedium(picMedium);
					picture.setOriginal(picMedium);
					picture.setDurationToDisplay(infoDuration);

					album.addPicture(picture);
				}
				self.sendNewInfoToClient(album);
			}
		});
	}
}