import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class Header  extends Component {
  constructor(props){
    super(props);

    this.state = {
      orgName: '',
      token: ''
    };
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    return (
      <div className='header'>
        <h1>Git List</h1>
        <div className="inputs">
          <TextField
            value = { this.state.orgName }
            className = "header-inputs"
            label="What's the organization you're interested in?"
            onChange = { this.handleChange('orgName') }
          />
          <TextField
            value = {this.state.token }
            className = "header-inputs"
            label="Github access token"
            onChange = { this.handleChange('token') }
          />
        </div>
        <Button onClick={() => this.props.submit(this.state.orgName, this.state.token)}>
          Go
        </Button>

      </div>
    );
  }
}

export default Header;
