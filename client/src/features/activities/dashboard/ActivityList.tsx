import React from 'react';
import { Item, Button, Label, Segment } from 'semantic-ui-react';
import { IActivity } from '../../../apps/Models/Activity';

interface IProps {
  activities: IActivity[];
  selectActivity: (id: string) => void;
}

const ActivityList: React.FC<IProps> = ({ activities, selectActivity }) => {
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
                    onClick={() => selectActivity(id)}
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

export default ActivityList;
