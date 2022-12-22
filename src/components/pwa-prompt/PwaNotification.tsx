import { Container } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Slide from '@mui/material/Slide'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { forwardRef, ReactNode } from 'react'
import { useAppSelector } from '../../app/hooks'
import { selectTheme } from '../../app/slices/theme/ThemeSlice'

const PWANotification = forwardRef<
  HTMLDivElement,
  {
    onCancel: () => void
    onOk: () => void
    okText: string
    title: string
    show: boolean
    children: ReactNode
  }
>(function PwaNotification(
  { show, okText, children, onCancel, onOk, title },
  ref
) {
  const theme=useAppSelector(selectTheme)
  const matchesMobile = useMediaQuery('(max-width:600px)');
  return (
    <Slide direction="up" in={show} mountOnEnter unmountOnExit>
      <Box
        ref={ref}
        sx={{
          backgroundColor: theme==='light'?'#fafafa':'#222222',
          color:  theme==='light'?'#000':'#fff',
          borderTop:theme==='light'?'1px solid #ddd':'1px solid #484848'
        }}
        className='installBanner_main'
      >
      <Container>
        <div className="notification_content_box" 
        style={{
          backgroundColor:!matchesMobile?theme==='light'?'#fff':'rgb(26 26 26)':'none',
          border:theme==='light'?'1px solid #ddd':'1px solid rgb(62 62 62)'
        }}>
        <Box className="notification_box">
        {title ? (
            <Typography
              component="h2"
              sx={{
                fontWeight: 'bold',
                margin: 0,
                fontSize: '20px'
              }}
            >
              {title}
            </Typography>
          ) : null}
          {children}
        </Box>
        <Box className="notification_actions">
        <Button
            sx={{ mr: 1 }}
            onClick={onOk}
            variant="contained"
          >
            {okText}
          </Button>
        <Button
            sx={{ mr: 1 }}
            onClick={onCancel}
            variant="outlined"
            disableElevation
          >
            later
          </Button>
        </Box>
        </div>
        </Container>
      </Box>
    </Slide>
  )
})

export { PWANotification }
