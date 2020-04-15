import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App, { updateSearchTopStoriesState } from './App';
import Search from './Search';
import Table from './Table';
import { Button } from './Button';

Enzyme.configure({ adapter: new Adapter() });

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

describe('Search', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Search onChange={() => 'ok'} onSubmit={() => 'ok'} value="ok">
        Search
      </Search>,
      div,
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  test('has a valid snapshot', () => {
    const component = renderer.create(
      <Search onChange={() => 'ok'} onSubmit={() => 'ok'} value="ok">
        Search
      </Search>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Button', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Button onClick={() => 'ok'}>Give Me More</Button>, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test('has a valid snapshot', () => {
    const component = renderer.create(<Button onClick={() => 'ok'}>Give Me More</Button>);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Table', () => {
  const props = {
    list: [
      { title: '1', author: '1', num_comments: 1, points: 2, objectID: 'y' },
      { title: '2', author: '2', num_comments: 1, points: 2, objectID: 'z' },
    ],
    onDismiss: () => 'ok',
  };

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Table {...props} />, div);
  });

  test('has a valid snapshot', () => {
    const component = renderer.create(<Table {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('shows two items in list', () => {
    const element = shallow(<Table {...props} />);
    expect(element.find('* + div div').length).toBe(2);
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
