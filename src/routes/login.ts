import * as express from 'express';
import { Container, Service } from 'typedi';

import * as url from 'url';
import { AuthAPI } from './../services/api';

const authApi = Container.get(AuthAPI);

@Service()
export class LoginRoutes {
	router = express.Router();

	constructor() {}

	getRoutes() {
    this.router.get('/', this.checkForLogin);
    this.router.post('/', this.postLogin);

		return this.router;
	}

	async checkForLogin(req, res, next) {
		var query = url.parse(req.url, true).query;
    var challenge = <any>query.login_challenge;
  
  
		try {
      const response = await authApi.api.getLoginRequest(challenge);

      res.render('login', {
        // csrfToken: req.csrfToken(),
        challenge: challenge,
      });

      // res.redirect(response.redirect_to);
		} catch (err) {
			next(err);
		}
  }
  
  async postLogin(req, res, next) {
    const challenge = req.body.challenge;

    const response = await authApi.api.acceptLoginRequest(challenge, {
      subject: 'foo@bar.com',
    });

    res.redirect(response.body.redirectTo);
  }
}
