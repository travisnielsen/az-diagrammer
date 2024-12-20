import SelectSearch from 'react-select-search';
import fuzzySearch from '../utility/searchUtils';
import { Form } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useState } from 'react';
import { filterOnSelectedNode } from '../store/diagramSlice';
import '../search.css'

const SearchBar = () => {

  const dispatch = useAppDispatch()
  const [value, setValue] = useState('');

  const updateValue = (selectedValue: string) => {
    setValue('');
    dispatch(filterOnSelectedNode(selectedValue))
  }

  const renderedListItems = (props, option, _snapshot, className) => {
    return (
      <button {...props} className={className} type="button" >
        <span>
          <img src={option.icon} alt="" height="28" width="28" className='select-search-listicon' />
        </span>
        <span>{option.name}</span>
      </button>
    )
  }

  const searchData = useAppSelector((state) => {
    return state.searchdata.value
  })

  return (
      <Form className="d-flex" >
        <SelectSearch
        value={value}
        options={searchData}
        onChange={(selectedValue) => updateValue(selectedValue as string)}
        search
        filterOptions={[fuzzySearch]}
        renderOption={renderedListItems}
        placeholder="Search"
        autoComplete='on'
        className="select-search" onBlur={function (): void {
          throw new Error('Function not implemented.');
        } } onFocus={function (): void {
          throw new Error('Function not implemented.');
        } }      
      >
        </SelectSearch>
      </Form>
  )

}

export default SearchBar;