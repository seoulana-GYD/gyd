import { FC } from 'react'
import { BankComponent } from '../../components/Bank'
import { SendTransaction } from '../../components/SendTransaction'
import { SendVersionedTransaction } from '../../components/SendVersionedTransaction'
import ImageResult from 'components/image-result'

export const GachartView: FC = ({}) => {
  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">
          NFT Gacha
        </h1>
        {/* CONTENT GOES HERE */}
        <div className="text-center">
          <BankComponent />
        </div>
        <ImageResult />
      </div>
    </div>
  )
}
