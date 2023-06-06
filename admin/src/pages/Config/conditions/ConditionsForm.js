import React, { useEffect, useState } from 'react';
import { FormControl, Box, TextField } from '@mui/material';
import Iconify from 'src/components/Iconify';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import MDEditor from '@uiw/react-md-editor';
import { getServiceId } from '../registry/registry';
import rehypeSanitize from 'rehype-sanitize';
import { set } from 'date-fns';

export default function ConditionsForm({ service }) {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [markdown, setMarkdown] = useState('');
  const [SRConditions, setSRConditions] = useState({ show: false, title: '', caption: '' });
  const [hasMdChanges, setHasMdChanges] = useState(false);

  // const url = 'http://localhost:3005/'
  const url = 'https://onegov-serviceregistry.gov.bw/';

  const updateConditions = () => {
    const show = markdown.length > 0 || title.length > 0;
    setIsLoading(true);
    const ep = `${url}services/config/conditions/${getServiceId(service.code)}`;
    axios
      .patch(ep, {
        conditions: {
          show: show,
          title: title,
          caption: markdown
        }
      })
      .then((response) => {
        setSRConditions({ show: show, title: title, caption: markdown });
        setIsLoading(false);
        console.log(response.data);
      })
      .catch((err) => {
        console.log('Error getting: ', err.message);
      });
  };

  console.log(markdown);

  const disableConditions = () => {
    const ep = `${url}services/config/conditions/${getServiceId(service.code)}`;
    axios
      .patch(ep, {
        conditions: {
          show: false,
          title: title,
          caption: markdown
        }
      })
      .then((response) => {
        console.log(response.data);
        setSRConditions({ show: false, title: '', caption: '' });
      })
      .catch((err) => {
        console.log('Error getting: ', err.message);
      });
  };

  const getConditions = () => {
    const ep = `${url}services/single/${getServiceId(service.code)}`;
    axios
      .get(ep)
      .then((response) => {
        setSRConditions(
          (response.data || {}).conditions || { show: false, title: '', caption: '' } || ''
        );
        setTitle(((response.data || {}).conditions || {}).title || '');
        setMarkdown(((response.data || {}).conditions || {}).caption || '');
        setHasMdChanges(false);
      })
      .catch((err) => {
        console.log('Error getting: ', err.message);
      });
  };

  const setMd = (md) => {
    setHasMdChanges(true);
    setMarkdown(md);
  };

  useEffect(() => {
    if (![undefined, null].includes(service)) {
      getConditions();
    }
  }, [service]);

  const editor = document.getElementsByClassName('w-md-editor')[0];

  if (editor) {
    editor.style.borderRadius = '10px';
    editor.style.overflow = 'hidden';
    editor.style.minHeight = '500px';
  }

  const changed = () => {
    const fullscreen = document.getElementsByClassName('w-md-editor-fullscreen')[0];
    if (fullscreen) {
      var coords = getPos(document.getElementById('configContatiner'));
      fullscreen.style.left = coords.x + 'px';
    } else {
      const mini = document.getElementsByClassName('w-md-editor')[0];
      mini.style.left = '0px';
    }
  };

  function getPos(el) {
    var rect = el.getBoundingClientRect();
    return { x: rect.left, y: rect.top };
  }

  return (
    <Box display="flex" alignItems="center" justifyContent="center" height="100%">
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            borderRadius: 2,
            width: '100%',
            ml: 0,
            mr: 1,
            paddingBottom: 3,
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column'
          }}
        >
          <FormControl fullWidth>
            <TextField
              id="outlined-basic"
              disabled={isLoading}
              onChange={(e) => setTitle(e.target.value)}
              value={title || ''}
              name="title"
              label="Title"
              sx={{ mt: 1, mx: 3, fontWeight: 'medium' }}
              variant="outlined"
            />
            <Box sx={{ borderRadius: 2, ml: 3, mr: 3, my: 1 }}>
              <MDEditor
                onTransitionEnd={() => changed()}
                previewOptions={{
                  rehypePlugins: [[rehypeSanitize]]
                }}
                value={markdown}
                onChange={setMd}
              />
            </Box>
            {
              <Box display="flex" flexDirection="row" justifyContent="end" width="100%" pr={2}>
                {SRConditions.show && (
                  <LoadingButton
                    variant="contained"
                    onClick={() => disableConditions()}
                    loading={isLoading}
                    loadingPosition="start"
                    centerRipple
                    endIcon={<Iconify icon="bxs:hide" />}
                    sx={{
                      marginTop: 2,
                      marginRight: 1,
                      alignSelf: 'end',
                      bgcolor: '#FF0000',
                      justifySelf: 'end'
                    }}
                  >
                    Disable Conditions
                  </LoadingButton>
                )}
                {(hasMdChanges || title != SRConditions.title) &&
                  title.length > 0 &&
                  markdown.length > 0 && (
                    <LoadingButton
                      variant="contained"
                      onClick={() => updateConditions()}
                      loading={isLoading}
                      loadingPosition="start"
                      centerRipple
                      endIcon={<Iconify icon="charm:arrow-right" />}
                      sx={{ marginTop: 2, marginRight: 1, alignSelf: 'end', justifySelf: 'end' }}
                    >
                      Set Conditions
                    </LoadingButton>
                  )}
              </Box>
            }
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
}
