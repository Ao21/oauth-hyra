import { Application } from 'express';
import * as express from 'express';
import { environment } from './config/environment';
import { join } from 'path';

import * as bodyParser from 'body-parser';
import * as cookieParser from 'body-parser';

import { Container, Service } from 'typedi';

import { LoginRoutes } from './routes/login';
import { ConsentRoutes } from './routes/consent';

var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });


export class Server {
	app: Application;

	constructor() {
		this.app = express();

		this.setup();
		this.init();
	}

	setup() {
		this.app.set('views', join(__dirname, 'views'));
		this.app.set('view engine', 'jade');

		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: false }));
		this.app.use(cookieParser());

		const loginRoutes = Container.get(LoginRoutes);
		const consentRoutes = Container.get(ConsentRoutes);

		this.app.use('/login', loginRoutes.getRoutes());
		this.app.use('/consent', consentRoutes.getRoutes());

	}

	init() {
		this.app.listen(environment.server.port, () => {
			console.debug(
				`Security App has started on post ${environment.server.port}`,
			);
		});
	}
}
