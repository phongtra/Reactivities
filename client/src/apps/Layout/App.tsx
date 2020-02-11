import React, { useState, useEffect, SyntheticEvent } from 'react';
import { Container } from 'semantic-ui-react';
import { IActivity } from '../Models/Activity';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import Loading from './Loading';
import agent from '../api/agent';

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  );
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [target, setTarget] = useState('');
  useEffect(() => {
    agent.Activities.list()
      .then(res => {
        let activities: IActivity[] = [];
        res.forEach(activity => {
          activity.date = activity.date.split('.')[0];
          activities.push(activity);
        });
        setActivities(activities);
      })
      .then(() => setLoading(false));
  }, []);

  const handleSelectActivity = async (id: string) => {
    const select = activities.find(activity => activity.id === id);
    if (select) {
      setEditMode(false);

      return setSelectedActivity(select);
    }
  };
  const handleCreateActivity = async (activity: IActivity) => {
    setSubmitting(true);
    await agent.Activities.create(activity);
    setActivities([...activities, activity]);
    setSelectedActivity(activity);
    setEditMode(false);
    setSubmitting(false);
  };
  const handleEditActivity = async (activity: IActivity) => {
    setSubmitting(true);
    await agent.Activities.update(activity, activity.id);
    setActivities([...activities.filter(a => a.id !== activity.id), activity]);
    setSelectedActivity(activity);
    setEditMode(false);
    setSubmitting(false);
  };
  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  };

  const handleDeleteActivity = async (
    id: string,
    e: SyntheticEvent<HTMLButtonElement>
  ) => {
    setSubmitting(true);
    setTarget(e.currentTarget.name);
    await agent.Activities.delete(id);
    setActivities([...activities.filter(a => a.id !== id)]);
    setSubmitting(false);
  };
  if (loading) return <Loading content="loading..." />;
  return (
    <>
      <NavBar openCreateForm={handleOpenCreateForm} />
      <Container className="list-container">
        <ActivityDashboard
          editMode={editMode}
          setEditMode={setEditMode}
          activities={activities}
          selectActivity={handleSelectActivity}
          selectedActivity={selectedActivity}
          setSelectedActivity={setSelectedActivity}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
          target={target}
        />
      </Container>
    </>
  );
};

export default App;
