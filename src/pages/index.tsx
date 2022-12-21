import type { NextPage } from 'next'
import ChatHome from '../components/home'
import PageContainer from '../components/layouts/PageContainer'


const Home: NextPage = () => {
  return (
    <>
      <PageContainer>
       <ChatHome></ChatHome>
      </PageContainer>
    </>
  )
}

export default Home