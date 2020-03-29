import React, { useContext } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { Form, Button, Header } from 'semantic-ui-react';
import TextInput from '../../apps/common/form/TextInput';
import { RootStoreContext } from '../../apps/stores/rootStore';
import { IUserFormValues } from '../../apps/Models/User';
import { FORM_ERROR } from 'final-form';
import { combineValidators, isRequired } from 'revalidate';
import ErrorMessage from '../../apps/common/form/ErrorMessage';

const validate = combineValidators({
  email: isRequired('Email'),
  password: isRequired('Password')
});

const LoginForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { login } = rootStore.userStore;
  return (
    <FinalForm
      validate={validate}
      onSubmit={(values: IUserFormValues) =>
        login(values).catch(e => ({
          [FORM_ERROR]: e
        }))
      }
      render={({
        handleSubmit,
        submitting,
        submitError,
        invalid,
        pristine,
        dirtySinceLastSubmit
      }) => {
        return (
          <Form onSubmit={handleSubmit} error>
            <Header as="h2" color="teal" textAlign="center">
              Login to Reactivities
            </Header>
            <Field name="email" component={TextInput} placeholder="Email" />
            <Field
              name="password"
              component={TextInput}
              placeholder="Password"
              type="password"
            />
            {submitError && !dirtySinceLastSubmit && (
              <ErrorMessage
                error={submitError}
                text="Wrong email or password"
              />
            )}
            <br />
            <Button
              disabled={(invalid && !dirtySinceLastSubmit) || pristine}
              loading={submitting}
              color="teal"
              fluid
            >
              Login
            </Button>
          </Form>
        );
      }}
    />
  );
};

export default LoginForm;
