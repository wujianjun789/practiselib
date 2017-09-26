import React from 'react';
import {shallow} from 'enzyme';
import renderer from 'react-test-renderer';
import TableTr from '../../../src/smartLightList/components/TableTr';

describe('', ()=> {
	const columns = [
		{accessor: 'name', title: '设备名称'},
		{accessor(data){return data.value*10}, title: 'value*10'}
	];
	const data = {id: 0, name: 'test', value: 10};

	it('default render', () => {
		const cmp = shallow(<TableTr data={data} columns={columns}/>);
		const tr = cmp.find('tr');
		expect(!tr.hasClass('active')).toBeTruthy();
		const td = tr.find('td');
		expect(td.length).toBe(columns.length);
		columns.forEach((item, index) => {
			expect(td.at(index).text()).toBe(typeof item.accessor === 'function'?''+item.accessor(data):''+data[item.accessor]);
		})
	});

	it('render with activeId', () => {
		const cmp = shallow(<TableTr data={data} columns={columns} activeId={data.id}/>);
		expect(cmp.find('tr').hasClass('active')).toBeTruthy();
	});

	it('simulate click', () => {
		const fn = jest.fn();
		const cmp = shallow(<TableTr data={data} columns={columns} activeId={data.id} rowClick={fn} />);
		cmp.simulate('click', data);
		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith(data);
	});

	it('default render snapshot', () => {
		const cmp = renderer.create(<TableTr data={data} columns={columns}/>);
		expect(cmp.toJSON()).toMatchSnapshot();
	});

	it('render with activeId snapshot', () => {
		const cmp = renderer.create(<TableTr data={data} columns={columns} activeId={data.id}/>);
		expect(cmp.toJSON()).toMatchSnapshot();
	});

	it('simulate click snapshot', () => {
		const fn = jest.fn();
		const cmp = renderer.create(<TableTr data={data} columns={columns} activeId={data.id} rowClick={fn} />);
		expect(cmp.toJSON()).toMatchSnapshot();
	});
});
