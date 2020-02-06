import React, { useState, useEffect, FormEvent } from 'react';
import { Segment, Form, Button } from 'semantic-ui-react';
import { IActivity } from '../../../apps/Models/Activity';

interface IProps {
  setEditMode: (editMode: boolean) => void;
  activity: IActivity | null;
}

const ActivityForm: React.FC<IProps> = ({
  setEditMode,
  activity: initialFormState
}) => {
  const initializeForm = () => {
    if (initialFormState) {
      return initialFormState;
    }
    return {
      id: '',
      title: '',
      category: '',
      description: '',
      date: '',
      city: '',
      venue: ''
    };
  };
  const [activity, setActivity] = useState<IActivity>(initializeForm);

  useEffect(() => {
    setActivity(initializeForm);
  }, [initialFormState]);
  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
  };
  const handleSubmit = () => {
    console.log(activity);
  };
  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit}>
        <Form.Input
          onChange={handleInputChange}
          name="title"
          placeholder="Title"
          value={activity.title}
        />
        <Form.TextArea
          rows={2}
          name="description"
          onChange={handleInputChange}
          placeholder="Description"
          value={activity.description}
        />
        <Form.Input
          name="category"
          onChange={handleInputChange}
          placeholder="Category"
          value={activity.category}
        />
        <Form.Input
          name="date"
          type="date"
          onChange={handleInputChange}
          placeholder="Date"
          value={activity.date}
        />
        <Form.Input name="city" placeholder="City" value={activity.city} />
        <Form.Input name="venue" placeholder="Venue" value={activity.venue} />
        <Button floated="right" positive type="submit" content="Submit" />
        <Button
          floated="right"
          type="button"
          content="Cancel"
          onClick={() => setEditMode(false)}
        />
      </Form>
    </Segment>
  );
};

export default ActivityForm;
