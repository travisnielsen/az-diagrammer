import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { Form } from 'react-bootstrap';

const MultiSelectDropdown = () => {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('Select options');

  const options = [
    { id: 1, label: 'Option 1' },
    { id: 2, label: 'Option 2' },
    { id: 3, label: 'Option 3' },
    { id: 4, label: 'Option 4' },
    { id: 5, label: 'Option 5' }
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionChange = (event: { target: { value: string; checked }; }) => {
    const optionId = parseInt(event.target.value);
    const isChecked = event.target.checked;

    if (isChecked) {
      setSelectedOptions([...selectedOptions, optionId]);
      setSelectedLabel(event.target.value)
    } else {
      setSelectedOptions(selectedOptions.filter((id) => id !== optionId));
    }
  };

  return (
    <div className={`dropdown ${isOpen ? 'show' : ''}`}>
      <Button
        size="sm"
        style={{width:"100%"}}
        className="btn btn-secondary dropdown-toggle"
        type="button"
        id="multiSelectDropdown"
        onClick={toggleDropdown}
      >
        {selectedLabel ? selectedLabel : 'Select options'}
      </Button>
      <div style={{width:"100%"}} className={`dropdown-menu ${isOpen ? 'show' : ''}`} aria-labelledby="multiSelectDropdown">
        {options.map((option) => (
          <Form.Check
          style={{marginLeft:"10%"}}
            key={option.id}
            type="checkbox"
            id={`option_${option.id}`}
            label={option.label}
            checked={selectedOptions.includes(option.id)}
            onChange={handleOptionChange}
            value={option.id}
          />
        ))}
      </div>
    </div>
  );
};

export default MultiSelectDropdown;