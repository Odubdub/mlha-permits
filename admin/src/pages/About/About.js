// material
import { Typography, Stack } from '@mui/material';
import MDEditor from '@uiw/react-md-editor';
import { useEffect, useState } from 'react';
import Page from '../../components/Page';
import markdown from './about.md';
export default function About() {
  useEffect(() => {
    fetch();
  }, []);

  const fetch = () => {};

  return (
    <Page title="About | MLHA Services">
      <Stack width="100%" alignItems="center" justifyContent="center">
        <Stack width="100%" alignItems="center" paddingX={4}>
          <Typography variant="h4">Central Pemit Management System</Typography>
          <MDEditor.Markdown source={markdown} style={{ whiteSpace: 'pre-wrap' }} />
          <Typography variant="caption" sx={{ textAlign: 'center', mt: 2, mx: 4 }} fontSize={14}>
            The government of Botswana as part of Maitlamo saw it fit to move all government
            services online. Through this initiative, timely customer delivery and paperless
            applications and efficient management of applications and information will be attained.{' '}
            <span style={{ fontWeight: 'bold' }}>'DevSQL Pty Ltd'</span> was contracted through a
            hackathon challenge to develop a solution that will integrate open source technologies
            to create a management system that will meet the needs of the Botswana Trade Commission
            and the Ministry of Local Government and Rural Development.{' '}
          </Typography>
          <Typography variant="caption" sx={{ textAlign: 'center', mt: 2, mx: 4 }} fontSize={14}>
            The MLHA Service management system was fully developed in Botswana by batswana youth for
            Government officers. The developers{' '}
            <span style={{ fontWeight: 'bold' }}>'DevSQL Pty Ltd'</span> developed this system to be
            hightly available and scalable to meet the growing demand of Batswana in applying for
            government services which issue permits. The system strictly uses open-source
            technologies only making it easier to manage and maintain.
          </Typography>
        </Stack>
      </Stack>
    </Page>
  );
}
