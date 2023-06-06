import PropTypes from 'prop-types';
// material
import { TableRow, TableCell, TableHead, TableSortLabel } from '@mui/material';
import Iconify from './Iconify';
import { asc, desc } from 'src/pages/Registrations/Registrations';
// ----------------------------------------------------------------------

const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)'
};

TableHeader.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']),
  orderBy: PropTypes.object,
  rowCount: PropTypes.number,
  headLabel: PropTypes.array,
  numSelected: PropTypes.number,
  onRequestSort: PropTypes.func,
  onSelectAllClick: PropTypes.func
};

export default function TableHeader({ order, orderBy, setOrderBy, headLabel, onRequestSort }) {
  const sort = (property) => {
    if (property != 'name') {
      if (orderBy.property == property) {
        setOrderBy({
          ...orderBy,
          order: orderBy.order == desc ? asc : desc
        });
        onRequestSort(property, orderBy.order == desc ? asc : desc);
      } else {
        setOrderBy({
          ...orderBy,
          property
        });
        onRequestSort(property, desc);
      }
    }
  };

  return (
    <TableHead>
      <TableRow>
        {headLabel.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align}>
            <TableSortLabel
              hideSortIcon
              sx={{
                color: 'text.secondary',
                opacity: headCell.property == 'name' ? 0.9 : 1,
                cursor: headCell.property == 'name' ? 'default' : 'pointer'
              }}
              onClick={() => sort(headCell.property)}
            >
              {headCell.label}
              {/* {orderBy.property} */}
              {orderBy.property == headCell.property && (
                <Iconify
                  sx={{
                    ml: 1,
                    rotate: orderBy.order == desc ? '0deg' : '180deg',
                    transition: 'all ease 0.3s'
                  }}
                  icon={'ph:arrow-up-duotone'}
                />
              )}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
