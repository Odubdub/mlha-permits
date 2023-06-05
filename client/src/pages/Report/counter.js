export const countApplicationsByStatus = (data) => {
  const result = [
    {
      name: 'Revoked',
      data: []
    },
    {
      name: 'Issued',
      data: []
    },
    {
      name: 'Returned',
      data: []
    },
    {
      name: 'Rejected',
      data: []
    }
  ];

  for (let i = 0; i < data[0].rejected.length; i++) {
    result[3].data.push(data.reduce((total, type) => total + type.rejected[i].count, 0));
  }

  for (let i = 0; i < data[0].issued.length; i++) {
    result[1].data.push(data.reduce((total, type) => total + type.issued[i].count, 0));
  }

  for (let i = 0; i < data[0].revoked.length; i++) {
    result[0].data.push(data.reduce((total, type) => total + type.revoked[i].count, 0));
  }

  for (let i = 0; i < data[0].returned.length; i++) {
    result[2].data.push(data.reduce((total, type) => total + type.returned[i].count, 0));
  }

  return result;
};
