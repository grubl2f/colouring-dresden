import React, { ChangeEvent, FormEvent } from 'react';

import ErrorBox from '../components/error-box';
import InfoBox from '../components/info-box';

import { CCConfig } from '../../cc-config';
let config: CCConfig = require('../../cc-config.json')

interface ForgottenPasswordState {
    success: boolean;
    error: string;
    email: string;
    emailUsed: string;
}

export default class ForgottenPassword extends React.Component<{}, ForgottenPasswordState> {
    constructor(props) {
        super(props);
        this.state = {
            error: undefined,
            success: undefined,
            email: undefined,
            emailUsed: undefined
        };
    }

    handleChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.currentTarget;
        this.setState({ [name]: value } as any);
    }

    async handleSubmit(event: FormEvent) {
        event.preventDefault();
        this.setState({ error: undefined, success: undefined });

        const emailSent = this.state.email;
        try {
            const res = await fetch('/api/users/password', {
                method: 'PUT',
                body: JSON.stringify({ email: emailSent }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();

            if (data.error != undefined) {
                this.setState({ error: data.error });
            } else if (data.success === true) {
                this.setState({ success: true, emailUsed: emailSent});
            } else {
                this.setState({ error: 'Etwas schlug fehl.' });
            }
        } catch (err) {
            this.setState({ error: 'Etwas schlug fehl.' });
        }
    }

    render() {
        return (
            <article>
                <section className="main-col">
                    <h1 className="h2">Passwort zurücksetzen</h1>
                    <p>Bitte geben Sie die für den Account genutzte E-Mail Adresse an. Ein Link zum Zurücksetzen des Passworts wird an diese E-Mail Adresse verschickt.</p>
                    <ErrorBox msg={this.state.error} />
                    <InfoBox msg="">
                        {this.state.success ?
                            `Wenn diese E-Mail Adresse schon bei Colouring ${config.cityName} registriert ist, wird ein Passwort zum Zurücksetzen an folgende E-Mail Adresse verschickt:  ${this.state.emailUsed}. Bitte prüfen Sie Ihren Posteingang.` :
                            null
                        }
                    </InfoBox>
                    <form onSubmit={e => this.handleSubmit(e)}>
                        <label htmlFor="email">E-Mail</label>
                        <input name="email" id="email"
                            className="form-control" type="email"
                            placeholder="Ihre E-Mail Adresse" required
                            onChange={e => this.handleChange(e)}
                        />

                        <div className="buttons-container">
                            <input type="submit" value="E-Mail zum Zurücksetzen anfordern" className="btn btn-primary" />
                        </div>
                    </form>
                </section>
            </article>
        );
    }
}
