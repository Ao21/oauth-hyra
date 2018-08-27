import * as express from 'express';
import { Container, Service } from 'typedi';
import { AuthAPI } from './../services/api';

import * as url from 'url';

const authApi = Container.get(AuthAPI);

@Service()
export class ConsentRoutes {
	router = express.Router();

	constructor() {}

	getRoutes() {
		this.router.get('/', this.getConsent);
		this.router.post('/', this.postConsent);

		return this.router;
	}

	async getConsent(req, res, next) {
		const query = url.parse(req.url, true).query;
		const challenge = <any>query.consent_challenge;

		try {
			const response = await authApi.api.getConsentRequest(challenge);

			const obj = {
				challenge: challenge,
				requested_scope: response.body.requestedScope,
				user: response.body.subject,
				client: response.body.client,
			};

			res.render('consent', obj);
		} catch (err) {
			next(err);
		}
	}

	async postConsent(req, res, next) {
		const challenge = req.body.challenge;

		let grantScope = req.body.grantScope;
		if (!Array.isArray(grantScope)) {
			grantScope = [grantScope];
		}

		try {
			const response = await authApi.api.acceptConsentRequest(challenge, {
				grantScope: grantScope,
				session: {},
			});

			res.redirect(response.body.redirectTo);
		} catch (err) {
			next(err);
		}
	}
}
