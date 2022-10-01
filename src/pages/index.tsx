import type { NextPage } from 'next'
import SingIn from '../components/authentication/SingIn'
import ChatHome from '../components/home'
import PageContainer from '../components/layouts/PageContainer'
import { useAppSelector } from '../app/hooks'
import { selectCurrentUser } from '../app/slices/auth/authSlice'
import { useRouter } from 'next/router'
import { useEffect } from 'react'


const Home: NextPage = () => {
const router=useRouter()
const user=useAppSelector(selectCurrentUser)


  return (
      <PageContainer>
       <ChatHome></ChatHome>
      </PageContainer>
  )
}

export default Home