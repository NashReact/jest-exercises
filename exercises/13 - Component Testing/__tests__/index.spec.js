import React from 'react';
import List from '../index';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

// NO EDITS NECESSARY IN THIS FILE

describe('<List />', () => {
  it('should render an `li` for each data item', () => {
    const data = [
      { key: 1, name: 'Item 1', selected: false },
      { key: 2, name: 'Item 2', selected: false },
      { key: 3, name: 'Item 3', selected: false },
      { key: 4, name: 'Item 4', selected: false },
    ];
    const wrapper = shallow(<List data={data} onClick={jest.fn()} />);
    expect(wrapper.find('li').length).toEqual(data.length);
  });

  it('should call `onClick` prop with item key on item clicked', () => {
    const data = [
      { key: 1, name: 'Item 1', selected: false },
      { key: 2, name: 'Item 2', selected: false },
      { key: 3, name: 'Item 3', selected: true },
      { key: 4, name: 'Item 4', selected: false },
    ];
    const mockClickHandler = jest.fn();
    const wrapper = shallow(<List data={data} onClick={mockClickHandler} />);
    wrapper.find('li.selected').simulate('click');
    expect(mockClickHandler).lastCalledWith(3);
  });

  it('should render consistently', () => {
    let data = [
      { key: 1, name: 'Item 1', selected: false },
      { key: 2, name: 'Item 2', selected: true },
      { key: 3, name: 'Item 3', selected: false },
      { key: 4, name: 'Item 4', selected: false },
    ];
    let component = renderer.create(<List data={data} onClick={jest.fn()} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    data = [
      { key: 1, name: 'Item 1', selected: false },
      { key: 3, name: 'Item 3', selected: false },
      { key: 4, name: 'Item 4', selected: true },
      { key: 5, name: 'Item 5', selected: false },
    ];
    component = renderer.create(<List data={data} onClick={jest.fn()} />);
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
