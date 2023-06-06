import { PermitRegState } from "src/helper";

export const exportsFilterOptions = [

    {
      title: 'Tariff Code',
      filter: 'tariffCode',
      width:  90,
      default: null,
      options: [
      { raw: 'all', value: 'All', label: 'All' },
      { raw: 7204, value: '7204', label: '7204' },
      { raw: 7404, value: '7404', label: '7404' },
      { raw: 7503, value: '7503', label: '7503' },
      { raw: 7602, value: '7602', label: '7602' },
      { raw: 7902, value: '7902', label: '7902' },
      { raw: 8002, value: '8002', label: '8002' },
      { raw: 8101, value: '8101', label: '8101' },
      { raw: 8102, value: '8102', label: '8102' },
      { raw: 8103, value: '8103', label: '8103' },
      { raw: 8104, value: '8104', label: '8104' }
    ]}
  ]