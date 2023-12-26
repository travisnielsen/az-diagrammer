import SelectSearch from 'react-select-search';
import fuzzySearch from '../utility/searchUtils';
import { Form, Navbar } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../hooks';
import '../App.css';
import'../searchstyle.css';
import { useState } from 'react';
import { filterOnSelectedNode } from '../store/diagramSlice';

const SearchBar = () => {

  const dispatch = useAppDispatch()
  const [value, setValue] = useState('');

  const updateValue = (selectedValue: string) => {
    setValue('');
    dispatch(filterOnSelectedNode(selectedValue))
  }

  const searchData = useAppSelector((state) => {
    return state.searchdata.value
  })

    return (
      <Navbar.Collapse className="justify-content-end">
        <Form className="d-flex">
          <SelectSearch
            value={value}
            options={searchData}
            onChange={(selectedValue) => updateValue(selectedValue as string)}
            search
            filterOptions={[fuzzySearch]}
            placeholder="Search"
            autoComplete='on'

            className="select-search" >
          </SelectSearch>
        </Form>

      </Navbar.Collapse>
    )

}

export default SearchBar;