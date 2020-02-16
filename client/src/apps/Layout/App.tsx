import React, { useEffect, useContext } from 'react';
import { Container } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import Loading from './Loading';
import ActivityStore from '../stores/activityStore';

const App = () => {
  const activityStore = useContext(ActivityStore);
  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial) return <Loading content="loading..." />;
  return (
    <>
      <NavBar />
      <Container className="list-container">
        <ActivityDashboard />
      </Container>
    </>
  );
};

export default observer(App);
