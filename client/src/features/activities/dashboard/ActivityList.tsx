import React, { useContext } from 'react';
import { Item, Button, Label, Segment } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../apps/stores/activityStore';
import { Link } from 'react-router-dom';

const ActivityList: React.FC = () => {
  const activityStore = useContext(ActivityStore);
  const {
    activitiesByDate: activities,
    deleteActivity,
    submitting,
    target
  } = activityStore;
  return (
    <Segment clearing>
      <Item.Group divided>
        {activities.map(
          ({ title, date, description, venue, city, category, id }, i) => (
            <Item key={i}>
              <Item.Content>
                <Item.Header as="a">{title}</Item.Header>
                <Item.Meta>{date}</Item.Meta>
                <Item.Description>
                  <div>{description}</div>
                  <div>
                    {city}, {venue}
                  </div>
                </Item.Description>
                <Item.Extra>
                  <Button
                    floated="right"
                    content="View"
                    color="blue"
                    as={Link}
                    to={`/activities/${id}`}
                  />
                  <Button
                    name={id}
                    loading={target === id && submitting}
                    floated="right"
                    content="Delete"
                    color="red"
                    onClick={e => deleteActivity(id, e)}
                  />
                  <Label basic content={category} />
                </Item.Extra>
              </Item.Content>
            </Item>
          )
        )}
      </Item.Group>
    </Segment>
  );
};

export default observer(ActivityList);
