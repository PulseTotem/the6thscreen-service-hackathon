/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../t6s-core/core-backend/libsdef/node-uuid.d.ts" />

/// <reference path="../t6s-core/core-backend/scripts/Logger.ts" />

/// <reference path="../t6s-core/core-backend/scripts/server/SourceNamespaceManager.ts" />

/// <reference path="../t6s-core/core-backend/t6s-core/core/scripts/infotype/EventList.ts" />
/// <reference path="../t6s-core/core-backend/t6s-core/core/scripts/infotype/CityEvent.ts" />

var datejs : any = require('datejs');

var DateJS : any = <any>Date;
var uuid : any = require('node-uuid');
var fs : any = require('fs');
var xml2js : any = require('xml2js');
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
		this.addListenerToSocket('PublicEvents', this.retrievePublicEvents);
	}

	retrievePublicEvents(params : any, self : HackathonNamespaceManager = null) {
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
	}
}