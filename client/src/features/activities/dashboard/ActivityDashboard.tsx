import React from 'react';
import { Grid } from 'semantic-ui-react';
import { IActivity } from '../../../apps/Models/Activity';

import ActivityList from './ActivityList';
import ActivityDetail from '../details/ActivityDetail';
import ActivityForm from '../form/ActivityForm';

interface IProps {
  activities: IActivity[];
  selectActivity: (id: string) => void;
  selectedActivity: IActivity | null;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  setSelectedActivity: (activity: IActivity | null) => void;
}

const ActivityDashboard: React.FC<IProps> = ({
  activities,
  selectActivity,
  selectedActivity,
  editMode,
  setEditMode,
  setSelectedActivity
}) => {
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList activities={activities} selectActivity={selectActivity} />
      </Grid.Column>
      <Grid.Column width={6}>
        {selectedActivity && !editMode && (
          <ActivityDetail
            setSelectedActivity={setSelectedActivity}
            activity={selectedActivity}
            setEditMode={setEditMode}
          />
        )}
        {editMode && (
          <ActivityForm setEditMode={setEditMode} activity={selectedActivity} />
        )}
      </Grid.Column>
    </Grid>
  );
};

export default ActivityDashboard;
