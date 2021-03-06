/* eslint-env jest */
import React from 'react';
import { shallow, mount } from 'enzyme';
import GraphContainer from './GraphContainer';
import Graph from '../components/Graph';
import nock from 'nock';

describe('<GraphContainer/>', () => {
  describe('with mock API', () => {
    let mockCall;
    beforeEach(() => {
      mockCall = jest.fn();
      mockCall.mockReturnValue(Promise.resolve({ nodes: [], edges: [] }));
    });

    it('calls backend API', () => {
      mount(<GraphContainer startingUris={[]} fetchData={mockCall} />);
      expect(mockCall).toHaveBeenCalledWith([]);
    });

    it('does nothing without startingUris', () => {
      mount(<GraphContainer fetchData={mockCall} />);
      expect(mockCall).not.toHaveBeenCalled();
    });

    it('passes through merged events to Graph', () => {
      const myClick = jest.fn();
      const myEvents = { click: myClick };
      const wrapper = shallow(
        <GraphContainer fetchData={mockCall} events={myEvents} />
      );
      const graph = wrapper.find(Graph);
      expect(typeof graph.props().events.doubleClick).toBe('function');
      expect(graph.props().events.click).toBe(myClick);
    });

    it('overrides default events', () => {
      const myDoubleClick = jest.fn();
      const myEvents = { doubleClick: myDoubleClick };
      const wrapper = shallow(
        <GraphContainer fetchData={mockCall} events={myEvents} />
      );
      const graph = wrapper.find(Graph);
      expect(graph.props().events.doubleClick).toBe(myDoubleClick);
    });

    it('passes through options', () => {
      const myOptions = { edges: { color: 'blue' } };
      const wrapper = shallow(
        <GraphContainer fetchData={mockCall} options={myOptions} />
      );
      const graph = wrapper.find(Graph);
      expect(graph.props().options).toBe(myOptions);
    });

    it('passes through layout', () => {
      const wrapper = shallow(
        <GraphContainer fetchData={mockCall} layout={'myLayout'} />
      );
      const graph = wrapper.find(Graph);
      expect(graph.props().layout).toBe('myLayout');
    });

    it('passes through physics', () => {
      const wrapper = shallow(
        <GraphContainer fetchData={mockCall} physics={'myPhysics'} />
      );
      const graph = wrapper.find(Graph);
      expect(graph.props().physics).toBe('myPhysics');
    });
  });

  describe('with default API', () => {
    afterEach(nock.cleanAll);

    it('handles a 401', () => {
      const scope = nock('http://localhost')
        .get(/visjs/)
        .reply(401, '<html></html>');
      expect(mount(<GraphContainer startingUris={[]} />).text()).toMatch(
        'Enable Physics'
      );
      expect(scope.isDone()).toBe(true);
    });
  });
});
