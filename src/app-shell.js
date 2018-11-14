import {LitElement, html} from '@polymer/lit-element';

class AppShell extends LitElement {
    static get properties() {

        return {
            users: {type: Array},
            messages: {type: Array},
        }
    }

    constructor() {
        super();
        this.users = [];
        this.messages = [];

        this.socket = io('http://localhost:3000');

        this.socket.on('update-messages', messages => {
            this.messages = messages;

        });
        this.socket.on('update-users', users => {
            this.users = users;
        })


    }

    onKeyPressed(e) {
        if (e.key === "Enter")
            this.onSend();
    }

    onSend() {
        const inputElement = this.shadowRoot.querySelector("input");
        if (inputElement.value) {
            this.socket.emit("new-message", inputElement.value);
            inputElement.value = '';
        }
    }

    render() {
        const {users, messages} = this;


        return html`
            <style>
                :host {
                    display: block;
                    height: 100%;
                }
                #container {
                    display: grid;
                    height: 100%;
                    background-color: #eeeeee;
                    grid-template-columns: 200px auto;
                    grid-template-rows: auto 60px;
                }
                #input-container{
                    display: flex;
                    grid-column: 2;
                    grid-row: 2;
                    padding: 10px;
                }
                
                #input-container > input {
                    border-radius: 500px;
                    border: 1px solid #a3a3a3;
                    flex: 1;
                    padding: 0 15px; 
                }
                
                #input-container > button {
                    border-radius: 500px;
                    border: none;
                    text-decoration: none;
                    background-color: #64b5f6;
                    padding: 10px;
                    margin-left: 10px;
                }
                
                #chat-panel{
                    grid-column: 2;
                    grid-row: 1;
                    padding-top: 10px;
                    padding-left: 10px;
                }
               
                #user-container{
                    grid-column: 1;
                    grid-row: 1/3;
                    background-color: #64b5f6;
                    justify-content: center;                  
                }
               
                #user-header{
                    background-color: #2196f3;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                }
                
                #user-list > .user {
                    padding: 5px 10px;
                    text-align: center;
                }
                
                .message > .username {
                    font-weight: bold;
                    margin-left: 5px;
                }
                
                .message > .content {
                    background: white;
                    margin-bottom: 10px;
                    margin-right: 10px;
                    border-radius: 10px; 
                    padding: 5px;
                }
            </style>
 
            <div id="container">
 
                <div id="input-container">
                    <input @keypress=${e => this.onKeyPressed(e)}>
                    <button
                    @click=${() => this.onSend()}>Send</button>
                </div>
 
 
                <div id="chat-panel">
                    ${messages.map(message => html`
                        <div class="message">
                            <div class="username">${message.username}</div>
                            <div class="content">${message.msg}</div>
                        </div>
                        `)
            }
                </div>
 
                <div id="user-container">
                    <div id="user-header">Online Users</div>
                    <div id="user-list">
                        ${users.map(user => html`
                            <div class="user">${user}</div>
                        `)}
                    </div>
                </div>
            </div>
           
        `;
    }
}

customElements.define('app-shell', AppShell);
