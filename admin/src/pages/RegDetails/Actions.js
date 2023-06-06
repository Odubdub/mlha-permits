import { Card, CardHeader, Typography, Box, Divider, Stack, Tooltip } from '@mui/material';
import React from 'react';
import Iconify from 'src/components/Iconify';
import { hasPassedReviewStages } from './ActionBarHelper';
import ActionCell from './Approve/ActionCell';

function Actions({ data, applicationHalted, onReload, permissions }) {
  const peformedActions = data.activity;
  const requiredActions = data.reviewProcess.steps;
  const performedActionsTypes = peformedActions.map((a) => a.type);
  const requiredPerformedActions = requiredActions.filter((a) =>
    performedActionsTypes.includes(a.type)
  );
  const notPerformedActions = requiredActions.filter(
    (a) => !performedActionsTypes.includes(a.type)
  );

  const hasFinishedReview = hasPassedReviewStages(data);

  //Get required unperformed actions that dont haze positive feedback
  const reviewStatus = data.reviewStatus;

  const checkIfPerformedIsPositive = (type, value) => {
    const performed = requiredActions.filter((a) => a.type == type);
    if (performed.length > 0) {
      return performed[0].feedback.positive.verb == value;
    } else {
      return false;
    }
  };

  //Order
  let step = 0;

  return (
    <Card sx={{ pb: 2, mt: 2 }}>
      <CardHeader
        title={'Activity'}
        sx={{ mb: 2 }}
        subheader={
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body">Recent Actions</Typography>
            {data.reviewStatus.reviewer && (
              <Tooltip title="Currently Reviewing">
                <Typography variant="body">
                  <Iconify sx={{ fontSize: 14, mr: 1 }} icon="simple-icons:codereview" />
                  {data.reviewStatus.reviewer.name}
                </Typography>
              </Tooltip>
            )}
          </Stack>
        }
      />
      {peformedActions.map((action) => {
        const rawAction = requiredActions[peformedActions.indexOf(action)];
        const index = peformedActions.indexOf(action) + 1;
        step += 1;

        const isReturnedStep = reviewStatus.stage == peformedActions.indexOf(action);

        const hasReturnedStep = peformedActions.length > reviewStatus.stage;
        console.log(hasReturnedStep);
        const canReturn = !hasFinishedReview && !hasReturnedStep;

        return (
          <ActionCell
            key={index}
            permissions={permissions}
            applicationHalted={applicationHalted}
            canReturn={canReturn}
            isReturnedStep={isReturnedStep}
            isLast={index == requiredPerformedActions.length}
            index={index}
            isActiveStep={true}
            peformedActions={peformedActions}
            isPositive={checkIfPerformedIsPositive(action.type, action.title)}
            action={{ ...rawAction, ...action }}
            name={action.title}
            id={data._id}
            data={data}
            onReload={onReload}
          />
        );
      })}
      {notPerformedActions.length == 0 ? (
        <>
          <Divider />
          <Typography variant="body2" sx={{ textAlign: 'center', mt: 1 }}>
            All required actions have been performed
          </Typography>
        </>
      ) : (
        <>
          <Box sx={{ pb: 3, mt: 2, mb: 2 }}>
            <Typography ml={2} variant="h6">
              Required Actions
            </Typography>
            <Divider />
            {notPerformedActions.map((action) => {
              step += 1;
              const isActiveStep =
                (reviewStatus.stage == 0 && action.stage == 1) ||
                (reviewStatus.stage + 1 == action.stage && reviewStatus.checked);
              return (
                <ActionCell
                  permissions={permissions}
                  applicationHalted={applicationHalted}
                  key={step}
                  index={step}
                  peformedActions={peformedActions}
                  isActiveStep={isActiveStep}
                  isPositive={null}
                  action={action}
                  name={action.name}
                  id={data._id}
                  data={data}
                  onReload={onReload}
                />
              );
            })}
          </Box>
        </>
      )}
    </Card>
  );
}

export default Actions;
