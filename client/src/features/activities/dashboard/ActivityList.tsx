import React, { useContext, Fragment } from 'react';
import { Item, Label } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import ActivityListItem from './ActivityListItem';
import { RootStoreContext } from '../../../apps/stores/rootStore';
import { format } from 'date-fns';

const ActivityList: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { activitiesByDate } = rootStore.activityStore;
  return (
    <>
      {activitiesByDate.map(([group, activities]) => {
        return (
          <Fragment key={group}>
            <Label size="large" color="blue">
              {format(group, 'eeee do MMMM')}
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
