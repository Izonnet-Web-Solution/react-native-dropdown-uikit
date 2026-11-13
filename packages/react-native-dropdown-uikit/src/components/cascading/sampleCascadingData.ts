import { CascadingItem } from '../../types/item';

export const SAMPLE_CASCADING_DATA: CascadingItem<string>[] = [
  {
    label: 'United States',
    value: 'US',
    children: [
      {
        label: 'California',
        value: 'CA',
        children: [
          { label: 'Los Angeles', value: 'LA' },
          { label: 'San Francisco', value: 'SF' },
          { label: 'San Diego', value: 'SD' },
          { label: 'San Jose', value: 'SJ' },
        ],
      },
      {
        label: 'New York',
        value: 'NY',
        children: [
          { label: 'New York City', value: 'NYC' },
          { label: 'Buffalo', value: 'BUF' },
          { label: 'Albany', value: 'ALB' },
        ],
      },
      {
        label: 'Texas',
        value: 'TX',
        children: [
          { label: 'Austin', value: 'ATX' },
          { label: 'Houston', value: 'HOU' },
          { label: 'Dallas', value: 'DAL' },
        ],
      },
    ],
  },
  {
    label: 'India',
    value: 'IN',
    children: [
      {
        label: 'Maharashtra',
        value: 'MH',
        children: [
          { label: 'Mumbai', value: 'BOM' },
          { label: 'Pune', value: 'PNQ' },
          { label: 'Nagpur', value: 'NAG' },
        ],
      },
      {
        label: 'Karnataka',
        value: 'KA',
        children: [
          { label: 'Bengaluru', value: 'BLR' },
          { label: 'Mysuru', value: 'MYQ' },
          { label: 'Mangalore', value: 'IXE' },
        ],
      },
      {
        label: 'Gujarat',
        value: 'GJ',
        children: [
          { label: 'Ahmedabad', value: 'AMD' },
          { label: 'Surat', value: 'ST' },
          { label: 'Vadodara', value: 'BDQ' },
        ],
      },
    ],
  },
  {
    label: 'United Kingdom',
    value: 'UK',
    children: [
      {
        label: 'England',
        value: 'ENG',
        children: [
          { label: 'London', value: 'LDN' },
          { label: 'Manchester', value: 'MAN' },
          { label: 'Birmingham', value: 'BHX' },
        ],
      },
      {
        label: 'Scotland',
        value: 'SCT',
        children: [
          { label: 'Edinburgh', value: 'EDI' },
          { label: 'Glasgow', value: 'GLA' },
        ],
      },
    ],
  },
];

