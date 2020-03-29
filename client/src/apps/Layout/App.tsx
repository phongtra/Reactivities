import React, { useContext, useEffect } from 'react';
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
import LoginForm from '../../features/user/LoginForm';
import { ToastContainer } from 'react-toastify';
import { RootStoreContext } from '../stores/rootStore';
import Loading from './Loading';
import ModalContainer from '../common/modal/ModalContainer';

const App: React.FC<RouteComponentProps> = ({ location }) => {
  const rootStore = useContext(RootStoreContext);
  const { setAppLoaded, token, appLoaded } = rootStore.commonStore;
  const { getUser } = rootStore.userStore;
  useEffect(() => {
    if (token) {
      getUser().finally(() => setAppLoaded());
    } else {
      setAppLoaded();
    }
  }, [getUser, setAppLoaded, token]);
  if (!appLoaded) return <Loading content="Loading App..." />;
  return (
    <>
      <ModalContainer />
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
                  <Route path="/login" component={LoginForm} />
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
