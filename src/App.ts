import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as expressValidator from 'express-validator';
import { SseController } from './Controllers/SseController';

// Creates and configures an ExpressJS web server.
class App {

	// ref to Express instance
	public express: express.Application;

	//Run configuration methods on the Express instance.
	constructor() {
		this.express = express();
		this.middleware();
		this.routes();
	}

	// Configure Express middleware.
	private middleware(): void {
		this.express.use(bodyParser.json({ limit: '50mb' }));
		this.express.use(bodyParser.urlencoded({ extended: false }));
		this.express.use(expressValidator());
	}

	// Configure API endpoints.
	private routes(): void {
		const app = this.express;

		// Allow access from all origins. NOT TO BE USED IN PRODUCTION CODE
		app.use(function(request, response, next) {
			response.header("Access-Control-Allow-Origin", "*");
			response.header("Access-Control-Allow-Headers", "*");
			response.header("Access-Control-Allow-Methods", "*");
			next();
		});

		const URL_PREFIX = '/api/1.0/';
		app.get(URL_PREFIX + 'register/event-stream', new SseController().register);
		app.post(URL_PREFIX + 'send', new SseController().send);
	}
}

export default new App().express;