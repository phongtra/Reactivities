import React, { SyntheticEvent } from 'react';
import { Item, Button, Label, Segment } from 'semantic-ui-react';
import { IActivity } from '../../../apps/Models/Activity';

interface IProps {
  activities: IActivity[];
  selectActivity: (id: string) => void;
  deleteActivity: (id: string, e: SyntheticEvent<HTMLButtonElement>) => void;
  submitting: boolean;
  target: string;
}

const ActivityList: React.FC<IProps> = ({
  activities,
  selectActivity,
  deleteActivity,
  submitting,
  target
}) => {
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

export default ActivityList;
