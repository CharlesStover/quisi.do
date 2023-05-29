import type TableRowsPerPageOption from '../../../../../types/table-rows-per-page-option';
import type RowsPerPageOption from '../types/rows-per-page-option';

export default function mapRowsPerPageOptionToMuiRowsPerPageOption({
  label,
  value,
}: TableRowsPerPageOption): RowsPerPageOption {
  return {
    label: label ?? value.toString(),
    value,
  };
}
