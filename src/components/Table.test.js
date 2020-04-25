import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Table from './Table';

Enzyme.configure({ adapter: new Adapter() });

describe('Table', () => {
  const props = {
    list: [
      {
        title: '1',
        author: '1',
        num_comments: 1,
        points: 2,
        objectID: 'y',
        created_at_i: 1453762117,
      },
      {
        title: '2',
        author: '2',
        num_comments: 1,
        points: 2,
        objectID: 'z',
        created_at_i: 1453762117,
      },
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
    expect(element.find('* + section > div').length).toBe(2);
  });
});
