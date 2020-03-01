import React, { useContext, Fragment } from 'react';
import { Item, Label } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../apps/stores/activityStore';
import ActivityListItem from './ActivityListItem';

const ActivityList: React.FC = () => {
  const activityStore = useContext(ActivityStore);
  const { activitiesByDate } = activityStore;
  return (
    <>
      {activitiesByDate.map(([group, activities]) => {
        return (
          <Fragment key={group}>
            <Label size="large" color="blue">
              {group}
            </Label>
            <Item.Group divided>
              {activities.map((activity, i) => (
                <ActivityListItem key={i} activity={activity} />
              ))}
            </Item.Group>
          </Fragment>
        );
      })}
    </>
  );
};

export default observer(ActivityList);
