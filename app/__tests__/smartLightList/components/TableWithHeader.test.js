import React from 'react';
import {shallow} from 'enzyme';
import renderer from 'react-test-renderer';
import TableWithHeader from '../../../src/smartLightList/components/TableWithHeader';
import TableTr from '../../../src/smartLightList/components/TableTr';

describe('<TableWithHeader />', () => {
	const columns = [
		{accessor: 'name', title: '设备名称'},
		{accessor(data){return data.value*10}, title: 'value*10'}
	];
	const dataList = [
		{ id: 0, name: 'test', value: 10},
		{ id: 1, name: 'test', value: 10}
	];

	it('default render', () => {
		const cmp = shallow(<TableWithHeader columns={columns}/>);
		const th = cmp.find('thead').find('th');
		expect(th.length).toBe(2);
		columns.forEach((item, index) => {
			expect(th.at(index).text()).toBe(item.title);
		});
	});

	it('render with className="test"', () => {
		const cmp = shallow(<TableWithHeader columns={columns} className="test"/>);
		expect(cmp.find('.table-responsive').hasClass('test')).toBeTruthy();
	});

	it('render with children', () => {
		const cmp = shallow(<TableWithHeader columns={columns}>
			{
				dataList.map(item => {
					return <TableTr key={item.id} data={item} columns={columns}/>
				})
			}
			</TableWithHeader>);

		const tr = cmp.find('TableTr');
		expect(tr.length).toBe(dataList.length);
		dataList.forEach((item, index) => {
			expect(tr.at(index).key()).toEqual(''+item.id);
			expect(tr.at(index).prop('data')).toEqual(item);
			expect(tr.at(index).prop('columns')).toEqual(columns);
		});
	});

	it('default render snapshot', () => {
		const cmp = renderer.create(<TableWithHeader columns={columns}/>);
		const tree = cmp.toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('render with className="test" snapshot', () => {
		const cmp = renderer.create(<TableWithHeader columns={columns} className="test"/>);
		const tree = cmp.toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('render with children snapshot', () => {
		const cmp = renderer.create(<TableWithHeader columns={columns}>
			{
				dataList.map(item => {
					return <TableTr key={item.id} data={item} columns={columns}/>
				})
			}
			</TableWithHeader>);
		const tree = cmp.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
