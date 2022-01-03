import type { Palette } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import Cell from '@mui/material/TableCell';
import SortLabel from '@mui/material/TableSortLabel';
import visuallyHidden from '@mui/utils/visuallyHidden';
import I18n from 'lazy-i18n';
import type { ReactElement } from 'react';
import type Props from '../../types/mui-head-cell-props';
import useMuiTableHeadCell from './mui-head-cell.hook';

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const mapPaletteToBackgroundColor = ({ mode, primary }: Palette): string => {
  if (mode === 'dark') {
    return primary.dark;
  }
  return primary.light;
};

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const StyledCell = styled(Cell)(({ theme }) => ({
  root: {
    backgroundColor: mapPaletteToBackgroundColor(theme.palette),
    color: theme.palette.common.white,

    '& .Mui-active, & .Mui-active svg': {
      color: theme.palette.common.white,
    },

    '& .MuiTableSortLabel-root:hover, & .MuiTableSortLabel-root:hover svg': {
      color: theme.palette.common.white,
    },
  },
}));

export default function MuiTableHeadCell({
  active,
  align,
  ascending,
  header,
  onSort,
}: Props): ReactElement {
  const { direction, handleSortLabelClick, sortDirection } =
    useMuiTableHeadCell({
      active,
      ascending,
      onSort,
    });

  return (
    <StyledCell align={align} sortDirection={sortDirection}>
      <SortLabel
        active={active}
        direction={direction}
        onClick={handleSortLabelClick}
      >
        {header}
        {active && (
          <span style={visuallyHidden}>
            {direction === 'asc' ? (
              <I18n>sorted ascending</I18n>
            ) : (
              <I18n>sorted descending</I18n>
            )}
          </span>
        )}
      </SortLabel>
    </StyledCell>
  );
}