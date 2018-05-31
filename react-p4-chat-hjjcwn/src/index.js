import React, { Component } from 'react';
import { render } from 'react-dom';
import './style.css';

import * as io from 'socket.io-client';

class App extends Component {
  socket = null;

  constructor() {
    super();
    this.state = {
      authorId: 'domyslny login',
      messages: []
    };
  }

  componentWillMount() {
    this.socket = io.connect('https://socket-chat-server-zbqlbrimfj.now.sh');

    this.socket.on('chat message', message => {
      var messageDate = new Date(message.timestamp),
          date = messageDate.getFullYear() + '-' + 
                   (messageDate.getMonth() + 1) + '-' +
                    messageDate.getDate() + ' ' + 
                    messageDate.getHours() + ':' + 
                    messageDate.getMinutes() + ':' + 
                    messageDate.getSeconds();

      message.date = date;
      this.state.messages.push(message);
      this.setState({ messages: this.state.messages });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    this.scrollToBottom();
    setTimeout( this.doShowInfoMessage(), 15000 );
  }

  scrollToBottom() {
    const {messageBody} = this.refs;
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
  }

  setAuthorId = () => {
    const authorId = this.refs.inputRef.value;
    if (authorId.trim() !== '') {
      this.state.authorId = authorId;
      document.getElementById( "chatAuthorId" ).textContent = authorId;
      document.getElementsByClassName('userForm')[0].style.display = "none";
    }
  }

  send = () => {
    const text = this.refs.textareaRef.value;
    if (text.trim() !== '') {
      const message = { 
        text, 
        authorId: this.state.authorId,   
       };
      this.socket.emit('chat message', message);
      this.refs.textareaRef.value = '';
    }
  }

  removeFromArray = async event => {
      event.preventDefault();
      event.persist();
      var indexToRemove = event.target.value;
      //
  }

  doShowInfoMessage() {
    document.getElementById( "infoAlert" ).style.display = "block" ;
  }

  doHideInfoMessage() {
    document.getElementById( "infoAlert" ).style.display = "none" ;
  }

  handleInputKeyUp = event => {
    if (event.keyCode === 13) { //enter
      this.setAuthorId();
      event.preventDefault();
    }
  };

  handleMessageKeyUp = event => {
    this.doHideInfoMessage();

    if (event.keyCode === 13) { //enter
      this.send();
      event.preventDefault();
    }
  };

  render() {
    return (
        <section className="wrapper">
          
          <div className="userForm">
            <div className="">
              <span>Twój login: </span>
              <input type="text"
                  ref="inputRef"
                  placeholder={this.state.authorId}
                  onKeyUp={this.handleInputKeyUp}
                  ></input>
            </div>
            <div className=" userForm footer">
                <button onClick={this.setAuthorId} 
                        className="button ">
                  Wyslij
                </button>
            </div>
          </div>

          <div className="chat">
            <div  id="infoAlert"
                  ref={'infoAlert'} 
                  className="infoAlert">
            Dostarczono!
            </div>
            <div className="header">
              Okno chatu:  
              <span id="chatAuthorId" >
                {this.state.authorId}
              </span>
            </div>
            <div  ref={'messageBody'} 
                  id="messageBody">
              {
                this.state.messages.map((message, index) =>
                
                  <div key={message.id} className="message">
                    <div className="info">
                      <span className="lData">
                        {message.authorId}
                      </span>
                      <span className="rData">
                        {message.date}
                      </span>
                      <span className="actionData">
                        <button className="button delete" 
                                ref={'remmoveButtonRef'}
                                onClick={this.removeFromArray} 
                                id={index.index}>
                            X
                        </button>
                      </span>
                    </div>
                    {' '}
                    <p className="messageData">
                    {message.text}
                    </p>
                  </div>
                  )
              }
            </div>
            <div className="footer">
              <textarea 
                ref="textareaRef"
                className="textarea"
                placeholder="Wpisz wiadomosc"
                onKeyUp={this.handleMessageKeyUp}
                ></textarea>
              <button onClick={this.send} 
                      className="button">
                Wyslij
              </button>
            </div>
          </div>
        </section>
      
    );
  }
}

render(<App />, document.getElementById('root'));
