// import './App.css';

import React, { Component } from 'react'
import Navbar from './Components/Navbar';
import News from './Components/News';
import {
  Route,
  BrowserRouter,
  Routes
} from "react-router-dom";
import LoadingBar from 'react-top-loading-bar'


export default class App extends Component {
  state = {
    progress: 0
  }
  
  setProgress = (progress) => {
    this.setState({progress: progress})
  }
  apiKey = process.env.REACT_APP_NEWS_API
  render() {
    const pageSize = 6;

    return (
      <>
        <div>
          <BrowserRouter>
            <Navbar />
            <LoadingBar
              color='#f11946'
              progress={this.state.progress}
            />
            <Routes>
              <Route exact path="/" element={<News setProgress={this.setProgress} apiKey={this.apiKey} key="general" pageSize={pageSize} country="in" category="general" />} />
              <Route exact path="/business" element={<News setProgress={this.setProgress} apiKey={this.apiKey} key="business" pageSize={pageSize} country="in" category="business" />} />
              <Route exact path="/entertainment" element={<News setProgress={this.setProgress} apiKey={this.apiKey} key="entertainment" pageSize={pageSize} country="in" category="entertainment" />} />
              <Route exact path="/general" element={<News setProgress={this.setProgress} apiKey={this.apiKey} key="general" pageSize={pageSize} country="in" category="general" />} />
              <Route exact path="/health" element={<News setProgress={this.setProgress} apiKey={this.apiKey} key="health" pageSize={pageSize} country="in" category="health" />} />
              <Route exact path="/science" element={<News setProgress={this.setProgress} apiKey={this.apiKey} key="science" pageSize={pageSize} country="in" category="science" />} />
              <Route exact path="/sports" element={<News setProgress={this.setProgress} apiKey={this.apiKey} key="sports" pageSize={pageSize} country="in" category="sports" />} />
              <Route exact path="/technology" element={<News setProgress={this.setProgress} apiKey={this.apiKey} key="technology" pageSize={pageSize} country="in" category="technology" />} />
            </Routes>
          </BrowserRouter>
        </div>
      </>)
  }
}

