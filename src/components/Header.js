/** @jsx jsx */
// eslint-disable-next-line
import React from 'react';
// eslint-disable-next-line
import { jsx } from 'theme-ui';
import { Heading } from 'theme-ui';

function Header(props) {
  return (
    <header
      sx={{
        display: 'flex',
        flexDirection: ['column', 'row'],
        justifyContent: 'center',
        alignItems: 'center',
        my: 4,
      }}
    >
      <Heading as="h1" sx={{ order: [0, 1], variant: 'text.heading', pl: 3 }}>
        Hackers News Search Engine
      </Heading>
      {props.children}
    </header>
  );
}

export default Header;
