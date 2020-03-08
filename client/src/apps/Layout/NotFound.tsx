import React from 'react';
import { Segment, Header, Icon, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Segment placeholder>
      <Header icon>
        <Icon name="search" />
        Oops - we looked everywhere but couldn't find it
      </Header>
      <Segment.Inline>
        <Button as={Link} to="/activities" primary>
          Return to Activities Page
        </Button>
      </Segment.Inline>
    </Segment>
  );
};

export default NotFound;
