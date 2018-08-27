import { OAuth2Api } from '../../out/api';
import { environment } from './../config/environment';
import { Service } from 'typedi';

@Service()
export class AuthAPI {
	api: OAuth2Api;

	constructor() {
		this.api = new OAuth2Api(
			`${environment.hydra.host}:${environment.hydra.port}`,
		);
	}
}
