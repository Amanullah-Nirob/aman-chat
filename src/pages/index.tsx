import type { NextPage } from 'next'
import SingIn from '../components/authentication/SingIn'
import ChatHome from '../components/home/ChatHome'
import PageContainer from '../components/layouts/PageContainer'



const Home: NextPage = () => {

  return (
      <PageContainer>
       <ChatHome></ChatHome>
      </PageContainer>
  )
}

export default Home