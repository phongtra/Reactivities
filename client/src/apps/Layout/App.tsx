import React from 'react';
import { Container } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {
  Route,
  withRouter,
  RouteComponentProps,
  Switch
} from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetail from '../../features/activities/details/ActivityDetail';
import NotFound from './NotFound';
import { ToastContainer } from 'react-toastify';

const App: React.FC<RouteComponentProps> = ({ location }) => {
  return (
    <>
      <Route exact path="/" component={HomePage} />
      <Route
        path={'/(.+)'}
        render={() => {
          return (
            <>
              <ToastContainer position="bottom-right" />
              <NavBar />
              <Container className="list-container">
                <Switch>
                  {' '}
                  <Route
                    exact
                    path="/activities"
                    component={ActivityDashboard}
                  />
                  <Route path="/activities/:id" component={ActivityDetail} />
                  <Route
                    key={location.key}
                    path={['/createActivity', '/manage/:id']}
                    component={ActivityForm}
                  />
                  <Route component={NotFound} />
                </Switch>
              </Container>
            </>
          );
        }}
      />
    </>
  );
};

export default withRouter(observer(App));
