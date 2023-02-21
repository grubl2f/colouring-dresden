import React, { FormEvent } from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';

import ErrorBox from '../components/error-box';

interface PasswordResetState {
    error: string;
    success: boolean;
    token: string;
    password: string;
    confirmPassword: string;
}

export default class PasswordReset extends React.Component<RouteComponentProps, PasswordResetState> {

    static tokenMissingMessage = 'Token zum Passwort zurücksetzen fehlt. Bitte klicken Sie den Link aus der E-Mail zum Passwort zurücksetzen an!';

    constructor(props) {
        super(props);

        this.state = {
            error: undefined,
            success: undefined,
            token: undefined,
            password: undefined,
            confirmPassword: undefined
        };
    }

    componentDidMount() {
        const queryParams = new URLSearchParams(this.props.location.search);
        const token = queryParams.get('token');
        if(token == undefined) {
            this.setState({ error: PasswordReset.tokenMissingMessage });
        } else {
            this.setState({ token: token });
        }
    }

    handleChange(event: FormEvent<HTMLInputElement>) {
        const { name, value } = event.currentTarget;
        this.setState({
            [name]: value,
        } as any);
    }

    async handleSubmit(event: FormEvent) {
        event.preventDefault();

        this.setState({ error: undefined });

        if(this.state.token == undefined) {
            this.setState({ error: PasswordReset.tokenMissingMessage });
            return;
        }
        if(this.state.password !== this.state.confirmPassword) {
            this.setState({ error: 'Passwörter stimmen nicht überein!' });
            return;
        }


        const requestData = {
            token: this.state.token,
            password: this.state.password
        };

        const res = await fetch('/api/users/password', {
            method: 'PUT',
            body: JSON.stringify(requestData),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json();

        if (data.error != undefined) {
            this.setState({ error: data.error });
        } else if (data.success === true) {
            this.setState({ success: true });
        } else {
            this.setState({ error: 'Unerwartetes Ergebnis.' });
        }
    }

    render() {
        if (this.state.success) {
            return <Redirect to="/my-account.html" />;
        }
        return (

            <article>
                <section className="main-col">
                    <h1 className="h2">Passwort vergessen</h1>
                    <p>Bitte geben Sie ein neues Passwort für Ihren Account ein. Sollte ihr Token zum Zurücksetzen des Passworts nicht funktionieren, gehen Sie bitte zurück zur <Link to="/forgotten-password.html">Passwort vergessen Seite</Link>, um einen neuen Link anzufordern.</p>
                    <ErrorBox msg={this.state.error} />
                    <form onSubmit={e => this.handleSubmit(e)}>
                        <label htmlFor="email">Neues Passwort</label>
                        <input name="password"
                            className="form-control" type="password"
                            placeholder="Neues Passwort" required
                            onChange={e => this.handleChange(e)}
                        />

                        <label htmlFor="email">Neues Passwort bestätigen</label>
                        <input name="confirmPassword"
                            className="form-control" type="password"
                            placeholder="Neues Passwort bestätigen" required
                            onChange={e => this.handleChange(e)}
                        />

                        <input name="token" id="token" type="hidden" value={this.state.token} />

                        <div className="buttons-container">
                            <input type="submit" value="Passwort ändern" className="btn btn-primary" />
                        </div>
                    </form>
                </section>
            </article>
        );
    }
}
