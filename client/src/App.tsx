import React, { Component } from 'react';
import axios from 'axios';
import { Header, Icon, List, Container } from 'semantic-ui-react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = { values: [] };
  async componentDidMount() {
    const res = await axios.get('http://localhost:5000/api/values');
    this.setState({ values: res.data });
  }
  render() {
    return (
      <Container>
        <Header as="h2">
          <Icon name="users" />
          <Header.Content>Reactivities</Header.Content>
        </Header>
        <List>
          {this.state.values.map((value: any, i: number) => (
            <List.Item key={i}>{value.name}</List.Item>
          ))}
        </List>
      </Container>
    );
  }
}

export default App;
