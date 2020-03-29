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
  username: isRequired('Username'),
  displayName: isRequired('Display Name'),
  password: isRequired('Password')
});

const RegisterForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { register } = rootStore.userStore;
  return (
    <FinalForm
      validate={validate}
      onSubmit={(values: IUserFormValues) =>
        register(values).catch(e => ({
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
              name="username"
              component={TextInput}
              placeholder="Username"
            />
            <Field
              name="displayName"
              component={TextInput}
              placeholder="Display Name"
            />
            <Field
              name="password"
              component={TextInput}
              placeholder="Password"
              type="password"
            />
            {submitError && !dirtySinceLastSubmit && (
              <ErrorMessage error={submitError} />
            )}
            <br />
            <Button
              disabled={(invalid && !dirtySinceLastSubmit) || pristine}
              loading={submitting}
              color="teal"
              fluid
            >
              Register
            </Button>
          </Form>
        );
      }}
    />
  );
};

export default RegisterForm;
