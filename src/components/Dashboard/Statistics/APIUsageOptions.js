import React from 'react';
import Select from 'react-select'
import styled from 'styled-components';

const options = [
  { value: 1, label: 'This Month' },
  { value: 2, label: 'This Year' },
  { value: 3, label: 'All Period' },
]

export default function StatisticsOptions({ setSetting }) {
  function onChange(e) {
    setSetting(e.value)
  }

  return <OptionsWrapper>
    <Title>총 API 사용량</Title>
    <SelectWrapper>
      <Select
        options={options}
        defaultValue={options[0]}
        onChange={onChange} />
    </SelectWrapper>
  </OptionsWrapper>
}

const OptionsWrapper = styled.div`
  padding: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
`

const Title = styled.p`
  margin: 0;
  display: inline-block;
  font-weight: bold;
  width: calc(100% - 156px);
`

const SelectWrapper = styled.div`
  width: 156px;
  display: inline-block;
`