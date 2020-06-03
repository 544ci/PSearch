import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Map } from './components/Map';
import { IntruderGallery } from './components/Gallery';
import "../node_modules/video-react/dist/video-react.css";

import { Messages } from './components/Messages';
import { Calllogs } from './components/Calllogs';
import { Dashboard } from './components/Dashboard';
import { Phones } from './components/Phones';
import { Video } from './components/Video'
import { RecordedVideo } from './components/RecordedVideo'

import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';

import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
        <Layout>

        <Route exact path='/' component={Home} />
        <AuthorizeRoute path='/dashboard' component={Dashboard} />
        <AuthorizeRoute path='/phones' component={Phones} />
        <AuthorizeRoute exact path='/location/:deviceId' component={Map} />
        <AuthorizeRoute exact path='/messages/:deviceId' component={Messages} />
        <AuthorizeRoute exact path='/calllogs/:deviceId' component={Calllogs} />
            <AuthorizeRoute exact path='/gallery/:deviceId' component={IntruderGallery} />
            <AuthorizeRoute exact path='/videos/:deviceId' component={RecordedVideo} />
        <AuthorizeRoute exact path='/live/:deviceId' component={Video} />

        <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
      </Layout>
    );
  }
}
