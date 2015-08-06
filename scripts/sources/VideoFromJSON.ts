/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../t6s-core/core-backend/t6s-core/core/scripts/infotype/VideoType.ts" />
/// <reference path="../../t6s-core/core-backend/t6s-core/core/scripts/infotype/VideoURL.ts" />
/// <reference path="../../t6s-core/core-backend/t6s-core/core/scripts/infotype/VideoPlaylist.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/server/SourceItf.ts" />

var request = require('request');

class VideoFromJSON extends SourceItf {
	constructor(params: any, hackathonNamespaceManager : HackathonNamespaceManager) {
		super(params, hackathonNamespaceManager);

		if (this.checkParams(["Limit","InfoDuration","URL"])) {
			this.run();
		}
	}

	run() {
		var self = this;

		Logger.debug("retrieveVideoFromJSON Action with params :");
		Logger.debug(self.getParams());

		var fail = function(error) {
			if(error) {
				Logger.error(error);
			}
		};

		request(self.getParams().URL, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var bodyJSON = JSON.parse(body);
				var playlist = new VideoPlaylist(uuid.v1());

				var limit = parseInt(self.getParams().Limit);

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
				self.getSourceNamespaceManager().sendNewInfoToClient(playlist);
			}
		});
	}
}