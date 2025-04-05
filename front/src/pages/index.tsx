import type { NextPage } from 'next'
import Head from 'next/head'
import { HomeView } from '../views'

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>GachArt</title>
        <meta name="description" content="GachArt" />
      </Head>
      <HomeView />
    </div>
  )
}

export default Home
