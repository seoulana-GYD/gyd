import type { NextPage } from 'next'
import Head from 'next/head'
import { GachartView } from '../views'

const Basics: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>GachArt</title>
        <meta name="description" content="Basic Functionality" />
      </Head>
      <GachartView />
    </div>
  )
}

export default Basics
