import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { IActivity } from '../Models/Activity';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  );
  const [editMode, setEditMode] = useState(false);

  const handleSelectActivity = (id: string): void => {
    const select = activities.find(a => a.id === id);
    if (select) {
      return setSelectedActivity(select);
    }
  };
  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  };
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get<IActivity[]>(
        'http://localhost:5000/api/activities'
      );
      setActivities(res.data);
    };
    fetchData();
  }, []);

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
        />
      </Container>
    </>
  );
};

export default App;
