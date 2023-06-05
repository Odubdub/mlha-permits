import { LoadingButton } from '@mui/lab';
import { Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ConfirmApproveModal } from './ConfirmApproveModal';
import DropDownMenu from './DropDownMenu';
import Iconify from './bundle/Iconify';

export const Approval = ({ fieldData, setFieldData }) => {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [data, setData] = useState({});
  const requiredLevels = 3;
  const options = [
    { raw: 'approve', value: 'approve', label: 'Approve', icon: 'charm:tick' },
    { raw: 'reject', value: 'reject', label: 'Reject', icon: 'ion:close' },
    { raw: 'defer', value: 'defer', label: 'Defer to', icon: 'fluent:skip-forward-tab-20-filled' }
  ];

  useEffect(() => {
    if (selectedStatus) {
      setShowConfirmation(true);
    } else {
      setShowConfirmation(false);
    }
  }, [selectedStatus]);

  useEffect(() => {
    if (showConfirmation == false) {
      setData({});
    }
  }, [showConfirmation]);

  return (
    <Stack direction={'row'}>
      <ConfirmApproveModal
        key={showConfirmation}
        open={showConfirmation}
        action={(selectedStatus || {}).rawValue}
        data={data}
        onClose={() => setShowConfirmation(false)}
        setData={setData}
      />
      <DropDownMenu
        key={showConfirmation ? 1 : 2}
        disabled={false}
        options={options}
        selectedStatus={selectedStatus}
        icon={'eva:arrow-ios-downward-outline'}
        title={'Change Status'}
        startIcon="mdi:approve"
        endIcon="ic:round-navigate-next"
        onSelected={(data) => setSelectedStatus(data)}
      />
    </Stack>
  );
};
