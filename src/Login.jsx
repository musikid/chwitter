import React from "react";

export default class Login extends React.Component {
    render() {
        return (
            <button onClick={this.props.login}>Se connecter</button>
        );
    }
}