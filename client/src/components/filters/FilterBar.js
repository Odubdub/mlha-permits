// material
import { styled } from '@mui/material/styles'
import {
  Toolbar,
  Box
} from '@mui/material';
import DropDownMenu from './DropDownMenu'

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3)
}))

export default function FilterBar({ onFilterChanged, filters: selectedFilters, filterData = []}) {

  return (
    <RootStyle>
      <Box display='flex' flexDirection='row'>
        {
          filterData.map((options)=>(
            <DropDownMenu key={options.title} data={options} selectedFilters={selectedFilters} onSelected={(data)=>onFilterChanged(data)}/>
          ))
        }
      </Box>
    </RootStyle>
  )
}
