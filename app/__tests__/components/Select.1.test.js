import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import Select from '../../src/components/Select.1';

describe('<Select.1 />>', () => {
    let options = [
        {title: 'value01', value: 'value01'},
        {title: 'value02', value: 'value02'},
        {title: 'value03', value: 'value03'}
    ];
    let className="select-primary";
    let value = 'value02';

    it('render', () => {
        const cmp = shallow(<Select />);
        let select = cmp.find('select');
        expect(select.hasClass('select')).toBeTruthy();
        expect(select.prop('value')).toBe('');
        let opts = cmp.find('option');
        expect(opts.length).toBe(0);
    });

    it('render with className="select-primary"', () => {
        const cmp = shallow(<Select className={className} options={options} value={value}/>);
        let select = cmp.find('select');
        expect(select.hasClass('select select-primary')).toBeTruthy();
        expect(select.props().value).toBe(value);

        let opts = cmp.find('option');
        expect(opts.length).toBe(options.length);
    });

    it('render with titleField="title" valueField="value"', () => {
        let titleField = 'title';
        let valueField = 'value';

        const cmp = shallow(<Select titleField="title" valueField="value" options={options} value="value03"/>);
        let opts = cmp.find('option');
        expect(opts.at(0).prop('value')).toBe(options[0].value);
        expect(opts.at(0).text()).toBe(options[0].title);
    });

    it('onChange', () => {
        let onChange = jest.fn();
        const cmp = shallow(<Select onChange={onChange}/>);

        cmp.find('select').simulate('change');
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('snapshot', () => {
        const cmp = renderer.create(<Select className={className} titleField="title" valueField='value' options={options} value={value} />);
        let tree = cmp.toJSON();
        expect(tree).toMatchSnapshot();
    })

})