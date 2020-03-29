import React, { useState, useContext, useEffect } from 'react';
import { Segment, Form, Button, Grid } from 'semantic-ui-react';
import { ActivityFormValues } from '../../../apps/Models/Activity';
import { v4 as uuid } from 'uuid';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import { Form as FinalForm, Field } from 'react-final-form';
import TextInput from '../../../apps/common/form/TextInput';
import TextAreaInput from '../../../apps/common/form/TextAreaInput';
import SelectInput from '../../../apps/common/form/SelectInput';
import DateInput from '../../../apps/common/form/DateInput';
import { category } from '../../../apps/common/options/categoryOptions';
import { combineDateAndTime } from '../../../apps/common/utils/util';
import {
  combineValidators,
  isRequired,
  composeValidators,
  hasLengthGreaterThan
} from 'revalidate';
import { RootStoreContext } from '../../../apps/stores/rootStore';

const validate = combineValidators({
  title: isRequired({ message: 'The event title is required' }),
  category: isRequired('Category'),
  description: composeValidators(
    isRequired('Description'),
    hasLengthGreaterThan(4)({
      message: 'Description needs to be at least 5 characters'
    })
  )(),
  city: isRequired('City'),
  venue: isRequired('Venue'),
  date: isRequired('Date'),
  time: isRequired('Time')
});
interface DetailProps {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailProps>> = ({
  match,
  history
}) => {
  const rootStore = useContext(RootStoreContext);
  const {
    createActivity,
    editActivity,
    submitting,
    loadActivity,
    loadingInitial
  } = rootStore.activityStore;

  const [activity, setActivity] = useState(new ActivityFormValues());

  useEffect(() => {
    if (match.params.id) {
      loadActivity(match.params.id).then(activity =>
        setActivity(new ActivityFormValues(activity))
      );
    }
  }, [loadActivity, match.params.id]);

  const handleFinalFormSubmit = (values: any) => {
    const { date, time, ...activity } = values;
    activity.date = combineDateAndTime(date, time);
    if (activity.id) editActivity(activity);
    else {
      let newActivity = { ...activity, id: uuid() };
      createActivity(newActivity);
    }
  };
  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
            validate={validate}
            initialValues={activity}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine }) => {
              return (
                <Form onSubmit={handleSubmit} loading={loadingInitial}>
                  <Field
                    name="title"
                    placeholder="Title"
                    value={activity.title}
                    component={TextInput}
                  />
                  <Field
                    name="description"
                    rows={3}
                    placeholder="Description"
                    value={activity.description}
                    component={TextAreaInput}
                  />
                  <Field
                    name="category"
                    options={category}
                    placeholder="Category"
                    value={activity.category}
                    component={SelectInput}
                  />
                  <Form.Group widths="equal">
                    <Field
                      name="date"
                      date={true}
                      placeholder="Date"
                      value={activity.date}
                      component={DateInput}
                    />
                    <Field
                      name="time"
                      time={true}
                      placeholder="Time"
                      value={activity.time}
                      component={DateInput}
                    />
                  </Form.Group>

                  <Field
                    name="city"
                    placeholder="City"
                    value={activity.city}
                    component={TextInput}
                  />
                  <Field
                    name="venue"
                    placeholder="Venue"
                    value={activity.venue}
                    component={TextInput}
                  />
                  <Button
                    loading={submitting}
                    disabled={loadingInitial || invalid || pristine}
                    floated="right"
                    positive
                    type="submit"
                    content="Submit"
                  />
                  <Button
                    floated="right"
                    disabled={loadingInitial}
                    type="button"
                    content="Cancel"
                    onClick={
                      activity.id
                        ? () => history.push(`/activities/${activity.id}`)
                        : () => history.push('/activities')
                    }
                  />
                </Form>
              );
            }}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityForm);
