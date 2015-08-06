/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../t6s-core/core-backend/t6s-core/core/scripts/infotype/PictureAlbum.ts" />
/// <reference path="../../t6s-core/core-backend/t6s-core/core/scripts/infotype/Picture.ts" />
/// <reference path="../../t6s-core/core-backend/t6s-core/core/scripts/infotype/PictureURL.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/server/SourceItf.ts" />

var request = require('request');

class PictureAlbumFromJSON extends SourceItf {
	constructor(params: any, hackathonNamespaceManager : HackathonNamespaceManager) {
		super(params, hackathonNamespaceManager);

		if (this.checkParams(["Limit","InfoDuration","URL"])) {
			this.run();
		}
	}

	run() {
		var self = this;

		Logger.debug("retrievePictureAlbumFromJSON Action with params :");
		Logger.debug(self.getParams());

		var fail = function(error) {
			if(error) {
				Logger.error(error);
			}
		};

		request(self.getParams().URL, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var bodyJSON = JSON.parse(body);
				var album = new PictureAlbum(uuid.v1());

				var limit = parseInt(self.getParams().Limit);

				if (bodyJSON.length < limit) {
					limit = bodyJSON.length;
				}

				var infoDuration = parseInt(self.getParams().InfoDuration);

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
				self.getSourceNamespaceManager().sendNewInfoToClient(album);
			}
		});
	}
}