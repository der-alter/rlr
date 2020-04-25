import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import App, { updateSearchTopStoriesState } from './App';

describe('App', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test('has a valid snapshot', () => {
    const component = renderer.create(<App />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Search Top Stories State', () => {
  it('returns a new state', () => {
    const prevState = {
      results: null,
      searchKey: 'redux',
      searchTerm: 'redux',
      error: null,
      isLoading: true,
    };

    const hits = [{ title: '1', author: '1', num_comments: 1, points: 2, objectID: 'x' }];
    const page = 1;
    const newState = updateSearchTopStoriesState(hits, page)(prevState);
    expect(newState.results['redux'].hits).toMatchObject(hits);
    expect(newState.results['redux'].page).toBe(page);
  });
});
